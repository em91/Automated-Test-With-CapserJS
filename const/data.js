/**
 * 原始数据和期待数据
 */

var $RAW = {};

$RAW.READ = {};

//读信测试用例的原文
$RAW.READ.normal = "normal";

//链接的表现和响应用例
$RAW.READ.links = "\
	<p>\
	正常链接打开方式:\
	<a href='http://mail.163.com' id='js-open-newwindow'>163邮箱</a>\
	</p>\
	<pre>普通链接识别:\n\
	http://mail.163.com/\n\
	http://casperjs.org/\n\
	https://www.name.com/tools/change_passwd.php?u=xx&amp;k=d86db187529ac1c8dfd0511e8\n\
	https://manager.linode.com\n\
	</pre>\
	<p>\
	邮件地址：<br>\
	<a href='mailto:casperjs@163.com' id='js-email' target='_blank'>casperjs@163.com</a>\
	</p>\
	<p>\
	测试明信片模块跳转：<br>\
	<a target='_blank' href='http://card.163.com' sys='1' id='read_postcard' hidefocus='true'> <span>我也来发明信片</span> </a>\
	</p>\
";

//翻译用例
$RAW.READ.translate = "";

var $EXPECTED = {};

$EXPECTED.READ = {};

$EXPECTED.READ.normal = "normal";
$EXPECTED.READ.links = '<div><p>\t正常链接打开方式:\t<a href=\"http://mail.163.com\" id=\"js-open-newwindow\" target=\"_blank\">163邮箱</a>\t</p>\t<div class=\"js-pre\">普通链接识别:<br>\t<a target=\"_blank\" href=\"http://mail.163.com/\">http://mail.163.com/</a><br>\t<a target=\"_blank\" href=\"http://casperjs.org/\">http://casperjs.org/</a><br>\t<a target=\"_blank\" href=\"https://www.name.com/tools/change_passwd.php?u=xx&amp;k=d86db187529ac1c8dfd0511e8\">https://www.name.com/tools/change_passwd.php?u=xx&amp;k=d86db187529ac1c8dfd0511e8</a><br>\t<a target=\"_blank\" href=\"https://manager.linode.com\">https://manager.linode.com</a><br>\t</div>\t<p>\t邮件地址：<br>\t<a href=\"mailto:casperjs@163.com\" id=\"js-email\" target=\"_blank\">casperjs@163.com</a>\t</p>\t<p>\t测试明信片模块跳转：<br>\t<a target=\"_blank\" href=\"http://card.163.com\" sys=\"1\" id=\"read_postcard\" hidefocus=\"true\"> <span>我也来发明信片</span> </a>\t</p><br><br><span title=\"neteasefooter\"><span id=\"netease_mail_footer\"></span></span></div>';