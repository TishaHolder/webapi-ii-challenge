//require the yarn express module
const express = require('express');

//import express router
const postRouter = express.Router();

//import the db.js file to get access to the DB 
const DB = require('./data/db.js');


//**********************************END POINTS */

//any url that begins with /api/posts
postRouter.get('/', (req, res) => {

});

//same as /api/posts/:id
postRouter.get('/:id', (req, res) => {

});

//same as /api/posts/:id/comments
postRouter.get('/:id/comments', (req, res) => {

});

//same as /api/posts
postRouter.post ('/', (req, res) => {

    const postInformation = req.body;

    if(postInformation.title === "" && postInformation.contents === ""){

        res.status(400).json( { errorMessage: "Please provide title and contents for the post."} );

    }
    else {
        DB.insert(postInformation)
        .then(postIdObject => {

            DB.findById (postIdObject.id) 
            .then (post => {
                console.log("insert post", post);
                res.status(201).json(post);

            })          
            
        })
        .catch(error => {
            res.status(500).json( {error: "There was an error while saving the post to the database"});
        })
    }

});

//same as /api/posts/:id/comments
postRouter.post('/:id/comments', (req, res) => {

});

//same as /api/posts/:id
postRouter.put('/:id', (req, res) => {

});

//same as /api/posts/:id
postRouter.delete('/:id', (req, res) => {

})

//exports the router so it is available to the main server file
module.exports = postRouter;

