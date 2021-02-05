const Post=require('../database/models/Post')
const path=require('path')


module.exports=(req,res) => {
    const { image } =req.files
    image.mv(path.resolve(__dirname,'..','public/posts',image.name),(error) => {
        // console.log(req.body)
        // console.log(image)
        // console.log(error)
        if(error){
            console.log(error)
        }
        Post.create({
            ...req.body,
            author:req.session.userId,
            image:`/posts/${image.name}`
        },(error,post) => {
            res.redirect('/')
        })
    })
}