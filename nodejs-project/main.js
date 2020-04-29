'use strict';

//const os = require('os');
// const path = require('path');
// const fs = require('fs');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');

function consolelog(...args) {
  cordova.channel.post('console-log', args);
}

app.use(cors({origin: '*'}));

app.get('/', (req, res) => {
  res.json({msg: 'Hi from express'});
});

app.get('/casaazul', (req, res) => {
  res.json({msg: "Casa azul server is running"});
});

let devicesSocket = {};

io.on('connection', (newSocket) => {
  consolelog('Socket.io: connected');

  let socketDevice = null;

  newSocket.on('device', (device) => {
    socketDevice = device;
    devicesSocket[device] = newSocket;
    if (device == 'bar' || device == 'kitchen' || device == 'pizza')
      devicesSocket['main'].emit('device-connected', device);
  });

  newSocket.on('send', (data, cb) => {
    if (devicesSocket[data.device]) {
      if (data.data !== null && data.data !== undefined)
        devicesSocket[data.device].emit(data.service, data.data, cb);
      else
        devicesSocket[data.device].emit(data.service, cb);
    } else {
      cb({error: 'Device is not connected: '+data.device})
    }
  });

  newSocket.on('socket-echo', (res) => {
    consolelog('Node: Socket-echo: ', res.text);
    newSocket.emit('socket-echo', res);
  });

  newSocket.on('error', (err) => {
    consolelog('Socket.io: error: ' + err);
  });

  newSocket.on('close', () => {
    consolelog('Socket.io: close');
  });

  newSocket.on('disconnecting', (reason) => {
    if (socketDevice) {
      delete devicesSocket[socketDevice];
      if (socketDevice == 'bar' || socketDevice == 'kitchen' || socketDevice == 'pizza')
        devicesSocket['main'].emit('device-disconnected', socketDevice);
    }
    consolelog('Socket.io: disconnecting. Reason: ' + reason);
  });

  newSocket.on('disconnect', (reason) => {
    consolelog('Socket.io: disconnected. Reason: ' + reason);
    newSocket.removeAllListeners();
  });

});

// Keep a set of all connected sockets to destroy when trying to close the server.
let connectedSockets = new Set();
server.on('connection', (conn) => {
  connectedSockets.add(conn);
  conn.on('close', () => {
    consolelog('Socket.io: Connected socket close');
    connectedSockets.delete(conn);
  });
});

// Catch errors from the OS when the server is not closed before app suspension.
server.on('error', (err) => {
  consolelog('Server error: ' + JSON.stringify(err));
});

const cordova = require('cordova-bridge');

cordova.app.on('pause', (lock) => {
  io.close(() => {
    consolelog("I have closed the server.")
    lock.release();
  });
  // The server will only close after all underlying connections have been destroyed.
  var socketsToDestroy = connectedSockets.values();
  connectedSockets.forEach((sock) => {
    sock.destroy();
  });
  cordova.channel.post('angular-log', "pause event received.");
});

function server_start() {
  if (!server.listening) {
    server.listen(8081, () => {
      cordova.channel.post('started', "");
    });
  }
}

cordova.app.on('resume', () => {
  consolelog('received a resume event.');
  server_start();
  cordova.channel.post('console-log', "resume event received.");
});

// cordova.channel.on('node-echo', (msg) => {
//   consolelog('[NodeJS Mobile] received:', msg);
//   cordova.channel.post('message', 'NodeJS replying to to cordova with this message: ' + msg);
// });

server_start();
//  cordova.channel.post('started' , "Hi, cordova! It's node! I've started. Mind checking that HTTP?");

