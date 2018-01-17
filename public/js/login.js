//登录验证码
var a = $(".code");
a.text(code());
a.css("background","#" + Math.floor(Math.random()* 0xffffff).toString(16));
a.click(function(){
	a.css("background","#" + Math.floor(Math.random()* 0xffffff).toString(16));
	a.text(code());
	return false;
})

function code(){
//	var str = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//	var code = "";
//	for(var i = 0;i < 4;i ++){
//		var j = Math.floor(Math.random()*36);
//		code += str.charAt(j);
//	}
//	
	var code = Math.random().toString(36).substr(2,4).toUpperCase();
	return code;
}

//登录
function login(){
	var username = $("#username").val();
	var psw = $("#psw").val();
	var num = $("#num").val();
	var code = $(".code").html();
	if(num != code){
		alert("验证码不正确！");
	}else{
		$.ajax({
			url:"/login4ajax",
			type:"post",
			data:{
				username:username,
				psw:psw
			},
			success:function(res){
				console.log(res);
				if(res.code == 1){
					location.href = "/page";
				}else{
					alert(res.msg);
				}
			}
		})
	}
}
	


