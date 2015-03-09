	

	var html;
	var xxhtml;
	var json;
	var rend;

		
	function getHTML(){
		editor.preview()
		html = editor.getElement('previewer').body.innerHTML;
		var rstart = html.replace('<div id="epiceditor-preview">',"");
		html = rstart.replace(new RegExp('</div>(?!</div>)','g'),"");
		
		var ehtml1 = html.replace(new RegExp('\<','g'),"&lt");
		var ehtml2 = ehtml1.replace(new RegExp('\&','g'),"&amp");
		var xhtml = html.replace(new RegExp('\"','g'),'\\"');		
		xxhtml = xhtml.replace (new RegExp('\[\x0A\x0D]','g'),"");
		
		
		disp = "<pre >" + ehtml2 + "</pre>";
		document.getElementById("html").innerHTML = disp;
 
		editor.edit();
	}

	function getJSON(){
		var json;
		json = '{"article":{';
		/*							 */
			json += '"_boost": {"name" : "sponsor", "null_value" : 1.0},';	
			json += '"properties":{'

			json += '"id":"' + document.getElementById("UID").innerHTML +'",';

			json += '"scope":"' + document.getElementById("SCOPE").innerHTML +'",';


			json += '"content":"' +  xxhtml + '"';
			json += '}';		
			json += '}';
		json += '}';
		
		try{
			jsonObj= JSON.parse(json);
			json = "<pre >" + JSON.stringify(jsonObj,null,2) + "</pre>";
			document.getElementById("json").innerHTML = json;
			document.getElementById("mjson").value =  json;
		}
		catch(err){
			document.getElementById("json").innerHTML = "Error";
		}
 	}
	
	function getCSV(){
		var csv;
		csv  = '"' + document.getElementById("UID").innerHTML + '","' ;
		csv += document.getElementById("SCOPE").innerHTML + '","' ;
		csv += xxhtml + '"';
		document.getElementById("csv").innerHTML  =csv;
		document.getElementById("mcsv").value =csv;
 	}

	function getit(){
		getHTML();
		getJSON();
		getCSV();
	}
	
/*
*/
	function saveTextAsFile(){
		getHTML();
		getJSON();
		var textToWrite = var json;
		var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
		var fileNameToSaveAs = "tmp.json";

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
			document.getElementById("json").innerHTML = textFromFileLoaded;
		};
		fileReader.readAsText(fileToLoad, "UTF-8");
	}
	


	document.onload = function init(){
	 
		function showFile(){
		document.getElementById("filename").value= document.getElementById("fileToLoad").files[0].name;
		}
	
		document.getElementById("fileToLoad").addEventListener("change",showFile);
		
		
	}

 
	
	
	
	
 
