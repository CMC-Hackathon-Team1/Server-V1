const PostService = require('../service/post.service');

const baseResponse = require('../utility/baseResponseStatus');
const { errResponse, response } = require('../utility/response');


class PostController {
    PostService;

    constructor(){
        this.PostService = new PostService();
    }

        // 게시글 등록
    postPost = async (req, res) => {

        const userIdxFromToken = req.verifiedToken.idx;

        const { userIdx, postImgUrls, content} = req.body;

        // Authentication
        if ( userIdxFromToken[0].userIdx != userIdx){
            return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
        }

        // validation
        if (!userIdx) {
            return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        } else  if (userIdx <= 0) {
            return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
        } 

        if (postImgUrls.length <= 0) {
            return res.send(errResponse(baseResponse.POST_POSTIMGURLS_EMPTY));
        }

        if (!content){
            return res.send(errResponse(baseResponse.POST_CONTENT_EMPTY));
        } else if (content.length > 1000) {
            return res.send(errResponse(baseResponse.POST_CONTENT_LENGTH));
        }

        const createdPostResult = await this.PostService.createPost(
            userIdx,
            postImgUrls,
            content
        );

        return res.send(response(baseResponse.SUCCESS));
    }

    // 게시글 수정
    patchPost = async (req, res) => {

        const idx = req.verifiedToken.idx;
        const postIdx = req.params.postIdx;
        const content = req.body.content;

        const writerOfPost = await this.PostService.retrieveUserIdx(postIdx);

        if (writerOfPost[0].userIdx !== idx[0].userIdx) {
            return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
        }

        if(!postIdx) {
            return res.send(errResponse(baseResponse.POST_POSTIDX_EMPTY));
        }else if (postIdx < 1) {
            return res.send(errResponse(baseResponse.POST_POSTIDX_LENGTH));
        }

        if(!content) {
            return res.send(errResponse(baseResponse.POST_CONTENT_EMPTY))
        }else if (content.length > 1000) {
            return res.send(errResponse(baseResponse.POST_CONTENT_LENGTH));
        } 

        const editPostResponse = await this.PostService.updatePost(content, postIdx);

        return res.send(editPostResponse);
    }

    // 게시글 조회
    getPosts = async (req, res) => {
        
        const userIdx = req.params.userIdx;
        const page = req.query.page;

        // validation
        if(!userIdx) {
            return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        } else if (userIdx <= 0) {
            return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
        }

        if (!page) {
            return res.send(errResponse(baseResponse.PAGENATION_ERROR));
        } else  if (page <= 0) {
            return res.send(errResponse(baseResponse.PAGENATION_ERROR));
        }

        const postListResult = await this.PostService.retrievePostLists(userIdx, page);

        return res.send(response(baseResponse.SUCCESS, postListResult));
    }

    // 게시글 내용 조회
    getPostContent = async (req, res) => {

        const postIdx = req.params.postIdx;

        // validation
        if (!postIdx){
            return res.send(errResponse(baseResponse.POST_POSTIDX_EMPTY));
        } else if(postIdx < 1) {
            return res.send(errResponse(baseResponse.POST_POSTIDX_LENGTH));
        }

        const postContent = await this.PostService.retrievePostContent(postIdx);

        return res.send(postContent);

    }

    // 게시글 삭제
    patchPostStatus = async (req ,res) => {

        const idx = req.verifiedToken.idx;
        const postIdx = req.params.postIdx;

        const writerOfPost = await this.PostService.retrieveUserIdx(postIdx);

        // Authentication
        if (writerOfPost[0].userIdx !== idx[0].userIdx) {
            return res.send(errResponse(baseResponse.WRITER_NOT_MATCH));
        }
        
        // validation
        if (!postIdx) {
            return res.send(errResponse(baseResponse.POST_POSTIDX_EMPTY));
        } else if (postIdx <= 0) {
            return res.send(errResponse(baseResponse.POST_POSTIDX_LENGTH));
        }

        const editPostStatusResponse = await this.PostService.updatePostStatus(postIdx);

        return res.send(editPostStatusResponse);
    }

    // 게시글 좋아요
    postPostLike = async (req, res) => {

        const idx = req.verifiedToken.idx;
        const postIdx = req.params.postIdx;

        const userIdx = idx[0].userIdx;

        if(!postIdx) {
            return res.send(errResponse(baseResponse.POST_POSTIDX_EMPTY));
        } else if (postIdx < 1) {
            return res.send(errResponse(baseResponse.POST_POSTIDX_LENGTH));
        }

        const postLikeResponse = await this.PostService.createPostLike(userIdx, postIdx);

        return res.send(postLikeResponse);
    }

    // 게시글 좋아요 해제
    postPostDislike = async (req, res) => {
        
        const idx = req.verifiedToken.idx;
        const postIdx = req.params.postIdx;

        const userIdx = idx[0].userIdx;

        if(!postIdx) {
            return res.send(errResponse(baseResponse.POST_POSTIDX_EMPTY));
        } else if (postIdx < 1) {
            return res.send(errResponse(baseResponse.POST_POSTIDX_LENGTH));
        }

        const postDislikeResponse = await this.PostService.createPostDislike(userIdx, postIdx);

        return res.send(postDislikeResponse);
    }  

    // 게시글 신고
    postPostReport = async (req, res) => {

        const idx = req.verifiedToken.idx;
        const postIdx = req.params.postIdx;
        // 신고구분: 1-욕설, 2-스팸 등의 숫자로 구분한 코드를 클라이언트로부터 넘겨받는다 가정
        const reportCode = req.query.reportCode;

        const userIdx = idx[0].userIdx;

        // postIdx validation
        if (!postIdx) {
            return res.send(errResponse(baseResponse.POST_POSTIDX_EMPTY));
        } else if (postIdx < 1) {
            return res.send(errResponse(baseResponse.POST_POSTIDX_LENGTH));
        }

        // 신고구분 validation
        if(!reportCode) {
            return res.send(errResponse(baseResponse.REPORT_CODE_EMPTY));
        }

        //자신의 게시글을 신고하려는지 확인
        const checkMyPostResult = await this.PostService.retrieveUserIdx(postIdx);
        if (userIdx==checkMyPostResult) {
            return res.send(errResponse(baseResponse.REPORT_MYPOST));
        }

        const postReportResponse = await this.PostService.createPostReport(userIdx, postIdx, reportCode);

        return res.send(postReportResponse);
}
}

module.exports = PostController;
