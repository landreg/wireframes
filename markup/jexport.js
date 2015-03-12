	

 
 
 
		
	function getHTML(){
		editor.preview()
		html = editor.getElement('previewer').body.innerHTML;
 		editor.edit();

		var rstart = html.replace('<div id="epiceditor-preview">',"");
		html = rstart.replace(new RegExp('</div>(?!</div>)','g'),"");

  	
		return html;
	}
	
	function putHTML(html){
		var xhtml = html;
		/*
		var xhtml = html.replace(new RegExp('\\"','g'),'\"');		
	
		var disp = xhtml.replace(new RegExp('\&amp','g'),"\&");	
		var xdisp = disp.replace(new RegExp('\&lt','g'),"<");
		*/
		document.getElementById('html').innerHTML= html;
	}
	
	
	
	function putJSON(json){
 
	try{
			jsonObj= JSON.parse(json);
			document.getElementById("UID").value=jsonObj.article.properties.id;
			document.getElementById("TITLE").value=jsonObj.article.properties.title;
			document.getElementById("SCOPE").value=jsonObj.article.properties.scope;
			editor.importFile("epiceditor",jsonObj.article.properties.markup);
			putHTML(jsonObj.article.properties.content);
		}
		catch(err){
			alert ("Error"+ err.message);
 
		}
		
	
	}
	
	
	function getJSON(){
 		//html = xhtml.replace (new RegExp('\[\x0A\x0D]','g'),"");
		var json;
		var jsonObj = {};
		jsonObj.article={};
		jsonObj.article._boost = {name: "sponsor" , "null_value" : 1.0};
		jsonObj.article.properties = {};
		jsonObj.article.properties.id =  document.getElementById("UID").value ;
		jsonObj.article.properties.title = document.getElementById("TITLE").value ;
		jsonObj.article.properties.scope = document.getElementById("SCOPE").innerHTML
		jsonObj.article.properties.content = getFirst() + wrapItem(getHTML(),document.getElementById("UID").value ); ;
		jsonObj.article.properties.markup = editor.exportFile("epiceditor","text");
		 
		 
		try{
			json = JSON.stringify(jsonObj,null,2)   
 			return json;
		}
		catch(err){
			alert ("Error creating json file:" + err.message);
		}
 	}
	
	function getCSV(){
		var csv;
		csv  = '"' + document.getElementById("UID").value + '","' ;
		csv += document.getElementById("SCOPE").innerHTML + '","' ;
		csv += document.getElementById("TITLE").value + '","' ;
		csv += xxhtml + '"';
		document.getElementById("csv").innerHTML  =csv;
		return csv;
 	}

 
	
	function getFirst(){
	 
	    var title = "<p class=\"km_article_title\">" + document.getElementById("TITLE").value +"</p>\n" ;
		var scope =  "<p class=\"km_article_scope\">" + document.getElementById("SCOPE").value +"</p>\n";
		
		/*	TODO need to stop HTML injection	
		var xhtml = html.replace(new RegExp('\"','g'),'\\"');		
	
		var disp = xhtml.replace(new RegExp('\&','g'),"&amp");	
		var xdisp = disp.replace(new RegExp('\<','g'),"&lt");
		*/	
		return  title +scope;	
 
	}
	
	 function wrapItem(html,item){
	 return "<div class=\"km_article_item\" id=\""+item+"\">"+html+"</div>"
	 }
	 
	
/*
*/
	function saveTextAsFile(){
		var textToWrite = getJSON();
		var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
		var fileNameToSaveAs = document.getElementById("UID").value +".json";

		var downloadLink = document.createElement("a");
		downloadLink.download = fileNameToSaveAs;
		downloadLink.innerHTML = "Download File";
		if (window.webkitURL != null)
		{
			// Chrome allows the link to be clicked
			// without actually adding it to the DOM.
			downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
		}
		else
		{
			// Firefox requires the link to be added to the DOM
			// before it can be clicked.
			downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
			downloadLink.onclick = destroyClickedElement;
			downloadLink.style.display = "none";
			document.body.appendChild(downloadLink);
		}
		downloadLink.click();
	}

	function destroyClickedElement(event)
{
	document.body.removeChild(event.target);
}

	

	function loadFileAsText()
	{
		var fileToLoad = document.getElementById("fileToLoad").files[0];

		var fileReader = new FileReader();
		fileReader.onload = function(fileLoadedEvent) 
		{
			var textFromFileLoaded = fileLoadedEvent.target.result;		
 			putJSON(textFromFileLoaded);
			
		};
		fileReader.readAsText(fileToLoad, "UTF-8");
	}
	

 

 
	
	
	
	
 
