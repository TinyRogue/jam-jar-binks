async function handler(req, res) {
  if (req.session.logged) {
    return res.json({
      success: true,
      msg: 'already logged in'
    });
  }
  const requiredFields = ['email', 'password'];
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
  const user = await db.collection('accounts').findOne({email: req.body.email});
  if (!user) {
    return res.json({
      success: false,
      msg: 'incorrect email or password'
    });
  }
  const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!passwordMatch) {
    return res.json({
      success: false,
      msg: 'incorrect email or password'
    });
  }
  req.session.logged = true;
  req.session.userID = user._id;
  res.json({success: true});
}

module.exports = {handler};