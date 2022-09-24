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
    retrieveFeedList = async (profileId, page, pageSize) => {
        const connection = await pool.getConnection(async (connection) => connection);
        try {

            let start = 0;
        
            // Paging Validation
            if (page <= 0){
                page = 1;
            } else {
                start = (page - 1) * pageSize;
            }

            const totalDataCountResult = await this.feedDAO.retrieveTotalDataCount(connection, profileId);
            const lastPage = Math.ceil(totalDataCountResult[0].totalDataCount/ pageSize);

            // DB 조회
            const feedListQuery = [profileId , start, parseInt(pageSize)];
            const feedListResult = await this.feedDAO.selectFeedList(connection, feedListQuery);

            const feedListWithPaging = {feedListResult, lastPage};
            return response(baseResponse.SUCCESS, feedListWithPaging);

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
    // API 2.9 게시물 내용 조회
    retrieveFeedInfo = async (profileId, feedId) => {
        const connection = await pool.getConnection(async (connection) => connection);
        try {

            // DB 조회
            const feedInfoQuery = [profileId, feedId];
            const feedInfoResult = await this.feedDAO.selectFeedInfo(connection, feedInfoQuery);

            return response(baseResponse.SUCCESS, feedInfoResult);

        } catch (e) {
            console.log(e);
            return errResponse(baseResponse.DB_ERROR);
            
        } finally {
            connection.release();
        }
    }

    
    
}

module.exports = feedService;