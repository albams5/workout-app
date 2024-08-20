import { Request, Response } from "express";
import prisma from "../db/client";

export const getAllExercises = async(req: Request, res: Response) => {
    console.log("get all exercises")
}

export const createExercise = async(req: Request, res:Response) => {
    console.log("create exercise")
}

export const updateExercise = async(req: Request, res:Response) => {
    console.log("update exercise")
}

export const deleteExercise = async(req: Request, res:Response) => {
    console.log("delete exercise")
}