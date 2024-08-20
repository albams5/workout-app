import { Request, Response } from "express";
import prisma from "../db/client";

export const getAllCategories = async(req: Request, res: Response) => {
    console.log("get all categories")
}

export const createCategory = async(req: Request, res:Response) => {
    console.log("create category")
}

export const updateCategory = async(req: Request, res:Response) => {
    console.log("update category")
}

export const deleteCategory = async(req: Request, res:Response) => {
    console.log("delete category")
}