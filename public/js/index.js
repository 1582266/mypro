//main
var dt = $("#main .left dl dt");
var a = $("#main .left dl dd a");

var cur = -1;
for(let i = 0;i < dt.length;i ++){
	dt[i].index = i;
	var count = 1;
	$(dt[i]).click(function(){
		cur = dt[i].index;
		console.log(cur);
		$(dt[i]).siblings("dd").toggleClass("show");
		if(count % 2){
			$(dt[i]).find("span").css("background","url(img/menu1_"+(i+1)+".png) no-repeat 9px 0");
		}else{
			$(dt[i]).find("span").css("background","url(img/menu_"+(i+1)+".png) no-repeat 9px 0");
		}
		count ++;
	})
	
	$(dt[i]).hover(function(){
		$(this).css("background","#454545");
	},function(){
		$(this).css("background","#575757");
		$(dt[cur]).css("background","#454545");
	})
	
}

a.hover(function(){
	$(this).css("background","#797979").siblings().css("background","#575757");
})

//导航菜单显示隐藏
var center = $("#main .center a");
var left = $("#main .left");
var bar = $(".none");
var num = 1;
center.click(function(){
	if(num % 2){
		$(this).find("img").attr("src","img/arrow_left.gif");
	}else{
		$(this).find("img").attr("src","img/arrow_right.gif");
	}
	num ++;
	left.toggleClass("hide");
	bar.toggleClass("block");
	return false;
})


//right  addnew




//切换
var cut = $(".classify span");
var change = $(".change");

$(cut[0]).addClass("white");
$(change[0]).show().siblings().hide();

cut.click(function(){
	$(this).addClass("white").siblings().removeClass("white");
	$(change[$(this).index()]).show().siblings().hide();
})



//添加新商品
var goods_name = $("#goods_name");
var item = $("#item");
var price = $("#price");
var num = $("#num");


var sure = $("#sure");
var clear = $("#clear"); 


sure.click(function(){
	location.href = "success.html";
})

/**/
sure.click(function(){
	$.ajax({
		url:"add4ajax",
		type:"post",
		data:{
			goods_name : goods_name.val(),
			item : item.val(),
			price : price.val(),
			num : num.val()
		},
		success:function(res){
			location.href = "success.html";
		}
	})
})

