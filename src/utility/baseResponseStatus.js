module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 100, "message": "성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 200, "message": "JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 300, "message": "JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 101, "message": "JWT 토큰 검증 성공" },
    ACCESS_TOKEN_EMPTY : { "isSuccess" : false, "code": 308, "message": "refresh token 만료, 새 AccessToken이 필요합니다."},


    //Request error
    
    SIGNIN_ERROR : {"isSuccess": false, "code": 199, "message": "회원가입을 해주세요"},
    SIGNIN_PASSWORD_TYPE : { "isSuccess": false, "code": 201, "message":"소셜 로그인 유저입니다" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 202, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 203, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 204, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 205, "message":"비밀번호는 6~20자리를 입력해주세요." },
    SIGNUP_PASSWORD_REGEX : { "isSuccess": false, "code": 206, "message":"비밀번호는 특수문자를 포함해야 합니다." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 207, "message":"닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 208,"message":"닉네임은 최대 20자리를 입력해주세요." },
    SIGNUP_BIRTH_EMPTY : { "isSuccess": false, "code": 209, "message":"생일을 입력 해주세요." },
    SIGNUP_BIRTH_REGEX : { "isSuccess": false,"code": 210,"message":"생일을 날짜 형식에 맞게 입력해주세요." },
    TOKEN_WRONG_ACCESS : { "isSuccess": false,"code": 211,"message": "잘못된 접근입니다." }, // jwt미들웨어 임시

    KAKAO_ID_EMPTY : {"isSuccess": false, "code": 220, "message": "카카오 아이디를 입력해주세요"},
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 221, "message": "비밀번호를 입력 해주세요." },
    SIGNIN_PASSWORD_LENGTH : { "isSuccess": false, "code": 222, "message":"비밀번호는 6~20자리를 입력해주세요." },
    SIGNIN_PASSWORD_REGEX : { "isSuccess": false, "code": 223, "message":"비밀번호는 특수문자를 포함해야 합니다." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 224, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 225, "message": "해당 회원이 존재하지 않습니다." },
    USER_USERID_EXIST : { "isSuccess": false, "code": 226, "message": "해당 아이디를 사용한 회원이 존재합니다." },
    USER_USERID_LENGTH : { "isSuccess": false, "code": 227, "message": "userId는 최대 20자리를 입력해주세요." },
    USER_USERID_SHORT : { "isSuccess": false, "code": 228, "message": "userId는 최소 3자리 이상 입력해주세요." },
    USER_PHONENUMBER_EMPTY : { "isSuccess": false, "code": 229, "message": "전화번호를 입력해주세요." },
    USER_PHONENUMBER_LENGTH : { "isSuccess": false, "code": 230, "message": "전화번호 길이를 확인해주세요." },
    USER_PHONENUMBER_NOT_MATCH : { "isSuccess": false, "code": 231, "message": "전화번호는 숫자만 입력해주세요." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 232, "message": "유저 아이디 값을 다시 입력해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 233, "message": "변경할 닉네임 값을 입력해주세요" },
    USER_NAME_EMPTY : { "isSuccess": false, "code": 234, "message": "이름을 입력해주세요." },
    USER_NAME_LENGTH : { "isSuccess": false, "code": 235, "message": "이름 길이를 확인해주세요." },
    USER_STATUS_EMPTY : { "isSuccess": false, "code": 236, "message": "회원 상태값을 입력해주세요" },
    USER_USERIDX_EMPTY : { "isSuccess": false, "code": 237, "message": "userIdx를 입력해주세요." },
    USER_USERIDX_LENGTH : { "isSuccess": false, "code": 238, "message": "userIdx는 0보다 큰 값으로 입력해주세요." },

    POST_POSTIMGURLS_EMPTY : { "isSuccess": false, "code": 240, "message": "postImgUrls를 입력해주세요." },
    POST_CONTENT_LENGTH : { "isSuccess": false, "code": 241, "message": "content의 길이는 450자 이하로 입력해주세요." },
    POST_POSTIDX_EMPTY: { "isSuccess": false, "code": 242, "message": "postIdx를 입력해주세요." },
    POST_POSTIDX_LENGTH: { "isSuccess": false, "code": 243, "message": "postIdx는 0보다 큰 값으로 입력해주세요." },
    POST_CONTENT_EMPTY : { "isSuccess": false, "code": 244, "message": "게시글 내용을 입력해주세요." },
    COMMENT_CONTENT_LENGTH : { "isSuccess": false, "code": 245, "message": "입력 가능한 댓글 길이를 초과했습니다." },
    COMMENT_CONTENT_EMPTY : { "isSuccess": false, "code": 246, "message": "댓글 내용을 입력해주세요." },
    COMMENT_COMMENTIDX_EMPTY : { "isSuccess": false, "code": 248, "message": "commentIdx를 입력해주세요." },
    COMMENT_COMMENTIDX_LENGTH : { "isSuccess": false, "code": 249, "message": "commentIdx는 0보다 큰 값으로 입력해주세요." },
    COMMENT_STATUS_INACTIVE : {"isSuccess": false, "code": 250, "message": "이미 삭제된 댓글입니다."},

    WRITER_NOT_MATCH : {"isSuccess": false, "code": 251, "message": "작성자와 사용자가 일치하지 않습니다"},
    MESSAGE_USERIDX_EMPTY : {"isSuccess": false, "code": 252, "message": "메시지 상대 userIdx가 오지 않았습니다."},
    MESSAGE_USERIDX_LENGTH: {"isSuccess": false, "code": 253, "message": "메시지 상대 userIdx길이를 확인해주세요"},
    MESSAGE_CONTENT_EMPTY: {"isSuccess": false, "code": 254, "message": "메시지 내용을 입력해주세요"},
    MESSAGE_CONTENT_LENGTH: {"isSuccess": false, "code": 255, "message": "메시지 내용은 200자 이하로 입력해주세요."},

    REPORT_CODE_EMPTY : { "isSuccess": false, "code": 270, "message": "신고 구분이 입력되지 않았습니다" },
    REPORT_ENTERED: { "isSuccess": false, "code": 271, "message": "이미 신고되었습니다" },
    REPORT_POST_MYSELF : { "isSuccess": false, "code": 272, "message": "본인이 작성한 게시글입니다" },
    REPORT_COMMENT_MYSELF : { "isSuccess": false, "code": 273, "message": "본인이 작성한 댓글입니다" },

    PAGENATION_ERROR : {"isSuccess": false, "code": 290, "message": "보고싶은 페이지를 입력해주세요. "},
    REQUEST_CODE_EMPTY : { "isSuccess": false, "code": 291, "message": "요청코드를 입력해주세요." },
    REQUEST_CODE_ERROR: { "isSuccess": false, "code": 293, "message": "요청코드를 정확히 입력해주세요." },
    ADMIN_DATE_REGEX : { "isSuccess": false, "code": 294, "message": " 날짜 형식이 옳지 않습니다." },

    REPORT_MYPOST : { "isSuccess": false, "code": 295, "message": " 자기 자신의 댓글/게시글입니다" },

    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 301, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 302, "message":"중복된 닉네임입니다." },

    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 303, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 304, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 305, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 306, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },

    FOLLOW_REQUEST_SUCCESS : { "isSuccess": false, "code": 307, "message": "팔로우 요청이 완료되었습니다" },
    FOLLOW_REQUEST_EMPTY : { "isSuccess": false, "code": 308, "message": "사라진 팔로우 요청입니다" },
    FOLLOW_EXISTS: { "isSuccess": false, "code": 309, "message": "이미 팔로우중인 사용자입니다." },
    
    POST_STATUS_INACTIVE : { "isSuccess": false, "code": 310, "message": "이미 삭제된 게시물입니다." },
    USER_PRIVATE_ERROR: { "isSuccess": false, "code": 331, "message": "비공개 설정 사용자가 아닙니다" },
    AUTH_NUMBER_WRONG : { "isSuccess": false, "code": 332, "message": "인증번호가 잘못되었습니다" },

    // Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 400, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 401, "message": "서버 에러"},
 
    // Admin Page Error
    REPORT_POSTREPORTIDX_EMPTY : { "isSuccess": false, "code": 500, "message": "postReportIdx를 입력해주세요"},
    REPORT_POSTREPORTIDX_LENGTH : { "isSuccess": false, "code": 501, "message": "postReportIdx는 0보다 큰 값으로 입력해주세요." },

    REPORT_COMMENTREPORT_EMPTY : { "isSuccess": false, "code": 502, "message": "commentReportIdx를 입력해주세요"},
    REPORT_COMMENTREPORT_LENGTH : { "isSuccess": false, "code": 503, "message": "commentReportIdx는 0보다 큰 값으로 입력해주세요." },
}