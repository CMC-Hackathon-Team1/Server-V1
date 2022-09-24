
class UserRepository {

    cosntructor(){}

    checkUserExistsByUserId =  async (conn, userId) => {
        const selectByUserIdQuery = `
            SELECT id
            FROM user
            WHERE ID = ?
        `;
        const [userRow] = await conn.query(selectByUserIdQuery, userId);
    
        return userRow;
    }
    
    checkUserPassword = async (conn, userId) => {
        const checkUserPasswordQuery = `
            SELECT password
            FROM user
            WHERE ID = ?
        `;
        const [checkRow] = await conn.query(checkUserPasswordQuery, userId);
        
        return checkRow;
    }
    
    insertUser = async (conn, phone, name, hashedPassword, birth, id, userType, socialId) => {
        const insertUserQuery = `
            INSERT INTO user(phone, name, password, birth, ID, userType, socialId, introduce, profileImgUrl, website, token)
            VALUES(?,?,?,?,?,?,?,null,null,null,null)
        ;`;
        const [insertedRow] = await conn.query(insertUserQuery, [phone, name, hashedPassword, birth, id, userType, socialId]);
    
        return insertedRow;
    }
    
    getUserType = async (conn, userIdx) => {
        const selectUserTokenQuery = `
            SELECT userType
            FROM user
            WHERE userIdx = ?
        `;
        const [selectTokenResult] = await conn.query(selectUserTokenQuery, userIdx);
    
        return selectTokenResult[0].userType;
    }
    
    getSocialId = async (conn, socialId) => {
        const getSocialIdQuery = `
            SELECT socialId
            FROM user
            WHERE socialId = ?
        `;
        const [userRow] = await conn.query(getSocialIdQuery, socialId);
    
        return userRow;
    }
    
    getUserIdxBySocialId = async (conn, socialId) => {
        const getUserIdxBySocialIdQuery = `
            SELECT userIdx
            FROM user
            WHERE socialId = ?
        `;
        const [userRow] = await conn.query(getUserIdxBySocialIdQuery, socialId);
    
        return userRow;
    }
    
    getUserIdxByUserId = async (conn, userId) => {
        const getUserIdxByUserIdQuery = `
            SELECT userIdx
            FROM user
            WHERE ID = ?
        `;
        const [userRow] = await conn.query(getUserIdxByUserIdQuery, userId);
    
        return userRow;
    }
    
    getUserProfile = async (conn, userIdx) => {
        const selectUserProfileQuery = `
            SELECT id, name, introduce, profileImgUrl, website,
                if (postCount is null, 0, postCount) as postCount,
                if (followerCount is null, 0, followerCount) as followerCount,
                if (followingCount is null, 0, followingCount) as followingCount
            FROM user
                LEFT JOIN (
                    SELECT userIdx, COUNT(postIdx) as postCount
                    FROM post 
                    WHERE status = 0
                    GROUP BY userIdx
                    ) p ON user.userIdx = p.userIdx
                LEFT JOIN (
                    SELECT userIdx, COUNT(userIdx) as followerCount
                    FROM following
                    WHERE status = 0
                    GROUP BY followingIdx
                    ) f1 ON f1.userIdx = user.userIdx
                LEFT JOIN (
                    SELECT userIdx, targetUserIdx, COUNT(targetUserIdx) as followingCount
                    FROM following
                    WHERE status = 0
                    GROUP BY followingIdx
                    ) ff ON user.userIdx = ff.targetUserIdx
            WHERE user.userIdx = ?
        `;
        const [userProfileRow] = await conn.query(selectUserProfileQuery, userIdx);
    
        return userProfileRow;
    }
    
    getUserIdxByPhone = async (conn, userIdx) => {
        const getUserPhoneQuery = `
            SELECT userIdx
            FROM user
            WHERE phone = ?
        `;
    
        const [userRow] = await conn.query(getUserPhoneQuery, userIdx);
    
        return userRow;
    }
    
    updatePassword = async (conn, userParams) => {
        const updatePasswordQuery = `
            UPDATE user
            SET password = ?
            WHERE userIdx = ?    
        `;
        const [userRow] = await conn.query(updatePasswordQuery, userParams);
    
        return userRow;
    }
    
    updateUserProfile = async (conn, profileImgUrl, name, id, website, introduce, userIdx) => {
        const updateUserProfileQuery = `
            UPDATE user
            SET profileImgUrl = ?, name = ?, id = ?, website = ?, introduce = ?
            WHERE userIdx = ?
        `;
    
        const [updateUserRow] = await conn.query(updateUserProfileQuery, [profileImgUrl, name, id, website, introduce, userIdx]);
    
        return updateUserRow;
    }
    
    updatePrivate = async (conn, userIdx, privateCode) => {
        const updatePrivateQuery = `
            UPDATE user
            SET private = ?
            where userIdx = ?
        `;
        const [updatedUserRow] = await conn.query(updatePrivateQuery, [privateCode, userIdx]);
    
        return updatedUserRow;
    }
    
    checkUserPrivateById = async (conn, userId) => {
        const checkUserPrivateQuery = `
            SELECT EXISTS (
                SELECT userIdx
                FROM user
                where ID = ? and private = 1
            ) as success
        `;
        const [checkedRow] = await conn.query(checkUserPrivateQuery, userId);
        
        return checkedRow;
    }
    
    checkUserPrivateByUserIdx = async (conn, userIdx) => {
        const checkUserPrivateQuery = `
            SELECT EXISTS (
                SELECT ID
                FROM user
                where userIdx = ? and private = 1
            ) as success
        `;
        const [checkedRow] = await conn.query(checkUserPrivateQuery, userIdx);
        
        return checkedRow;
    }
    
    insertFollow = async (conn, userIdx, followUserId, status) => {
        const checkUserPrivateQuery = `
            INSERT INTO following(userIdx, targetUserIdx, status)
            VALUES(?,
                    (
                        SELECT userIdx
                        FROM user
                        WHERE ID = ?
                    )
                    , ?)
        `;
    
        const [checkedRow] = await conn.query(checkUserPrivateQuery, [userIdx, followUserId, status]);
        
        return checkedRow;
    }
    
    checkFollowByTargetId = async (conn, userIdx, followUserId, status) => {
        const checkFollowQuery = `
            SELECT EXISTS (
                SELECT followingIdx
                FROM following
                WHERE following.userIdx = ? and following.targetUserIdx = 
                (
                    SELECT user.userIdx
                    FROM user
                    WHERE user.ID = ?
                ) and status = ?
            ) as success
        `;
        const [checkedRow] = await conn.query(checkFollowQuery, [userIdx, followUserId, status]);
        
        return checkedRow;
    }
    
    checkFollowByRequesterId = async (conn, userIdx, followeeId, status) => {
        const checkFollowQuery = `
            SELECT EXISTS (
                SELECT followingIdx
                FROM following
                WHERE following.targetUserIdx = ? and following.userIdx = 
                (
                    SELECT user.userIdx
                    FROM user
                    WHERE user.ID = ?
                ) and status = ?
            ) as success
        `;
        const [checkedRow] = await conn.query(checkFollowQuery, [userIdx, followeeId, status]);
        
        return checkedRow;
    }
    
    updateFollowStatusByTargetId = async (conn, userIdx, followerId, status) => {
        const updateFollowQuery = `
            UPDATE following
            SET status = ?
            WHERE userIdx = ? and targetUserIdx = (
                    SELECT userIdx
                    FROM user
                    WHERE ID = ?
                )
        `;
        const [updatedRow] = await conn.query(updateFollowQuery, [status, userIdx, followerId]);
    
        return updatedRow;
    }
    
    updateFollowStatusByRequesterId = async (conn, userIdx, followeeId, status) => {
        const updateFollowQuery = `
            UPDATE following
            SET status = ?
            WHERE targetUserIdx = ? and userIdx = (
                    SELECT userIdx
                    FROM user
                    WHERE ID = ?
                )
       `;
    const [updatedRow] = await conn.query(updateFollowQuery, [status, userIdx, followeeId]);
    
    return updatedRow;
    }
    
    checkUserFollowRequests = async (conn , userIdx) => {
        const checkFollowRequestQuery = `
            SELECT user.id, user.name, user.profileImgUrl
            FROM user
                INNER JOIN following ON user.userIdx = following.userIdx
            WHERE following.userIdx IN (
                    SELECT following.userIdx
                    FROM following
                    WHERE following.targetUserIdx = ? and following.status = 2
                    )
            ORDER BY following.updatedAt ASC;
        `;
        const [RequestRow] = await conn.query(checkFollowRequestQuery, userIdx);
    
        return RequestRow;
    }
    
    updateUserStatus = async (conn , userIdx) => {
        const updateUserStatusQuery = `
            UPDATE user
            SET status = 1
            WHERE userIdx = ?
        `;
        const [RequestRow] = await conn.query(updateUserStatusQuery, userIdx);
    
        return RequestRow;
    }
    
    updateUserTokenNull = async (conn , userIdx) => {
        const updateUserTokenQuery = `
            UPDATE user
            SET token = NULL
            WHERE userIdx = ?
        `;
        const [updateRow] = await conn.query(updateUserTokenQuery, userIdx);
    
        return updateRow;
    }
    
    updateUserIdNull = async (conn , userIdx) => {
        const updateUserIdNullQuery = `
            UPDATE user
            SET ID = NULL
            WHERE userIdx = ?
        `;
        const [updateRow] = await conn.query(updateUserIdNullQuery, userIdx);
    
        return updateRow;
    }
    
    updateUserProfileImgUrlStatus = async (conn, userIdx) => {
        const updateUserProfileImgUrlStatusQuery = `
            IF EXISTS (
                SELECT *
                FROM userProfileImg
                WHERE userIdx = ?
                )
            BEGIN 
                UPDATE userProfileImg
                SET status = 1
                WHERE userIdx = ?
            ELSE
            END
        `;
        const [updateRow] = await conn.query(updateUserProfileImgUrlStatusQuery, [userIdx, userIdx]);
    
        return updateRow;
    }
    
    updatePostStatusInactive = async (conn, userIdx) => {
        const updatePostStatusQuery = `
            IF EXISTS (
                SELECT *
                FROM post
                WHERE userIdx = ?
                )
            BEGIN 
                UPDATE post
                SET status = 1
                where userIdx = ?
            END
        `;
        const [updateRow] = await conn.query(updatePostStatusQuery, [userIdx, userIdx]);
    
        return updateRow;
    }
    
    updatePostImgStatusInactive = async (conn, userIdx) => {
        const updateUserIdNullQuery = `
            IF EXISTS (
                SELECT *
                FROM postImg
                WHERE postImg.postIdx = ( SELECT postIdx FROM post WHERE userIdx = ? )
                )
            BEGIN
                UPDATE postImg
                SET status = 1
                WHERE postImg.postIdx = ( SELECT postIdx FROM post WHERE userIdx = ? )
            END
        `;
        const [updateRow] = await conn.query(updateUserIdNullQuery, [userIdx, userIdx]);
    
        return updateRow;
    }
    
    updateCommentStatusInactive = async (conn, userIdx) => {
        const updatCommentStatusQuery = `
            IF EXISTS (
                SELECT *
                FROM comment
                WHERE userIdx = ?
                )
            BEGIN 
                UPDATE comment
                set status = 1
                WHERE userIdx = ?
            END
        `;
    
        const [updateRow] = await conn.query(updatCommentStatusQuery, [userIdx, userIdx]);
    
        return updateRow;
    }
    
    updatePostLikeStatusInactive = async (conn, userIdx) => {
        const updatPostLikeStatusQuery = `
            IF EXISTS (
                SELECT *
                FROM postLike
                WHERE userIdx = ?
                )
            BEGIN 
                UPDATE postLike
                set status = 1
                WHERE userIdx = ?
            END
        `;
    
        const [updateRow] = await conn.query(updatPostLikeStatusQuery, [userIdx, userIdx]);
    
        return updateRow;
    }
    
    updateCommentLikeStatusInactive = async (conn, userIdx) => {
        const updatCommentLikeStatusQuery = `
            IF EXISTS (
                SELECT *
                FROM commentLike
                WHERE userIdx = ?
                )
            BEGIN 
                UPDATE commentLike
                set status = 1
                WHERE userIdx = ?
            END
        `;
    
        const [updateRow] = await conn.query(updatCommentLikeStatusQuery, [userIdx, userIdx]);
    
        return updateRow;
    }
    
    updateFollowStatusInactive = async (conn, userIdx) => {
        const updatFollowtatusQuery = `
            IF EXISTS (
                SELECT *
                FROM follow
                WHERE userIdx = ? or targetUserIdx = ?
                )
            BEGIN 
                UPDATE follow
                SET status = 1
                WHERE userIdx = ? or targetUserIdx = ?
            END
        `;
    
        const [updateRow] = await conn.query(updatFollowtatusQuery, [userIdx, userIdx, userIdx, userIdx]);
    
        return updateRow;
    }
    
    selectUserTokenByIdx = async (conn, userIdx) => {
        const selectUserTokenQuery = `
            SELECT token
            FROM user
            WHERE userIdx = ?
        `;
        const [selectTokenResult] = await conn.query(selectUserTokenQuery, userIdx);
    
        return selectTokenResult[0].token;
    }
    
    updateUserToken = async (conn, token, userIdx) => {
        const updateTokenQuery = `
            UPDATE user
            SET token = ?
            WHERE userIdx = ?
        `;
        const [updatedUserRow] = await conn.query(updateTokenQuery, [token, userIdx]);
    
        return updatedUserRow;
    }
    
    updateLoginTime = async (conn, userIdx) => {
        const updateLoginTimeQuery = `
            UPDATE user
            SET loginTime = CURRENT_TIMESTAMP
            WHERE userIdx = ?
        `;
        
        const [userRow] = await conn.query(updateLoginTimeQuery, userIdx);
    
        return userRow;
    }
    
    insertUserLog = async (conn, userIdx, logType) => {
        const insertLogQuery = `
            INSERT INTO userLog(userIdx, logType)
            VALUES(?,?)
        `;
        
        const [LogRow] = await conn.query(insertLogQuery, [userIdx, logType]);
    
        return LogRow;
    }
}


module.exports = UserRepository;
