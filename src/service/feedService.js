const feedDAO = require('../DAO/feedDao');

const { pool } = require('../config/db');

const baseResponse = require('../utility/baseResponseStatus')
const { errResponse, response } = require('../utility/response');

class feedService {
    feedDAO;

    constructor() {
        this.feedDAO = new feedDAO();
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

    // 게시글 지우기
    deleteFeedInfo = async (profileId, feedId) => {
        const connection = await pool.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();

            // feed 지우기
            const deleteFeedResult = await this.feedDAO.deleteFeedById(connection, feedId);
            // console.log(categoryId);

            // category mapping 지우기
            const deleteFeedCategoryMapResult = await this.feedDAO.deleteFeedCategoryMapInfo(connection, feedId);

            // hashtag mapping 지우기
            const deleteFeedHashtagMapResult = await this.feedDAO.deleteFeedHashtagMapInfo(connection, feedId);

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

    getFeedsByDate = async (year,month,day,profileId) => {
        const connection = await pool.getConnection(async (connection) => connection);
        try {

            await connection.beginTransaction();
            
    
            const Feeds = await this.feedDAO.getFeedsByDate(connection, year,month,day,profileId);
    
            await connection.commit();
            
            return response(baseResponse.SUCCESS, Feeds);
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