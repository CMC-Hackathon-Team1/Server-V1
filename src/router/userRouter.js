const userController = require('../controller/userController');

const userRouter = (router) =>{

    this.userController = new userController();

    router.get('/feeds', function(req, res) { res.send('pong'); });



    router.get('/users/:userId/profile',this.userController.getUserProfiles)
};

module.exports = userRouter;