import { Router } from 'express'
import { getMetrics } from '../controllers/metrics.controller.js'

const router = Router()

router.route('/').get(getMetrics)

export default router
