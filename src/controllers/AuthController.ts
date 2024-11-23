import prisma from "../DB/db";
import { Request, Response } from "express";
import { registerUserSchema, loginUserSchema } from "../Validation/validate";
import { z } from "zod";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { AuthRequest } from "../Interfaces/AuthRequest";
import logger from "../config/logger";
import { sendEmail } from "../config/mailer";
import { emailSchema } from "../Validation/emailSchema";

const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerUserSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);
    validatedData.password = hashedPassword;
    const newUser = await prisma.user.create({
      data: validatedData,
    });

    const token = sign({ userId: newUser.id }, config.jwt_key, {
      expiresIn: "72h",
    });

    res.json({
      newUser: newUser,
      token: token,
    });
  } catch (error) {
    logger.error(error);
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((err) => err.message);
      return res.status(400).json({ messages });
    } else if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

const login = async function (req: Request, res: Response) {
  try {
    const validatedData = loginUserSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "User Not found, please register first" });
    }

    const validPassword = await bcrypt.compare(
      validatedData.password,
      existingUser.password
    );

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = sign({ userId: existingUser.id }, config.jwt_key, {
      expiresIn: "72h",
    });

    res.cookie("token", token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      sameSite: "lax",
    });

    res.json({
      message: `${existingUser.name} login succesfully`,
      token,
    });
  } catch (error) {
    logger.error(error);
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((err) => err.message);
      return res.status(400).json({ messages });
    } else if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", { path: "/" });

    const _req = req as unknown as AuthRequest;
    const userId = parseInt(_req.userId, 10);

    console.log("Parsed userId as number:", userId);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId, // Directly compare the id
      },
    });

    const name = user?.name;

    return res.json({ user: `${name} has logged out` });

    
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: "Error Logging out", error: error });
  }
};

const emailSender  = async(req: Request, res: Response)=>{
  try {
    const validatedData = emailSchema.parse(req.body);
    const {toMail , subject , body} = validatedData;
    await sendEmail(toMail, subject, body);

  
return res.status(200).json({ message: " Email sent successfully", 
  payload: {
    toMail,
    subject,
    body,
}});
  } 
  catch (error) {
    logger.error(error);
    if (error instanceof z.ZodError) {
      const messages = error.errors.map((err) => err.message);
      return res.status(400).json({ messages });
    } else if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error while sending an e-mail,please try again later " });
    }
  }
}

export { register, login, logout ,emailSender};
