const emailValidator = require("email-validator");
const bcrypt = require('bcrypt');

function getHandler(db) {
  return async function(req, res) {
    if (req.session.logged) {
      return res.json({
        success: false,
        msg: 'already logged in'
      });
    }
    const requiredFields = ['email', 'password', 'name', 'surname'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.json({
          success: false,
          msg: 'incomplete query'
        });
      }
    }
    if (!emailValidator.validate(req.body.email)) {
      return res.json({
        success: false,
        msg: 'invalid email address'
      });
    }
    if (req.body.password.length > 50 || req.body.password.length < 3) {
      return res.json({
        success: false,
        msg: 'password too long or short'
      });
    }
    const emailExists = await db.collection('accounts').findOne({email: req.body.email});
    if (emailExists) {
      return res.json({
        success: false,
        msg: 'email exists'
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = {
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      surname: req.body.surname
    };
    const {err, result} = await db.collection('accounts').insertOne(newUser);
    if (err) {
      console.log(err);
      return res.json({success: false, msg: 'database error'});
    }
    res.json({success: true});
  }
}

module.exports = {getHandler};