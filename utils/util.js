
 const getNowFormatDate = () =>  {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}

const getDateDiff = (startTime, endTime, diffType) => {
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");

    //将计算间隔类性字符转换为小写
    diffType = diffType.toLowerCase();
    var sTime = new Date(startTime);      //开始时间
    var eTime = new Date(endTime);  //结束时间
    //作为除数的数字
    var divNum = 1;
    switch (diffType) {
    case "second":
        divNum = 1000;
        break;
    case "minute":
        divNum = 1000 * 60;
        break;
    case "hour":
        divNum = 1000 * 3600;
        break;
    case "day":
        divNum = 1000 * 3600 * 24;
        break;
    default:
        break;
    }
    return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
}

const isCardNo = (value) =>  {
    //验证身份证号方法
    var area = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "xinjiang", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" }
    var idcard, Y, JYM;
    var idcard = value;
    var S, M, ereg;
    var idcard_array = new Array();
    idcard_array = idcard.split("");
    if (area[parseInt(idcard.substr(0, 2))] == null) return false;
    switch (idcard.length) {
        case 15:
            if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
                ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //测试出生日期的合法性
            }
            else {
                ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性
            }
            if (ereg.test(idcard))
                //return Errors[0];
                var res = true;
            else
                //return Errors[2];
                var res = false;
            return res;
            break;
        case 18:
            if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
                ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式
            }
            else {
                ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式
            }
            if (ereg.test(idcard)) {
                S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3;
                Y = S % 11;
                M = "F";
                JYM = "10X98765432";
                M = JYM.substr(Y, 1);
                if (M == idcard_array[17])
                    //return Errors[0];
                    var res = true;
                else
                    //return Errors[3];
                    var res = false;
            }
            else
                //return Errors[2];
                res = false;
            return res;
            break;
        default:
            res = false;
            return res;
            break;
    };
}

const getWeek = (dateStr) => {
    var day = new Date(dateStr.replace(/-/g,  "/"));   //需要正则转换的则 此处为 ： var day = new Date(Date.parse(date.replace(/-/g, '/')));  
    var today = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
    var week = today[day.getDay()];
    return week;
}

const getChineseFormatDate = (dateStr) => {
    var date = dateStr.split('-'),
        yy = date[0],
        mm = date[1],
        dd = date[2];
    return mm + "月" + dd + "日";
}

// 日期月份/天的显示，如果是1位数，则在前面加上'0'
const getFormatDate1 = (arg) => {
    if (arg == undefined || arg == '') {
        return '';
    }

    var re = arg + '';
    if (re.length < 2) {
        re = '0' + re;
    }

    return re;
}

const getFormatDate = (indate) => {
    var day = new Date(indate);
    var Year = 0;
    var Month = 0;
    var Day = 0;
    var CurrentDate = "";
    Year = day.getFullYear();//ie火狐下都可以 
    Month = day.getMonth() + 1;
    Day = day.getDate();
    CurrentDate += Year + "-";
    if (Month >= 10) {
        CurrentDate += Month + "-";
    }
    else {
        CurrentDate += "0" + Month + "-";
    }
    if (Day >= 10) {
        CurrentDate += Day;
    }
    else {
        CurrentDate += "0" + Day;
    }
    return CurrentDate;
}

// 日期，在原有日期基础上，增加days天数，默认增加1天
const addDate = (datestr, days) => {
    var date = returnDate(datestr);
    if (days == undefined || days == '') {
        days = 1;
    }
    date.setDate(date.getDate() + days);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return date.getFullYear() + '-' + getFormatDate1(month) + '-' + getFormatDate1(day);
}

const returnDate =  (datestr) => {
    datestr = datestr.replace(/-/g, '/');
    if (isDate(datestr))
        return new Date(datestr);
    else
        return null;
}

const isDate = (datestr) => {
    if (Date.parse(datestr))
        return true;
    else
        return false;
}

const getType = (o) => {
    var _t;
    return ((_t = typeof (o)) == "object" ? Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase();
}

const dateAddValue = (date, value) => {
    var str = '';
    if (getType(date) == 'date') {
        var a = date.valueOf();
        a = a + value * 24 * 60 * 60 * 1000;
        a = new Date(a);
        var y = a.getFullYear();
        var m = a.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        var d = a.getDate();
        d = d < 10 ? "0" + d : d;
        str = y + '-' + m + '-' + d;
    }
    return str;
}

const getMD = (sDate) => {
    var day = new Date(Date.parse(sDate));
    var month = day.getMonth() + 1;
    var date = day.getDate();
    date = date < 10 ? "0" + date : date;
    month = month < 10 ? "0" + month : month;
    return month + "-" + date;
}

const request = (m) => {
    var sValue = location.search.match(new RegExp("[\?\&]" + m + "=([^\&]*)(\&?)", "i"));
    return sValue ? sValue[1] : sValue;
}

 module.exports = {
    isCardNo: isCardNo,
    getNowFormatDate: getNowFormatDate,
    getDateDiff: getDateDiff,
    getWeek: getWeek,
    getChineseFormatDate: getChineseFormatDate,
    getFormatDate: getFormatDate,
    addDate: addDate,
    returnDate: returnDate,
    dateAddValue: dateAddValue,
    getMD: getMD,
    request: request,
}
