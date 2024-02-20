module.exports = (sequelize , datatype) => {

    return sequelize.define('Suivre' , {

        id:{
            primaryKey:true,
            autoIncrement:true,
            type:datatype.INTEGER
        },
        

        UtilisateurId:{
            
            type : datatype.INTEGER,
        
        },



        Utilisateur_suivi:{
            
            type : datatype.INTEGER,
        
        },
    })
}