var express = require('express');
var router = express.Router();

const userBl = require('../Models/usersBL')
const blUtils = require('../Models/BL')

/* GET home page. */
router.get('/results', async function(req, res, next) {
    res.render('movies', { data: req.session.movieArr, sameGener: req.session.sameGenreArr, message: '' });
});

router.get('/search', async function(req, res, next) {
    let genres = await blUtils.getGenres()
    let languages = await blUtils.getLanguages()
    console.log(genres)
    console.log(languages);
    if (req.session.transactions > 0 || req.session.userName == 'admin') {
        res.render('searchMovies', { data: genres, lang: languages, message: '' });
    } else {
        res.render('menu', {data: '', sessionInfo: 'Hello ' + req.session.userName +  ',   the number of transactions left for today: ' + req.session.transactions, message: 'Sorry... Out Of transections for today'});
    }

});

router.post('/',async function(req,res) {    
    console.log(req.body)
    let movieName = req.body.movieName
    let movieGenre = req.body.genre
    let movieLang = req.body.language
    let userName = req.session.userName

    if (req.session.transactions > 0 || req.session.userName == 'admin') {
        findMovies = async function () {
         let sameGenreArr = await blUtils.getFromTheSameGenre(movieGenre)
         let movieArr = await blUtils.findMovie(movieName, movieGenre, movieLang)
         req.session.sameGenreArr = sameGenreArr
         req.session.movieArr = movieArr
         if (movieArr <= 0) {
            let genres = await blUtils.getGenres()
            let languages = await blUtils.getLanguages()
            res.render('searchMovies', { data: genres, lang: languages, message: 'Oops... No such movie has been found' });
         } else {
           res.render('movies', {data: movieArr, sameGener: sameGenreArr, message: ''})
         }
        }
        findMovies()
        if (req.session.userName !== 'admin') {
            req.session.transactions --
        }
        // await userBl.updateTransNumById(req.session.userId, req.session.transactions)
    } else {
        let genres = await blUtils.getGenres()
        let languages = await blUtils.getLanguages()
        console.log('out of transaction for today')
        res.render('searchMovies', { data: genres, lang: languages, message: 'Sorry... Out of transaction for today' });
    }

   })

router.get('/data', async function(req, res, next) {
    let movies = await blUtils.getMoviesData()
    res.render('movieData', { data: movies });
});


router.get('/create', async function(req, res, next) {
    let genres = await blUtils.getGenres()
    if (req.session.transactions > 0 || req.session.userName == 'admin') {
        res.render('newMovie', { data: genres, message: '' });
    } else {
        res.render('menu', {data: '', sessionInfo: 'Hello ' + req.session.userName +  ',   the number of transactions left for today: ' + req.session.transactions, message: 'Sorry... Out Of transections for today'});
    }
});

router.post('/create/sucssessful', async function(req,res) {    
    let name = req.body.name
    let language = req.body.language
    let genres = req.body.genres
    console.log(name)
    console.log(language)
    console.log(genres)
    if (name == '' || language == '' || genres == undefined) {
        let genres = await blUtils.getGenres()
        res.render('newMovie', { data: genres, message: 'You must enter all the parameters: Name,Language and Genres' });
    } else {
        if (req.session.transactions > 0 || req.session.userName == 'admin') {
            await blUtils.righNewMovieData(name, language, genres)
            if (req.session.userName !== 'admin') {
                req.session.transactions --
            }
        } else {
            res.render('newMovie', { data: genres, message: 'Sorry... Out of transaction for today' });
        }
        if (req.session.userName == 'admin') {
            res.render('menu', {data: '', sessionInfo: '', message: ''});
        } else {
            res.render('menu', {data: '', sessionInfo: 'the number of transactions left for today: ' + req.session.transactions, message: ''});
        }
    }
   })

router.get('/:id', async function(req, res, next) {
    let movies = await blUtils.getMoviesData()
    let id = req.params.id
    let currentMovie = await blUtils.findMovieById(id)
    console.log(currentMovie)
    if (req.session.transactions > 0 || req.session.userName == 'admin') {
        res.render('movieData', { data: currentMovie });
        if (req.session.userName !== 'admin') {
            req.session.transactions --
        }
    } else {
        res.render('menu', {data: '', sessionInfo: 'Hello ' + req.session.userName +  ',   the number of transactions left for today: ' + req.session.transactions, message: 'Sorry... Out Of transections for today'});
    }
});



module.exports = router;