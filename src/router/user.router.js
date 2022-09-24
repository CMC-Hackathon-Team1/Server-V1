const UserController = require('../controller/user.controller');
const jwtMiddleware = require('../middleware/jwt.middleware');

const userRouter = (router) =>{

    this.UserController = new UserController();

    // 일반 로그인 API
    router.post('/user/login', this.UserController.logIn);

    // 자동 로그인 API
    router.get('/user/auto-login', jwtMiddleware, this.UserController.autoLogin);

    // 카카오 로그인 API
    router.get('/user/kakao-login', this.UserController.kakaoLogin);

    // 회원가입 API
    router.post('/user/signup', this.UserController.signUp);

    // 소셜 회원가입 API
    router.post('/user/social-signup', this.UserController.socialSignUp);

    // 사용자 아이디 사용 확인 API
    router.get('/user/check', this.UserController.checkIdAvailable);

    // 내 정보 불러오는 API
    router.get('/user/profile', jwtMiddleware, this.UserController.getUserInfo);

    // 사용자 피드 조회 
    router.get('/user/feed', jwtMiddleware, this.UserController.getUserFeed);

    // 비밀번호 변경 API
    router.patch('/user/password', this.UserController.patchPassword);

    // 프로필 변경 API
    router.patch('/user/profile', jwtMiddleware, this.UserController.patchProfile);

    // 계정 공개 여부 설정 API
    router.patch('/user/profile/private', jwtMiddleware, this.UserController.patchPrivate);

    // 사용자 팔로우 or 팔로우 요청 
    router.post('/user/follow', jwtMiddleware, this.UserController.followUser);

    // 사용자 팔로우 취소 or 팔로우 요청 취소
    router.patch('/user/follow', jwtMiddleware, this.UserController.unfollowUser);

    // 팔로우 요청 확인
    router.get('/user/follow/request', jwtMiddleware, this.UserController.getFolowRequests);

    // 팔로우 요청 수락/거절
    router.patch('/user/follow/request', jwtMiddleware, this.UserController.patchFollowRequests);

    // 회원 탈퇴
    router.patch('/user/withdraw', jwtMiddleware, this.UserController.patchUserStatus);

}

module.exports = userRouter;