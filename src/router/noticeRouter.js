const noticeController = require('../controller/noticeController');

const noticeRouter = (router) =>{

    this.noticeController = new noticeController();

    router.get('/notice', this.noticeController.getNotice);

};

module.exports = noticeRouter;
