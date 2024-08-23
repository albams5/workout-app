import {Router} from "express"
import {createWorkout, deleteWorkout, getAllWorkouts, updateWorkout} from "../controllers/workout.controllers"
import { verifyJWT } from "../middleware/authMiddleware"

const workoutRoutes: Router = Router()

workoutRoutes.get("/", getAllWorkouts)
workoutRoutes.post("/:userId", verifyJWT, createWorkout)
workoutRoutes.patch("/:workoutName", verifyJWT, updateWorkout)
workoutRoutes.delete("/:workoutName", verifyJWT, deleteWorkout)

export default workoutRoutes;