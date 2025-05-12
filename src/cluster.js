import cluster from 'cluster';
import { cpus } from 'os';
import http from 'http';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const numCPUs = cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  console.log(`Load balancer is running on http://localhost:${PORT}/api`);


  const numWorkers = numCPUs - 1 || 1; 
  let currentWorker = 0;


  for (let i = 0; i < numWorkers; i++) {
    const workerPort = PORT + i + 1;
    cluster.fork({ WORKER_PORT: workerPort });
    console.log(`Worker started on port ${workerPort}`);
  }


  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    const workerPort = worker.process.env.WORKER_PORT;
    cluster.fork({ WORKER_PORT: workerPort });
  });


  http.createServer((req, res) => {

    const workers = Object.values(cluster.workers);
    

    const worker = workers[currentWorker];
    currentWorker = (currentWorker + 1) % workers.length;
    

    const workerPort = worker.process.env.WORKER_PORT;


    const options = {
      hostname: 'localhost',
      port: workerPort,
      path: req.url,
      method: req.method,
      headers: req.headers
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    req.pipe(proxyReq, { end: true });

    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    });
  }).listen(PORT);

} else {

  const workerPort = process.env.WORKER_PORT;
  

  app.listen(workerPort, () => {
    console.log(`Worker ${process.pid} running on port ${workerPort}`);
  });
}