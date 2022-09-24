const MessageController = require('../controller/message.controller');
const jwtMiddleware = require('../middleware/jwt.middleware');

const messageRouter = (router) =>{

    this.MessageController = new MessageController();

    // 메시지 전송 API
    router.post('/message', jwtMiddleware, this.MessageController.postMessage);
    
    // 메시지 수신 API
    router.get('/message', jwtMiddleware, this.MessageController.getMessages);
}

module.exports = messageRouter;