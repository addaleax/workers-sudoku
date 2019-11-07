'use strict';
const http = require('http');
const { Worker } = require('worker_threads');

const workerPool = [  // Start a pool of four workers
  new Worker('./worker.js'),
  new Worker('./worker.js'),
  new Worker('./worker.js'),
  new Worker('./worker.js'),
];
const waiting = [];

http.createServer((req, res) => {
  let body = '';
  req.setEncoding('utf8');  // Receive strings rather than binary data
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    let dataAsUint8Array;
    try {
      dataAsUint8Array = new Uint8Array(JSON.parse(body));
      // Fix the length at 81 = 9*9 fields so that we are not DoS’ed through
      // overly long input data.
      dataAsUint8Array = dataAsUint8Array.slice(0, 81);
    } catch (err) {
      res.writeHead(400);
      res.end(`Failed to parse body: ${err}`);
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    if (workerPool.length > 0) {
      handleRequest(res, dataAsUint8Array, workerPool.shift());
    } else {
      waiting.push((worker) => handleRequest(res, dataAsUint8Array, worker));
    }
  });
}).listen(3000);

function handleRequest(res, sudokuData, worker) {
  worker.postMessage(sudokuData);
  worker.once('message', (solutionData) => {
    res.end(JSON.stringify([...solutionData]));

    // Put the Worker back in the queue.
    if (waiting.length > 0)
      waiting.shift()(worker);
    else
      workerPool.push(worker);
  });
}
