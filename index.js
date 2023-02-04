const { Server } = require('ws');

const sockserver = new Server({ port: process.env.PORT });
const connections = new Set();

const mp = new Map();

sockserver.on('connection', (ws) => {
   console.log('New client connected!');
   connections.add(ws)
   console.log("Current Clients " + connections.size);
   ws.on('message', (data) => {
       data = "" + data
       if(data.match(/^Hello from/)){
          mp.set(ws,data.split(/^Hello from */)[1])
        }
        console.log(data);
        console.log(mp);
       connections.forEach((client) => {
          if((client != ws) || (data == "Stop"))
           client.send(data);
       })
   });

   ws.on('close', () => {
       connections.delete(ws);
       console.log("Current Clients " + connections.size);
       mp.delete(ws);
       console.log(mp);
       console.log('Client has disconnected!');
   });
});