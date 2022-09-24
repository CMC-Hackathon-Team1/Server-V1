class feedDAO {

    cosntructor(){}
    
    retrieveMyFeedDate = async (conn,  year,month) => {
        const retrieveMyFeedDateQuery = `SELECT date_format(createdAt,"%Y-%m-%d") as date FROM Feeds
        WHERE date_format(createdAt,"%Y-%m")="${year}-${month}";`;
        
        const [myFeedDateInfo] = await conn.query(retrieveMyFeedDateQuery);
    

        const myFeedDate=new Set();
        for(let i=0; i<myFeedDateInfo.length;i++){
            myFeedDate.add(myFeedDateInfo[i].date);
        }

        console.log(myFeedDate);

        return myFeedDate;
    }

    getFeedsByDate = async (conn,  year,month,day,profileId) => {
        const getFeedsByDateQuery = 
        `
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
             WHERE Profiles.profileId = ${profileId} and DATE_FORMAT(F.createdAt,"%Y-%m-%d")="${year}-${month}-${day}"
             GROUP BY F.feedId;
        `;

        const [feeds] = await conn.query(getFeedsByDateQuery);
    

        console.log(feeds);

        return feeds;
    }
    

    selectFeedList = async (conn, feedListQuery) => {
        const selectFeedList = `
        SELECT Feeds.updatedAt, content, Feeds.ImgUrl
        FROM Feeds
        WHERE Feeds.ProfileId = ?
        LIMIT ?, ?;
        `
        const [feedListRow] = await conn.query(selectFeedList, feedListQuery);

        return feedListRow;
    }

    
    // with Paging
    retrieveTotalDataCount = async (conn, profileId) => {
        const selectFeedList = `
        SELECT COUNT(profileId) as totalDataCount
        FROM Feeds
        WHERE profileId = ?;
        `
        const [totalDataCountRow] = await conn.query(selectFeedList, profileId);

        return totalDataCountRow;
    }

    selectFeedInfo = async (conn, feedInfoQuery) => {
        const selectFeedList = `
        SELECT personaName, profileName, updatedAt, content
        FROM Feeds
        JOIN Profiles on Profiles.profileId = Feeds.profileId
        JOIN Persona P on Profiles.personaId = P.personaId
        WHERE Profiles.profileId = ? and Feeds.feedId = ?
        `

        const [feedInfoRow] = await conn.query(selectFeedList, feedInfoQuery);

        return feedInfoRow;
     }


    insertFeedInfo = async (conn, insertFeedInfoParams) => {
        const insertFeedInfoQuery = `
            INSERT INTO Feeds (profileId, content, status, ImgUrl)
            VALUE (?, ?, ?, ?);
        `;
        const [insertFeedResult] = await conn.query(insertFeedInfoQuery, insertFeedInfoParams);

        return insertFeedResult;
    }

    selectCategoryId = async (conn, categoryName) => {
        const getCategoryIdQuery = `
            SELECT *
            FROM Categories
            WHERE categoryName = ?;
        `;
        const [getCategoryIdRow] = await conn.query(getCategoryIdQuery, categoryName);

        return getCategoryIdRow;
    }

    insertFeedCategoryMap = async (conn, insertFeedCategoryMapParams) => {
        const insertFeedCategoryMapQuery = `
            INSERT INTO FeedCategoryMapping (feedId, categoryId)
            VALUE (?, ?);
        `;
        const [insertFeedCategoryMapResult] = await conn.query(insertFeedCategoryMapQuery, insertFeedCategoryMapParams);

        return insertFeedCategoryMapResult;
    }

    selectHashtagId = async (conn, hashtagName) => {
        const selectHashtagIdQuery = `
            SELECT hashTagId
            FROM HashTags
            WHERE hashTagName = ?;
        `;
        const [selectHashtagIdRow] = await conn.query(selectHashtagIdQuery, hashtagName);

        return selectHashtagIdRow;
    }

    insertNewHashtagInfo = async (conn, hashTagName) => {
        const insertNewHashtagInfoQuery = `
            INSERT INTO HashTags (hashTagName)
            VALUE (?);
        `;
        const [insertNewHashtagInfoResult] = await conn.query(insertNewHashtagInfoQuery, hashTagName);

        return insertNewHashtagInfoResult;
    }

    insertNewHashtagProfileInfo = async (conn, insertNewHashtagProfileInfoParams) => {
        const insertNewHashtagInfoQuery = `
            INSERT INTO ProfileHashTagMapping (profileId, hashTagId)
            VALUE (?, ?);
        `;
        const [insertNewHashtagInfoResult] = await conn.query(insertNewHashtagInfoQuery, insertNewHashtagProfileInfoParams);

        return insertNewHashtagInfoResult;
    }

    insertFeedHashtagMapInfo = async (conn, insertFeedHashtagMapInfoParams) => {
        const insertFeedHashtagMapQuery = `
            INSERT INTO FeedHashTagMapping (feedId, hashTagId)
            VALUE (?, ?)
        `;
        const [insertFeedHashtagMapResult] = await conn.query(insertFeedHashtagMapQuery, insertFeedHashtagMapInfoParams);

        return insertFeedHashtagMapResult;
    }

    deleteFeedById = async (conn, feedId) => {
        const deleteFeedByIdQuery = `
            DELETE FROM Feeds
            WHERE feedId = ?
        `;
        const [deleteFeedByIdResult] = await conn.query(deleteFeedByIdQuery, feedId);

        return deleteFeedByIdResult;
    }

    deleteFeedCategoryMapInfo = async (conn, feedId) => {
        const deleteFeedCategoryMapQuery = `
            DELETE FROM FeedCategoryMapping
            WHERE feedId = ?
        `;
        const [deleteFeedCategoryMapResult] = await conn.query(deleteFeedCategoryMapQuery, feedId);

        return deleteFeedCategoryMapResult;
    }

    deleteFeedHashtagMapInfo = async (conn, feedId) => {
        const deleteFeedHashtagMapQuery = `
            DELETE FROM FeedHashTagMapping
            WHERE feedId = ?
        `;
        const [deleteFeedHashtagMapResult] = await conn.query(deleteFeedHashtagMapQuery, feedId);

        return deleteFeedHashtagMapResult;
    }

    insertFeedLike = async (conn, feedId, profileId) => {
        const insertQuery = `
            INSERT INTO Likes(feedId, profileId)
            VALUE(?, ?)
        `;
        const [insertResult] = await conn.query(insertQuery, [feedId, profileId]);

        return insertResult;
    }

    deleteFeedLike = async (conn, feedId, profileId) => {
        const deleteQuery = `
            DELETE FROM Likes
            WHERE feedId = ? and profileId = ?
        `;
        const [deleteResult] = await conn.query(deleteQuery, [feedId, profileId]);

        return deleteResult;
    }
}


module.exports = feedDAO;
