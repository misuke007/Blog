module.exports = (sequelize , datatype) => {

    return sequelize.define('ArticleTag' , {

       
        ArticleId: {

          type: datatype.INTEGER
        } , 

        TagId: {

            type : datatype.INTEGER

         }
    })
}