var $MODULE = "read";
var $READ = {};


$READ.getMailContent = function( mid ){
	var result = casper.evaluate(function ( mid ){
		var data;
		$.ajax({
			url: "/jy5/xhr/msg/read.do?sid=" + $CONF.sid,
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
	}, {
		mid: mid
	})

	if( result.code === "S_OK" ){
		return result;
	} else {
		casper.test.error( "Read.do Error: " + result.code );
	}
}