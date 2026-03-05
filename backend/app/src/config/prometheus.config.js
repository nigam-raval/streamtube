import client from 'prom-client'

const appRegistry = new client.Registry()

client.collectDefaultMetrics({
  register: appRegistry,
  labels: {
    project_name: 'streamtube',
    service: 'app',
  },
})

export { appRegistry }
