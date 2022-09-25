exports.insertConfirmationImages = async function(connection, confirmationId, fileLocation){
    console.log('gooood')
    const insertConfirmationImagesQuery = `
        insert into Feeds(feedId, ImgUrl)
        value( ?, ?)
    `

    const insertQueryResult = await connection.query(insertConfirmationImagesQuery, [confirmationId, fileLocation]);

    return insertQueryResult[0];
}