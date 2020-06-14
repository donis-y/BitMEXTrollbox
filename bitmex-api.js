
function hashCode(str) { // java String#hashCode
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i){
  var c = (i & 0x00FFFFFF)
  .toString(16)
  .toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
}

var getCookie = function(name) {
  var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return value? value[2] : null;
};

var setCookie = function(name, value, day) {
  var date = new Date();
  date.setTime(date.getTime() + day * 60 * 60 * 24 * 1000);
  document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
};

var clActive = true;

function changeCl(sChannelID){
  setCookie("lastChannelID", sChannelID, 30);

  console.log("changeCl", sChannelID);
  $("#start").val("0");
  $("#channelID").val(sChannelID);
  $('#view').empty();
  chanelListClick();
  callTrollbox();
}

function chanelListClick() {

  if(clActive){
    jQuery('#channelList').show();
  }else{
    jQuery('#channelList').hide();
  }
  clActive = !clActive;
}

var reqAllow = true;
var count = 500;
var channelID = 1;
function callTrollbox(){
  count = $("#count").val();
  channelID = $("#channelID").val();
  $("#more_btn").html("Loading...");

  var reqUrl = 'https://www.bitmex.com/api/v1/chat?count='+count+'&reverse=true&channelID='+channelID;
  if($("#start").val() != '0'){
    reqUrl = 'https://www.bitmex.com/api/v1/chat?count='+count+'&reverse=true&channelID='+channelID+'&start='+($("#start").val()-1);
  }
  console.log("call ", reqUrl);
  if(reqAllow){
    reqAllow = false;
    $.ajax({
      crossOrigin : true,
      dataType : "json",
      url: reqUrl,
      success:function(data){
        var jsonData = JSON.parse(data);
        var appendHtml = "";
        for (var i = 0; i < jsonData.length; i++) {
          appendHtml += '<div class="chatSection" style="border-color: #'+intToRGB(hashCode(jsonData[i].user))+';">';
          appendHtml += '	<span class="chatMessage showUsername" style="color: #'+intToRGB(hashCode(jsonData[i].user))+';">';
          appendHtml += '		<a class="user" data-user="hanbangd" title="">';
          var msgUTCDate = moment(jsonData[i].date, 'YYYY-MM-DDTHH:mm:ss.SSS').add(9, 'hours');
          var dateStr = msgUTCDate.format('HH:mm'); //UTC -> Korea Time

          appendHtml += '			<span class="shortDate" title="">['+dateStr+'] </span>';
          appendHtml += '			<span class="userName">'+jsonData[i].user+': </span>';
          appendHtml += '			<span class="mute" data-chat-id="'+jsonData[i].id+'" data-user="hanbangd" style="background: rgb(190, 242, 157);"></span>';
          appendHtml += '		</a>';
          var message = jsonData[i].html;
          message = message.replace("/assets/img", "https://www.bitmex.com/assets/img");
          appendHtml += '		<span class="message" style="color:#fff;">'+message+'</span>';
          appendHtml += '	</span>';
          appendHtml += '</div>';
          $("#start").val(jsonData[i].id);
        }
        $('#view').append(appendHtml);
        $("#more_btn").html("More");
        reqAllow = true;
      },
      error:function(request,status,error){
        $("#more_btn").html("More");
        reqAllow = true;
        alert("code = "+ request.status + " message = " + request.responseText + " error = " + error); // 실패 시 처리
      },
      complete : function(data) {
        $("#more_btn").html("More");
        reqAllow = true;
      }
    });
  }
}

$(document).ready(function() {
  if(getCookie("lastChannelID") != null){
    $("#channelID").val(getCookie("lastChannelID"));
  }
  callTrollbox();
});
