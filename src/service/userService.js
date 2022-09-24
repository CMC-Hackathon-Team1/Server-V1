const userDAO = require('../DAO/userDAO');

const { pool } = require('../config/db');

const baseResponse = require('../utility/baseResponseStatus')
const { errResponse, response } = require('../utility/response');

class userService {

    userDAO;
    // CommentRepository;
    // PostRepository;
    // UserRepository;

    constructor() {
        this.userDAO = new userDAO();
        // this.CommentRepository = new CommentRepository();
        // this.PostRepository = new PostRepository();
        // this.UserRepository = new UserRepository();
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


}

module.exports = userService;