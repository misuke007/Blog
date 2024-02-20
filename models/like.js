module.exports = (sequelize , datatype) => {

    return sequelize.define('Like' , {

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


        CommentaireId:{
            
            type : datatype.INTEGER,
       
        },

        commentaire_ref: {
            
            type : datatype.STRING,

        }
    })
}