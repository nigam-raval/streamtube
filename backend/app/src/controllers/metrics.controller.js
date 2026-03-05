import { appRegistry } from '../config/prometheus.config.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const getMetrics = asyncHandler(async (req, res) => {
  const metrics = await appRegistry.metrics()
  res.set('Content-Type', appRegistry.contentType).status(200).send(metrics)
})

export { getMetrics }
