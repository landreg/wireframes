	

 
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
		var theText = editor.exportFile("epiceditor","text");
		/*
		var mup = mup.replace(new RegExp('\"','g'),'\\"');	
		var mup = xmup.replace(new RegExp('\[\x0A\x0D]','g'),"");
		*/
		  // First replace <br>s before replacing the rest of the HTML
		  theText = theText.replace(/<br>/gi, "\n");
		  // Now we can clean the HTML
		  theText = theText.replace(/<(?:.|\n)*?>/gm, '');
		  // Now fix HTML entities
		  theText = theText.replace(/&lt;/gi, '<'); 
		return theText;	
	
	}
	function setMarkup(content){
		// Don't convert lt/gt characters as HTML when viewing the editor window
		// TODO: Write a test to catch regressions for this
		content = content.replace(/</g, '&lt;');
		content = content.replace(/>/g, '&gt;');
		content = content.replace(/\n/g, '<br>');
		
		// Make sure to there aren't two spaces in a row (replace one with &nbsp;)
		// If you find and replace every space with a &nbsp; text will not wrap.
		// Hence the name (Non-Breaking-SPace).
		// TODO: Probably need to test this somehow...
		content = content.replace(/<br>\s/g, '<br>&nbsp;')
		content = content.replace(/\s\s\s/g, '&nbsp; &nbsp;')
		content = content.replace(/\s\s/g, '&nbsp; ')
		content = content.replace(/^ /, '&nbsp;')
	
		editor.importFile("epiceditor",content);
	}
	
	
	
	
	function putJSON(json){
 
	try{
			jsonObj= JSON.parse(json);
			document.getElementById("json").innerHTML = json;
			document.getElementById("UID").value=jsonObj.article.properties.id;
			document.getElementById("TITLE").value=jsonObj.article.properties.title;
			document.getElementById("SCOPE").value=jsonObj.article.properties.scope;
 
			document.getElementById('html').innerHTML=jsonObj.article.properties.content;
			editor.importFile("epiceditor",jsonObj.article.properties.markup);
			//setMarkup(jsonObj.article.properties.markup);
		}
		catch(err){
			document.getElementById("json").innerHTML = "Error"+ err.message;
 
	}

	
	}
	
	
	function getJSON(){
		var xhtml = getHTML();
		//html = xhtml.replace (new RegExp('\[\x0A\x0D]','g'),"");
		var json;
		var jsonObj = {};
		jsonObj.article={};
		jsonObj.article._boost = {name: "sponsor" , "null_value" : 1.0};
		jsonObj.article.properties = {};
		jsonObj.article.properties.id =  document.getElementById("UID").value ;
		jsonObj.article.properties.title = document.getElementById("TITLE").value ;
		jsonObj.article.properties.scope = document.getElementById("SCOPE").innerHTML
		jsonObj.article.properties.content = html ;
		jsonObj.article.properties.markup = editor.exportFile("epiceditor","text");
		 
		 
		try{
		/*	jsonObj= JSON.parse(json);*/
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
		var theText = editor.exportFile("epiceditor","text");
		editor.importFile("epiceditor",theText);
		//etJSON();
		//getCSV(); 

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
	

	document.onload = function init(){
		function showFile(){
		document.getElementById("filename").value= document.getElementById("fileToLoad").files[0].name;
		}
		document.getElementById("fileToLoad").addEventListener("change",showFile);
	}

 
	
	
	
	
 
