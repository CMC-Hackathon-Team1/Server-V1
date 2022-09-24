const userController = require('../controller/userController');

const userRouter = (router) =>{

    this.userController = new userController();


    router.get('/feeds', function (req, res) { res.send('pong'); });
    
    // 프로필 생성 (사용자가 로그인 했다는 가정) -> 사용자의 페르소나 만드는 페이지 (최대 3개로 제한)
    router.post('/users/create', this.userController.createPersona);

    router.get('/feeds', function(req, res) { res.send('pong'); });

    router.get('/users/:userId/profile',this.userController.getUserProfiles);

    router.get('/users/:userId/profile/statistics',this.userController.getUserProfiles);
    
    router.get('/users/:profileId', this.userController.userMyPage);
};

module.exports = userRouter;