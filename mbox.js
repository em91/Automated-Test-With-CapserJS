var casper = require( "casper" ).create();
var x = require( "casper" ).selectXPath;
var clientutils;

var $CONFIG = {};
$CONFIG.CAPTURE = false;

//用户信息
var $USER = {};
$USER.USERNAME = "em91beta";
$USER.PASSWORD = "em91beta12";

//URL相关
var $URL = {};
$URL.LOGIN = 'http://mail.163.com';

//正则匹配
var $REG = {};
$REG.JY5_LOGIN_OK_URL = /^http:\/\/[tc]*webmail.mail.163.com\/jy5\/main\.jsp\?sid=/;


//选择器
var $SELECTOR = {};
$SELECTOR.LOGIN_PAGE_FORM = "form#login163";
$SELECTOR.LOGIN_OK_BTN = "#loginBtn";
$SELECTOR.MBOXNAV_FOLDER_1 = '#folder_1 .js-label';


//XPATH
var $XPATH = {};
$XPATH.LIST_CONTAINER_EXIST = '//div[@class="g-mn-mx scroll js-list-container"]';

var $Utils = {};
/**
 * 获取可见模块内部某元素Xpath完整路径
 * @param  {String} xpath 
 * @return {String}       
 */
$Utils.getModuleXpath = function( xpath ){
	return '//div[starts-with(@id, "module")][@style!="display: none;"]' + xpath;
}

$Utils.getToolbarXpath = function( xpath ){
	return $Utils.getModuleXpath( '//div[@class="m-buttons f-cb js-toolbar js-widget"]' + xpath );
}

$Utils.getToolbarDropMenu = function( xpath ){
	return $Utils.getToolbarXpath( '/div[contains(@class,"m-lst")][contains(@class, "open")]' + xpath );
}

$Utils.getXpathByMid = function( mid ){
	return $Utils.getModuleXpath( '//div[@mid="' + mid + '"]' );
}

$Utils.getMsgBoxSuccXpath = function(){
	return '//div[@id="js-msgbox-tip"]';
}

$Utils.getWithDrawXpath = function(){
	return $Utils.getMsgBoxSuccXpath() + "//a";
}

/**
 * 封装一层截图，可供全局配置
 * @param  {String} path 保存路径
 * @return {void}      
 */
$Utils.capture = function( path ){
	if( $CONFIG.CAPTURE ){
		casper.capture( path );
	}
}

var $MBOX = {};
$MBOX.checkListUI = function(){
	//去页面context里取UD属性等，拼接请求URL
	var result = casper.evaluate(function(){
		var listUrl = "/jy5/xhr/list/list.do?sid=" + $CONF.sid + "&loc=folder_1";
		var param = {
			fid: 1, 
			start: 0,
			limit: $SDCache.getMaxList(),
			pageSize: $SDCache.getMaxList(),
			thread: true
		};
		return JSON.parse( __utils__.sendAJAX( listUrl, "POST", param, false ) );
	})

	var codeOk = result.code === "S_OK";
	casper.test.assert( codeOk, "List S_OK" )

	list = result.data;
	var count = 0;

	//判断服务端取到的数据在UI上是否都存在
	for( var i = 0, l = list.length; i < l; i++ ){
		var isExist = casper.exists({
			type: 'xpath',
			path: $Utils.getXpathByMid( list[i].mid )
		});

		if( isExist ){
			count++;
		}
	}

	//获取分页数量
	var pageSize = casper.evaluate(function(){
		return $SDCache.getMaxList();
	})

	//获取UI上显示的邮件数量
	var rowLength = casper.evaluate(function(){
		return $( 'div[id^=module_mbox_] :visible tbody.mboxListRow tr' ).size();
	})

	//判断分页数、UI邮件数量是否相同
	var pageSizeOk = ( count === rowLength ) && ( count === pageSize );
	casper.test.assert( pageSizeOk, "Check PageSize: " + count + ", " + rowLength );
}

$MBOX.withdrawTest = function( callback ){
	casper.wait(500, function(){
		//判断操作成功的提示是否存在
		var msgbox = x( $Utils.getMsgBoxSuccXpath() );
		var msg = this.exists( msgbox );
		casper.test.assert( msg, 'MsgBox: ' + this.fetchText( msgbox ) );

		$MBOX.checkListUI();

		//点击撤销后校验UI
		casper.click( x( $Utils.getWithDrawXpath() ) );
		casper.test.info( "Click withdraw" );
		casper.wait(1500, function(){
			$MBOX.checkListUI();
			callback && callback();
		})
	})
}

//点击标记为，下拉菜单截图
$MBOX.assertDropMenu = function(){
	var menuListXpath = $Utils.getToolbarXpath( '/div[contains(@class,"m-lst")][contains(@class, "open")]' );
	casper.test.assert( casper.exists( x( menuListXpath ) ), 'Dropmenu Ok' );
}

$MBOX.assertDialog = function(){
	var dialogXpath = '//div[contains(@class,"js-w-dialogbox")][contains(@style,"display: block")]';
	casper.test.assert( casper.exists( x( dialogXpath ) ), 'Dialog Ok' );
}

casper.userAgent('Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36');

//404和500
casper.on('http.status.404', function( resource ) {
    this.tester.error( '404: ' + resource.url );
});

casper.on('http.status.500', function( resource ) {
    this.tester.error( '500: ' + resource.url );
});

//页面出现JS错误
casper.on( "page.error", function( msg, trace ) {
    this.tester.error( "Error: " + msg, "PAGE.ERROR" );
});


//登录流程 - 输入用户名、密码
casper.start( $URL.LOGIN, function(){
	//设置分辨率
	casper.viewport( 1280, 1024 );
	this.test.info( "Filling in username and password..." );
	this.fill( $SELECTOR.LOGIN_PAGE_FORM, {
		username: $USER.USERNAME, 
		password: $USER.PASSWORD
	});
})


//登录流程 - 点击登录
casper.then(function(){
	this.click( $SELECTOR.LOGIN_OK_BTN );
	this.test.info( "Login in..." );
})


//检测是否登录成功，截图欢迎页面
casper.waitFor(function check(){
	return this.evaluate(function(){
		return location.href.indexOf( "jy5" ) > -1;
	})
}, function then(){
	this.test.assertUrlMatch( $REG.JY5_LOGIN_OK_URL, 'Login success.' );
	$Utils.capture( 'mbox/welcome.png' );
})

//点击侧边栏收件箱，等待100ms后截图收件箱
casper.thenClick( $SELECTOR.MBOXNAV_FOLDER_1, function(){
	casper.wait( 200, function(){
		var done = this.exists({
			type: 'xpath',
			path: $Utils.getModuleXpath( $XPATH.LIST_CONTAINER_EXIST )
		});

		// var done = this.exists( ".js-list-container" );
		this.test.assert( done, "Inbox Load success" );
		$Utils.capture( 'mbox/jy5_mbox.png' );
	})
})

//点击删除
casper.then(function(){
	//点击第五封信
	casper.click( x( $Utils.getModuleXpath('/div//tr[5]/td[1]') ) );
	casper.wait(100, function(){
		this.test.info( "Test delete mail..." );
		this.click( x( $Utils.getToolbarXpath('/div[3]') ) );

		//测试撤销
		this.wait( 600, function(){
			$MBOX.withdrawTest();
		})
	})
})


//点击举报
casper.then(function(){
	casper.click( x( $Utils.getModuleXpath('/div//tr[5]/td[1]') ) );
	casper.wait( 100, function(){
		this.test.info( "Test report mail..." );
		this.click( x( $Utils.getToolbarXpath('/div[4]') ) );
		this.wait( 600, function(){
			$MBOX.withdrawTest();
		})
	})
})

//标记为已读/未读
casper.then(function(){
	casper.click( x( $Utils.getModuleXpath( '//tr[5]//td[1]' ) ) );
	casper.wait( 800, function(){
		this.test.info( "Test mark mail..." );
		this.mouseEvent( "mousedown", x( $Utils.getToolbarXpath( '/div/div[contains(.,"标记为")]' ) ) );
		this.wait( 200, function(){
			$MBOX.assertDropMenu.apply( casper );

			var markUnreadXpath = $Utils.getToolbarDropMenu( '/div/div[1]' );
			this.click( x( markUnreadXpath ) );
			this.test.info( "Mark unread/read clicked." );

			$MBOX.withdrawTest();
		})
	})
})


//标为星标
casper.then(function(){
	casper.click( x( $Utils.getModuleXpath( '//tr[5]//td[1]' ) ) );
	casper.wait( 800, function(){
		this.test.info( "Test mark mail..." );
		this.mouseEvent( "mousedown", x( $Utils.getToolbarXpath( '/div/div[contains(.,"标记为")]' ) ) );
		this.wait( 200, function(){
			$MBOX.assertDropMenu.apply( casper );

			var markStarXpath = $Utils.getToolbarDropMenu( '/div/div[2]' );
			this.click( x( markStarXpath ) );
			this.test.info( "Mark star clicked." );

			$MBOX.withdrawTest();
		})
	})
})


//移动到
casper.then(function(){
	casper.click( x( $Utils.getModuleXpath( '//tr[5]//td[1]' ) ) );
	casper.wait( 800, function(){
		this.test.info( "Test move mail..." );
		this.mouseEvent( "mousedown", x( $Utils.getToolbarXpath( '/div/div[contains(.,"移动到")]' ) ) );
		this.wait( 200, function(){
			$MBOX.assertDropMenu.apply( casper );

			var movemailXpath = $Utils.getToolbarDropMenu( '/div/div[2]' );
			this.click( x( movemailXpath ) );
			this.test.info( "Move clicked." );

			$MBOX.withdrawTest();
		})
	})
})

// casper.then(function(){
// 	this.evaluate(function(){
// 		$MF.clearDestroyModules();
// 		$MF.clearUnusedModules();
// 	})
// })

//移动到 新建分类
// casper.then(function(){
// 	casper.click( x( $Utils.getModuleXpath( '//tr[5]//td[1]' ) ) );
// 	casper.wait( 800, function(){
// 		this.test.info( "Test move mail..." );
// 		this.mouseEvent( "mousedown", x( $Utils.getToolbarXpath( '/div/div[contains(.,"移动到")]' ) ) );
// 		this.wait( 200, function(){
// 			$MBOX.assertDropMenu.apply( casper );

// 			var movetoNewFolder = $Utils.getToolbarDropMenu( '/div[3]' );
// 			this.test.info( /*movetoNewFolder,*/ this.fetchText( x( movetoNewFolder )) );
// 			this.click( x( movetoNewFolder ) );
// 			this.test.info( "Create New Folder Clicked." );

// 			casper.wait(200, function(){
// 				$MBOX.assertDialog();
// 			})
// 			// $MBOX.withdrawTest();
// 		})
// 	})
// })

casper.run(function(){
	this.test.renderResults( true );
});