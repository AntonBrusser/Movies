var express = require('express');
var router = express.Router();

const utils = require('../Models/usersBL');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.sessionID)
  

if (req.session.valiedUser == 'ok') {
  console.log ("session valied:" + req.session.valiedUser)
  res.render('menu', {data: '', sessionInfo:'Welcome Back ' + req.session.userName + '   the number of transactions left for today: ' + req.session.transactions, message: '' })
} else {
  console.log ("session valied:" + req.session.valiedUser)
  res.render('index', {title: 'Movies', message: ''})
}

});

router.get('/menu', function(req, res, next) {
  if (req.session.userName == 'admin') {
    res.render('menu', {data: '', sessionInfo: '', message: ''});
  } else {
    res.render('menu', {data: '', sessionInfo: 'Hello ' + req.session.userName +  ',   the number of transactions left for today: ' + req.session.transactions, message: ''});
  }
});

router.post('/menu',function(req,res) {    
 console.log(req.body)
 let userName = req.body.user
 let password = req.body.pwd
 req.session.userName = userName
 req.session.password = password
 checkValidations = async function () {
  let valied = await utils.checkUserValidations(userName,password)
  
  let admin = await utils.checkIfAdmin(userName,password)
  if (admin == true) {
    res.render('menu', {data: 'User Managment', sessionInfo: '', message: ''})
  }  else if (valied == true) {
    let user = await utils.getUserByUserName(userName)
    req.session.valiedUser = 'ok'
    req.session.transactions = user.numberOfTransactions
    req.session.userId = user.id
    
    res.render('menu', {data: '', sessionInfo: 'Hello ' + req.session.userName +  '!   the number of transactions left for today: ' + req.session.transactions, message: ''})
  } else {
    res.render('index', {title: 'Movies', message: 'this user is not valied, please check with the admin'})
  }
 }
 checkValidations()
})


router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.render('index', {title: 'Movies', message: ''});  
});


module.exports = router;
