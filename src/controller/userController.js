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
    createPersona = async (req, res) => {
        const { userId, personaId, nickname, introduction, profileImgUrl } = req.body;

        if (!userId) {
            return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        };
        if (userId < 0) {
            return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
        }
        if (!personaId) {
            return res.send(errResponse(baseResponse.USER_PERSONAID_EMPTY));
        };
        if (introduction.length > 100) {
            return res.send(errResponse(baseResponse.USER_STATUSMESSAGE_LENGTH));
        };
        if (!nickname) {
            return res.send(errResponse(baseResponse.SIGNUP_NICKNAME_EMPTY));
        };
        if (nickname.length > 15) {
            return res.send(errResponse(baseResponse.USER_NICKNAME_LENGTH));
        };

        const checkUserPersonaCount = await this.userService.checkUserPersona(userId);

       if (checkUserPersonaCount[0].count >= 3) {
            return res.send(errResponse(baseResponse.PERSONA_COUNT_OVER));
        };

        const createPersonaResult = await this.userService.createUserPersona(userId, personaId, nickname, introduction, profileImgUrl);

        return res.send(createPersonaResult);
    };

    // 페르소나 수정
    changePersona = async (req, res) => {
        const profileId = req.query.profileId;

        if (!profileId) {
            return res.send(errResponse(baseResponse.USER_PROFILEID_EMPTY));
        } else if (profileId < 0) {
            return res.send(errResponse(baseResponse.USER_PROFILEID_LENGTH));
        }

        const changedResult = await this.userService.changeUserPersona(profileId);

        return res.send(changedResult);
    }
    
    getUserStatics = async (req, res) => {
        const profileId = req.params.profileId;

        if (!profileId){
            return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        } else if (profileId < 1) {
            return res.send(errResponse(baseResponse.USER_USERIDX_MINUS_INTEGER));
        }

        const retrieveUserStatics = await this.userService.retrieveUserStatics(profileId);
    
        return res.send(retrieveUserStatics);
    }

    // 페르소나 마이페이지
    userMyPage = async (req, res) => {
        const profileId = req.params.profileId;
        const year = req.query.year;
        const month = req.query.month;

        if (!profileId) {
            return res.send(errResponse(baseResponse.USER_PROFILEID_EMPTY));
        };
        if (profileId < 0) {
            return res.send(errResponse(baseResponse.USER_PROFILEID_LENGTH));
        };

        const userMyPageResult = await this.userService.getUserMyPage(profileId, year, month);

        return res.send(userMyPageResult);
    }
    
};

module.exports = userController;