const NewMoviesDal = require('../DAL/moviesJSONdal');
const UsersDal = require('../DAL/usersJSONdal');

exports.checkUserValidations = async function(userName, password) {
    let allUsers = await UsersDal.getUsers()
    let usersArr = allUsers.users
    console.log(usersArr)
    let filtered = usersArr.filter(x => x.userName == userName)
    console.log(filtered)

    if (filtered.length > 0) {
        if (filtered[0].password !== password) {
            console.log ('password wrong')
            return false
        } else {
            console.log('password correct')
            return true
        }
    } else {
        console.log ('user not found')
        return false
    }
}

exports.checkIfAdmin = async function(userName, password) {
    let isAdmin = false;
    if (userName == "admin" && password == "admin") {
        isAdmin = true;
    }
    return isAdmin
}


exports.getAllUsers = async function () {
    let users = await UsersDal.getUsers()
    let userArr = users.users
    return userArr
}

exports.deletUserById = async function (id) {
    let allusers = await this.getAllUsers();
    let filteredArr = []
    allusers.forEach(user => {
        if (user.id != id) {
            filteredArr.push(user)
        }
    });
    let object = {"users" : filteredArr}
    console.log(object)
    UsersDal.saveNewUserArr(object)
    return ("the user with the id: " + id + " has been deleted")
}

exports.getUserById = async function (id) {
    let allUsers = await this.getAllUsers();
    let currentUser = allUsers.filter(x => x.id == id)
    let user = currentUser[0]
    return user
}

exports.getUserByUserName = async function (username) {
    let allUsers = await this.getAllUsers();
    let currentUser = allUsers.filter(x => x.userName == username)
    let user = currentUser[0]
    return user
}

exports.saveNewUserData = async function (newUser) {
    await UsersDal.saveUser(newUser)
    return ('user was updated successfully')
}

exports.createNewUserId = async function () {
    let allUsers = await this.getAllUsers();
    let i = allUsers.length - 1
    let lastId = allUsers[i].id
    let newId = lastId + 1
    return newId
}

exports.updateTransNumById = async function (id, transNum) {
    let currentUser = await this.getUserById(id)
    currentUser.numberOfTransactions = transNum
    await this.deletUserById(id)
    await this.saveNewUserData(currentUser)
}



