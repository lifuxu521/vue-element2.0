var SIGN_REGEXP = /([yMdhsm])(\1*)/g;
var DEFAULT_PATTERN = 'yyyy-MM-dd';
function padding(s, len) {
    var len = len - (s + '').length;
    for (var i = 0; i < len; i++) { s = '0' + s; }
    return s;
};

export default {
    getQueryStringByName: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        var context = "";
        if (r != null)
            context = r[2];
        reg = null;
        r = null;
        return context == null || context == "" || context == "undefined" ? "" : context;
    },
    strFilter(str,len){
        var s = str;//要展示的字符串
        if(!s||s==null||s==undefined||s=="undefined"||s=="null"){
           s ="";
        }else if(str.length>len){
            s=str.substring(0,len);
        }
        return s;
    },
    toDecimal(value) {
      if(!value) return '0.00';
      let intPart = Number(value).toFixed(0); //获取整数部分
      let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断

      let floatPart = ".00"; //预定义小数部分
      value = value.toString();
      let value2Array = value.split(".");

      //=2表示数据有小数位
      if(value2Array.length == 2) {
          floatPart = value2Array[1].toString(); //拿到小数部分
 
          if(floatPart.length == 1) { //补0,实际上用不着
              return intPartFormat + "." + floatPart + '0';
          } else {
              return intPartFormat + "." + floatPart;
          }

      } else {
          return intPartFormat + floatPart;
      }
    }, 
    oparseInt(val){
       return parseInt(val);
    },
    cert_type(val){
        let str;
        switch(val)
        {
        case ("1"||1):
          str = "身份证";
          break;
        case ("2"||2):
          str = "军官证";
          break;
        case ("3"||3):
          str = "港澳台居民通行证";
          break;
        case ("4"||4):
          str = "护照";
          break;
        };
        return str;
    },
    busi_code(val){
        let str;
        switch(val)
        {
        case ("outp"):
          str = "门诊收费";
          break;
        case ("inp"):
          str = "住院收费";
          break;
        case ("other"):
          str = "其他收费";
          break;        
        };
        return str;
    },
    userstate(val){
        let str;
        switch(val)
        {
        case ("1"||1):
          str = "正常";
          break;
        case ("0"||0):
          str = "注销";
          break;
        case ("2"||2):
          str = "挂失";
          break;
        };
        return str;
    },
    state(val){
        let str;
        switch(val)
        {
        case ("0"||0):
          str = "注销";
          break;
        case ("9"||9):
          str = "废卡";
          break;
        case ("3"||3):
          str = "挂失";
          break;
        };
        return str;
    },
    chnl_type(val){
        let str;
        switch(val)
        {
        case ('counter'):
          str = "窗口";
          break;
        case ('self'):
          str = "自助机";
          break;
        }
        return str; 
    },
    aRState(val){
        let str;
        switch(val)
        {
        case ("1"||1):
          str = "待审核";
          break;
        case ("2"||2):
          str = "平台已核实";
          break;
        case ("3"||3):
          str = "机构已核实";
          break;
        case ("11"||11):
          str = "机构审核不通过";
          break;
        case ("10"||10):
          str = "平台审核不通过";
          break;
        };
        return str;
    },
    inout_flag(val){
        let str;
        switch(val)
        {
        case ("11"||11):
            str = "充值";
            break;
        case ("12"||12):
            str = "退款";
            break;
        case ("21"||21):
          str = "缴费";
          break;
        case ("22"||22):
          str = "退单返销";
          break;
        case ("21"||21):
          str = "缴费";
          break;
        case ("22"||22):
          str = "退单返销";
          break;
        };
        return str;
    },
    formatDate: {
        format: function (date, pattern) {
            pattern = pattern || DEFAULT_PATTERN;
            return pattern.replace(SIGN_REGEXP, function ($0) {
                switch ($0.charAt(0)) {
                    case 'y': return padding(date.getFullYear(), $0.length);
                    case 'M': return padding(date.getMonth() + 1, $0.length);
                    case 'd': return padding(date.getDate(), $0.length);
                    case 'w': return date.getDay() + 1;
                    case 'h': return padding(date.getHours(), $0.length);
                    case 'm': return padding(date.getMinutes(), $0.length);
                    case 's': return padding(date.getSeconds(), $0.length);
                }
            });
        },
        parse: function (dateString, pattern) {
            var matchs1 = pattern.match(SIGN_REGEXP);
            var matchs2 = dateString.match(/(\d)+/g);
            if (matchs1.length == matchs2.length) {
                var _date = new Date(1970, 0, 1);
                for (var i = 0; i < matchs1.length; i++) {
                    var _int = parseInt(matchs2[i]);
                    var sign = matchs1[i];
                    switch (sign.charAt(0)) {
                        case 'y': _date.setFullYear(_int); break;
                        case 'M': _date.setMonth(_int - 1); break;
                        case 'd': _date.setDate(_int); break;
                        case 'h': _date.setHours(_int); break;
                        case 'm': _date.setMinutes(_int); break;
                        case 's': _date.setSeconds(_int); break;
                    }
                }
                return _date;
            }
            return null;
        }

    }

};
