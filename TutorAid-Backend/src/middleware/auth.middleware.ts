import { Request, Response, NextFunction } from "express";
import supabase from "../config/supabase";
import { ApiError } from "../utils/ApiError";

/**
 * Gate for write operations: only authenticated teachers may pass.
 * Students are allowed read-only access to the repository.
 */
export function requireTeacher(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (!req.user || req.user.role !== "teacher") {
    return next(
      new ApiError(
        403,
        "Only teachers can perform this action."
      )
    );
  }

  next();
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      throw new ApiError(
        401,
        "Authorization header missing."
      );
    }

    const token = header.replace(
      "Bearer ",
      ""
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new ApiError(
        401,
        "Invalid access token."
      );
    }

    let role:
      | "teacher"
      | "student"
      | "admin" = "student";

    const { data: teacher } =
      await supabase
        .from("teachers")
        .select("id")
        .eq(
          "auth_user_id",
          user.id
        )
        .maybeSingle();

    if (teacher) {
      role = "teacher";
    } else {

      const { data: admin } =
        await supabase
          .from("admins")
          .select("id")
          .eq(
            "auth_user_id",
            user.id
          )
          .maybeSingle();

      if (admin) {
        role = "admin";
      }
    }

    req.user = {
      id: user.id,
      email: user.email!,
      role,
    };

    next();

  } catch (err) {
    next(err);
  }
}