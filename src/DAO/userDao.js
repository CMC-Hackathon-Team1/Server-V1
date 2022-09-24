class userDAO {

    cosntructor(){}

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

    retrieveUserFeedCount = async (conn,profileId) => {
        const retrieveUserFeedCountQuery = 
        `SELECT COUNT(feedId) as feedCount FROM Feeds
        LEFT JOIN Profiles P on Feeds.profileId = P.profileId
        where P.profileId=${profileId}
        AND DATE_FORMAT(Feeds.createdAt,"%y-%m")=DATE_FORMAT(NOW(),"%y-%m");`;

        const [feedCount] = await conn.query(retrieveUserFeedCountQuery);

        console.log(feedCount);
        

        return feedCount[0];
    }

    retrieveUserLikeCount = async (conn,profileId) => {
        const retrieveUserLikeCountQuery = 
        `SELECT COUNT(Feeds.feedId) as likeCount FROM Feeds
        LEFT JOIN Profiles P on Feeds.profileId = P.profileId
        RIGHT JOIN Likes L on Feeds.feedId = L.feedId
        where P.profileId=${profileId}
        AND DATE_FORMAT(L.createdAt,"%y-%m")=DATE_FORMAT(NOW(),"%y-%m");`;

        const [likeCount] = await conn.query(retrieveUserLikeCountQuery);

        console.log(likeCount);
        

        return likeCount[0];
    }

    retrieveUserFollowCount = async (conn,profileId) => {
        const retrieveUserFollowCountQuery = 
        `SELECT COUNT(toUserId) as followCount FROM FollowFromTo
        WHERE toUserId=${profileId} and DATE_FORMAT(createdAt,"%y-%m")=DATE_FORMAT(NOW(),"%y-%m")`;

        const [followCount] = await conn.query(retrieveUserFollowCountQuery);

        console.log(followCount);
        

        return followCount[0];
    }
}


module.exports = userDAO;
