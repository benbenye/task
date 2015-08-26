$('.add-address').on('click','.address-input',function(){
  		$('.select-con,.mask-bg').addClass('show');
	  	var aa = new Address('m',{
	  		init:function(){
	  			$('#select-scroller ul').html('<li data-city="110100">北京</li><li data-city="310100">上海</li>');
	  		},
	  		onOneStep: function(obj, addArr, tag){
	  			var _li = '';
    	  		addArr.map(function(item){
    	  			_li += '<li data-'+tag+'="'+item+'">'+obj.list[item].name+'</li>';
    	  		});
    	  		if(tag == 'city') $('.select-back').addClass('hide');
    	  		else $('.select-back').removeClass('hide');
    	  		$('#select-scroller ul').html(_li);
    	  		myScroll.refresh();
	  		},
	  		onSuccess: function(response){
		  		$('.mask-bg,.select-con').removeClass('show');
		  		$('.select-back').addClass('hide');
		  		// 填充数据
		  		$('.address-input').text(response.city.name + '  ' + response.district.name + '  ' + response.street.name).addClass('text');
		  		$('input[name="city"]').val(response.city.code);
		  		$('input[name="district"]').val(response.district.code);
		  		$('input[name="street"]').val(response.street.code);
	  		}
	  	});
	  	aa.init();
  	});
