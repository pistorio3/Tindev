const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
    console.log('Nova conexão', socket.id)
});

mongoose.connect('mongodb+srv://pistorio:06012000@ironman-lf2kq.mongodb.net/db_mongo?retryWrites=true&w=majority',{
    useNewUrlParser: true
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(8080);
