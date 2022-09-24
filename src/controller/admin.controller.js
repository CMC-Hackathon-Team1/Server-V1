const AdminService = require('../service/admin.service');

const baseResponse = require('../utility/baseResponseStatus');
const { errResponse, response } = require('../utility/response');
const regexDate = new RegExp(/(^(19|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/); // YYYYMMDD 확인 정규표현식

// 회원 전체 정보 검색
class AdminController {
    AdminService;

    constructor (){
        this.AdminService = new AdminService();
    }

    getUserList = async (req, res) => {

        let { id, name, signUpDate, status, page } = req.query;
        
        if (!page){
            return res.send(errResponse(baseResponse.PAGENATION_ERROR));
        }
        if (signUpDate !== undefined && !regexDate.test(signUpDate)) {
            return res.send(errResponse(baseResponse.ADMIN_DATE_REGEX));
        }
        
        const retrieveUserResult = await this.AdminService.retrieveUserList(id, name, signUpDate, status, page);
    
        return res.send(retrieveUserResult);
    }
    
    // 회원 상세 정보 보기
    getUserDetailList = async (req, res) => {
        const userIdx = req.params.userIdx;
        if (!userIdx){
            return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        } else if (userIdx.length < 1) {
            return res.send(errResponse(baseResponse.USER_USERIDX_LENGTH));
        }
        const retrieveUserDetailResult = await this.AdminService.retrieveUserDetailList(userIdx);
    
        return res.send(retrieveUserDetailResult);
    }
    
    // 회원 정지
    patchUserStatus = async (req, res) => {
    
        const userIdx = req.params.userIdx;
    
        if (!userIdx){
            return res.send(errResponse(baseResponse.USER_USERIDX_EMPTY));
        } 
    
        const userBanResult = await this.AdminService.sudoBanUser(userIdx);
    
        return res.send(userBanResult);
    
    }
    
    // 게시글 목록 조회
    getPostList = async (req,res) => {
        let { id, postDate, status, page } = req.query;
    
        if (!page){
            return res.send(errResponse(baseResponse.PAGENATION_ERROR));
        }
        if (postDate !== undefined && !regexDate.test(postDate)) {
            return res.send(errResponse(baseResponse.ADMIN_DATE_REGEX));
        }
    
        const retrievePostResult = await this.AdminService.retrievePostList(id, postDate, status, page);
    
        return res.send(retrievePostResult);
    }
    
    // 게시글 상세 정보 조회
    getPostDetailList = async (req,res) => {
    
        const postIdx = req.params.postIdx;
    
        if (!postIdx){
            return res.send(errResponse(baseResponse.POST_POSTIDX_EMPTY));
        } else if (postIdx.length<1) {
            return res.send(errResponse(baseResponse.POST_POSTIDX_LENGTH));
        }
    
        const retrievePostDetailResult = await this.AdminService.retrievePostDetailList(postIdx);
    
        return res.send(retrievePostDetailResult);
    }
    
    // 게시글과 관련된 댓글들 삭제
    patchPostAndCommentStatus = async (req, res) => {
        const postIdx = req.params.postIdx;
    
        if (!postIdx){
            return res.send(errResponse(baseResponse.POST_POSTIDX_EMPTY));
        } else if (postIdx.length<1) {
            return res.send(errResponse(baseResponse.POST_POSTIDX_LENGTH));
        }
    
        const postBanResult = await this.AdminService.sudoUpdatePostAndReleatedCommentStatus(postIdx);
    
        return res.send(postBanResult);
    }
    
    // 신고 목록 조회
    getReportList = async (req, res) => {
    
        const reportList = await this.AdminService.retrieveReportList();
    
        return res.send(reportList);
    } 
    
    // 신고 게시글 내용 조회
    getReportPost = async (req, res) => {
    
        const postIdx = req.params.postIdx;
    
        // postIdx validation
        if (!postIdx) {
            return res.send(errResponse(baseResponse.POST_POSTIDX_EMPTY));
        } else if (postIdx < 1) {
            return res.send(errResponse(baseResponse.POST_POSTIDX_LENGTH));
        }
    
        const reportPostList = await this.AdminService.retrieveReportPostContent(postIdx);
    
        return res.send(reportPostList);
    }
    
    // 신고 댓글 내용 조회
    getReportComment = async (req, res) => {
    
        const commentIdx = req.params.commentIdx;
    
        // postIdx validation
        if (!commentIdx) {
            return res.send(errResponse(baseResponse.COMMENT_COMMENTIDX_EMPTY));
        } else if (commentIdx < 1) {
            return res.send(errResponse(baseResponse.COMMENT_COMMENTIDX_LENGTH));
        }
    
        const reportPostList = await this.AdminService.retrieveReportCommentContent(commentIdx);
    
        return res.send(reportPostList);
    }
    
    // 신고 게시글 사유 조회
    getReportPostContent = async (req, res) => {
        const postIdx = req.params.postIdx;
    
        // postIdx validation
        if (!postIdx) {
            return res.send(errResponse(baseResponse.POST_POSTIDX_EMPTY));
        } else if (postIdx < 1) {
            return res.send(errResponse(baseResponse.POST_POSTIDX_LENGTH));
        }
    
        const reportPostList = await this.AdminService.retrieveReportPostReportCode(postIdx);
    
        return res.send(reportPostList);
    }
    
    // 신고 댓글 사유 조회
    getReportCommentContent = async (req, res) => {
        const commentIdx = req.params.commentIdx;
    
        // commentIdx validation
        if (!commentIdx) {
            return res.send(errResponse(baseResponse.COMMENT_COMMENTIDX_EMPTY));
        } else if (commentIdx < 1) {
            return res.send(errResponse(baseResponse.COMMENT_COMMENTIDX_LENGTH));
        }
    
        const reportCommentList = await this.AdminService.retrieveReportCommenReportCode(commentIdx);
    
        return res.send(reportCommentList);
    }
    
    // 신고받은 게시글 삭제
    patchPostStatus = async (req, res) => {
        const postIdx = req.params.commentIdx;
    
        if (!postIdx){
            return res.send(errResponse(baseResponse.POST_POSTIDX_EMPTY));
        } else if (postIdx.length<1) {
            return res.send(errResponse(baseResponse.POST_POSTIDX_LENGTH));
        }
    
        const postBanResult = await this.AdminService.sudoUpdatePostStatus(postIdx);
    
        return res.send(postBanResult);
    }
    
    // 신고받은 댓글 삭제
    patchCommentStatus = async (req, res) => {
        const commentIdx = req.params.commentIdx;
    
        if (!commentIdx){
            return res.send(errResponse(baseResponse.COMMENT_COMMENTIDX_EMPTY));
        } else if (commentIdx.length<1) {
            return res.send(errResponse(baseResponse.COMMENT_COMMENTIDX_LENGTH));
        }
    
        const postBanResult = await this.AdminService.sudoUpdateCommentStatus(commentIdx);
    
        return res.send(postBanResult);
    }
    
    // 게시글 신고 내역 삭제
    patchPostReportStatus = async (req, res) => {
        const postReportIdx = req.params.postReportIdx;
    
        if (!postReportIdx){
            return res.send(errResponse(baseResponse.REPORT_POSTREPORTIDX_EMPTY));
        } else if (postReportIdx.length<1) {
            return res.send(errResponse(baseResponse.REPORT_POSTREPORTIDX_LENGTH));
        }
    
        const postBanResult = await this.AdminService.sudoUpdatePostReportStatus(postReportIdx);
    
        return res.send(postBanResult);
    }
    
    // 댓글 신고 내역 삭제
    patchCommentReportStatus = async (req, res) => {
        const commentReportIdx = req.params.commentReportIdx;
    
        if (!commentReportIdx){
            return res.send(errResponse(baseResponse.REPORT_COMMENTREPORT_EMPTY));
        } else if (commentReportIdx.length<1) {
            return res.send(errResponse(baseResponse.REPORT_COMMENTREPORT_LENGTH));
        }
    
        const postBanResult = await this.AdminService.sudoUpdateCommentReportStatus(commentReportIdx);
    
        return res.send(postBanResult);
    }
    
    // 게시글 관련 로그 전체 조회
    getPostLogs = async (req, res) => {
        const page = req.query.page;
    
        if (!page){
            return res.send(errResponse(baseResponse.PAGENATION_ERROR));
        } else if (page<1){
            return res.send(errResponse(baseResponse.PAGENATION_ERROR));
        }
    
        const postLogs = await this.AdminService.retrievePostLogs(page);
    
        return res.send(postLogs);
    }
    
    // 댓글 관련 로그 전체 조회
    getCommentLogs = async (req, res) => {
        const page = req.query.page;
    
        if (!page){
            return res.send(errResponse(baseResponse.PAGENATION_ERROR));
        } else if (page<1){
            return res.send(errResponse(baseResponse.PAGENATION_ERROR));
        }
    
        const commentLogs = await this.AdminService.retrieveCommentLogs(page);
    
        return res.send(commentLogs);
    }
    
    // 사용자 관련 로그 전체 조회
    getUserLogs = async (req, res) => {
        const page = req.query.page;
    
        if (!page){
            return res.send(errResponse(baseResponse.PAGENATION_ERROR));
        } else if (page<1){
            return res.send(errResponse(baseResponse.PAGENATION_ERROR));
        }
    
        const userLogs = await this.AdminService.retrieveUserLogs(page);
    
        return res.send(userLogs);
    }
    
    // 신고 관련 로그 전체 조회
    getReportLogs = async (req, res) => {
    
        const page = req.query.page;
    
        if (!page){
            return res.send(errResponse(baseResponse.PAGENATION_ERROR));
        } else if (page<1){
            return res.send(errResponse(baseResponse.PAGENATION_ERROR));
        }
    
        const reportLogs = await this.AdminService.retrieveReportLogs(page);
    
        return res.send(reportLogs);
    }

}

module.exports = AdminController;
