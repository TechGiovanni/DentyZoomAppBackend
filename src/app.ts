const http = require('http');
const express = require('express');

const app = express( );

const server = http.createServer(app);

server.listen(3001, (req: any,res:any)=>{
  console.log('listening on port 3001');
});
