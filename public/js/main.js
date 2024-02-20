
let like = document.querySelector('.like')
let dislike = document.querySelector('.dislike')
let like_coms = document.querySelectorAll('.like_coms')
let dislike_coms = document.querySelectorAll('.dislike_coms')
let increment_like = document.querySelector('.increment_like')
let decrement_like = document.querySelector('.decrement_like')
let increment_like_coms = document.querySelectorAll('.increment_like_coms')
let decrement_like_coms = document.querySelectorAll('.decrement_like_coms')
let commentaire = document.querySelector('.commentaire')
let user_like_list = document.querySelector('.user_like_list')
let notification = document.querySelector('.notification')
let modal_notification = document.querySelector('.modal_notification')
let suivre = document.querySelector('.suivre')
let userId = document.querySelector('.userId')
let comsData = document.querySelector('.comsData')
let dropDown = document.querySelector('.fa-angle-down')
let menuDropdown = document.querySelector('.menuProfil')





const socket = io()







if(dropDown){

    dropDown.addEventListener('click' , (e) => {

        menuDropdown.classList.toggle('dis-none')
    
    })
    
}





let addLike = (UtilisateurId, ArticleId) => {

    let increment_like = document.querySelector('.increment_like')
    let val_increment = parseInt(increment_like.innerText)



    axios.get(`http://localhost:3000/like/${UtilisateurId}/${ArticleId}`)
        .then((res) => {

            if (res.data.message) {

                like.classList.add('dis-none')
                dislike.classList.remove('dis-none')
                decrement_like.classList.add('dis-none')
                val_increment = val_increment + 1
                increment_like.innerText = val_increment + ' j\'aime'
                increment_like.classList.remove('dis-none')
                
                if (res.data.notif){ socket.emit('like_notif', UtilisateurId, ArticleId)}


            }
        })




}




let removeLike = (UtilisateurId, ArticleId) => {

    let increment_like = document.querySelector('.increment_like')
    let val_decrement = parseInt(increment_like.innerText)



    axios.get(`http://localhost:3000/dislike/${UtilisateurId}/${ArticleId}`)
        .then((res) => {

            if (res.data.message) {

                like.classList.remove('dis-none')
                dislike.classList.add('dis-none')
                increment_like.classList.add('dis-none')
                val_decrement = val_decrement - 1
                decrement_like.innerText = val_decrement + ' j\'aime'
                increment_like.innerText = val_decrement + ' j\'aime'
                decrement_like.classList.remove('dis-none')

            }
        })
}






for (let i = 0; i < like_coms.length; i++) {

    like_coms[i].addEventListener('click', (e) => {

        const UtilisateurId = e.target.dataset.userid
        const CommentaireId = e.target.dataset.commentaireid
        const ArticleId = e.target.dataset.articleid


        let val_increment = parseInt(increment_like_coms[i].innerText)

        axios.get(`http://localhost:3000/likeComs/${UtilisateurId}/${CommentaireId}/${ArticleId}`)
            .then((res) => {

                if (res.data.message) {

                    dislike_coms[i].classList.remove('dis-none')
                    like_coms[i].classList.add('dis-none')
                    val_increment = val_increment + 1
                    decrement_like_coms[i].innerText = val_increment + ' j\'aime'
                    decrement_like_coms[i].classList.remove('dis-none')
                    increment_like_coms[i].classList.add('dis-none')

                    if (res.data.notifComs) {

                        socket.emit('notifComs', res.data.UtilisateurId, res.data.CommentaireId)
                    }

                }
            })
    })
}




for (let i = 0; i < dislike_coms.length; i++) {

    dislike_coms[i].addEventListener('click', (e) => {

        const UtilisateurId = e.target.dataset.userid
        const CommentaireId = e.target.dataset.commentaireid
        const ArticleId = e.target.dataset.articleid

        

        let val_decrement = parseInt(decrement_like_coms[i].innerText)

        axios.get(`http://localhost:3000/dislikeComs/${UtilisateurId}/${CommentaireId}/${ArticleId}`)
            .then((res) => {

                if (res.data.message) {

                    dislike_coms[i].classList.add('dis-none')
                    like_coms[i].classList.remove('dis-none')
                    val_decrement = val_decrement - 1
                    increment_like_coms[i].innerText = val_decrement + ' j\'aime'
                    increment_like_coms[i].classList.remove('dis-none')
                    decrement_like_coms[i].classList.add('dis-none')

                }
            })
    })
}





if (decrement_like) {

    decrement_like.addEventListener('click', (e) => {

        const ArticleId = e.target.dataset.articleid

        axios.get(`http://localhost:3000/like_list/${ArticleId}`)
            .then((res) => {

                let userList = res.data.liste

                for (item of userList) {



                    let newDiv = document.createElement('div')
                    let profil_like_list = document.createElement('div')
                    let profil_name = document.createElement('span')

                    profil_name.classList.add('profil_name')
                    profil_like_list.classList.add('profil_like_list')
                    newDiv.classList.add("d-flex", 'mb-3')

                    profil_name.innerText = item.Utilisateur.nom + ' ' + item.Utilisateur.prenom
                    profil_like_list.style.backgroundImage = `url(/photo/${item.Utilisateur.photo})`

                    newDiv.append(profil_like_list)
                    newDiv.append(profil_name)

                    user_like_list.append(newDiv)
                    user_like_list.classList.remove('dis-none')



                }
            })
    })

}







if (increment_like) {

    increment_like.addEventListener('click', (e) => {

        const ArticleId = e.target.dataset.articleid

        axios.get(`http://localhost:3000/like_list/${ArticleId}`)
            .then((res) => {

                let userList = res.data.liste

                for (item of userList) {



                    let newDiv = document.createElement('div')
                    let profil_like_list = document.createElement('div')
                    let profil_name = document.createElement('span')

                    profil_name.classList.add('profil_name')
                    profil_like_list.classList.add('profil_like_list')
                    newDiv.classList.add("d-flex", 'mb-3')

                    profil_name.innerText = item.Utilisateur.nom + ' ' + item.Utilisateur.prenom
                    profil_like_list.style.backgroundImage = `url(/photo/${item.Utilisateur.photo})`

                    newDiv.append(profil_like_list)
                    newDiv.append(profil_name)

                    user_like_list.append(newDiv)
                    user_like_list.classList.remove('dis-none')




                }


            })
    })

}



for (let i = 0; i < increment_like_coms.length; i++) {

    increment_like_coms[i].addEventListener('click', (e) => {

        const CommentaireId = e.target.dataset.commentaireid

        axios.get(`http://localhost:3000/like_coms_list/${CommentaireId}`)
            .then((res) => {

            
                let userList = res.data.liste
               
                console.log(userList)

                for (item of userList) {

                    console.log('ok')
                    let newDiv = document.createElement('div')
                    let profil_like_list = document.createElement('div')
                    let profil_name = document.createElement('span')

                    profil_name.classList.add('profil_name')
                    profil_like_list.classList.add('profil_like_list')
                    newDiv.classList.add("d-flex", 'mb-3')

                    profil_name.innerText = item.Utilisateur.nom + ' ' + item.Utilisateur.prenom
                    profil_like_list.style.backgroundImage = `url(/photo/${item.Utilisateur.photo})`

                    newDiv.append(profil_like_list)
                    newDiv.append(profil_name)

                    user_like_list.append(newDiv)
                    user_like_list.classList.remove('dis-none')


                }
            })

    })
}










for (let i = 0; i < decrement_like_coms.length; i++) {


    decrement_like_coms[i].addEventListener('click', (e) => {

        const CommentaireId = e.target.dataset.commentaireid

        axios.get(`http://localhost:3000/like_coms_list/${CommentaireId}`)
            .then((res) => {

                let userList = res.data.liste


                for (item of userList) {


                    let newDiv = document.createElement('div')
                    let profil_like_list = document.createElement('div')
                    let profil_name = document.createElement('span')

                    profil_name.classList.add('profil_name')
                    profil_like_list.classList.add('profil_like_list')
                    newDiv.classList.add("d-flex", 'mb-3')

                    profil_name.innerText = item.Utilisateur.nom + ' ' + item.Utilisateur.prenom
                    profil_like_list.style.backgroundImage = `url(/photo/${item.Utilisateur.photo})`

                    newDiv.append(profil_like_list)
                    newDiv.append(profil_name)

                    user_like_list.append(newDiv)
                    user_like_list.classList.remove('dis-none')


                }
            })
    })
}







if (notification) {

    // room => id de l'user connecté
    const room = notification.getAttribute('id')

    socket.emit('room', room)

    notification.addEventListener('click', (e) => {

        modal_notification.classList.toggle('dis-none')
        

        axios.get(`http://localhost:3000/notif_list/${room}`)
            .then((res) => {

                const notifList = res.data.notifList
                modal_notification.innerHTML = ''

                for (item of notifList) {

                    if (item.isRead == false) {

                        if (item.actionType == 'like') {

                            let a = document.createElement('a')
                            a.style.textDecoration = 'none'
                            a.setAttribute('href', ` /voir_article/notif/${item.targetId}`)
                            let divRow = document.createElement('div')
                            divRow.classList.add('row')
                            let div = document.createElement('div')
                            div.classList.add('col-md-12', 'notif_non_lu')
                            let divRow1 = document.createElement('div')
                            divRow1.classList.add('row')
                            let userPdp = document.createElement('div')
                            userPdp.classList.add('userPdp')
                            userPdp.style.backgroundImage = `url(/photo/${item.notificateur.photo})`
                            let notifLabel = document.createElement('span')
                            notifLabel.classList.add('notifLabel')
                            notifLabel.innerText = item.message
                            divRow1.append(userPdp)
                            divRow1.append(notifLabel)
                            //    div.innerHTML = item.message
                            div.append(divRow1)
                            divRow.append(div)
                            a.append(divRow)
                            modal_notification.append(a)
                        } else {

                            let a = document.createElement('a')
                            a.style.textDecoration = 'none'

                            a.setAttribute('href', `/profil_utilisateur/notif/${item.targetId}`)
                            let divRow = document.createElement('div')
                            divRow.classList.add('row')
                            let div = document.createElement('div')
                            div.classList.add('col-md-12', 'notif_non_lu')
                            let divRow1 = document.createElement('div')
                            divRow1.classList.add('row')
                            let userPdp = document.createElement('div')
                            userPdp.classList.add('userPdp')
                            userPdp.style.backgroundImage = `url(/photo/${item.notificateur.photo})`
                            let notifLabel = document.createElement('span')
                            notifLabel.classList.add('notifLabel')
                            notifLabel.innerText = item.message
                            divRow1.append(userPdp)
                            divRow1.append(notifLabel)
                            //    div.innerHTML = item.message
                            div.append(divRow1)
                            divRow.append(div)
                            a.append(divRow)
                            modal_notification.append(a)
                        }

                    } else {

                        if (item.actionType == 'like') {

                            let a = document.createElement('a')
                            a.style.textDecoration = 'none'

                            a.setAttribute('href', ` /voir_article/${item.targetId}`)
                            let divRow = document.createElement('div')
                            divRow.classList.add('row')
                            let div = document.createElement('div')
                            div.classList.add('col-md-12', 'notif_lu')
                            let divRow1 = document.createElement('div')
                            divRow1.classList.add('row')
                            let userPdp = document.createElement('div')
                            userPdp.classList.add('userPdp')
                            userPdp.style.backgroundImage = `url(/photo/${item.notificateur.photo})`
                            let notifLabel = document.createElement('span')
                            notifLabel.classList.add('notifLabel')
                            notifLabel.innerText = item.message
                            divRow1.append(userPdp)
                            divRow1.append(notifLabel)
                            //    div.innerHTML = item.message
                            div.append(divRow1)
                            divRow.append(div)
                            a.append(divRow)
                            modal_notification.append(a)

                        } else {

                            let a = document.createElement('a')
                            a.style.textDecoration = 'none'

                            a.setAttribute('href', `/profil_utilisateur/${item.targetId}`)
                            let divRow = document.createElement('div')
                            divRow.classList.add('row')
                            let div = document.createElement('div')
                            div.classList.add('col-md-12', 'notif_lu')
                            let divRow1 = document.createElement('div')
                            divRow1.classList.add('row')
                            let userPdp = document.createElement('div')
                            userPdp.classList.add('userPdp')
                            userPdp.style.backgroundImage = `url(/photo/${item.notificateur.photo})`
                            let notifLabel = document.createElement('span')
                            notifLabel.classList.add('notifLabel')
                            notifLabel.innerText = item.message
                            divRow1.append(userPdp)
                            divRow1.append(notifLabel)
                            //    div.innerHTML = item.message
                            div.append(divRow1)
                            divRow.append(div)
                            a.append(divRow)
                            modal_notification.append(a)

                        }
                    }
                }
            })
        })
}






if (suivre) {

    suivre.addEventListener('click', (e) => {

        const Utilisateur_suivi = e.target.dataset.userid
        const UtilisateurId = e.target.dataset.followerid

        axios.get(`http://localhost:3000/suivre_utilisateur/${UtilisateurId}/${Utilisateur_suivi}`)
            .then((res) => {

                if (res.data.notif) { socket.emit('suivre', UtilisateurId, Utilisateur_suivi) }
            })

    })
}




if (userId) {

    const UserId = userId.getAttribute('id')
    socket.emit('roomPub', UserId)

}




if (comsData) {

    let UtilisateurId = comsData.getAttribute('data-userid')
    let ArticleId = comsData.getAttribute('data-articleid')

    socket.emit('comsData', UtilisateurId, ArticleId)

}




socket.on('notif', (content) => {


    let nbr_notif = document.querySelector('.nbr_notif')
    let conv = parseInt(nbr_notif.innerText)
    nbr_notif.innerText = conv + 1

})


socket.on('notifPub', (content) => {


    let nbr_notif = document.querySelector('.nbr_notif')
    let conv = parseInt(nbr_notif.innerText)
    nbr_notif.innerText = conv + 1
})





socket.on('notifLike', (content) => {


    let nbr_notif = document.querySelector('.nbr_notif')
    let conv = parseInt(nbr_notif.innerText)
    nbr_notif.innerText = conv + 1

})



// coms like notif


socket.on('comsNotif', (content) => {

    let nbr_notif = document.querySelector('.nbr_notif')
    let conv = parseInt(nbr_notif.innerText)
    nbr_notif.innerText = conv + 1
})


// coms Article notif 

socket.on('notifComs', (content) => {

    let nbr_notif = document.querySelector('.nbr_notif')
    let conv = parseInt(nbr_notif.innerText)
    nbr_notif.innerText = conv + 1
})







// dislike_coms.addEventListener('click' , (e) => {

//     dislike_coms.classList.add('dis-none')
//     like_coms.classList.remove('dis-none')


// })

