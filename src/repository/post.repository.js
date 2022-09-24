
class PostRepository {

    cosntructor(){}

    insertPost = async (connection, insertPostParams) => {
        const insertPostQuery = `
            INSERT INTO post(userIdx, content)
            values(?,?)
        `;
        const [insertPostRow] = await connection.query(insertPostQuery, insertPostParams);

        return insertPostRow;
    }

    insertPostImg = async (connection, insertPostImgParams) => {
        const insertPostImgQuery = `
            INSERT INTO postImg(postIdx ,imgUrl)
            values(?,?)
        `;
        const [insertPostImgRow] = await connection.query(insertPostImgQuery, insertPostImgParams);

        return insertPostImgRow;
    }

    updatePost = async (connection, editPostParams) => {
        const updatePostQuery = `
            UPDATE post
            SET content = ?
            WHERE postIdx = ?
        `;
        const [updatePostRow] = await connection.query(updatePostQuery, editPostParams);

        return updatePostRow;
    };

    selectPostByPostIdx = async (connection, postIdx) => {
        const selectPostByPostIdxQuery = `
            SELECT postIdx, content
            FROM post
            Where PostIdx = ?
        `;
        const [selectedPostRow] = await connection.query(selectPostByPostIdxQuery, postIdx);

        return selectedPostRow;
    }

    selectUserIdxByPostIdx = async (connection, postIdx) => {
        const selectUserIdxByPostIdxQuery = `
            SELECT userIdx
            FROM post
            WHERE postIdx = ?
        `;
        const [selectedUserRow] = await connection.query(selectUserIdxByPostIdxQuery, postIdx);

        return selectedUserRow;
    }

    selectUserPhotos = async (connection, userIdx, page) => {
        const selectUserPostsQuery = `
            SELECT p.postIdx as postIdx, pi.imgUrl as postImgUrl
            FROM post as p
                join postImg as pi
                    on pi.postIdx = p.postIdx and pi.status = 0
                join user as u 
                    on u.userIdx = p.userIdx
            WHERE p.status = 0 and u.userIdx = ?
            ORDER BY p.postIdx
            LIMIT 9 OFFSET ?
        `;
        const [postRows] = await connection.query(selectUserPostsQuery, [userIdx, page]);

        return postRows;

    }

    selectPostImgs = async (connection, postIdx) => {
        const selectPostImgsQuery = `
            SELECT pi.postImgIdx, pi.imgUrl
            FROM postImg as pi
                join post as p on p.postIdx = pi.postIdx
            WHERE pi.status = 0 and p.postIdx = ?;
            ORDER BY p.postIdx
        `;

        const [postImgRows] = await connection.query(selectPostImgsQuery, postIdx);

        return postImgRows;
    }

    selectPostStatus = async (connection, postIdx) => {
        const selectPostStatusQuery = `
            SELECT status
            FROM post
            WHERE postIdx = ?;
        `;

        const [postStatusRow] = await connection.query(selectPostStatusQuery, postIdx);

        return postStatusRow;
    }

    updatePostStatusInactive = async (connection, postIdx) => {
        const updatePostStatusQuery = `
            UPDATE post
            SET status = 1
            WHERE postIdx = ?;
        `;

        const updatePostStatusRow = await connection.query(updatePostStatusQuery, postIdx);

        return updatePostStatusRow[0];
    }

    selectPostContent = async (connection, postIdx) => {
        const selectPostContentQuery = `
            SELECT user.id, post.content, 
                case
                    when timestampdiff(minute, post.createdAt, current_timestamp) < 60
                        then CONCAT(TIMESTAMPDIFF(minute, post.createdAt , NOW()), '분')
                    when timestampdiff(hour , post.createdAt, current_timestamp) < 24
                        then CONCAT(TIMESTAMPDIFF(hour, post.createdAt , NOW()), '시간')
                    when timestampdiff(day, post.createdAt, current_timestamp) < 30 
                        then CONCAT(TIMESTAMPDIFF(day, post.createdAt, NOW()), '일')
                    else 
                        timestampdiff(year , post.createdAt, current_timestamp)
                end as uploadTime
            FROM post
                join user on post.userIdx = user.userIdx
            WHERE post.postIdx = ?
        `;
        const [postContentRow] = await connection.query(selectPostContentQuery, postIdx);

        return postContentRow
    }

    checkPostLike = async (connection, userIdx, postIdx) => {
        const checkPostLikeQuery = `
            SELECT EXISTS (
                SELECT postLikeIdx
                FROM postLike
                WHERE postIdx = ? and userIdx = ?
                limit 1
            ) as success
        `;

        const [postLikeResult] = await connection.query(checkPostLikeQuery, [postIdx, userIdx]);

        return postLikeResult;
    }

    updatePostLike = async (connection, userIdx, postIdx) => {
        const checkPostLikeQuery = `
            UPDATE postLike
            SET status = 0
            WHERE postIdx = ? and userIdx = ?
        `;

        const [updatedPostLikeResult] = await connection.query(checkPostLikeQuery, [postIdx, userIdx]);

        return updatedPostLikeResult;
    }

    insertPostLike = async (connection, userIdx, postIdx) => {
        const insertPostLikeQuery = `
            INSERT INTO postLike(userIdx, postIdx)
            values(?,?)
        `;
        const [insertedPostLikeResult] = await connection.query(insertPostLikeQuery, [userIdx, postIdx]);

        return insertedPostLikeResult;
    }

    updatePostDislike = async (connection, userIdx, postIdx) => {
        const checkPostLikeQuery = `
            UPDATE postLike
            SET status = 1
            WHERE postIdx = ? and userIdx = ?
        `;

        const [updatedPostLikeResult] = await connection.query(checkPostLikeQuery, [postIdx, userIdx]);

        return updatedPostLikeResult;
    }

    checkPostReport = async (connection, userIdx, postIdx) => {
        const checkPostReportQuery = `
            SELECT EXISTS (
                SELECT postReportIdx
                FROM postReport
                WHERE reporterIdx = ? and postIdx = ? 
                limit 1
            ) as success
        `;

        const [postCheckResult] = await connection.query(checkPostReportQuery, [userIdx, postIdx]);

        return postCheckResult;
    }

    insertPostReport = async (connection, userIdx, postIdx, reportCode) => {
        const insertPostReportQuery = `
            INSERT INTO postReport(reporterIdx, postIdx, reportCode)
            VALUES(?,?,?)
        `;

        const [postReportResult] = await connection.query(insertPostReportQuery, [userIdx, postIdx, reportCode]);

        return postReportResult;
    }

    selectFollowingUserPosts = async (connection, userIdx, page) => {
        const selectFollowingUserPostsQuery = `
            SELECT u.userIdx, f.targetUserIdx, followingName, postIdx, content, postImgUrl, likeCount, 
                case
                    when timestampdiff(minute, postTime, current_timestamp) < 60
                        then CONCAT(TIMESTAMPDIFF(minute, postTime , NOW()), '분')
                    when timestampdiff(hour , postTime, current_timestamp) < 24
                        then CONCAT(TIMESTAMPDIFF(hour, postTime , NOW()), '시간')
                    when timestampdiff(day, postTime, current_timestamp) < 30 
                        then CONCAT(TIMESTAMPDIFF(day, postTime, NOW()), '일')
                    else 
                        timestampdiff(year , postTime, current_timestamp)
                end as postTime
            FROM user as u
                join ( SELECT f.userIdx, f.targetUserIdx, u1.ID as followingName , p.postIdx, p.content, p.createdAt as postTime, postImgUrl, likeCount
                FROM following as f
                    join user as u1 on u1.userIdx = f.targetUserIdx
                        join(SELECT p.userIdx, p.postIdx, p.content, p.createdAt, pi.imgUrl as postImgUrl, likeCount
                        FROM post as p
                            left join postImg as pi on pi.postIdx = p.postIdx and pi.status = 0
                            left join (SELECT COUNT(postLikeIdx) as likeCount, postIdx
                                FROM postLike
                                WHERE status = 0
                                group by postIdx) pl on pl.postIdx = p.postIdx
                    WHERE p.status = 0
                    ORDER BY p.createdAt DESC) p on p.userIdx = f.targetUserIdx
                WHERE f.status = 0) f on f.userIdx = u.userIdx
            WHERE u.userIdx = ? and f.userIdx = ?
            ORDER BY p.postIdx DESC
            LIMIT 10 offset ?
        `;

        const [postResult] = await connection.query(selectFollowingUserPostsQuery, [userIdx, userIdx, page]);

        return postResult;
    }

    insertPostLog = async (conn, postIdx, logType) => {
        const insertLogQuery = `
            INSERT INTO postLog(postIdx, logType)
            values(?,?)
        `;
        
        const [LogRow] = await conn.query(insertLogQuery, [postIdx, logType]);

        return LogRow;
    }

    insertReportLog = async (conn, postReportIdx, reportType, logType) => {
        const insertLogQuery = `
            INSERT INTO reportLog(commentReportIdx, postReportIdx, reportType, logType)
            VALUES(?,?,?,?)
        `;
        
        const [LogRow] = await conn.query(insertLogQuery, [postReportIdx, reportType, logType]);

        return LogRow;
    }
}

module.exports = PostRepository;