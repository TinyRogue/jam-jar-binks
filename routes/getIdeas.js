function getHandler(db) {
  return async function(req, res) {
    const result = await db.collection('ideas').find({}).limit(20).toArray();
    res.json(result);
  }
}

module.exports = {getHandler};