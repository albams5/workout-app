import { Request, Response } from "express";
import prisma from "../db/client";

export const getAllReports = async(req: Request, res: Response) => {
    try{
        const allReports = await prisma.report.findMany({
            include: {
                workout: true
            }
        })
        res.status(201).send({
            msg: "All reports",
            data: allReports
        })
    } catch (error){
        res.status(400).send(error)
    }
}

export const createReport = async(req: Request, res:Response) => {
    const {name, workoutName, content } = req.body
    const userId = parseInt(req.params.userId)

    if(!name || !workoutName || !content){
        return res.status(400).send({
            message: "The fields name, workout and content are required"
        })
    }

    if(!userId){
        return res.status(400).send({
            message: "The field userId is required"
        })
    }

    try{
        const newReport = await prisma.$transaction(async (prisma) => {
            const report = await prisma.report.create({
                data: {
                    name,
                    workoutName,
                    content,
                    userId
                }
            })

            return prisma.report.findUnique({
                where: {
                    id: report.id
                },
                include: {
                    workout: true
                }
            })
        })
        res.status(201).send({
            msg: "Report created successfully",
            data: newReport
        })
    } catch (error){
        res.status(400).send(error)
    }
}

export const updateReport = async(req: Request, res:Response) => {
    const {name, workoutName, content } = req.body
    const reportId = parseInt(req.params.reportId)

    if(!reportId){
        return res.status(400).send({
            message: "The field reportId is required"
        })
    }

    try{
        const report = await prisma.report.findUnique({
            where: {
                id: reportId
            },
            include: {
                workout: true
            }
        })

        if(!report){
            return res.status(404).send({
                message: "Report not found"
            })
        }

        const updatedReport = await prisma.$transaction(async(prisma) => {
            const updatedReport = await prisma.report.update({
                where: {
                    id: reportId
                },
                data: {
                    name,
                    workoutName,
                    content
                }
            })
            return prisma.report.findUnique({
                where: {
                    id: report.id
                },
                include: {
                    workout:true
                }
            })
        })
        res.status(200).send({
            message: "Report updated successfully",
            data: updatedReport
        })
    }catch(error){
        res.status(400).send(error)
    }
}

export const deleteReport = async(req: Request, res:Response) => {
    const reportId = parseInt(req.params.reportId)

    if(!reportId){
        return res.status(400).send({
            message: "The field reportId is required"
        })
    }
    try{
        const report = await prisma.report.findUnique({
            where: {
                id: reportId
            },
            include: {
                workout: true
            }
        })
        if(!report){
            return res.status(404).send({
                message: "Report not found"
            })
        }

        const deletedReport = await prisma.$transaction(async(prisma) => {
            const deletedReport = await prisma.report.delete({
                where: {
                    id: reportId
                },
                include: {
                    workout:true
                }
            })
        })
        res.status(200).send({
            message: "Report deleted successfully"
        })

    }catch(error){
        res.status(400).send(error)
    }
}