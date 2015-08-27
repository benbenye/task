function show_dialog(isAjax,ele,diaObj){
	var input = '', other = '', btns = '',bgNameArr = ele.split('.'), bgName = '';
	bgNameArr.map(function(obj){
		if(obj != '.'){
			bgName +=(' '+obj);
		}
	});
	if(isAjax) input='input';
	other = diaObj.cont.class || '';
	btns = '<div class="btns">';
	btns += diaObj.btn_ok ? '<div class="inb ve-t '+diaObj.btn_ok.type+'">'+diaObj.btn_ok.text+'</div>':'';
	btns += diaObj.btn_cancel ? '<div class="inb ve-t '+diaObj.btn_cancel.type+'">'+diaObj.btn_cancel.text+'</div>':'';
	btns += '</div>';

		var _dia = '<div class="'+bgName+'" style="display:none;">'
      						+'<div class="dialog '+input+' inb ve-m">'
						      +'<div class="close">×</div>'
						      +'<div class="dia-title">'+diaObj.title+'</div>'
						      +'<div class="dia-con '+other+'">'+diaObj.cont.content+'</div>';
						      _dia+=btns;
						      _dia+='</div>'
						      _dia+='<div class="ref inb ve-m"></div>'
						    _dia+='</div>';
		$('body').append(_dia);
		$('.dialog-bg').fadeIn(300);
		
		$('body').on('click','.close',function(){
			$(ele).remove();
		});

		if(diaObj.btn_ok && diaObj.btn_ok.type == 'ok'){
			if(isAjax){
				$('body').on('click','.ok',function(){
					$(ele).remove();
				});
			}else{
				$(ele).click(function(e){
				  var _con = $('.dialog');   // 设置目标区域
				  if(!_con.is(e.target) && _con.has(e.target).length === 0){ // Mark 1
				    $(ele).remove();
				  }
				});
				$('body').on('click','.ok',function(){
					$(ele).remove();
				});
			}
		}
		if(diaObj.btn_cancel){
			$('body').on('click','.cancel',function(){
				$(ele).remove();
			});
		}
}
Validator={
	func: function(reg, errText, errEmptyText, testStr){
		var _reg = reg;
		if(testStr){
			var text = _reg.test(testStr) ? '' : errText,
					flag = text ? false : true;
			return {flag:flag, text: text};
		}
		return {flag:false, text:errEmptyText};
	},
	isCardCode: function(cardCode){
		var _reg = /^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}((19\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(19\d{2}(0[13578]|1[02])31)|(19\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/;
		return this.func(_reg, '请输入正确的身份证号', '请输入身份证号码', cardCode);
	},
	isEmpty: function(string,name){
		if(string) return {flag:false,text:''};
		else return {flag:true,text:name+'不能为空'};
	},
	isPhoneNumber: function(phoneNumber){
		var _reg = /^(\+?0?86\-?)?1[345789]\d{9}$/;
		if(phoneNumber){
			var text = _reg.test(phoneNumber) ? '' : "请输入手机号码",
					flag = text ? false : true;
			return {flag:flag, text: text} ;
		}else return {flag:false, text:'请输入手机号码'};
	},
	isEmail: function(email){
		var _reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
		if(email){
			var text = _reg.test(email) ? '' : "请输入邮件地址",
					flag = text ? false : true;
			return {flag:flag, text: text} ;
		}else return {flag:false, text:'请输入邮件地址'};
	}
}
