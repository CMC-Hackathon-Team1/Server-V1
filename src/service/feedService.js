const feedDAO = require('../DAO/feedDAO');

const { pool } = require('../config/db');

const baseResponse = require('../utility/baseResponseStatus')
const { errResponse, response } = require('../utility/response');

class feedService {

    feedDAO;
    // CommentRepository;
    // PostRepository;
    // UserRepository;

    constructor() {
        this.feedDAO = new feedDAO();
        // this.CommentRepository = new CommentRepository();
        // this.PostRepository = new PostRepository();
        // this.UserRepository = new UserRepository();
    }

    // API 2.4 - 게시물 (최신순으로) 리스트 조회
    retrieveFeedList = async (profileId) => {
        const connection = await pool.getConnection(async (connection) => connection);
        try {
            const feedListResult = await this.feedDAO.selectFeedList(connection, profileId);
            return response(baseResponse.SUCCESS, feedListResult);

        } catch (e) {
            console.log(e);
            return errResponse(baseResponse.DB_ERROR);
   
        } finally {
            connection.release();
        }
    }

    retrieveMyFeedDate = async (year,month) => {
        const connection = await pool.getConnection(async (connection) => connection);
        try {

            await connection.beginTransaction();
            
    
            const myFeedDateSet = await this.feedDAO.retrieveMyFeedDate(connection, year,month);
    
            const myFeedDate = Array.from(myFeedDateSet);
            await connection.commit();
            
            return response(baseResponse.SUCCESS, myFeedDate);
        } catch (e) {
            console.log(e);
            await connection.rollback();
            return errResponse(baseResponse.DB_ERROR);

        } finally {
            connection.release();
        }
    }
    
}

module.exports = feedService;