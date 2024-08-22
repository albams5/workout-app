import { Request, Response } from "express";
import prisma from "../db/client";

export const getAllWorkouts = async(req: Request, res: Response) => {
    try{
        const allWorkouts = await prisma.workout.findMany({
            include: {
                exercises: true
            }
        })
        res.status(201).send({
            msg: "All workouts",
            data: allWorkouts
        })

    }catch(error){
        res.status(400).send(error)
    }
}

export const createWorkout = async(req: Request, res:Response) => {
    const {name, exercises, scheduledAt, comments, status} = req.body
    const userId = parseInt(req.params.userId)

    if(!name || !exercises || !status){
        return res.status(400).send({
            message: "The fields name, exercises and status are required"
        })
    }

    if(!userId){
        return res.status(400).send({
            message: "The field userId is required"
        })
    }

    try{
        const newWorkout = await prisma.$transaction(async(prisma) => {
            const workout = await prisma.workout.create({
                data: {
                    name,
                    scheduledAt,
                    comments,
                    status,
                    userId
                },
            })
            if(exercises.length){
                const createExercise = exercises.map((exerciseName: string, index: number) =>({
                    workoutName: workout.name,
                    exerciseName: exerciseName,
                    sequence: index+1
                }))
                await prisma.exerciseOnWorkout.createMany({
                    data: createExercise
                })
            }
            return prisma.workout.findUnique({
                where: {
                    name: workout.name
                },
                include: {
                    exercises: true
                }
            })
        })
        res.status(201).send({
            msg: "Workout created successfully",
            data: newWorkout
        })

    } catch(error){
        res.status(400).send(error)
    }
}

export const updateWorkout = async(req: Request, res:Response) => {
    const {name, exercises, scheduledAt, comments, status} = req.body
    const workoutName = req.params.workoutName

    if(!workoutName){
        return res.status(400).send({
            message: "The field workoutName is required"
        })
    }

    try{
        const workout= await prisma.workout.findUnique({
            where: {
                name: workoutName
            },
            include: {
                exercises: true
            }
        })

        if(!workout){
            return res.status(404).send({
                message: "Workout not found"
            })
        }


        const updatedWorkout = await prisma.$transaction(async (prisma)=> {
            const updatedWorkout = await prisma.workout.update({
                where: {
                    name: workoutName
                },
                data: {
                    name,
                    scheduledAt,
                    comments,
                    status
                }
            })

            if(exercises.length){
                await prisma.exerciseOnWorkout.deleteMany({
                    where:{
                        workoutName: workoutName
                    }
                })

                const createExercise = exercises.map((exerciseName: string, index: number) => ({
                    workoutName: name,
                    exerciseName: exerciseName,
                    sequence: index + 1
                }))
                await prisma.exerciseOnWorkout.createMany({
                    data: createExercise
                })
            }

            return prisma.workout.findUnique({
                where: {
                    name: name
                },
                include: {
                    exercises: true
                }
            })
        })

        res.status(200).send({
            message: "Workout updated successfully",
            data: updatedWorkout
        })

    }catch(error){
        res.status(400).send(error)
    }
}

export const deleteWorkout = async(req: Request, res:Response) => {
    const workoutName = req.params.workoutName
    if(!workoutName){
        return res.status(400).send({
            message: "The field workoutName is required"
        })
    }

    try{
        const workout = await prisma.workout.findUnique({
            where: {
                name: workoutName
            },
            include: {
                exercises: true
            }
        })

        if(!workout){
            return res.status(404).send({
                message: "Workout not found"
            })
        }

        const deletedMovie = await prisma.$transaction(async (prisma) => {
            await prisma.exerciseOnWorkout.deleteMany({
                where: {
                    workoutName: workoutName
                }
            })
            const deletedWorkout = await prisma.workout.delete({
                where: {
                    name: workoutName
                }
            })
            return prisma.workout.findUnique({
                where: {
                    name: workoutName
                },
                include: {
                    exercises:true
                }
            })
        })
        res.status(200).send({
            message: "Workout deleted successfully"
        })
    } catch(error){
        res.status(400).send(error)
    }
}