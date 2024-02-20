const express = require('express')
const UserController = require('../controllers/UserController')

const router = express.Router()
const userController = new UserController()

router.get('/home' , userController.renderHome)
router.get('/voir_article/:id' , userController.oneArticle)
router.get('/voir_article/notif/:id' , userController.articleNotifs)
router.get('/like/:UtilisateurId/:ArticleId' , userController.likeArticle)
router.get('/dislike/:UtilisateurId/:ArticleId' , userController.dislikeArticle)
router.get('/likeComs/:UtilisateurId/:CommentaireId/:ArticleId' , userController.likeComs)
router.get('/dislikeComs/:UtilisateurId/:CommentaireId/:ArticleId' , userController.dislikeComs)
router.get('/like_list/:ArticleId' , userController.like_list)
router.get('/like_coms_list/:CommentaireId' , userController.likeComsList )
router.get('/profil_utilisateur/:UtilisateurId' , userController.viewProfil)
router.get('/profil_utilisateur/notif/:UtilisateurId' , userController.suivreNotifs)
router.get('/notif_list/:UtilisateurId' , userController.notifList )
router.get('/suivre_utilisateur/:UtilisateurId/:Utilisateur_suivi', userController.suivreUtilisateur)
router.get('/article_list/tag/:TagId' , userController.sortByTag)
router.get('/listBycategory_date' , userController.sortByDateAndCategory)

router.post('/listByCategory_date' , userController.sortByDateAndCategory)
router.post('/voir_article/:id' , userController.addComs)
router.post('/searchArticle' , userController.searchArticle)





module.exports = router