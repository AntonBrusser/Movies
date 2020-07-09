const APIdal = require('../DAL/RESTdal');
const NewMoviesDal = require('../DAL/moviesJSONdal');
const UsersDal = require('../DAL/usersJSONdal');



exports.getMoviesData = async function () {
    let oldMovies = await APIdal.getAllMovies()
    let oldMoviesArr = oldMovies.data
    let newMovies = await NewMoviesDal.getNewMovies()
    let newMoviesArr = newMovies.newMovies

    let allTheMovies = [...oldMoviesArr, ...newMoviesArr];
    return allTheMovies;
}


exports.getGenres = async function() {
    let allMovies = await this.getMoviesData();
    let onlyGenres = [];
    allMovies.forEach(element => {
        onlyGenres.push(element.genres);    
    });
    let merged = [].concat.apply([],onlyGenres)
    let genresArr = [];
    merged.map(element => {
        genresArr.push(element.toString())
    });
    let genres = [...new Set(genresArr)]
    return genres;
}



exports.getNewId = async function () {
    let allMovies = await this.getMoviesData();
    let i = allMovies.length - 1;
    let lastID = allMovies[i].id;
    let newID = lastID + 1;
    return newID
}

exports.righNewMovieData = async function (name, language, genres) {
    let jsonData = await NewMoviesDal.getNewMovies();
    console.log(jsonData)
    let newMovieArr = jsonData.newMovies
    console.log(newMovieArr)
    let newId = await this.getNewId();
    let NewMovie = {
        "id":newId,
        "name":name,
        "language":language,
        "genres":genres,
        "image":{"medium": "https://image.shutterstock.com/image-vector/no-image-available-sign-absence-260nw-373243873.jpg"}
    }
    jsonData.newMovies.push(NewMovie)
    NewMoviesDal.rightNewMovies(jsonData)
    return jsonData
}



exports.getLanguages = async function () {
    let allMovies = await this.getMoviesData();
    let onlyLanguages = [];
    allMovies.forEach(element => {
        onlyLanguages.push(element.language)
    })
    let langArr = [];
    onlyLanguages.forEach(element => {
        langArr.push(element.toString())
    });
    let languages = [...new Set(langArr)]
    return languages
}

exports.findMovieById = async function(id) {
    let allMovies = await this.getMoviesData();
    let filteredArr = allMovies.filter(x=> x.id == id);
    let currentMovie = filteredArr[0];
    return currentMovie
}

exports.getFromTheSameGenre = async function (genre) {
    let allMovies = await this.getMoviesData();
    let filteredByGenre = [];
    allMovies.forEach(movie => {
        let genreArr = [...movie.genres]
        genreArr.forEach(el => {
            if (el == genre.trim()) {
                filteredByGenre.push(movie)
            }
        })
    })
    return filteredByGenre;
}






exports.findMovie = async function (name, genre, language) {
    let allMovies = await this.getMoviesData()
    let filteredMovies = [];

    let filteredByLang = []
    let filteredByGenre = []
    allMovies.forEach(movie => {
        let lang = movie.language.toString()
        if (lang == language.trim()) {
            filteredByLang.push(movie)
        }
    })
    filteredByLang.forEach(movie => {
        let genreArr = movie.genres
        genreArr.forEach(el => {
            if (el == genre.trim()) {
                filteredByGenre.push(movie)
            }
        })
    })

    filteredByGenre.forEach(movie => {
        if (movie.name.includes(name) || 
            movie.name.toUpperCase().includes(name) ||
            movie.name.toLowerCase().includes(name)) {
            filteredMovies.push(movie)
        }
    })

    let showMovieSearchResult = filteredMovies

    return showMovieSearchResult
}






