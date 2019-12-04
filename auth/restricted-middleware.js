const bcrypt = require('bcryptjs');
const Users = require('../users/users-model.js');

module.exports = function(req, res, next) {
    const { username, password } = req.headers;

    if(username && password){
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
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }

}