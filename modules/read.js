var $MODULE = "read";
var $READ = {};

$READ.checkUI = function(){

}

//从列表进入读信
casper.thenClick( x( $Utils.getMboxNavFolderXpath( $Folder.normal.name ) ), function(){
	$Utils.capture( "normal_list.png" );
})

casper.run(function(){
	this.test.renderResults( true, 0, this.cli.get( "o" ) || false );
});