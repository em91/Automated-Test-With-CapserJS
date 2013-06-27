var $Login = function(){
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
		$Utils.capture( 'welcome.png' );
	})
}