const feedController = require('../controller/feedController');

const feedRouter = (router) =>{

    this.feedController = new feedController();

     // 회원 전체 정보 보기
     router.get('/calendars', this.feedController.getCalendarInfo);
    
    

};

module.exports = feedRouter;