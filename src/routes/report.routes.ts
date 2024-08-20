import {Router} from "express"
import {createReport, deleteReport, getAllReports, updateReport} from "../controllers/report.controllers"

const reportRoutes: Router = Router()

reportRoutes.get("/", getAllReports)
reportRoutes.post("/", createReport)
reportRoutes.patch("/:userId", updateReport)
reportRoutes.delete("/:userId", deleteReport)

export default reportRoutes;