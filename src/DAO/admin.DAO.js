class AdminDAO {

    cosntructor(){}

    selectUserList = async (conn, whereQuery, offset) => {
        const adminSelectUserQuery = `SELECT * FROM user WHERE 1 = 1`;
        const offsetQuery = ` limit 10 offset ?`;
        const [userRow] = await conn.query(adminSelectUserQuery+whereQuery+offsetQuery, offset);
    
        return userRow;
    }
    
    selectUserLastLoginTime = async (conn, userIdx) => {
        const selectUserEverythingQuery = `
            SELECT loginTime
            FROM user
            WHERE userIdx = ?
        `;
        const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
        
        return userRow;
    
    }
    
    selectUserProfileImgByUserIdx = async (conn, userIdx) => {
        const selectUserEverythingQuery = `
            SELECT *
            FROM userProfileImg
            WHERE userIdx = ?
        `;
        const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
        
        return userRow;
    }
    
    selectUserPostByUserIdx = async (conn, userIdx) => {
        const selectUserEverythingQuery = `
            SELECT *
            FROM post
            where userIdx = ?
        `;
        const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
        
        return userRow;
    }
    
    selectUserPostLikeByUserIdx = async (conn, userIdx) => {
        const selectUserEverythingQuery = `
            SELECT *
            FROM postLike
            where userIdx = ?
        `;
        const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
        
        return userRow;
    }
    
    selectUserPostReportByUserIdx = async (conn, userIdx) => {
        const selectUserEverythingQuery = `
            SELECT *
            FROM postReport
            where reporterIdx = ?
        `;
        const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
        
        return userRow;
    }
    
    selectUserCommentByUserIdx = async (conn, userIdx) => {
        const selectUserEverythingQuery = `
            SELECT *
            FROM comment
            where userIdx = ?
        `;
        const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
        
        return userRow;
    }
    
    selectUserCommentLikeByUserIdx = async (conn, userIdx) => {
        const selectUserEverythingQuery = `
            SELECT *
            FROM commentLike
            where userIdx = ?
        `;
        const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
        
        return userRow;
    }
    
    selectUserCommentReportByUserIdx = async (conn, userIdx) => {
        const selectUserEverythingQuery = `
            SELECT *
            FROM commentReport
            where reporterIdx = ?
        `;
        const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
        
        return userRow;
    }
    
    selectUserFollowingByUserIdx = async (conn, userIdx) => {
        const selectUserEverythingQuery = `
            SELECT *
            FROM following
            where userIdx = ?
        `;
        const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
        
        return userRow;
    }
    
    selectUserFollowerByUserIdx = async (conn, userIdx) => {
        const selectUserEverythingQuery = `
            SELECT *
            FROM following
            where targetUserIdx = ?
        `;
        const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
        
        return userRow;
    }
    
    selectUserMessageByUserIdx = async (conn, userIdx) => {
        const selectUserEverythingQuery = `
            SELECT *
            FROM message
            where senderIdx = ?
        `;
        const [userRow] = await conn.query(selectUserEverythingQuery, userIdx);
        
        return userRow;
    }
    
    updateUserStatus = async (conn, userIdx) => {
        const updateUserStatusQuery = `
            UPDATE user
            SET status = 3
            WHERE userIdx = ?
        `;
        const [userRow] = await conn.query(updateUserStatusQuery, userIdx);
        
        return userRow;
    }
    
    selectPostList = async (conn, whereQuery, offset) => {
        const adminSelectListQuery = `SELECT * FROM post WHERE 1=1 `;
        const offsetquery = `LIMIT 10 offset ?`;
        
        const [userRow] = await conn.query(adminSelectListQuery+whereQuery+offsetquery, offset);
    
        return userRow;
    }
    
    selectPostByPostIdx = async (conn, postIdx) => {
        const selectPostEverythingQuery = `
            SELECT *
            FROM post
            WHERE postIdx = ?
        `;
        const [postRow] = await conn.query(selectPostEverythingQuery, postIdx);
        
        return postRow;
    }
    
    selectPostImgByPostIdx = async (conn, postIdx) => {
        const selectPostEverythingQuery = `
            SELECT *
            FROM postImg
            WHERE postIdx = ?
        `;
        const [postRow] = await conn.query(selectPostEverythingQuery, postIdx);
        
        return postRow;
    }
    
    selectPostLikeByPostIdx = async (conn, postIdx) => {
        const selectPostEverythingQuery = `
            SELECT COUNT(postIdx) as '좋아요 개수'
            FROM postLike
            WHERE postIdx = ?
        `;
        const [postRow] = await conn.query(selectPostEverythingQuery, postIdx);
        
        return postRow;
    }
    
    selectPostReportByPostIdx = async (conn, postIdx) => {
        const selectPostEverythingQuery = `
            SELECT *
            FROM postReport
            WHERE postIdx = ?
        `;
        const [postRow] = await conn.query(selectPostEverythingQuery, postIdx);
        
        return postRow;
    }
    
    selectPostCommentByPostIdx = async (conn, postIdx) => {
        const selectPostEverythingQuery = `
            SELECT *
            FROM comment
            WHERE postIdx = ?
        `;
        const [postRow] = await conn.query(selectPostEverythingQuery, postIdx);
        
        return postRow;
    }
    
    updatePostStatus = async (conn, postIdx) => {
        const updatePostStatusQuery = `
            UPDATE post
            set status = 3
            WHERE postIdx = ?
        `;
        const [postResult] = await conn.query(updatePostStatusQuery, postIdx)
    
        return postResult;
    }
    
    updateCommentStatusByPostIdx = async (conn, postIdx) => {
        const updateCommentStatusQuery = `
            UPDATE comment
            set status = 3
            WHERE postIdx = ?
        `;
        const [postResult] = await conn.query(updateCommentStatusQuery, postIdx)
    
        return postResult;
    }
    
    updateCommentStatusByCommentIdx = async (conn, commentIdx) => {
        const updateCommentStatusQuery = `
            UPDATE comment
            set status = 3
            WHERE commentIdx = ?
        `;
        const [postResult] = await conn.query(updateCommentStatusQuery, commentIdx)
    
        return postResult;
    }
    
    selectPostReports = async (conn) => {
        const selectReportsQuery = `
            SELECT *
            FROM postReport
        `;
        
        const [reportResult] = await conn.query(selectReportsQuery);
    
        return reportResult;
    }
    
    selectCommentReports = async (conn) => {
        const selectReportsQuery = `
            SELECT *
            FROM commentReport
        `;
        
        const [reportResult] = await conn.query(selectReportsQuery);
    
        return reportResult;
    }
    
    selectReportPostContent = async (conn, postIdx) => {
        const selectPostReportContentQuery = `
            SELECT postIdx, content
            FROM post
            WHERE postIdx = ?
        `;
        const [reportResult] = await conn.query(selectPostReportContentQuery, postIdx);
    
        return reportResult;
    }
    
    selectReportCommentContent = async (conn, commentIdx) => {
        const selectCommentReportContentQuery = `
            SELECT commentIdx, content
            FROM comment
            WHERE commentIdx = ?
        `;
        const [reportResult] = await conn.query(selectCommentReportContentQuery, commentIdx);
    
        return reportResult;
    }
    
    selectReportPostReportCode = async (conn, postIdx) => {
        const selectPostReportContentQuery = `
            SELECT postIdx, reportCode, postReportIdx, reporterIdx
            FROM postReport
            WHERE postIdx = ?
        `;
        const [reportResult] = await conn.query(selectPostReportContentQuery, postIdx);
    
        return reportResult;
    }
    
    selectReportCommentReportCode = async (conn, commentIdx) => {
        const selectCommentReportContentQuery = `
            SELECT commentIdx, reportCode, commentReportIdx, reporterIdx
            FROM commentReport
            WHERE commentIdx = ?
        `;
        const [reportResult] = await conn.query(selectCommentReportContentQuery, commentIdx);
    
        return reportResult;
    }
    
    updatePostReportStatus = async (conn, postReportIdx) => {
        const updatePostReportStatusQuery = `
            UPDATE postReport
            set status = 3
            WHERE postReportIdx = ?
        `;
        const [postResult] = await conn.query(updatePostReportStatusQuery, postReportIdx);
    
        return postResult;
    }
    
    updateCommentReportStatus = async (conn, commentReportIdx) => {
        const updateCommentReportStatusQuery = `
            UPDATE commentReport
            set status = 3
            WHERE commentReportIdx = ?
        `;
        const [postResult] = await conn.query(updateCommentReportStatusQuery, commentReportIdx);
    
        return postResult;
    }
    
    selectUserLogs = async (conn, offset) => {
        const selectLogsQuery = `
            SELECT *
            FROM userLog
            LIMIT 10 offset ?
        `;
        const [logRow] = await conn.query(selectLogsQuery, offset);
        return logRow;
    }
    
    selectPostLogs = async (conn, offset) => {
        const selectLogsQuery = `
            SELECT *
            FROM postLog
            LIMIT 10 offset ?
        `;
        const [logRow] = await conn.query(selectLogsQuery, offset);
        return logRow;
    }
    
    selectCommentLogs = async (conn, offset) => {
        const selectLogsQuery = `
            SELECT *
            FROM commentLog
            LIMIT 10 offset ?
        `;
        const [logRow] = await conn.query(selectLogsQuery, offset);
        return logRow;
    }
    
    selectReportLogs = async (conn, offset) => {
        const selectLogsQuery = `
            SELECT *
            FROM reportLog
            LIMIT 10 offset ?
        `;
        const [logRow] = await conn.query(selectLogsQuery, offset);
        return logRow;
    }

}


module.exports = AdminDAO;
