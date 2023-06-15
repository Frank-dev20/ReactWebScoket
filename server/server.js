const websocket = require("websocket").server;
const http = require("http");

const PORT = 9000;
const clients = {}

const server = http.createServer();

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});

const webSocketServer = new websocket({
    "httpServer": server
});



const generateUserID = () => {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 0x10000).toString(16).padStart(4, "0")).join("-");
};

webSocketServer.on("request", (req) => {
    let userID = generateUserID(); 
       
    const connection = req.accept(null, req.origin);
    clients[userID] = connection;
    console.log((new Date()) + "connected to server: " + "Connected client id is: " +  userID + " req.origin is: " + req.origin);

    
    connection.on("message", (message) => {
        if (message.type === "utf8") {            
            for (key in clients) {
                clients[key].sendUTF(message.utf8Data);
            }
        }
    });
});
    