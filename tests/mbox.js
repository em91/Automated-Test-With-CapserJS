
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
		this.test.comment( "Test delete mail..." );
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
		this.test.comment( "Test report mail..." );
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
		this.test.comment( "Test mark mail..." );
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
		this.test.comment( "Test mark mail..." );
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
		this.test.comment( "Test move mail..." );
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
		this.test.comment( "Test move mail..." );
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
	this.test.renderResults( true, 0, this.cli.get( "o" ) || false );
});