const userService = require('../service/userService');

const baseResponse = require('../utility/baseResponseStatus');
const { errResponse, response } = require('../utility/response');
const regexDate = new RegExp(/(^(19|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/); // YYYYMMDD 확인 정규표현식

// 회원 전체 정보 검색
class userController {
    userService;

    constructor (){
        this.userService = new userService();
    }
    
    
    // 회원 상세 정보 보기
    getUserProfiles = async (req, res) => {
        const userId = req.params.userId;
        if (!userId){
            return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        } else if (userId < 1) {
            return res.send(errResponse(baseResponse.USER_USERIDX_MINUS_INTEGER));
        }

        const retrieveUserProfilesResult = await this.userService.retrieveUserProfiles(userId);
    
        return res.send(retrieveUserProfilesResult);
    }
}

module.exports = userController;
