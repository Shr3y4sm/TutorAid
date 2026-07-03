import { Request, Response } from "express";
import { notificationsData } from "../data/notification.data";

export function getNotifications(
  _req: Request,
  res: Response
) {
  res.status(200).json({
    success: true,
    data: notificationsData,
  });
}