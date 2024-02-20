module.exports = (sequelize , datatype) => {

    return sequelize.define('Notification' , {

        id:{
            primaryKey:true,
            autoIncrement:true,
            type:datatype.INTEGER
        },


         message:{
            
            type : datatype.STRING,
        
        },
        

        isRead : {

            type: datatype.BOOLEAN,
            defaultValue: false,
        } , 


        actionType : {

            type : datatype.STRING , 
            allowNull : false , 

        } , 

        targetId : {

            type : datatype.STRING , 
            allowNull : false , 

        }
    })
}