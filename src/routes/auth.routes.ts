import { Router } from 'express'
import {
	handleLogin,
	handleRefreshToken,
	handleLogout,
} from '../controllers/auth.controllers'

const authRouter = Router()

authRouter.post('/login', handleLogin)
authRouter.get('/refresh', handleRefreshToken)
authRouter.get('/logout', handleLogout)

export default authRouter