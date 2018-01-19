var express = require('express');
var router = express.Router();
var UserModel = require("../model/User");
var GoodsModel = require("../model/Goods");

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

router.get("/login", function(req, res, next) {
	res.render("login", {});
})

router.get("/page", function(req, res, next) {
	if(req.session == null || req.session.username == null){
		res.redirect("/login");
		return;
	}
	res.render("page", {});
})

router.post("/login4ajax", function(req, res) {
	var username = req.body.username;
	var psw = req.body.psw;
	var result = {
		code: 1,
		msg: "登录成功"
	}
	UserModel.find({
		username: username,
		psw: psw
	}, function(err, docs) {
		if(docs.length == 0) {
			result.code = "-100";
			result.msg = "用户名或密码错误";
		}else{
			req.session.username = username;
		}
		res.json(result);
	})
})

//添加商品信息到数据库
//先从数据库中获取总数
var num = 1;
var serial_number = 1;
GoodsModel.count({
	flag: 1
}, function(err, count) {
	num = count;
	serial_number = count;
})
router.post("/add4ajax", function(req, res) {
	console.log(serial_number);
	var goods_name = req.body.goods_name;
	var item = null;
	if(req.body.item) {
		item = req.body.item;
	} else {
		item = "ECS000" + ++num;
	}
	var price = req.body.price;
	var result = {
		code: 1,
		msg: "商品保存成功！"
	}
	var gm = new GoodsModel();
	gm.goods_name = goods_name;
	gm.item = item;
	gm.flag = 1;
	gm.price = price;
	gm.serial_number = ++serial_number;
	gm.save(function(err) {
		if(err) {
			result.code = -1;
			result.msg = "商品保存失败!";
		}
		res.json(result);
	})

})

//从数据库获取商品信息
router.post("/list4ajax", function(req, res) {
	var perpagenum = req.body.perpagenum || 10;
	perpagenum = parseInt(perpagenum);
	var pagenum = req.body.pagenum || 1;
	pagenum = parseInt(pagenum);
	GoodsModel.count({flag:1},function(err, count) {
		var query = GoodsModel.find({flag: 1}).skip((pagenum - 1) * perpagenum).limit(perpagenum);
		query.exec(function(err, docs) {
			var result = {
				total: count,
				totalpage: Math.ceil(count / perpagenum),
				data: docs,
				currentpage: pagenum,
				perpagenum: perpagenum,
				pagenum: pagenum
			}
			res.json(result);
		})
	});
})

//删除商品，将flag标记为0
router.post("/remove4ajax", function(req, res) {
	var serial_number = req.body.serial_number;
	GoodsModel.update({"serial_number": serial_number}, {$set: {"flag": 0}},function(){
		GoodsModel.count({flag: 1},function(err,count){
			res.send("OK");
		})
	});
})



//编辑商品
router.post("/edit4ajax", function(req, res) {
	var serial_number = req.body.serial_number;
	console.log(serial_number);
	GoodsModel.find({"serial_number":serial_number},function(err,docs){
		res.json(docs);
	});
})

//更新商品
router.post("/update4ajax", function(req, res) {
	var serial_number = req.body.serial_number;
	var goods_name = req.body.goods_name;
	var item = req.body.item;
	var price = req.body.price;
	var result = {
		code: 1,
		msg: "商品保存成功！"
	}
	console.log(serial_number);
	GoodsModel.update({"serial_number":serial_number},{$set: {"goods_name": goods_name,"item":item,"price":price}},function(err){
		if(err){
			result.code = -1;
			result.msg = "商品保存失败!";
		}
		res.json(result);
	});
})



//模糊查询
router.post("/search4ajax", function(req, res) {
	var perpagenum = req.body.perpagenum || 10;
	perpagenum = parseInt(perpagenum);
	var pagenum = req.body.pagenum || 1;
	pagenum = parseInt(pagenum);
	var keywords = req.body.keywords;
	console.log(keywords);
	GoodsModel.count({"goods_name": {$regex : keywords}}, function(err, count) {
	var query = GoodsModel.find({"goods_name": {$regex : keywords}}).skip((pagenum - 1) * perpagenum).limit(perpagenum);
		query.exec(function(err, docs) {
			var result = {
				total: count,
				totalpage: Math.ceil(count / perpagenum),
				data: docs,
				currentpage: pagenum,
				perpagenum: perpagenum,
				pagenum: pagenum
			}
			res.json(result);
		})
	})
})


module.exports = router;