	/*  get - get from UI input fields 
		put - put to UI input fields 
		view - view in UI
		set - setUI and globals from JSON
		
		read - read from file
		save - save to file
		
	*/
	
	var facets=[];
	
	
	function clearFields(){
		/*clear golbals */
		extlinks=[];
		facets=[];
		putHTML("");
		kmlinks=[];
	
	
		/*clear ui*/
		document.getElementById("UID").value="";
		document.getElementById("TITLE").value="";
		document.getElementById("SCOPE").value="Some text describing the scope and content of the article";
		document.getElementById("TYPE").value="km_task";
		editor.importFile("epiceditor","##Sorry. There is currently no content for this page.");
		document.getElementById("KMLINKS").innerHTML="";
		document.getElementById("EXTLINKS").innerHTML="";
		document.getElementById("KEYWORDS").value="";		
		setupFacets();	

	}
	
//HTML
	
	function getHTML(){
		editor.preview()
		var html = editor.getElement('previewer').body.innerHTML;
 		editor.edit();

		var rstart = html.replace('<div id="epiceditor-preview">',"");
 		rule = new RegExp('(<\/div>)([\s]*$)','g');
		html = rstart.replace(rule,"");
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
	
	function putHTMLasMarkup(markup){
		var mup= markup;
 
 		// ending tags
		mup = mup.replace(new RegExp('<(\/)[^>]+>','g'),"");
		// para tags
		mup = mup.replace(new RegExp('<p[^>]*>','g'),"\n");
		// list
		mup = mup.replace(new RegExp('<li[^>]*>','g'),"*");
		// h1
		mup = mup.replace(new RegExp('<h1[^>]*>','g'),"#");
		// h2
		mup = mup.replace(new RegExp('<h2[^>]*>','g'),"##");
		// h3
		mup = mup.replace(new RegExp('<h3[^>]*>','g'),"###");
		// h4
		mup = mup.replace(new RegExp('<h4[^>]*>','g'),"####");
		//all others
		mup = mup.replace(new RegExp('<[^>]*>(?!>)','g'),"");	
		editor.importFile("epiceditor",mup);		
	}
	
	
	function preview(){
		var jsonObj = getJSON();
		putHTML(jsonObj.content);
	}
	
//KEYWORDS
	
	function CSVtoArray(text) {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) return null;
    var a = [];                     // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
        function(m0, m1, m2, m3) {
            // Remove backslash from \' in single quoted values.
            if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return ''; // Return empty string.
        });
    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    return a;
};
	function getKeywords(){
		var keys = CSVtoArray(document.getElementById("KEYWORDS").value);
		return keys;
	}
	
	function setKeywords(keywords){
		if (keywords==null) {
			document.getElementById("KEYWORDS").value="";
			return;
			}
		var str ="";
		for (var a=0;(a<keywords.length);a++){
				str += '"' + keywords[a] + '"';
				if ((a+1) < keywords.length) str += ',';
		}		
		document.getElementById("KEYWORDS").value=str;
	}
	
	
//Links

	
	function addKMlink(json){
 
		try{
			jsonObj= parseJSON(json);

		}
		catch(err){
			alert ("Error"+ err.message);
			return;
		}
		;
		kmlinks.push({"id":jsonObj.id});
		setkmlinks(kmlinks);
		
	}
	
	function addExtLink(url,name,scope){
		var uri = url.replace(new RegExp('((http)s*:\/\/)(www.)*','g'),"");
		var name = uri.replace(new RegExp('\/.*','g'),"");
		var scope = uri.replace(new RegExp('^.*\/','g'),"");
		var scope = scope.replace(new RegExp('(\\?.*)','g'),"");
		extlink={"url":url,"name":name,"scope":scope};
		extlinks.push(extlink);
		setextlinks(extlinks);
	}
	
	function popitup(url) {
		var p1 = 'scrollbars=no,resizable=no,status=no,location=no,toolbar=yes,menubar=yes ';
		var p2 = 'width=300,height=300,left=200,top=100'; 
		newwindow=window.open(url,'name',p1+p2);
		if (window.focus) {newwindow.focus()}
 		return false;
	}

	function HandlePopupResult(){
		alert("popup unddload");
		}
	
	
	var kmlinks = [];
	
 	function setkmlinks(obj){
		kmlinks = obj;
		var str="";
		for (var x=0;x<kmlinks.length;x++){
			str+= kmlinks[x].id + "<br>";
		}
		document.getElementById("KMLINKS").innerHTML=str;	
	}	
	
	var extlinks = [];
	
	 function setextlinks(obj){
		extlinks = obj;
		var str="";
		for (var x=0;x<extlinks.length;x++){
			str+= extlinks[x].url + "<br>";
		}
		document.getElementById("EXTLINKS").innerHTML=str;	
	}	
	
// Facets
 
	function findInArray(a,o){
		return a.filter(function(entry){
			return Object.keys(o).every(function(key){ 
				return entry[key] == o[key];
			});
		});
	}
 
	function getObjectByAttr(array,attr,value){
		for (var i=0;(i<array.length);i++){
			if (array[i].hasOwnProperty(attr) && (array[i][attr] === value)){
				return array[i];
			}
		}
		return undefined;
	}
	
	function displayFacet(facetName){
		var disp = document.getElementById(facetName);
		if (!disp){
			disp = document.createElement("p");
			disp.id=facetName;
			document.getElementById("FACETDISP").appendChild(disp);
		}	
		str = facetName +": ";
		facet =	getObjectByAttr(facets,"name",facetName);
		if (!facet || (facet.foci.length==0)){
			document.getElementById("FACETDISP").removeChild(disp);	
			return false;
			}
		else{
			for (var i=0;(i<facet.foci.length); i++){
				str += ": " +facet.foci[i];
				disp.innerHTML = str;	
				};
			}
		return true;	
	}
 
	
	function getFoci(){
		var facetName = document.getElementById("facets").value;
		var facet =	getObjectByAttr(facets,"name",facetName);
		facet.foci.length =0;
		var selList = document.getElementById("foci");		
		for (x=0;x<selList.options.length;x++){
			if (selList.options[x].selected) {
				if (selList[x].value!=="remove")
					facet.foci.push(selList[x].value);					
			}			
		}
		displayFacet(facetName);
	}
	
	function setupSelect(id,multiple,options,selected){
		var el = document.getElementById(id);
		el.options.length = 0;
		el.multiple = multiple;
		for (var opt in options){
			var o = document.createElement("option");
			o.value=options[opt];
			o.innerHTML=options[opt];
			el.add(o);
			if (selected){
				if (selected.indexOf(options[opt])>=0)
				o.selected = true;
			}
		}
	
	}
	
	function setupFoci(multiple,choices,selected){
		setupSelect("foci",multiple,choices,selected);
	}
	
	function setupFacets(){	  
		var el=document.getElementById("FACETDISP"); 
		/* need to remove child elements of FACETS div*/		
		var fc = el.firstElementChild;
		while (fc) {
			el.removeChild(fc);
			fc = el.firstElementChild;
			}
		str="Service,Subject Matter,Person/Agent,Process,Application Type,Space/Where,Legistlation,Purpose/Goal,Sensitivity,Audience,Item_Type"; 					
		
		//display the facet info
		var names = str.split(',');
		var name= names[names.length-1];
		for (var i in names){
			if (displayFacet(names[i])) name = names[i];
		}
				
		setupSelect("facets",false,names,[name]);
		 		
		//set up foci select for selected facet
		setupFacetFoci(name);
	}	

	function getFacet(){
		setupFacetFoci(document.getElementById("facets").value);
	}
	
	
	function setupFacetFoci(facetName){	
		var facet = getObjectByAttr(facets,"name",facetName);
		if (!facet){
			facet = { "name":facetName, "foci": []};
			facets.push(facet);
			}
		var selected = 	facet.foci;
		var multiple = false;
		var choices = "Error - Invalid Facet";
		switch (facetName){
			case "Service" :{
				var choices = "remove,Registration,Information services,Customer handling processes";
				break;
			}
			case "Subject Matter" :{
				var choices ="Adverse possession - registered,Adverse possession - unregistered,Objection and dispute,Indemnity,Charges,Easements,Licences,Land charges,Pending land action,Home Rights,Overriding interests,Restrictive covenants,Implied covenants,Personal covenants,Leases [may need to add foci],Leases - concurrent,Leases - reversionary,Leases - shared ownership,Leases - discontinuous,Leasehold covenants,Leasehold reform,Legislation,Mines and Minerals,Copyhold,Index Map,Ordnance Survey,,Floor levels,Airspace, tunnels, strata,Boundaries,Title plan,Provisions,Proprietor’s name,IOPN,Address for service,Joint proprietors ,Trusts,Mental capacity,Death,Probate & intestacy,Individual voluntary arrangement,Bankruptcy,Administration,Receivership,Liquidation,Powers of attorney,Transfer for value,Transfer not for value,Transfer of share,Transfer subject to charge,Transfer under power of sale,Transfer of part,Unregistered land,Public sector housing,Right To Buy,Preserved Right To Buy,Price paid ,PPI,Execution,Court order,Bias ,Foreign law,Class of title,The register,Daylist,Commonhold,Restriction,Unilateral notice,Agreed notice,Home Rights notice,SDLT,Fees,Classification,Notices,Forms,Fraud"; 
 				multiple = true;
				break;		
			}
			case "Person/Agent":{
				var choices = "Registered proprietor,Third party,Conveyancer,Caseworker,Company,Overseas company,Corporation,Receiver,Administrator,Liquidator,Insolvency practitioner/supervisor,Trustee in bankruptcy,Creditor,Attorney,Deputy (MHA),Personal representative,Trustee,Beneficiary,Pension fund trustee,Chargor,Chargee,Bank ,Building society,Local authority,Housing association,Utility company,Developer,Landlord/lessor,Tenant/lessee,RTM company,School/education body,NHS body,Foreign state,Companies House,Court";
				multiple = true;
				break;
			}
			case "Process":{
				choices ="Alteration,Registration (substantive),Variation,Change of,Postponement,Discharge,Cancellation,Withdrawal,Removal,Determination,Noting of (death),Electronic applications,Service of notice,Exempt documents,Filing,Sub-division of title,FOIA,Examination of title,Upgrade of title,Mapping,Indexing,Surveys,Job instruction";
				multiple = true;
				break;
			}
			case "Application Type":{
				choices ="DLG,FR,DFL,TP,Official copy,SIM,SIF,EBA,EPA,DFA";
				multiple = true;
				break;
			}
			case "Space/Where":{
				choices = "England,Wales";
				multiple = true;
				break;
			}
			case "Legistlation":{
				choices = "[Section of] Land Registration Act 2002,[Rule from] Land Registration Rules 2003,Other legislation";
				multiple = true;
				break;
			}
			case "Purpose/Goal":{
 				break;			
			}
			case "Sensitivity":{
				break;
			}
			case "Audience":{
				break;
			}
			case "Item_Type":{
				break;
			}
			default:
				break;
 			}
		setupFoci(multiple,choices.split(','),selected);	
	}
	
	function removeEmptyFacets(obj){
		for (var i=obj.length-1; (i>=0); i--){
			if (obj[i].foci.length==0){
				obj.splice(i,1);				
			}
		}
		return obj;
	}
	
	function setFacets(obj){
		facets = removeEmptyFacets(obj);
		setupFacets();
	}
	
// Files io
	
	function parseJSON(json){
			jsonObj = JSON.parse(json);
			if (jsonObj.article) jsonObj = jsonObj.article.properties;	
			return jsonObj;
	}
	
	function getFirst(){
	 
	 
		var text = document.getElementById("TITLE").value.trim();
		text = text.replace(new RegExp('\"','g'),'\\"').replace(new RegExp('\&','g'),"&amp").replace(new RegExp('\<','g'),"&lt");
	    var title = "<h1 class=\"km_article_title\">" + text +"</h1>\n" ;
		text = document.getElementById("SCOPE").value;
		text = text.replace(new RegExp('\"','g'),'\\"').replace(new RegExp('\&','g'),"&amp").replace(new RegExp('\<','g'),"&lt");
		var scope =  "<p class=\"km_article_scope\">" + text +"</p>\n";
		
		// stop HTML injection
		
		return  title + scope;	
 
	}
	 function wrapItem(html,item,type){
		var start = "<div class=\"km_article_item " + type + "\" id=\""+item+"\">"
		+ '<div class="panel-group" id="accordion">';
		var finish = "</div></div>";
		
		return start + html + finish;
	 }
	
	function getJSON(){
 		//html = xhtml.replace (new RegExp('\[\x0A\x0D]','g'),"");
 		var jsonObj = {};
		var uid = document.getElementById("UID").value.trim();
 		jsonObj = {};
		jsonObj.id = uid;
		jsonObj.title = document.getElementById("TITLE").value.trim();
		jsonObj.scope = document.getElementById("SCOPE").value ;
		jsonObj.type =  document.getElementById("TYPE").value;
 		jsonObj.items  =[];
		jsonObj.items[0] = {"item":uid, "type":document.getElementById("TYPE").value};
 		jsonObj.items[1] = {"item":uid, "type":document.getElementById("TYPE").value};
		jsonObj.lastupdate = new Date();
		jsonObj.popularity = 5;
		jsonObj.cluster = document.getElementById("CLUSTER").value;
		keys = getKeywords(); 
		if (keys==null){
			alert("Contents of keyword box is not valid : information lost");
			return;
			}
		jsonObj.keywords = keys;	
		jsonObj.facets = removeEmptyFacets(facets);
		jsonObj.kmlinks = kmlinks;
		jsonObj.extlinks = extlinks;
 
		jsonObj.content = getFirst() + wrapItem(getHTML(),uid,document.getElementById("TYPE").value); 
		jsonObj.markup = editor.exportFile("epiceditor","text");
		return jsonObj;
 	}
	 	
	
	function setJSON(json){
 
		try{
			jsonObj= parseJSON(json);
		}
		catch(err){
			alert ("Error"+ err.message);
			return;
		}
		document.getElementById("UID").value=jsonObj.id.trim();
		document.getElementById("TITLE").value=jsonObj.title.trim();
		if (jsonObj.scope == "SCOPE")
			document.getElementById("SCOPE").value="Some text describing the scope and content of the article";
		else	
			document.getElementById("SCOPE").value=jsonObj.scope;
		document.getElementById("TYPE").value = jsonObj.type;
		document.getElementById("CLUSTER").value = jsonObj.cluster;
		setkmlinks(jsonObj.kmlinks);
		setextlinks(jsonObj.extlinks);
		setKeywords(jsonObj.keywords);
		setFacets(jsonObj.facets);
 		
		if (jsonObj.markup=="")	
			editor.importFile("epiceditor","##Sorry. There is currently no content for this page.");
		else
			editor.importFile("epiceditor",jsonObj.markup);
		putHTML(jsonObj.content);
	
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
		var fileNameToSaveAs = document.getElementById("UID").value.trim() +".kmj";

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

	function destroyClickedElement(event){
	document.body.removeChild(event.target);
}



	function loadFile(fileToLoad){
		var fileReader = new FileReader();
		var ext=getFileExtension(fileToLoad.name);
		clearFields();
		fileReader.onload = function(fileLoadedEvent) 
		{
			var textFromFileLoaded = fileLoadedEvent.target.result;
			switch (ext){
				case "json":
				case "kmj":
				setJSON(textFromFileLoaded);
				break;
				case "html":
				case "txt":
				putHTMLasMarkup(textFromFileLoaded);
				break;
				default:
					alert("invalid file type");
			}
		};
		switch (ext){
				case "json":
				case "kmj":
				case "html":
				fileReader.readAsText(fileToLoad, "UTF-8");
				break;

				case "txt":
				fileReader.readAsText(fileToLoad, "ISO-8859-1");
				break;
				default:
					alert("invalid file type");
			}
	}
	
	function loadKMlink(fileToLoad){
		var fileReader = new FileReader();
		var ext=getFileExtension(fileToLoad.name);
		fileReader.onload = function(fileLoadedEvent){
			var textFromFileLoaded = fileLoadedEvent.target.result;
			addKMlink(textFromFileLoaded);
		} 
		switch (ext){
				case "kmj":
				fileReader.readAsText(fileToLoad, "UTF-8");
				break;
				default:
					alert("invalid file type");
		}
	}
	

	
	
	
	
	function getFileExtension(filename){
		var a = filename.split(".");
		if( a.length === 1 || ( a[0] === "" && a.length === 2 ) ) {
			return "";
		}
		return a.pop();
	}

	function loadFileAsText()
	{
		var fileToLoad = document.getElementById("fileToLoad").files[0];
		loadFile(fileToLoad);
		
	}
	
	function addEventHandler(obj, evt, handler) {
		if(obj.addEventListener) {
			// W3C method
			obj.addEventListener(evt, handler, false);
		} else if(obj.attachEvent) {
			// IE method.
			obj.attachEvent('on'+evt, handler);
		} else {
			// Old school method.
			obj['on'+evt] = handler;
		}
	}
	
	
	function setArticleDrop(){
			var drop   = document.getElementById('articledrop');
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
	
	function setKMDrop(){
			var drop   = document.getElementById('kmdrop');
			addEventHandler(drop, 'dragover', cancel);
			addEventHandler(drop, 'dragenter', cancel);
				
			addEventHandler(drop, 'drop', function (e) {
			  e = e || window.event; // get window.event if e argument missing (in IE)   
			  if (e.preventDefault) { e.preventDefault(); } // stops the browser from redirecting off to the image.

			  var dt    = e.dataTransfer;
			  var files = dt.files;
			  if (files.length > 0) {
					loadKMlink(files[0]);	
			  } 
			  var url   = dt.getData("URL") || dt.getData("text/uri-list");
			  if  (url.length > 0){
					addExtLink(url,"external link","description");
			  }
			  
			  return false;
			  });
	}
	
	function loadExport(){
			setArticleDrop();
			setKMDrop();
			clearFields();
	}			
	 
	
	function cancel(e) {
				  if (e.preventDefault) { e.preventDefault(); }
				  return false;
				}	
 
