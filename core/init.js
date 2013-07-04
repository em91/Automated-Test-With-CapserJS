casper.userAgent('Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36');

//404和500
casper.on('http.status.404', function( resource ) {
    casper.test.error( '404: ' + resource.url );
});

casper.on('http.status.500', function( resource ) {
    casper.test.error( '500: ' + resource.url );
});

//页面出现JS错误
casper.on( "page.error", function( msg, trace ) {
	casper.test.error( "JS Error" );
	// this.echo("Error: " + msg + "// " +  require( 'utils' ).dump( trace ), "ERROR");
});

casper.options.onResourceRequested = function( casper, resource ){
	// if( resource.url.indexOf( "list.do ") > -1 ){
	// 	this.echo( "resource received: " + JSON.stringify( resource ) );
	// }
}


var fs = require('fs');

//删除xunit输出
if( fs.exists( "xunit.xml" ) ){
	fs.remove( "xunit.xml" );
}

//删除截图
fs.removeTree( $CONFIG.screenshot );

//如果开启了截图，就创建截图文件夹
if( $CONFIG.capture ){
	fs.makeTree( $CONFIG.screenshot );
}