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
    
    // API 2.4 - 게시물 리스트 조회
    getFeedList = async (req, res) => {

        let { profileId , page, pageSize } = req.query;
        
        // Validation
        if (!profileId){
            return res.send(errResponse(baseResponse.USER_PROFILEID_EMPTY));
        }
        if (profileId <= 0){
            return res.send(errResponse(baseResponse.USER_PROFILEID_LENGTH));
        }

        if(!page || !pageSize){
            return res.send(errResponse(baseResponse.PAGING_PARAMS_EMPTY));
        }

        const retrieveFeedListResult = await this.feedService.retrieveFeedList(profileId, page, pageSize);
    
        return res.send(retrieveFeedListResult);
    }

    

    getCalendarInfo = async (req, res) => {

        let { year,month } = req.query;
        
        console.log(year,month);
        console.log(year>1900);
        if (!(year>=1900 && year <=2100)){ 
            return res.send(errResponse(baseResponse.YEAR_RANGE_OUT));
        }
        if (!(month>=1 && month<=12)) { // 1월~ 12월
            return res.send(errResponse(baseResponse.MONTH_RANGE_OUT));
        }
        
        const myFeedDate = await this.feedService.retrieveMyFeedDate(year,month);
    
        console.log("넘어왔을꺼 같진 않은데 그지?");
        
        return res.send(myFeedDate);
    }

    getFeedsByDate = async (req, res) => {
        let { year,month,day } = req.query;
        let profileId=req.params.profileId;

        console.log(year,month);
        console.log(year>1900);
        if (!(year>=1900 && year <=2100)){ 
            return res.send(errResponse(baseResponse.YEAR_RANGE_OUT));
        }
        if (!(month>=1 && month<=12)) { // 1월~ 12월
            return res.send(errResponse(baseResponse.MONTH_RANGE_OUT));
        }
        if (!(day>=1 && day<=31)) { // 1일 ~ 31일
            return res.send(errResponse(baseResponse.DAY_RANGE_OUT));
        }
        
        const myFeedByDate = await this.feedService.getFeedsByDate(year,month,day,profileId);
        
        return res.send(myFeedByDate);
    }


    // API 2.9 - 게시물 내용 조회
    getFeedInfo = async (req, res) => {

        let { profileId, feedId } = req.query;

        if (!profileId){
            return res.send(errResponse(baseResponse.USER_PROFILEID_EMPTY));
        }
        if (profileId <= 0){
            return res.send(errResponse(baseResponse.USER_PROFILEID_LENGTH));
        }

        if (!feedId){
            return res.send(errResponse(baseResponse.USER_FEEDID_EMPTY));
        }
        if (feedId <= 0){
            return res.send(errResponse(baseResponse.USER_FEEDID_LENGTH));
        }

        const feedInfoResult = await this.feedService.retrieveFeedInfo(profileId, feedId);
        
        return res.send(feedInfoResult);
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

    // 글 삭제
    deleteFeed = async (req, res) => {
        const profileId = 1;    // 더미 id
        const feedId = req.params.feedId;

        // if (!profileId){
        //     return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        // }

        const feedDeleteResult = await this.feedService.deleteFeedInfo(profileId, feedId);

        return res.send(feedDeleteResult);
    }
    
    // 글 수정
    patchFeed = async (req, res) => {
        const profileId = 1;    // 더미 id
        const feedId = req.params.feedId;
        const { category, hashtag, content, status } = req.body;

        // if (!profileId){
        //     return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        // }

        const feedUpdateResult = await this.feedService.updateFeedInfo(profileId, feedId, category, hashtag, content, status);

        return res.send(feedUpdateResult);
    }

    // 게시글 좋아요
    postFeedLike = async (req, res) => {
        const { feedId, profileId } = req.body;

        if (!feedId) {
            return res.send(errResponse(baseResponse.USER_FEEDID_EMPTY));
        } else if (feedId < 0) {
            return res.send(errResponse(baseResponse.USER_FEEDID_LENGTH));
        }

        if (!profileId) {
            return res.send(errResponse(baseResponse.USER_PROFILEID_EMPTY));
        } else if (profileId < 0) {
            return res.send(errResponse(baseResponse.USER_PROFILEID_LENGTH));
        }

        const FeedLikeResult = await this.feedService.createFeedLike(feedId, profileId);

        return res.send(FeedLikeResult);
    }

    // 게시글 좋아요 취소
    deleteFeedLike = async (req, res) => {
        const { feedId, profileId } = req.body;

        if (!feedId) {
            return res.send(errResponse(baseResponse.USER_FEEDID_EMPTY));
        } else if (feedId < 0) {
            return res.send(errResponse(baseResponse.USER_FEEDID_LENGTH));
        }

        if (!profileId) {
            return res.send(errResponse(baseResponse.USER_PROFILEID_EMPTY));
        } else if (profileId < 0) {
            return res.send(errResponse(baseResponse.USER_PROFILEID_LENGTH));
        }

        const deleteFeedLikeResult = await this.feedService.removeFeedLike(feedId, profileId);

        return res.send(deleteFeedLikeResult);
    }

}

module.exports = feedController;


