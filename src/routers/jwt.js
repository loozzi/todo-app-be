const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const privateKey = fs.readFileSync(path.join(__dirname, '../configs/keys/privatekey.pem'));
const publicKey = fs.readFileSync(path.join(__dirname, '../configs/keys/publickey.crt'));
const TIME_EXPIRIED = 86400;

function genToken(data) {
    try {
        return jwt.sign(data, privateKey, {
            expiresIn: TIME_EXPIRIED,
            algorithm: 'RS256'
        });
    } catch (error) {
        return '';
    }
}

function decodeToken(token) {
    try {
        return jwt.verify(token, publicKey, {
            algorithms: ['RS256']
        });
    } catch (error) {
        return '';
    }
}


module.exports = {
    genToken,
    decodeToken,
    TIME_EXPIRIED
}
