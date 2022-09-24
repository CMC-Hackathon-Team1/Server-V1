const feedController = require('../controller/feedController');

const feedRouter = (router) =>{

    this.feedController = new feedController();

    
    // [GET] API 2.4
    /*
        게시글 최신순으로 리스트 조회
    */
    router.get('/feeds/feedList', this.feedController.getFeedList);

    // [GET] API 2.9
    /*
        게시글 클릭 시 내용 조회
    */
    router.get('/feeds/feed', this.feedController.getFeedInfo);

     // 회원 전체 정보 보기
    router.get('/calendars', this.feedController.getCalendarInfo);
    
    

};

module.exports = feedRouter;