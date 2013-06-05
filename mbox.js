var casper = require( "casper" ).create();
var x = require( "casper" ).selectXPath;
var clientutils;

var username = "xx",
	password = "xx";

casper.userAgent('Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36');


//页面出现JS错误
casper.on( "page.error", function( msg, trace ) {
    this.echo( "Error: " + msg, "ERROR" );
});

//登录流程 - 输入用户名、密码
casper.start( 'http://mail.163.com', function(){
	//设置分辨率
	casper.viewport( 1280, 1024 );
	this.test.info( "filling in username and password..." );
	this.fill( 'form#login163', {
		username: username, 
		password: password
	});
})


//登录流程 - 点击登录
casper.then(function(){
	this.click( '#loginBtn' );
	this.test.info( "login in..." );
})


//检测是否登录成功，截图欢迎页面
casper.waitFor(function check(){
	return this.evaluate(function(){
		return location.href.indexOf( "jy5" ) > -1;
	})
}, function then(){
	this.test.assertUrlMatch( /^http:\/\/[tc]*webmail.mail.163.com\/jy5\/main\.jsp\?sid=/, 'login success.' );
	this.capture( 'mbox/welcome.png' );
})

//点击侧边栏收件箱，等待100ms后截图收件箱
casper.thenClick( '#folder_1 .js-label', function(){
	casper.wait( 100, function(){
		var done = this.exists( ".js-list-container" );
		this.test.assert( done, "inbox load success" );
		this.capture( 'mbox/jy5_mbox.png' );
	})
})


//校验UI上的邮件列表和数据是否一致
var checkListUI = function(){
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
	casper.test.assert( codeOk, "get list S_OK" )

	list = result.data;
	var count = 0;

	//判断服务端取到的数据在UI上是否都存在
	for( var i = 0, l = list.length; i < l; i++ ){
		var isExist = casper.exists({
			type: 'xpath',
			path: '//div[starts-with(@id, "module")][@style!="display: none;"]//div[@mid="' + list[i].mid + '"]'
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
	casper.test.assert( pageSizeOk, "check pagesize:" + count + "," + rowLength );
}


//撤销测试
var withdrawTest = function( callback ){
	casper.wait(500, function(){
		var msgXpath = '/html/body/div/div/div/div[2]/div[2]/div[2]/span';

		//判断操作成功的提示是否存在
		var msg = this.exists( x( msgXpath ) );
		casper.test.assert( msg, 'tip ok.' );
		checkListUI();

		//点击撤销后校验UI
		casper.click( "#js-msgbox-tip span a" );
		casper.test.info( "click withdraw" );
		casper.wait(1000, function(){
			checkListUI();
			callback && callback();
		})
	})
}


//点击标记为，下拉菜单截图
var clickMarkAs = function(){
	var menuListXpath = '//div[starts-with(@id, "module")][@style!="display: none;"]//div[@class="m-buttons f-cb js-toolbar js-widget"]/div[contains(@class,"m-lst")]/div/div';
	this.test.assert( this.exists( x( menuListXpath ) ), 'test dropmenu' )
	this.capture( "mbox/jy5_mbox_mark.png" );
}

//点击删除
casper.repeat(1, function(){
	casper.click( x( '//div[starts-with(@id, "module")][@style!="display: none;"]/div//tr[5]/td[1]' ) );
	casper.wait(100, function(){
		this.test.info( "test delete mail and validate ui..." );
		this.click( x( '//div[starts-with(@id, "module")][@style!="display: none;"]//div[@class="m-buttons f-cb js-toolbar js-widget"]/div[3]' ) );

		//测试撤销
		this.wait( 600, function(){
			withdrawTest();
		})
	})
})


//点击举报
casper.repeat(1, function(){
	casper.click( x( '//div[starts-with(@id, "module")][@style!="display: none;"]/div//tr[5]/td[1]' ) );
	casper.wait( 100, function(){
		this.test.info( "test report mail and validate ui..." );
		this.click( x( '//div[starts-with(@id, "module")][@style!="display: none;"]//div[@class="m-buttons f-cb js-toolbar js-widget"]/div[4]' ) );
		this.wait( 600, function(){
			withdrawTest();
		})
	})
})


//清理一下
casper.then(function(){
	this.capture("mbox/jy5_before_mark.png");
	this.evaluate(function(){
		$MF.clearDestroyModules();
		$MF.clearUnusedModules();
	})
})


//标记为已读/未读
casper.then(function(){
	casper.click( x( '//div[starts-with(@id, "module")][@style!="display: none;"]//tr[5]//td[1]' ) );
	casper.wait( 800, function(){
		this.test.info( "test mark mail and validate ui..." );
		this.mouseEvent( "mousedown", x( '//div[starts-with(@id, "module")][@style!="display: none;"]//div[@class="m-buttons f-cb js-toolbar js-widget"]/div/div[contains(.,"标记为")]' ) );
		this.wait( 200, function(){
			clickMarkAs.apply( casper );

			var markUnreadXpath = '//div[starts-with(@id, "module")][@style!="display: none;"]//div[@class="m-buttons f-cb js-toolbar js-widget"]/div[contains(@class,"m-lst")]/div/div[1]';
			this.click( x( markUnreadXpath ) );
			this.test.info( "mark unread/read clicked." );
		})
	})
})


//标为星标
casper.then(function(){
	casper.click( x( '//div[starts-with(@id, "module")][@style!="display: none;"]//tr[5]//td[1]' ) );
	casper.wait( 800, function(){
		this.test.info( "test mark mail and validate ui..." );
		this.mouseEvent( "mousedown", x( '//div[starts-with(@id, "module")][@style!="display: none;"]//div[@class="m-buttons f-cb js-toolbar js-widget"]/div/div[contains(.,"标记为")]' ) );
		this.wait( 200, function(){
			clickMarkAs.apply( casper );

			var markStarXpath = '//div[starts-with(@id, "module")][@style!="display: none;"]//div[@class="m-buttons f-cb js-toolbar js-widget"]/div[contains(@class,"m-lst")]/div/div[2]';
			this.click( x( markStarXpath ) );
			this.test.info( "mark star clicked." );

			withdrawTest();
		})
	})
})

casper.run(function(){
	this.test.renderResults( true );
});