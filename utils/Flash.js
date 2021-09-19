class Flash{
    constructor(req){
        this.req=req
        //store korar system:ekbar success message er jonno extract korbo arekbar fail message er jonno extract korbo
        this.success=this.extractFlashMessage('success')
        this.fail=this.extractFlashMessage('fail')
        
    }

    extractFlashMessage(name){ 
        let message=this.req.flash(name) 
        return message.length>0?message[0]:false 
    }
    hasMessage(){
        return !this.success && !this.fail ?false:true
    }
    static getMessage(req){  
        let flash=new Flash(req)
        return{ //ekhan theke ja return korbo seta hosse ekta obj.
            success:flash.success,
            fail:flash.fail,
            hasMessage: flash.hasMessage() //asolei kono message ase kina ta dekhar jonno hashMessage.Jodi kono message theke thake tahole se true return korbe otherwise false hobe
        }
        
    }
}

module.exports=Flash