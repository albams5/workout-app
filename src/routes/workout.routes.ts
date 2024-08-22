import {Router} from "express"
import {createWorkout, deleteWorkout, getAllWorkouts, updateWorkout} from "../controllers/workout.controllers"

const workoutRoutes: Router = Router()

workoutRoutes.get("/", getAllWorkouts)
workoutRoutes.post("/:userId", createWorkout)
workoutRoutes.patch("/:workoutName", updateWorkout)
workoutRoutes.delete("/:workoutName", deleteWorkout)

export default workoutRoutes;