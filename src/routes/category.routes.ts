import {Router} from "express"
import {createCategory, deleteCategory, getAllCategories, updateCategory} from "../controllers/category.controllers"

const categoryRoutes: Router = Router()

categoryRoutes.get("/", getAllCategories)
categoryRoutes.post("/", createCategory)
categoryRoutes.patch("/:categoryName", updateCategory)
categoryRoutes.delete("/:categoryName", deleteCategory)

export default categoryRoutes;