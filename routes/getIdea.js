function getHandler(db) {
  return async function(req, res) {
    if (!req.body.id) {
      return res.json({
        success: false,
        msg: 'id not provided'
      })
    }
    const idea = await db.collection('ideas').findOne({_id: req.body.id});
    if (!idea) {
      return res.json({
        success: false,
        msg: 'idea not found'
      })
    }
    res.json({success: true, idea: idea});
  }
}

module.exports = {getHandler};