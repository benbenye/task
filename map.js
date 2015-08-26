/*选择配送区域*/
function Address(platForm, options){
	this.region = {
		city: '',
		district: '',
		street: ''
	};
	this.platForm = platForm;
	this.options = options;
}
Address.prototype = {
	constructor: Address,
    init: function () {
        var that = this;
        console.log(that)
        if (that.platForm == 'm') {
            that.region.city = that.region.district = that.region.street = '';
            that.options.init();
        } else {
            var _str = '';
            if ($('input[name="city"]').val()) {
                that.region.city = {code: $('input[name="city"]').val(), name: TAPMap[$('input[name="city"]').val()].name}
                that.region.district = {code: $('input[name="district"]').val(), name: TAPMap[that.region.city.code].list[$('input[name="district"]').val()].name};
                _str = that.region.city.code == '110100' ? '<li data-city="110100" class="on">北京</li><li data-city="310100">上海</li>' : '<li data-city="110100">北京</li><li data-city="310100" class="on">上海</li>'
                $('.tab-con.city').html(_str);
                $('.tab-tit .district').addClass('on').siblings().removeClass('on');
                $('.tab-con.district').show().siblings('.tab-con').hide();
            } else {
                _str = '<li data-city="110100">北京</li><li data-city="310100">上海</li>';
                $('.tab-con.city').html(_str);
            }
        }

        that.bindE();
    },
    bindE: function () {
        var that = this;

        if (that.platForm == 'm') {
            // 手机端选择地址
            $('#select-scroller').on('click', 'li', function () {
                var dom = $(this);
                if (dom.data().street) {
                    // 如果是最后一级地址，做收尾处理
                    that.region.street = {code: dom.data('street'), name: dom.text()};
                    that.options.onSuccess(that.region);
                                        
                    //写入cookie:M
                    var date_history = new Date();
                    date_history.setTime(date_history.getTime() + (365 * 24 * 60 * 60 * 1000));
                    $.fn.cookie("cb_address_city", that.region.city.code, {expires: date_history, path: "/"});
                    $.fn.cookie("cb_address_district", that.region.district.code, {expires: date_history, path: "/"});
                    $.fn.cookie("cb_address_street", that.region.street.code, {expires: date_history, path: "/"});
                    $.fn.cookie("cb_address_text", that.region.city.name + that.region.district.name + that.region.street.name, {expires: date_history, path: "/"});

                    //刷新当前页
                    if ($("#isCartPageM").val() == 1) {//如果是购物车页面，刷新当前页
                        location.reload();
                    }
                    
                } else {
                    that.region.city = that.region.city.code ? that.region.city : {code: dom.data('city'), name: dom.text()};
                    that.region.district = that.region.district.code ? that.region.district : {code: dom.data('district'), name: dom.text()};
                    that.region.street = that.region.street.code ? that.region.street : {code: dom.data('street'), name: dom.text()};

                    var addObj = that.getAddress();
                    var tag = '';
                    if (!addObj)
                        return;
                    var addArr = that.getKeys(addObj.list);

                    if (!that.region.city.code) {
                        tag = 'city';
                    } else if (!that.region.district.code) {
                        tag = 'district';
                    } else {
                        tag = 'street';
                    }
                    that.options.onOneStep(addObj, addArr, tag);
                }
            });
            $('.select-back').tap(function () {
                var tag = that.backUpLevel();
                var addObj = that.getAddress();
                var addArr = that.getKeys(addObj.list);

                that.options.onOneStep(addObj, addArr, tag);
            });
        } else {
            // pc端选择地址
            $('.tab-con').on('click', 'li', function () {
                var _$this = $(this);
                if (that.getKeys(_$this.data())[0] == 'street') {
                    $('#address-text').removeClass('hover');
                    $('#address-text').siblings('.content').addClass('hide');
                    that.region.street = {code: _$this.data('street'), name: _$this.text()};

                    _$this.addClass('on').siblings().removeClass('on')
                    $('.tab-tit .street').find('span').text(that.region.street.name)
                    $('#address-text').text(that.region.city.name + that.region.district.name + that.region.street.name).addClass('text');
                    $('input[name="city"]').val(that.region.city.code);
                    $('input[name="district"]').val(that.region.district.code);
                    $('input[name="street"]').val(that.region.street.code);

                    //写入cookie:PC
                    var date_history = new Date();
                    date_history.setTime(date_history.getTime() + (365 * 24 * 60 * 60 * 1000));
                    $.cookie("cb_address_city", that.region.city.code, {expires: date_history, path: "/"});
                    $.cookie("cb_address_district", that.region.district.code, {expires: date_history, path: "/"});
                    $.cookie("cb_address_street", that.region.street.code, {expires: date_history, path: "/"});
                    $.cookie("cb_address_text", that.region.city.name + that.region.district.name + that.region.street.name, {expires: date_history, path: "/"});

                    //刷新当前页
                    if ($("#isCartPage").val() == 1) {//如果是购物车页面，刷新当前页
                        location.reload();
                    }

                } else {
                    // 可以根据当前点击的对象得知所在地址层级
                    var tag = that.getKeys(_$this.data())[0];
                    that.region[tag] = {code: _$this.data(tag), name: _$this.text()};
                    if (tag == 'city') {
                        that.region.district = that.region.street = '';
                    } else if (tag == 'district') {
                        that.region.street = '';
                    }

                    var addObj = that.getAddress();
                    $('.tab-tit .' + tag).find('span').text(that.region[tag].name)
                    if (tag == 'city') {
                        tag = 'district';
                    } else if (tag == 'district') {
                        tag = 'street';
                    }
                    _$this.addClass('on').siblings().removeClass('on')
                    $('.tab-con.' + tag).html(that.fixDom(addObj, tag));
                    $('.' + tag).show().siblings('.tab-con').hide();
                    $('.tab-tit .' + tag).addClass('on').siblings('li').removeClass('on');

                }
            });

            $('.tab-tit li').click(function () {
                if ($(this).hasClass('on'))
                    return;
                var i = $(this).index();
                $(this).addClass('on').siblings('li').removeClass('on');
                $('.tab-con').eq(i).show().siblings('.tab-con').hide();
            })
        }
    },
    fixDom: function (obj, tag) {
        var _li = '',
                addArr = this.getKeys(obj.list);
        addArr.map(function (item) {
            _li += '<li data-' + tag + '="' + item + '">' + obj.list[item].name + '</li>';
        });
        return _li;
    },
    getAddress: function () {
        if (!this.region.city.code) {
            return {name: '城市', list: TAPMap};
        }
        if (!this.region.district.code) {
            var cityArr = this.getKeys(TAPMap);
            return TAPMap[this.region.city.code];
        }
        if (!this.region.street.code) {
            var cityArr = this.getKeys(TAPMap);
            return TAPMap[this.region.city.code]['list'][this.region.district.code];
        }
    },
    getKeys: function (obj) {
        if (!Object.keys) {
            Object.keys = (function () {
                'use strict';
                var hasOwnProperty = Object.prototype.hasOwnProperty,
                        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
                        dontEnums = [
                            'toString',
                            'toLocaleString',
                            'valueOf',
                            'hasOwnProperty',
                            'isPrototypeOf',
                            'propertyIsEnumerable',
                            'constructor'
                        ],
                        dontEnumsLength = dontEnums.length;

                return function (obj) {
                    if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                        throw new TypeError('Object.keys called on non-object');
                    }

                    var result = [], prop, i;

                    for (prop in obj) {
                        if (hasOwnProperty.call(obj, prop)) {
                            result.push(prop);
                        }
                    }

                    if (hasDontEnumBug) {
                        for (i = 0; i < dontEnumsLength; i++) {
                            if (hasOwnProperty.call(obj, dontEnums[i])) {
                                result.push(dontEnums[i]);
                            }
                        }
                    }
                    return result;
                };
            }());
        }
        return Object.keys(obj);
    },
    backUpLevel: function () {
        var that = this;
        if (that.region.street.code) {
            that.region.street = '';
            return 'street'
        }
        if (that.region.district.code) {
            that.region.district = '';
            return 'district'
        }
        if (that.region.city.code) {
            that.region.city = '';
            return 'city'
        }
    }
};
