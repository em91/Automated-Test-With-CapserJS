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
	xpath = xpath || "";
	return $Utils.getModuleXpath( '//div[@class="m-buttons f-cb js-toolbar js-widget"]' + xpath );
}
//获取工具栏下拉菜单
$Utils.getToolbarDropMenu = function( xpath ){
	return $Utils.getToolbarXpath( '/div[contains(@class,"m-lst")][contains(@class, "open")]' + xpath );
}
//根据mid获取checkbox xpath
$Utils.getCheckBoxXpathByMid = function( mid ){
	return $Utils.getModuleXpath( '//div[@mid="' + mid + '"]' );
}

//根据mid获取标题xpath
$Utils.getXpathByMid = function( mid ){
	return $Utils.getModuleXpath( '//table[descendant::div[@mid="' + mid + '"]]//td[contains(@class, "js-subject" )]' );
}

//根据标题获取标题xpath
$Utils.getXpathBySubject = function( subject ){
	return $Utils.getModuleXpath( '//table//td[contains(@class, "js-subject" )][contains(., "' + subject + '")]' );
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

$Utils.send = function( name, html, action ){

	if( typeof name == "object" ){
		var testcases = name;
		var results = {};
		for( var testcase in testcases ){
			var subject = $Utils.send( testcase, testcases[ testcase ] );
			results[ testcase ] = subject;
		}
		return results;
	}

	// casper.test.info( __utils__.dump(mail) );
	var action = action || "DELIVER";
	if( !composeId ){
		var composeId = casper.evaluate(function(){
			var composeId;
			$.ajax({
				url: "/jy5/xhr/compose/init.do?sid=" + $CONF.sid + "&cType=NEW",
				contentType : 'application/json',
				data: '{ "content" : "" }',
				type: "POST",
				dataType: "json",
				success: function( result ){
					// __utils__.echo( JSON.stringify( result ) );
					if( result.code == "S_OK" ){
						composeId = result.id;
					} else {

					}
				},
				error: function(){

				},
				async: false
			})	
			return composeId;
		})
	}

	var mail = casper.evaluate(function( name, html, action, composeId ){
		var composeResult;
		$.ajax({
			url: "/jy5/xhr/compose/compose.do?sid=" + $CONF.sid + "&action=" + action,
			data: JSON.stringify({
				account: $CONF.uid,
				attachments: [],
				bcc: "",
				cc: "",
				composeId: composeId,
				content: html,
				html: true,
				subject: name + " [ " + new Date().getTime() + " ] ",
				to: $CONF.uid
			}),
			async: false,
			type: "POST",
			success: function( result ){
				//{"code":"S_OK","data":{
				//	"autosaveRcpts":true,
				//	"composeInfo":{
				//		"account":{ "mail":"autojy5@163.com","name":"autojy5"},
				//		"attachments":[],"bcc":[],"cc":[],"charset":"",
				//		"content":"hello world","html":true,"id":"",
				//		"inlineResources":false,"priority":3,
				//		"requestReadReceipt":false,"saveSentCopy":true,"scheduleDate":0,
				//		"showOneRcpt":false,"subject":"Read Test Case","timedsendNotify":"",
				//		"to":[{"mail":"autojy5@163.com","name":"autojy5"}]},
				//		"other":{"draftId":"","pabResult":[{"action":"ignored","item":{"EMAIL;PREF":"autojy5@163.com","FN":"autojy5"}}],"saveSentFailed":"","saveSentId":"","saveSentIgnored":"",
				//		"savedSent":{"imapFolder":"Sent Items","imapID":1372233670,"mailSize":1062,"mid":"xtbBEBhJMFD+QRxu8wABse","msid":272,"totalCapacity":3221225472,"usedCapacityKB":124333},"scheduledSent":"","sentTInfo":"wmsvr80:UMGowEDp50GB4MtRlP1vAA--.9075W"}
				//	}
				//}
				composeResult = result;
			},
			error: function(){

			},
			contentType : 'application/json'
		})

		return composeResult.data.composeInfo.subject;
	}, {
		name: name,
		html: html,
		action: action,
		composeId: composeId
	})

	return mail;
}

$Utils.deleteMailBySubject = function( subject ){
	if( !subject ){
		casper.test.info( "no subject." );
		return;
	}
	if( typeof subject === "object" ){
		var subjects = subject;
		for( var subject in subjects ){
			$Utils.deleteMailBySubject( subjects[ subject ] );
		}
		return;
	}

	var mids = casper.evaluate(function( subject ){
		var mids = [];
		$.ajax({
			url: "/jy5/xhr/list/search.do?sid=" + $CONF.sid,
			data: {
				keyword: subject,
				searchType: "FULL"
			},
			type: "POST",
			success: function( result ){
				if( result.code === "S_OK" ){
					for( var i = 0, l = result.data.length; i < l; i++ ){
						mids.push( result.data[i].mid );
					}
				}
			},
			error: function(){

			},
			async: false
		})
		return mids;
	}, {
		subject: subject
	})

	casper.evaluate(function( mids, subject ){
		$.ajax({
			url: "/jy5/xhr/msg/delete.do?sid=" + $CONF.sid,
			data: $.param({
				mid: mids,
				thread: false,
				permanently: true
			}, true),
			type: "POST",
			success: function( result ){
				// __utils__.echo( subject + " delete done." );
				// __utils__.echo( JSON.stringify(result) );
			},
			error: function( result ){

			},
			async: false
		})
	},{
		mids: mids,
		subject: subject
	})
}