	

 
 
 
		
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
		try{
			document.getElementById('km_article').innerHTML= html;
		}
		catch(err){};	
	}
	
	function preview(){
		var jsonObj = getJSON();
		putHTML(jsonObj.article.properties.content);
	}
	
	function clearFacet(facet){
		selList = document.getElementById(facet)
		for (x=0;x<selList.options.length;x++) 
				selList.options[x].selected = false;			

	}
	
	function clearFields(){
		document.getElementById("UID").value="";
		document.getElementById("TITLE").value="";
		document.getElementById("SCOPE").value="";
		document.getElementById("TYPE").value="km_task";
		editor.importFile("epiceditor","");
		clearFacet("facet1");
		clearFacet("facet2");
		putHTML("");
	
	}
	
	function putJSON(json){
 
		try{
			jsonObj= JSON.parse(json);

		}
		catch(err){
			alert ("Error"+ err.message);
			return;
		}
		document.getElementById("UID").value=jsonObj.article.properties.id;
		document.getElementById("TITLE").value=jsonObj.article.properties.title;
		document.getElementById("SCOPE").value=jsonObj.article.properties.scope;
		document.getElementById("TYPE").value = jsonObj.article.properties.type;
		for (x=0;x<jsonObj.article.properties.facets.length;x++){
			setFoci(jsonObj.article.properties.facets[x].name,jsonObj.article.properties.facets[x].foci);
		}
		editor.importFile("epiceditor",jsonObj.article.properties.markup);
		putHTML(jsonObj.article.properties.content);
	
	}
	
	function setFoci(facet,foci){
		selList = document.getElementById(facet);
		var x;
		for (x=0;x<selList.options.length;x++){
			if (foci.indexOf(selList[x].value) != -1) 
				 selList.options[x].selected = true;
			else
				selList.options[x].selected = false;			
		}	
	}
	
	
	function getFoci(facet){
		var foci =[];
		//var str = "" ;
	 
		selList = document.getElementById(facet);
		var x;
		for (x=0;x<selList.options.length;x++){
			if (selList.options[x].selected) {
				foci.push(selList[x].value);
				//str += selList[x].value + " ";
			}			
		}
		//document.getElementById(facet+"disp").innerHTML = str;
		return foci
	}
	
	
	
	
	function getJSON(){
 		//html = xhtml.replace (new RegExp('\[\x0A\x0D]','g'),"");
 		var jsonObj = {};
		jsonObj.article={};
		jsonObj.article._boost = {name: "sponsor" , "null_value" : 1.0};
		jsonObj.article.properties = {};
		jsonObj.article.properties.id =  document.getElementById("UID").value ;
		jsonObj.article.properties.title = document.getElementById("TITLE").value ;
		jsonObj.article.properties.scope = document.getElementById("SCOPE").value ;
		jsonObj.article.properties.type =  document.getElementById("TYPE").value;
 		jsonObj.article.properties.items  =[];
		jsonObj.article.properties.items[0] = {"item":document.getElementById("UID").value, "type":document.getElementById("TYPE").value};
 		jsonObj.article.properties.items[1] = {"item":document.getElementById("UID").value, "type":document.getElementById("TYPE").value};
		jsonObj.article.properties.facets = [];
		jsonObj.article.properties.facets[0] ={};
		jsonObj.article.properties.facets[0].name = "facet1";
		jsonObj.article.properties.facets[0].foci = getFoci("facet1");
		jsonObj.article.properties.facets[1] ={};
		jsonObj.article.properties.facets[1].name = "facet2";
		jsonObj.article.properties.facets[1].foci = getFoci("facet2");
		jsonObj.article.properties.kmlinks = [];
		jsonObj.article.properties.kmlinks[0] ={};
		jsonObj.article.properties.kmlinks[0].id = "link 1";
		jsonObj.article.properties.kmlinks[0].title = "The title of a article 1" ;
		jsonObj.article.properties.kmlinks[0].scope = "The title of a article 1"  ;
		jsonObj.article.properties.kmlinks[1] ={};
		jsonObj.article.properties.kmlinks[1].id = "link 1";
		jsonObj.article.properties.kmlinks[1].title = "The title of a article 1" ;
		jsonObj.article.properties.kmlinks[1].scope = "The title of a article 1"  ;
		jsonObj.article.properties.extlinks[0] ={};
		jsonObj.article.properties.extlinks[0].url= "http://wwww.link1";
		jsonObj.article.properties.extlinks[0].title = "The title of a link 1" ;
		jsonObj.article.properties.extlinks[0].scope = "The title of a link 1" ;	
		jsonObj.article.properties.extlinks[1] ={};
		jsonObj.article.properties.extlinks[1].url= "http://wwww.link2";
		jsonObj.article.properties.extlinks[1].title = "The title of a link 2" ;
		jsonObj.article.properties.extlinks[1].scope = "The title of a link 2" ;	
		jsonObj.article.properties.content = getFirst() + wrapItem(getHTML(),document.getElementById("UID").value,document.getElementById("TYPE").value); 
		jsonObj.article.properties.markup = editor.exportFile("epiceditor","text");
		return jsonObj;

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
	
	 function wrapItem(html,item,type){
	 return "<div class=\"km_article_item " + type + "\" id=\""+item+"\">"+html+"</div>"
	 }
	 
	
/*
*/
	function saveTextAsFile(){
		try{
			textToWrite = JSON.stringify(getJSON(),null,2)   
		}
		catch(err){
			alert ("Error creating json file:" + err.message);
			return;
		}
 
		var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
		var fileNameToSaveAs = document.getElementById("UID").value +".kmj";

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

	function loadFile(fileToLoad){
		var fileReader = new FileReader();
		fileReader.onload = function(fileLoadedEvent) 
		{
			var textFromFileLoaded = fileLoadedEvent.target.result;		
 			putJSON(textFromFileLoaded);
			
		};
		fileReader.readAsText(fileToLoad, "UTF-8");
		document.getElementById("fileToLoad").files[0] = fileToLoad;
	}
	

	function loadFileAsText()
	{
		var fileToLoad = document.getElementById("fileToLoad").files[0];
		loadFile(fileToLoad);
		
	}
	
	function loadExport(){
		var drop   = document.getElementById('drop');
			addEventHandler(drop, 'dragover', cancel);
			addEventHandler(drop, 'dragenter', cancel);
				
			addEventHandler(drop, 'drop', function (e) {
			  e = e || window.event; // get window.event if e argument missing (in IE)   
			  if (e.preventDefault) { e.preventDefault(); } // stops the browser from redirecting off to the image.

			  var dt    = e.dataTransfer;
			  var files = dt.files;
			  loadFile(files[0]);
			  return false;
			  });
	}			
	 
	
	function cancel(e) {
				  if (e.preventDefault) { e.preventDefault(); }
				  return false;
				}	
 

 
	
	
	
	
 
