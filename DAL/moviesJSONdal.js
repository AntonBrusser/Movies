const jsonfile = require('jsonfile');
const BL = require('../Models/BL')

exports.getNewMovies = function () {
    return new Promise ((resolve, reject) => {
        jsonfile.readFile( __dirname + "/newMovies.json", function(err, data) {
            if (err) {
                reject (err);
            }  else {
                resolve (data);
            }
        })
    })
}

exports.rightNewMovies = function (newData) {
        jsonfile.writeFile(__dirname + "/newMovies.json", newData)
}
        