var express = require('express');
var router = express.Router();
var UserModel = require("../model/User");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get("/login",function(req,res,next){
	res.render("login",{});
})

router.get("/page",function(req,res,next){
	res.render("page",{});
})


router.post("/login4ajax",function(req,res){
	var username = req.body.username;
	var psw = req.body.psw;
	var result = {
		code : 1,
		msg : "登录成功"
	}
	UserModel.find({username:username,psw:psw},function(err,docs){
		if(docs.length == 0){
			result.code = "-100";
			result.msg = "用户名或密码错误";
		}
		res.json(result);
	})
})


//添加商品信息到数据库
router.post("/add4ajax",function(req,res){
	console.log(req);
})





module.exports = router;
