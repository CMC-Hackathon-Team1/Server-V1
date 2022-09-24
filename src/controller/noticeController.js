const noticeService = require('../service/noticeService');

const baseResponse = require('../utility/baseResponseStatus');
const { errResponse, response } = require('../utility/response');

class noticeController {
    noticeService;

    constructor (){
        this.noticeService = new noticeService();
    }

    // 공지목록 가져오기
    getNotice = async (req, res) => {
        
        let page = req.query?.page;
        console.log(page);

        if (page !== undefined && page < 0) {
            return res.send(errResponse(baseResponse.PAGENATION_ERROR));
        }

        const retrieveNoticeResult = await this.noticeService.retrieveNoticeList(page);
    
        return res.send(retrieveNoticeResult);
    }
    
}

module.exports = noticeController;
