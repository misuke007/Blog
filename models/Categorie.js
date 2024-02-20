module.exports = (sequelize , datatype) => {

    return sequelize.define('Categorie' , {

        id:{

            primaryKey:true,
            autoIncrement:true,
            type:datatype.INTEGER
        },

        nom:{
            
            type : datatype.STRING,
        
        },

    })
}