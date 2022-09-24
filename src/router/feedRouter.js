const feedController = require('../controller/feedController');

const feedRouter = (router) =>{

    this.feedController = new feedController();

    router.get('/feeds', function(req, res) { res.send('pong'); });

    router.post('/feeds/feed', this.feedController.postFeed);

};

module.exports = feedRouter;