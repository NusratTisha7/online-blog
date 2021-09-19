const multer=require('multer')
const path=require('path') //path module ta import kore nilam

const storage=multer.diskStorage({ //storage er kaj holo kothay amader upload kora file ta store hobe seta handle kora.
    
    //destination holo kothay upload hobe. ar filename holo upload hoar pore file er name ki hobe
    destination: (req,file,cb)=>{ //cb holo callback
        cb(null,'public/uploads') //cb er prothom argument hisebe error provide korte hobe.ekhane kono error nai tai null.
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'-'+Date.now()+'-'+file.originalname) //fieldname holo amra play.ejs er moddhe ekta fieldname niyechilam(my-file)
    }
})


//amader storage setup complete ekhn amra middleware create korbo.
const upload=multer({ //middleware ta upload er vitore thakbe.multer ekti function jake call korle ekta middleware return korbe ar argument akare amra javascript obj pathabo(storage,limit.....)
    storage,
    limits:{ //maximum koto size approve korbo ta bole dite hobe
        fileSize:1024*1024*5 //5 mega bytes
    },
    fileFilter:(req,file,cb)=>{ //filefilter er moddhe bole dibo ki type er file upload korbo.multiple file upload korte chaile different different middleware toiri kore nibo.
        const types=/jpeg|jpg|png|gif/
        const extName=types.test(path.extname(file.originalname).toLowerCase()) //filename theke extension k alada kore nibo,types.test types er sathe miliye dekhlo sob thik thak ase kina
        const mimeType=types.test(file.mimetype) //prottekta file eri mimeType ase.ja diye bujha jay file tar type ta asole ki
        //mimeType and extName true or false return korbe.jodi file type /jpeg|jpg|png|gif/ hoy taholei true return korbe abong file ta upload korbe
        
        if(extName && mimeType){
            cb(null,true)
        }else{
            cb(new error('Only Support Images'))
        }
    }
})
//ai middleware ta use kore amra file upload korte pari

module.exports=upload