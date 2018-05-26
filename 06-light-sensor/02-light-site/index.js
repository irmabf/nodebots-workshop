const path = require('path');

const five = require('johnny-five');
const Tessel = require('tessel-io');
const board = new five.Board({
  io: new Tessel(),
});

board.on('ready', () => {
  const light = new five.Light('a7');

  const express = require('express');
  const bodyParser = require('body-parser');
  const app = express();
  const http = require('http').Server(app);
  const io = require('socket.io')(http);
  const port = process.env.PORT || 80;

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
  });

  io.on('connection', socket => {
    light.on('change', () => {
      io.sockets.emit('light changed', light.level);
    });
  });

  http.listen(port, () => {
    console.log(
      'Your server is up and running on Port ' + port + '. Good job!',
    );
  });
});
