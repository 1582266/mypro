var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Goods = new Schema({
	goods_name:String,
	item:String,
	price:String,
	flag:Number,
	serial_number:Number,
	create_date:{type:Date,default:Date.now}
})

var GoodsModel = mongoose.model("goods",Goods);

module.exports = GoodsModel;