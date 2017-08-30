/*获取问题列表*/
function ajax_ask_list(){
	if(globalObj.isloading)return;
	globalObj.isloading=true;
	$(".loading").show();
	$(".noMore").hide();
	pindex++;
	var tag_id=$(".mytag.active").eq(0).attr('attr-id');
	var postData={act:'json_page',p:pindex,ask_type:ask_type,ask_order:ask_order};
	if(keyword!='')postData.keyword=keyword;
	if(tag_id!="0")postData.tags=tag_id;
	$.post(get_ajax_ask_url, postData, function(result){
		max_pindex=result.pages;
		if(result.pages<pindex){
			$(".loading").hide();
			$(".noMore").show();
			globalObj.isloading=false;
			return false;
		}
		postData.act="html_page";
		loading_page_html(postData,get_ajax_ask_url,list_css_name,false);//加载HTML页面
	},"json");	
}
//记载页面
function loading_page_html(_postData,_url,_css_name,_cover){
	$.post(_url,_postData, function(result){
		$(".loading").hide();
		if(_cover)$(_css_name).html(result);
		if(!_cover)$(_css_name).append(result);
		//voicePlay();//需要重新绑定听声音的事件
		globalObj.isloading=false;
		QuestionBind();//重新绑定问题地址
		Follow();//重新绑定用户关注
	},"html");
}
//绑定问题地址
function QuestionBind(){
	if(!$(".whisper_question"))return;
	$(".whisper_question").unbind();
	$(".whisper_question").click(function(){
		var url=$(this).attr('attr-href');
		location.href=url;
	});
}
//显示Tips
function showTips(text,seconds){
	$(document.body).append("<div class=\"textTip\"><p></p></div>");
	$(".textTip").show();
	$(".textTip").children("p").text(text);
	setTimeout(function(){
		$(".textTip").remove();
	},seconds);
}
//显示对话框
function showAlert(cnf,callback_q,callback_c){
	$(document.body).append("<div class=\"floatBox popupTip\"><div class=\"mid box\"><div class=\"txt\"><p></p></div><div class=\"pbtn\"><ul class=\"flex\"><li class=\"gray\">取消</li><li class=\"green\">确定</li></ul></div></div></div>");
	$(".popupTip .txt").children("p").text(cnf.info);
	if(cnf.show_c!=1)$(".popupTip .gray").hide();
	if(cnf.show_c_text!="")$(".popupTip .gray").text(cnf.show_c_text);
	if(cnf.show_q_text!="")$(".popupTip .green").text(cnf.show_q_text);
	$(".popupTip .gray").unbind();
	$(".popupTip .gray").click(function(){
		if (typeof callback_c === "function")callback_c(); 
		$(".popupTip").remove();
	});
	$(".popupTip .green").unbind();
	$(".popupTip .green").click(function(){
		if (typeof callback_q === "function")callback_q(); 
		$(".popupTip").remove();
	});

}

//关注用户
function Follow(){
	if(!$(".listen"))return;
	$(".listen").unbind();
	$(".listen").click(function(){
		var id=$(this).attr('data');
		var dgSt=$(this);
		var op="follow";
		if($(this).hasClass('active'))op="cancel";
		
		$.post(get_follow_url,{sub:op,id:id},function(json){
			if(json.status==1){
				if(op=="follow"){
					dgSt.removeClass('active');
					dgSt.addClass('active');
					showTips("成功收听",1500);
				}
				if(op=="cancel"){
					dgSt.removeClass('active');
					showTips("已取消收听",1500);
				}
			}else{
				showTips(json.info,1500);
			}
		});
	});
}



//预览图片，删除并关闭
function showPicDel(o){
	var len = 0;
	var current_index = 0;
	var thumb;
		$(".showpic").remove();
		$(document.body).append("<div class=\"showpic\"><ul></ul><div class=\"s-btn\"><img src=\""+tpl_src+"/images/icon-return.png\" class=\"icoreturn btnl showpic_l\" /> <img src=\""+tpl_src+"/images/icon-return.png\" class=\"icoreturn btnr showpic_r\" /></div><img src=\""+tpl_src+"/images/icon-del.png\" class=\"icondel showpic_del\" /><img src=\""+tpl_src+"/images/icon-close.png\" class=\"icoreturn showpic_close\" /></div>");
		//绑定新的事件
		$(".showpic .showpic_l").unbind();
		$(".showpic .showpic_l").click(function(){
				$(".showpic ul li").removeClass("on");
				if(current_index==0){
					current_index = len-1;
				}else{
					current_index--;
				}	
				$(".showpic ul li").eq(current_index-1).addClass("on");	
		});
		$(".showpic .showpic_r").unbind();
		$(".showpic .showpic_r").click(function(){
				$(".showpic ul li").removeClass("on");	
				if(current_index < len-1){ current_index++;} else {current_index = 0;}
				$(".showpic ul li").eq(current_index).addClass("on");	
		});
		$(".showpic .showpic_del").unbind();
		$(".showpic .showpic_del").click(function(){
				var src = $(".showpic ul li").eq(current_index-1).find("img").attr("src");	
				$(".thumb-imgs").eq(current_index-1).parent().remove();
				//alert("此处添加删除事件"+src);
				up_images.splice(current_index-1,1)
				$(".showpic").removeClass("on");
		});
		$(".showpic .showpic_close").unbind();
		$(".showpic .showpic_close").click(function(){
			$(".showpic").removeClass("on");
		});
	current_index  = $(o).index();	
	var shtml; 
	thumb = $(o).parent().find(".thumb-imgs");
	len   = thumb.length;
	$(".showpic ul li").remove();		
	for(var i =0; i < len;i++){
	   var srcs = $(thumb).eq(i).attr("src");
	   if(i==current_index-1){	      
	   		shtml ='<li class="on"><img src="'+srcs+'" alt=""/></li>';	
	   }else{
	   		shtml ='<li><img src="'+srcs+'" alt=""/></li>';	
	   }
	   $(".showpic ul").append(shtml);	    
    };	
	$(".showpic").addClass("on");
}

//微信支付，支付参数，成功后API地址,不成功转发地址,数据
function onBridgeReady(pay_api,api_url,to_url,data){
   WeixinJSBridge.invoke(
       'getBrandWCPayRequest', {"appId":pay_api.appId,"timeStamp":pay_api.timeStamp,"nonceStr":pay_api.nonceStr,"package":pay_api.package,"signType":pay_api.signType,"paySign":pay_api.paySign},
       function(res){     
           if(res.err_msg=="get_brand_wcpay_request:ok" ) {
				showAlert({info:"支付成功"},function(){
					//执行支付动作
						$.ajax({url:api_url,data:data,type:"post",dataType: "json",success: function (json) { 
							   if(json.status==2){onBridgeReady(pay_api,api_url,to_url,data);return false;}
							   if(json.status!=1){showAlert({info:json.info},function(){reload(json.url);});return false;}
							   if(json.status==1){reload(json.url);}
						},error: function (XMLHttpRequest,textStatus,errorThrown) {alert(errorThrown);}});
				});

		   }else{reload(to_url);}}
   ); 
}
//调用支付
function toPayFun(api_url,data){
	 $.ajax({url:api_url,data:data,type:"post",dataType: "json",success: function (json) { 
		   if(json.status==2){onBridgeReady(json.pay,api_url,json.url,data);return false;}
		   if(json.status!=1){showAlert({info:json.info});return false;}
		   if(json.status==1){showAlert({info:json.info},function(){reload(json.url);});return true;}
	},error: function (XMLHttpRequest,textStatus,errorThrown) {alert(errorThrown);}});
	return false;
}


