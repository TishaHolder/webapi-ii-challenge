//require the yarn express module
const express = require('express');

//import express router
const postRouter = express.Router();

//import the db.js file to get access to the DB 
const DB = require('./data/db.js');


//**********************************END POINTS ******************************/

//any url that begins with /api/posts
postRouter.get('/', (req, res) => {

    DB.find()
    .then( posts => {
        
        res.status(200).json(posts);

    })
    .catch( error => {

        res.status(500).json( {error: 'The posts information could not be retrieved.'} )
    })

});

//same as /api/posts/:id
postRouter.get('/:id', (req, res) => {

    const postId = req.params.id;
    
    DB.findById(postId)
    .then(post => {

        if(!post){
            res.status(404).json( {message: 'The post with the specified ID does not exist'} );
        }
        else {
            res.status(200).json(post);
        }
    })
    .catch(error => {

        res.status(500).json( {message: 'The post information could not be retrieved.'} );
    })

});

//same as /api/posts/:id/comments
postRouter.get('/:id/comments', (req, res) => {

    const commentId = req.params.id;

    DB.findCommentById(commentId)
    .then(comment => {

        if(!comment){

            res.status(404).json( {message: 'The post with the specified ID does not exist.'});

        }
        else {

            res.status(200).json(comment);
        }
    })
    .catch(error => {

        res.status(500).json( {error: 'The comments information could not be retrieved.'} )
    })

});

//same as /api/posts
/*postRouter.post ('/', (req, res) => {

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
            .catch(error => {
                res.status(500).json( {error: 'There was an error while saving the post to the database.'} );
            })         
            
        })
        .catch(error => {
            res.status(500).json( {error: "There was an error while saving the post to the database"});
        })
    }

});*/

//same as /api/posts/:id/comments
/*postRouter.post('/:id/comments', (req, res) => {

    const commentId = req.params.id;
    const commentInformation = req.body;

    if(commentInformation.text === ""){
        res.status(400).json( {errorMessage: 'Please provide text for the comment.'} );

    }
    else {
        DB.findById(commentId)
        .then(post => {
            if(!post){
                res.status(404).json( {message: 'The post with the specified ID does not exist.'} );
            }
            else {
                DB.insertComment(commentInformation)
                .then(commentIdObject => {

                    console.log("comment id object", commentIdObject);

                    DB.findCommentById(commentIdObject.id)
                    .then(comment => {
                    
                        res.status(201).json(comment);
                    })  
                    .catch(error => {
                        res.status(500).json( {error: 'There was an error while saving the comment to the database.'})
                    })                 

                })
                .catch(error => {
                    res.status(500).json( {error: 'There was an error while saving the comment to the database.'})
                })                 

                
            }
        })
        .catch(error => {
            res.status(500).json( {error: 'There was an error while saving the comment to the database.'})
        })                 


    }

});*/

//same as /api/posts/:id
postRouter.put('/:id', (req, res) => {

    const postId = req.params.id;
    const newInformation = req.body;

    if(newInformation.title === "" && newInformation.contents === "")
    {
        res.status(400).json( {errorMessage: 'Please provide title and contents for the post.'} );
    }
    else {

        DB.update(postId, newInformation)
        .then(updateCount => {

            if(updateCount == 1){
                DB.findById(postId)
                .then(post => {
                    res.status(200).json(post); 

                })
                .catch(error => {
                    res.status(404).json( {message: 'Could not find the post after updating.'} );
                })              
            }
            else {

                res.status(404).json( {message: 'The post with the specified ID does not exist.'} );

            }
        })
        .catch(error => {

            res.status(500).json( {error: 'The post information could not be modified.'} )
        })

    }
    


});

//same as /api/posts/:id
postRouter.delete('/:id', (req, res) => {

    const postId = req.params.id;

    DB.remove(postId)
    .then (numDeletedRecords => {
        if(numbDeletedRecords < 1){
            res.status(404).json( {message: 'The post with the specified ID does not exist.'})
        }
        else {
            res.status(200).json( {message: 'The post was successfully deleted.'} );
        }
    })
    .catch (error => {
        
        res.status(500).json( {error: 'The post could not be removed.'} );
    })

});

//exports the router so it is available to the main server file
module.exports = postRouter;

