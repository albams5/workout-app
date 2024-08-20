import {Router} from "express"
import {createExercise, deleteExercise, getAllExercises, updateExercise} from "../controllers/exercise.controllers"

const exerciseRoutes: Router = Router()

exerciseRoutes.get("/", getAllExercises)
exerciseRoutes.post("/", createExercise)
exerciseRoutes.patch("/:userId", updateExercise)
exerciseRoutes.delete("/:userId", deleteExercise)

export default exerciseRoutes;