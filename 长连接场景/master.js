// master.js

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) { // 判断是不是 主进程 还是 工作进程
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // 如果工作进程死掉，则创建新的工作进程
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // 工作进程可以共享任何 TCP 连接
  // 在这里创建长连接服务器
  const net = require('net');

  const server = net.createServer(socket => {
    // 新的客户端连接
    console.log(`Worker ${process.pid} handling new connection from ${socket.remoteAddress}:${socket.remotePort}`);

    // 处理客户端的数据和事件
    socket.on('data', data => {
      console.log(`Received data from client ${socket.remoteAddress}:${socket.remotePort}: ${data}`);
      // 回复客户端
      socket.write(`Echo from server: ${data}`);
    });

    socket.on('end', () => {
      console.log(`Client ${socket.remoteAddress}:${socket.remotePort} disconnected`);
    });

    socket.on('error', err => {
      console.error(`Socket error: ${err}`);
    });
  });

  server.listen(8000, () => {
    console.log(`Worker ${process.pid} is listening on port 8000`);
  });
}
