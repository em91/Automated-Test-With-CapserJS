/**
 * 提供一些基本的选取xpath的工具方法
 * @type {Object}
 */
var $Utils = {};

//获取可见模块内部某元素Xpath完整路径
$Utils.getModuleXpath = function( xpath ){
	return '//div[starts-with(@id, "module")][not(@style) or @style!="display: none;"]' + xpath;
}
//获取工具栏容器Xpath
$Utils.getToolbarXpath = function( xpath ){
	return $Utils.getModuleXpath( '//div[@class="m-buttons f-cb js-toolbar js-widget"]' + xpath );
}
//获取工具栏下拉菜单
$Utils.getToolbarDropMenu = function( xpath ){
	return $Utils.getToolbarXpath( '/div[contains(@class,"m-lst")][contains(@class, "open")]' + xpath );
}
//根据mid获取xpath
$Utils.getCheckBoxXpathByMid = function( mid ){
	return $Utils.getModuleXpath( '//div[@mid="' + mid + '"]' );
}

$Utils.getXpathByMid = function( mid ){
	return $Utils.getModuleXpath( '//table[descendant::div[@mid="' + mid + '"]]//td[contains(@class, "js-subject" )]' );
}

//获取操作成功提示的xpath
$Utils.getMsgBoxSuccXpath = function(){
	return '//div[@id="js-msgbox-tip"]';
}
//获取撤销xpath
$Utils.getWithDrawXpath = function(){
	return $Utils.getMsgBoxSuccXpath() + "//a";
}
//获取弹窗xpath
$Utils.getWidgetDialogXpath = function(){
	return '//div[contains(@class, "js-w-dialogbox")][contains(@style, "display: block")]';
}
//获取侧边栏xpath
$Utils.getMboxNavXpath = function(){
	return '//div[@id="nav-mbox"]';
}

//根据文件夹名称获取左侧导航栏xpath
$Utils.getMboxNavFolderXpath = function( name ){
	return $Utils.getMboxNavXpath() + "//div[contains(@class, 'js-label')][contains(@title, '" + name + "')]";
}

//封装一层截图，可供全局配置
$Utils.capture = function( path ){
	if( $CONFIG.capture ){
		casper.capture( $CONFIG.screenshot + "/" + ( $MODULE || "" ) + "/" + path );
	}
}

//校验组合xpath是否存在
$Utils.checkXpathGroup = function( xpathArr ){
	for( var i = 0, l = xpathArr.length; i < l; i++ ){
		var isExist = casper.exists({
			type: "xpath",
			path: xpathArr[i]
		});

		if( !isExist ){
			casper.test.error( xpathArr[i] );
			return false;
		}
	}

	return true;
}

//校验组合xpath是否都不存在
$Utils.checkXpathGroupNotExist = function( xpathArr ){
	for( var i = 0, l = xpathArr.length; i < l; i++ ){
		var isExist = casper.exists({
			type: "xpath",
			path: xpathArr[i]
		});

		if( isExist ){
			casper.test.error( xpathArr[i] );
			return false;
		}
	}

	return true;
}