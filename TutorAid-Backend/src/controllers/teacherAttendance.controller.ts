import { Request, Response } from "express";
import { teacherAttendance } from "../data/teacherAttendance.data";

export function getTeacherAttendance(
    _req: Request,
    res: Response
) {
    res.json({
        success: true,
        data: teacherAttendance,
    });
}

export function markAttendance(
    req: Request,
    res: Response
) {
    const { id, present } = req.body;

    const student = teacherAttendance.find(
        s => s.id === id
    );

    if (student) {
        student.present = present;
    }

    res.json({
        success: true,
        message: "Attendance Updated",
    });
}