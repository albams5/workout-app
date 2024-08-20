import {Router} from "express"
import {createUser, deleteUser, getAllUsers, updateUser} from "../controllers/user.controllers"

const userRoutes: Router = Router()

userRoutes.get("/", getAllUsers)
userRoutes.post("/", createUser)
userRoutes.patch("/:userId", updateUser)
userRoutes.delete("/:userId", deleteUser)

export default userRoutes;