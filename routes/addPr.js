const { ObjectId } = require("bson");

function getHandler(db) {
  return async function(req, res) {
    if (!req.session.logged) {
      return res.json({
        success: false,
        msg: 'not logged'
      });
    }
    const requiredFields = ['id', 'title', 'desc'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.json({
          success: false,
          msg: 'missing field'
        });
      }
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
    const newPR = {
      title: req.body.title,
      desc: req.body.desc,
      ideaID: req.body.id,
      userID: req.session.userID
    }
    const prID = await db.collection('prs').insertOne(newPR);
    await db.collection('ideas').updateOne({_id: ObjectId(req.body.id)}, {$push: {PRs: prID.insertedId}});
    res.json({success: true});
  }
}

module.exports = {getHandler};