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


}

module.exports = userService;