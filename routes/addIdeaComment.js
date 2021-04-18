const { ObjectId } = require("bson");

function getHandler(db) {
  return async function(req, res) {
    if (!req.session.logged) {
      return res.json({
        success: false,
        msg: 'not logged'
      });
    }
    if (!req.body.comment) {
      return res.json({
        success: false,
        msg: 'no comment'
      });
    }
    const idea = await db.collection('ideas').findOne({_id: ObjectId(req.body.id)});
    if (!idea) {
      if (!req.session.logged) {
        return res.json({
          success: false,
          msg: 'idea not found'
        });
      }
    }
    await db.collection('ideas').updateOne({_id: ObjectId(req.body.id)}, {$push: {comments: req.body.comment}});
    res.json({success: true});
  }
}

module.exports = {getHandler};