const validateCreatePostMiddleware =(req,res,next) => {
    if(!req.files || !req.body.title || !req.body.subtitle || !req.body.content){
        return res.redirect('/posts/new')
    }
    next()
}

module.exports=validateCreatePostMiddleware