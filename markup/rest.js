function rest($method,$url,$data){ 
		xmlhttp=new XMLHttpRequest(); 
		xmlhttp.open($method,$url,true) 
		xmlhttp.send(null); 
		
		if (xmlhttp.status == 200)
			alert("The request succeeded!\n\nThe response representation was:\n\n" + xmlhttp.responseText)
		else
			alert("The request did not succeed!\n\nThe response status was: " + xmlhttp.status + " " + xmlhttp.statusText + ".");
		}
		
	function sendES(){
		rest("GET","https://cr8s6lopm:ruvfrlsbil@johns-first-starter-1934305931.eu-west-1.bonsai.io/article/external/1",null);
	}