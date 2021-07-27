/*
Caroussel
 */
class Caroussel {

    constructor(element, options = {}, pictures) {
        this.element = element
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1
        }, options)
        this.pictures = pictures
        this.currentItem = 0
        let ratio = this.pictures.length / this.options.slidesVisible
        this.main = this.divWithClass('caroussel')
        this.container = this.divWithClass('caroussel_container')
        this.container.style.width = (ratio * 100) + "%"
        for (let i = 0; i < this.pictures.length; i++) {
            let item = this.divWithClass('caroussel_item')
            item.style.width = ((100 / this.options.slidesVisible) / ratio) + "%"
            let img = document.createElement('img')
            img.src = this.pictures[i].image_url
            img.setAttribute('id', this.pictures[i].id)
            img.addEventListener('click', (function () {
                modalOpen(img.getAttribute('id'))
            }))
            modalClose()


            this.container.appendChild(item)
            item.appendChild(img)
        }
        this.main.appendChild(this.container)
        this.element.appendChild(this.main)
        this.navigation()



    }

    divWithClass (className) {
        let div = document.createElement('div')
        div.setAttribute('class', className)
        return div
    }

    navigation () {
        let nextButton = this.divWithClass('caroussel_next')
        let previousButton = this.divWithClass('caroussel_previous')
        this.main.appendChild(nextButton)
        this.main.appendChild(previousButton)
        nextButton.addEventListener('click', this.nextButt.bind(this))
        previousButton.addEventListener('click', this.previousButt.bind(this))
    }

    nextButt () {
        this.goToItem(this.currentItem + this.options.slidesToScroll)
    }


    previousButt () {
        this.goToItem(this.currentItem - this.options.slidesToScroll)
    }

    goToItem (index) {
        if (index < 0) {
            index = this.pictures.length - this.options.slidesVisible
        } else if (index >= this.pictures.length - this.options.slidesVisible + 1) {
            index = 0
        }
        let translateX = index * -100 / this.pictures.length
        this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
        this.currentItem = index
    }
}



bestMoviesAPI = async function () {
    let response = await fetch('http://localhost:8000/api/v1/titles/?format=json&sort_by=-imdb_score&page_size=7')
    let data = await response.json()
    let movies = await data.results
    let pictures = []
    for (let i = 0; i < movies.length; i++) {
        pictures.push(movies[i].image_url)
    }
    return movies

}


bestMoviesCaroussel = async function () {
    new Caroussel(document.querySelector('#best_movies'), {
        slidesToScroll: 1,
        slidesVisible: 4
    },await bestMoviesAPI())
}

bestMoviesCaroussel()

/*
Modal
 */

modalOpen = async function (id) {
    let response = await fetch('http://127.0.0.1:8000/api/v1/titles/' + id)
    let movie = await response.json()
    console.log(movie)
    document.querySelector('.image-movie').childNodes[1].src = movie['image_url']
    document.querySelector('.title-movie').innerHTML = movie['title']
    document.querySelector('.descritpion-movie').innerHTML = movie['long_description']
    let actors = movie['actors']
    let divActors = document.querySelector('.actor-movie')
    divActors.innerHTML = ""
    for (let i = 0; i < actors.length; i++) {
        let li = document.createElement('li')
        li.innerHTML = actors[i]
        divActors.appendChild(li)
    }
    document.querySelector('.movie-modal').removeAttribute('style')

}

let modalClose = async function () {
    let modal = await document.querySelector('.movie-modal')
    modal.addEventListener('click', function () {
        modal.style.display = "None"
    })

}