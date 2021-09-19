window.onload=function(){
    const likeBtn=document.getElementById('likeBtn')
    const dislikeBtn=document.getElementById('dislikeBtn')

    likeBtn.addEventListener('click',function(e){
        let postId=likeBtn.dataset.post //amra like dislike button er sathe data-post akare post er id ta bole diyechilam.like korar jonno amader postId ta dorkar tai amra like button theke postId k destructure kore nilam.postId er vitore amader id ta ase jeta ase data set akare 
        reqLikeDislike('likes',postId) //jehetu amra apiRoute e likes bolesilam router.get('/likes/:postId',isAuthenticated,likesGetController)
            .then(res=>res.json()) //function ta amader promise return korbe ja amra then er maddhome handle korbo.jodi amra promise ta pathai ba req ta pathai tahole se promise er sathe pabo response.ai response k json e convert korte hobe. jodi amra convert korte pari tarpor je data ta ashbe seta niye amader kaj.ekhan theke amra return korbo res.json jetaw muloto promise return korbe ja amra then diye handle korbo jar vitore thakbe data obj
            .then(data=>{
                let likeText=data.liked?'Liked':'Like' //data.liked true hole liked hbe .likedislikeController e dekhbo liked,totalLikes,totalDislikes return koresilam
                likeText=likeText+ ` (${data.totalLikes})`
                let dislikeText=`Dislike ( ${data.totalDislikes} )`
                likeBtn.innerHTML=likeText //likeBtn.innerHTML holo amader toiri kora text
                dislikeBtn.innerHTML=dislikeText
            })
            .catch(e=>{
                console.log(e)
                alert(e.response.data.error)
            })
    })
    dislikeBtn.addEventListener('click',function(e){
        let postId=likeBtn.dataset.post  
        reqLikeDislike('dislikes',postId) 
            .then(res=>res.json()) 
            .then(data=>{
                let dislikeText=data.disliked?'Disliked':'Dislike' 
                dislikeText=dislikeText+ ` (${data.totalDislikes})`
                let likeText=`Like ( ${data.totalLikes} )`
                
                likeBtn.innerHTML=likeText 
                dislikeBtn.innerHTML=dislikeText
            })
            .catch(e=>{
                console.log(e)
                alert(e.response.data.error)
            })
    })

    function reqLikeDislike(type,postId){ //amra req korsi like ebong dislike korar jonno. kon post e like dislike korte hobe seta amader bole dite hobe(postId).type bolte like na dislike ta bujhasse
        let headers=new Headers() //ai function tar mul kaj request patahno
        headers.append('Accept','Application/JSON') //Application/JSON eta accept korbe
        headers.append('Content-Type','Application/JSON')

        let req=new Request(`/api/${type}/${postId}`,{
            method:'GET',
            headers,
            mode:'cors'
        })
        return fetch(req) //jokhn reqLikeDislike ai function ta call hobe tokhn se request pathabe, req pathanor pore je result ta ashbe sei result ta ba response ta return korbe.ai function ta use kore amra at a time like dislike duitar jonnoi req pathate parbo
    }
}





