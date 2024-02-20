const express = require('express')
const ArticleController = require('../controllers/ArticleController')

const router = express.Router()
const articleController = new ArticleController()

router.get('/addArticle' , articleController.renderFormArticle)
router.get('/update_article/:id' , articleController.renderFormUpdate)
router.get('/home' , articleController.renderHome)
router.get('/article_list' , articleController.myArticle)
router.get('/show_article/:id' , articleController.oneArticle)
router.get('/delete_article/:id' , articleController.deleteArticle)

router.post('/article_list' , articleController.searchArticle)
router.post('/addArticle' , articleController.create)
router.post('/update_article/:id' , articleController.updateArticle)


module.exports = router