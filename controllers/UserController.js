const {Article , Categorie , Utilisateur , Like , Commentaire , Suivre , Notification , ActionUtilisateur , ArticleTag , Tag} = require('../models')
const {msg_error} = require('../msg_error/error_500')
const {Op , Sequelize} = require('sequelize')
const moment = require('moment');
const frLocale = require('../locales/fr');
moment.updateLocale('fr', frLocale);
const {io} = require('../app');
const { Error } = require('sequelize');




Utilisateur.hasMany(Commentaire)
Commentaire.belongsTo(Utilisateur)
Commentaire.hasMany(Like)
Like.belongsTo(Commentaire)
Article.hasMany(Commentaire)
Commentaire.belongsTo(Article)
Utilisateur.hasMany(Like)
Like.belongsTo(Utilisateur)
Utilisateur.hasMany(Suivre)
Suivre.belongsTo(Utilisateur)
Utilisateur.hasMany(Notification , {foreignKey : 'UtilisateurId' , as : 'utilisateur'})
Utilisateur.hasMany(Notification , {foreignKey : 'NotificateurId' , as : 'notificateur'})
Notification.belongsTo(Utilisateur , {foreignKey : 'UtilisateurId' , as : 'utilisateur'})
Notification.belongsTo(Utilisateur , {foreignKey : 'NotificateurId' , as : 'notificateur'})
Utilisateur.hasMany(ActionUtilisateur)
ActionUtilisateur.belongsTo(Utilisateur)






class UserController{

 
    async renderHome(req, res , next){

        let [user ,  notif_non_lu, dataUser] = [req.user , undefined , undefined] 

           try{

            if(user){

                notif_non_lu = await Notification.findAll({where:{UtilisateurId : user.id , isRead : false}})
                dataUser = await Utilisateur.findOne({where:{id : user.id}})
            }
            
            let data = await Article.findAll({include : [Utilisateur , Categorie , Commentaire , Like]})
            let dataCategorie = await Categorie.findAll()
            let dataTag = await Tag.findAll({order:[['popularity' , 'DESC']]})

            return res.render('home' , {data , user : req.user , dataCategorie ,  notif_non_lu, dataTag , dataUser})

           }catch(error){

            let err = new Error (msg_error())
            next(err)

       } 
       
       
       
    }





    async oneArticle(req , res , next){

        let [liked , like , UtilisateurId ,dataNotif ,notif_non_lu ] = [undefined , undefined , undefined , undefined , undefined]
      
        try{

            const user = req.user

            let dataCategorie = await Categorie.findAll()
            let dataArticleTag = await ArticleTag.findAll({include : Tag , where:{ArticleId : req.params.id}}) 
            let data = await Article.findOne({include : [ 
                
                {

                model : Commentaire,

                    include : [

                        {model: Utilisateur},
                        {model : Like}
                    ],     
            } 

            , Utilisateur , Categorie] , where:{id : req.params.id} , order:[[Commentaire , 'createdAt' , 'ASC']]})
            let allLike = await Like.findAll({where:{ArticleId : data.id}})
             
            for (const comment of data.Commentaires) {

                const commentDate = moment(comment.createdAt);
                const now = moment();
                comment.formattedDate = commentDate.from(now);

              }


            if(user){

                like = await Like.findOne({where:{ArticleId : data.id , UtilisateurId : user.id}})
                UtilisateurId = req.user.id
                dataNotif = await Notification.findAll({where:{UtilisateurId : user.id}})
                notif_non_lu = await Notification.findAll({where:{UtilisateurId : user.id , isRead : false}})
            

                for(const item of data.Commentaires){

                    for(const items of item.Likes){if(items.UtilisateurId == user.id){item.liked = true}}
                 }
            }

            like ? liked = true : liked = false
            return res.render('user/oneArticle' , {data , user , liked , allLike  , UtilisateurId , notif_non_lu , dataNotif ,dataCategorie , state : false , dataArticleTag})

        }catch(error){


            let err = new Error(msg_error())
            next(err)
        }
    }





    async likeArticle(req, res , next){

        const UtilisateurId = req.params.UtilisateurId
        const ArticleId = req.params.ArticleId
      

        try{

            let action = await ActionUtilisateur.findOne({where:{UtilisateurId , actionType : 'like' , targetId : ArticleId , createdAt : {[Op.gte] : new Date() - 24*60*60*1000}}})
            let dataArticle = await Article.findOne({where:{id : ArticleId}})


            // vérification de j'aime (user qui a aimé ) 

            if(dataArticle.UtilisateurId != UtilisateurId){

                if(!action){

              
                    let newLike = Like.build({
    
                        UtilisateurId,
                        ArticleId
                    })
    
    
                        let newAction = ActionUtilisateur.build({
    
                            UtilisateurId , 
                            actionType : 'like', 
                            targetId : ArticleId
                        })
        
                        await newAction.save()
                        await newLike.save()
                        return res.json({"message": true , "notif" : true})
    
                }else{
    
                    let newLike = Like.build({
    
                        UtilisateurId,
                        ArticleId
                    })
    
                    await newLike.save()
                    return res.json({"message": true , "notif" : false})
                }


            }else{

                let newLike = Like.build({
    
                    UtilisateurId,
                    ArticleId
                })

                await newLike.save()
                return res.json({"message": true , "notif" : false})
            }

        }catch(error){

            let err = new Error(msg_error())
            next(err)
        }
    }





    async dislikeArticle(req, res , next){

        const UtilisateurId = req.params.UtilisateurId
        const ArticleId = req.params.ArticleId

        try{

            await Like.destroy({where:{UtilisateurId , ArticleId , CommentaireId : null}})
            return res.json({"message": true})

        }catch(error){

            let err = new Error(msg_error())
            next(err)
        }
    }




    
    async addComs(req , res , next){

        const {UtilisateurId , ArticleId , contenu} = req.body
        let liked

        try{

            let newComs = Commentaire.build({

                UtilisateurId,
                ArticleId,
                contenu
            })

            await newComs.save()

            const user = req.user

            let dataCategorie = await Categorie.findAll()
            let data = await Article.findOne({include : [ 
                
                {

                model : Commentaire,

                    include : [

                        {model: Utilisateur},
                        {model : Like}
                    ],     
            } 

            , Utilisateur , Categorie] , where:{id : req.params.id} , order:[[Commentaire , 'createdAt' , 'ASC']]})
            let allLike = await Like.findAll({where:{ArticleId : data.id}})
            
             
            for (const comment of data.Commentaires) {

                const commentDate = moment(comment.createdAt);
                const now = moment();
                comment.formattedDate = commentDate.from(now);

              }

            let like = await Like.findOne({where:{ArticleId : data.id , UtilisateurId : user.id}})
            let dataNotif = await Notification.findAll({where:{UtilisateurId : user.id}})
            let notif_non_lu = await Notification.findAll({where:{UtilisateurId : user.id , isRead : false}})
            let dataArticleTag = await ArticleTag.findAll({include : Tag , where:{ArticleId : req.params.id}}) 
            for(const item of data.Commentaires){for(const items of item.Likes){if(items.UtilisateurId == user.id){item.liked = true}}}
            
            like ? liked = true : liked = false
            return res.render('user/oneArticle' , {data , user , liked , allLike , notif_non_lu , dataNotif ,dataCategorie , state : true , ArticleId , UtilisateurId , dataArticleTag})

        }catch(error){

            let err = new Error(msg_error())
            next(err)
        }
    }






    


    async searchArticle(req, res , next){

        const {searchArticle , CategorieId} = req.body

    

        if(searchArticle == ''){

            req.flash('error' , 'Veuillez entrer le titre de l\'article à rechercher')
            return res.redirect('/home')
        }

        if(CategorieId != ''){

            try{

                let dataResult = await Article.findAll({include : Categorie , where:{ titre : {[Op.like] : `%${searchArticle}%`} , CategorieId }})
                return res.render('user/searchResult' , {dataResult})    

            }catch(error){

                let err = new Error(msg_error())
                next(err)
            }
        }else{

            try{

                let dataResult = await Article.findAll({include : Categorie , where:{ titre : {[Op.like] : `%${searchArticle}%`}}})
                return res.render('user/searchResult' , {dataResult})
    
            }catch(error){
    
                let err = new Error(msg_error())
                next(err)
            }

        }
    }





    async likeComs(req, res , next){

        const UtilisateurId = req.params.UtilisateurId
        const CommentaireId = req.params.CommentaireId
        const ArticleId = req.params.ArticleId


        try{

            let action = await ActionUtilisateur.findOne({where:{UtilisateurId , actionType : 'like' , targetId : CommentaireId , createdAt : {[Op.gte] : new Date() - 24*60*60*1000}}})
            let dataComs = await Commentaire.findOne({where:{id : CommentaireId}})

            if(dataComs.UtilisateurId != UtilisateurId){

                if(!action){

                    let newComsLike = Like.build({
    
                        UtilisateurId,
                        CommentaireId,
                        commentaire_ref : ArticleId
                     
                    })
    

                    let newAction = ActionUtilisateur.build({
    
                        UtilisateurId,
                        actionType : 'like',
                        targetId : CommentaireId , 
                        target_ref : ArticleId
                    })
        
                    await newComsLike.save()
                    await newAction.save()
                    return res.json({"message" : true , "notifComs" : true , "UtilisateurId" : UtilisateurId , "CommentaireId" : CommentaireId})
    
    
                }else{
    
    
                    let newComsLike = Like.build({
    
                        UtilisateurId,
                        CommentaireId,
                        commentaire_ref : ArticleId

                     
                    })
    
                    await newComsLike.save()
                    return res.json({"message" : true  , "notifComs": false})
                }

            }else{

                let newComsLike = Like.build({
    
                    UtilisateurId,
                    CommentaireId,
                    commentaire_ref : ArticleId

                 
                })

                await newComsLike.save()
                return res.json({"message" : true  , "notifComs": false})
            }
                        

        }catch(error){

            let err = new Error(msg_error())
            next(err)
        }

    }





    async dislikeComs(req, res , next){

        const UtilisateurId = req.params.UtilisateurId
        const CommentaireId = req.params.CommentaireId
        const ArticleId = req.params.ArticleId


        try{

            await Like.destroy({where:{UtilisateurId , CommentaireId , commentaire_ref : ArticleId}})
            return res.json({'message' : true})

        }catch(error){

            let err = new Error(msg_error())
            next(err)
        }

    }





    async like_list(req , res , next){
        
        const ArticleId = req.params.ArticleId

        try{

            let data = await Like.findAll({ include : Utilisateur, where:{ArticleId}})
            return res.json({'liste' : data} )

        }catch(error){

            let err = new Error(msg_error())
            next(err)
        }
        
    }




    async likeComsList(req, res , next){

        const CommentaireId = req.params.CommentaireId
        
        try{

            let data = await Like.findAll({include : Utilisateur , where:{CommentaireId}})
            
            for(item of data){

                console.log('ok')
            }
            return res.json({'liste' : data})

        }catch(error){

            let err = new Error(msg_error())
            next(err)
        }
    }





    async viewProfil(req , res , next){

        const id = req.params.UtilisateurId
        const user = req.user

        try{

            const data = await Utilisateur.findOne({where:{id}})
            return res.render('user/profil' , {data , user})

        }catch(error){

            let err = new Error(msg_error())
        }

    }





    async notifList(req, res , next){

        const UtilisateurId = req.params.UtilisateurId
       
            try{

                let dataNotif = await Notification.findAll({include : {model : Utilisateur , as : 'notificateur'} ,where:{UtilisateurId} , order : [['createdAt' , 'DESC']]})
                return res.json({'notifList' : dataNotif})
                
            }catch(error){

                let err = new Error(msg_error())
                next(err)
            }
    }





    async articleNotifs(req, res , next){

        const targetId = req.params.id
        const user = req.user

     
       
        try{

            let data = await Notification.findOne({where:{UtilisateurId : user.id , targetId , isRead : false }})
            data.isRead = true
            await data.save()
            return res.redirect(`/voir_article/${targetId}`)
          
        }catch(error){

            let err = new Error(msg_error())
            next(err)
        }
    }





    async suivreNotifs(req, res , next){

        const targetId = req.params.UtilisateurId
        const user  = req.user

        try{

            let data = await Notification.findOne({where:{UtilisateurId : user.id , targetId}})
            if(data.isRead == false){

                data.isRead = true
                await data.save()
                return res.redirect(`/profil_utilisateur/${targetId}`)
            }


        }catch(error){

            let err = new Error(msg_error())
            next(err)
        }
    }





    async suivreUtilisateur(req , res , next){

        const UtilisateurId = req.params.UtilisateurId
        const Utilisateur_suivi = req.params.Utilisateur_suivi

     try{

        let action = await ActionUtilisateur.findOne({where:{UtilisateurId , actionType : 'suivre' , targetId : Utilisateur_suivi , createdAt : {[Op.gte] : new Date() - 24*60*60*1000}}})

        if(!action){

            let newFollower =  Suivre.build({
    
                UtilisateurId,
                Utilisateur_suivi
            })

            let newAction = ActionUtilisateur.build({

                UtilisateurId,
                actionType : 'suivre',
                targetId : Utilisateur_suivi
            })
            
             await newFollower.save()
             await newAction.save()
             return res.json({"notif" : true})

        }else{

            let newFollower =  Suivre.build({
    
                UtilisateurId,
                Utilisateur_suivi
            })

            await newFollower.save()
            return res.json({"notif" : false})
        }

       

     }catch(error){

        let err = new Error(msg_error())
        next(err)
     }

    }





    
    async sortByDateAndCategory(req, res, next){
        
        const {CategorieId , dateValue} = req.body
        let [data , user , notif_non_lu] = [undefined , req.user , undefined]
    

        if(CategorieId && dateValue){

            data = await Article.findAll({include : [Utilisateur , Categorie , Commentaire , Like] , where:{CategorieId} , order : [['createdAt' , `${dateValue}`]]})

        }else if(CategorieId){

            data = await Article.findAll({include : [Utilisateur , Categorie , Commentaire , Like] , where:{CategorieId}})

        }else if (dateValue){

             data = await Article.findAll({include : [Utilisateur , Categorie , Commentaire , Like] , order : [['createdAt' , `${dateValue}`]]})

        }else{

            req.flash('error' , 'Veuillez définir la méthode de tri que vous voulez!')
            return res.redirect('/home')

        }

        let dataCategorie = await Categorie.findAll()
        
        if(user){notif_non_lu = await Notification.findAll({where:{UtilisateurId : user.id , isRead : false}})}
        return res.render('user/sortArticle' , {data , dataCategorie , user , notif_non_lu})


    }





    async sortByTag(req , res , next){

  
        const TagId = req.params.TagId
        const user = req.user
        
        try{

            const dataArticleTag = await ArticleTag.findAll({include : [{model : Article , include : [{model : Commentaire} , {model : Like}]}] , where:{TagId}})
            return res.render('user/articleList_tag' , {dataArticleTag  , user})

        }catch(error){

            let err = new Error(msg_error())
            next(err)
        }
    }

}








module.exports = UserController