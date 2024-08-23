import express, { Express } from 'express'
import helmet from 'helmet';
import morgan from 'morgan';
import { json, urlencoded } from 'body-parser';
import userRoutes from './routes/user.routes';
import workoutRoutes from './routes/workout.routes';
import categoryRoutes from './routes/category.routes';
import exerciseRoutes from './routes/exercise.routes';
import reportRoutes from './routes/report.routes';
import authRoutes from './routes/auth.routes'
import cors from 'cors'
import cookieParser from 'cookie-parser'




const app: Express = express();


app.use(cookieParser())
app.use(helmet())
app.use(json())
app.use(urlencoded({ extended: true }));

app.use(morgan('tiny'))

app.use(cors({
}));

app.use("/user", userRoutes)
app.use("/workout", workoutRoutes)
app.use("/report", reportRoutes)
app.use("/exercise", exerciseRoutes)
app.use("/category", categoryRoutes)
app.use("/auth", authRoutes)

export default app
