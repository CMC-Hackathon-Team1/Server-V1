const PostRepository = require('../repository/post.repository');

const { pool } = require('../asset/db');

const baseResponse = require('../utility/baseResponseStatus')
const { errResponse, response } = require('../utility/response');

class PostService {
    PostRepository;

    constructor(){
        this.PostRepository = new PostRepository();
    }

    // 게시물 생성
    createPost = async ( userIdx, postImgUrls, content) => {
        const connection = await pool.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();

            const insertPostParams =  [userIdx, content];
            const postResult = await this.PostRepository.insertPost(connection, insertPostParams);
            const postIdx = postResult.insertId;

            for (postImgUrl of postImgUrls) {
                const insertPostImgParams = [postIdx, postImgUrl];
                postImgResult = await this.PostRepository.insertPostImg(connection, insertPostImgParams);
            }

            await this.PostRepository.insertPostLog(connection, postIdx, 0);

            await connection.commit();

            return 
        } catch (e) {
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 게시물 수정
    updatePost = async (content, postIdx) => {
        const connection = await pool.getConnection(async (connection) => connection);
        try {
            await connection.beginTransaction();

            const editPostParams = [content, postIdx];
            const editPostResult = await this.PostRepository.updatePost(connection, editPostParams);

            if (!editPostResult) {
                return errResponse(baseResponse.DB_ERROR);
            }

            await this.PostRepository.insertPostLog(connection, postIdx, 2);

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

    // 게시물 작성자 확인
    retrieveUserIdx = async (postIdx) => {
        try {
            const connection = await pool.getConnection(async (connection) => connection);
            const userIdx = await this.PostRepository.selectUserIdxByPostIdx(connection, postIdx);
            connection.release();

            return userIdx[0].userIdx;
        } catch (e){
            console.log(e);
            return errResponse(baseResponse.DB_ERROR);
        }
    }

    // 게시글 사진 목록 조회
    retrievePostLists = async (userIdx, page) => {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            await connection.beginTransaction();
            const offset = (page-1)*9;
            const postListResult = await this.PostRepository.selectUserPhotos(connection, userIdx, offset);

            for (i = 0; i <postListResult.length; i+=1){
                await this.PostRepository.insertPostLog(connection, postListResult[i].postIdx, 1);
            }
            

            await connection.commit();

            return postListResult;
        } catch (e){
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 사용자 피드용 게시글 리스트 가지고오기
    retrieveUserFeed = async (userIdx, page) => {
        try {
            const connection = await pool.getConnection(async (conn) => conn);
            const offsets = (page-1)*10;
            const postListResult = await this.PostRepository.selectFollowingUserPosts(connection, userIdx, offsets);

            connection.release()

            return response(baseResponse.SUCCESS, postListResult);
        } catch (e){
            console.log(e);
            return errResponse(baseResponse.DB_ERROR);
        }
    }

    // 게시물 상태 비활성화로 변경(사용자입장 삭제)
    updatePostStatus = async (postIdx) => {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            await connection.beginTransaction();
            const postStatusResult = await this.PostRepository.selectPostStatus(connection, postIdx);

            if (postStatusResult[0].status !== 0) {
                return errResponse(baseResponse.POST_STATUS_INACTIVE);
            }

            const editPostStatusResult = await this.PostRepository.updatePostStatusInactive(connection, postIdx);

            await this.PostRepository.insertPostLog(connection, postIdx, 3);

            await connection.commit();

            return response(baseResponse.SUCCESS);
        } catch(e) {
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 게시물 내용 조회
    retrievePostContent = async (postIdx) => {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            await connection.beginTransaction();
            const checkPostRealizeList = await this.PostRepository.selectPostByPostIdx(connection, postIdx);
            
            if (!checkPostRealizeList) {
                return errResponse(baseResponse.DB_ERROR);
            }

            const postContentResult = await this.PostRepository.selectPostContent(connection, postIdx);
            
            await connection.commit();

            return response(baseResponse.SUCCESS, postContentResult);
        } catch (e){
            console.log(e);
            await connection.rollback();

            return errResponse(baseResponse.DB_ERROR);
        } finally {
            connection.release();
        }
    }

    // 게시글 좋아요 
    createPostLike = async (userIdx, postIdx) => {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            await connection.beginTransaction();

            const checkedPostLikeResult = await this.PostRepository.checkPostLike(connection, userIdx, postIdx);

            if (checkedPostLikeResult[0].success == 0){
                await this.PostRepository.insertPostLike(connection, userIdx, postIdx);

                await connection.commit();
                return response(baseResponse.SUCCESS);
            }

            const postLikeResult = await this.PostRepository.updatePostLike(connection, userIdx, postIdx);

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

    // 게시글 좋아요 해제
    createPostDislike = async (userIdx, postIdx) => {
        try {
            const connection = await pool.getConnection(async (conn) => conn);
            const postLikeResult = await this.PostRepository.updatePostDislike(connection, userIdx, postIdx);

            connection.release();
            return response(baseResponse.SUCCESS);
        } catch (e) {
            console.log(e);
            
            return errResponse(baseResponse.DB_ERROR);
        }
    }

    // 게시글 신고
    createPostReport = async (userIdx, postIdx, reportCode) => {
        const connection = await pool.getConnection(async (conn) => conn);
        try {
            await connection.beginTransaction();

            const postReportResult = await this.PostRepository.checkPostReport(connection, userIdx, postIdx);

            // 이미 신고된 게시물이라면
            if (postReportResult[0].success == 1){
                await connection.commit();
                
                // 이미 신고된 게시물임을 사용자에게 알리기
                return errResponse(baseResponse.REPORT_ENTERED);
            }
            const reportedPostResult = await this.PostRepository.insertPostReport(connection, userIdx, postIdx, reportCode);
            const reportPostIdx = reportedPostResult.insertId;
            await this.PostRepository.insertReportLog(connection, 7, reportPostIdx, 0, 0);

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
}


module.exports = PostService;