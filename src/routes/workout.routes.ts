import {Router} from "express"
import {createWorkout, deleteWorkout, getAllWorkouts, updateWorkout} from "../controllers/workout.controllers"

const workoutRoutes: Router = Router()

workoutRoutes.get("/", getAllWorkouts)
workoutRoutes.post("/", createWorkout)
workoutRoutes.patch("/:userId", updateWorkout)
workoutRoutes.delete("/:userId", deleteWorkout)

export default workoutRoutes;