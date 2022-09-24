const feedController = require('../controller/feedController');

const feedRouter = (router) =>{

    this.feedController = new feedController();

    
    // [GET] API 2.4
    /*
        게시글 최신순으로 리스트 조회
    */
    router.get('/feeds/feedList', this.feedController.getFeedList);


};

module.exports = feedRouter;