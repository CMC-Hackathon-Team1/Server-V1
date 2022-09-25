exports.insertConfirmationImages = async function(connection, confirmationId, fileLocation){
    console.log('gooood')
    const insertConfirmationImagesQuery = `
        insert into ConfirmationImg(Id, imgUrl)
        value(${confirmationId},'${fileLocation}')
    `

    const insertQueryResult = await connection.query(insertConfirmationImagesQuery, confirmationId, fileLocation);

    return insertQueryResult[0];
}