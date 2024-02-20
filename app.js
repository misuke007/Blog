const express = require('express')
const layout = require('express-ejs-layouts')
const fileupload = require('express-fileupload')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')
const database = require('./models')
const {Utilisateur , Notification, Suivre , Article , Commentaire } = require('./models')


require('./config/passport')(passport)

const app = express()
const http = require('http')
const {Server} = require('socket.io')
const server = http.createServer(app)
const io = new Server(server)



const ArticleRoute = require('./routes/ArticleRoute')
const UserRoute = require('./routes/UserRoute')
const SecurityRoute = require('./routes/SecurityRoute')





app.use(layout)
app.set('view engine' , 'ejs')
app.use(flash())
app.use(fileupload())
app.use(express.static(__dirname+'/public'))
app.use(express.urlencoded({extended:false}))

app.use(session({

    resave:true,
    secret:'BLOG007',
    saveUninitialized:true
}))



app.use((req,res,next)=>{

    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()

})

app.use(passport.initialize())
app.use(passport.session())


app.use('/user' , ArticleRoute)
app.use('/' , UserRoute)
app.use('/' , SecurityRoute)


// app.use((req, res , next) => {

//     if(req.dataArticle){

//         const dataArticle = req.dataArticle
//         let message = 'ok'

//         io.emit('notifPub' , message)
    
    

//     }else{next()}
    
//   })



app.use((req, res, next) => {

    const error = new Error('Page non trouvée');
    error.status = 404;
    next(error);

  })



  
  app.use((err, req, res, next) => {

    const statusCode = err.status || 500
    res.status(statusCode);
    res.render('error', { error: err.message, status: statusCode })
    
  })


  


  io.on('connection' , (socket) => {

    console.log('un utilisateur connecté!')
    socket.on('room' , (room) => {socket.join(room)
    
    })
     




    socket.on('suivre' , async(UtilisateurId , Utilisateur_suivi) => {
            

            let data = await Utilisateur.findOne({where:{id:UtilisateurId}})
            let prenom = data.prenom.split(' ')
            let newNotif = Notification.build({

                UtilisateurId : Utilisateur_suivi,
                NotificateurId :UtilisateurId,
                actionType : 'suivre', 
                targetId : UtilisateurId, 
                message : `Vous êtes suivi par ${data.nom} ${prenom[0]}`

            })

            let dataNotif =  await newNotif.save()
            socket.to(Utilisateur_suivi).emit('notif' , dataNotif)

    })



    socket.on('roomPub' , async(id) => {

        const dataFollower = await Suivre.findAll({where:{Utilisateur_suivi : id}})

        for(item of dataFollower){

            let UtilisateurId = item.UtilisateurId.toString()
            socket.to(UtilisateurId).emit('notifPub')
        }
    })





    socket.on('like_notif' , async(UtilisateurId , ArticleId) => {


        let data = await Article.findOne({where:{id : ArticleId}})
        let userData = await Utilisateur.findOne({where:{id : UtilisateurId}})
        let prenom = userData.prenom.split(' ')
        
        let newNotif = Notification.build({

            UtilisateurId : data.UtilisateurId,
            NotificateurId :UtilisateurId,
            actionType : 'like', 
            targetId : ArticleId, 
            message : `${userData.nom} ${prenom[0]} à aimé votre article : "${data.titre}"`
        })

        await newNotif.save()
        const id = data.UtilisateurId.toString()
        socket.to(id).emit('notifLike')

    })




    socket.on('notifComs' , async(UtilisateurId , CommentaireId) => {

        let dataComs = await Commentaire.findOne({where:{id : CommentaireId}})
        let dataUser = await Utilisateur.findOne({where:{id : UtilisateurId}})
        let prenom = dataUser.prenom.split(' ')
        let newNotif = Notification.build({
            
            UtilisateurId : dataComs.UtilisateurId,
            NotificateurId :UtilisateurId,
            actionType : 'like', 
            targetId :dataComs.ArticleId, 
            message : `${dataUser.nom} ${prenom[0]} a aimé votre commentaire "${dataComs.contenu}"`
        })

        await newNotif.save()
        socket.to(dataComs.UtilisateurId.toString()).emit('comsNotif')

    })





    socket.on('comsData' , async(UtilisateurId , ArticleId) => {

        const dataArticle = await Article.findOne({where:{id : ArticleId}})
        const userData = await Utilisateur.findOne({where:{id : UtilisateurId}})
        let prenom = userData.prenom.split(' ')
        
        if(dataArticle.UtilisateurId != UtilisateurId){

            let newNotif = Notification.build({

                UtilisateurId : dataArticle.UtilisateurId , 
                NotificateurId :UtilisateurId,
                actionType : 'like', 
                targetId : ArticleId, 
                message : `${userData.nom} ${prenom[0]} a commenté votre Article : ${dataArticle.titre}`
            })

            await newNotif.save()
            socket.to(dataArticle.UtilisateurId.toString()).emit('notifComs')
        }
        

    })
    
})












database.sequelize.sync()
    .then(() => {

        server.listen(3000 , () => {

            console.log(`Server started on  http://localhost:3000/home`);
        })
    })

    .catch(error => console.log(error))


    module.exports  = {io}