function reload(url){
	if(url=="")window.location.reload();
	if(url!="")window.location.href=url;
}
function chkStrNum(num,str_id,str_info_id){
	var tip_num=num-$('.'+str_id).val().length;
	if(tip_num<=0)tip_num=0;
	$('.'+str_info_id).html((num-tip_num)+"/"+num);
	$('.'+str_id).val($('.'+str_id).val().substring(0,num));
}
