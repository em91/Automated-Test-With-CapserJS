/**
 * 适用于Mbox的一些方法封装，比如校验列表数据等
 * @type {Object}
 */
var $MBOX = {};

//校验列表UI
$MBOX.checkListUI = function(  ){
	//去页面context里取UD属性等，拼接请求URL
	var result = casper.evaluate(function(){
		var listUrl = "/jy5/xhr/list/list.do?sid=" + $CONF.sid;
		var param = {
			fid: $MF.getCurrentSettings().settings.fid, 
			start: 0,
			limit: $SDCache.getMaxList(),
			pageSize: $SDCache.getMaxList(),
			thread: $SDCache.isThread( $MF.getCurrentSettings().settings.fid )
		};
		return JSON.parse( __utils__.sendAJAX( listUrl, "POST", param, false ) );
	})

	var codeOk = result.code === "S_OK";
	if( !codeOk ){
		casper.test.error( "List not ok." + JSON.stringify( result ) );
		return;
	}

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
		return $( 'div[id^=module_mbox_] :visible .js-row' ).size();
	})

	//判断分页数、UI邮件数量是否相同
	var pageSizeOk = ( count === rowLength ) /*&& ( count === pageSize )*/;
	if( !pageSizeOk ){
		casper.test.error( "PageSize not match." )
	}
}

//封装，校验列表数据+撤销操作
$MBOX.withdrawTest = function( callback, withdraw ){
	if( typeof callback == "boolean"){
		withdraw = callback;
	}

	casper.wait( 1000, function(){
		//判断操作成功的提示是否存在
		var msgbox = x( $Utils.getMsgBoxSuccXpath() );
		var msg = this.exists( msgbox );
		casper.test.assert( msg, 'MsgBox: ' + this.fetchText( msgbox ) );

		$MBOX.checkListUI();

		if( withdraw === false ){
			callback && callback();
			return;
		}

		//点击撤销后校验UI
		var withdrawLink = x( $Utils.getWithDrawXpath() );
		if( casper.exists( withdrawLink ) ){
			casper.click( x( $Utils.getWithDrawXpath() ) );
			casper.test.info( "Click withdraw" );
			casper.wait(1500, function(){
				$MBOX.checkListUI();
				callback && callback();
			})
		} else {
			casper.test.info( 'no withdraw operation' );
		}
	})
}

//点击标记为，下拉菜单截图
$MBOX.assertDropMenu = function(){
	var menuListXpath = $Utils.getToolbarXpath( '/div[contains(@class,"m-lst")][contains(@class, "open")]' );
	casper.test.assert( casper.exists( x( menuListXpath ) ), 'Dropmenu Ok' );
}

//校验弹框是否显示中
$MBOX.assertDialog = function(){
	var dialogXpath = '//div[contains(@class,"js-w-dialogbox")][contains(@style,"display: block")]';
	casper.test.assert( casper.exists( x( dialogXpath ) ), 'Dialog Ok' );
}

//获取第五封信的可点击checkbox
$MBOX.getCheckBox = function(){
	return x( $Utils.getModuleXpath('/div//table[1]//td[1]/div/div') );
}

//校验某个文件夹是否在侧边栏存在
$MBOX.assertFolder = function( name ){
	var folderXpath = $Utils.getMboxNavXpath() + "//span[contains(@class, 'js-name')][contains(., " + name + ")]";
	casper.test.assert( casper.exists( x( folderXpath ) ), "Folder " + name + " exists." );
}



/**
 * 通用的选择器枚举
 * @type {Object}
 */
var $SELECTOR = {};
$SELECTOR.LOGIN_PAGE_FORM = "form#login163";
$SELECTOR.LOGIN_OK_BTN = "#loginBtn";
$SELECTOR.MBOXNAV_FOLDER_1 = '#folder_1 .js-label';


/**
 * 通用的xpath枚举
 * @type {Object}
 */
var $XPATH = {};
$XPATH.LIST_CONTAINER_EXIST = $Utils.getModuleXpath('//div[contains(@class, "js-list-container")]');
$XPATH.TOOLBAR_MARK_BUTTON = $Utils.getToolbarXpath( '/div[contains(.,"标记为")]' );
$XPATH.TOOLBAR_MOVETO_BUTTON = $Utils.getToolbarXpath( '/div[contains(.,"移动到")]' );
$XPATH.TOOLBAR_MARK_READ_UNREAD_MENU = $Utils.getToolbarDropMenu( '/div/div[1]' );
$XPATH.TOOLBAR_MARK_STAR_UNSTAR_MENU = $Utils.getToolbarDropMenu( '/div/div[2]' );
$XPATH.TOOLBAR_MOVETO_FOLDER_2_MENU = $Utils.getToolbarDropMenu( '/div/div[2]' );
$XPATH.TOOLBAR_REPORT_BUTTON = $Utils.getToolbarXpath( '/div[contains(., "举报")]' );
$XPATH.TOOLBAR_DELETE_BUTTON = $Utils.getToolbarXpath( '/div[contains(., "删除")]' );
$XPATH.TOOLBAR_MORE_BUTTON = $Utils.getToolbarXpath( '/div[contains(., "更多")]' );
$XPATH.TOOLBAR_CALENDAR = $Utils.getToolbarXpath( '//a[contains(@class, "js-datepicker")]' );
$XPATH.TOOLBAR_PAGER = $Utils.getToolbarXpath( '/div[@class="page js-widget"]' );
$XPATH.TOOLBAR_PAGER_NEXT = $Utils.getToolbarXpath( '/div[@class="m-page f-fr"]' );
$XPATH.TOOLBAR_POPICON = $Utils.getToolbarXpath( '/a[@class="w-icon-skin  ico-i i js-widget"]' );
$XPATH.LIST_EMPTY = $Utils.getModuleXpath( '//div[@class="m-emp-tlst"]' );
$XPATH.TOOLBAR_GUIDE = $Utils.getToolbarXpath( '/div[contains(@class, "guide")]');
$XPATH.PAGER_BOTTOM = $Utils.getModuleXpath( '//div[@class="p-mx-pagectrl"]//div[contains(@class,"js-cmds")]/div[not(@style)]' );


/**
 * 测试帐号的文件夹命名规则，以便对应到测试用例
 * @type {Object}
 */
var $Folder = {
	"normal": {
		name: "【可写】供移动测试",
		check: [ $XPATH.TOOLBAR_DELETE_BUTTON, $XPATH.TOOLBAR_REPORT_BUTTON, $XPATH.TOOLBAR_MARK_BUTTON, $XPATH.TOOLBAR_MOVETO_BUTTON, $XPATH.TOOLBAR_MORE_BUTTON ],
		always: [ $XPATH.TOOLBAR_PAGER, $XPATH.TOOLBAR_PAGER_NEXT, $XPATH.TOOLBAR_CALENDAR ],
		none: [ $XPATH.TOOLBAR_GUIDE ]
	},

	"draft": {
		name: "草稿箱",
		check: [  $XPATH.TOOLBAR_DELETE_BUTTON, $XPATH.TOOLBAR_MARK_BUTTON ],
		always: [ $XPATH.TOOLBAR_PAGER, $XPATH.TOOLBAR_PAGER_NEXT, $XPATH.TOOLBAR_CALENDAR ],
		none: [ $XPATH.TOOLBAR_GUIDE ]
	},

	"pop": {
		name: "em91beta@163.com",
		check: [ $XPATH.TOOLBAR_POPICON, $XPATH.TOOLBAR_DELETE_BUTTON, $XPATH.TOOLBAR_REPORT_BUTTON, $XPATH.TOOLBAR_MARK_BUTTON, $XPATH.TOOLBAR_MOVETO_BUTTON, $XPATH.TOOLBAR_MORE_BUTTON ],
		always: [ $XPATH.TOOLBAR_POPICON, $XPATH.TOOLBAR_PAGER, $XPATH.TOOLBAR_PAGER_NEXT, $XPATH.TOOLBAR_CALENDAR ],
		none: [ $XPATH.TOOLBAR_GUIDE ]
	},

	"empty": {
		name: "【只读】 空文件夹",
		check: [],
		none: [],
		always: [ $XPATH.LIST_EMPTY ]
	},

	"unread": {
		name: "【只读】 未读文件夹"	,
		check: [],
		none: [],
		always: []
	},

	"onepage": {
		name: "【只读】一页邮件",
		check: [ $XPATH.TOOLBAR_DELETE_BUTTON, $XPATH.TOOLBAR_REPORT_BUTTON, $XPATH.TOOLBAR_MARK_BUTTON, $XPATH.TOOLBAR_MOVETO_BUTTON, $XPATH.TOOLBAR_MORE_BUTTON ],
		always: [ $XPATH.TOOLBAR_PAGER, $XPATH.TOOLBAR_PAGER_NEXT, $XPATH.TOOLBAR_CALENDAR ],
		none: [ $XPATH.TOOLBAR_GUIDE ],
		notexist: [ $XPATH.PAGER_BOTTOM ]
	}
}




//切换到本地开发环境
// casper.then(function(){
// 	var url = this.evaluate(function(){
// 		return "http://g6a52.mail.163.com/jy5/main.jsp?sid=" + $CONF.sid + "#module=welcome";
// 	})
// 	casper.echo( url );;
// 	casper.thenOpen( url );
// })

var _folderIndex = 0;
var _folderArr = [];
for( folder in $Folder ){
	_folderArr.push( folder );
}

//检查各文件夹下，选中右键和未选中右键表现正常
casper.repeat(_folderArr.length, function(){
	var folder = $Folder[ _folderArr[ _folderIndex ] ];
	casper.click( x( $Utils.getMboxNavFolderXpath( folder.name ) ) ); 
	casper.waitForSelector({
		type: "xpath",
		path: $XPATH.LIST_CONTAINER_EXIST
	}, function(){
		//未选中状态，检查always和none是否正常
		var noneOk = $Utils.checkXpathGroup( folder.always.concat( folder.none ) );
		casper.test.assert( noneOk, folder.name + " nocheck ok." );

		//如果文件夹有不能存在的xpath，也进行检查
		if( folder.notexist && folder.notexist.length > 0 ){
			var notExistOk = $Utils.checkXpathGroupNotExist( folder.notexist );
			casper.test.assert( notExistOk, folder.name + " not exist ok " )
		}

		var checkbox = $MBOX.getCheckBox();
		if( !casper.exists(checkbox) ){
			casper.test.info( "no mail." );
			_folderIndex++;
			return;
		}

		//选中后的xpath检查
		this.click( $MBOX.getCheckBox() );
		casper.wait(500, function(){
			var checkOk = $Utils.checkXpathGroup( folder.always.concat( folder.check ) );
			casper.test.assert(checkOk, folder.name + " check ok.");
			_folderIndex++;
		});
	});
})


casper.thenClick( x( $Utils.getMboxNavFolderXpath( $Folder.normal.name ) ), function(){
	this.click( $MBOX.getCheckBox() );
	this.wait(100, function(){
		var ok = $Utils.checkXpathGroup([
			$XPATH.TOOLBAR_DELETE_BUTTON,
			$XPATH.TOOLBAR_MARK_BUTTON,
			$XPATH.TOOLBAR_REPORT_BUTTON,
			$XPATH.TOOLBAR_MORE_BUTTON,
			$XPATH.TOOLBAR_MOVETO_BUTTON
		]);

		this.test.assert( ok, "Toolbar OK." );
	})
});



//点击删除
casper.then(function(){
	//点击第五封信
	casper.click( $MBOX.getCheckBox() );
	casper.wait(100, function(){
		this.test.info( "Test delete mail..." );
		$Utils.capture( "WOW.PNG" );
		this.click( x( $XPATH.TOOLBAR_DELETE_BUTTON ) );

		//测试撤销
		this.wait( 600, function(){
			$MBOX.withdrawTest();
		})
	})
})


//点击举报
casper.then(function(){
	casper.click( $MBOX.getCheckBox() );
	casper.wait( 100, function(){
		this.test.info( "Test report mail..." );
		this.click( x( $XPATH.TOOLBAR_REPORT_BUTTON ) );
		this.wait( 600, function(){
			$MBOX.withdrawTest();
		})
	})
})

//标记为已读/未读
casper.then(function(){
	casper.click( $MBOX.getCheckBox() );
	casper.wait( 800, function(){
		this.test.info( "Test mark mail..." );
		this.mouseEvent( "mousedown", x( $XPATH.TOOLBAR_MARK_BUTTON ) );
		this.wait( 200, function(){
			$MBOX.assertDropMenu.apply( casper );

			var markUnreadXpath = $XPATH.TOOLBAR_MARK_READ_UNREAD_MENU;
			this.click( x( markUnreadXpath ) );
			this.test.info( "Mark unread/read clicked." );

			$MBOX.withdrawTest();
		})
	})
})


//标为星标
casper.then(function(){
	casper.click( $MBOX.getCheckBox() );
	casper.wait( 800, function(){
		this.test.info( "Test mark mail..." );
		this.mouseEvent( "mousedown", x( $XPATH.TOOLBAR_MARK_BUTTON ) );
		this.wait( 200, function(){
			$MBOX.assertDropMenu.apply( casper );

			var markStarXpath = $XPATH.TOOLBAR_MARK_STAR_UNSTAR_MENU;
			this.click( x( markStarXpath ) );
			this.test.info( "Mark star clicked." );

			$MBOX.withdrawTest();
		})
	})
})


//移动到
casper.then(function(){
	casper.click( $MBOX.getCheckBox() );
	casper.wait( 800, function(){
		this.test.info( "Test move mail..." );
		this.mouseEvent( "mousedown", x( $XPATH.TOOLBAR_MOVETO_BUTTON ) );
		this.wait( 200, function(){
			$MBOX.assertDropMenu.apply( casper );

			var movemailXpath = $XPATH.TOOLBAR_MOVETO_FOLDER_2_MENU;
			this.click( x( movemailXpath ) );
			this.test.info( "Move clicked." );

			$MBOX.withdrawTest();
		})
	})
})

//移动到 新建分类
casper.then(function(){
	casper.click( $MBOX.getCheckBox() );
	casper.wait( 800, function(){
		this.test.info( "Test move mail..." );
		this.mouseEvent( "mousedown", x( $Utils.getToolbarXpath( '/div/div[contains(.,"移动到")]' ) ) );
		this.wait( 200, function(){
			$MBOX.assertDropMenu.apply( casper );

			var movetoNewFolder = $Utils.getToolbarDropMenu( '/div[3]//a' );

			var exist = this.exists({
				type: "xpath",
				path: movetoNewFolder
			})

			if( !exist ){
				this.test.error( "move to new folder menu not exists" );
			} else {
				// this.test.info( /*movetoNewFolder,*/ this.fetchText( x( movetoNewFolder )) );
				this.click( x( movetoNewFolder ) );
				this.test.info( "Create New Folder Clicked." );

				casper.wait( 200, function(){
					$MBOX.assertDialog();
					var folderName = this.evaluate(function(){
						var name = "casper_" + new Date().getTime();
						$( '.js-w-dialogbox' ).filter( ':visible' ).find('input').val( name );
						// $( '.w-btn-submit' ).filter( ':visible' ).click();
						return name;
					})

					var submitBtn = $Utils.getWidgetDialogXpath() + "//div[contains(@class, 'w-btn-submit')]";
					this.click( x( submitBtn ) );
					this.wait( 1800, function(){
						$MBOX.assertFolder( folderName );
					})
				})
			}
		})
	})
})

//验证列表数据是否正常，接下来进入读信测试
casper.then(function(){
	$MBOX.withdrawTest( false );
})

casper.run(function(){
	this.test.renderResults( true );
});