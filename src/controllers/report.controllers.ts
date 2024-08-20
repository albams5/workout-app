import { Request, Response } from "express";
import prisma from "../db/client";

export const getAllReports = async(req: Request, res: Response) => {
    console.log("get all report")
}

export const createReport = async(req: Request, res:Response) => {
    console.log("create report")
}

export const updateReport = async(req: Request, res:Response) => {
    console.log("update report")
}

export const deleteReport = async(req: Request, res:Response) => {
    console.log("delete report")
}