const CommentController = require('../controller/comment.controller');
const jwtMiddleware = require('../middleware/jwt.middleware');

const commentRouter = (router) =>{

    this.CommentController = new CommentController();

    // 댓글 업로드 API
    router.post('/comment', jwtMiddleware, this.CommentController.postComment);

    // 댓글 목록 조회 API
    router.get('/comment/:postIdx', this.CommentController.getComments);

    // 댓글 수정 API
    router.patch('/comment/:commentIdx', jwtMiddleware, this.CommentController.patchComment);
    
    // 댓글 삭제 API
    router.patch('/comment/:commentIdx/status', jwtMiddleware, this.CommentController.patchCommentStatus);

    // 댓글 좋아요 API
    router.post('/comment/:commentIdx/like', jwtMiddleware, this.CommentController.postCommentLike);

    // 댓글 좋아요 취소 API
    router.patch('/comment/:commentIdx/like', jwtMiddleware, this.CommentController.postCommentDislike);

    // 댓글 신고 API
    router.post('/comment/:commentIdx/report', jwtMiddleware, this.CommentController.postCommentReport);
}

module.exports = commentRouter;