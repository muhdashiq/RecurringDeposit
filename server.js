// server.js
// load the things we need
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var jsonFile = require('jsonfile');

//Setting the express variable.
var app = express();

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//public file

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
	writeLog(req.connection.remoteAddress + "Home/login index hited.");
    res.sendFile(writeView("index"));
});

//login verification
app.post('/login', urlencodedParser, function(req,res){
	
	writeLog("Login attempt recieved");
	var username = req.body.username;
	var password = req.body.password;

	var data = fs.readFileSync( __dirname + "/" + "users.json", 'utf8');//, function(err,data,username,password){
	parseUserData = JSON.parse( data );

	var foundFlag = false ;
	
	parseUserData.forEach(function(userDB){
		if(userDB["username"] == username){
			if(typeof userDB == 'undefined' )
			{
				writeLog("Invalid username("+username+")")
				res.redirect('/loginfailed');
			}	
			else
			{
				foundFlag = true;
				passwordDB = userDB["password"];
				if(password == passwordDB)
				{
					//res.send("Login success");
					writeLog("Login Autheticated Success("+username+")");
					res.redirect('/dashboard');
				}
				else
				{
					writeLog("Invalid password("+username+","+password+")");
					res.redirect('/loginfailed');
				}
			}
		}		
	});

	if(foundFlag == false )
	{
		writeLog("Invalid username("+username+")")
		res.redirect('/loginfailed');
	}

});

//login DashBoard
app.get('/dashboard',function(req,res){
	writeLog(req.connection.remoteAddress + "DashBoard index hited.");
    res.sendFile(writeView("dashboard"));
});

app.get('/reciept',function(req,res){
	writeLog(req.connection.remoteAddress + "Recipt index hited.");
    res.sendFile(writeView("reciept"));
});

app.get('/reports', function(req,res){
	writeLog(req.connection.remoteAddress + "Reports index hited.");
	var data = fs.readFileSync( __dirname + "/" + "users.json", 'utf8');//, function(err,data,username,password){
	admins = JSON.parse( data );

	var accData = fs.readFileSync( __dirname + "/" + "accounts.json", 'utf8');//, function(err,data,username,password){
	accounts = JSON.parse( accData );

	var recieptData = fs.readFileSync( __dirname + "/" + "reciepts.json", 'utf8');//, function(err,data,username,password){
	reciepts = JSON.parse( recieptData );
   // admins = [{name : 'ashiq'},{name:'safwan'},{name:'rasak'}];
	console.log(admins);
    //res.sendFile(writeView("reports"));
    res.render('reports',{admins:admins,accounts:accounts,reciepts:reciepts});
});

app.get('/settings', function(req,res){
	writeLog(req.connection.remoteAddress + "Settings index hited.");
    res.sendFile(writeView("settings"));
});

app.get('/logout', function(req,res){
	res.redirect('/');
});

app.get('/loginfailed', function(req,res){
	writeLog(req.connection.remoteAddress + "Login failed hited.");
    res.sendFile(writeView("loginfailed"));
});

app.post('/createAccount',urlencodedParser,function(req,res){

	var mobile = req.body.mobilenumber;
    var name = req.body.name;
    var nickname = req.body.nickname;
    var address = req.body.address;
    var aadhar = req.body.aadhar;
    var dateofbirth = req.body.dateofbirth;
    var bloodgroup = req.body.bloodgroup;
    var email = req.body.emailid;

    var newAccount = [];
    newAccount.push({
    	name:name,
    	mobile:mobile,
    	nickname:nickname,
    	address:address,
    	aadhar:aadhar,
    	dateofbirth:dateofbirth,
    	bloodgroup:bloodgroup,
    	email:email
    });

   // data = jsonFile.readFileSync("accounts.json");
   // if(data == undefined || data == "[]"){
   // 		data = [];
   // }
   // accountDatas = JSON.parse( data );
   // accountDatas.push(newAccount);
   jsonFile.writeFileSync("accounts.json", newAccount);

	writeLog(req.connection.remoteAddress + "createAccount hited. " + newAccount);
	res.redirect("/dashboard");
});


app.get('/*', function(req,res){
	writeLog(req.connection.remoteAddress + "404 index hited.");
    res.sendFile(writeView("404"));
});

app.listen(8081);
console.log('8080 is the magic port');

// Functions 
function writeLog(data){
        var d = new Date();
        var date=d.toString();
	// Asynchronous - Opening File
	console.log("[INFO] writing to log file : " + data);
	fs.appendFile('application.log', date+"::"+data+'\n','utf-8', 'a',function(err, fd) {
   		if (err) {
       		return console.error(err);
   		} 
	});
}

// returning view to the webpage
function writeView(filename){
	return __dirname + "/views/" + filename+".html";
}

//Database access
function DB(databasename,operation,data){
	
	if(databasename != ""){
		if(operation == "read"){

		}

		else if(operation == "create"){

		}

		else if(operation == "edit"){

		}

		else if(operation == "delete"){

		}
	}
	else
	{
		writeLog("Database operation need 'databasename', 'operation' and 'data' as a mandatory atrributes");
	}
}












