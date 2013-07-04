/**
 * 提供一些基本的选取xpath的工具方法
 * @type {Object}
 */
var $Utils = {};

//获取可见模块内部某元素Xpath完整路径
$Utils.getModuleXpath = function( xpath, module ){
	return '//div[starts-with(@id, "module' + (module ? ("_" + module) : "") + '")][not(@style) or @style!="display: none;"]' + xpath;
}

//获取精确的某个文件夹的列表容器xpath
$Utils.getListContainerXpath = function( fid ){
	var fidStr = '"' + fid + '"';
	return '//div[starts-with(@id, "module_mbox")][not(@style) or @style!="display: none;"][contains(@name,' + fidStr + ')]';
}

//获取工具栏容器Xpath
$Utils.getToolbarXpath = function( xpath ){
	xpath = xpath || "";
	return $Utils.getModuleXpath( '//div[@class="m-buttons f-cb js-toolbar js-widget"]' + xpath );
}
//获取工具栏下拉菜单
$Utils.getToolbarDropMenu = function( xpath ){
	return $Utils.getToolbarXpath( '//div[contains(@class,"m-lst")][contains(@class, "open")]' + xpath );
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

//根据文件夹名称获取左侧导航栏xpath
$Utils.getMboxNavFolderXpathById = function( fid ){
	return $Utils.getMboxNavXpath() + "//li[@id='folder_" + fid + "']/div/div";
}

//封装一层截图，可供全局配置
$Utils.capture = function( path ){
	if( $CONFIG.capture ){
		casper.capture( $CONFIG.screenshot + "/" + ( $MODULE || "" ) + "/" + path );
	}
}

//点击标记为，下拉菜单截图
$Utils.assertDropMenu = function(){
	var menuListXpath = $Utils.getToolbarXpath( '//div[contains(@class,"m-lst")][contains(@class, "open")]' );
	casper.test.assert( casper.exists( x( menuListXpath ) ), 'Dropmenu Ok' );
}

//校验弹框是否显示中
$Utils.assertDialog = function(){
	var dialogXpath = '//div[contains(@class,"js-w-dialogbox")][contains(@style,"display: block")]';
	casper.test.assert( casper.exists( x( dialogXpath ) ), 'Dialog Ok' );
}

//校验某个文件夹是否在侧边栏存在
$Utils.assertFolder = function( name ){
	var folderXpath = $Utils.getMboxNavXpath() + "//span[contains(@class, 'js-name')][contains(., " + name + ")]";
	casper.test.assert( casper.exists( x( folderXpath ) ), "Folder " + name + " exists." );
}

//校验某个email的hovermenu是否显示，以及鼠标移开后能否正常隐藏
$Utils.assertContactHoverMenu = function( email ){
	casper.test.assertExist({
		type: "xpath",
		path: $Utils.getModuleXpath( "//div[contains(@class, 'm-ppnl-contact')][contains(@style, 'display: block;')]//div[contains(@class,'mail')][contains(.,'" + email + "')]" )
	}, "HoverMenu Show OK.");


	casper.evaluate(function(){
		$(".m-ppnl-contact.open").trigger("mouseout");
	})

	casper.wait( 300, function(){
		casper.test.assertDoesntExist({
			type: "xpath",
			path: $Utils.getModuleXpath( "//div[contains(@class, 'm-ppnl-contact')][contains(@style, 'display: block;')]//div[contains(@class,'mail')][contains(.,'" + email + "')]" )
		}, "HoverMenu Hide OK.");
	})
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

/**
 * 发信      
 */
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
				subject: name + "[" + new Date().getTime() + "]",
				to: $CONF.uid
			}),
			async: false,
			type: "POST",
			success: function( result ){
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

/**
 * 搜索指定主题的邮件的mid
 * @param  {String} subject 
 * @return {void}         
 */
$Utils.getMidBySubject = function( subject ){
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
					// __utils__.echo( JSON.stringify( result ) ); 
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

	return mids;
}


/**
 * 彻底删除指定subject的邮件
 * @param  {String} subject 
 * @return {void}         
 */
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

	var mids = $Utils.getMidBySubject( subject );

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

/**
 * 创建文件夹
 * @return {void} 
 */
$Utils.createFolders = function(){
	casper.test.comment( "createFolders" );
	for( var type in $Folder ){

		//系统文件夹不能创建
		if( $Folder[ type ].system ){
			$Folder[ type ].id = casper.evaluate(function( type ){
				return $FID[ type ]
			}, { type: type } )
			continue;
		}

		var id = casper.evaluate(function( name ){
			var id;
			$.ajax({
				url: "/jy5/xhr/mbox/create.do?sid=" + $CONF.sid,
				data: {
					name: name
				},
				type: "POST",
				success: function( result ){
					if( result.code === "S_OK" ){
						id = result.data[0];
					}
				},
				error: function(){

				},
				async: false
			})
			return id;
		}, {
			name: $Folder[ type ].name
		})

		$Folder[ type ].id = id;

		casper.test.info( "Create Folder '" + $Folder[ type ].name + "' done, fid : " + id );
	}
}

/**
 * 删除文件夹
 * @return {void} 
 */
$Utils.deleteFolders = function(){
	casper.test.comment( "deleteFolders" );
	for( var type in $Folder ){
		var id = casper.evaluate(function( fid ){
			$.ajax({
				url: "/jy5/xhr/mbox/delete.do?sid=" + $CONF.sid,
				data: {
					fid: fid
				},
				type: "POST",
				success: function( result ){
					// __utils__.echo( JSON.stringify( result ) );
					if( result.code === "S_OK" ){
					}
				},
				error: function(){

				},
				async: false
			})
		}, {
			fid: $Folder[ type ].id
		})

		delete $Folder[ type ].id;
	}
}

/**
 * 清空文件夹
 */
$Utils.emptyFolders = function(){
	casper.test.comment( "emptyFolders" );
	for( var type in $Folder ){
		var id = casper.evaluate(function( fid ){
			$.ajax({
				url: "/jy5/xhr/mbox/empty.do?sid=" + $CONF.sid,
				data: {
					fid: fid,
					permanently: true
				},
				type: "POST",
				success: function( result ){
					// __utils__.echo( JSON.stringify( result ) );
					if( result.code === "S_OK" ){
					}
				},
				error: function(){

				},
				async: false
			})
		}, {
			fid: $Folder[ type ].id
		})
	}
}

/**
 * 清空收件箱、已发送、已删除等系统文件夹
 * @return {void} 
 */
$Utils.emptySystemFolders = function(){
	casper.test.comment( "emptySystemFolders" );
	casper.evaluate(function(){
		var systemFolders = [ $FID.inbox, $FID.sent, $FID.deleted, $FID.junk, $FID.subscription, $FID.ads, $FID.draft ];
		for( var i = 0, l = systemFolders.length; i < l; i++ ){
			$.ajax({
				url: "/jy5/xhr/mbox/empty.do?sid=" + $CONF.sid,
				data: {
					fid: systemFolders[i],
					permanently: true
				},
				type: "POST",
				success: function( result ){
					// __utils__.echo( JSON.stringify( result ) );
					if( result.code === "S_OK" ){
					}
				},
				error: function(){

				},
				async: false
			})
		}
	})
}