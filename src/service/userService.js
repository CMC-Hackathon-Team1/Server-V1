const userDAO = require('../DAO/userDao');

const { pool } = require('../config/db');

const baseResponse = require('../utility/baseResponseStatus')
const { errResponse, response } = require('../utility/response');

class userService {
    userDAO;

    constructor() {
        this.userDAO = new userDAO();
    }

    retrieveUserProfiles = async (userId) => {
        const connection = await pool.getConnection(async (connection) => connection);
        try {
            
            
            const retrieveUserProfilesResult = await this.userDAO.retrieveUserProfiles(connection,userId);
    
            console.log(retrieveUserProfilesResult);
    
            await connection.commit();
            
            return response(baseResponse.SUCCESS, retrieveUserProfilesResult);
        } catch (e) {
            console.log(e);
    
            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }
    
    // 유저 페르소나 생성
    createUserPersona = async (userId, personaId, nickname, introduction, profileImgUrl) => {
        const connection = await pool.getConnection(async (connection) => connection);

        try {
            await connection.beginTransaction();

            // 사용자 ID를 통해 해당 사용자의 페르소나 추가
            const createPersona = await this.userDAO.createPersonaByUserId(connection, userId, personaId, nickname, introduction, profileImgUrl);

            await connection.commit();


            return response(baseResponse.SUCCESS, {"profileId": createPersona.insertId});
        } catch (e) {
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 유저 프로필 갯수 확인
    checkUserPersona = async (userId) => {
        const connection = await pool.getConnection(async (connection) => connection);

        try {
            await connection.beginTransaction();
            
            const checkPersonaCount = await this.userDAO.checkPersona(connection, userId);

            await connection.commit();

            return checkPersonaCount;
        } catch (e) {
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    changeUserPersona = async ( profileId ) => {
        const connection = await pool.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();

            // 사용자의 다른 페르소나를 가지고 온 결과
            const changedUserPersona = await this.userDAO.selectUserOtherPersona(connection, profileId);

            // 사용자 이름
            const userProfileResult = await this.userDAO.selectProfileNameByProfileId(connection, profileId);

            await connection.commit();

            return response(baseResponse.SUCCESS, { 
                personaId: changedUserPersona[0].personaId,
                userProfileName: userProfileResult[0].profileName,
                personaName : changedUserPersona[0].personaName
            });
        } catch (e) {
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    retrieveUserStatics = async (profileId) => {
        const connection = await pool.getConnection(async (connection) => connection);
        try {
            
            const userStatics={};

            const userLikeCount=await this.userDAO.retrieveUserLikeCount(connection,profileId);

            console.log(userLikeCount);
            userStatics.likeCount=userLikeCount.likeCount;


            const userFeedCount = await this.userDAO.retrieveUserFeedCount(connection,profileId);
    
            console.log(userFeedCount);
            userStatics.feedCount=userFeedCount.feedCount;

            
            const userFollowCount = await this.userDAO.retrieveUserFollowCount(connection,profileId);
    
            console.log(userFollowCount);
            userStatics.followCount=userFollowCount.followCount;

            

            await connection.commit();
            
            return response(baseResponse.SUCCESS, userStatics);
        } catch (e) {
            console.log(e);
    
            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 유저 마이페이지 조회
    getUserMyPage = async (profileId, year, month) => {
        const connection = await pool.getConnection(async (connection) => connection);

        try {
            await connection.beginTransaction();

            const getUserMyPageResult = await this.userDAO.getUserMyPageData(connection, profileId, year, month);

            await connection.commit();

            return response(baseResponse.SUCCESS, getUserMyPageResult);
        } catch (e) {
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }    
}

module.exports = userService;