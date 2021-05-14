const config = require('config');
const httpServer = require('http').createServer();
const PORT = 5001;
const URL = config.get('frontendUrl');
const jwt = require('jsonwebtoken');
const options = {
    cors: {
        origin: URL,
        methods: ['GET', 'POST'],
        allowedHeaders: ['socket_io_header'],
        credentials: true
    }
};

const io = require('socket.io')(httpServer, options);

io.on('connection', socket => {
    console.log('New client connected');

    socket.emit('message', { message: 'Welcome on Board!' });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    socket.on('update', (arg1, arg2, callback) => {
        console.log(arg1);
        console.log(arg2);
        callback({
            status: `${arg1} ${arg2}`
        });
    });
});

io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if(token) {
        jwt.verify(token, config.get('jwtSecret'), function(err, decoded) {
            if(err) return next(new Error('Authentication error'));
            socket.decoded = decoded;
            next();
        });
    }
    else {
        next(new Error('Authentication error'));
    }    
});

httpServer.listen(PORT, () => {
    console.log(`Messenger has started on port ${PORT}`);
});