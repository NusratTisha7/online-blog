const express=require('express')
const morgan=require('morgan')
const session=require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const flash=require('connect-flash') 
const config = require('config');

const {bindUserWithRequest}=require('./authMiddleware')
const setLocals=require('./setLocal')


const MONGODB_URI=`mongodb+srv://${config.get('db-username')}:${config.get('db-password')}@cluster0.ph6nu.mongodb.net/exp-blog`

const store = new MongoDBStore({
    uri:  MONGODB_URI,
    collection: 'sessions',
    expires:60*60*1000*2 
  });

const middleware=[ 
    morgan('dev'),
    express.static('public'), 
    express.urlencoded({extended:true}), 
    express.json(),
    session({ 
      secret:config.get('secret'),
      resave:false,
      saveUninitialized:false,
      store:store
    }),
    flash(), //amra amader middleware k niche rakhbo 3rd party middleware k upore rakhbo.jehetu middleware upor theke aste aste execute hoy.
    bindUserWithRequest(),
    setLocals()
]

module.exports=app=>{
    middleware.forEach(m=>{
        app.use(m)
    })
}