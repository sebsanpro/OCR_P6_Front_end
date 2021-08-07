/**
 * Create carousels according to the chosen parameters
 * @param{[document]} element [queryselector div id]
 * @param{[list]} option [slide to scroll and slide visible]
 * @param{[function]} pictures [fetch of API for watch movie]
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
        this.navigation()
        this.element.appendChild(this.previousButton)
        this.element.appendChild(this.main)
        this.element.appendChild(this.nextButton)




    }

    divWithClass (className) {
        let div = document.createElement('div')
        div.setAttribute('class', className)
        return div
    }

    navigation () {
        this.nextButton = this.divWithClass('caroussel_next')
        this.previousButton = this.divWithClass('caroussel_previous')
        /*this.element.appendChild(this.nextButton)
        this.element.appendChild(this.previousButton)*/
        this.nextButton.addEventListener('click', this.nextButt.bind(this))
        this.previousButton.addEventListener('click', this.previousButt.bind(this))
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

/**
*Best movie
 */
bestMoviesAPI = async function () {
    let response = await fetch('http://localhost:8000/api/v1/titles/?format=json&sort_by=-imdb_score&page_size=7')
    let data = await response.json()
    return data.results;

}

bestMoviesCaroussel = async function () {
    new Caroussel(document.querySelector('#best_movies'), {
        slidesToScroll: 1,
        slidesVisible: 4
    },await bestMoviesAPI())
}

bestMoviesCaroussel()

/**
*Best action movie
 */

bestActionMoviesAPI = async function () {
    let response = await fetch('http://localhost:8000/api/v1/titles/?format=json&genre=Action&sort_by=-imdb_score&page_size=7')
    let data = await response.json()
    return data.results;

}

bestActionMoviesCaroussel = async function () {
    new Caroussel(document.querySelector('#best_action_movies'), {
        slidesToScroll: 1,
        slidesVisible: 4
    },await bestActionMoviesAPI())
}

bestActionMoviesCaroussel()

/**
*Best Family movie
 */

bestFamilyMoviesAPI = async function () {
    let response = await fetch('http://localhost:8000/api/v1/titles/?format=json&genre=Family&sort_by=-imdb_score&page_size=7')
    let data = await response.json()
    return data.results;

}

bestFamilyMoviesCaroussel = async function () {
    new Caroussel(document.querySelector('#best_family_movies'), {
        slidesToScroll: 1,
        slidesVisible: 4
    },await bestFamilyMoviesAPI())
}

bestFamilyMoviesCaroussel()

/*
Best Comedy movie
 */

bestComedyMoviesAPI = async function () {
    let response = await fetch('http://localhost:8000/api/v1/titles/?format=json&genre=Comedy&sort_by=-imdb_score&page_size=7')
    let data = await response.json()
    return data.results;

}

bestComedyMoviesCaroussel = async function () {
    new Caroussel(document.querySelector('#best_comedy_movies'), {
        slidesToScroll: 1,
        slidesVisible: 4
    },await bestComedyMoviesAPI())
}

bestComedyMoviesCaroussel()

/**
 * Modal opening
 * param{[int]} id [id of movie in API]
 */
modalOpen = async function (id) {
    let response = await fetch('http://127.0.0.1:8000/api/v1/titles/' + id)
    let movie = await response.json()
    console.log(movie)
    movieInfo(movie)
    document.querySelector('.movie-modal').removeAttribute('style')
    document.querySelector('.movie-modal').style.display = 'initial'


}

/**
 * show information of movie selected in modal
 * @param movie list info movie in json format, API return
 */
movieInfo = function (movie) {


    document.querySelector('.image-movie').childNodes[1].src = movie['image_url']

    document.querySelector('.title-movie').innerHTML = "<H1>" + movie['title'] + "</H1>"

    let genres = movie['genres']
    let divGenres = document.querySelector('.genres')
    divGenres.innerHTML = "<H3>Genre : </H3>"
    for (let genre = 0; genre < genres.length; genre++) {
        let li = document.createElement('li')
        li.innerHTML = genres[genre] + ", "
        divGenres.appendChild(li)
    }

    document.querySelector('.date-published').innerHTML = "<H3>Date de sortie : </H3>" + movie['date_published']

    document.querySelector('.rated').innerHTML = "<H3>Rated : </H3>" + movie['rated']

    document.querySelector('.imdb-score').innerHTML = "<H3>Score : </H3>" + movie['imdb_score']

    let directors = movie['directors']
    let divDirectors = document.querySelector('.directors')
    divDirectors.innerHTML = "<H3>Réalisateurs : </H3>"
    for (let director = 0; director < directors.length; director++) {
        let li = document.createElement('li')
        li.innerHTML = directors[director] + ", "
        divDirectors.appendChild(li)
    }

    let actors = movie['actors']
    let divActors = document.querySelector('.actor-movie')
    divActors.innerHTML = "<H3>Acteurs : </H3>"
    for (let i = 0; i < actors.length; i++) {
        let li = document.createElement('li')
        li.innerHTML = actors[i] + ", "
        divActors.appendChild(li)
    }

    document.querySelector('.duration').innerHTML = "<H3>Durée : </H3>" + movie['duration']

    let countries = movie['countries']
    let divCountries = document.querySelector('.countries')
    divCountries.innerHTML = "<H3>Pays d'origine : "
    for (let countrie = 0; countrie < countries.length; countrie++) {
        let li = document.createElement('li')
        li.innerHTML = countries[countrie] + ", "
        divCountries.appendChild(li)
    }

    document.querySelector('.worldwide-gross-income').innerHTML = "<H3>Résultat au Box Office : </H3>" + movie['worldwide_gross_income']

    document.querySelector('.description-movie').innerHTML = "<H3>Résumé : </H3>" + movie['long_description']

}

/**
 * Close modal
 * @returns {Promise<void>}
 */
modalClose = async function () {
    let modal = await document.querySelector('.movie-modal')
    modal.addEventListener('click', function () {
        modal.style.display = "None"
    })

}

/**
 * Show best movie in html container in top of page
 */
bestMovie = async function () {
    let response = await fetch('http://localhost:8000/api/v1/titles/?format=json&sort_by=-imdb_score&page_size=2')
    let data = await response.json()
    let movieId = await data.results[0].id
    let responseMovie = await fetch('http://127.0.0.1:8000/api/v1/titles/' + movieId)
    let movie = await responseMovie.json()
    document.querySelector('.image-movie-best').childNodes[1].src = movie['image_url']
    document.querySelector('.title-movie-best').innerHTML = "<H1>" + movie['title'] + "</H1>"
    document.querySelector('.description-movie-best').innerHTML = movie['long_description']
    let btnOpen = document.querySelector('.btn-open')
    btnOpen.addEventListener('click', (function () {
        modalOpen(movie['id'])
    }))

    await modalClose()
}
bestMovie()