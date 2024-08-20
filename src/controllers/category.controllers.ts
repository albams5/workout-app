import { Request, Response } from "express";
import prisma from "../db/client";

export const getAllCategories = async(req: Request, res: Response) => {
    try{
        const allCategories = await prisma.category.findMany({
            include:{
                exercise: true
            }
        })
        res.status(200).send({
            msg: "All categories",
            data: allCategories
        })

    }catch(error){
        res.status(400).send(error)
    }
}

export const createCategory = async(req: Request, res:Response) => {
    const {name} = req.body
    if(!name){
        return res.status(400).send({message: "Category name is required"})
    }

    try{
        const newCategory = await prisma.category.create({
            data: {name}
        })
        res.status(201).send({
            msg: "Category created successfully",
            data: newCategory
        })

    } catch (error){
        res.status(400).send(error)
    }
}

export const updateCategory = async(req: Request, res:Response) => {
    const {name} = req.body
    console.log(name)
    const categoryName = req.params.categoryName
    console.log(categoryName)

    if(!name){
        return res.status(400).send({message: "Category name is required"})
    }

    try{
        const categoryUpdated = await prisma.category.update({
            where: {name: categoryName},
            data: {name}
        })
        console.log(categoryUpdated)
        res.status(201).send({
            msg: "Category updated successfully",
            data: categoryUpdated
        })
    } catch(error){
        res.status(400).send(error)
    }
}

export const deleteCategory = async(req: Request, res:Response) => {
    const categoryName = req.params.categoryName

    if(!categoryName){
        return res.status(400).send({
            message: "The field categoryName is required"
        })
    }

    try{
        const category = await prisma.category.findUnique({
            where: {
                name: categoryName
            }
        })
        if(!category){
            return res.status(404).send({
                message: "Category not found"
            })
        }

        const deletedCategoryInt = await prisma.$transaction(async(prisma)=>{
            await prisma.categoryOnExercise.deleteMany({
                where: {
                    categoryName: categoryName
                }
            })

            const deletedCategory = await prisma.category.delete({
                where: {
                    name: categoryName
                }
            })
        })
        res.status(200).send({
            message: "Category deleted successfully"
        })

    } catch(error){
        res.status(400).send(error)
    }
}