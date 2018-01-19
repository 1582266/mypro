//main nav切换背景
var dt = $("#main .left dl dt");
var a = $("#main .left dl dd a");

var cur = -1;
for(let i = 0;i < dt.length;i ++){
	dt[i].index = i;
	var count = 1;
	$(dt[i]).click(function(){
		cur = dt[i].index;
//		console.log(cur);
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
	if(goods_name.val() == ""){
		alert("商品名不能为空!");
	}else{
		$.ajax({
			url:"/add4ajax",
			type:"post",
			data:{
				goods_name : goods_name.val(),
				item : item.val(),
				price : price.val()
			},
			success:function(res){
				console.log(res);
				if(res.code == 1){
					location.href = "success.html";
				}else{
					alert(res.msg);
				}
			}
		})
	}
})


//list页请求服务器数据
var total = $(".total");
var totalpage = $(".totalpage");
var currentpage = $(".currentpage");
var perpage = $(".perpagenum");
var selections = $(".selections");
var empty = $(".empty");
var prolist = $(".prolist");

var pagenum = currentpage.html();
ajax(perpage.val(),pagenum);

function ajax(perpagenum,pagenum){
	$.ajax({
		url: "/list4ajax",
		type:"post",
		data:{
			"perpagenum" : perpagenum,
			"pagenum" : pagenum
		},
		success:function(obj){
			if(totalpage.html() != obj.totalpage){
				var content = "";
				for(var i = 0;i < obj.totalpage;i ++){
					content += "<option value='' class='pagenum'>"+(i+1)+"</option>";			
				}
				selections.html(content);
			}
			total.html(obj.total);
			totalpage.html(obj.totalpage);
			currentpage.html(obj.currentpage);
			perpage.val(obj.perpagenum);
			
			if(obj.data.length == 0){
				empty.show();
			}else{
				empty.hide();
			}
			var str = "";
			$(obj.data).each(function(index,value){
				str += `
					<h3>
						<span>
							<input type="checkbox" />
							<i>${value.serial_number}</i>
						</span>
						<span>${value.goods_name}</span>
						<span>${value.item}</span>
						<span>${value.price}</span>
						<span><img class="imgs" src="../img/0.gif"/></span>
						<span><img class="imgs" src="../img/1.gif"/></span>
						<span><img class="imgs" src="../img/1.gif"/></span>
						<span><img class="imgs" src="../img/1.gif"/></span>
						<span>100</span>
						<span>1</span>
						<span>0</span>
						<span>
							<a href=""><img src="../img/view.gif"/></a>
							<a href="update.html" class="edit"><img src="../img/edit.gif"/></a>
							<a href=""><img src="../img/copy.gif"/></a>
							<a href="" class="remove"><img src="../img/trash.gif"/></a>
						</span>
					</h3>
				`
			})
			prolist.html(str);
		}
	})
}

//每页显示商品数变化时
perpage.change(function(){
	var pagenum = currentpage.html();
	ajax(perpage.val(),pagenum);
})

//翻页
selections.change(function(){
	var pagenum = $(".selections option:selected").text();
	ajax(perpage.val(),pagenum);
})

//页面跳转
var firstpage = $(".firstpage");
var prepage = $(".prepage");
var nextpage = $(".nextpage");
var lastpage = $(".lastpage");
firstpage.click(function(){
	ajax(perpage.val(), 1);
	return false;
})

lastpage.click(function(){
	ajax(perpage.val(),totalpage.html());
	return false;
})
prepage.click(function(){
	var current = currentpage.html();
	console.log(current);
	if(current > 1){	
		ajax(perpage.val(), -- current);
	}
	return false;
})

nextpage.click(function(){
	var current = currentpage.html();
	if(current < totalpage.html()){
		ajax(perpage.val(), ++ current);
	}
	return false;
})

//切换img√×
var bjnum = 0;
prolist.on("click",".imgs",function(){
	$(this).attr("src","../img/"+(bjnum ++ % 2)+".gif")
})

//删除商品
prolist.on("click",".remove",function(){
	var serial_number = $(this).parent().siblings("span").children("i").html();
	console.log(serial_number);
	$.ajax({
		url:"/remove4ajax",
		type:"post",
		data:{
			"serial_number" : serial_number
		},
		success:function(count){
			console.log(count);
			ajax(perpage.val(),pagenum);
		}
	})
	return false;
})

//编辑商品
prolist.on("click",".edit",function(){
	var serial_number = $(this).parent().siblings("span").children("i").html();
	console.log(serial_number);
	document.cookie = "serial_number=" +  serial_number + ";path=/";
})


//模糊查询
var btn = $(".btn");
btn.click(function(){
	$.ajax({
		url:"/search4ajax",
		type:"post",
		data:{
			"keywords" : $(".keywords").val(),
			"perpagenum" : perpage.val(),
			"pagenum" : pagenum
		},
		success:function(docs){
			if(totalpage.html() != docs.totalpage){
				var content = "";
				for(var i = 0;i < docs.totalpage;i ++){
					content += "<option value='' class='pagenum'>"+(i+1)+"</option>";		
				}
				selections.html(content);
			}
			total.html(docs.total);
			totalpage.html(docs.totalpage);
			currentpage.html(docs.currentpage);
			perpage.val(docs.perpagenum);

			var content = "";
			$(docs.data).each(function(index,value){
				content += `
					<h3>
						<span>
							<input type="checkbox" />
							<i>${value.serial_number}</i>
						</span>
						<span>${value.goods_name}</span>
						<span>${value.item}</span>
						<span>${value.price}</span>
						<span><img class="imgs" src="../img/0.gif"/></span>
						<span><img class="imgs" src="../img/1.gif"/></span>
						<span><img class="imgs" src="../img/1.gif"/></span>
						<span><img class="imgs" src="../img/1.gif"/></span>
						<span>100</span>
						<span>1</span>
						<span>0</span>
						<span>
							<a href=""><img src="../img/view.gif"/></a>
							<a href="addnew.html"><img src="../img/edit.gif"/></a>
							<a href=""><img src="../img/copy.gif"/></a>
							<a href="" class="remove"><img src="../img/trash.gif"/></a>
						</span>
					</h3>
				`
			})
			prolist.html(content);
		}
	})
	return false;
})
