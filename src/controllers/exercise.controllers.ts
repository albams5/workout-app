import { Request, Response } from "express";
import prisma from "../db/client";

export const getAllExercises = async(req: Request, res: Response) => {
    try{
        const allExercises = await prisma.exercise.findMany({
            include: {
                category: true
            }
        })
        res.status(200).send({
            msg: "All exercises",
            data: allExercises
        })
    }catch(error){
        res.status(400).send(error)
    }
}

export const createExercise = async(req: Request, res:Response) => {
    let {name, description, category, sets, repetitions, weight} = req.body
    console.log(name)
    console.log(description)
    console.log(category)
    console.log(sets)
    console.log(repetitions)
    console.log(weight)

    try{
        const newExercise = await prisma.$transaction(async (prisma) =>{
            const exercise = await prisma.exercise.create({
                data: {
                    name,
                    description,
                    sets,
                    repetitions,
                    weight
                }
            })

            if(category.length){
                // const categoryArr = category.split(",").map(String)
                const createCategory = category.map((categoryName: string) => ({
                    exerciseName: exercise.name,
                    categoryName: categoryName
                }))
                await prisma.categoryOnExercise.createMany({
                    data:createCategory
                })
            }
            return prisma.exercise.findUnique({
                where: {
                    name: exercise.name
                },
                include: {
                    category: true
                }
            })
        })
        res.status(201).send({
            msg: "Exercise created successfully",
            data: newExercise
        })
    } catch (error){
        res.status(400).send(error)
    }

}

export const updateExercise = async(req: Request, res:Response) => {
    let {name, description, category, sets, repetitions, weight} = req.body
    const setsToNumber = parseInt(sets)
    sets = setsToNumber

    const exerciseName = req.params.exercise

    if(!exerciseName){
        return res.status(400).send({
            message: "The field exercise name is required"
        })
    }

    try{
        const exercise = await prisma.exercise.findUnique({
            where: {
                name: exerciseName
            },
            include: {
                category: true
            }
        })

        if(!exercise){
            return res.status(404).send({
                message: "Exercise not found"
            })
        }

        const updatedExercise = await prisma.$transaction(async (prisma) => {
            const updatedExercise = await prisma.exercise.update({
                where: {
                    name: exerciseName
                },
                data: {
                    name,
                    description,
                    sets,
                    repetitions,
                    weight
                }
            })
            if(category && category.length >0){
                const categoryArr = category.split(",").map(String)
                await prisma.categoryOnExercise.deleteMany({
                    where: {
                        exerciseName: exerciseName
                    }
                })

                const createCategory = categoryArr.map((categoryName: string) => ({
                    exerciseName: exercise.name,
                    categoryName: categoryName
                }))

                await prisma.categoryOnExercise.createMany({
                    data: createCategory
                })
            }
            return prisma.exercise.findUnique({
                where: {
                    name: exercise.name
                },
                include: {
                    category: true
                }
            })
        })
        res.status(200).send({
            message: "Exercise updated",
            data: updatedExercise
        })
    } catch(error){
        res.status(400).send(error)
    }
}

export const deleteExercise = async(req: Request, res:Response) => {
    const exerciseName = req.params.exercise

    if(!exerciseName) {
        return res.status(400).send({
            message: "The field exerciseName is required"
        })
    }

    try {
        const exercise = await prisma.exercise.findUnique({
            where: {
                name: exerciseName
            }, 
            include: {
                category: true
            }
        })

        if(!exercise){
            return res.status(404).send({
                message: "Exercise not found"
            })
        }

        const deletedExercise = await prisma.$transaction(async (prisma) => {
            await prisma.categoryOnExercise.deleteMany({
                where: {
                    exerciseName: exerciseName
                }
            })
            const deletedExercise = await prisma.exercise.delete({
                where: {
                    name: exerciseName
                }
            })
            return prisma.exercise.findUnique({
                where: {
                    name: exerciseName
                },
                include: {
                    category: true
                }
            })
        })
        
        res.status(200).send({
            message: "Exercise deleted successfully"
        })

    } catch(error){
        res.status(400).send(error)
    }
}