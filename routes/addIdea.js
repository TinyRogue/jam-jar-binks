const { v4: uuidv4 } = require('uuid');

function getHandler(db) {
  return async function(req, res) {
    const requiredFields = ['title', 'desc', 'address', 'city'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.json({
          success: false,
          msg: 'missing fields'
        })
      }
    }
    if (!req.files.image) {
      return res.json({
        success: false,
        msg: 'missing image'
      })
    }
    const imageID = uuidv4();
    const ideaData = {
      imageID,
      title: req.body.title,
      desc: req.body.desc,
      address: req.body.address,
      city: req.body.city
    }
    req.files.image.mv(__dirname + '/../public/uploads/' + imageID + '.png', async function() {
      await db.collection('ideas').insertOne(ideaData);
      res.json({success: true});
    });
  }
}

module.exports = {getHandler};