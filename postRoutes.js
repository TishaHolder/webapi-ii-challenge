//require the yarn express module
const express = require('express');

//create a router
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
        if(post.length === 0){
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

    const postId = req.params.id;

    DB.findById(postId)
    .then(post => {
        if (post.length === 0){
            res.status(404).json( {message: 'The post with the specified ID does not exist.'});
        }
        else {

            DB.findPostComments(postId)
                .then(comments => {

                if(comments.length === 0){
                    res.status(404).json( {message: 'There are no comments on this post.'});
                }
                else {

                    res.status(200).json(comments);
                }
            })

        }
    })   
    .catch(error => {
        console.log("comments retrieval error", error);
        res.status(500).json( {error: 'The comments information could not be retrieved.'} )
    })

});

//same as /api/posts
postRouter.post ('/', (req, res) => {

    const postInformation = req.body;

    if(postInformation.title === "" || postInformation.contents === ""){

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
                res.status(404).json( {error: 'The post with the specified id does not exist.'} );
            })         
            
        })
        .catch(error => {
            res.status(500).json( {error: "There was an error while saving the post to the database"});
        })
    }

});

//same as /api/posts/:id/comments
postRouter.post('/:id/comments', (req, res) => {

    //***ERROR: SQLLITE_CONSTRAINT: NOT NULL constraint failed: comments.post_id or 
    //****ERROR: table comments has no column named 0
    //SOLUTION: The insertComment method expects a comment object to be passed to it with {text, post_id}
    //the call to insert comment should look like this: DB.insertComment({text, post_id})    

    const post_id = req.params.id;
    const commentInformation = req.body;
    const text = commentInformation.text;

    console.log("comment information", commentInformation);

    if(commentInformation.text === ""){
        res.status(400).json( {errorMessage: 'Please provide text for the comment.'} );

    }
    else {
       DB.findById(post_id)
        .then(post => {
           console.log("post to insert comment for", post);

            if(post.length > 0){
                DB.insertComment({text, post_id})
                .then(commentIdObject => {
                    console.log("comment id info", commentIdObject);

                    console.log("comment id object", commentIdObject);

                    DB.findCommentById(commentIdObject.id)
                    .then(comment => {                    
                        res.status(201).json(comment);
                    })  
                    .catch(error => {
                        res.status(500).json( {error: 'There was an error finding the comment by id.'})
                    })                     
                   

                })
                .catch(error => {
                    console.log("post comments error", error); 
                    res.status(500).json( {error: 'There was an error while saving the comment to the database.'})
                })             
               
           }
           else {
                 
                res.status(404).json( {message: 'The post with the specified ID does not exist.'} );
                
            }
        })
        .catch(error => {
           
            res.status(500).json( {error: 'There was an error while saving the comment to the database.'})
        })   

    }

});

//same as /api/posts/:id
postRouter.put('/:id', (req, res) => {

    const postId = req.params.id;
    const newInformation = req.body;

    if(newInformation.title === "" || newInformation.contents === "")
    {
        res.status(400).json( {errorMessage: 'Please provide title and contents for the post.'} );
    }
    else {
        DB.update(postId, newInformation)
        .then(updateCount => {
            if(updateCount === 1){
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
        if(numDeletedRecords > 0){
            res.status(404).json( {message: 'The post with the specified ID does not exist.'})
        }
        else {
            //204 means successful removal and no data to return
            res.status(204).json( {message: 'The post was successfully deleted.'} );
        }
    })
    .catch (error => {
        console.log("delete error", error);
        res.status(500).json( {error: 'The post could not be removed.'} );
    })

});

//exports the router so it is available to the main server file
module.exports = postRouter;

