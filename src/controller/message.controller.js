const MessageService = require('../service/message.service');

const baseResponse = require('../utility/baseResponseStatus');
const {errResponse, response} = require('../utility/response');

class MessageController {
    MessageService;

    constructor(){
        this.MessageService = new MessageService();
    }

    postMessage = async (req, res) => {
        const toeknIdxData = req.verifiedToken.idx;
        const userIdx = toeknIdxData[0].userIdx;
        const partnerIdx = req.body.partnerIdx;
        const content = req.body.content;

        // validation
        if (!partnerIdx) {
            return res.send(errResponse(baseResponse.MESSAGE_USERIDX_EMPTY));
        } else if (partnerIdx < 0){
            return res.send(errResponse(baseResponse.MESSAGE_USERIDX_LENGTH));
        }

        // validation
        if (!content) {
            return res.send(errResponse(baseResponse.MESSAGE_CONTENT_EMPTY));
        } else if (content.length >200) {
            return res.send(errResponse(baseResponse.MESSAGE_CONTENT_LENGTH));
        }

        const postMessageResult = await this.MessageService.postMessage(userIdx, partnerIdx, content);

        return res.send(postMessageResult);

    }

    getMessages = async (req, res) => {

        const toeknIdxData = req.verifiedToken.idx;
        const userIdx = toeknIdxData[0].userIdx;
        const partnerIdx = req.body.partnerIdx;

        // validation
        if (!partnerIdx) {
            return res.send(errResponse(baseResponse.MESSAGE_USERIDX_EMPTY));
        } else if (partnerIdx < 0){
            return res.send(errResponse(baseResponse.MESSAGE_USERIDX_LENGTH));
        }

        const totalMessageResult = await this.MessageService.getMessages(userIdx, partnerIdx);

        return res.send(totalMessageResult);
    }

}


module.exports = MessageController;
