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

    getFeedList = async (req, res) => {

        let { profileId } = req.query;
        
        // Validation
        if (!profileId){
            return res.send(errResponse(baseResponse.USER_PROFILEID_EMPTY));
        }
        if (profileId <= 0){
            return res.send(errResponse(baseResponse.USER_PROFILEID_LENGTH));
        }

        const retrieveFeedListResult = await this.feedService.retrieveFeedList(profileId);
    
        return res.send(retrieveFeedListResult);
    }

    

    getCalendarInfo = async (req, res) => {

        let { year,month } = req.query;
        
        console.log(year,month);
        console.log(year>1900);
        if (!(year>=1900 && year <=2100)){ //2000년도~300년도
            return res.send(errResponse(baseResponse.YEAR_RANGE_OUT));
        }
        if (!(month>=1 && month<=12)) { // 1월~ 12월
            return res.send(errResponse(baseResponse.MONTH_RANGE_OUT));
        }
        
        const myFeedDate = await this.feedService.retrieveMyFeedDate(year,month);
    
        console.log("넘어왔을꺼 같진 않은데 그지?");
        
        return res.send(myFeedDate);
    }

}

module.exports = feedController;


