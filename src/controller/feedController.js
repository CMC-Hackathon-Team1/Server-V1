const feedService = require('../service/feedService');

const baseResponse = require('../utility/baseResponseStatus');
const { errResponse, response } = require('../utility/response');
const regexDate = new RegExp(/(^(19|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/); // YYYYMMDD 확인 정규표현식

// 회원 전체 정보 검색
class feedController {
    feedService;

    constructor (){
        this.feedService = new feedService();
    }

    // 글 추가
    postFeed = async (req, res) => {
        const profileId = 1;    // 더미 id
        const { category, hashtag, content, status, imgUrl} = req.body;

        // if (!profileId){
        //     return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        // }

        const feedWriteResult = await this.feedService.postFeedInfo(profileId, category, hashtag, content, status, imgUrl);

        return res.send(feedWriteResult);
    }
}

module.exports = feedController;
