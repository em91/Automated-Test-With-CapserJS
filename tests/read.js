casper.test.begin("Test Read Module", 3, {
	mails: [],
	setUp: function( test ){
		$Login();

		//发信
		casper.then(function(){
			var subject = $Utils.send( $ComposeTestCase.read );
			$GLOBAL.mails = subject;
			this.test.info( "mails sent." );

			//发送完毕后点击收信
			casper.evaluate(function(){
				$( '.js-receive' ).click();
			})
		})
	},

	tearDown: function( test ){
		$Utils.deleteMailBySubject( $GLOBAL.mails );
	},

	test: function( test ){
		var that = this;
		casper.wait( 2000, function(){
			that.goInbox();
			that.testNormal();
		});
		this.done();
	},

	goInbox: function( ){
		//从列表进入读信
		casper.thenClick( x( $Utils.getMboxNavFolderXpath( $Folder.inbox.name ) ), function(){
			casper.waitForSelector({
				type: "xpath",
				path: $XPATH.LIST_CONTAINER_EXIST
			}, function(){
				$Utils.capture( "normal_list.png" );
			})
		})
	},

	testNormal: function( ){
		casper.thenClick( x ( $Utils.getXpathBySubject( $GLOBAL.mails.normal ) ), function(){
			var readUrl = this.evaluate(function(){
				return location.protocol + "://" + location.host + "/jy5/xhr/msg/read.do?sid=" + $CONF.sid;
			})

			this.waitForResource( function( resource ){
				if( resource.url.indexOf( "xhr/msg/read.do" ) > -1 ){
					return true;
				}
				return false;
			}, function(){
				casper.test.assert( true, "read.do requested." )

				var isToolbarOk = $Utils.checkXpathGroup([ $XPATH.TOOLBAR_BACK_BUTTON, $XPATH.TOOLBAR_DELETE_BUTTON,
					$XPATH.TOOLBAR_REPORT_BUTTON, $XPATH.TOOLBAR_FORWARD_BUTTON, $XPATH.TOOLBAR_REPLY_BUTTON, 
					$XPATH.TOOLBAR_MOVETO_BUTTON, $XPATH.TOOLBAR_MORE_BUTTON ])

				casper.test.assert( isToolbarOk, "Toolbar OK." );
				casper.test.assertExists( x( $XPATH.READ_QUICKREPLY ), "Quickreply OK." );

			}, function(){
				casper.test.error( "no read.do request." );
			})
		});
	},

	done: function(){
		casper.run(function(){
			this.test.done();
			this.test.renderResults( true, 0, this.cli.get( "o" ) || false );
		});
	}
});