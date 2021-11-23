let socketIoConnection;

module.exports = {
    init: httpNodeServer => {
        socketIoConnection = require('socket.io')(httpNodeServer, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        });
        return socketIoConnection;
    },
    getSocketIoConnection: () => {
        if (!socketIoConnection) {
            throw new Error ('Socket.io not initialized!')
        }
        return socketIoConnection;
    }
}