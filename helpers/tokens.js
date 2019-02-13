const jwt = require('jsonwebtoken'); 

module.exports = {
  generateToken: (payload) => {
    return jwt.sign(payload, app.get('superSecret'), {
      expiresIn: '24h' // expires in 24 hours
    });
  },
  verifyToken: (token, secret) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, function(err, decoded) {  
        if (typeof decoded === 'object') {
          resolve(decoded);
        }
        reject();
      });
    })
  }
};
