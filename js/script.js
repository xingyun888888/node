$(document).ready(function(){
	//首页分类	
	function ulWidth() {
		var liW = 0;
		$(".homeTags li").each(function() {
			liW += $(".homeTags li").width() + 20;
		})
		return liW;
	}
	$(".homeTags ul").css("width",ulWidth());
	$(".homeTags .more").click(function() {
		$(this).closest(".homeTags").toggleClass("active");	
		$(".main,.homeTags .bg").toggleClass("active");	
	    $(".homeTags ul").css("width","");
	})
	$(".homeTags li").click(function() {
		$(this).addClass("active").siblings().removeClass("active");
		$(".homeTags,.homeTags .bg,.main").removeClass("active");
		var capLi = $(".homeTags li.active").position().left - 100;
		$(".homeTags .list").animate({scrollLeft:capLi},500);
		//alert(capLi)
	});
	$(".homeTags .bg").click(function(){
		$(".homeTags,.homeTags .bg,.main").removeClass("active");
	})
	
	//搜索框
	$(".s,.search .close").click(function(){
		$(".search,.main").toggleClass("active");
		//$(".search input[type=text]").focus();
	})
	// 专家筛选
	$(".tabTit").find("li").click(function() {
		$(this).toggleClass("active").siblings("li").removeClass("active");
		var activeindex = $(".tabTit").find("li").index(this);
		$(".tabCon").children().eq(activeindex).toggle(0).siblings(".tabInner").hide();
		if($(this).hasClass("active")){
			$(".tabCon").find(".blackBg").show(0);
		} else{
			$(".tabCon").find(".blackBg").hide(0);
		}		
		return false;
	});
	$(".tabCon .blackBg").click(function(){
		$(".tabTit li").removeClass("active");
		$(".tabCon .tabInner").hide(0);
		$(this).hide(0);
	})
	//初始化收听事件
	if ($.isFunction(window.Follow))Follow();
	
	//发布问题
	$(".release,.topSend .close,.releaseBox .sure").click(function(){
		$(".releaseBox,.main").toggleClass("active");
	})
	
	//发布期限
	
	$(".deadline li").click(function(){
		$(this).siblings().removeClass("over");
		$(this).addClass("active").siblings().removeClass("active");
		$(this).prevAll("li").addClass("over");
		if($(".deadline li:nth-child(2)").hasClass("active")){
			$(".deadline").removeClass("w100 w0").addClass("w50")
		}
		else if($(".deadline li:nth-child(3)").hasClass("active")){
			$(".deadline").removeClass("w50 w0").addClass("w100")
		}
		else {
			$(".deadline").removeClass("w50 w100").addClass("w0");
		}
	})
	
	//分类选择
	$(".tagSelect span").click(function(){
		$(this).toggleClass("active");
	})
	//回答弹出
	$(".answer,.answerBox .cancel").click(function(){
		$(".answerBox").toggleClass("active");
	})
	//推广
	$(".spread").click(function(){
		$(".spreadBox").toggle(0);
	})

})