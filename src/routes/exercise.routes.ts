import {Router} from "express"
import {createExercise, deleteExercise, getAllExercises, updateExercise} from "../controllers/exercise.controllers"

const exerciseRoutes: Router = Router()

exerciseRoutes.get("/", getAllExercises)
exerciseRoutes.post("/", createExercise)
exerciseRoutes.patch("/:exercise", updateExercise)
exerciseRoutes.delete("/:exercise", deleteExercise)

export default exerciseRoutes;