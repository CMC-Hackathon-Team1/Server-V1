const userController = require('../controller/userController');

const userRouter = (router) =>{

    this.userController = new userController();

    // 프로필 생성 (사용자가 로그인 했다는 가정) -> 사용자의 페르소나 만드는 페이지 (최대 3개로 제한)
    router.post('/users/create', this.userController.createPersona);

    router.get('/users/:profileId/profile/statistics',this.userController.getUserStatics);

    router.get('/users/:userId/profile',this.userController.getUserProfiles);

    // 사용자의 다른 페르소나 가져오기
    router.get('/users/persona', this.userController.changePersona);
    

    router.get('/users/:profileId', this.userController.userMyPage);

};

module.exports = userRouter;