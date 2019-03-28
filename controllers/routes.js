const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');
var express = require('express')
var router = express.Router()

/*aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY */

//Adding pool and client directly from the AWS console.
var poolData = {
  UserPoolId : 'us-east-2_y7WZLpHzR',
  ClientId : '6td8sa42b65cioiu6di57dpqf8'
};

var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var cognitoUser = userPool.getCurrentUser();

router.post('/register', function(req, res, next) {
  var attributeList = [];
  var attributePhoneNumber = new AmazonCognitoIdentity.CognitoUserAttribute
  ({Name:"phone_number",Value:req.body.phone});
  var attributeName = new AmazonCognitoIdentity.CognitoUserAttribute
  ({Name:"name",Value:req.body.name});
  var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute
  ({Name:"email",Value:req.body.email});
  var attributeAddress = new AmazonCognitoIdentity.CognitoUserAttribute
  ({Name:"address",Value:req.body.address});

  attributeList.push(attributeAddress);
  attributeList.push(attributeEmail);
  attributeList.push(attributePhoneNumber);
  attributeList.push(attributeName);

  userPool.signUp(req.body.username, req.body.password, attributeList, null,
    function(err, result){
      if (err) {
        throw(err);
        return res.send({data: {message: err.message}});
      }
      cognitoUser = result.user;
      console.log('user name is ' + cognitoUser.getUsername());
      res.send(cognitoUser)
  });
})


router.post('/login', function(req, res, next) {
  var user = {
    Username : req.body.username,
    Password : req.body.password
  }
  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username : user.Username,
    Password : user.Password
  });
  var userData = {
    Username : req.body.username,
    Pool : userPool
  };
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      res.send(result)
    },
    onFailure: function(err) {
      return res.send({data: {message: err.message}});
    },
  });
})


router.get('/logout', function(req, res) {
  var cognitoUser = userPool.getCurrentUser();
  if (cognitoUser != null) {
    cognitoUser.signOut();
    res.status(200).json({error: false, data: {message:'successfully logged out'}});
  } else {
    res.status(500).json({error: false, data: {message:'cant log out'}});
  }
});

/*router.get('/logout', function(req, res) {
  var cognitoUser = userPool.getCurrentUser();
  console.log(cognitoUser)
  cognitoUser.signOut(function(err, result) {
    if (err) {
      console.log(err);
    //  return;
    } else {
      console.log(result)
      res.status(200).json({error: false, data: {message:'successfully logged out'}});
  }

  });
}) */

module.exports = router;
