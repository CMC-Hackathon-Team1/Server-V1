class userDAO {

    cosntructor(){}


    createPersonaByUserId = async (conn, userId, personaId, nickname, introduction, profileImgUrl) => {
        const createPersonaQuery = `
            INSERT INTO Profiles (userId, personaId, profileImgUrl, statusMessage, profileName)
            VALUE (?, ?, ?, ?, ?)
        `;

        const createPersonaParams = [userId, personaId, profileImgUrl, introduction, nickname];

        const [creationResult] = await conn.query(createPersonaQuery, createPersonaParams);

        return creationResult;
    }

    checkPersona = async (conn, userId) => {
        const checkPersonaQuery = `
            SELECT COUNT(*) as count
            FROM Profiles
            WHERE userId= ?
        `;

        const [checkPersonaResult] = await conn.query(checkPersonaQuery, userId);

        return checkPersonaResult;
    }

    retrieveUserProfiles = async (conn,userId) => {
        const retrieveUserProfilesQuery = `SELECT profileId,profileImgUrl,profileName FROM Profiles
        RIGHT JOIN Users U on Profiles.userId = U.userId
        WHERE U.userId=${userId}
        LIMIT 3;`;

        const [profileRow] = await conn.query(retrieveUserProfilesQuery);

        console.log(retrieveUserProfilesQuery);
        console.log(profileRow);

        return profileRow;
    }

    getUserMyPageData = async (conn, profileId, year, month) => {
        const getUserMyPageDataQuery = `
        SELECT
        F.feedId,
        Profiles.profileId,
        IFNULL(LCT.likeCount,0) as likeCount,
        Profiles.userId,
        P.personaId,
        Profiles.profileImgUrl,
        Profiles.statusMessage,
        Profiles.profileName,
        P.personaName,
        F.content,
        DATE_FORMAT(F.createdAt,"%Y/%m/%d") as createdAt,
        IFNULL(GROUP_CONCAT(HTINFO.hashTagName separator '#'),null) as hashTagStr
        FROM Profiles
            INNER JOIN Persona as P ON Profiles.personaId = P.personaId
            RIGHT JOIN Feeds as F ON Profiles.profileId = F.profileId
            LEFT JOIN (
                SELECT feedId,COUNT(feedId) as likeCount FROM Likes GROUP BY profileId
            )as LCT on F.feedId=LCT.feedId
            LEFT JOIN (
                SELECT Feeds.feedId,
                HT.hashTagId,
                hashTagName
                FROM Feeds
                RIGHT JOIN FeedHashTagMapping FHTM on Feeds.feedId = FHTM.feedId
                LEFT JOIN HashTags HT on FHTM.hashTagId = HT.hashTagId
            )as HTINFO on F.feedId=HTINFO.feedId
            WHERE Profiles.profileId = ? and DATE_FORMAT(F.createdAt,"%Y-%m")="${year}-${month}"
            GROUP BY F.feedId;
        `;

        const [getUserMyPageDataResult] = await conn.query(getUserMyPageDataQuery, profileId);

        console.log(getUserMyPageDataResult);

        return getUserMyPageDataResult;
    }

}


module.exports = userDAO;
