import { AppDataSource } from "./_helpers/data-source";
import { Student } from "./entity/Student";
import Joi from "joi";
import bcrypt from "bcrypt";
import { Role } from "./_helpers/role";

import express, { Request, Response } from "express";
import { Student } from "./entity/Student";
const userRouter = express.Router();

userRouter.get("/users", async (req: Request, res: Response) => {
  try {
    const students = await AppDataSource.manager.find(Student);

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    return res.status(200).json({ message: "List of students", students });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const userID = Number(req.params.id);

    if (isNaN(userID)) {
      return res.status(400).json({ msg: "invalid user id" });
    }

    const user = await AppDataSource.manager.findOneBy(Student, {
      id: userID,
    });

    if (!user) {
      return res.status(404).json({ msg: `user id: ${userID} cant be found` });
    }

    return res.status(200).json({ msg: "User found", user });
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
});



//trangia
userRouter.post("/students", async (req: Request, res: Response) => {
  try {
    const { error, value } = createSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((x) => x.message) });
    }

    const { firstName, lastName, sex, grade, course, password } = value;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRepository = AppDataSource.getRepository(Student);
    const newUser = userRepository.create({
      firstName,
      lastName,
      sex,
      grade,
      course,
      hashedPassword,
    });
    
    await userRepository.save(newUser);

    res
      .status(201)
      .json({ message: "Student added sucessfully", student: newUser });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


//boss carl
userRouter.put("/user/:id", async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(Student);
    const userID = Number(req.params.id);

    if (isNaN(userID)) {
      return res.status(400).json({ msg: "Invalid user ID" });
    }

    const userToUpdate = await userRepository.findOneBy({ id: userID });

    if (!userToUpdate) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Validate input
    const { error, value } = updateSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((x) => x.message) });
    }

    const { firstName, lastName, title, email, role, password } = value;
    let hashedPassword;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Update only the provided fields
    Object.assign(userToUpdate, {
      firstName,
      lastName,
      title,
      role,
      email,
      ...(password ? { password: hashedPassword } : {}),
    });

    await userRepository.save(userToUpdate);

    return res
      .status(200)
      .json({ message: `User ${userID} updated successfully` });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.delete("/user/:id", async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(Student);
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await userRepository.remove(user);

    res.status(200).json({ message: "User has been removed" });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const createSchema = Joi.object({
  title: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid(Role.Admin, Role.User).required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

const updateSchema = Joi.object({
  title: Joi.string().empty(""),
  firstName: Joi.string().empty(""),
  lastName: Joi.string().empty(""),
  email: Joi.string().email().empty(""),
  role: Joi.string().valid(Role.Admin, Role.User).empty(""),
  password: Joi.string().min(6).empty(""),
  confirmPassword: Joi.string().valid(Joi.ref("password")).empty(""),
}).with("password", "confirmPassword");

export default userRouter;