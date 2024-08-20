import {Router} from "express"
import {createCategory, deleteCategory, getAllCategories, updateCategory} from "../controllers/category.controllers"

const categoryRoutes: Router = Router()

categoryRoutes.get("/", getAllCategories)
categoryRoutes.post("/", createCategory)
categoryRoutes.patch("/:userId", updateCategory)
categoryRoutes.delete("/:userId", deleteCategory)

export default categoryRoutes;