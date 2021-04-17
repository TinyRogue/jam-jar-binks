function handler(req, res) {
  if (!req.session.logged) {
    return res.json({
      success: true,
      msg: 'already logged out'
    });
  }
  req.session.destroy(err => {
    return res.json({success: !!err});
  });
}

module.exports = {handler};