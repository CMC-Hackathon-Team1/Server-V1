const feedController = require('../controller/feedController');

const feedRouter = (router) =>{

    this.feedController = new feedController();

    
    // [GET] API 2.4
    /*
        게시글 최신순으로 리스트 조회
    */
    router.get('/feeds/feedList', this.feedController.getFeedList);

     // 회원 전체 정보 보기
     router.get('/calendars', this.feedController.getCalendarInfo);
    
    

    router.post('/feeds/feed', this.feedController.postFeed);

};

module.exports = feedRouter;