module.exports = (sequelize , datatype) => {

    return sequelize.define('Utilisateur' , {

        id:{
            primaryKey:true,
            autoIncrement:true,
            type:datatype.INTEGER
        },

        nom:{
            
            type : datatype.STRING,
            allowNull:false,
        },

        prenom:{
            
            type : datatype.STRING,
            allowNull:false,
        },

        email:{
            
            type : datatype.STRING,
            allowNull:false,
        },

        photo:{
            
            type : datatype.STRING,
            allowNull:false,
        },

        password:{
            
            type : datatype.STRING,
            allowNull:false,
        },

        resetToken:{
            
            type : datatype.STRING,
        },
    })
}