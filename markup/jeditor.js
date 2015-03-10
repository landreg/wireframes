	

 
	var xxhtml;
 
		
	function getHTML(){
		editor.preview()
		html = editor.getElement('previewer').body.innerHTML;
 		editor.edit();

		var rstart = html.replace('<div id="epiceditor-preview">',"");
		html = rstart.replace(new RegExp('</div>(?!</div>)','g'),"");
		var xhtml = html.replace(new RegExp('\"','g'),'\\"');		
	
		var disp = xhtml.replace(new RegExp('\&','g'),"&amp");	
		var xdisp = disp.replace(new RegExp('\<','g'),"&lt");
		xxdisp = "<pre >" + xdisp + "</pre>";
		document.getElementById("html").innerHTML =  xxdisp;		
		return xhtml;
	}
	
	function getMarkup(){
		var mup = editor.exportFile("epiceditor","text");
		var xmup = mup.replace(new RegExp('\"','g'),'\\"');	
		var xxmup = xmup.replace(new RegExp('\[\x0A\x0D]','g'),"");
		return xxmup;
	}

	function getJSON(){
		var xhtml = getHTML();
		html = xhtml.replace (new RegExp('\[\x0A\x0D]','g'),"");
		var json;
		json = '{"article":{';
		/*							 */
			json += '"_boost": {"name" : "sponsor", "null_value" : 1.0},';	
			json += '"properties":{'

			json += '"id":"' + document.getElementById("UID").value +'",';
			json += '"title":"' + document.getElementById("TITLE").value +'",';
			json += '"scope":"' + document.getElementById("SCOPE").innerHTML +'",';
			json += '"content":"' +  html + '",';
			json += '"markup":"' + getMarkup() + '"';
			json += '}';		
			json += '}';
		json += '}';
		 
		try{
			jsonObj= JSON.parse(json);
			json = JSON.stringify(jsonObj,null,2) 
			document.getElementById("json").innerHTML = "<pre >" + json+ "</pre>";
			return json;
		}
		catch(err){
			document.getElementById("json").innerHTML = "<p> Error </p> <p>" + err.message + "</p> <pre >" + json+ "</pre>";
			return "Error creating json file:" + err.message;
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

	function getit(){
		
		getJSON();
		getCSV(); 

	}
	
/*
*/
	function saveTextAsFile(){
		var textToWrite = getJSON();
		var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
		var fileNameToSaveAs = document.getElementById("UID").value+ "_" + document.getElementById("TITLE").value +".json";

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

	function loadJSON(json){
	try{
			jsonObj= JSON.parse(json);
			document.getElementById("json").innerHTML = json;
			document.getElementById("UID").value=jsonObj.article.properties.id;
			document.getElementById("TITLE").value=jsonObj.article.properties.title;
			document.getElementById("SCOPE").innerHTML=jsonObj.article.properties.scope;
 
			document.getElementById('html').innerHTML=jsonObj.article.properties.content;
			editor.importFile("tmp",jsonObj.article.properties.markup);
		}
		catch(err){
			document.getElementById("json").innerHTML = "Error"+ err.message;
		}	
	}


	function loadFileAsText()
	{
		var fileToLoad = document.getElementById("fileToLoad").files[0];

		var fileReader = new FileReader();
		fileReader.onload = function(fileLoadedEvent) 
		{
			var textFromFileLoaded = fileLoadedEvent.target.result;		
 			loadJSON(textFromFileLoaded);
			
		};
		fileReader.readAsText(fileToLoad, "UTF-8");
	}
	

	document.onload = function init(){
		function showFile(){
		document.getElementById("filename").value= document.getElementById("fileToLoad").files[0].name;
		}
		document.getElementById("fileToLoad").addEventListener("change",showFile);
	}

 
	
	
	
	
 
