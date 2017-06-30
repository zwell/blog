document.oncontextmenu = function(){return false;}//禁用页面右键
document.onkeydown = function (e) {//禁用按键F5
    var ev = window.event || e;
    var code = ev.keyCode || ev.which;
    if (code == 116) {
        if(ev.preventDefault) {
            ev.preventDefault();
        } else {
            ev.keyCode = 0;
            ev.returnValue = false;
        }
    }

}

var BANKCODE="";
var CARDNBR="";
var COINSTCODE="";
var COINSTCHANNEL="";
var RESETPWD_SURL="";
var RESETPWD_FURL="";
var BACKGROUND_URL="";
var publicKeyN="";
var publicKeyE="";
var rsaPublicKeyN="";
var rsaPublicKeyE="";


function pinsettingInit() {
    $.get("../app/do/pinsettingInit", function (data) {
        var objs = jQuery.parseJSON(data);//将json转换成object对象
        for (var i = 0; i < objs.length; i++) {
            BANKCODE = objs[i].BANKCODE;
            //如果银行卡号为空
            //alert(BANKCODE);
            if(BANKCODE == null || BANKCODE == ""){
                document.getElementById("bigDiv").style.display="none";
                $("#showmsg").html("<h3 style='color:#ff0000'>非法请求</h3>");
                return false;
            }
            CARDNBR = objs[i].CARDNBR;
            RESETPWD_SURL=objs[i].RESETPWD_SURL;
            RESETPWD_FURL=objs[i].RESETPWD_FURL;
            BACKGROUND_URL=objs[i].BACKGROUND_URL;
            publicKeyN=objs[i].publicKeyN;
            publicKeyE=objs[i].publicKeyE;
            rsaPublicKeyN=objs[i].rsaPublicKeyN;
            rsaPublicKeyE=objs[i].rsaPublicKeyE;
            $("#logo").addClass("logo-"+BANKCODE);
            if(BANKCODE =="30040000"){
                $("#submitDiv").removeClass("submit");
                $("#submitDiv").addClass("submit-"+BANKCODE);
            }
        }

    });
}

$(function(){
    pinsettingInit();
});


function sub()
{
    var encPin1=$("#encPin1");
    var encPin2=$("#encPin2");
    if(encPin1.val()==null || encPin1.val()==""){
        $("#pwdhints").html("请输入账户交易密码！");
        encPin1.focus();
        return false;
    }
    
    if(encPin1.val().length < 6){
    	$("#pwdhints").html("交易密码不能小于6位！");
        encPin1.focus();
        return false;
    }
    
    if(encPin1.val()!=encPin2.val()){
        $("#pwdhints").html("确认密码与输入密码不一致，请重新输入！");
        encPin2.focus();
        return false;
    }
    var PASS=$("#encPin2").val();;
    var pinVlaue = RSAEnc("06" + PASS, publicKeyN, publicKeyE);
    var encPin=RSAEnc(CARDNBR.length + CARDNBR + pinVlaue + GetRandomNum(0, 999), rsaPublicKeyN, rsaPublicKeyE);
    $("#encPin1").val("");
    $("#encPin2").val("");
    $("#pwdhints").html("数据已提交,请稍后......");
    document.getElementById("sub").disabled=true;
    var paramObject = new Object();
    paramObject.encPin=encPin;
    var data= JSON.stringify(paramObject);//将object对象转换成json
    $.ajax({
        url: "../app/do/pinsetting",
        type: 'post',
        contentType: "application/json",
        data: data,
        success:function(data,status) {
            document.getElementById("sub").disabled=false;
            var objs = jQuery.parseJSON(data);//将json转换成object对象
            for (var i = 0; i < objs.length; i++) {
                var code=objs[i].RETCODE;
                var msg=objs[i].RETMSG;
                var result="错误代码："+code+" "+msg;
                if (msg == "success") {
                    $("#setup").hide();
                    $("#setupFailed").hide();
                    $("#setupSuccess").show();
                    tim_Down(RESETPWD_SURL);
                } else {
                    $("#setup").hide();
                    $("#setupSuccess").hide();
                    $("#setupFailed").show();
                    $("#retcodeFlag").html(result);
                    tim_Down(RESETPWD_FURL);
                }
            }
        } , error:function(xhr,textStatus,errorThrown){
            $("#setup").hide();
            $("#setupSuccess").hide();
            $("#setupFailed").show();
            $("#retcodeFlag").html("交易超时，请检查网络是否可用！");
            tim_Down(RESETPWD_FURL);
        }
    });
}





// 倒计时
var tim =5; //剩余时间
var jumpFlag=true;
function tim_Down(hrefs){
    if(tim == 5){
        if(hrefs!=null && hrefs.length>0){
            $("#automaticJump1").html("<a href='"+hrefs+"'><b style=\'font-weight:normal;\'>5</b>秒后自动跳转&raquo;</a>");
            $("#automaticJump2").html("<a href='"+hrefs+"'><b style=\'font-weight:normal;\'>5</b>秒后自动跳转&raquo;</a>");
        }else {
            $("#urlhints1").html("未设置跳转链接，返回交易密码设置页面...");
            $("#urlhints2").html("未设置跳转链接，返回交易密码设置页面...");
            $("#automaticJump1").html("<a href='javascript:jump()'><b style=\'font-weight:normal;\'>5</b>秒后自动跳转&raquo;</a>");
            $("#automaticJump2").html("<a href='javascript:jump()'><b style=\'font-weight:normal;\'>5</b>秒后自动跳转&raquo;</a>");
        }
    }
    if (tim>=0) {
        $('.stateMsg a b').html(tim);
        tim--;
        setTimeout("tim_Down('"+hrefs+"')", 1000);
    }else if (tim<0) {
        if(hrefs!=null && hrefs.length>0 && hrefs!="null"){
            window.location.href=hrefs;// 跳转链接
        }else{
            if(jumpFlag){
                $("#setupSuccess").hide();
                $("#setupFailed").hide();
                $("#setup").show();
                $("#encPin1").val("");
                $("#encPin2").val("");
                $("#pwdhints").html("");
            }
        }
        tim =5;//初始化变量
        jumpFlag=true;
        $("#urlhints1").html("");$("#urlhints2").html("");
    }
}
function jump(){
    $("#setupSuccess").hide();
    $("#setupFailed").hide();
    $("#setup").show();
    $("#pwdhints").html("");
    jumpFlag=false;
}

//只能输入数字
function IsNum(e) {

    $.windowBro.browser();
    var k = window.event ? e.keyCode : e.which;

    if (((k >= 48) && (k <= 57)) || k == 8 ) {
        event.returnValue = true;
    } else {
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            event.returnValue = false;
            return false;
        }

        else {
            e.preventDefault(); //for firefox
        }
    }

}

// 浏览器版本判断
var userAgent = navigator.userAgent.toLowerCase();
// Figure out what browser is being used
jQuery.browser = {
    version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1]
};

$.windowBro={
    browser:function() {
        var g = $.browser;
        var binfo = "";
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            if (g.version.indexOf("11") != -1) {
                binfo="Microsoft Internet Explorer "+g.version;
                var encPin1=$('#encPin1');
                var encPin2=$('#encPin2');
                $(encPin1).on('keyup',function(e){
                    var en1=encPin1.val();
                    en1=en1.replace('/[^d]+/g', ''); //替换非数字字符为空格
                    en1=parseInt(en1,10);
                    if(isNaN(en1)){
                        en1 = '';
                    }
                    this.value=en1;
                });
                $(encPin2).on('keyup',function(e){
                    var en2=encPin2.val();
                    en2=en2.replace('/[^d]+/g', ''); //替换非数字字符为空格
                    en2=parseInt(en2,10);
                    if(isNaN(en2)){
                        en2 = '';
                    }
                    this.value=en2;
                });

            }
        }

    }}
