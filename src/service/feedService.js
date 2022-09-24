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

    // 게시글 쓰기
    postFeedInfo = async (profileId, category, hashtags, content, status, imgUrl) => {
        const connection = await pool.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();

            // Category id 가져오기
            const getCategoryIdResult = await this.feedDAO.selectCategoryId(connection, category);
            const categoryId = getCategoryIdResult[0].categoryId;
            // console.log(categoryId);

            // Hashtag 개수 구하기
            const hashtagList = hashtags.split(', ');
            // console.log(hashtagList);
            const hashtagIdList = [];

            // Hashtag id 전체 가져오기
            for (let i = 0; i < hashtagList.length; i++){
                const getHashtagIdResult = await this.feedDAO.selectHashtagId(connection, hashtagList[i]);
                // console.log(getHashtagIdResult);
                if (getHashtagIdResult.length > 0) {
                    // console.log(getHashtagIdResult[0].hashTagId);
                    hashtagIdList.push(getHashtagIdResult[0].hashTagId);
                }
                // 새로운 hashtag일 경우 db에 추가
                else {
                    const insertNewHashtagResult = await this.feedDAO.insertNewHashtagInfo(connection, hashtagList[i]);
                    const insertedHashtagId = insertNewHashtagResult.insertId;
                    // console.log(insertedHashtagId);
                    // Profile Hashtag 테이블에도 매핑 추가
                    const insertNewHashtagProfileResult = await this.feedDAO.insertNewHashtagProfileInfo(connection, [profileId, insertedHashtagId]);
                    // console.log(insertNewHashtagProfileResult.insertId);
                }
            }
            // console.log(hashtagIdList);

            // Feed 추가
            const insertFeedResult = await this.feedDAO.insertFeedInfo(connection, [profileId, content, status, imgUrl]);
            const insertedFeedId = insertFeedResult.insertId;
            // console.log(insertedFeedId);

            // Category 매핑 추가
            const insertFeedCategoryMapResult = await this.feedDAO.insertFeedCategoryMap(connection, [insertedFeedId, categoryId]);
            const insertedFeedCategoryMappingId = insertFeedCategoryMapResult.insertId;
            // console.log(insertedFeedCategoryMappingId);

            // @TODO
            // Hashtag 매핑 추가
            // for (let i = 0; i < hashtagIdList.length; i++) {
            //     const insertHashtagMappingResult = await this.feedDAO.insertFeedHashtagMapInfo(connection, [insertedFeedId, hashtagIdList[i]]);
            //     console.log(insertHashtagMappingResult.insertId);
            // }

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