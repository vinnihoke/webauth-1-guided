const bcrypt = require('bcryptjs');
const router = require('express').Router();
const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
  let user = req.body;

  // Use bcrypt to create a hash, then assign 'user.password' to 'hash'.
  const hash = bcrypt.hashSync(user.password, 12);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;



  Users.findBy({ username })
    .first()
    .then(user => {
      // We want to check the password pulled from the req.body. However, we need to compare it somehow. To do that we'll use the bcrypt.compareSync method. This method takes two arguments... First is the password the user is attempting to enter, and second is the user password we have stored in the server.
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;
