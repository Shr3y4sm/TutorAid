/**
 * End-to-end integration test suite for the TutorAid REST API.
 *
 * Replicates the exact mobile-app flows against a locally-running backend
 * (PORT/SUPABASE_* from .env) and the real Supabase project:
 *   1. Creates throwaway teacher + student via the real /auth endpoints
 *   2. Exercises schedule CRUD, cancellation auto-notify, notifications,
 *      dashboard, meetings, class notes, attendance, resources
 *   3. Asserts the expected outcomes (PASS/FAIL)
 *   4. Cleans up every row + auth user created
 *
 * Usage (requires a running backend on the port in .env):
 *   node scripts/e2e-test.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { WebSocket } from "ws";
globalThis.WebSocket = WebSocket;
import dotenv from "dotenv";
dotenv.config();

const API = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
const suffix = Date.now().toString(36);
const TEACHER_EMAIL = `e2e-teacher-${suffix}@tutoraid.test`;
const STUDENT_EMAIL = `e2e-student-${suffix}@tutoraid.test`;
const PASS = "TestPass123!";

const admin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

let teacherAuthId, studentAuthId, teacherId, studentId, teacherCode;
let teacherToken, studentToken;
const created = { schedules: [], notes: [], folders: [], notifications: [] };
const results = [];

function report(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `\n        => ${detail}` : ""}`);
}

async function http(method, path, token, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try { json = await res.json(); } catch { /* empty */ }
  return { status: res.status, json };
}

// ---------------------------------------------------------------------------
// 0. Health
// ---------------------------------------------------------------------------
try {
  const { status, json } = await http("GET", "/health");
  report("health (backend reachable)", status === 200 && json?.success === true, `status=${status}`);
} catch (e) {
  report("health (backend reachable)", false, e.message);
  console.log("\nCannot reach backend — start it: cd TutorAid-Backend && npm run build && npm start");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 1. Auth — create confirmed users + register profiles (real app flow)
// ---------------------------------------------------------------------------
try {
  const t = await admin.auth.admin.createUser({ email: TEACHER_EMAIL, password: PASS, email_confirm: true });
  teacherAuthId = t.data.user.id;
  const login = await admin.auth.signInWithPassword({ email: TEACHER_EMAIL, password: PASS });
  teacherToken = login.data.session.access_token;
  const reg = await http("POST", "/auth/teacher", null, {
    auth_user_id: teacherAuthId,
    full_name: "E2E Test Teacher",
    email: TEACHER_EMAIL,
    phone: "0000000000",
    subjects: "Testing",
    designation: "Tester",
    organization: "TutorAid E2E",
    experience: "2",
  });
  teacherId = reg.json?.data?.id;
  teacherCode = reg.json?.data?.teacher_code;
  report("teacher signup + profile", reg.status === 201 && teacherId, `status=${reg.status}`);
} catch (e) {
  report("teacher signup + profile", false, e.message);
}

try {
  const s = await admin.auth.admin.createUser({ email: STUDENT_EMAIL, password: PASS, email_confirm: true });
  studentAuthId = s.data.user.id;
  const login = await admin.auth.signInWithPassword({ email: STUDENT_EMAIL, password: PASS });
  studentToken = login.data.session.access_token;
  const reg = await http("POST", "/auth/student", null, {
    auth_user_id: studentAuthId,
    full_name: "E2E Test Student",
    email: STUDENT_EMAIL,
    phone: "0000000000",
    class: "Test Class",
    parent_name: "Test Parent",
    parent_phone: "0000000000",
    teacher_code: teacherCode,
  });
  studentId = reg.json?.data?.id;
  report("student signup + profile + teacher link", reg.status === 201 && studentId, `status=${reg.status}`);
} catch (e) {
  report("student signup + profile + teacher link", false, e.message);
}
// ---------------------------------------------------------------------------
// 2. Dashboard (teacher)
// ---------------------------------------------------------------------------
if (teacherToken) {
  const { status, json } = await http("GET", "/teacher/dashboard", teacherToken);
  const hasQuick = Array.isArray(json?.data?.quickActions) && json.data.quickActions.length >= 7;
  report("dashboard (teacher)", status === 200 && hasQuick, `stats=${JSON.stringify(json?.data?.stats ?? {})}`);
}

// ---------------------------------------------------------------------------
// 3. Teacher students list
// ---------------------------------------------------------------------------
if (teacherToken && teacherId) {
  const { status, json } = await http("GET", `/teacher/students?teacherId=${teacherId}`, teacherToken);
  // API returns flat student objects (each row mapped to row.student).
  const found = (json?.data ?? []).some((r) => r?.id === studentId);
  report("teacher students contains E2E student", status === 200 && found, `count=${(json?.data ?? []).length} shape=${JSON.stringify((json?.data ?? [])[0] ?? {})}`.slice(0, 200));
}

// ---------------------------------------------------------------------------
// 4. Schedule CRUD + cancellation auto-notify (P1 feature)
// ---------------------------------------------------------------------------
let scheduleId;
if (teacherToken && teacherId) {
  const create = await http("POST", "/teacher/schedule", teacherToken, {
    teacher_id: teacherId,
    subject: "E2E Physics",
    section: "A",
    room: "101",
    start_time: "10:00",
    end_time: "11:00",
    day: "Monday",
  });
  scheduleId = create.json?.data?.id;
  created.schedules.push(scheduleId);
  report("schedule create", create.status === 201 && scheduleId, `status=${create.status}`);

  const list = await http("GET", `/teacher/schedule?teacherId=${teacherId}`, teacherToken);
  const listed = (list.json?.data ?? []).some((r) => r.id === scheduleId);
  report("schedule list contains it", list.status === 200 && listed, `count=${(list.json?.data ?? []).length}`);

  await new Promise((r) => setTimeout(r, 300));
  const del = await http("DELETE", `/teacher/schedule/${scheduleId}`, teacherToken);
  report("schedule delete", del.status === 200, `status=${del.status}`);
}

// ---------------------------------------------------------------------------
// 5. Notifications (student) — scheduled + cancelled
// ---------------------------------------------------------------------------
if (studentToken && studentId) {
  await new Promise((r) => setTimeout(r, 600));
  const { status, json } = await http("GET", `/notifications?studentId=${studentId}`, studentToken);
  const titles = (json?.data ?? []).map((n) => n.title);
  const sawCancelled = titles.some((t) => t === "Class Cancelled");
  const sawScheduled = titles.some((t) => t === "New Class Scheduled");
  report("notification 'New Class Scheduled'", status === 200 && sawScheduled, `titles=${titles.join(" | ")}`);
  report("cancellation auto-notify arrived", status === 200 && sawCancelled, `titles=${titles.join(" | ")}`);
}

// ---------------------------------------------------------------------------
// 6. Class notes (P1 feature) — expects class_notes table
// ---------------------------------------------------------------------------
if (teacherToken && teacherId) {
  const create = await http("POST", "/class-notes", teacherToken, {
    teacher_id: teacherId,
    meet_code: "TA-E2ETEST",
    body: "Samy is struggling with integrals — revisit next class.",
  });
  if (create.status === 201) created.notes.push(create.json?.data?.id);
  if (create.status === 201) {
    const list = await http("GET", "/class-notes/meeting/TA-E2ETEST", teacherToken);
    const found = (list.json?.data ?? []).some((n) => n.body.includes("integrals"));
    report("class-notes create+list roundtrip", found, `notes=${(list.json?.data ?? []).length}`);
    if (create.json?.data?.id) await http("DELETE", `/class-notes/${create.json.data.id}`, teacherToken);
  } else {
    report("class-notes create+list roundtrip", false, `status=${create.status} msg=${create.json?.message ?? ""}`);
  }
}
// ---------------------------------------------------------------------------
// 7. Meetings — start/join/live/history (expects meeting_sessions table)
// ---------------------------------------------------------------------------
if (teacherToken && teacherId) {
  const start = await http("POST", "/meetings/start", teacherToken, { teacher_id: teacherId, subject: "E2E Live" });
  const code = start.json?.data?.meet_code;
  if (code) {
    const hist = await http("GET", `/meetings/teacher/${teacherId}`, teacherToken);
    report("meetings teacher history", hist.status === 200, `count=${(hist.json?.data ?? []).length}`);
  } else {
    report("meetings start", false, `status=${start.status} msg=${start.json?.message ?? ""}`);
  }
}

if (studentToken && studentId) {
  const live = await http("GET", `/meetings/student/${studentId}`, studentToken);
  report("meetings student live", live.status === 200, live.json?.message ?? `status=${live.status}`);
  const hist = await http("GET", `/meetings/student/${studentId}/history`, studentToken);
  report("meetings student history", hist.status === 200, hist.json?.message ?? `status=${hist.status}`);
}

// ---------------------------------------------------------------------------
// 8. Attendance manual mark (expects class_date column; real route POST /)
// ---------------------------------------------------------------------------
if (teacherToken && teacherId && studentId) {
  const mark = await http("POST", "/teacher/attendance", teacherToken, {
    id: studentId,
    present: true,
    marked_by: teacherId,
  });
  report("attendance mark (class_date)", mark.status === 200 || mark.status === 201, `status=${mark.status} msg=${mark.json?.message ?? ""}`);
}

// ---------------------------------------------------------------------------
// 9. Resources — folder create (teacher)
// ---------------------------------------------------------------------------
if (teacherToken && teacherId) {
  const folder = await http("POST", "/resources/folders", teacherToken, { name: "E2E Test Folder" });
  if (folder.status === 201 || folder.status === 200) created.folders.push(folder.json?.data?.id);
  report("resources folder create", folder.status === 201, `status=${folder.status} msg=${folder.json?.message ?? ""}`);
}

// ---------------------------------------------------------------------------
// 10. Cleanup — remove everything created (rows + auth users)
// ---------------------------------------------------------------------------
async function del(table, col, val) {
  try { await admin.from(table).delete().eq(col, val); } catch { /* table missing */ }
}

async function cleanup() {
  if (teacherId) {
    await del("teacher_students", "teacher_id", teacherId);
    await del("schedule", "teacher_id", teacherId);
    await del("meeting_sessions", "teacher_id", teacherId);
    await del("class_notes", "teacher_id", teacherId);
    await del("attendance", "marked_by", teacherId);
    await del("resources", "teacher_id", teacherId);
    await del("resource_folders", "teacher_id", teacherId);
    await del("notifications", "teacher_id", teacherId);
    await del("teachers", "id", teacherId);
    await del("user_roles", "auth_user_id", teacherAuthId);
  }
  if (studentId) {
    await del("teacher_students", "student_id", studentId);
    await del("attendance", "student_id", studentId);
    await del("notifications", "student_id", studentId);
    await del("students", "id", studentId);
    await del("user_roles", "auth_user_id", studentAuthId);
  }
  if (teacherAuthId) { try { await admin.auth.admin.deleteUser(teacherAuthId); } catch {} }
  if (studentAuthId) { try { await admin.auth.admin.deleteUser(studentAuthId); } catch {} }
  console.log(`cleanup done (teacher=${Boolean(teacherAuthId)} student=${Boolean(studentAuthId)})`);
}

await cleanup();

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
const pass = results.filter((r) => r.ok).length;
const fail = results.filter((r) => !r.ok).length;
console.log("\n===================== E2E SUMMARY =====================");
console.log(`  ${pass} passed · ${fail} failed · ${results.length} total`);
results.filter((r) => !r.ok).forEach((r) => console.log(`  x ${r.name}: ${r.detail}`));
console.log("=======================================================");
process.exit(fail > 0 ? 1 : 0);