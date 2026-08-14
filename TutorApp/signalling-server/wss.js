const WebSocket = require('ws');

/**
 * WebSocket signalling server for WebRTC room management.
 *
 * Responsibilities:
 *  - Track participants per room (classname)
 *  - Relay SDP offers / answers / ICE candidates between peers
 *  - Broadcast screen-share and hand-raise state
 *  - Relay chat messages (targeted or broadcast)
 *
 * The server is stateless beyond in-memory room state. If the process restarts,
 * all rooms are lost and clients must re-join.
 */

// In-memory room registry: { [classname]: { users, screenSharer, raisedHands, iceBroker } }
const classes = {};

/**
 * Send a typed JSON message to a single socket.
 * @param {WebSocket} wsClient
 * @param {string} type
 * @param {object} body
 */
const send = (wsClient, type, body) => {
  if (!wsClient || wsClient.readyState !== WebSocket.OPEN) return;
  wsClient.send(JSON.stringify({ type, body }));
};

/**
 * Broadcast the current screen-share state to every participant in a room.
 */
const emitScreenShareState = (classname) => {
  const classroom = classes[classname];
  if (!classroom) return;

  const screenSharer = classroom.screenSharer || null;
  const payload = {
    active: Boolean(screenSharer),
    username: screenSharer,
  };

  Object.keys(classroom.users || {}).forEach((user) => {
    const socket = classroom.users[user];
    if (socket) {
      send(socket, 'screen_share_state', payload);
    }
  });
};

/**
 * Broadcast the current raised-hand list to every participant in a room.
 */
const emitHandRaiseState = (classname) => {
  const classroom = classes[classname];
  if (!classroom) return;

  const raisedHands = classroom.raisedHands || [];
  const payload = { raisedHands };

  Object.keys(classroom.users || {}).forEach((user) => {
    const socket = classroom.users[user];
    if (socket) {
      send(socket, 'hand_raise_state', payload);
    }
  });
};

/**
 * Safely parse a JSON message, returning null on failure.
 */
const safeParse = (message) => {
  try {
    return JSON.parse(message);
  } catch (err) {
    console.error('Failed to parse WebSocket message:', err.message);
    return null;
  }
};

/**
 * Handle an incoming message from a client.
 *
 * Protocol messages:
 *  - join                  -> body: { classname, username }
 *  - quit                  -> body: { classname, username }
 *  - request_screen_share  -> body: { classname, username, enable }
 *  - request_hand_raise    -> body: { classname, username, raised }
 *  - send_offer            -> body: { classname, username, target, sdp }
 *  - send_answer           -> body: { classname, username, target, sdp }
 *  - send_ice_candidate    -> body: { classname, username, target, candidate }
 *  - send_chat_message     -> body: { classname, username, target?, message }
 */
const onMessage = (ws, socket, message) => {
  const parsedMessage = safeParse(message);
  if (!parsedMessage) return;

  const { type, body } = parsedMessage;
  if (!type || !body) return;

  const { classname, username } = body;

  if (!classname || !username) {
    send(socket, 'error', { message: 'Missing classname or username' });
    return;
  }

  switch (type) {
    case 'join': {
      if (!classes[classname]) {
        classes[classname] = {
          users: {},
          screenSharer: null,
          raisedHands: [],
        };
      }
      const classroom = classes[classname];

      // If this username already had a socket, remove the old entry first.
      if (classroom.users[username]) {
        delete classroom.users[username];
      }

      const existingUsers = Object.keys(classroom.users);
      classroom.users[username] = socket;

      // Notify the joining client of who is already in the room.
      send(socket, 'joined', existingUsers);

      // Send the current room state to the newcomer.
      send(socket, 'screen_share_state', {
        active: Boolean(classroom.screenSharer),
        username: classroom.screenSharer || null,
      });
      send(socket, 'hand_raise_state', {
        raisedHands: classroom.raisedHands || [],
      });

      // Tell existing participants that a new user has arrived.
      existingUsers.forEach((user) => {
        const existingSocket = classroom.users[user];
        if (existingSocket && existingSocket !== socket) {
          send(existingSocket, 'user_joined', { username });
        }
      });

      console.log(`[${classname}] "${username}" joined. Total: ${Object.keys(classroom.users).length}`);
      break;
    }

    case 'quit': {
      if (classes[classname] && classes[classname].users?.[username]) {
        const classroom = classes[classname];

        Object.keys(classroom.users).forEach((user) => {
          if (user !== username) {
            const existingSocket = classroom.users[user];
            if (existingSocket) {
              send(existingSocket, 'peer_left', { username });
            }
          }
        });

        if (classroom.screenSharer === username) {
          classroom.screenSharer = null;
          emitScreenShareState(classname);
        }

        if (classroom.raisedHands?.includes(username)) {
          classroom.raisedHands = classroom.raisedHands.filter((u) => u !== username);
          emitHandRaiseState(classname);
        }

        delete classroom.users[username];
        if (!Object.keys(classroom.users).length) {
          delete classes[classname];
          console.log(`[${classname}] Room is now empty, removed.`);
        } else {
          console.log(`[${classname}] "${username}" left. Remaining: ${Object.keys(classroom.users).length}`);
        }
      }
      break;
    }

    case 'request_screen_share': {
      const { enable = false } = body;
      const classroom = classes[classname];
      if (!classroom || !username || typeof username !== 'string') break;

      if (enable) {
        if (classroom.screenSharer && classroom.screenSharer !== username) {
          send(socket, 'screen_share_denied', {
            active: true,
            username: classroom.screenSharer,
            reason: 'Another participant is already sharing the screen',
          });
          break;
        }

        classroom.screenSharer = username;
        emitScreenShareState(classname);
        console.log(`[${classname}] "${username}" started screen sharing.`);
      } else {
        if (classroom.screenSharer === username) {
          classroom.screenSharer = null;
          emitScreenShareState(classname);
          console.log(`[${classname}] "${username}" stopped screen sharing.`);
        }
      }

      break;
    }

    case 'request_hand_raise': {
      const { raised = false } = body;
      const classroom = classes[classname];
      if (!classroom || !username || typeof username !== 'string') break;

      if (!classroom.raisedHands) {
        classroom.raisedHands = [];
      }

      if (raised) {
        if (!classroom.raisedHands.includes(username)) {
          classroom.raisedHands.push(username);
          emitHandRaiseState(classname);
        }
      } else {
        if (classroom.raisedHands.includes(username)) {
          classroom.raisedHands = classroom.raisedHands.filter((u) => u !== username);
          emitHandRaiseState(classname);
        }
      }

      break;
    }

    case 'send_offer': {
      const { sdp, username: sender, target } = body;
      const targetSocket = classes[classname]?.users?.[target];
      if (targetSocket) {
        send(targetSocket, 'offer_sdp_received', { sender, sdp });
      } else {
        send(socket, 'error', { message: `Target "${target}" not found in room` });
      }
      break;
    }

    case 'send_answer': {
      const { sdp, username: sender, target } = body;
      const targetSocket = classes[classname]?.users?.[target];
      if (targetSocket) {
        send(targetSocket, 'answer_sdp_received', { sender, sdp });
      } else {
        send(socket, 'error', { message: `Target "${target}" not found in room` });
      }
      break;
    }

    case 'send_ice_candidate': {
      const { candidate, username: sender, target } = body;
      const targetSocket = classes[classname]?.users?.[target];
      if (targetSocket) {
        send(targetSocket, 'ice_candidate_received', { sender, candidate });
      } else {
        send(socket, 'error', { message: `Target "${target}" not found in room` });
      }
      break;
    }

    case 'send_chat_message': {
      const { message, username: sender, target } = body;
      if (typeof message !== 'string' || typeof sender !== 'string') break;
      const classroom = classes[classname];
      if (!classroom) break;

      if (target && typeof target === 'string') {
        // Direct message
        const targetSocket = classroom.users?.[target];
        if (targetSocket) {
          send(targetSocket, 'chat_message_received', { sender, message });
        } else {
          send(socket, 'error', { message: `Chat target "${target}" not found in room` });
        }
      } else {
        // Broadcast to everyone else
        Object.keys(classroom.users || {}).forEach((user) => {
          if (user !== sender) {
            const wsClient = classroom.users[user];
            if (wsClient) {
              send(wsClient, 'chat_message_received', { sender, message });
            }
          }
        });
      }
      break;
    }

    case 'ping': {
      send(socket, 'pong', { ts: Date.now() });
      break;
    }

    default: {
      send(socket, 'error', { message: `Unknown message type: ${type}` });
    }
  }
};

/**
 * Handle a socket disconnecting — clean up across all rooms.
 */
const onClose = (ws, socket, message) => {
  console.log('Connection closed', message);
  Object.keys(classes).forEach((cname) => {
    const classroom = classes[cname];
    if (!classroom?.users) return;

    Object.keys(classroom.users || {}).forEach((uid) => {
      if (classroom.users[uid] === socket) {
        Object.keys(classroom.users).forEach((user) => {
          if (user !== uid) {
            const wsClient = classroom.users[user];
            if (wsClient) {
              send(wsClient, 'peer_left', { username: uid });
            }
          }
        });

        if (classroom.screenSharer === uid) {
          classroom.screenSharer = null;
          emitScreenShareState(cname);
        }

        if (classroom.raisedHands?.includes(uid)) {
          classroom.raisedHands = classroom.raisedHands.filter((u) => u !== uid);
          emitHandRaiseState(cname);
        }

        delete classroom.users[uid];
        console.log(`[${cname}] "${uid}" disconnected.`);
      }
    });

    if (!Object.keys(classroom.users).length) {
      delete classes[cname];
      console.log(`[${cname}] Room is now empty, removed.`);
    }
  });
};

/**
 * Initialise and return the WebSocket server.
 *
 * @param {object} options
 * @param {number}  options.port      - TCP port to listen on
 * @param {string}  [options.path]     - URL path (e.g. "/ws")
 * @param {string}  [options.key]      - TLS private key (PEM) for WSS
 * @param {string}  [options.cert]     - TLS certificate (PEM) for WSS
 * @param {string[]} [options.origins] - CORS origin allow-list
 * @returns {{ server: WebSocket.Server, getStats: () => object }}
 */
const init = (options = {}) => {
  const { port, path, key, cert, origins } = options;

  const serverOptions = { port };
  if (path) serverOptions.path = path;
  if (key && cert) serverOptions.key = key;
  if (cert && cert) serverOptions.cert = cert;

  const wss = new WebSocket.Server(serverOptions);

  // Verify the server object was created (port may be in use)
  wss.on('error', (err) => {
    console.error('WebSocket server error:', err.message);
  });

  // Optional CORS / origin checking
  const originAllowList = Array.isArray(origins) ? origins : null;

  if (originAllowList) {
    const previousHandle = wss.handleUpgrade;
    // eslint-disable-next-line no-underscore-dangle
    wss.handleUpgrade = function handleUpgrade(request, socket, head, onInstall) {
      const origin = request.headers.origin;
      if (originAllowList.includes(origin)) {
        previousHandle.call(this, request, socket, head, onInstall);
      } else {
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
        socket.destroy();
      }
    };
  }

  wss.on('connection', (socket) => {
    console.log('A client has been connected');

    socket.isAlive = true;
    socket.on('pong', () => {
      socket.isAlive = true;
    });

    socket.on('error', (err) => {
      console.error('Socket error:', err.message);
    });

    socket.on('message', (message) => onMessage(wss, socket, message));
    socket.on('close', () => onClose(wss, socket));
  });

  // Ping/pong keep-alive to detect dead connections
  const interval = setInterval(() => {
    wss.clients.forEach((socket) => {
      if ((socket.isAlive === false) || (socket.isAlive === undefined)) {
        socket.terminate();
        return;
      }
      socket.isAlive = false;
      socket.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  const getStats = () => ({
    rooms: Object.keys(classes).length,
    totalUsers: Object.values(classes).reduce(
      (sum, room) => sum + Object.keys(room.users || {}).length,
      0
    ),
    connectedClients: wss.clients.size,
  });

  console.log('WebSocket server listening on port', port, path ? `at path "${path}"` : '');
  return { server: wss, getStats };
};

module.exports = { init, send };
