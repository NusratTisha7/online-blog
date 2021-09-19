const router = require('express').Router()
const upload=require('../middleware/uploadMiddleware')

router.get('/play', (req, res, next) => {
    res.render('playground/play', { title: 'Playground', flashMessage: {} })
})


router.post('/play',upload.single('my-file'),(req, res, next) => { //upload.single niyechi karon amra single file upload korte chassi.multiple hole array use kortam.upload.single('my-file') ai middleware ta amader file k upload korbe ebong file er information request er sathe embed kore dibe.
    if(req.file){
        console.log(req.file)
    }
    res.redirect('/playground/play')
})

module.exports = router