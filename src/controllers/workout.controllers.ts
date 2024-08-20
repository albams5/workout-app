import { Request, Response } from "express";
import prisma from "../db/client";

export const getAllWorkouts = async(req: Request, res: Response) => {
    console.log("get all workouts")
}

export const createWorkout = async(req: Request, res:Response) => {
    console.log("create workout")
}

export const updateWorkout = async(req: Request, res:Response) => {
    console.log("update workout")
}

export const deleteWorkout = async(req: Request, res:Response) => {
    console.log("delete workout")
}