const router=require('express').Router()
const {isAuthenticated}=require('../../middleware/authMiddleware')
const {
    commentPostController,
    replyCommentPostController
}=require('../controllers/commentController')

const{
    likesGetController,
    dislikesGetController
}=require('../controllers/likeDislikeController')

const{
    bookmarksGetController
}=require('../controllers/bookmarkController')

router.post('/comments/:postId',isAuthenticated,commentPostController) //kon post er under e mara comment toiri korbo sei postId ta diyechi
router.post('/comments/replies/:commentId',isAuthenticated,replyCommentPostController) //comment er underei reply thakbe tai amra commentId niyechi

router.get('/likes/:postId',isAuthenticated,likesGetController)
router.get('/dislikes/:postId',isAuthenticated,dislikesGetController)

router.get('/bookmarks/:postId',isAuthenticated,bookmarksGetController)
module.exports=router