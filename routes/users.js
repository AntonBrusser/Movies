var express = require('express');
var router = express.Router();

let userUtils = require('../Models/usersBL')

/* GET users listing. */
router.get('/', async function(req, res, next) {
  if (req.session.valiedUser == 'ok') {
    res.send('oops ,you are not belong here')
  } else {
    let users = await userUtils.getAllUsers()
    res.render('admin' , {data: users});
  }
});

router.get('/data', function(req, res, next) {
  let task = 'Save'
  let userName = ''
  let password = ''
  let transNum = ''
  let userId = 0
  res.render('userData', {dataTask: task, userNameData: userName, passwordData: password, idData: userId, transData: transNum});
});


router.get('/delete/:id', async function(req, res, next) {
  let id = req.params.id
  console.log(id)
  let massege = await userUtils.deletUserById(id)
  console.log(massege)
  res.redirect('/users')
});




router.get('/Update/:id', async function(req, res, next) {
  let id = req.params.id
  let task = 'Update'
  console.log(id + " " + task)
  let user = await userUtils.getUserById(id)
  let userName = user.userName
  let password = user.password
  let transNum = user.numberOfTransactions
  let userId = user.id
  res.render('userData', {dataTask: task, userNameData: userName, passwordData: password, idData: userId, transData: transNum})
});


router.post('/update/:id' , async function (req, res, next) {
  console.log(req.body)
  let id = req.params.id
  let removal = await userUtils.deletUserById(id)
  console.log(removal)
  let newUserName = req.body.userName
  let newPassword = req.body.password
  let newTransNum = req.body.transNumber
  let updatedUser = {"id" : id,
                    "userName" : newUserName,
                    "password" : newPassword,
                    "numberOfTransactions" : newTransNum}
  let updatation = await userUtils.saveNewUserData(updatedUser)
  console.log(updatation)
  res.redirect('/users')
})

router.post('/Save/0' , async function (req, res, next) {
  console.log(req.body)
  let id = await userUtils.createNewUserId()
  let newUserName = req.body.userName
  let newPassword = req.body.password
  let newTransNum = req.body.transNumber
  let updatedUser = {"id" : id,
                    "userName" : newUserName,
                    "password" : newPassword,
                    "numberOfTransactions" : newTransNum}
  let updatation = await userUtils.saveNewUserData(updatedUser)
  console.log(updatation)
  res.redirect('/users')
})

module.exports = router;
