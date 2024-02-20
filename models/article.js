
const { v4: uuidv4 } = require('uuid')

module.exports = (sequelize , datatype) => {

    return sequelize.define('Article' , {
        
        id:{

            type:datatype.STRING,
            primaryKey:true,
            defaultValue : () => uuidv4()
        },

        titre:{
            
            type : datatype.STRING,
            allowNull:false,
        },

        contenu:{
            
            type : datatype.STRING,
            allowNull:false,
        },

        image:{
            
            type : datatype.STRING,
            allowNull:false,
        },

        
        CategorieId:{
            
            type : datatype.INTEGER,
        },

        UtilisateurId:{
            
            type : datatype.INTEGER,
        },
    })
}