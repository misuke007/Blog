module.exports = (sequelize , datatype) =>{

    return sequelize.define('ActionUtilisateur' ,{

        UtilisateurId : {

            type : datatype.INTEGER,
            allowNull : false , 
        } , 

        actionType : {

            type : datatype.STRING , 
            allowNull : false , 

        } , 

        targetId : {

            type : datatype.STRING , 
            allowNull : false , 

        } , 

        target_ref : {

            type : datatype.STRING , 
            

        }
    })
}