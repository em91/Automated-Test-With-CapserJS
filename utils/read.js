var $MODULE = "read";
var $READ = {};


$READ.getMailContent = function( mid ){
	var result = casper.evaluate(function (){
		var data;
		$.ajax({
			url: "/jy5/xhr/read.do?sid=" + $CONF.sid,
			method: "POST",
			data: {
				mid: mid
			},
			async: false,
			success: function( result ){
				data = result;
			}
		})
		return data;
	})

	if( result.code === "S_OK" ){

	} else {
		casper.test.error( "Read.do Error: " + result.code );
	}
}