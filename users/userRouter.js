const express = require('express');
const userDb = require('./userDb');
const e = require('express');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  User.insert(req.body.name)
  .then(item => {
    res.status(201).json(item)
  })
  .catch(error => {
    res.status(500).json({message: "Error occurred"})
  })
});

//NOT DONE 
router.post('/:id/posts', validatePost, (req, res) => {
  
});

router.get('/', (req, res) => {
  User.get()
  .then(item => {
    res.status(200).json(item)
  })
  .catch(error => {
    res.status(500).json({message: "Error occurred"})
  })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', (req, res) => {
  User.getUserPosts(req.params.id)
  .then(item => {
    res.status(200).json(item)
  })
  .catch(error => {
    res.status(500).json({message: "Error occurred"})
  })
});

router.delete('/:id', (req, res) => {
  User.remove(req.params.id)
  .then(res.status(200).end())
  .catch(error => {
    res.status(500).json({message: "Error occurred"})
  })
});

// NOT DONE 
router.put('/:id', (req, res) => {
  User.update(req.params.id, req.body.name)
  .then(newItem => {
    if(newItem){
      User.getById(req.params.id)
      .then(item => {
        res.status(200).json(item)
      })

    }
  })
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id
  userDb.getById(id)
  .then(item => {
    if(item){
      console.log(req.user)
      req.user = item;
      next();
    } else {
      res.status(400).json( {message: "User not found"})
    }
  })
  .catch(error => {
    res.status(500).json({message: "Error occurred"})
  })
}

function validateUser(req, res, next) {
  if(!req.body) {
    res.status(400).json({message: "data required"})
  } else if(!req.body.name) {
    res.status(400).json({message:"Name required"})
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body){ 
    res.status(400).json({message: "Data required"})
  } else if(!req.body.text) {
    res.status(400).json( { message: "Text required"})
  } else {
    next();
  }
}

module.exports = router;
