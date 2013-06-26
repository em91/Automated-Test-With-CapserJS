var casper = require( "casper" ).create();
var x = require( "casper" ).selectXPath;
var clientutils;


/**
 * 常量枚举
 * @description 全局设置等
 * @type {Object}
 */
var $CONFIG = {};
$CONFIG.capture = false;
$CONFIG.prefix = "casper";
$CONFIG.screenshot = "screenshot";


/**
 * 用户名和密码
 * @type {Object}
 */
var $USER = {};
$USER.USERNAME = "";
$USER.PASSWORD = "";

/**
 * url相关
 * @type {Object}
 */
var $URL = {};
$URL.LOGIN = 'http://mail.163.com';


/**
 * 通用正则匹配
 * @type {Object}
 */
var $REG = {};
$REG.JY5_LOGIN_OK_URL = /^http:\/\/[tc]*webmail.mail.163.com\/jy5\/main\.jsp\?sid=/;
