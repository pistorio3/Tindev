const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
    const { user } = socket.handshake.query;

    console.log('User ID: ' , user);
    console.log('Socket ID: ', socket.id)

    connectedUsers[user] = socket.id; 
});

mongoose.connect('mongodb+srv://pistorio:06012000@ironman-lf2kq.mongodb.net/db_mongo?retryWrites=true&w=majority',{
    useNewUrlParser: true
});

app.use((req, res , next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(8080);
