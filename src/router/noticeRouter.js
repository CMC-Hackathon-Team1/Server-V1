const noticeController = require('../controller/noticeController');

const noticeRouter = (router) =>{

    this.noticeController = new noticeController();

    router.get('/notice', this.noticeController.getNotice);

    // api 연결 확인용
    router.get('/ping', function(req, res) { res.send('pong'); });

};

module.exports = noticeRouter;
