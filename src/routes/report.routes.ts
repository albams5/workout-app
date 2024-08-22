import {Router} from "express"
import {createReport, deleteReport, getAllReports, updateReport} from "../controllers/report.controllers"

const reportRoutes: Router = Router()

reportRoutes.get("/", getAllReports)
reportRoutes.post("/:userId", createReport)
reportRoutes.patch("/:reportId", updateReport)
reportRoutes.delete("/:reportId", deleteReport)

export default reportRoutes;