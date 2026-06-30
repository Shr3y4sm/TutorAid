import { Request, Response } from "express";

import streamService from "../services/stream.service";

export async function generateToken(
  req: Request,
  res: Response
) {

  try {

    const { userId } = req.body;

    if (!userId) {

      return res.status(400).json({
        success:false,
        message:"userId required"
      });

    }

    const token =
      await streamService.generateToken(
        userId
      );

    return res.json({

      success:true,

      token,

      userId

    });

  }

  catch(error){

    return res.status(500).json({

      success:false,

      error

    });

  }

}