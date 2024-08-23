import { Request, Response } from "express";
import prisma from "../db/client";
import bcrypt from 'bcrypt'

export const getAllUsers = async(req: Request, res: Response) => {
    try{
        const allUsers = await prisma.user.findMany({
            include: {
                workouts: {
                    include: {
                        exercises: true,
                    }
                },
                reports: true
            }
        })
        res.status(200).send({
            msg: "All users",
            data: allUsers
        })
    } catch (error){
        res.status(400).send(error)
    }
}

export const createUser = async(req: Request, res:Response) => {
    const {name, email, password, weight, height} = req.body

    if( !email || !password){
        return res
            .status(400)
            .send({message: "The fields email and password are required"})
    }

    try{
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await prisma.user.create({
            data: {name, email, password: hashedPassword, height, weight}
        })
        res.status(201).send({
            msg: "User created successfully",
        })
    } catch (error){
        res.status(400).send(error)
    }
}

export const updateUser = async(req: Request, res:Response) => {
    const { name, email, password, height, weight} = req.body
    const userId = parseInt(req.params.userId)

    if(!email || !password){
        return res
            .status(400)
            .send({message: "The fields email and password are required"})
    }

    try{
        const userUpdated = await prisma.user.update({
            where: {id: userId},
            data: {name, email, password, weight, height}
        })
        res.status(201).send({
            msg: "User updated successfully"
        })
    } catch(error){
        res.status(400).send(error)
    }
}

export const deleteUser = async(req: Request, res:Response) => {
    const userId= parseInt(req.params.userId)

    if(!userId){
        return res.status(400).send({
            message: "The field userId is required"
        })
    }

    try{
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                workouts: {
                    include:{
                        exercises:true
                    }
                },
                reports: true
            }
        })
        if (!user){
            return res.status(404).send({
                message: "User not found"
            })
        }

        const exercisesOnWorkoutToDelete = user.workouts.flatMap((workout)=>
            workout.exercises.map((exercise) => ({
                workoutName: workout.name,
                exerciseName: exercise.exerciseName
            }))
        )

        await prisma.exerciseOnWorkout.deleteMany({
            where: {
                OR: exercisesOnWorkoutToDelete
            }
        })

        await prisma.report.deleteMany({
            where: {
                userId: user.id
            }
        })

        const deletedWorkouts = await prisma.workout.deleteMany({
            where: {
                userId: userId
            }
        })

        const deletedUser = await prisma.user.delete({
            where: {
                id: userId
            }
        })

        res.status(200).send({
            message: "User deleted successfully"
        })
    } catch (error){
        res.status(400).send(error)
    }
}