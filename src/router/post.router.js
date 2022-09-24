const PostController = require('../controller/post.controller');
const jwtMiddleware = require('../middleware/jwt.middleware');

const postRouter = (router) =>{

    this.PostController = new PostController();

    // 게시글 업로드 API
    router.post('/posts', jwtMiddleware, this.PostController.postPost);

    // 게시글 목록 조회 API
    router.get('/posts/:userIdx', this.PostController.getPosts);

    // 게시글 글 조회 API
    router.get('/posts/:postIdx/content', this.PostController.getPostContent);

    // 게시글 수정 API
    router.patch('/posts/:postIdx', jwtMiddleware, this.PostController.patchPost);
    
    // 게시글 삭제 API
    router.patch('/posts/:postIdx/status', jwtMiddleware, this.PostController.patchPostStatus);

    // 게시글 좋아요 API
    router.post('/posts/:postIdx/like', jwtMiddleware, this.PostController.postPostLike);

    // 게시글 좋아요 취소 API
    router.patch('/posts/:postIdx/like', jwtMiddleware, this.PostController.postPostDislike);

    // 게시글 신고 API
    router.post('/posts/:postIdx/report', jwtMiddleware, this.PostController.postPostReport);
}

module.exports = postRouter;