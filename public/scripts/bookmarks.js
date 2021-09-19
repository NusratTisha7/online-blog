window.onload = function () {
    const bookmarks = document.getElementsByClassName('bookmark'); //bookmark er list ta niyechi
    [...bookmarks].forEach(bookmark => { //bookmarks html collection k [...bookmarks] evabe array te convert korte pari.prottekta individual bookmarks niye amader kaj korte hbe tai forEach loop chalalam
        bookmark.style.cursor = 'pointer' //ekhn bookmark icon tar kase gele cursor pointer dekhassse
        bookmark.addEventListener('click', function (e) { //prottekta bookmark er sathe addEventListeber add korte hobe
            let target = e.target.parentElement //prothome target take dhore nibo. amra click korbo i er upor(<i class="fas fa-bookmark"></i>) but target ta korbo span k(explore.ejs er bookmarks e) tai e.target.parentElement niyechi
            let headers = new Headers()
            headers.append('Accept', 'Application/JSON') //amra je Rest API niye kaj korchi ta ekhane bole dilam

            let req = new Request(`/api/bookmarks/${target.dataset.post}`, { //id ta amra explorer.ejs e prottekta element er sathe data-post hisebe provide kore dissilam. target.dataset.post er sahajje data ta ber kore niye ashlam
                method: 'GET',
                headers,
                mode: 'cors'
            })

            fetch(req) //fetch niye kaj korte hobe ekhane req obj ta fetch er moddhe provide kore dilam.eta amader response back korbe, response take amader json akare back korte hobe.eta muloto ekta promise return korbe sei promise take abar solve korar jonno then niye kaj korte hobe
                .then(res => res.json())
                .then(data => {
                    if (data.bookmark) { //amra bookmark korar somoy bolesilam bookmark namer ekta obj provide hobe jar value hobe true or false 
                        target.innerHTML = '<i class="fas fa-bookmark"></i>' //jodi true hoy tahole innerHTML k change kore dibo
                    } else {
                        target.innerHTML = '<i class="far fa-bookmark"></i>'
                    }
                }).catch(e => {
                    console.error(e.response.data) //axios er theke je error message ta ashe. sei error message ta destructure korar system hosse e.response.data
                    alert(e.response.data.error) //bookmarksController e jodi catch hoy tahole amra error name ekta obj provide koresilam. sei error ta amader dorkar.setake destructure kore ekhane show korlam
                })
        })
    })
}