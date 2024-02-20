module.exports = (sequelize , datatype) => {

    return sequelize.define('Commentaire' , {

        id:{
            
            primaryKey:true,
            autoIncrement:true,
            type:datatype.INTEGER
        },

        UtilisateurId:{
            
            type : datatype.INTEGER,
        
        },


        ArticleId:{
            
            type : datatype.STRING,
        },


        contenu:{
            
            type : datatype.STRING,
            allowNull:false,
        },
    })
}