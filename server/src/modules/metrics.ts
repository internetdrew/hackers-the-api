import express from 'express';
import logger from 'pino-http';
import dayjs from 'dayjs';
import client from 'prom-client';

export const { logger: log } = logger({
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

const app = express();
app.use(logger());

export const restResponseTimeHistogram = new client.Histogram({
  name: 'rest_response_time_duration_seconds',
  help: 'REST API response time in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

export const databaseResponseTimeHistogram = new client.Histogram({
  name: 'db_response_time_duration_seconds',
  help: 'Database response time in seconds',
  labelNames: ['operation', 'success'],
});

export const startMetricsServer = () => {
  const collectDefaultMetrics = client.collectDefaultMetrics;
  collectDefaultMetrics();

  app.get('/metrics', async (_req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.send(await client.register.metrics());
  });

  app.listen(9100, () => {
    log.info('Metrics server started on port 9100...');
  });
};
