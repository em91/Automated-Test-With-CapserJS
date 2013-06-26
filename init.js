casper.userAgent('Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.93 Safari/537.36');

//404和500
casper.on('http.status.404', function( resource ) {
    casper.tester.error( '404: ' + resource.url );
});

casper.on('http.status.500', function( resource ) {
    casper.tester.error( '500: ' + resource.url );
});

//页面出现JS错误
casper.on( "page.error", function( msg, trace ) {
	this.echo("Error: " + msg + "// " +  require( 'utils' ).dump( trace ), "ERROR");
});