var $MID = {
	"translate": "51:1tbiMw5IMFEAFYRatgABso",
	"cc": "51:1tbiMwxIjFEAFYRRXQAAm3",
	"quickreply": "51:1tbiMwxIjFEAFYRRXQAAm3",
	"link": "51:1tbiMw5IMFEAFYRatgAAsp"
}

//从列表进入读信
casper.thenClick( x( $Utils.getMboxNavFolderXpath( $Folder.read.name ) ), function(){
	casper.waitForSelector({
		type: "xpath",
		path: $XPATH.LIST_CONTAINER_EXIST
	}, function(){
		$Utils.capture( "normal_list.png" );
	})
})

casper.thenClick( x ( $Utils.getXpathByMid( $MID.link ) ), function(){
	var readUrl = this.evaluate(function(){
		return location.protocol + "://" + location.host + "/jy5/xhr/msg/read.do?sid=" + $CONF.sid;
	})

	this.waitForResource( function( resource ){
		if( resource.url.indexOf( "xhr/msg/read.do" ) > -1 ){
			return true;
		}
		return false;
	}, function(){
		$Utils.capture( "read.png" );
	}, function(){
		this.test.error( "no read.do request." );
	})
});


casper.run(function(){
	this.test.renderResults( true, 0, this.cli.get( "o" ) || false );
});
