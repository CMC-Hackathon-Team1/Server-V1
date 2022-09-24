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
}


module.exports = feedDAO;
