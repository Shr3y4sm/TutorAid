import { Request, Response, NextFunction } from "express";
import supabase from "../config/supabase";
import { ApiError } from "../utils/ApiError";

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