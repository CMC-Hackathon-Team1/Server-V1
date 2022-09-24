const userController = require('../controller/userController');

const userRouter = (router) =>{

    this.userController = new userController();

    router.get('/feeds', function(req, res) { res.send('pong'); });

};

module.exports = userRouter;