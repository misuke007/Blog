const {Article , Categorie , Utilisateur , Like , Commentaire , Suivre , Notification , ActionUtilisateur , ArticleTag , Tag} = require('../models')
const sharp = require('sharp');
const {msg_error} = require('../msg_error/error_500')
const {fileName} = require('../librairies/fileName')
const {moveFile} = require('../librairies/moveFile')
const {Op} = require('sequelize')
const fs = require('fs')


Categorie.hasOne(Article)
Article.belongsTo(Categorie)
Utilisateur.hasMany(Article)
Article.belongsTo(Utilisateur)
Article.hasMany(Like)
Like.belongsTo(Article)
Article.hasMany(Commentaire)
Commentaire.belongsTo(Article)
Article.belongsToMany(Tag, { through: ArticleTag })
Tag.belongsToMany(Article, { through: ArticleTag })
Tag.hasMany(ArticleTag)
ArticleTag.belongsTo(Tag)
Article.hasMany(ArticleTag)
ArticleTag.belongsTo(Article)




class ArticleController{


    async renderHome(req, res){

        return res.render('admin/home')
    }

   async renderFormArticle (req, res , next) {



        try{

            let data = await Categorie.findAll({order: [['nom', 'ASC']]})
            return res.render('admin/formArticle' , {data})

        }catch(error){

            let err  = new Error(msg_error())
            next(err)
        }

    }




    
    async renderFormUpdate(req, res , next){

        let tagsList = ""
        try{


            let ArticleData = await Article.findOne({where:{id : req.params.id}})
            let tagsData = await ArticleTag.findAll({include : Tag , where:{ArticleId : ArticleData.id}})
            let data = await Categorie.findAll({order: [['nom', 'ASC']]})

            tagsData.map((item , index) => {

                index < tagsData.length - 1 ? tagsList = tagsList + item.Tag.name + " , "  :  tagsList = tagsList + item.Tag.name
            })


            return res.render('admin/formArticleUpdate' , {ArticleData , data , tagsList})

        }catch(error){

            let err = new Error(msg_error)
            next(err)
        }
    }



    

    async create (req , res , next) {
              


        const{titre , contenu , CategorieId , tags} = req.body
        let [photo , user , newNotif , tagList , tagId] = [req.files , req.user , undefined , undefined , []]
        

        if(titre == '' || contenu == '' || CategorieId == ''){

            req.flash('error' , 'Veuillez remplir tous les champs')
            return res.redirect('/user/addArticle')

        }else if(photo == null){

            req.flash('error' , 'Veuillez fournir une photo pour votre article!')
            return res.redirect('/user/addArticle')

        }else{

          
            try{     
            
            let newFileName= fileName(photo)
             moveFile(photo , newFileName)
            let newArticle = Article.build({

                titre , 
                contenu , 
                image: newFileName, 
                CategorieId,
                UtilisateurId : req.user.id 
            })

            let prevArticle = await newArticle.save()

            if(tags){ 
            
                tagList = tags.split(',')
                
                for(item of tagList){

                    let tag = await Tag.findOne({where:{name : item.trim().toLowerCase()}})
                    !tag ? tag = await Tag.create({name :item.trim().toLowerCase()}) : tag.increment('popularity')
                    tagId.push(tag.id)
                }
    
                for(item of tagId) ArticleTag.create({ArticleId : prevArticle.id , TagId : item })
            }

           req.flash('success' , 'Article  publié!')
           let data = await Article.findAll({include:Categorie , where:{UtilisateurId: user.id} , order: [['titre', 'ASC']]})
           let userData = await Utilisateur.findOne({where:{id : user.id}})
           let dataCategory = await Categorie.findAll({order: [['nom', 'ASC']]})
           let dataFollower = await Suivre.findAll({where:{Utilisateur_suivi : user.id}})
           
           for(const item of dataFollower){

                let newNotification = Notification.build({

                    UtilisateurId : item.UtilisateurId,
                    message : `${userData.nom} ${userData.prenom} a publié un nouveau article. Titre : ${prevArticle.titre}`

                })

                // mbola tsy azo ary @ interface le msg avy anay anaty bdd lo eto 
                newNotif =  newNotification.save()
           }

           return res.render('admin/articleList' , {data , dataCategory ,  newPost: true , user})

            }catch(error){

                let err = new Error(msg_error())
                next(err)
            }
            
        }

    }




    async myArticle(req, res , next){

        const user = req.user

        try{

            let data = await Article.findAll({include:Categorie , where:{UtilisateurId: user.id} , order: [['titre', 'ASC']]})
            let dataCategory = await Categorie.findAll({order: [['nom', 'ASC']]})
            return res.render('admin/articleList' , {data , dataCategory ,  newPost: false , user})

        }catch(error){

            let err = new Error(msg_error())
            next(err)
        }
    }
    
    



    async oneArticle(req , res , next) {

        try{

            let data = await Article.findOne({where:{id : req.params.id}}) 
            return res.render('admin/OneArticle' , {data})

        }catch(error){

            let err = new Error(msg_error())
            next(err)
        }
    }





    async deleteArticle(req, res , next){

        try{

            let dataArticle = await Article.findOne({where:{id : req.params.id}})
            fs.unlink(`./public/photo/${dataArticle.image}` , function(error){
                if(error){
    
                  console.log(error);
    
                }})

            await Article.destroy({where:{id : req.params.id}})
            await Like.destroy({where:{[Op.or] : [{ArticleId : req.params.id} , {commentaire_ref : req.params.id }]}})
            await Commentaire.destroy({where:{ArticleId : req.params.id}})
            await ActionUtilisateur.destroy({where:{[Op.or] : [{targetId : req.params.id} , {target_ref : req.params.id }]}})
            req.flash('success' , 'Article supprimé!')
            return res.redirect('/user/article_list')

        }catch(error){

            let err = new Error(msg_error())
            next(err)
        }
    }





    async searchArticle(req, res , next){

        const {searchArticle , CategorieId} = req.body

        if(searchArticle == ''){

            req.flash('error' , 'Veuillez entrer le titre de l\'article à rechercher')
            return res.redirect('/user/article_list')
        }

        if(CategorieId != ''){

            try{

                let dataResult = await Article.findAll({include : Categorie , where:{ titre : {[Op.like] : `%${searchArticle}%`} , CategorieId }})
                return res.render('admin/searchResult' , {dataResult})    

            }catch(error){

                let err = new Error(msg_error())
                next(err)
            }
        }else{

            try{

                let dataResult = await Article.findAll({include : Categorie , where:{ titre : {[Op.like] : `%${searchArticle}%`}}})
                return res.render('admin/searchResult' , {dataResult})
    
            }catch(error){
    
                let err = new Error(msg_error())
                next(err)
            }

        }
    }





    async updateArticle(req, res , next){

        const {CategorieId , titre  , contenu , id , tags} = req.body
        let tagList
        let tagId = []
        let photo = req.files     

        if(photo != null){
           
            try{

                let data = await Article.findOne({where:{id}})

                if(tags){

                    tagList = tags.split(',')
                    await ArticleTag.destroy({where:{ArticleId : data.id}})

                    for(item of tagList){

                        let tag = await Tag.findOne({where:{name : item.trim().toLowerCase()}})
                        if(!tag) tag = await Tag.create({name :item.trim().toLowerCase()})
                        tagId.push(tag.id)
                    }

                    for(item of tagId) ArticleTag.create({ArticleId : data.id , TagId : item})

                }else{

                    await ArticleTag.destroy({where:{ArticleId : data.id}})

                }


                fs.unlink(`./public/photo/${data.image}` , function(error){
                    if(error){
        
                      console.log(error);
        
                    }})


                let newFileName = fileName(photo)
                moveFile(photo , newFileName)    
                data.CategorieId = CategorieId
                data.titre = titre
                data.contenu = contenu
                data.image = newFileName

                await data.save()
                req.flash('success' , 'Article modifié!')
                return res.redirect('/user/article_list')           

               
            }catch(error){
                
                let err = new Error(msg_error())
                next(err)
            }

        }else{


            try{


                let data = await Article.findOne({where:{id}})

                if(tags){

                    tagList = tags.split(' , ')
                    await ArticleTag.destroy({where:{ArticleId : data.id}})

                    for(item of tagList){

                        let tag = await Tag.findOne({where:{name : item.trim().toLowerCase()}})
                        if(!tag) tag = await Tag.create({name :item.trim().toLowerCase()})
                        tagId.push(tag.id)
                    }

                    for(item of tagId) ArticleTag.create({ArticleId : data.id , TagId : item})

                }else{

                    await ArticleTag.destroy({where:{ArticleId : data.id}})
                }

                data.CategorieId = CategorieId
                data.titre = titre
                data.contenu = contenu
                await data.save()
                req.flash('success' , 'Article modifié!')
                return res.redirect('/user/article_list')

            }catch(error){


                let err = new Error(msg_error())
                next(err)
            }
            
        }
    }
}



module.exports = ArticleController