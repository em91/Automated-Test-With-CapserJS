casper.test.begin("Test Read Module", {
	mails: [],

	/**
	 * 发送一些邮件测试用例
	 * @param  {Object} test 
	 * @return {void}      
	 */
	setUp: function( test ){
		$Login();

		//发信
		casper.then(function(){
			var subject = $Utils.send( $DATA.COMPOSE );
			$GLOBAL.mails = subject;
			this.test.info( "mails sent." );

			//发送完毕后点击收信
			casper.evaluate(function(){
				$( '.js-receive' ).click();
			})
		})
	},


	/**
	 * 测试完毕需要删除发送的邮件
	 * @param  {Object} test 
	 * @return {void}      
	 */
	tearDown: function( test ){
		$Utils.deleteMailBySubject( $GLOBAL.mails );
	},


	/**
	 * 功能测试逻辑
	 * @param  {Object} test 
	 * @return {void}      
	 */
	test: function( test ){
		var that = this;
		casper.wait( 2000, function(){
			that.testNormal();
			that.testLinks();
		});
		this.done();
	},

	/**
	 * 进入收件箱
	 * @return {void} 
	 */
	goInbox: function( ){
		//从列表进入读信
		casper.thenClick( x( $Utils.getMboxNavFolderXpath( $Folder.inbox.name ) ), function(){
			casper.test.comment( "go Inbox..." );
			casper.waitForSelector({
				type: "xpath",
				path: $XPATH.LIST_CONTAINER_EXIST
			}, function(){
				$Utils.capture( "normal_list.png" );
			})
		})
	},

	/**
	 * 测试基本的读信功能
	 * @return {void} 
	 */
	testNormal: function( ){
		var that = this;
		that.goInbox();
		casper.thenClick( x ( $Utils.getXpathBySubject( $GLOBAL.mails.normal ) ), function(){
			casper.test.comment( "Test Normal Read..." );
			var readUrl = this.evaluate(function(){
				return location.protocol + "://" + location.host + "/jy5/xhr/msg/read.do?sid=" + $CONF.sid;
			})

			//等待读信请求返回后继续处理
			this.waitForResource( function( resource ){
				if( resource.url.indexOf( "xhr/msg/read.do" ) > -1 ){
					return true;
				}
				return false;
			}, function(){
				casper.test.assert( true, "read.do requested." )

				//查看工具栏是否正常
				var isToolbarOk = $Utils.checkXpathGroup([ $XPATH.TOOLBAR_BACK_BUTTON, $XPATH.TOOLBAR_DELETE_BUTTON,
					$XPATH.TOOLBAR_REPORT_BUTTON, $XPATH.TOOLBAR_FORWARD_BUTTON, $XPATH.TOOLBAR_REPLY_BUTTON, 
					$XPATH.TOOLBAR_MOVETO_BUTTON, $XPATH.TOOLBAR_MORE_BUTTON ])

				casper.test.assert( isToolbarOk, "Toolbar OK." );

				//快捷回复是否正常
				casper.test.assertExists( x( $XPATH.READ_QUICKREPLY ), "Quickreply OK." );

				that.testBackButton();
				that.testDeleteButton();
				that.testReportButton();
				that.testMoveTo();
				that.testQuickReply();
				that.testHoverMenu();
				that.testCollapse();
			}, function(){
				casper.test.error( "no read.do request." );
			})
		});
	},

	/**
	 * 测试返回按钮，返回列表页面
	 * @return {void} 
	 */
	testBackButton: function(){
		casper.thenClick( x( $XPATH.TOOLBAR_BACK_BUTTON ), function(){
			casper.test.comment( "Test Back Button..." );
			this.waitForSelector({
				type: "xpath",
				path: $XPATH.LIST_CONTAINER_EXIST
			}, function(){
				$Utils.capture( "goback.png" );
				$MBOX.checkListUI();
				casper.click( x ( $Utils.getXpathBySubject( $GLOBAL.mails.normal ) ) );
			})
		})
	},

	/**
	 * 测试删除按钮，返回到列表
	 * @return {void} 
	 */
	testDeleteButton: function(){
		casper.wait( 200, function(){
			casper.test.comment( "Test Delete Button..." );
			casper.click( x( $XPATH.TOOLBAR_DELETE_BUTTON ) );
			$Utils.capture( "BeforeDelete.png" );
			casper.waitForSelector({
				type: "xpath",
				path: $XPATH.LIST_CONTAINER_EXIST
			}, function(){
				$Utils.capture( "AfterDelete.png" );
				$MBOX.withdrawTest(function(){
					$Utils.capture( "AfterWithDrawDelete.png" );
					casper.click( x ( $Utils.getXpathBySubject( $GLOBAL.mails.normal ) ) );
				});
			})
		})
	},

	/**
	 * 测试举报按钮，返回到列表
	 * @return {void}
	 */
	testReportButton: function(){
		casper.wait( 200, function(){
			$Utils.capture( "BeforeReport.png" );
			casper.test.comment( "Test Report Button..." );
			casper.click( x( $XPATH.TOOLBAR_REPORT_BUTTON ) );
			casper.waitForSelector({
				type: "xpath",
				path: $XPATH.LIST_CONTAINER_EXIST
			}, function(){
				var mids = $Utils.getMidBySubject( $GLOBAL.mails.normal );

				var inJunk = false;
				for( var i = 0, l = mids.length; i < l; i++ ){
					var msg = $READ.getMailContent( mids[i] );
					if( msg.data.curMsg.fid == 5 ){
						inJunk = true;
						break;
					}
				}
				this.test.assert( inJunk, "Report Success." );

				$Utils.capture( "AfterReport.png" );
				$MBOX.withdrawTest(function(){
					$Utils.capture( "AfterWithDrawReport.png" );
					casper.click( x ( $Utils.getXpathBySubject( $GLOBAL.mails.normal ) ) );
				});
			})
		})
	},

	/**
	 * 测试移动到功能，返回到列表
	 * @return {void} 
	 */
	testMoveTo: function(){
		casper.wait( 200, function(){
			$Utils.capture( "BeforeMoveTo.png" );
			casper.test.comment( "Test MoveTo..." );
			casper.click( x( $XPATH.TOOLBAR_MOVETO_BUTTON ) );
			this.wait( 200, function(){
				$Utils.assertDropMenu.apply( casper );

				var movemailXpath = $XPATH.TOOLBAR_MOVETO_FOLDER_2_MENU;
				this.click( x( movemailXpath ) );
				this.test.info( "Move clicked." );

				casper.waitForSelector({
					type: "xpath",
					path: $XPATH.LIST_CONTAINER_EXIST
				}, function(){
					$Utils.capture( "AfterMoveTo.png" );
					$MBOX.withdrawTest(function(){
						$Utils.capture( "AfterWithDrawReport.png" );
						casper.click( x ( $Utils.getXpathBySubject( $GLOBAL.mails.normal ) ) );
					});
				})

			})
		});
	},


	/**
	 * 测试快捷回复的功能
	 * @return {void} 
	 */
	testQuickReply: function(){
		casper.wait( 200, function(){
			casper.test.comment( "Test Quickreply..." );
			casper.evaluate(function(){
				$(".js-quickReply").filter(":visible").trigger("mouseenter");
				$("textarea").filter(":visible").focus()
			})
			casper.wait(500, function(){
				$Utils.capture( "QuickReplyClick.png" );
				casper.waitForSelector({
					type: "xpath",
					path: $XPATH.READ_QUICKREPLY_BUTTONS
				}, function(){
					$Utils.capture( "QuickReplyFocus.png" );

					//测试textarea的初始高度对不对
					var height = casper.evaluate(function(){
						return $("textarea").filter(":visible").height();
					})
					casper.test.assertEqual( height, 100, "Quickreply Textarea OK." );

					//填写内容
					casper.sendKeys({
						type: "xpath",
						path: $XPATH.READ_QUICKREPLY_TEXTAREA
					}, $DATA.COMPOSE.quickReply);

					$Utils.capture( "QuickReplyFill.png" );

					casper.click( x( $XPATH.READ_QUICKREPLY_BUTTON_OK ) );
					casper.waitForResource( function( resource ){
						if( resource.url.indexOf( "xhr/compose/compose.do" ) > -1 ){
							return true;
						}
						return false;
					}, function(){
						casper.test.assert( true, "compose.do requested." )
						casper.wait( 1000, function(){
							$Utils.capture( "QuickReplyDone.png" );

							//发送完毕，输入框应当收起
							var height = casper.evaluate(function(){
								return $("textarea").filter(":visible").height();
							})
							casper.test.assertEqual( height, 20, "Quickreply Send Done, Textarea OK." );

							//并且有发送成功的提示
							this.test.assertEqual(this.fetchText("#js-msgbox-tip"), "邮件发送成功!", "QuickReply Tip OK");
						})
						
					}, function(){
						casper.test.error( "no compose.do request." );
					})
				})
			})
		})
	},

	/**
	 * 测试联系人浮层是否正常
	 * @return {void} 
	 */
	testHoverMenu: function(){
		$Utils.capture( "BeforeTestHoverMenu.png" );

		// @issue casper的mouseEvent不好使
		// casper.mouseEvent("mouseover", {
		// 	type: "xpath",
		// 	path: $XPATH.READ_HOVERMENU_TRIGGER
		// });

		// casper.echo( casper.fetchText( x( $XPATH.READ_HOVERMENU_TRIGGER ) ) );
		// casper.wait(100, function(){
		// 	casper.mouseEvent("mouseover", {
		// 		type: "xpath",
		// 		path: $XPATH.READ_SIMPLE_SENDER
		// 	});
		// });

		// casper.echo( casper.fetchText( x( $XPATH.READ_SIMPLE_SENDER ) ) );

		var sender = casper.evaluate(function(){
			$(".js-clickbar").trigger("mouseover");
			setTimeout(function(){
				$(".js-sender").trigger("mouseover");
			},10)
			return $(".js-sender").attr( "d" );
		})

		casper.wait(600, function(){
			$Utils.capture("hovermenu.png");
			$Utils.assertContactHoverMenu( sender );

			var avatar = casper.evaluate(function(){
				$(".js-self-avatar").trigger("mouseover");
				return $(".js-self-avatar").attr( "d" );
			})

			casper.wait(600, function(){
				$Utils.capture("hovermenu.png");
				$Utils.assertContactHoverMenu( avatar );
			})
		})		
	},

	/**
	 * 测试精简模式和详细模块的展开折叠
	 * @return {void} 
	 */
	testCollapse: function(){
		casper.click( x( $XPATH.READ_MODE_FULL ) );
		casper.test.assertExists({
			type: "xpath",
			path: $XPATH.READ_MODE_INFO_FULL
		}, "Switch to Full Mode OK.");

		casper.click( x( $XPATH.READ_MODE_SIMPLE ) );
		casper.test.assertExists({
			type: "xpath",
			path: $XPATH.READ_MODE_INFO_SIMPLE
		}, "Switch to Simple Mode OK.");
	},

	/**
	 * 测试读信里的链接识别和响应
	 * @return {void} 
	 */
	testLinks: function(){
		var that = this;
		that.goInbox();
		casper.thenClick( x ( $Utils.getXpathBySubject( $GLOBAL.mails.links ) ), function(){
			//等待读信请求返回后继续处理
			this.waitForResource( function( resource ){
				if( resource.url.indexOf( "xhr/msg/read.do" ) > -1 ){
					return true;
				}
				return false;
			}, function(){
				this.waitForSelector({
					type: "xpath",
					path: $XPATH.READ_QUICKREPLY
				}, function(){
					//因为读信的事件有些是延迟绑定的，因此做下延迟以保证所有的JS已经执行完毕
					this.wait(1000, function(){
						$Utils.capture( "links.png" );
						that.testIdentifyLink();
						that.testClickLink();
						that.testPostCard();
					})
				})
			}, function(){
				casper.test.error( "no read.do request." );
			})
		});
	},

	/**
	 * 测试智能识别
	 * @return {void} 
	 */
	testIdentifyLink: function(){
		var html = casper.evaluate(function(){
			return $( $( "iframe.js-mail-content" ).filter( ":visible" )[0].contentWindow.document.body ).html()
		})
		casper.test.assertEqual( html, $DATA.READ.links );
	},

	/**
	 * 测试链接点击
	 * @return {void} 
	 */
	testClickLink: function(){
		// @issue https://github.com/em91/Automated-Test-With-CapserJS/issues/1
		// 由于当前JY的处理是在邮件append到页面后就替换了a标签的target，所以这个步骤可以省略，由testIdentifyLink代替
		// casper.evaluate(function(){
		// 	$( $( "iframe.js-mail-content" ).filter( ":visible" )[0].contentWindow.document.body ).find( "#js-open-newwindow" ).click();
		// })


		// casper.wait(2000, function(){
		// 	this.echo( JSON.stringify( casper.popups ) );
		// 	$Utils.capture( "click.png" );
		// })
	},

	/**
	 * 测试明信片点击
	 * @return {void} 
	 */
	testPostCard: function(){
		return;

		//@todo 这部分测试在线上走不通，会有JS error，等待下次修复上线
		casper.evaluate(function(){
			$( $( "iframe.js-mail-content" ).filter( ":visible" )[0].contentWindow.document.body ).find( "#read_postcard" ).click();
		})

		casper.waitFor(function(){
			return this.evaluate(function(){
				return location.hash === "#module=postcard";
			})
		}, function then(){
			this.test.info( "PostCard Link OK." )
		}, function timeout(){
			this.test.error( "PostCard Link Fail." );
		})
	},

	done: function(){
		casper.run(function(){
			this.test.done();
			this.test.renderResults( true, 0, this.cli.get( "o" ) || false );
		});
	}
});