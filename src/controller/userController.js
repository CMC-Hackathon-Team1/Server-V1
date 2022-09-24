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

        const createPersonaResult = await this.userService.createUserPersona(userId, personaId, nickname, introduction, profileImgUrl);

        return res.send(createPersonaResult);
    };
};

module.exports = userController;
