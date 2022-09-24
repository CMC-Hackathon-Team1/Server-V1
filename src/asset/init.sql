CREATE TABLE `Gridge-ERD`.`user`(
    `userIdx`        BIGINT          NOT NULL    AUTO_INCREMENT, 
    `ID`             VARCHAR(45)     NULL UNIQUE, 
    `password`       VARCHAR(300)    NULL, 
    `name`           VARCHAR(45)     NULL, 
    `introduce`      VARCHAR(300)    NULL, 
    `token`          VARCHAR(300)    NULL, 
    `phone`          VARCHAR(45)     NULL, 
    `profileImgUrl`  TEXT            NULL, 
    `website`        TEXT            NULL, 
    `private`        TINYINT         NOT NULL    DEFAULT 0 COMMENT '0-공개 / 1-비공개', 
    `birth`          DATE            NOT NULL, 
    `userType`       TINYINT         NOT NULL    DEFAULT 0 COMMENT '0-자체로그인/1-카카오로그인/2-네이버 등등... 추가가능', 
    `socialId`       VARCHAR(45)     NULL,
    `loginTime`      TIMESTAMP       NULL, 
    `createdAt`      TIMESTAMP       NOT NULL    DEFAULT current_timestamp, 
    `updatedAt`      TIMESTAMP       NOT NULL    DEFAULT current_timestamp ON UPDATE current_timestamp,
    `status`         TINYINT         NOT NULL    DEFAULT 0 COMMENT '0-활성화/1-탈퇴/2-관리자 비활성화', 
    PRIMARY KEY (userIdx)
);

ALTER TABLE `Gridge-ERD`.`user` COMMENT '사용자';


-- comment Table Create SQL
CREATE TABLE `Gridge-ERD`.`comment`
(
    `commentIdx`  BIGINT          NOT NULL    AUTO_INCREMENT, 
    `postIdx`     BIGINT          NOT NULL,
    `useridx`     BIGINT          NOT NULL, 
    `content`     VARCHAR(300)    NULL, 
    `createdAt`   TIMESTAMP       NULL        DEFAULT current_timestamp, 
    `updatedAt`   TIMESTAMP       NOT NULL    DEFAULT current_timestamp ON UPDATE current_timestamp,
    `status`      TINYINT         NULL        DEFAULT 0 COMMENT '0-활성화/1-삭제됨', 
     PRIMARY KEY (commentIdx)
);


ALTER TABLE `Gridge-ERD`.`comment` COMMENT '댓글';

ALTER TABLE `Gridge-ERD`.`comment`
    ADD CONSTRAINT FK_comment_useridx_user_userIdx FOREIGN KEY (useridx)
        REFERENCES Gridge-ERD.user (userIdx) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `Gridge-ERD`.`comment`
    ADD CONSTRAINT FK_comment_postIdx_post_postIdx FOREIGN KEY (postIdx)
        REFERENCES Gridge-ERD.user (postIdx) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- post Table Create SQL
CREATE TABLE `Gridge-ERD`.`post`
(
    `postIdx`          BIGINT          NOT NULL    AUTO_INCREMENT, 
    `userIdx`          BIGINT          NOT NULL, 
    `content`          VARCHAR(300)    NOT NULL, 
    `location`         VARCHAR(45)     NULL, 
    `createdAt`        TIMESTAMP       NOT NULL    DEFAULT current_timestamp, 
    `updatedAt`        TIMESTAMP       NOT NULL    DEFAULT current_timestamp ON UPDATE current_timestamp,
    `status`           TINYINT         NOT NULL    DEFAULT 0 COMMENT '0-활성화/1-삭제됨/2-비활성화', 
    `invisibleStatus`  TINYINT         NULL        DEFAULT 0 COMMENT '0-해당없음/1-신고먹고안보임', 
     PRIMARY KEY (postIdx, userIdx)
);

ALTER TABLE `Gridge-ERD`.`post` COMMENT '게시글';

ALTER TABLE `Gridge-ERD`.`post`
    ADD CONSTRAINT FK_post_userIdx_user_userIdx FOREIGN KEY (userIdx)
        REFERENCES Gridge-ERD.user (userIdx) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- commentReport Table Create SQL
CREATE TABLE `Gridge-ERD`.`commentReport`
(
    `commentReportIdx`  BIGINT          NOT NULL    AUTO_INCREMENT, 
    `reporterIdx`       BIGINT          NOT NULL, 
    `commentIdx`        BIGINT          NOT NULL, 
    `reportCode`        TINYINT         NOT NULL, 
    `createdAt`         TIMESTAMP       NOT NULL    DEFAULT current_timestamp, 
    `updatedAt`         TIMESTAMP       NULL        ON UPDATE current_timestamp, 
    `status`            TINYINT         NOT NULL    DEFAULT 0 COMMENT '0-활성화/1-삭제됨', 
     PRIMARY KEY (commentReportIdx)
);

ALTER TABLE `Gridge-ERD`.`commentReport` COMMENT '댓글 신고 테이블';


ALTER TABLE `Gridge-ERD`.`commentReport`
    ADD CONSTRAINT FK_commentReport_reporterIdx_user_userIdx FOREIGN KEY (reporterIdx)
        REFERENCES `Gridge-ERD`.`user` (userIdx) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- postReport Table Create SQL
CREATE TABLE `Gridge-ERD`.`postReport`
(
    `postReportIdx`  BIGINT         NOT NULL    AUTO_INCREMENT, 
    `reporterIdx`    BIGINT         NOT NULL, 
    `postIdx`        BIGINT         NOT NULL, 
    `reportCode`     BIGINT         NOT NULL, 
    `createdAt`      TIMESTAMP      NOT NULL    DEFAULT current_timestamp, 
    `updatedAt`      TIMESTAMP      NOT NULL    DEFAULT current_timestamp ON UPDATE current_timestamp,
    `status`         TINYINT        NOT NULL    DEFAULT 0 COMMENT '0-활성화/1-삭제됨', 
     PRIMARY KEY (postReportIdx)
);

ALTER TABLE `Gridge-ERD`.`postReport` COMMENT '게시글 신고 테이블';

ALTER TABLE `Gridge-ERD`.`postReport`
    ADD CONSTRAINT FK_postReport_reporterIdx_user_userIdx FOREIGN KEY (reporterIdx)
        REFERENCES `Gridge-ERD`.`user` (userIdx) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- room Table Create SQL
CREATE TABLE `Gridge-ERD`.`room`
(
    `roomIdx`    BIGINT       NOT NULL    AUTO_INCREMENT, 
    `user_1`     BIGINT       NOT NULL, 
    `user_2`     BIGINT       NOT NULL, 
    `createdAt`  TIMESTAMP    NOT NULL    DEFAULT current_timestamp, 
    `updatedAt`  TIMESTAMP    NOT NULL    DEFAULT current_timestamp ON UPDATE current_timestamp, 
    `status`     TINYINT      NOT NULL    DEFAULT 0 COMMENT '0-활성화/1-삭제', 
     PRIMARY KEY (roomIdx)
);

ALTER TABLE `Gridge-ERD`.`room` COMMENT '채팅방';

ALTER TABLE `Gridge-ERD`.`room`
    ADD CONSTRAINT FK_room_user_1_user_userIdx FOREIGN KEY (user_1)
        REFERENCES `Gridge-ERD`.`user` (userIdx) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `Gridge-ERD`.`room`
    ADD CONSTRAINT FK_room_user_2_user_userIdx FOREIGN KEY (user_2)
        REFERENCES `Gridge-ERD`.`user` (userIdx) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- userProfileImg Table Create SQL
CREATE TABLE `Gridge-ERD`.`userProfileImg`
(
    `userProfileImgIdx`  BIGINT       NOT NULL    AUTO_INCREMENT, 
    `userIdx`            BIGINT       NOT NULL, 
    `imgUrl`             TEXT         NOT NULL, 
    `createdAt`          TIMESTAMP    NOT NULL    DEFAULT current_timestamp, 
    `updatedAt`          TIMESTAMP    NOT NULL    DEFAULT current_timestamp ON UPDATE current_timestamp, 
    `status`             TINYINT      NOT NULL    DEFAULT 0 COMMENT '0-활성화/1-삭제됨', 
     PRIMARY KEY (userProfileImgIdx)
);

ALTER TABLE `Gridge-ERD`.`userProfileImg` COMMENT '사용자 프로필 사진';

ALTER TABLE `Gridge-ERD`.`userProfileImg`
    ADD CONSTRAINT FK_userProfileImg_userIdx_user_userIdx FOREIGN KEY (userIdx)
        REFERENCES `Gridge-ERD`.`user` (userIdx) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- postImg Table Create SQL
CREATE TABLE `Gridge-ERD`.`postImg`
(
    `postImgIdx`  BIGINT       NOT NULL    AUTO_INCREMENT, 
    `postIdx`     BIGINT       NULL, 
    `imgUrl`      TEXT         NULL, 
    `createdAt`   TIMESTAMP    NOT NULL    DEFAULT current_timestamp, 
    `updatedAt`   TIMESTAMP    NOT NULL    DEFAULT current_timestamp ON UPDATE current_timestamp, 
    `status`      TINYINT      NOT NULL    DEFAULT 0 COMMENT '0-활성화/1-삭제됨', 
     PRIMARY KEY (postImgIdx)
);

ALTER TABLE `Gridge-ERD`.`postImg` COMMENT '게시글 사진';

ALTER TABLE `Gridge-ERD`.`postImg`
    ADD CONSTRAINT FK_postImg_postIdx_post_postIdx FOREIGN KEY (postIdx)
        REFERENCES `Gridge-ERD`.`post` (postIdx) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- following Table Create SQL
CREATE TABLE `Gridge-ERD`.`following`
(
    `followingIdx`   BIGINT       NOT NULL    AUTO_INCREMENT, 
    `userIdx`        BIGINT       NOT NULL, 
    `targetUserIdx`  BIGINT       NOT NULL, 
    `createdAt`      TIMESTAMP    NOT NULL    DEFAULT current_timestamp, 
    `updatedAt`      TIMESTAMP    NOT NULL    DEFAULT current_timestamp ON UPDATE current_timestamp, 
    `status`         TINYINT      NOT NULL    DEFAULT 0 COMMENT '0-활성화/1-삭제/2-승인대기', 
     PRIMARY KEY (followingIdx)
);

ALTER TABLE `Gridge-ERD`.`following`
    ADD CONSTRAINT FK_following_userIdx_user_userIdx FOREIGN KEY (userIdx)
        REFERENCES `Gridge-ERD`.`user` (userIdx) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `Gridge-ERD`.`following`
    ADD CONSTRAINT FK_following_targetUserIdx_user_userIdx FOREIGN KEY (targetUserIdx)
        REFERENCES `Gridge-ERD`.`user` (userIdx) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- commentLike Table Create SQL
CREATE TABLE `Gridge-ERD`.`commentLike`
(
    `commentLikeIdx`  BIGINT       NOT NULL    AUTO_INCREMENT, 
    `userIdx`         BIGINT       NOT NULL, 
    `commentIdx`      BIGINT       NOT NULL, 
    `createdAt`       TIMESTAMP    NOT NULL    DEFAULT current_timestamp, 
    `updatedAt`       TIMESTAMP    NOT NULL    DEFAULT current_timestamp ON UPDATE current_timestamp, 
    `status`          TINYINT      NULL        DEFAULT 0 COMMENT '0-활성화/1-삭제됨', 
     PRIMARY KEY (commentLikeIdx)
);

ALTER TABLE `Gridge-ERD`.`commentLike` COMMENT '댓글 좋아요';

ALTER TABLE `Gridge-ERD`.`commentLike`
    ADD CONSTRAINT FK_commentLike_commentIdx_comment_commentIdx FOREIGN KEY (commentIdx)
        REFERENCES `Gridge-ERD`.`comment` (commentIdx) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `Gridge-ERD`.`commentLike`
    ADD CONSTRAINT FK_commentLike_userIdx_user_userIdx FOREIGN KEY (userIdx)
        REFERENCES `Gridge-ERD`.`user` (userIdx) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- postLike Table Create SQL
CREATE TABLE `Gridge-ERD`.`postLike`
(
    `postLikeIdx`  BIGINT       NOT NULL    AUTO_INCREMENT, 
    `userIdx`      BIGINT       NOT NULL, 
    `postIdx`      BIGINT       NOT NULL, 
    `createdAt`    TIMESTAMP    NOT NULL    DEFAULT current_timestamp, 
    `updatedAt`   TIMESTAMP    NOT NULL    DEFAULT current_timestamp ON UPDATE current_timestamp, 
    `status`       TINYINT      NOT NULL    DEFAULT 0 COMMENT '0-활성화/1-삭제됨', 
     PRIMARY KEY (postLikeIdx)
);

ALTER TABLE `Gridge-ERD`.`postLike` COMMENT '게시글 좋아요';

ALTER TABLE `Gridge-ERD`.`postLike`
    ADD CONSTRAINT FK_postLike_postIdx_post_postIdx FOREIGN KEY (postIdx)
        REFERENCES `Gridge-ERD`.`post` (postIdx) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `Gridge-ERD`.`postLike`
    ADD CONSTRAINT FK_postLike_userIdx_user_userIdx FOREIGN KEY (userIdx)
        REFERENCES `Gridge-ERD`.`user` (userIdx) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- message Table Create SQL
CREATE TABLE `Gridge-ERD`.`message`
(
    `messageIdx`  BIGINT       NOT NULL    AUTO_INCREMENT, 
    `roomIdx`     BIGINT       NOT NULL, 
    `senderIdx`   BIGINT       NOT NULL, 
    `content`     VARCHAR(300) NOT NULL,
    `createdAt`   TIMESTAMP    NOT NULL    DEFAULT current_timestamp, 
    `updatedAt`   TIMESTAMP    NOT NULL    DEFAULT current_timestamp ON UPDATE current_timestamp, 
    `status`      TINYINT      NOT NULL    DEFAULT 0 COMMENT '0-활성화/1-삭제', 
     PRIMARY KEY (messageIdx)
);

ALTER TABLE `Gridge-ERD`.`message` COMMENT '메시지';

ALTER TABLE `Gridge-ERD`.`message`
    ADD CONSTRAINT FK_message_roomIdx_room_roomIdx FOREIGN KEY (roomIdx)
        REFERENCES `Gridge-ERD`.`room` (roomIdx) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `Gridge-ERD`.`message`
    ADD CONSTRAINT FK_message_senderIdx_user_userIdx FOREIGN KEY (senderIdx)
        REFERENCES `Gridge-ERD`.`user` (userIdx) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- userLog Table Create SQL
CREATE TABLE `Gridge-ERD`.`userLog`
(
    `userLogIdx`  BIGINT         NOT NULL    AUTO_INCREMENT, 
    `userIdx`     BIGINT         NOT NULL, 
    `logType`     BIGINT         NOT NULL   COMMENT '0-C/1-R/2-U/3-D',
    `createdAt`   TIMESTAMP      NOT NULL    DEFAULT current_timestamp, 
    `updatedAt`   TIMESTAMP      NOT NULL    DEFAULT current_timestamp ON UPDATE current_timestamp, 
    `status`      TINYINT        NOT NULL    DEFAULT 0 COMMENT '0-활성화/1-삭제됨', 
     PRIMARY KEY (userLogIdx)
);

ALTER TABLE `Gridge-ERD`.`userLog` COMMENT '사용자 로그';

ALTER TABLE `Gridge-ERD`.`userLog`
    ADD CONSTRAINT FK_userLog_userIdx_user_userIdx FOREIGN KEY (userIdx)
        REFERENCES `Gridge-ERD`.`user` (userIdx) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- postLog Table Create SQL
CREATE TABLE `Gridge-ERD`.`postLog`
(
    `postLogIdx`  BIGINT         NOT NULL    AUTO_INCREMENT, 
    `postIdx`     BIGINT         NOT NULL, 
    `logType`     BIGINT         NOT NULL    COMMENT '0-C/1-R/2-U/3-D',
    `createdAt`   TIMESTAMP      NOT NULL    DEFAULT current_timestamp, 
    `updatedAt`   TIMESTAMP      NOT NULL    DEFAULT current_timestamp ON UPDATE current_timestamp, 
    `status`      TINYINT        NOT NULL    DEFAULT 0 COMMENT '0-활성화/1-삭제됨', 
     PRIMARY KEY (postLogIdx)
);

ALTER TABLE `Gridge-ERD`.`postLog` COMMENT '게시글 로그';

ALTER TABLE `Gridge-ERD`.`postLog`
    ADD CONSTRAINT FK_postLog_postIdx_post_postIdx FOREIGN KEY (postIdx)
        REFERENCES `Gridge-ERD`.`post` (postIdx) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- commentLog Table Create SQL
CREATE TABLE `Gridge-ERD`.`commentLog`
(
    `commentLogIdx`  BIGINT         NOT NULL    AUTO_INCREMENT, 
    `commentIdx`     BIGINT         NOT NULL, 
    `logType`        BIGINT         NOT NULL   COMMENT '0-C/1-R/2-U/3-D',
    `createdAt`      TIMESTAMP      NOT NULL    DEFAULT current_timestamp, 
    `updatedAt`      TIMESTAMP      NOT NULL    DEFAULT current_timestamp ON UPDATE current_timestamp, 
    `status`         TINYINT        NOT NULL    DEFAULT 0 COMMENT '0-활성화/1-삭제됨', 
     PRIMARY KEY (commentLogIdx)
);

ALTER TABLE `Gridge-ERD`.`commentLog` COMMENT '댓글 로그';

ALTER TABLE `Gridge-ERD`.`commentLog`
    ADD CONSTRAINT FK_commentLog_commentIdx_comment_commentIdx FOREIGN KEY (commentIdx)
        REFERENCES `Gridge-ERD`.`comment` (commentIdx) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- reportLog Table Create SQL
CREATE TABLE `Gridge-ERD`.`reportLog`
(
    `reportLogIdx`      BIGINT         NOT NULL    AUTO_INCREMENT, 
    `postReportIdx`     BIGINT         NULL, 
    `commentReportIdx`  BIGINT         NULL, 
    `reportCode`        TINYINT        NOT NULL,
    `logType`           BIGINT         NOT NULL    COMMENT '0-C/1-R/2-U/3-D',
    `createdAt`         TIMESTAMP      NOT NULL    DEFAULT current_timestamp, 
    `updatedAt`         TIMESTAMP      NOT NULL    DEFAULT current_timestamp ON UPDATE current_timestamp, 
    `status`            TINYINT        NOT NULL    DEFAULT 0 COMMENT '0-활성화/1-삭제됨', 
     PRIMARY KEY (reportLogIdx)
);

ALTER TABLE `Gridge-ERD`.`reportLog` COMMENT '신고 로그';

ALTER TABLE `Gridge-ERD`.`reportLog`
    ADD CONSTRAINT FK_reportLog_commentReportIdx_commentReport_commentReportIdx FOREIGN KEY (commentReportIdx)
        REFERENCES `Gridge-ERD`.`commentReport` (commentReportIdx) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `Gridge-ERD`.`reportLog`
    ADD CONSTRAINT FK_reportLog_postReportIdx_postReport_postReportIdx FOREIGN KEY (postReportIdx)
        REFERENCES `Gridge-ERD`.`postReport` (postReportIdx) ON DELETE RESTRICT ON UPDATE RESTRICT