import { Request, Response } from "express";

import {
  createUserToken,
  createCall,
  getActiveCall,
  endCall,
} from "../services/stream.service";

export async function generateToken(
  req: Request,
  res: Response
) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId required",
      });
    }

    const token = await createUserToken(userId);

    return res.json({
      success: true,
      token,
      userId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
}

export function createInstantCall(
  _req: Request,
  res: Response
) {
  return res.json({
    success: true,
    ...createCall(),
  });
}

export function activeCall(
  _req: Request,
  res: Response
) {
  return res.json({
    success: true,
    callId: getActiveCall(),
  });
}

export function finishCall(
  _req: Request,
  res: Response
) {
  endCall();

  return res.json({
    success: true,
  });
}