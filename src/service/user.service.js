const bcrypt = require('bcrypt');
const { pool } = require('../asset/db');
const UserRepository = require('../repository/user.repository');
const PostRepository = require('../repository/post.repository');
const { response, errResponse } = require('../utility/response');
const baseResponse = require('../utility/baseResponseStatus');

class UserService {
    UserRepository;
    PostRepository;

    constructor() {
        this.UserRepository = new UserRepository();
        this.PostRepository = new PostRepository();
    }
    
    // 사용자의 ID가 존재하는지 확인
    checkUserIdExists = async (userId) => {
        try {
            const connection = await pool.getConnection((connection) => connection);
            const checkedUser = await this.UserRepository.checkUserExistsByUserId(connection, userId);

            connection.release();
            
            // 사용자가 존재하지 않을 때
            if (checkedUser == 0){
                return false;
            }

            return true;
        } catch (e) {
            console.log(e);
            return errResponse(baseResponse.DB_ERROR);
        }
    }

    // 사용자의 비밀번호가 일치하는지 확인
    checkUserPassword = async (userId, userPassword) => {
        try {
            const connection = await pool.getConnection((connection) => connection);
            const checkedUserPassword = await this.UserRepository.checkUserPassword(connection, userId);

            connection.release();

            // DB 저장된 비밀번호와 사용자가 입력한 비밀번호가 일치하는지 확인
            const match = bcrypt.compareSync(userPassword, checkedUserPassword[0]["password"]);
            
            if (!match){
                return false;
            }
            return true;
        } catch (e) {
            console.log(e);
            return errResponse(baseResponse.DB_ERROR);
        }

    }

    // 회원정보 데이터베이스에 넣기
    postSignUp = async (phone, name, password, birth, id, userType, socialId) => {
        const connection = await pool.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();
            // 비밀번호 암호화
            const hashedPassword = await bcrypt.hash(password, 10);
            const signUpResult = await this.UserRepository.insertUser(connection, phone, name, hashedPassword, birth, id, userType, socialId);

            await this.UserRepository.insertUserLog(connection, signUpResult.insertId, 0);

            await connection.commit();

            return response(signUpResult);
        } catch (e){
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 소셜 회원 검증
    checkSocialId = async (socialId) => {
        try {
            const connection = await pool.getConnection(async (connection) => connection);
            const checkedResult = await this.UserRepository.getSocialId(conn, socialId);

            connection.release();
            
            // 사용자가 존재하지 않을 때
            if (checkedResult == 0){
                return false;
            }
            return true;
        } catch (e){
            console.log(e);
            return errResponse(baseResponse.DB_ERROR);
        }
    }

    // 카카오ID로 유저 식별자 가지고 오기
    retrieveUserIdxByKakaoId = async (socialId) => {
        try {
            const connection = await pool.getConnection(async (connection) => connection);
            const userIdxResult = await this.UserRepository.getUserIdxBySocialId(connection, socialId);

            connection.release();

            return userIdxResult[0].userIdx;
        } catch (e){
            console.log(e);
            return errResponse(baseResponse.DB_ERROR);
        }
    }

    // ID로 유저 식별자 가지고 오기
    retrieveUserIdxById  = async (userId) =>{
        try {
            const connection = await pool.getConnection(async (connection) => connection);
            const userIdxResult = await this.UserRepository.getUserIdxByUserId(connection, userId);
            
            connection.release();

            // 없는 경우 false 반환
            if (userIdxResult[0] == null){
                return false;
            }

            // userIdx 뽑아서 리턴
            return userIdxResult[0].userIdx;
        } catch (e){
            console.log(e);
            return errResponse(baseResponse.DB_ERROR);
        }
    }

    // 사용자 본인 프로필 정보 가지고 오기
    getUserInfo = async (userIdx, page) => {
        const connection = await pool.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();

            const userProfileResult = await this.UserRepository.getUserProfile(connection, userIdx);
            const offset = (page-1)*9;
            
            
            const userPostResult = await this.PostRepository.selectUserPhotos(connection, userIdx, offset);
            await this.UserRepository.insertUserLog(connection, userIdx, 1);

            await connection.commit();
            const userResult = { userProfileResult, userPostResult };

            return userResult;
        } catch (e){
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 사용자 핸드폰번호로 비밀번호 업데이트하기
    patchPassword = async (phone, password) => {
        const connection = await pool.getConnection(async(connection) => connection);
        try {
            await connection.beginTransaction();

            const hashedPassword = await bcrypt.hash(password, 10);
            const userPhoneCheckResult = await this.UserRepository.getUserIdxByPhone(connection, phone);

            // 전화번호에 해당하는 userIdx 확인
            if (!userPhoneCheckResult){
                await connection.commit();

                return errResponse(baseResponse.USER_PHONENUMBER_NOT_MATCH);
            }
            const userIdx = userPhoneCheckResult[0].userIdx;

            const passwordParams = [ hashedPassword, userIdx ];
            await this.UserRepository.updatePassword(connection, passwordParams);

            await connection.commit();

            return response(baseResponse.SUCCESS);
        } catch (e) {
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 사용자 프로필 업데이트하기
    changeUserProfile = async (profileImgUrl, name, id, website, introduce, userIdx) => {
        const connection = await pool.getConnection(async(connection) => connection);
        try {
            await connection.beginTransaction();
            const updatedProfileResult = await this.UserRepository.updateUserProfile(connection, profileImgUrl, name, id, website, introduce, userIdx);
            
            await this.UserRepository.insertUserLog(connection, userIdx, 2);

            await connection.commit();

            return response(baseResponse.SUCCESS);
        } catch (e){
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 계정 공개여부 변경하기
    changePrivate = async (userIdx, privateCode) => {
        try {
            const connection = await pool.getConnection(async(connection) => connection);
            const updatedPrivateResult = await this.UserRepository.updatePrivate(connection, userIdx, privateCode);
            
            connection.release();
            return response(baseResponse.SUCCESS);
        } catch (e){
            console.log(e);

            return errResponse(baseResponse.DB_ERROR);
        }
    }

    // 팔로우 정보 확인(boolean return)
    checkfollowStatus = async (userIdx, followUserId, status) =>{
        try {
            const connection = await pool.getConnection(async(connection) => connection);
            const checkFollowingResult = await this.UserRepository.checkFollowByTargetId(connection, userIdx, followUserId, status);

            connection.release();

            // 해당 정보 없을시 false 반환
            if (checkFollowingResult[0].success == 0) {
                return false;
            }

            return true;
        } catch (e){
            console.log(e);

            return errResponse(baseResponse.DB_ERROR);
        }
    }

    // 팔로우 요청 정보 확인
    getFolowRequestExists = async (userIdx, followeeId) => {
        try {
            const connection = await pool.getConnection(async(connection) => connection);
            const checkFollowingResult = await this.UserRepository.checkFollowByRequesterId(connection, userIdx, followeeId, 2);

            connection.release();

            // 해당 정보 없을시 false 반환
            if (checkFollowingResult[0].success == 0) {
                return false;
            }

            return true;
        } catch (e){
            console.log(e);

            return errResponse(baseResponse.DB_ERROR);
        }
    }

    // 팔로우하기
    followUser = async (userIdx, followUserId) => {
        const connection = await pool.getConnection(async(connection) => connection);
        try {
            await connection.beginTransaction();
            
            const userPrivateInfo = await this.UserRepository.checkUserPrivateById(connection, followUserId);
            const followHistoryInfo = await this.UserRepository.checkFollowByTargetId(connection, userIdx, followUserId, 1); // 이전 팔로우 기록 확인
            
            // 상대방이 비공개 계정인 경우
            if (userPrivateInfo[0].success == 1){


                // 이전에 팔로우 했다가 지운 상태인지 확인
                followHistoryInfo[0].success == 1 ?
                    //  있다면 status를 요청 대기중으로 업데이트
                    ( await this.UserRepository.updateFollowStatusByTargetId(connection, userIdx, followUserId, 2)) :
                    // 없다면 새로운 칼럼으로 요청 대기중을 집어넣는다
                    ( await this.UserRepository.insertFollow(connection, userIdx, followUserId, 2));

                await connection.commit();

                return response(baseResponse.FOLLOW_REQUEST_SUCCESS);
            }
            
            // 상대방이 공개 계정인 경우
            // 이전에 팔로우 했다가 지운 상태인지 확인
            followHistoryInfo[0].success == 1 ?
                // 있다면 기존 칼럼 status를 업데이트
                ( await this.UserRepository.updateFollowStatusByTargetId(connection, userIdx, followUserId, 0)) :
                // 없다면 새로운 칼럼을 삽입
                ( await this.UserRepository.insertFollow(connection, userIdx, followUserId, 0));

            await connection.commit();
            
            return response(baseResponse.SUCCESS);
        } catch (e) {
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 팔로우 취소하기
    unfollowUser = async (userIdx, unfollowUserId) => {
        try {
            const connection = await pool.getConnection(async(connection) => connection);
            const unfollowResult = await this.UserRepository.updateFollowStatusByTargetId(connection, userIdx, unfollowUserId, 1);

            connection.release();
            return response(baseResponse.SUCCESS);
        } catch (e) {
            console.log(e);

            return errResponse(baseResponse.DB_ERROR);
        }
    }

    // 비공개 계정 여부 확인
    isUserPrivateTrue = async (userIdx) => {
        try {
            const connection = await pool.getConnection(async(connection) => connection);
            const userPrivateInfo = await this.UserRepository.checkUserPrivateByUserIdx(connection, userIdx);
            
            connection.release();

            if (userPrivateInfo[0].success == 0) {
                return false;
            }

            return true;
        } catch (e) {
            console.log(e);

            return errResponse(baseResponse.DB_ERROR);
        }
    }

    // 내 팔로우 요청 확인
    checkMyFollowRequest = async (userIdx) => {
        try {
            const connection = await pool.getConnection(async(connection) => connection);
            const userFollowRequestList = await this.UserRepository.checkUserFollowRequests(connection, userIdx);
            
            connection.release();

            return response(baseResponse.SUCCESS, userFollowRequestList);
        } catch (e) {
            console.log(e);

            return errResponse(baseResponse.DB_ERROR);
        }
    }

    // 사용자 팔로우 요청 상태 업데이트
    changeFollowStatus = async (userIdx, followeeId, responseCode) => {
        try {
            const connection = await pool.getConnection(async(connection) => connection);
            const updateFollowStatusResult = await this.UserRepository.updateFollowStatusByRequesterId(connection, userIdx, followeeId, responseCode);

            connection.release();

            return response(baseResponse.SUCCESS);
        } catch (e) {
            console.log(e);

            return errResponse(baseResponse.DB_ERROR);
        }
    }

    // 사용자 탈퇴
    changeUserStatus = async (userIdx) => {
        const connection = await pool.getConnection(async(connection) => connection);
        try {
            await connection.beginTransaction();

            // 사용자 삭제상태로 바꾸고 id, token, 프로필 사진 없애기
            await this.UserRepository.updateUserStatus(connection, userIdx);
            await this.UserRepository.updateUserIdNull(connection, userIdx);
            await this.UserRepository.updateUserTokenNull(connection, userIdx);
            await this.UserRepository.updateUserProfileImgUrlStatus(connection, userIdx);

            // 게시물 없애기
            await this.UserRepository.updatePostStatusInactive(connection, userIdx);
            await this.UserRepository.updatePostImgStatusInactive(connection, userIdx);

            // 댓글 없애기
            await this.UserRepository.updateCommentStatusInactive(connection, userIdx);

            // 좋아요 없애기
            await this.UserRepository.updateCommentLikeStatusInactive(connection, userIdx);
            await this.UserRepository.updatePostLikeStatusInactive(connection, userIdx);

            // 팔로우 없애기
            await this.UserRepository.updateFollowStatusInactive(connection, userIdx);

            // 로그 기록하기
            await this.UserRepository.insertUserLog(connection, userIdx, 3);

            await connection.commit(); 

            return response(baseResponse.SUCCESS);
        } catch (e) {
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 토큰 넣기 + 로그인 시간 업데이트 - 로그인때 사용
    postUserToken = async (userIdx, token) => {
        const connection = await pool.getConnection(async(conn)=> conn);
        try {
            await connection.beginTransaction();

            const checkValidAccessResult = await this.UserRepository.updateUserToken(connection, userIdx, token);
            await this.UserRepository.updateLoginTime(connection, userIdx);

            await connection.commit();

            return checkValidAccessResult;
        } catch (e) {
            console.log(e);
            await connection.rollback();

            return response(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 유효된 토큰인지 확인
    checkValidAccess = async (userIdx) => {
        try {
            const connection = await pool.getConnection(async(conn)=> conn);
            const checkValidAccessResult = await this.UserRepository.selectUserTokenByIdx(connection, userIdx);

            connection.release();

            return checkValidAccessResult;
        } catch (e) {
            console.log(e);

            return response(baseResponse.DB_ERROR);
        }
    }

    // 사용자 타입 확인 - 자체로그인, 소셜로그인
    checkUserType = async (userIdx) => {
        try {
            const connection = await pool.getConnection(async(conn)=> conn);
            const userTypeResult = await this.UserRepository.getUserType(connection, userIdx);

            connection.release();

            return userTypeResult;
        } catch (e) {
            console.log(e);

            return response(baseResponse.DB_ERROR);
        }
    }



}

module.exports = UserService;