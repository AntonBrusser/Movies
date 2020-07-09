const jsonfile = require('jsonfile');

exports.getUsers = function () {
    return new Promise ((resolve, reject) => {
        jsonfile.readFile( __dirname + "/users.json", function(err, data) {
            if (err) {
                reject (err);
            }  else {
                console.log('all the users have been read');
                resolve (data);
            }
        })
    })
}







exports.saveUser = function(newUser) {

    jsonfile.readFile(__dirname + "/users.json",function(err,data)
    {
      if(err)
      {
          reject(err)
      }
      else
      {
        let allUsers = data.users;
        // let newUser = newUser
        allUsers.push(newUser);
  
        jsonfile.writeFile(__dirname + "/users.json", data).then(res => {
        console.log('Write complete')
        }).catch(error => console.error(error))
      }
    }) 
}


exports.saveNewUserArr = function(userArr) {
    
    jsonfile.writeFile(__dirname + "/users.json", userArr).then(res => {
    console.log('Write complete')
    }).catch(error => console.error(error))
}