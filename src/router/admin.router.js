const AdminController = require('../controller/admin.controller');

const adminRouter = (router) =>{

    this.AdminController = new AdminController();

    router.get('/ping', function(req, res) { res.send('pong'); });

    // 회원 전체 정보 보기
    router.get('/admin/user', this.AdminController.getUserList);
    
    // 회원 상세 정보 보기
    router.get('/admin/user/:userIdx', this.AdminController.getUserDetailList);

    // 회원 관리자 정지
    router.patch('/admin/user/:userIdx', this.AdminController.patchUserStatus);
    
    // 포스트 전체 정보 보기
    router.get('/admin/post', this.AdminController.getPostList);
    
    // 포스트 상세 정보 보기
    router.get('/admin/post/:postIdx', this.AdminController.getPostDetailList);

    // 포스트 관리자 삭제
    router.patch('/admin/post/:postIdx', this.AdminController.patchPostAndCommentStatus);

    // 신고 목록 보기
    router.get('/admin/report', this.AdminController.getReportList);

    // 신고한 게시글 내용 보기
    router.get('/admin/report/post/content/:postIdx', this.AdminController.getReportPost);

    // 신고한 댓글 내용 보기
    router.get('/admin/report/comment/content/:commentIdx', this.AdminController.getReportComment);

    // 댓글 신고 사유 보기 
    router.get('/admin/report/post/reportCode/:postIdx', this.AdminController.getReportPostContent);

    // 게시글 신고 사유 보기 
    router.get('/admin/report/comment/reportCode/:commentIdx', this.AdminController.getReportCommentContent);

    // 신고당한 게시글 삭제
    router.patch('/admin/report/post/:postIdx', this.AdminController.patchPostStatus);

    // 신고당한 댓글 삭제
    router.patch('/admin/report/comment/:commentIdx', this.AdminController.patchCommentStatus);

    // 게시글 신고 삭제
    router.patch('/admin/report/post/reportCode/:postReportIdx', this.AdminController.patchPostReportStatus);

    // 댓글 신고 삭제
    router.patch('/admin/report/comment/reportCode/:commentReportIdx', this.AdminController.patchCommentReportStatus);

    // 사용자 CRUD 로그 사유 보기 
    router.get('/admin/log/user', this.AdminController.getUserLogs);

    // 게시글 CRUD 로그 사유 보기 
    router.get('/admin/log/post', this.AdminController.getPostLogs);

    // 댓글 CRUD 로그 사유 보기 
    router.get('/admin/log/comment', this.AdminController.getCommentLogs);

    // 신고 CRUD 로그 사유 보기 
    router.get('/admin/log/report', this.AdminController.getReportLogs);
};

module.exports = adminRouter;