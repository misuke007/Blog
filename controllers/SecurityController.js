const {Utilisateur} = require('../models')
const {moveFile} = require('../librairies/moveFile')
const bcrypt = require('bcryptjs')
const { fileName } = require('../librairies/fileName')
const {msg_error} = require('../msg_error/error_500')
const passport = require('passport')



class SecurityController{

    
    async renderRegister(req, res){

        return res.render('user/register')
    }


    
    
    async renderLogin(req, res){

        return res.render('user/login')
    }





    async createUser(req, res , next){

        const {nom , prenom , email , password , confirmPass} = req.body
        let photo = req.files
        let userMail

        try{

             userMail = await Utilisateur.findOne({where:{email}})

        }catch(error){

            let err = new Error(msg_error)
            next(err)
        }


        if(nom == "" || prenom == "" || password == "" || confirmPass == ""){

            req.flash('error' , 'Veuillez remplir tous les champs')
            return res.redirect('/user/register')

        }else if(photo == null){

            req.flash('error' , 'Veuillez fournir une photo pour votre article')
            return res.redirect('/user/register')

        }else if(userMail){

            req.flash('error' , 'Adresse email déjà utilisé')
            return res.redirect('/user/register')

        }else if(password !== confirmPass){

            req.flash('error' , 'Vérifier la confirmation de votre mot de passe ')
            return res.redirect('/user/register')

        }else{

            try{

                let newFileName = fileName(photo)
                moveFile(photo , newFileName)
                let passwordHashed =bcrypt.hashSync(password , 12 )
                let newUser = Utilisateur.build({

                    nom,
                    prenom,
                    email,
                    password: passwordHashed , 
                    photo: newFileName
                    
                })
                
                await newUser.save()
                req.flash('success' , 'Vous pouvez maintenant vous connecter')
                return res.redirect('/user/login')

            }catch(error){

                let err = new Error(msg_error)
                next(err)
            }
        }

    }





    async userLogin(req , res , next){

        const{email , password} = req.body

        if(email == '' || password == ''){
            
            req.flash('error' , 'Veuillez entrer votre email et mot de passe!')
            return res.redirect('/user/login')
        }

        passport.authenticate('local' , {

            successRedirect:'/home',
            failureRedirect:'/user/login',
            failureFlash:true

        })(req, res , next)
    }
}




module.exports = SecurityController