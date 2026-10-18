const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.use(cors());
app.use(express.json());
app.use(express.text({ type: '*/*' }));
let signals = [];
app.get('/', (req,res) => res.send('Backend Live - OnlineKitibwa'));
app.post('/webhook', (req,res) => {
let data = req.body;
if(typeof data === 'string'){ try{ data = JSON.parse(data) }catch(e){} }
console.log('Signal:', data);
signals.push({...data, time: new Date().toLocaleString()});
if(signals.length > 100) signals.shift();
io.emit('new-signal', data);
res.status(200).send('OK');
});
app.get('/signals', (req,res) => res.json(signals));
io.on('connection', (socket) => { socket.emit('all-signals', signals); });
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Live on', PORT));
