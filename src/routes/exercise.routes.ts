import {Router} from "express"
import {createExercise, deleteExercise, getAllExercises, updateExercise} from "../controllers/exercise.controllers"
import { verifyJWT } from '../middleware/authMiddleware'


const exerciseRoutes: Router = Router()

exerciseRoutes.get("/", 
    verifyJWT, 
    getAllExercises)
exerciseRoutes.post("/", createExercise)
exerciseRoutes.patch("/:exercise", updateExercise)
exerciseRoutes.delete("/:exercise", deleteExercise)

export default exerciseRoutes;