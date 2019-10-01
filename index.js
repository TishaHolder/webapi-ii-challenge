// require the express npm module,
const express = require('express');

//import the post router
const postRoutes= require('./postRoutes.js');

// creates an express application using the express module
const server = express();

//middleware - need this for post and put - teaches express how to read json from the request body
server.use(express.json()); 

//mounts the post router
server.use('/api/posts', postRoutes);

//set up API port and have server listen on the port
const port = 5000;
server.listen(port, ()=> console.log(`API running on port ${port}`));

