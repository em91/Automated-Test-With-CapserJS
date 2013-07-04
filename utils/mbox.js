/**
 * 适用于Mbox的一些方法封装，比如校验列表数据等
 * @type {Object}
 */
var $MODULE = "mbox";
var $MBOX = {};

//校验列表UI
$MBOX.checkListUI = function(){
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
			path: $Utils.getCheckBoxXpathByMid( list[i].mid )
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
			casper.click( withdrawLink );
			casper.test.comment( "Click withdraw" );
			casper.wait(1500, function(){
				var msgbox = x( $Utils.getMsgBoxSuccXpath() );
				var msg = this.exists( msgbox );
				casper.test.assert( msg, 'MsgBox: ' + this.fetchText( msgbox ) );

				$MBOX.checkListUI();
				callback && callback();
			})
		} else {
			casper.test.info( 'no withdraw operation' );
		}
	})
}



//获取第五封信的可点击checkbox
$MBOX.getCheckBox = function(){
	return x( $Utils.getModuleXpath('/div//table[1]//td[1]/div/div') );
}