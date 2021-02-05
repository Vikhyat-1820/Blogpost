require('dotenv').config()
const express=require('express')
const edge=require('edge.js')
const path=require('path')
const {config,engine }=require('express-edge')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const Post=require('./database/models/Post.js')
const fileUpload=require('express-fileupload')
const expressSession=require('express-session')
const connectMongo=require('connect-mongo')
const connectFlash=require('connect-flash')



const createPostController=require('./controller/createPost.js')
const homePageController=require('./controller/homePage.js')
const storePostController=require('./controller/storePost.js')
const getPostController=require('./controller/getPost.js')
const validateCreatePostMiddleware=require('./middleware/storePost')
const createUserController=require('./controller/createUser.js')
const storeUserController=require('./controller/storeUser.js')
const loginController=require('./controller/login.js')
const loginUserController=require('./controller/loginUser')
const auth=require('./middleware/auth')
const logoutController=require('./controller/logout')
const redirectIfAuthenticated=require('./middleware/redirectIfAuthenticated')

// const Post=require('./database/models/Post.js')

mongoose.connect(process.env.DB_URI,{
    useNewUrlParser:true,
    useCreateIndex:true
})




const app=new express()

const mongoStore=connectMongo(expressSession)

app.use(connectFlash())
app.use(expressSession({
    secret:process.env.EXPRESS_SESSION_KEY,
    store: new mongoStore({
        mongooseConnection:mongoose.connection
    })
}))

app.use(express.static('public'))

app.use(engine)

app.set('views',`${__dirname}/views`)

app.use('*',(req,res,next) => {
    edge.global('auth',req.session.userId)
    next()
})

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload()) 




// app.use('/posts/store',validateCreatePostMiddleware)


app.get('/',homePageController)
app.get('/posts/new',auth,createPostController)
app.get('/post/:id',getPostController)
app.post('/posts/store',auth,validateCreatePostMiddleware,storePostController)
app.get('/auth/register',redirectIfAuthenticated,createUserController)
app.get('/auth/login',redirectIfAuthenticated,loginController)
app.post('/users/login',redirectIfAuthenticated,loginUserController)
app.post('/users/register',redirectIfAuthenticated,storeUserController)
app.get('/auth/logout',auth,logoutController)

app.use((req,res) => res.render('not-found'))

app.listen(3000, () => {
    console.log("App Started")
})