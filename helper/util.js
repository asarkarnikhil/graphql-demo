const bcrypt = require('bcryptjs');
const { promisify } = require('util');

const bcryptHash = promisify(bcrypt.hash);
const bcryptCompare = promisify(bcrypt.compare);

exports.hashPassword = async function (strToCrypt){
    try {
        const saltRounds = 10;
        const hashedPassword = await bcryptHash(strToCrypt, saltRounds);
        return hashedPassword;
      } catch (error) {
        console.log('Error hashing:', error);
        throw new Error('Error hashing password');
      }
}

exports.comparePasswords = async function (inputPassword){
    try {
        const isMatch = await bcryptCompare(inputPassword, hashedPassword);
        return isMatch;
      } catch (error) {
        throw new Error('Error comparing passwords');
      }
}