module.exports = (sequelize , datatype) => {

    return sequelize.define('Tag' , {

        id:{
            primaryKey:true,
            autoIncrement:true,
            type:datatype.INTEGER
        },
        
        name : {

           type : datatype.STRING,

        } , 

        popularity: {

            type : datatype.INTEGER,
            defaultValue : 0,
 
         }
    })
}