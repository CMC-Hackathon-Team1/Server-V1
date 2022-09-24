const userController = require('../controller/userController');

const userRouter = (router) =>{

    this.userController = new userController();

    router.get('/feeds', function(req, res) { res.send('pong'); });

    router.get('/users/:userId/profile',this.userController.getUserProfiles);

    router.get('/users/:userId/profile/statistics',this.userController.getUserProfiles);

    // 사용자의 다른 페르소나 가져오기
    router.get('/users/persona', this.userController.changePersona);

    router.get('/users/:profileId/profile/statistics',this.userController.getUserStatics);
};

module.exports = userRouter;