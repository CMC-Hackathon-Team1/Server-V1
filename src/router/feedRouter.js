const feedController = require('../controller/feedController');

const feedRouter = (router) =>{

    this.feedController = new feedController();

    router.get('/feeds', function(req, res) { res.send('pong'); });

};

module.exports = feedRouter;