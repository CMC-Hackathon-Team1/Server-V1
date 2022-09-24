const jwt = require("jsonwebtoken");
const axios = require("axios");
const dotenv = require('dotenv');
dotenv.config();
const UserService = require('../service/user.service');
const PostService = require('../service/post.service');
const { response, errResponse }= require("../utility/response");;


class UserController {
    UserService;
    PostService;

    constructor(){
        this.UserService = new UserService();
        this.PostService = new PostService();
    }

    // 일반 로그인
    logIn = async (req, res) => {

        const {id, password} = req.body;
        
        // id Validation
        if (!id){
            return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        } else if (id.length > 20) {
            return res.send(errResponse(baseResponse.USER_USERID_LENGTH));
        } else if (id.length < 3) {
            return res.send(errResponse(baseResponse.USER_USERID_SHORT));
        }

        // password Validation
        if (!password){
            return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_EMPTY));
        } else if (password.length > 20) {
            return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_LENGTH));
        } else if (password.length < 6) {
            return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_LENGTH));
        } else if (!regexPassword.test(password)) {
            return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_REGEX));
        }

        // 사용자 아이디 존재 여부 확인
        const userIdExistsResult = await this.UserService.checkUserIdExists(id);

        if (!userIdExistsResult){
            return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));
        }

        // 사용자가 입력한 비밀번호와 DB 비밀번호 일치 여부 확인
        const passwordCheckResult = await this.UserService.checkUserPassword(id, password);

        if (!passwordCheckResult){
            return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_WRONG));
        }

        const userIdx = await this.UserService.retrieveUserIdxById(id);

        // 토큰 발행
        let token = await jwt.sign({  
            idx: userIdx
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d",
            subject: "userInfo",
        });

        // 데이터베이스 토큰 저장
        const userToken = await this.UserService.postUserToken(userIdx, token);

        // header에는 token, body에는 json을 담아 response
        return res.header({'Authorization' : `Bearer ${token}`})
                    .send(response(baseResponse.SUCCESS));
    }

    // 카카오 로그인
    kakaoLogin = async (req, res) => {

        let user_kakao_profile;
        let accessToken = req.headers['x-access-token'] || req.headers['authorization'];
        accessToken = accessToken.replace(/^Bearer\s+/, "");
        // 프론트에서 받은 access token을 카카오 서버로 보내서 사용자 정보 가져옴
        try {
            user_kakao_profile = await axios({
                method: 'GET',
                url: 'https://kapi.kakao.com/v2/user/me',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        } catch(err) {   // 카카오 access token 만료 등?
            console.log(err);
            return res.send(errResponse(baseResponse.ACCESS_TOKEN_EMPTY));
        }

        // 카카오 서버에서 받아온 kakaoId
        const kakaoId = String(user_kakao_profile.data.id);   // 카카오 고유ID

        /**
         * 사용자의 socialId 고유번호가 DB에 존재하는지 체크
         * 존재하면? -> 기존에 있던 유저 -> 바로 JWT 발급 및 로그인 처리
         * 존재하지 않는다면? -> 회원가입 API 진행
         */
        const isKakaoExist = await this.UserService.checkSocialId(kakaoId);

        if (!isKakaoExist) {
            return res.send(response(baseResponse.SIGNIN_ERROR));
        }
        
        // 유저 식별자 가져오기
        const userIdx = await this.UserService.retrieveUserIdxByKakaoId(kakaoId);
        
        // jwt 토큰 생성
        let token = await jwt.sign(
        {  // 토큰의 내용 (payload)
            userIdx: userIdx
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d",
            subject: "userInfo",
        });

        // 데이터베이스 토큰 저장
        const userToken = await this.UserService.postUserToken(userIdx, token);

        // 토큰을 보내며 로그인처리 완료
        return res.header({'Authorization' : `Bearer ${token}`})
                    .send(response(baseResponse.SUCCESS));
    };

    // 자동로그인
    autoLogin = async (req, res) => {
        const userIdxFromJWT = req.verifiedToken.idx;
        console.log(`[Auto-Login API] userIdx: ${userIdxFromJWT}`);
        return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
    };

    // 회원가입
    signUp = async (req, res) => {

        const { phone, authNumber, name, password, birth, id } = req.body;

        // phone validation
        if (!phone){
            return res.send(errResponse(baseResponse.USER_PHONENUMBER_EMPTY));
        } else if (phone.length !== 11) {
            return res.send(errResponse(baseResponse.USER_PHONENUMBER_LENGTH));
        } else if (!regexPhone.test(phone)) {
            return res.send(errResponse(baseResponse.USER_PHONENUMBER_NOT_MATCH));
        }

        // phone authentication 
        if (authNumber!==123456){
            return res.send(errResponse(baseResponse.AUTH_NUMBER_WRONG))
        } 

        // name validation
        if (!name){
            return res.send(errResponse(baseResponse.USER_NAME_EMPTY));
        } else if (name.length > 20) {
            return res.send(errResponse(baseResponse.USER_NAME_LENGTH));
        } 

        // password validation
        if (!password){
            return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_EMPTY));
        } else if (password.length > 20) {
            return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_LENGTH));
        } else if (password.length < 6) {
            return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_LENGTH));
        } else if (!regexPassword.test(password)) {
            return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_REGEX));
        }

        // birth validation
        if (!birth){
            return res.send(errResponse(baseResponse.SIGNUP_BIRTH_EMPTY));
        } else if (!regexDate.test(birth)) {
            return res.send(errResponse(baseResponse.SIGNUP_BIRTH_REGEX));
        }

        // id Validation
        if (!id){
            return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        } else if (id.length > 20) {
            return res.send(errResponse(baseResponse.USER_USERID_LENGTH));
        } else if (id.length < 3) {
            return res.send(errResponse(baseResponse.USER_USERID_SHORT));
        }

        // 사용자 아이디 존재 여부 확인
        const userIdExistsResult = await this.UserService.checkUserIdExists(id);
        if (userIdExistsResult){
            return res.send(errResponse(baseResponse.USER_USERID_EXIST));
        }
        
        const userSignUpResult = await this.UserService.postSignUp(phone, name, password, birth, id, '0', '0');


        return res.send(response(baseResponse.SUCCESS));
    }

    // 소셜 로그인 유저 회원가입
    socialSignUp = async (req, res) => {

        const { kakaoId, phone, authNumber, name, birth, id } = req.body;


        if (!kakaoId){
            return res.send(errResponse(baseResponse.KAKAO_ID_EMPTY));
        }

        // phone validation
        if (!phone){
            return res.send(errResponse(baseResponse.USER_PHONENUMBER_EMPTY));
        } else if (phone.length !== 11) {
            return res.send(errResponse(baseResponse.USER_PHONENUMBER_LENGTH));
        } else if (!regexPhone.test(phone)) {
            return res.send(errResponse(baseResponse.USER_PHONENUMBER_NOT_MATCH));
        }

        // phone authentication 
        if (authNumber!==123456){
            return res.send(errResponse(baseResponse.AUTH_NUMBER_WRONG))
        } 

        // name validation
        if (!name){
            return res.send(errResponse(baseResponse.USER_NAME_EMPTY));
        } else if (name.length > 20) {
            return res.send(errResponse(baseResponse.USER_NAME_LENGTH));
        }
        // birth validation
        if (!birth){
            return res.send(errResponse(baseResponse.SIGNUP_BIRTH_EMPTY));
        } else if (!regexDate.test(birth)) {
            return res.send(errResponse(baseResponse.SIGNUP_BIRTH_REGEX));
        }

        // id Validation
        if (!id){
            return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        } else if (id.length > 20) {
            return res.send(errResponse(baseResponse.USER_USERID_LENGTH));
        } else if (id.length < 3) {
            return res.send(errResponse(baseResponse.USER_USERID_SHORT));
        }

        // 사용자 아이디 존재 여부 확인
        const userIdExistsResult = await this.UserService.checkUserIdExists(id);

        if (userIdExistsResult){
            return res.send(errResponse(baseResponse.USER_USERID_EXIST));
        }
        
        await this.UserService.postSignUp(phone, name, 'socailUser', birth, id, 1, kakaoId);

        return res.send(response(baseResponse.SUCCESS));
    }

    // 사용자 계정 사용 가능 확인
    checkIdAvailable = async (req, res) => {

        const id = req.body.id;
        // id Validation
        if (!id){
            return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        } else if (id.length > 20) {
            return res.send(errResponse(baseResponse.USER_USERID_LENGTH));
        } else if (id.length < 3) {
            return res.send(errResponse(baseResponse.USER_USERID_SHORT));
        }

        // 사용자 아이디 존재 여부 확인
        const userIdExistsResult = await this.UserService.checkUserIdExists(id);

        if (userIdExistsResult){
            return res.send(errResponse(baseResponse.USER_USERID_EXIST));
        }

        return res.send(response(baseResponse.SUCCESS));
    }

    // 본인 정보 보기
    getUserInfo = async (req, res) => {
        
        const userIdxInfoFromToken = req.verifiedToken.idx;
        const userIdx = userIdxInfoFromToken;

        console.log(userIdx);
        const page = req.query.page;

        // validation
        if (!userIdx) {
            return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        } else  if (userIdx <= 0) {
            return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
        }

        // 
        if (!page) {
            return res.send(errResponse(baseResponse.PAGENATION_ERROR));
        } else if (page <= 0) {
            return res.send(errResponse(baseResponse.PAGENATION_ERROR));
        }

        const userInfoResult = await this.UserService.getUserInfo(userIdx, page);

        return res.send(response(baseResponse.SUCCESS, userInfoResult));
    }

    // 사용자 피드 조회
    getUserFeed = async (req, res) => {
        const userIdxInfoFromToken = req.verifiedToken.idx;
        const userIdx = userIdxInfoFromToken;
        const page = req.query.page;

        console.log(userIdx);

        const userFeedResult = await this.PostService.retrieveUserFeed(userIdx, page);

        return res.send(userFeedResult);
    }

    // 전화번호로 비밀번호 변경하기
    patchPassword = async (req, res) => {
        
        const { phone, password } = req.body;

        // phone validation
        if (!phone){
            return res.send(errResponse(baseResponse.USER_PHONENUMBER_EMPTY));
        } else if (phone.length !== 11) {
            return res.send(errResponse(baseResponse.USER_PHONENUMBER_LENGTH));
        } else if (!regexPhone.test(phone)) {
            return res.send(errResponse(baseResponse.USER_PHONENUMBER_NOT_MATCH));
        }

        // password Validation
        if (!password){
            return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_EMPTY));
        } else if (password.length > 20) {
            return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_LENGTH));
        } else if (password.length < 6) {
            return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_LENGTH));
        } else if (!regexPassword.test(password)) {
            return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_REGEX));
        }

        // 소셜회원 여부 확인 - 가입시 비밀번호 입력 안하기 때문에 변경 불가
        // const checkSocialUserResult = await this.UserService.checkUserType(userIdx);
        // if (checkSocialUserResult== 0) {
        //     return res.send(errResponse(baseResponse.SIGNIN_PASSWORD_TYPE));
        // }

        const changedPasswordResult = await this.UserService.patchPassword(phone, password);

        return res.send(changedPasswordResult)
    }

    // 내 프로필 정보 변경
    patchProfile = async (req, res) => {

        const userIdxInfoFromToken = req.verifiedToken.idx;
        const userIdx = userIdxInfoFromToken;
        const { profileImgUrl, name, id, website, introduce } = req.body;

        // website, introduce는 nullable하기때문에 validation 하지 않음
        // 사용자 이름 validation
        if (!name){
            return res.send(errResponse(baseResponse.USER_NAME_EMPTY));
        } else if (name.length > 20) {
            return res.send(errResponse(baseResponse.USER_NAME_LENGTH));
        }

        // id validation
        if (!id){
            return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        } else if (id.length > 20) {
            return res.send(errResponse(baseResponse.USER_USERID_LENGTH));
        } else if (id.length < 3) {
            return res.send(errResponse(baseResponse.USER_USERID_SHORT));
        }

        // 변경하려는 아이디 존재 여부 확인
        const userIdExistsResult = await this.UserService.checkUserIdExists(id);

        if (userIdExistsResult){
            return res.send(errResponse(baseResponse.USER_USERID_EXIST));
        }

        const changeProfileResult = await this.UserService.changeUserProfile(profileImgUrl, name, id, website, introduce, userIdx);

        return res.send(changeProfileResult);
    }

    // 계정 공개여부 설정
    patchPrivate = async (req, res) => {
        
        const userIdxInfoFromToken = req.verifiedToken.idx;
        const userIdx = userIdxInfoFromToken;
        // 비공개/공개 여부를 설정한 코드 1-비공개 / 0-공개
        const privateCode = req.query.privateCode;

        // validation
        if (!privateCode) {
            return res.send(errResponse(baseResponse.REQUEST_CODE_EMPTY));
        } else if ( privateCode > 1 || privateCode < 0) {
            return res.send(errResponse(baseResponse.REQUEST_CODE_ERROR));
        }
        
        const checkPrivate = await this.UserService.changePrivate(userIdx, privateCode);

        return res.send(checkPrivate);
    }

    // 사용자 팔로우
    followUser = async (req, res) => {
        
        const userIdxInfoFromToken = req.verifiedToken.idx;
        const userIdx = userIdxInfoFromToken[0].userIdx;
        const followUserId = req.body.id;

        // id validation
        if (!followUserId){
            return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        } 

        // 팔로우 대상 식별자
        const checkUserIdResult = await this.UserService.retrieveUserIdxById(followUserId);
        if (!checkUserIdResult){
            return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));
        } else if (userIdx === checkUserIdResult) {
            return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
        }

        // 이미 팔로우중인 사용자인 경우 성공했다고 리턴(UX 고려?)
        const checkNowFollowing = await this.UserService.checkfollowStatus(userIdx, followUserId, 0);
        if (checkNowFollowing) {
            return res.send(errResponse(baseResponse.SUCCESS));
        } 

        // 팔로우 요청이 이미 있는 상황에는 그냥 요청에 성공했다고 알려줌(UX 고려?)
        const checkFollowWaiting = await this.UserService.checkfollowStatus(userIdx, followUserId, 2);
        if (checkFollowWaiting) {
            return res.send(errResponse(baseResponse.FOLLOW_REQUEST_SUCCESS));
        }

        const followUserResult = await this.UserService.followUser(userIdx, followUserId);

        return res.send(followUserResult);
    }

    // 사용자 언팔로우
    unfollowUser = async (req, res) => {
        
        const userIdxInfoFromToken = req.verifiedToken.idx;
        const userIdx = userIdxInfoFromToken[0].userIdx;
        const unfollowUserId = req.body.id;

        if (!unfollowUserId) {
            return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        }
        // 팔로우 대상 식별자
        const checkUserIdResult = await this.UserService.retrieveUserIdxById(unfollowUserId);
        if (!checkUserIdResult){
            return res.send(errResponse(baseResponse.USER_USERID_NOT_EXIST));
        } else if (userIdx === checkUserIdResult) {
            return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
        }

        // 이미 팔로우하고있지 않은 사용자인 경우 성공했다고리턴(UX 고려?)
        const checkUnfollowing = await this.UserService.checkfollowStatus(userIdx, unfollowUserId, 1);
        if (checkUnfollowing) {
            return res.send(errResponse(baseResponse.SUCCESS));
        } 

        const followUserResult = await this.UserService.unfollowUser(userIdx, unfollowUserId);

        return res.send(followUserResult);
    }

    // 내게 들어온 팔로우 요청 가져오기
    getFolowRequests = async (req, res) => {

        const userIdxInfoFromToken = req.verifiedToken.idx;
        const userIdx = userIdxInfoFromToken[0].userIdx;

        // 사용자 계정이 비공개 계정인지 확인
        const checkPrivateResult = await this.UserService.isUserPrivateTrue(userIdx);
        if (!checkPrivateResult){
            return res.send(errResponse(baseResponse.USER_PRIVATE_ERROR));
        }

        const userFollowRequestResult = await this.UserService.checkMyFollowRequest(userIdx);

        return res.send(userFollowRequestResult);
    }

    // 내게 들어온 팔로우 요청 수락/거절
    patchFollowRequests = async (req, res) => {

        const userIdxInfoFromToken = req.verifiedToken.idx;
        const userIdx = userIdxInfoFromToken[0].userIdx;
        // 요청 수락/거절 정보를 코드로 넘겨받는다 0-수락/1-거절
        const responseCode = req.query.responseCode;
        const followeeId = req.body.id;

        // vallidation
        if (!followeeId) {
            return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
        }

        if (!responseCode) {
            return res.send(errResponse(baseResponse.REQUEST_CODE_EMPTY));
        } else if (!regexNum.test(responseCode)) {
            return res.send(errResponse(baseResponse.REQUEST_CODE_ERROR));
        } else if (responseCode > 1 || responseCode < 0) {
            return res.send(errResponse(baseResponse.REQUEST_CODE_ERROR));
        }

        const checkRequestExist = await this.UserService.getFolowRequestExists(userIdx, followeeId);
        if (!checkRequestExist) {
            return res.send(errResponse(baseResponse.FOLLOW_REQUEST_EMPTY));
        }

        const responseResult = await this.UserService.changeFollowStatus(userIdx, followeeId, responseCode);

        return res.send(responseResult);
    }

    // 회원 탈퇴
    patchUserStatus = async (req, res) => {
        const userIdxInfoFromToken = req.verifiedToken.idx;
        const userIdx = userIdxInfoFromToken[0].userIdx;

        const deleteUserResult = await this.UserService.changeUserStatus(userIdx);

        return res.send(deleteUserResult);
    }

}

module.exports = UserController;
