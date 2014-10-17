__whitespace={" ":true,"\t":true,"\n":true,"\f":true,"\r":true};difflib={defaultJunkFunction:function(c){return __whitespace.hasOwnProperty(c);},stripLinebreaks:function(str){return str.replace(/^[\n\r]*|[\n\r]*$/g,"");},stringAsLines:function(str){var lfpos=str.indexOf("\n");var crpos=str.indexOf("\r");var linebreak=((lfpos>-1&&crpos>-1)||crpos<0)?"\n":"\r";var lines=str.split(linebreak);for(var i=0;i<lines.length;i++){lines[i]=difflib.stripLinebreaks(lines[i]);}
return lines;},__reduce:function(func,list,initial){if(initial!=null){var value=initial;var idx=0;}else if(list){var value=list[0];var idx=1;}else{return null;}
for(;idx<list.length;idx++){value=func(value,list[idx]);}
return value;},__ntuplecomp:function(a,b){var mlen=Math.max(a.length,b.length);for(var i=0;i<mlen;i++){if(a[i]<b[i])return-1;if(a[i]>b[i])return 1;}
return a.length==b.length?0:(a.length<b.length?-1:1);},__calculate_ratio:function(matches,length){return length?2.0*matches/length:1.0;},__isindict:function(dict){return function(key){return dict.hasOwnProperty(key);};},__dictget:function(dict,key,defaultValue){return dict.hasOwnProperty(key)?dict[key]:defaultValue;},SequenceMatcher:function(a,b,isjunk){this.set_seqs=function(a,b){this.set_seq1(a);this.set_seq2(b);}
this.set_seq1=function(a){if(a==this.a)return;this.a=a;this.matching_blocks=this.opcodes=null;}
this.set_seq2=function(b){if(b==this.b)return;this.b=b;this.matching_blocks=this.opcodes=this.fullbcount=null;this.__chain_b();}
this.__chain_b=function(){var b=this.b;var n=b.length;var b2j=this.b2j={};var populardict={};for(var i=0;i<b.length;i++){var elt=b[i];if(b2j.hasOwnProperty(elt)){var indices=b2j[elt];if(n>=200&&indices.length*100>n){populardict[elt]=1;delete b2j[elt];}else{indices.push(i);}}else{b2j[elt]=[i];}}
for(var elt in populardict){if(populardict.hasOwnProperty(elt)){delete b2j[elt];}}
var isjunk=this.isjunk;var junkdict={};if(isjunk){for(var elt in populardict){if(populardict.hasOwnProperty(elt)&&isjunk(elt)){junkdict[elt]=1;delete populardict[elt];}}
for(var elt in b2j){if(b2j.hasOwnProperty(elt)&&isjunk(elt)){junkdict[elt]=1;delete b2j[elt];}}}
this.isbjunk=difflib.__isindict(junkdict);this.isbpopular=difflib.__isindict(populardict);}
this.find_longest_match=function(alo,ahi,blo,bhi){var a=this.a;var b=this.b;var b2j=this.b2j;var isbjunk=this.isbjunk;var besti=alo;var bestj=blo;var bestsize=0;var j=null;var j2len={};var nothing=[];for(var i=alo;i<ahi;i++){var newj2len={};var jdict=difflib.__dictget(b2j,a[i],nothing);for(var jkey in jdict){if(jdict.hasOwnProperty(jkey)){j=jdict[jkey];if(j<blo)continue;if(j>=bhi)break;newj2len[j]=k=difflib.__dictget(j2len,j-1,0)+1;if(k>bestsize){besti=i-k+1;bestj=j-k+1;bestsize=k;}}}
j2len=newj2len;}
while(besti>alo&&bestj>blo&&!isbjunk(b[bestj-1])&&a[besti-1]==b[bestj-1]){besti--;bestj--;bestsize++;}
while(besti+bestsize<ahi&&bestj+bestsize<bhi&&!isbjunk(b[bestj+bestsize])&&a[besti+bestsize]==b[bestj+bestsize]){bestsize++;}
while(besti>alo&&bestj>blo&&isbjunk(b[bestj-1])&&a[besti-1]==b[bestj-1]){besti--;bestj--;bestsize++;}
while(besti+bestsize<ahi&&bestj+bestsize<bhi&&isbjunk(b[bestj+bestsize])&&a[besti+bestsize]==b[bestj+bestsize]){bestsize++;}
return[besti,bestj,bestsize];}
this.get_matching_blocks=function(){if(this.matching_blocks!=null)return this.matching_blocks;var la=this.a.length;var lb=this.b.length;var queue=[[0,la,0,lb]];var matching_blocks=[];var alo,ahi,blo,bhi,qi,i,j,k,x;while(queue.length){qi=queue.pop();alo=qi[0];ahi=qi[1];blo=qi[2];bhi=qi[3];x=this.find_longest_match(alo,ahi,blo,bhi);i=x[0];j=x[1];k=x[2];if(k){matching_blocks.push(x);if(alo<i&&blo<j)
queue.push([alo,i,blo,j]);if(i+k<ahi&&j+k<bhi)
queue.push([i+k,ahi,j+k,bhi]);}}
matching_blocks.sort(difflib.__ntuplecomp);var i1=j1=k1=block=0;var non_adjacent=[];for(var idx in matching_blocks){if(matching_blocks.hasOwnProperty(idx)){block=matching_blocks[idx];i2=block[0];j2=block[1];k2=block[2];if(i1+k1==i2&&j1+k1==j2){k1+=k2;}else{if(k1)non_adjacent.push([i1,j1,k1]);i1=i2;j1=j2;k1=k2;}}}
if(k1)non_adjacent.push([i1,j1,k1]);non_adjacent.push([la,lb,0]);this.matching_blocks=non_adjacent;return this.matching_blocks;}
this.get_opcodes=function(){if(this.opcodes!=null)return this.opcodes;var i=0;var j=0;var answer=[];this.opcodes=answer;var block,ai,bj,size,tag;var blocks=this.get_matching_blocks();for(var idx in blocks){if(blocks.hasOwnProperty(idx)){block=blocks[idx];ai=block[0];bj=block[1];size=block[2];tag='';if(i<ai&&j<bj){tag='replace';}else if(i<ai){tag='delete';}else if(j<bj){tag='insert';}
if(tag)answer.push([tag,i,ai,j,bj]);i=ai+size;j=bj+size;if(size)answer.push(['equal',ai,i,bj,j]);}}
return answer;}
this.get_grouped_opcodes=function(n){if(!n)n=3;var codes=this.get_opcodes();if(!codes)codes=[["equal",0,1,0,1]];var code,tag,i1,i2,j1,j2;if(codes[0][0]=='equal'){code=codes[0];tag=code[0];i1=code[1];i2=code[2];j1=code[3];j2=code[4];codes[0]=[tag,Math.max(i1,i2-n),i2,Math.max(j1,j2-n),j2];}
if(codes[codes.length-1][0]=='equal'){code=codes[codes.length-1];tag=code[0];i1=code[1];i2=code[2];j1=code[3];j2=code[4];codes[codes.length-1]=[tag,i1,Math.min(i2,i1+n),j1,Math.min(j2,j1+n)];}
var nn=n+n;var groups=[];for(var idx in codes){if(codes.hasOwnProperty(idx)){code=codes[idx];tag=code[0];i1=code[1];i2=code[2];j1=code[3];j2=code[4];if(tag=='equal'&&i2-i1>nn){groups.push([tag,i1,Math.min(i2,i1+n),j1,Math.min(j2,j1+n)]);i1=Math.max(i1,i2-n);j1=Math.max(j1,j2-n);}
groups.push([tag,i1,i2,j1,j2]);}}
if(groups&&groups[groups.length-1][0]=='equal')groups.pop();return groups;}
this.ratio=function(){matches=difflib.__reduce(function(sum,triple){return sum+triple[triple.length-1];},this.get_matching_blocks(),0);return difflib.__calculate_ratio(matches,this.a.length+this.b.length);}
this.quick_ratio=function(){var fullbcount,elt;if(this.fullbcount==null){this.fullbcount=fullbcount={};for(var i=0;i<this.b.length;i++){elt=this.b[i];fullbcount[elt]=difflib.__dictget(fullbcount,elt,0)+1;}}
fullbcount=this.fullbcount;var avail={};var availhas=difflib.__isindict(avail);var matches=numb=0;for(var i=0;i<this.a.length;i++){elt=this.a[i];if(availhas(elt)){numb=avail[elt];}else{numb=difflib.__dictget(fullbcount,elt,0);}
avail[elt]=numb-1;if(numb>0)matches++;}
return difflib.__calculate_ratio(matches,this.a.length+this.b.length);}
this.real_quick_ratio=function(){var la=this.a.length;var lb=this.b.length;return _calculate_ratio(Math.min(la,lb),la+lb);}
this.isjunk=isjunk?isjunk:difflib.defaultJunkFunction;this.a=this.b=null;this.set_seqs(a,b);}};WebInspector.Placard=function(title,subtitle)
{this.element=document.createElementWithClass("div","placard");this.element.placard=this;this.subtitleElement=this.element.createChild("div","subtitle");this.titleElement=this.element.createChild("div","title");this._hidden=false;this.title=title;this.subtitle=subtitle;this.selected=false;}
WebInspector.Placard.prototype={get title()
{return this._title;},set title(x)
{if(this._title===x)
return;this._title=x;this.titleElement.textContent=x;},get subtitle()
{return this._subtitle;},set subtitle(x)
{if(this._subtitle===x)
return;this._subtitle=x;this.subtitleElement.textContent=x;},get selected()
{return this._selected;},set selected(x)
{if(x)
this.select();else
this.deselect();},select:function()
{if(this._selected)
return;this._selected=true;this.element.classList.add("selected");},deselect:function()
{if(!this._selected)
return;this._selected=false;this.element.classList.remove("selected");},toggleSelected:function()
{this.selected=!this.selected;},isHidden:function()
{return this._hidden;},setHidden:function(x)
{if(this._hidden===x)
return;this._hidden=x;this.element.classList.toggle("hidden",x);},discard:function()
{}};WebInspector.AddSourceMapURLDialog=function(callback)
{WebInspector.DialogDelegate.call(this);this.element=document.createElementWithClass("div","go-to-line-dialog");this.element.createChild("label").textContent=WebInspector.UIString("Source map URL: ");this._input=this.element.createChild("input");this._input.setAttribute("type","text");this._goButton=this.element.createChild("button");this._goButton.textContent=WebInspector.UIString("Go");this._goButton.addEventListener("click",this._onGoClick.bind(this),false);this._callback=callback;}
WebInspector.AddSourceMapURLDialog.show=function(element,callback)
{WebInspector.Dialog.show(element,new WebInspector.AddSourceMapURLDialog(callback));}
WebInspector.AddSourceMapURLDialog.prototype={focus:function()
{WebInspector.setCurrentFocusElement(this._input);this._input.select();},_onGoClick:function()
{this._apply();WebInspector.Dialog.hide();},_apply:function()
{var value=this._input.value;this._callback(value);},onEnter:function()
{this._apply();},__proto__:WebInspector.DialogDelegate.prototype};WebInspector.JavaScriptBreakpointsSidebarPane=function(breakpointManager,showSourceLineDelegate)
{WebInspector.SidebarPane.call(this,WebInspector.UIString("Breakpoints"));this.registerRequiredCSS("breakpointsList.css");this._breakpointManager=breakpointManager;this._showSourceLineDelegate=showSourceLineDelegate;this.listElement=document.createElement("ol");this.listElement.className="breakpoint-list";this.emptyElement=document.createElement("div");this.emptyElement.className="info";this.emptyElement.textContent=WebInspector.UIString("No Breakpoints");this.bodyElement.appendChild(this.emptyElement);this._items=new Map();var breakpointLocations=this._breakpointManager.allBreakpointLocations();for(var i=0;i<breakpointLocations.length;++i)
this._addBreakpoint(breakpointLocations[i].breakpoint,breakpointLocations[i].uiLocation);this._breakpointManager.addEventListener(WebInspector.BreakpointManager.Events.BreakpointAdded,this._breakpointAdded,this);this._breakpointManager.addEventListener(WebInspector.BreakpointManager.Events.BreakpointRemoved,this._breakpointRemoved,this);this.emptyElement.addEventListener("contextmenu",this._emptyElementContextMenu.bind(this),true);}
WebInspector.JavaScriptBreakpointsSidebarPane.prototype={_emptyElementContextMenu:function(event)
{var contextMenu=new WebInspector.ContextMenu(event);this._appendBreakpointActiveItem(contextMenu);contextMenu.show();},_appendBreakpointActiveItem:function(contextMenu)
{var breakpointActive=this._breakpointManager.breakpointsActive();var breakpointActiveTitle=breakpointActive?WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Deactivate breakpoints":"Deactivate Breakpoints"):WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Activate breakpoints":"Activate Breakpoints");contextMenu.appendItem(breakpointActiveTitle,this._breakpointManager.setBreakpointsActive.bind(this._breakpointManager,!breakpointActive));},_breakpointAdded:function(event)
{this._breakpointRemoved(event);var breakpoint=(event.data.breakpoint);var uiLocation=(event.data.uiLocation);this._addBreakpoint(breakpoint,uiLocation);},_addBreakpoint:function(breakpoint,uiLocation)
{var element=document.createElement("li");element.classList.add("cursor-pointer");element.addEventListener("contextmenu",this._breakpointContextMenu.bind(this,breakpoint),true);element.addEventListener("click",this._breakpointClicked.bind(this,uiLocation),false);var checkbox=document.createElement("input");checkbox.className="checkbox-elem";checkbox.type="checkbox";checkbox.checked=breakpoint.enabled();checkbox.addEventListener("click",this._breakpointCheckboxClicked.bind(this,breakpoint),false);element.appendChild(checkbox);var labelElement=document.createTextNode(uiLocation.linkText());element.appendChild(labelElement);var snippetElement=document.createElement("div");snippetElement.className="source-text monospace";element.appendChild(snippetElement);function didRequestContent(content)
{var lineNumber=uiLocation.lineNumber
var columnNumber=uiLocation.columnNumber;var contentString=new String(content);if(lineNumber<contentString.lineCount()){var lineText=contentString.lineAt(lineNumber);var maxSnippetLength=200;var snippetStartIndex=columnNumber>100?columnNumber:0;snippetElement.textContent=lineText.substr(snippetStartIndex).trimEnd(maxSnippetLength);}}
uiLocation.uiSourceCode.requestContent(didRequestContent);element._data=uiLocation;var currentElement=this.listElement.firstChild;while(currentElement){if(currentElement._data&&this._compareBreakpoints(currentElement._data,element._data)>0)
break;currentElement=currentElement.nextSibling;}
this._addListElement(element,currentElement);var breakpointItem={};breakpointItem.element=element;breakpointItem.checkbox=checkbox;this._items.set(breakpoint,breakpointItem);this.expand();},_breakpointRemoved:function(event)
{var breakpoint=(event.data.breakpoint);var uiLocation=(event.data.uiLocation);var breakpointItem=this._items.get(breakpoint);if(!breakpointItem)
return;this._items.remove(breakpoint);this._removeListElement(breakpointItem.element);},highlightBreakpoint:function(breakpoint)
{var breakpointItem=this._items.get(breakpoint);if(!breakpointItem)
return;breakpointItem.element.classList.add("breakpoint-hit");this._highlightedBreakpointItem=breakpointItem;},clearBreakpointHighlight:function()
{if(this._highlightedBreakpointItem){this._highlightedBreakpointItem.element.classList.remove("breakpoint-hit");delete this._highlightedBreakpointItem;}},_breakpointClicked:function(uiLocation,event)
{this._showSourceLineDelegate(uiLocation.uiSourceCode,uiLocation.lineNumber);},_breakpointCheckboxClicked:function(breakpoint,event)
{event.consume();breakpoint.setEnabled(event.target.checked);},_breakpointContextMenu:function(breakpoint,event)
{var breakpoints=this._items.values();var contextMenu=new WebInspector.ContextMenu(event);contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Remove breakpoint":"Remove Breakpoint"),breakpoint.remove.bind(breakpoint));if(breakpoints.length>1){var removeAllTitle=WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Remove all breakpoints":"Remove All Breakpoints");contextMenu.appendItem(removeAllTitle,this._breakpointManager.removeAllBreakpoints.bind(this._breakpointManager));}
contextMenu.appendSeparator();this._appendBreakpointActiveItem(contextMenu);function enabledBreakpointCount(breakpoints)
{var count=0;for(var i=0;i<breakpoints.length;++i){if(breakpoints[i].checkbox.checked)
count++;}
return count;}
if(breakpoints.length>1){var enableBreakpointCount=enabledBreakpointCount(breakpoints);var enableTitle=WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Enable all breakpoints":"Enable All Breakpoints");var disableTitle=WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Disable all breakpoints":"Disable All Breakpoints");contextMenu.appendSeparator();contextMenu.appendItem(enableTitle,this._breakpointManager.toggleAllBreakpoints.bind(this._breakpointManager,true),!(enableBreakpointCount!=breakpoints.length));contextMenu.appendItem(disableTitle,this._breakpointManager.toggleAllBreakpoints.bind(this._breakpointManager,false),!(enableBreakpointCount>1));}
contextMenu.show();},_addListElement:function(element,beforeElement)
{if(beforeElement)
this.listElement.insertBefore(element,beforeElement);else{if(!this.listElement.firstChild){this.bodyElement.removeChild(this.emptyElement);this.bodyElement.appendChild(this.listElement);}
this.listElement.appendChild(element);}},_removeListElement:function(element)
{this.listElement.removeChild(element);if(!this.listElement.firstChild){this.bodyElement.removeChild(this.listElement);this.bodyElement.appendChild(this.emptyElement);}},_compare:function(x,y)
{if(x!==y)
return x<y?-1:1;return 0;},_compareBreakpoints:function(b1,b2)
{return this._compare(b1.uiSourceCode.originURL(),b2.uiSourceCode.originURL())||this._compare(b1.lineNumber,b2.lineNumber);},reset:function()
{this.listElement.removeChildren();if(this.listElement.parentElement){this.bodyElement.removeChild(this.listElement);this.bodyElement.appendChild(this.emptyElement);}
this._items.clear();},__proto__:WebInspector.SidebarPane.prototype}
WebInspector.XHRBreakpointsSidebarPane=function()
{WebInspector.NativeBreakpointsSidebarPane.call(this,WebInspector.UIString("XHR Breakpoints"));this._breakpointElements={__proto__:null};var addButton=document.createElement("button");addButton.className="pane-title-button add";addButton.addEventListener("click",this._addButtonClicked.bind(this),false);addButton.title=WebInspector.UIString("Add XHR breakpoint");this.titleElement.appendChild(addButton);this.emptyElement.addEventListener("contextmenu",this._emptyElementContextMenu.bind(this),true);WebInspector.targetManager.observeTargets(this);}
WebInspector.XHRBreakpointsSidebarPane.prototype={targetAdded:function(target)
{this._restoreBreakpoints(target);},targetRemoved:function(target){},_emptyElementContextMenu:function(event)
{var contextMenu=new WebInspector.ContextMenu(event);contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Add breakpoint":"Add Breakpoint"),this._addButtonClicked.bind(this));contextMenu.show();},_addButtonClicked:function(event)
{if(event)
event.consume();this.expand();var inputElementContainer=document.createElement("p");inputElementContainer.className="breakpoint-condition";var inputElement=document.createElement("span");inputElementContainer.textContent=WebInspector.UIString("Break when URL contains:");inputElement.className="editing";inputElement.id="breakpoint-condition-input";inputElementContainer.appendChild(inputElement);this.addListElement(inputElementContainer,(this.listElement.firstChild));function finishEditing(accept,e,text)
{this.removeListElement(inputElementContainer);if(accept){this._setBreakpoint(text,true);this._saveBreakpoints();}}
var config=new WebInspector.InplaceEditor.Config(finishEditing.bind(this,true),finishEditing.bind(this,false));WebInspector.InplaceEditor.startEditing(inputElement,config);},_setBreakpoint:function(url,enabled,target)
{if(enabled)
this._updateBreakpointOnTarget(url,true,target);if(url in this._breakpointElements)
return;var element=document.createElement("li");element._url=url;element.addEventListener("contextmenu",this._contextMenu.bind(this,url),true);var checkboxElement=document.createElement("input");checkboxElement.className="checkbox-elem";checkboxElement.type="checkbox";checkboxElement.checked=enabled;checkboxElement.addEventListener("click",this._checkboxClicked.bind(this,url),false);element._checkboxElement=checkboxElement;element.appendChild(checkboxElement);var labelElement=document.createElement("span");if(!url)
labelElement.textContent=WebInspector.UIString("Any XHR");else
labelElement.textContent=WebInspector.UIString("URL contains \"%s\"",url);labelElement.classList.add("cursor-auto");labelElement.addEventListener("dblclick",this._labelClicked.bind(this,url),false);element.appendChild(labelElement);var currentElement=(this.listElement.firstChild);while(currentElement){if(currentElement._url&&currentElement._url<element._url)
break;currentElement=(currentElement.nextSibling);}
this.addListElement(element,currentElement);this._breakpointElements[url]=element;},_removeBreakpoint:function(url,target)
{var element=this._breakpointElements[url];if(!element)
return;this.removeListElement(element);delete this._breakpointElements[url];if(element._checkboxElement.checked)
this._updateBreakpointOnTarget(url,false,target);},_updateBreakpointOnTarget:function(url,enable,target)
{var targets=target?[target]:WebInspector.targetManager.targets();for(var i=0;i<targets.length;++i){if(enable)
targets[i].domdebuggerAgent().setXHRBreakpoint(url);else
targets[i].domdebuggerAgent().removeXHRBreakpoint(url);}},_contextMenu:function(url,event)
{var contextMenu=new WebInspector.ContextMenu(event);function removeBreakpoint()
{this._removeBreakpoint(url);this._saveBreakpoints();}
function removeAllBreakpoints()
{for(var url in this._breakpointElements)
this._removeBreakpoint(url);this._saveBreakpoints();}
var removeAllTitle=WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Remove all breakpoints":"Remove All Breakpoints");contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Add breakpoint":"Add Breakpoint"),this._addButtonClicked.bind(this));contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Remove breakpoint":"Remove Breakpoint"),removeBreakpoint.bind(this));contextMenu.appendItem(removeAllTitle,removeAllBreakpoints.bind(this));contextMenu.show();},_checkboxClicked:function(url,event)
{this._updateBreakpointOnTarget(url,event.target.checked);this._saveBreakpoints();},_labelClicked:function(url)
{var element=this._breakpointElements[url];var inputElement=document.createElement("span");inputElement.className="breakpoint-condition editing";inputElement.textContent=url;this.listElement.insertBefore(inputElement,element);element.classList.add("hidden");function finishEditing(accept,e,text)
{this.removeListElement(inputElement);if(accept){this._removeBreakpoint(url);this._setBreakpoint(text,element._checkboxElement.checked);this._saveBreakpoints();}else
element.classList.remove("hidden");}
WebInspector.InplaceEditor.startEditing(inputElement,new WebInspector.InplaceEditor.Config(finishEditing.bind(this,true),finishEditing.bind(this,false)));},highlightBreakpoint:function(url)
{var element=this._breakpointElements[url];if(!element)
return;this.expand();element.classList.add("breakpoint-hit");this._highlightedElement=element;},clearBreakpointHighlight:function()
{if(this._highlightedElement){this._highlightedElement.classList.remove("breakpoint-hit");delete this._highlightedElement;}},_saveBreakpoints:function()
{var breakpoints=[];for(var url in this._breakpointElements)
breakpoints.push({url:url,enabled:this._breakpointElements[url]._checkboxElement.checked});WebInspector.settings.xhrBreakpoints.set(breakpoints);},_restoreBreakpoints:function(target)
{var breakpoints=WebInspector.settings.xhrBreakpoints.get();for(var i=0;i<breakpoints.length;++i){var breakpoint=breakpoints[i];if(breakpoint&&typeof breakpoint.url==="string")
this._setBreakpoint(breakpoint.url,breakpoint.enabled,target);}},__proto__:WebInspector.NativeBreakpointsSidebarPane.prototype}
WebInspector.EventListenerBreakpointsSidebarPane=function()
{WebInspector.SidebarPane.call(this,WebInspector.UIString("Event Listener Breakpoints"));this.registerRequiredCSS("breakpointsList.css");this.categoriesElement=document.createElement("ol");this.categoriesElement.tabIndex=0;this.categoriesElement.classList.add("properties-tree");this.categoriesElement.classList.add("event-listener-breakpoints");this.categoriesTreeOutline=new TreeOutline(this.categoriesElement);this.bodyElement.appendChild(this.categoriesElement);this._categoryItems=[];this._createCategory(WebInspector.UIString("Animation"),["requestAnimationFrame","cancelAnimationFrame","animationFrameFired"],true);this._createCategory(WebInspector.UIString("Control"),["resize","scroll","zoom","focus","blur","select","change","submit","reset"]);this._createCategory(WebInspector.UIString("Clipboard"),["copy","cut","paste","beforecopy","beforecut","beforepaste"]);this._createCategory(WebInspector.UIString("DOM Mutation"),["DOMActivate","DOMFocusIn","DOMFocusOut","DOMAttrModified","DOMCharacterDataModified","DOMNodeInserted","DOMNodeInsertedIntoDocument","DOMNodeRemoved","DOMNodeRemovedFromDocument","DOMSubtreeModified","DOMContentLoaded"]);this._createCategory(WebInspector.UIString("Device"),["deviceorientation","devicemotion"]);this._createCategory(WebInspector.UIString("Drag / drop"),["dragenter","dragover","dragleave","drop"]);this._createCategory(WebInspector.UIString("Keyboard"),["keydown","keyup","keypress","input"]);this._createCategory(WebInspector.UIString("Load"),["load","beforeunload","unload","abort","error","hashchange","popstate"]);this._createCategory(WebInspector.UIString("Media"),["play","pause","playing","canplay","canplaythrough","seeking","seeked","timeupdate","ended","ratechange","durationchange","volumechange","loadstart","progress","suspend","abort","error","emptied","stalled","loadedmetadata","loadeddata","waiting"],false,["audio","video"]);this._createCategory(WebInspector.UIString("Mouse"),["click","dblclick","mousedown","mouseup","mouseover","mousemove","mouseout","mousewheel","wheel"]);this._createCategory(WebInspector.UIString("Timer"),["setTimer","clearTimer","timerFired"],true);this._createCategory(WebInspector.UIString("Touch"),["touchstart","touchmove","touchend","touchcancel"]);this._createCategory(WebInspector.UIString("XHR"),["readystatechange","load","loadstart","loadend","abort","error","progress","timeout"],false,["XMLHttpRequest","XMLHttpRequestUpload"]);this._createCategory(WebInspector.UIString("WebGL"),["webglErrorFired","webglWarningFired"],true);this._createCategory(WebInspector.UIString("Window"),["close"],true);WebInspector.targetManager.observeTargets(this);}
WebInspector.EventListenerBreakpointsSidebarPane.categoryListener="listener:";WebInspector.EventListenerBreakpointsSidebarPane.categoryInstrumentation="instrumentation:";WebInspector.EventListenerBreakpointsSidebarPane.eventTargetAny="*";WebInspector.EventListenerBreakpointsSidebarPane.eventNameForUI=function(eventName,auxData)
{if(!WebInspector.EventListenerBreakpointsSidebarPane._eventNamesForUI){WebInspector.EventListenerBreakpointsSidebarPane._eventNamesForUI={"instrumentation:setTimer":WebInspector.UIString("Set Timer"),"instrumentation:clearTimer":WebInspector.UIString("Clear Timer"),"instrumentation:timerFired":WebInspector.UIString("Timer Fired"),"instrumentation:requestAnimationFrame":WebInspector.UIString("Request Animation Frame"),"instrumentation:cancelAnimationFrame":WebInspector.UIString("Cancel Animation Frame"),"instrumentation:animationFrameFired":WebInspector.UIString("Animation Frame Fired"),"instrumentation:webglErrorFired":WebInspector.UIString("WebGL Error Fired"),"instrumentation:webglWarningFired":WebInspector.UIString("WebGL Warning Fired")};}
if(auxData){if(eventName==="instrumentation:webglErrorFired"&&auxData["webglErrorName"]){var errorName=auxData["webglErrorName"];errorName=errorName.replace(/^.*(0x[0-9a-f]+).*$/i,"$1");return WebInspector.UIString("WebGL Error Fired (%s)",errorName);}}
return WebInspector.EventListenerBreakpointsSidebarPane._eventNamesForUI[eventName]||eventName.substring(eventName.indexOf(":")+1);}
WebInspector.EventListenerBreakpointsSidebarPane.prototype={targetAdded:function(target)
{this._restoreBreakpoints(target);},targetRemoved:function(target){},_createCategory:function(name,eventNames,isInstrumentationEvent,targetNames)
{var labelNode=document.createElement("label");labelNode.textContent=name;var categoryItem={};categoryItem.element=new TreeElement(labelNode);this.categoriesTreeOutline.appendChild(categoryItem.element);categoryItem.element.listItemElement.classList.add("event-category");categoryItem.element.selectable=true;categoryItem.checkbox=this._createCheckbox(labelNode);categoryItem.checkbox.addEventListener("click",this._categoryCheckboxClicked.bind(this,categoryItem),true);categoryItem.targetNames=this._stringArrayToLowerCase(targetNames||[WebInspector.EventListenerBreakpointsSidebarPane.eventTargetAny]);categoryItem.children={};var category=(isInstrumentationEvent?WebInspector.EventListenerBreakpointsSidebarPane.categoryInstrumentation:WebInspector.EventListenerBreakpointsSidebarPane.categoryListener);for(var i=0;i<eventNames.length;++i){var eventName=category+eventNames[i];var breakpointItem={};var title=WebInspector.EventListenerBreakpointsSidebarPane.eventNameForUI(eventName);labelNode=document.createElement("label");labelNode.textContent=title;breakpointItem.element=new TreeElement(labelNode);categoryItem.element.appendChild(breakpointItem.element);breakpointItem.element.listItemElement.createChild("div","breakpoint-hit-marker");breakpointItem.element.listItemElement.classList.add("source-code");breakpointItem.element.selectable=false;breakpointItem.checkbox=this._createCheckbox(labelNode);breakpointItem.checkbox.addEventListener("click",this._breakpointCheckboxClicked.bind(this,eventName,categoryItem.targetNames),true);breakpointItem.parent=categoryItem;categoryItem.children[eventName]=breakpointItem;}
this._categoryItems.push(categoryItem);},_stringArrayToLowerCase:function(array)
{return array.map(function(value){return value.toLowerCase();});},_createCheckbox:function(labelNode)
{var checkbox=document.createElement("input");checkbox.className="checkbox-elem";checkbox.type="checkbox";labelNode.insertBefore(checkbox,labelNode.firstChild);return checkbox;},_categoryCheckboxClicked:function(categoryItem)
{var checked=categoryItem.checkbox.checked;for(var eventName in categoryItem.children){var breakpointItem=categoryItem.children[eventName];if(breakpointItem.checkbox.checked===checked)
continue;if(checked)
this._setBreakpoint(eventName,categoryItem.targetNames);else
this._removeBreakpoint(eventName,categoryItem.targetNames);}
this._saveBreakpoints();},_breakpointCheckboxClicked:function(eventName,targetNames,event)
{if(event.target.checked)
this._setBreakpoint(eventName,targetNames);else
this._removeBreakpoint(eventName,targetNames);this._saveBreakpoints();},_setBreakpoint:function(eventName,eventTargetNames,target)
{eventTargetNames=eventTargetNames||[WebInspector.EventListenerBreakpointsSidebarPane.eventTargetAny];for(var i=0;i<eventTargetNames.length;++i){var eventTargetName=eventTargetNames[i];var breakpointItem=this._findBreakpointItem(eventName,eventTargetName);if(!breakpointItem)
continue;breakpointItem.checkbox.checked=true;breakpointItem.parent.dirtyCheckbox=true;this._updateBreakpointOnTarget(eventName,eventTargetName,true,target);}
this._updateCategoryCheckboxes();},_removeBreakpoint:function(eventName,eventTargetNames,target)
{eventTargetNames=eventTargetNames||[WebInspector.EventListenerBreakpointsSidebarPane.eventTargetAny];for(var i=0;i<eventTargetNames.length;++i){var eventTargetName=eventTargetNames[i];var breakpointItem=this._findBreakpointItem(eventName,eventTargetName);if(!breakpointItem)
continue;breakpointItem.checkbox.checked=false;breakpointItem.parent.dirtyCheckbox=true;this._updateBreakpointOnTarget(eventName,eventTargetName,false,target);}
this._updateCategoryCheckboxes();},_updateBreakpointOnTarget:function(eventName,eventTargetName,enable,target)
{var targets=target?[target]:WebInspector.targetManager.targets();for(var i=0;i<targets.length;++i){if(eventName.startsWith(WebInspector.EventListenerBreakpointsSidebarPane.categoryListener)){var protocolEventName=eventName.substring(WebInspector.EventListenerBreakpointsSidebarPane.categoryListener.length);if(enable)
targets[i].domdebuggerAgent().setEventListenerBreakpoint(protocolEventName,eventTargetName);else
targets[i].domdebuggerAgent().removeEventListenerBreakpoint(protocolEventName,eventTargetName);}else if(eventName.startsWith(WebInspector.EventListenerBreakpointsSidebarPane.categoryInstrumentation)){var protocolEventName=eventName.substring(WebInspector.EventListenerBreakpointsSidebarPane.categoryInstrumentation.length);if(enable)
targets[i].domdebuggerAgent().setInstrumentationBreakpoint(protocolEventName);else
targets[i].domdebuggerAgent().removeInstrumentationBreakpoint(protocolEventName);}}},_updateCategoryCheckboxes:function()
{for(var i=0;i<this._categoryItems.length;++i){var categoryItem=this._categoryItems[i];if(!categoryItem.dirtyCheckbox)
continue;categoryItem.dirtyCheckbox=false;var hasEnabled=false;var hasDisabled=false;for(var eventName in categoryItem.children){var breakpointItem=categoryItem.children[eventName];if(breakpointItem.checkbox.checked)
hasEnabled=true;else
hasDisabled=true;}
categoryItem.checkbox.checked=hasEnabled;categoryItem.checkbox.indeterminate=hasEnabled&&hasDisabled;}},_findBreakpointItem:function(eventName,targetName)
{targetName=(targetName||WebInspector.EventListenerBreakpointsSidebarPane.eventTargetAny).toLowerCase();for(var i=0;i<this._categoryItems.length;++i){var categoryItem=this._categoryItems[i];if(categoryItem.targetNames.indexOf(targetName)===-1)
continue;var breakpointItem=categoryItem.children[eventName];if(breakpointItem)
return breakpointItem;}
return null;},highlightBreakpoint:function(eventName,targetName)
{var breakpointItem=this._findBreakpointItem(eventName,targetName);if(!breakpointItem||!breakpointItem.checkbox.checked)
breakpointItem=this._findBreakpointItem(eventName,WebInspector.EventListenerBreakpointsSidebarPane.eventTargetAny);if(!breakpointItem)
return;this.expand();breakpointItem.parent.element.expand();breakpointItem.element.listItemElement.classList.add("breakpoint-hit");this._highlightedElement=breakpointItem.element.listItemElement;},clearBreakpointHighlight:function()
{if(this._highlightedElement){this._highlightedElement.classList.remove("breakpoint-hit");delete this._highlightedElement;}},_saveBreakpoints:function()
{var breakpoints=[];for(var i=0;i<this._categoryItems.length;++i){var categoryItem=this._categoryItems[i];for(var eventName in categoryItem.children){var breakpointItem=categoryItem.children[eventName];if(breakpointItem.checkbox.checked)
breakpoints.push({eventName:eventName,targetNames:categoryItem.targetNames});}}
WebInspector.settings.eventListenerBreakpoints.set(breakpoints);},_restoreBreakpoints:function(target)
{var breakpoints=WebInspector.settings.eventListenerBreakpoints.get();for(var i=0;i<breakpoints.length;++i){var breakpoint=breakpoints[i];if(breakpoint&&typeof breakpoint.eventName==="string")
this._setBreakpoint(breakpoint.eventName,breakpoint.targetNames,target);}},__proto__:WebInspector.SidebarPane.prototype};WebInspector.CallStackSidebarPane=function()
{WebInspector.SidebarPane.call(this,WebInspector.UIString("Call Stack"));this.bodyElement.addEventListener("keydown",this._keyDown.bind(this),true);this.bodyElement.tabIndex=0;var asyncCheckbox=this.titleElement.appendChild(WebInspector.SettingsUI.createSettingCheckbox(WebInspector.UIString("Async"),WebInspector.settings.enableAsyncStackTraces,true,undefined,WebInspector.UIString("Capture async stack traces")));asyncCheckbox.classList.add("scripts-callstack-async");asyncCheckbox.addEventListener("click",consumeEvent,false);WebInspector.settings.enableAsyncStackTraces.addChangeListener(this._asyncStackTracesStateChanged,this);WebInspector.settings.skipStackFramesPattern.addChangeListener(this._blackboxingStateChanged,this);}
WebInspector.CallStackSidebarPane.Events={CallFrameSelected:"CallFrameSelected"}
WebInspector.CallStackSidebarPane.prototype={update:function(details)
{this.bodyElement.removeChildren();if(!details){var infoElement=this.bodyElement.createChild("div","info");infoElement.textContent=WebInspector.UIString("Not Paused");return;}
this._target=details.target();var callFrames=details.callFrames;var asyncStackTrace=details.asyncStackTrace;delete this._statusMessageElement;delete this._hiddenPlacardsMessageElement;this.placards=[];this._hiddenPlacards=0;this._appendSidebarPlacards(callFrames);var topStackHidden=(this._hiddenPlacards===this.placards.length);while(asyncStackTrace){var title=WebInspector.asyncStackTraceLabel(asyncStackTrace.description);var asyncPlacard=new WebInspector.Placard(title,"");asyncPlacard.element.addEventListener("click",this._selectNextVisiblePlacard.bind(this,this.placards.length,false),false);asyncPlacard.element.addEventListener("contextmenu",this._asyncPlacardContextMenu.bind(this,this.placards.length),true);asyncPlacard.element.classList.add("placard-label");this.bodyElement.appendChild(asyncPlacard.element);this._appendSidebarPlacards(asyncStackTrace.callFrames,asyncPlacard);asyncStackTrace=asyncStackTrace.asyncStackTrace;}
if(topStackHidden)
this._revealHiddenPlacards();if(this._hiddenPlacards){var element=document.createElementWithClass("div","hidden-placards-message");if(this._hiddenPlacards===1)
element.textContent=WebInspector.UIString("1 stack frame is hidden (black-boxed).");else
element.textContent=WebInspector.UIString("%d stack frames are hidden (black-boxed).",this._hiddenPlacards);element.createTextChild(" ");var showAllLink=element.createChild("span","node-link");showAllLink.textContent=WebInspector.UIString("Show");showAllLink.addEventListener("click",this._revealHiddenPlacards.bind(this),false);this.bodyElement.insertBefore(element,this.bodyElement.firstChild);this._hiddenPlacardsMessageElement=element;}},_appendSidebarPlacards:function(callFrames,asyncPlacard)
{var allPlacardsHidden=true;for(var i=0,n=callFrames.length;i<n;++i){var callFrame=callFrames[i];var placard=new WebInspector.CallStackSidebarPane.Placard(callFrame,asyncPlacard);placard.element.addEventListener("click",this._placardSelected.bind(this,placard),false);placard.element.addEventListener("contextmenu",this._placardContextMenu.bind(this,placard),true);this.placards.push(placard);this.bodyElement.appendChild(placard.element);if(WebInspector.BlackboxSupport.isBlackboxed(callFrame.script.sourceURL,callFrame.script.isContentScript())){placard.setHidden(true);placard.element.classList.add("dimmed");++this._hiddenPlacards;}else{allPlacardsHidden=false;}}
if(allPlacardsHidden&&asyncPlacard)
asyncPlacard.setHidden(true);},_revealHiddenPlacards:function()
{if(!this._hiddenPlacards)
return;this._hiddenPlacards=0;for(var i=0;i<this.placards.length;++i){var placard=this.placards[i];placard.setHidden(false);if(placard._asyncPlacard)
placard._asyncPlacard.setHidden(false);}
if(this._hiddenPlacardsMessageElement){this._hiddenPlacardsMessageElement.remove();delete this._hiddenPlacardsMessageElement;}},_placardContextMenu:function(placard,event)
{var contextMenu=new WebInspector.ContextMenu(event);if(!placard._callFrame.isAsync())
contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Restart frame":"Restart Frame"),this._restartFrame.bind(this,placard));contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Copy stack trace":"Copy Stack Trace"),this._copyStackTrace.bind(this));var script=placard._callFrame.script;if(!script.isSnippet()){contextMenu.appendSeparator();this.appendBlackboxURLContextMenuItems(contextMenu,script.sourceURL,script.isContentScript());}
contextMenu.show();},_asyncPlacardContextMenu:function(index,event)
{for(;index<this.placards.length;++index){var placard=this.placards[index];if(!placard.isHidden()){this._placardContextMenu(placard,event);break;}}},appendBlackboxURLContextMenuItems:function(contextMenu,url,isContentScript)
{var blackboxed=WebInspector.BlackboxSupport.isBlackboxed(url,isContentScript);if(blackboxed){contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Stop blackboxing":"Stop Blackboxing"),this._handleContextMenuBlackboxURL.bind(this,url,isContentScript,false));}else{if(WebInspector.BlackboxSupport.canBlackboxURL(url))
contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Blackbox script":"Blackbox Script"),this._handleContextMenuBlackboxURL.bind(this,url,false,true));if(isContentScript)
contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Blackbox all content scripts":"Blackbox All Content Scripts"),this._handleContextMenuBlackboxURL.bind(this,url,true,true));}},_handleContextMenuBlackboxURL:function(url,isContentScript,blackbox)
{if(blackbox){if(isContentScript)
WebInspector.settings.skipContentScripts.set(true);else
WebInspector.BlackboxSupport.blackboxURL(url);}else{WebInspector.BlackboxSupport.unblackbox(url,isContentScript);}},_blackboxingStateChanged:function()
{if(!this._target)
return;var details=this._target.debuggerModel.debuggerPausedDetails();if(!details)
return;this.update(details);var selectedCallFrame=this._target.debuggerModel.selectedCallFrame();if(selectedCallFrame)
this.setSelectedCallFrame(selectedCallFrame);},_restartFrame:function(placard)
{placard._callFrame.restart();},_asyncStackTracesStateChanged:function()
{var enabled=WebInspector.settings.enableAsyncStackTraces.get();if(!enabled&&this.placards)
this._removeAsyncPlacards();},_removeAsyncPlacards:function()
{var shouldSelectTopFrame=false;var lastSyncPlacardIndex=-1;for(var i=0;i<this.placards.length;++i){var placard=this.placards[i];if(placard._asyncPlacard){if(placard.selected)
shouldSelectTopFrame=true;placard._asyncPlacard.element.remove();placard.element.remove();}else{lastSyncPlacardIndex=i;}}
this.placards.length=lastSyncPlacardIndex+1;if(shouldSelectTopFrame)
this._selectNextVisiblePlacard(0);},setSelectedCallFrame:function(x)
{for(var i=0;i<this.placards.length;++i){var placard=this.placards[i];placard.selected=(placard._callFrame===x);if(placard.selected&&placard.isHidden())
this._revealHiddenPlacards();}},_selectNextCallFrameOnStack:function()
{var index=this._selectedCallFrameIndex();if(index===-1)
return false;return this._selectNextVisiblePlacard(index+1);},_selectPreviousCallFrameOnStack:function()
{var index=this._selectedCallFrameIndex();if(index===-1)
return false;return this._selectNextVisiblePlacard(index-1,true);},_selectNextVisiblePlacard:function(index,backward)
{while(0<=index&&index<this.placards.length){var placard=this.placards[index];if(!placard.isHidden()){this._placardSelected(placard);return true;}
index+=backward?-1:1;}
return false;},_selectedCallFrameIndex:function()
{var selectedCallFrame=this._target.debuggerModel.selectedCallFrame();if(!selectedCallFrame)
return-1;for(var i=0;i<this.placards.length;++i){var placard=this.placards[i];if(placard._callFrame===selectedCallFrame)
return i;}
return-1;},_placardSelected:function(placard)
{placard.element.scrollIntoViewIfNeeded();this.dispatchEventToListeners(WebInspector.CallStackSidebarPane.Events.CallFrameSelected,placard._callFrame);},_copyStackTrace:function()
{var text="";var lastPlacard=null;for(var i=0;i<this.placards.length;++i){var placard=this.placards[i];if(placard.isHidden())
continue;if(lastPlacard&&placard._asyncPlacard!==lastPlacard._asyncPlacard)
text+=placard._asyncPlacard.title+"\n";text+=placard.title+" ("+placard.subtitle+")\n";lastPlacard=placard;}
InspectorFrontendHost.copyText(text);},registerShortcuts:function(registerShortcutDelegate)
{registerShortcutDelegate(WebInspector.ShortcutsScreen.SourcesPanelShortcuts.NextCallFrame,this._selectNextCallFrameOnStack.bind(this));registerShortcutDelegate(WebInspector.ShortcutsScreen.SourcesPanelShortcuts.PrevCallFrame,this._selectPreviousCallFrameOnStack.bind(this));},setStatus:function(status)
{if(!this._statusMessageElement)
this._statusMessageElement=this.bodyElement.createChild("div","info");if(typeof status==="string"){this._statusMessageElement.textContent=status;}else{this._statusMessageElement.removeChildren();this._statusMessageElement.appendChild(status);}},_keyDown:function(event)
{if(event.altKey||event.shiftKey||event.metaKey||event.ctrlKey)
return;if(event.keyIdentifier==="Up"&&this._selectPreviousCallFrameOnStack()||event.keyIdentifier==="Down"&&this._selectNextCallFrameOnStack())
event.consume(true);},__proto__:WebInspector.SidebarPane.prototype}
WebInspector.CallStackSidebarPane.Placard=function(callFrame,asyncPlacard)
{WebInspector.Placard.call(this,callFrame.functionName||WebInspector.UIString("(anonymous function)"),"");WebInspector.debuggerWorkspaceBinding.createCallFrameLiveLocation(callFrame,this._update.bind(this));this._callFrame=callFrame;this._asyncPlacard=asyncPlacard;}
WebInspector.CallStackSidebarPane.Placard.prototype={_update:function(uiLocation)
{var text=uiLocation.linkText();this.subtitle=text.trimMiddle(30);this.subtitleElement.title=text;},__proto__:WebInspector.Placard.prototype};WebInspector.HistoryEntry=function(){}
WebInspector.HistoryEntry.prototype={valid:function(){},reveal:function(){}};WebInspector.SimpleHistoryManager=function(historyDepth)
{this._entries=[];this._activeEntryIndex=-1;this._coalescingReadonly=0;this._historyDepth=historyDepth;}
WebInspector.SimpleHistoryManager.prototype={readOnlyLock:function()
{++this._coalescingReadonly;},releaseReadOnlyLock:function()
{--this._coalescingReadonly;},readOnly:function()
{return!!this._coalescingReadonly;},filterOut:function(filterOutCallback)
{if(this.readOnly())
return;var filteredEntries=[];var removedBeforeActiveEntry=0;for(var i=0;i<this._entries.length;++i){if(!filterOutCallback(this._entries[i])){filteredEntries.push(this._entries[i]);}else if(i<=this._activeEntryIndex)
++removedBeforeActiveEntry;}
this._entries=filteredEntries;this._activeEntryIndex=Math.max(0,this._activeEntryIndex-removedBeforeActiveEntry);},empty:function()
{return!this._entries.length;},active:function()
{return this.empty()?null:this._entries[this._activeEntryIndex];},push:function(entry)
{if(this.readOnly())
return;if(!this.empty())
this._entries.splice(this._activeEntryIndex+1);this._entries.push(entry);if(this._entries.length>this._historyDepth)
this._entries.shift();this._activeEntryIndex=this._entries.length-1;},rollback:function()
{if(this.empty())
return false;var revealIndex=this._activeEntryIndex-1;while(revealIndex>=0&&!this._entries[revealIndex].valid())
--revealIndex;if(revealIndex<0)
return false;this.readOnlyLock();this._entries[revealIndex].reveal();this.releaseReadOnlyLock();this._activeEntryIndex=revealIndex;return true;},rollover:function()
{var revealIndex=this._activeEntryIndex+1;while(revealIndex<this._entries.length&&!this._entries[revealIndex].valid())
++revealIndex;if(revealIndex>=this._entries.length)
return false;this.readOnlyLock();this._entries[revealIndex].reveal();this.releaseReadOnlyLock();this._activeEntryIndex=revealIndex;return true;},};;WebInspector.EditingLocationHistoryManager=function(sourcesView,currentSourceFrameCallback)
{this._sourcesView=sourcesView;this._historyManager=new WebInspector.SimpleHistoryManager(WebInspector.EditingLocationHistoryManager.HistoryDepth);this._currentSourceFrameCallback=currentSourceFrameCallback;}
WebInspector.EditingLocationHistoryManager.HistoryDepth=20;WebInspector.EditingLocationHistoryManager.prototype={trackSourceFrameCursorJumps:function(sourceFrame)
{sourceFrame.addEventListener(WebInspector.SourceFrame.Events.JumpHappened,this._onJumpHappened.bind(this));},_onJumpHappened:function(event)
{if(event.data.from)
this._updateActiveState(event.data.from);if(event.data.to)
this._pushActiveState(event.data.to);},rollback:function()
{this._historyManager.rollback();},rollover:function()
{this._historyManager.rollover();},updateCurrentState:function()
{var sourceFrame=this._currentSourceFrameCallback();if(!sourceFrame)
return;this._updateActiveState(sourceFrame.textEditor.selection());},pushNewState:function()
{var sourceFrame=this._currentSourceFrameCallback();if(!sourceFrame)
return;this._pushActiveState(sourceFrame.textEditor.selection());},_updateActiveState:function(selection)
{var active=this._historyManager.active();if(!active)
return;var sourceFrame=this._currentSourceFrameCallback();if(!sourceFrame)
return;var entry=new WebInspector.EditingLocationHistoryEntry(this._sourcesView,this,sourceFrame,selection);active.merge(entry);},_pushActiveState:function(selection)
{var sourceFrame=this._currentSourceFrameCallback();if(!sourceFrame)
return;var entry=new WebInspector.EditingLocationHistoryEntry(this._sourcesView,this,sourceFrame,selection);this._historyManager.push(entry);},removeHistoryForSourceCode:function(uiSourceCode)
{function filterOut(entry)
{return entry._projectId===uiSourceCode.project().id()&&entry._path===uiSourceCode.path();}
this._historyManager.filterOut(filterOut);},}
WebInspector.EditingLocationHistoryEntry=function(sourcesView,editingLocationManager,sourceFrame,selection)
{this._sourcesView=sourcesView;this._editingLocationManager=editingLocationManager;var uiSourceCode=sourceFrame.uiSourceCode();this._projectId=uiSourceCode.project().id();this._path=uiSourceCode.path();var position=this._positionFromSelection(selection);this._positionHandle=sourceFrame.textEditor.textEditorPositionHandle(position.lineNumber,position.columnNumber);}
WebInspector.EditingLocationHistoryEntry.prototype={merge:function(entry)
{if(this._projectId!==entry._projectId||this._path!==entry._path)
return;this._positionHandle=entry._positionHandle;},_positionFromSelection:function(selection)
{return{lineNumber:selection.endLine,columnNumber:selection.endColumn};},valid:function()
{var position=this._positionHandle.resolve();var uiSourceCode=WebInspector.workspace.project(this._projectId).uiSourceCode(this._path);return!!(position&&uiSourceCode);},reveal:function()
{var position=this._positionHandle.resolve();var uiSourceCode=WebInspector.workspace.project(this._projectId).uiSourceCode(this._path);if(!position||!uiSourceCode)
return;this._editingLocationManager.updateCurrentState();this._sourcesView.showSourceLocation(uiSourceCode,position.lineNumber,position.columnNumber);}};;WebInspector.FilePathScoreFunction=function(query)
{this._query=query;this._queryUpperCase=query.toUpperCase();this._score=null;this._sequence=null;this._dataUpperCase="";this._fileNameIndex=0;}
WebInspector.FilePathScoreFunction.filterRegex=function(query)
{const toEscape=String.regexSpecialCharacters();var regexString="";for(var i=0;i<query.length;++i){var c=query.charAt(i);if(toEscape.indexOf(c)!==-1)
c="\\"+c;if(i)
regexString+="[^"+c+"]*";regexString+=c;}
return new RegExp(regexString,"i");}
WebInspector.FilePathScoreFunction.prototype={score:function(data,matchIndexes)
{if(!data||!this._query)
return 0;var n=this._query.length;var m=data.length;if(!this._score||this._score.length<n*m){this._score=new Int32Array(n*m*2);this._sequence=new Int32Array(n*m*2);}
var score=this._score;var sequence=(this._sequence);this._dataUpperCase=data.toUpperCase();this._fileNameIndex=data.lastIndexOf("/");for(var i=0;i<n;++i){for(var j=0;j<m;++j){var skipCharScore=j===0?0:score[i*m+j-1];var prevCharScore=i===0||j===0?0:score[(i-1)*m+j-1];var consecutiveMatch=i===0||j===0?0:sequence[(i-1)*m+j-1];var pickCharScore=this._match(this._query,data,i,j,consecutiveMatch);if(pickCharScore&&prevCharScore+pickCharScore>skipCharScore){sequence[i*m+j]=consecutiveMatch+1;score[i*m+j]=(prevCharScore+pickCharScore);}else{sequence[i*m+j]=0;score[i*m+j]=skipCharScore;}}}
if(matchIndexes)
this._restoreMatchIndexes(sequence,n,m,matchIndexes);return score[n*m-1];},_testWordStart:function(data,j)
{var prevChar=data.charAt(j-1);return j===0||prevChar==="_"||prevChar==="-"||prevChar==="/"||(data[j-1]!==this._dataUpperCase[j-1]&&data[j]===this._dataUpperCase[j]);},_restoreMatchIndexes:function(sequence,n,m,out)
{var i=n-1,j=m-1;while(i>=0&&j>=0){switch(sequence[i*m+j]){case 0:--j;break;default:out.push(j);--i;--j;break;}}
out.reverse();},_singleCharScore:function(query,data,i,j)
{var isWordStart=this._testWordStart(data,j);var isFileName=j>this._fileNameIndex;var isPathTokenStart=j===0||data[j-1]==="/";var isCapsMatch=query[i]===data[j]&&query[i]==this._queryUpperCase[i];var score=10;if(isPathTokenStart)
score+=4;if(isWordStart)
score+=2;if(isCapsMatch)
score+=6;if(isFileName)
score+=4;if(j===this._fileNameIndex+1&&i===0)
score+=5;if(isFileName&&isWordStart)
score+=3;return score;},_sequenceCharScore:function(query,data,i,j,sequenceLength)
{var isFileName=j>this._fileNameIndex;var isPathTokenStart=j===0||data[j-1]==="/";var score=10;if(isFileName)
score+=4;if(isPathTokenStart)
score+=5;score+=sequenceLength*4;return score;},_match:function(query,data,i,j,consecutiveMatch)
{if(this._queryUpperCase[i]!==this._dataUpperCase[j])
return 0;if(!consecutiveMatch)
return this._singleCharScore(query,data,i,j);else
return this._sequenceCharScore(query,data,i,j-consecutiveMatch,consecutiveMatch);},};WebInspector.FilteredItemSelectionDialog=function(delegate)
{WebInspector.DialogDelegate.call(this);if(!WebInspector.FilteredItemSelectionDialog._stylesLoaded){WebInspector.View.createStyleElement("filteredItemSelectionDialog.css");WebInspector.FilteredItemSelectionDialog._stylesLoaded=true;}
this.element=document.createElement("div");this.element.className="filtered-item-list-dialog";this.element.addEventListener("keydown",this._onKeyDown.bind(this),false);this._promptElement=this.element.createChild("input","monospace");this._promptElement.addEventListener("input",this._onInput.bind(this),false);this._promptElement.type="text";this._promptElement.setAttribute("spellcheck","false");this._filteredItems=[];this._viewportControl=new WebInspector.ViewportControl(this);this._itemElementsContainer=this._viewportControl.element;this._itemElementsContainer.classList.add("container");this._itemElementsContainer.classList.add("monospace");this._itemElementsContainer.addEventListener("click",this._onClick.bind(this),false);this.element.appendChild(this._itemElementsContainer);this._delegate=delegate;this._delegate.setRefreshCallback(this._itemsLoaded.bind(this));this._itemsLoaded();}
WebInspector.FilteredItemSelectionDialog.prototype={position:function(element,relativeToElement)
{const shadow=10;const shadowPadding=20;var container=WebInspector.Dialog.modalHostView().element;var preferredWidth=Math.max(relativeToElement.offsetWidth*2/3,500);var width=Math.min(preferredWidth,container.offsetWidth-2*shadowPadding);var preferredHeight=Math.max(relativeToElement.offsetHeight*2/3,204);var height=Math.min(preferredHeight,container.offsetHeight-2*shadowPadding);this.element.style.width=width+"px";var box=relativeToElement.boxInWindow(window).relativeToElement(container);var positionX=box.x+Math.max((box.width-width-2*shadowPadding)/2,shadow);positionX=Math.max(shadow,Math.min(container.offsetWidth-width-2*shadowPadding,positionX));var positionY=box.y+Math.max((box.height-height-2*shadowPadding)/2,shadow);positionY=Math.max(shadow,Math.min(container.offsetHeight-height-2*shadowPadding,positionY));element.positionAt(positionX,positionY,container);this._dialogHeight=height;this._updateShowMatchingItems();this._viewportControl.refresh();},focus:function()
{WebInspector.setCurrentFocusElement(this._promptElement);if(this._filteredItems.length&&this._viewportControl.lastVisibleIndex()===-1)
this._viewportControl.refresh();},willHide:function()
{if(this._isHiding)
return;this._isHiding=true;this._delegate.dispose();if(this._filterTimer)
clearTimeout(this._filterTimer);},renderAsTwoRows:function()
{this._renderAsTwoRows=true;},onEnter:function()
{if(!this._delegate.itemCount())
return;var selectedIndex=this._shouldShowMatchingItems()&&this._selectedIndexInFiltered<this._filteredItems.length?this._filteredItems[this._selectedIndexInFiltered]:null;this._delegate.selectItem(selectedIndex,this._promptElement.value.trim());},_itemsLoaded:function()
{if(this._loadTimeout)
return;this._loadTimeout=setTimeout(this._updateAfterItemsLoaded.bind(this),0);},_updateAfterItemsLoaded:function()
{delete this._loadTimeout;this._filterItems();},_createItemElement:function(index)
{var itemElement=document.createElement("div");itemElement.className="filtered-item-list-dialog-item "+(this._renderAsTwoRows?"two-rows":"one-row");itemElement._titleElement=itemElement.createChild("div","filtered-item-list-dialog-title");itemElement._subtitleElement=itemElement.createChild("div","filtered-item-list-dialog-subtitle");itemElement._subtitleElement.textContent="\u200B";itemElement._index=index;this._delegate.renderItem(index,this._promptElement.value.trim(),itemElement._titleElement,itemElement._subtitleElement);return itemElement;},setQuery:function(query)
{this._promptElement.value=query;this._scheduleFilter();},_filterItems:function()
{delete this._filterTimer;if(this._scoringTimer){clearTimeout(this._scoringTimer);delete this._scoringTimer;}
var query=this._delegate.rewriteQuery(this._promptElement.value.trim());this._query=query;var queryLength=query.length;var filterRegex=query?WebInspector.FilePathScoreFunction.filterRegex(query):null;var oldSelectedAbsoluteIndex=this._selectedIndexInFiltered?this._filteredItems[this._selectedIndexInFiltered]:null;var filteredItems=[];this._selectedIndexInFiltered=0;var bestScores=[];var bestItems=[];var bestItemsToCollect=100;var minBestScore=0;var overflowItems=[];scoreItems.call(this,0);function compareIntegers(a,b)
{return b-a;}
function scoreItems(fromIndex)
{var maxWorkItems=1000;var workDone=0;for(var i=fromIndex;i<this._delegate.itemCount()&&workDone<maxWorkItems;++i){if(filterRegex&&!filterRegex.test(this._delegate.itemKeyAt(i)))
continue;var score=this._delegate.itemScoreAt(i,query);if(query)
workDone++;if(score>minBestScore||bestScores.length<bestItemsToCollect){var index=insertionIndexForObjectInListSortedByFunction(score,bestScores,compareIntegers,true);bestScores.splice(index,0,score);bestItems.splice(index,0,i);if(bestScores.length>bestItemsToCollect){overflowItems.push(bestItems.peekLast());bestScores.length=bestItemsToCollect;bestItems.length=bestItemsToCollect;}
minBestScore=bestScores.peekLast();}else
filteredItems.push(i);}
if(i<this._delegate.itemCount()){this._scoringTimer=setTimeout(scoreItems.bind(this,i),0);return;}
delete this._scoringTimer;this._filteredItems=bestItems.concat(overflowItems).concat(filteredItems);for(var i=0;i<this._filteredItems.length;++i){if(this._filteredItems[i]===oldSelectedAbsoluteIndex){this._selectedIndexInFiltered=i;break;}}
this._viewportControl.invalidate();if(!query)
this._selectedIndexInFiltered=0;this._updateSelection(this._selectedIndexInFiltered,false);}},_shouldShowMatchingItems:function()
{return this._delegate.shouldShowMatchingItems(this._promptElement.value);},_onInput:function(event)
{this._updateShowMatchingItems();this._scheduleFilter();},_updateShowMatchingItems:function()
{var shouldShowMatchingItems=this._shouldShowMatchingItems();this._itemElementsContainer.classList.toggle("hidden",!shouldShowMatchingItems);this.element.style.height=shouldShowMatchingItems?this._dialogHeight+"px":"auto";},_rowsPerViewport:function()
{return Math.floor(this._viewportControl.element.clientHeight/this._rowHeight);},_onKeyDown:function(event)
{var newSelectedIndex=this._selectedIndexInFiltered;switch(event.keyCode){case WebInspector.KeyboardShortcut.Keys.Down.code:if(++newSelectedIndex>=this._filteredItems.length)
newSelectedIndex=this._filteredItems.length-1;this._updateSelection(newSelectedIndex,true);event.consume(true);break;case WebInspector.KeyboardShortcut.Keys.Up.code:if(--newSelectedIndex<0)
newSelectedIndex=0;this._updateSelection(newSelectedIndex,false);event.consume(true);break;case WebInspector.KeyboardShortcut.Keys.PageDown.code:newSelectedIndex=Math.min(newSelectedIndex+this._rowsPerViewport(),this._filteredItems.length-1);this._updateSelection(newSelectedIndex,true);event.consume(true);break;case WebInspector.KeyboardShortcut.Keys.PageUp.code:newSelectedIndex=Math.max(newSelectedIndex-this._rowsPerViewport(),0);this._updateSelection(newSelectedIndex,false);event.consume(true);break;default:}},_scheduleFilter:function()
{if(this._filterTimer)
return;this._filterTimer=setTimeout(this._filterItems.bind(this),0);},_updateSelection:function(index,makeLast)
{if(!this._filteredItems.length)
return;var element=this._viewportControl.renderedElementAt(this._selectedIndexInFiltered);if(element)
element.classList.remove("selected");this._viewportControl.scrollItemIntoView(index,makeLast);this._selectedIndexInFiltered=index;element=this._viewportControl.renderedElementAt(index);if(element)
element.classList.add("selected");},_onClick:function(event)
{var itemElement=event.target.enclosingNodeOrSelfWithClass("filtered-item-list-dialog-item");if(!itemElement)
return;this._delegate.selectItem(itemElement._index,this._promptElement.value.trim());WebInspector.Dialog.hide();},itemCount:function()
{return this._filteredItems.length;},fastHeight:function(index)
{if(!this._rowHeight){var delegateIndex=this._filteredItems[index];var element=this._createItemElement(delegateIndex);this._rowHeight=element.measurePreferredSize(this._viewportControl.contentElement()).height;}
return this._rowHeight;},itemElement:function(index)
{var delegateIndex=this._filteredItems[index];var element=this._createItemElement(delegateIndex);if(index===this._selectedIndexInFiltered)
element.classList.add("selected");return new WebInspector.StaticViewportElement(element);},minimumRowHeight:function()
{return this.fastHeight(0);},__proto__:WebInspector.DialogDelegate.prototype}
WebInspector.SelectionDialogContentProvider=function()
{}
WebInspector.SelectionDialogContentProvider.prototype={setRefreshCallback:function(refreshCallback)
{this._refreshCallback=refreshCallback;},shouldShowMatchingItems:function(query)
{return true;},itemCount:function()
{return 0;},itemKeyAt:function(itemIndex)
{return"";},itemScoreAt:function(itemIndex,query)
{return 1;},renderItem:function(itemIndex,query,titleElement,subtitleElement)
{},highlightRanges:function(element,query)
{if(!query)
return false;function rangesForMatch(text,query)
{var sm=new difflib.SequenceMatcher(query,text);var opcodes=sm.get_opcodes();var ranges=[];for(var i=0;i<opcodes.length;++i){var opcode=opcodes[i];if(opcode[0]==="equal")
ranges.push(new WebInspector.SourceRange(opcode[3],opcode[4]-opcode[3]));else if(opcode[0]!=="insert")
return null;}
return ranges;}
var text=element.textContent;var ranges=rangesForMatch(text,query);if(!ranges)
ranges=rangesForMatch(text.toUpperCase(),query.toUpperCase());if(ranges){WebInspector.highlightRangesWithStyleClass(element,ranges,"highlight");return true;}
return false;},selectItem:function(itemIndex,promptValue)
{},refresh:function()
{this._refreshCallback();},rewriteQuery:function(query)
{return query;},dispose:function()
{}}
WebInspector.JavaScriptOutlineDialog=function(uiSourceCode,selectItemCallback)
{WebInspector.SelectionDialogContentProvider.call(this);this._functionItems=[];this._selectItemCallback=selectItemCallback;this._outlineWorker=Runtime.startWorker("script_formatter_worker");this._outlineWorker.onmessage=this._didBuildOutlineChunk.bind(this);this._outlineWorker.postMessage({method:"javaScriptOutline",params:{content:uiSourceCode.workingCopy()}});}
WebInspector.JavaScriptOutlineDialog.show=function(view,uiSourceCode,selectItemCallback)
{if(WebInspector.Dialog.currentInstance())
return;var filteredItemSelectionDialog=new WebInspector.FilteredItemSelectionDialog(new WebInspector.JavaScriptOutlineDialog(uiSourceCode,selectItemCallback));WebInspector.Dialog.show(view.element,filteredItemSelectionDialog);}
WebInspector.JavaScriptOutlineDialog.prototype={_didBuildOutlineChunk:function(event)
{var data=(event.data);var chunk=data.chunk;for(var i=0;i<chunk.length;++i)
this._functionItems.push(chunk[i]);if(data.total===data.index+1)
this.dispose();this.refresh();},itemCount:function()
{return this._functionItems.length;},itemKeyAt:function(itemIndex)
{return this._functionItems[itemIndex].name;},itemScoreAt:function(itemIndex,query)
{var item=this._functionItems[itemIndex];return-item.line;},renderItem:function(itemIndex,query,titleElement,subtitleElement)
{var item=this._functionItems[itemIndex];titleElement.textContent=item.name+(item.arguments?item.arguments:"");this.highlightRanges(titleElement,query);subtitleElement.textContent=":"+(item.line+1);},selectItem:function(itemIndex,promptValue)
{if(itemIndex===null)
return;var lineNumber=this._functionItems[itemIndex].line;if(!isNaN(lineNumber)&&lineNumber>=0)
this._selectItemCallback(lineNumber,this._functionItems[itemIndex].column);},dispose:function()
{if(this._outlineWorker){this._outlineWorker.terminate();delete this._outlineWorker;}},__proto__:WebInspector.SelectionDialogContentProvider.prototype}
WebInspector.SelectUISourceCodeDialog=function(defaultScores)
{WebInspector.SelectionDialogContentProvider.call(this);this._populate();this._defaultScores=defaultScores;this._scorer=new WebInspector.FilePathScoreFunction("");WebInspector.workspace.addEventListener(WebInspector.Workspace.Events.UISourceCodeAdded,this._uiSourceCodeAdded,this);WebInspector.workspace.addEventListener(WebInspector.Workspace.Events.ProjectRemoved,this._projectRemoved,this);}
WebInspector.SelectUISourceCodeDialog.prototype={_projectRemoved:function(event)
{var project=(event.data);this._populate(project);this.refresh();},_populate:function(skipProject)
{this._uiSourceCodes=[];var projects=WebInspector.workspace.projects().filter(this.filterProject.bind(this));for(var i=0;i<projects.length;++i){if(skipProject&&projects[i]===skipProject)
continue;this._uiSourceCodes=this._uiSourceCodes.concat(projects[i].uiSourceCodes());}},uiSourceCodeSelected:function(uiSourceCode,lineNumber,columnNumber)
{},filterProject:function(project)
{return true;},itemCount:function()
{return this._uiSourceCodes.length;},itemKeyAt:function(itemIndex)
{return this._uiSourceCodes[itemIndex].fullDisplayName();},itemScoreAt:function(itemIndex,query)
{var uiSourceCode=this._uiSourceCodes[itemIndex];var score=this._defaultScores?(this._defaultScores.get(uiSourceCode)||0):0;if(!query||query.length<2)
return score;if(this._query!==query){this._query=query;this._scorer=new WebInspector.FilePathScoreFunction(query);}
var path=uiSourceCode.fullDisplayName();return score+10*this._scorer.score(path,null);},renderItem:function(itemIndex,query,titleElement,subtitleElement)
{query=this.rewriteQuery(query);var uiSourceCode=this._uiSourceCodes[itemIndex];titleElement.textContent=uiSourceCode.displayName()+(this._queryLineNumberAndColumnNumber||"");subtitleElement.textContent=uiSourceCode.fullDisplayName().trimEnd(100);var indexes=[];var score=new WebInspector.FilePathScoreFunction(query).score(subtitleElement.textContent,indexes);var fileNameIndex=subtitleElement.textContent.lastIndexOf("/");var ranges=[];for(var i=0;i<indexes.length;++i)
ranges.push({offset:indexes[i],length:1});if(indexes[0]>fileNameIndex){for(var i=0;i<ranges.length;++i)
ranges[i].offset-=fileNameIndex+1;return WebInspector.highlightRangesWithStyleClass(titleElement,ranges,"highlight");}else{return WebInspector.highlightRangesWithStyleClass(subtitleElement,ranges,"highlight");}},selectItem:function(itemIndex,promptValue)
{var parsedExpression=promptValue.trim().match(/^([^:]*)(:\d+)?(:\d+)?$/);if(!parsedExpression)
return;var lineNumber;var columnNumber;if(parsedExpression[2])
lineNumber=parseInt(parsedExpression[2].substr(1),10)-1;if(parsedExpression[3])
columnNumber=parseInt(parsedExpression[3].substr(1),10)-1;var uiSourceCode=itemIndex!==null?this._uiSourceCodes[itemIndex]:null;this.uiSourceCodeSelected(uiSourceCode,lineNumber,columnNumber);},rewriteQuery:function(query)
{if(!query)
return query;query=query.trim();var lineNumberMatch=query.match(/^([^:]+)((?::[^:]*){0,2})$/);this._queryLineNumberAndColumnNumber=lineNumberMatch?lineNumberMatch[2]:"";return lineNumberMatch?lineNumberMatch[1]:query;},_uiSourceCodeAdded:function(event)
{var uiSourceCode=(event.data);if(!this.filterProject(uiSourceCode.project()))
return;this._uiSourceCodes.push(uiSourceCode)
this.refresh();},dispose:function()
{WebInspector.workspace.removeEventListener(WebInspector.Workspace.Events.UISourceCodeAdded,this._uiSourceCodeAdded,this);WebInspector.workspace.removeEventListener(WebInspector.Workspace.Events.ProjectRemoved,this._projectRemoved,this);},__proto__:WebInspector.SelectionDialogContentProvider.prototype}
WebInspector.OpenResourceDialog=function(sourcesView,defaultScores)
{WebInspector.SelectUISourceCodeDialog.call(this,defaultScores);this._sourcesView=sourcesView;}
WebInspector.OpenResourceDialog.prototype={uiSourceCodeSelected:function(uiSourceCode,lineNumber,columnNumber)
{if(!uiSourceCode)
uiSourceCode=this._sourcesView.currentUISourceCode();if(!uiSourceCode)
return;this._sourcesView.showSourceLocation(uiSourceCode,lineNumber,columnNumber);},shouldShowMatchingItems:function(query)
{return!query.startsWith(":");},filterProject:function(project)
{return!project.isServiceProject();},__proto__:WebInspector.SelectUISourceCodeDialog.prototype}
WebInspector.OpenResourceDialog.show=function(sourcesView,relativeToElement,query,defaultScores)
{if(WebInspector.Dialog.currentInstance())
return;var filteredItemSelectionDialog=new WebInspector.FilteredItemSelectionDialog(new WebInspector.OpenResourceDialog(sourcesView,defaultScores));filteredItemSelectionDialog.renderAsTwoRows();WebInspector.Dialog.show(relativeToElement,filteredItemSelectionDialog);if(query)
filteredItemSelectionDialog.setQuery(query);}
WebInspector.SelectUISourceCodeForProjectTypesDialog=function(types,callback)
{this._types=types;WebInspector.SelectUISourceCodeDialog.call(this);this._callback=callback;}
WebInspector.SelectUISourceCodeForProjectTypesDialog.prototype={uiSourceCodeSelected:function(uiSourceCode,lineNumber,columnNumber)
{this._callback(uiSourceCode);},filterProject:function(project)
{return this._types.indexOf(project.type())!==-1;},__proto__:WebInspector.SelectUISourceCodeDialog.prototype}
WebInspector.SelectUISourceCodeForProjectTypesDialog.show=function(name,types,callback,relativeToElement)
{if(WebInspector.Dialog.currentInstance())
return;var filteredItemSelectionDialog=new WebInspector.FilteredItemSelectionDialog(new WebInspector.SelectUISourceCodeForProjectTypesDialog(types,callback));filteredItemSelectionDialog.setQuery(name);filteredItemSelectionDialog.renderAsTwoRows();WebInspector.Dialog.show(relativeToElement,filteredItemSelectionDialog);}
WebInspector.JavaScriptOutlineDialog.MessageEventData;;WebInspector.UISourceCodeFrame=function(uiSourceCode)
{this._uiSourceCode=uiSourceCode;WebInspector.SourceFrame.call(this,this._uiSourceCode);WebInspector.settings.textEditorAutocompletion.addChangeListener(this._enableAutocompletionIfNeeded,this);this._enableAutocompletionIfNeeded();this._uiSourceCode.addEventListener(WebInspector.UISourceCode.Events.WorkingCopyChanged,this._onWorkingCopyChanged,this);this._uiSourceCode.addEventListener(WebInspector.UISourceCode.Events.WorkingCopyCommitted,this._onWorkingCopyCommitted,this);this._updateStyle();}
WebInspector.UISourceCodeFrame.prototype={uiSourceCode:function()
{return this._uiSourceCode;},_enableAutocompletionIfNeeded:function()
{this.textEditor.setCompletionDictionary(WebInspector.settings.textEditorAutocompletion.get()?new WebInspector.SampleCompletionDictionary():null);},wasShown:function()
{WebInspector.SourceFrame.prototype.wasShown.call(this);this._boundWindowFocused=this._windowFocused.bind(this);window.addEventListener("focus",this._boundWindowFocused,false);this._checkContentUpdated();},willHide:function()
{WebInspector.SourceFrame.prototype.willHide.call(this);window.removeEventListener("focus",this._boundWindowFocused,false);delete this._boundWindowFocused;this._uiSourceCode.removeWorkingCopyGetter();},canEditSource:function()
{var projectType=this._uiSourceCode.project().type();if(projectType===WebInspector.projectTypes.Debugger||projectType===WebInspector.projectTypes.Formatter)
return false;if(projectType===WebInspector.projectTypes.Network&&this._uiSourceCode.contentType()===WebInspector.resourceTypes.Document)
return false;return true;},_windowFocused:function(event)
{this._checkContentUpdated();},_checkContentUpdated:function()
{if(!this.loaded||!this.isShowing())
return;this._uiSourceCode.checkContentUpdated();},commitEditing:function()
{if(!this._uiSourceCode.isDirty())
return;this._muteSourceCodeEvents=true;this._uiSourceCode.commitWorkingCopy();delete this._muteSourceCodeEvents;},onTextChanged:function(oldRange,newRange)
{WebInspector.SourceFrame.prototype.onTextChanged.call(this,oldRange,newRange);if(this._isSettingContent)
return;this._muteSourceCodeEvents=true;if(this._textEditor.isClean())
this._uiSourceCode.resetWorkingCopy();else
this._uiSourceCode.setWorkingCopyGetter(this._textEditor.text.bind(this._textEditor));delete this._muteSourceCodeEvents;},_onWorkingCopyChanged:function(event)
{if(this._muteSourceCodeEvents)
return;this._innerSetContent(this._uiSourceCode.workingCopy());this.onUISourceCodeContentChanged();},_onWorkingCopyCommitted:function(event)
{if(!this._muteSourceCodeEvents){this._innerSetContent(this._uiSourceCode.workingCopy());this.onUISourceCodeContentChanged();}
this._textEditor.markClean();this._updateStyle();WebInspector.notifications.dispatchEventToListeners(WebInspector.UserMetrics.UserAction,{action:WebInspector.UserMetrics.UserActionNames.FileSaved,url:this._uiSourceCode.url});},_updateStyle:function()
{this.element.classList.toggle("source-frame-unsaved-committed-changes",this._uiSourceCode.hasUnsavedCommittedChanges());},onUISourceCodeContentChanged:function()
{},_innerSetContent:function(content)
{this._isSettingContent=true;this.setContent(content);delete this._isSettingContent;},populateTextAreaContextMenu:function(contextMenu,lineNumber)
{WebInspector.SourceFrame.prototype.populateTextAreaContextMenu.call(this,contextMenu,lineNumber);contextMenu.appendApplicableItems(this._uiSourceCode);contextMenu.appendSeparator();},attachInfobars:function(infobars)
{for(var i=infobars.length-1;i>=0;--i){var infobar=infobars[i];if(!infobar)
continue;this.element.insertBefore(infobar.element,this.element.children[0]);infobar._attached(this);}
this.doResize();},dispose:function()
{WebInspector.settings.textEditorAutocompletion.removeChangeListener(this._enableAutocompletionIfNeeded,this);this._textEditor.dispose();this.detach();},__proto__:WebInspector.SourceFrame.prototype}
WebInspector.UISourceCodeFrame.Infobar=function(message)
{this.element=document.createElementWithClass("div","source-frame-infobar");this._mainRow=this.element.createChild("div","source-frame-infobar-main-row");this._detailsContainer=this.element.createChild("span","source-frame-infobar-details-container");this._mainRow.createChild("span","source-frame-infobar-warning-icon");this._mainRow.createChild("span","source-frame-infobar-row-message").textContent=message;this._toggleElement=this._mainRow.createChild("div","source-frame-infobar-toggle source-frame-infobar-link");this._toggleElement.addEventListener("click",this._onToggleDetails.bind(this),false);this._updateToggleElement();}
WebInspector.UISourceCodeFrame.Infobar.prototype={_onResize:function()
{if(this._uiSourceCodeFrame)
this._uiSourceCodeFrame.doResize();},_onToggleDetails:function()
{this._toggled=!this._toggled;this._updateToggleElement();this._onResize();},_updateToggleElement:function()
{this._toggleElement.textContent=this._toggled?WebInspector.UIString("less"):WebInspector.UIString("more");this._detailsContainer.classList.toggle("hidden",!this._toggled);},_attached:function(uiSourceCodeFrame)
{this._uiSourceCodeFrame=uiSourceCodeFrame;},createDetailsRowMessage:function(message)
{var infobarDetailsRow=this._detailsContainer.createChild("div","source-frame-infobar-details-row");var detailsRowMessage=infobarDetailsRow.createChild("span","source-frame-infobar-row-message");detailsRowMessage.textContent=message||"";return detailsRowMessage;},dispose:function()
{this.element.remove();this._onResize();delete this._uiSourceCodeFrame;}};WebInspector.JavaScriptSourceFrame=function(scriptsPanel,uiSourceCode)
{this._scriptsPanel=scriptsPanel;this._breakpointManager=WebInspector.breakpointManager;this._uiSourceCode=uiSourceCode;WebInspector.UISourceCodeFrame.call(this,uiSourceCode);if(uiSourceCode.project().type()===WebInspector.projectTypes.Debugger)
this.element.classList.add("source-frame-debugger-script");this._popoverHelper=new WebInspector.ObjectPopoverHelper(this.textEditor.element,this._getPopoverAnchor.bind(this),this._resolveObjectForPopover.bind(this),this._onHidePopover.bind(this),true);this.textEditor.element.addEventListener("keydown",this._onKeyDown.bind(this),true);this.textEditor.addEventListener(WebInspector.TextEditor.Events.GutterClick,this._handleGutterClick.bind(this),this);this._breakpointManager.addEventListener(WebInspector.BreakpointManager.Events.BreakpointAdded,this._breakpointAdded,this);this._breakpointManager.addEventListener(WebInspector.BreakpointManager.Events.BreakpointRemoved,this._breakpointRemoved,this);WebInspector.presentationConsoleMessageHelper.addConsoleMessageEventListener(WebInspector.PresentationConsoleMessageHelper.Events.ConsoleMessageAdded,this._uiSourceCode,this._consoleMessageAdded,this);WebInspector.presentationConsoleMessageHelper.addConsoleMessageEventListener(WebInspector.PresentationConsoleMessageHelper.Events.ConsoleMessageRemoved,this._uiSourceCode,this._consoleMessageRemoved,this);WebInspector.presentationConsoleMessageHelper.addConsoleMessageEventListener(WebInspector.PresentationConsoleMessageHelper.Events.ConsoleMessagesCleared,this._uiSourceCode,this._consoleMessagesCleared,this);this._uiSourceCode.addEventListener(WebInspector.UISourceCode.Events.SourceMappingChanged,this._onSourceMappingChanged,this);this._uiSourceCode.addEventListener(WebInspector.UISourceCode.Events.WorkingCopyChanged,this._workingCopyChanged,this);this._uiSourceCode.addEventListener(WebInspector.UISourceCode.Events.WorkingCopyCommitted,this._workingCopyCommitted,this);this._uiSourceCode.addEventListener(WebInspector.UISourceCode.Events.TitleChanged,this._showBlackboxInfobarIfNeeded,this);this._scriptFileForTarget=new Map();this._registerShortcuts();var targets=WebInspector.targetManager.targets();for(var i=0;i<targets.length;++i){var scriptFile=WebInspector.debuggerWorkspaceBinding.scriptFile(uiSourceCode,targets[i]);if(scriptFile)
this._updateScriptFile(targets[i]);}
WebInspector.settings.skipStackFramesPattern.addChangeListener(this._showBlackboxInfobarIfNeeded,this);WebInspector.settings.skipContentScripts.addChangeListener(this._showBlackboxInfobarIfNeeded,this);this._showBlackboxInfobarIfNeeded();}
WebInspector.JavaScriptSourceFrame.prototype={_updateInfobars:function()
{this.attachInfobars([this._blackboxInfobar,this._divergedInfobar]);},_showDivergedInfobar:function()
{if(this._uiSourceCode.contentType()!==WebInspector.resourceTypes.Script)
return;if(this._divergedInfobar)
this._divergedInfobar.dispose();var infobar=new WebInspector.UISourceCodeFrame.Infobar(WebInspector.UIString("Workspace mapping mismatch"));this._divergedInfobar=infobar;var fileURL=this._uiSourceCode.originURL();infobar.createDetailsRowMessage(WebInspector.UIString("The content of this file on the file system:\u00a0")).appendChild(WebInspector.linkifyURLAsNode(fileURL,fileURL,"source-frame-infobar-details-url",true,fileURL));var scriptURL=this._uiSourceCode.url;infobar.createDetailsRowMessage(WebInspector.UIString("does not match the loaded script:\u00a0")).appendChild(WebInspector.linkifyURLAsNode(scriptURL,scriptURL,"source-frame-infobar-details-url",true,scriptURL));infobar.createDetailsRowMessage();infobar.createDetailsRowMessage(WebInspector.UIString("Possible solutions are:"));if(WebInspector.settings.cacheDisabled.get())
infobar.createDetailsRowMessage(" - ").createTextChild(WebInspector.UIString("Reload inspected page"));else
infobar.createDetailsRowMessage(" - ").createTextChild(WebInspector.UIString("Check \"Disable cache\" in settings and reload inspected page (recommended setup for authoring and debugging)"));infobar.createDetailsRowMessage(" - ").createTextChild(WebInspector.UIString("Check that your file and script are both loaded from the correct source and their contents match"));this._updateInfobars();},_hideDivergedInfobar:function()
{if(!this._divergedInfobar)
return;this._divergedInfobar.dispose();delete this._divergedInfobar;},_showBlackboxInfobarIfNeeded:function()
{if(this._uiSourceCode.contentType()!==WebInspector.resourceTypes.Script)
return;var url=this._uiSourceCode.url;var isContentScript=this._uiSourceCode.project().type()===WebInspector.projectTypes.ContentScripts;if(!WebInspector.BlackboxSupport.isBlackboxed(url,isContentScript)){this._hideBlackboxInfobar();return;}
if(this._blackboxInfobar)
this._blackboxInfobar.dispose();var infobar=new WebInspector.UISourceCodeFrame.Infobar(WebInspector.UIString("This script is blackboxed in debugger"));this._blackboxInfobar=infobar;infobar.createDetailsRowMessage(WebInspector.UIString("Debugger will skip stepping through this script, and will not stop on exceptions"));infobar.createDetailsRowMessage();infobar.createDetailsRowMessage(WebInspector.UIString("Possible ways to cancel this behavior are:"));infobar.createDetailsRowMessage(" - ").createTextChild(WebInspector.UIString("Press \"%s\" button in settings",WebInspector.manageBlackboxingButtonLabel()));var unblackboxLink=infobar.createDetailsRowMessage(" - ").createChild("span","source-frame-infobar-link");unblackboxLink.textContent=WebInspector.UIString("Unblackbox this script");unblackboxLink.addEventListener("click",unblackbox,false);function unblackbox()
{WebInspector.BlackboxSupport.unblackbox(url,isContentScript);}
this._updateInfobars();},_hideBlackboxInfobar:function()
{if(!this._blackboxInfobar)
return;this._blackboxInfobar.dispose();delete this._blackboxInfobar;},_registerShortcuts:function()
{var shortcutKeys=WebInspector.ShortcutsScreen.SourcesPanelShortcuts;for(var i=0;i<shortcutKeys.EvaluateSelectionInConsole.length;++i){var keyDescriptor=shortcutKeys.EvaluateSelectionInConsole[i];this.addShortcut(keyDescriptor.key,this._evaluateSelectionInConsole.bind(this));}
for(var i=0;i<shortcutKeys.AddSelectionToWatch.length;++i){var keyDescriptor=shortcutKeys.AddSelectionToWatch[i];this.addShortcut(keyDescriptor.key,this._addCurrentSelectionToWatch.bind(this));}},_addCurrentSelectionToWatch:function()
{var textSelection=this.textEditor.selection();if(textSelection&&!textSelection.isEmpty())
this._innerAddToWatch(this.textEditor.copyRange(textSelection));return true;},_innerAddToWatch:function(expression)
{this._scriptsPanel.addToWatch(expression);},_evaluateSelectionInConsole:function()
{var selection=this.textEditor.selection();if(!selection||selection.isEmpty())
return true;this._evaluateInConsole(this.textEditor.copyRange(selection));return true;},_evaluateInConsole:function(expression)
{var currentExecutionContext=WebInspector.context.flavor(WebInspector.ExecutionContext);if(currentExecutionContext)
WebInspector.ConsoleModel.evaluateCommandInConsole(currentExecutionContext,expression);},wasShown:function()
{WebInspector.UISourceCodeFrame.prototype.wasShown.call(this);},willHide:function()
{WebInspector.UISourceCodeFrame.prototype.willHide.call(this);this._popoverHelper.hidePopover();},onUISourceCodeContentChanged:function()
{this._removeAllBreakpoints();WebInspector.UISourceCodeFrame.prototype.onUISourceCodeContentChanged.call(this);},onTextChanged:function(oldRange,newRange)
{this._scriptsPanel.setIgnoreExecutionLineEvents(true);WebInspector.UISourceCodeFrame.prototype.onTextChanged.call(this,oldRange,newRange);this._scriptsPanel.setIgnoreExecutionLineEvents(false);},populateLineGutterContextMenu:function(contextMenu,lineNumber)
{contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Continue to here":"Continue to Here"),this._continueToLine.bind(this,lineNumber));var breakpoint=this._breakpointManager.findBreakpointOnLine(this._uiSourceCode,lineNumber);if(!breakpoint){contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Add breakpoint":"Add Breakpoint"),this._setBreakpoint.bind(this,lineNumber,0,"",true));contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Add conditional breakpoint…":"Add Conditional Breakpoint…"),this._editBreakpointCondition.bind(this,lineNumber));}else{contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Remove breakpoint":"Remove Breakpoint"),breakpoint.remove.bind(breakpoint));contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Edit breakpoint…":"Edit Breakpoint…"),this._editBreakpointCondition.bind(this,lineNumber,breakpoint));if(breakpoint.enabled())
contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Disable breakpoint":"Disable Breakpoint"),breakpoint.setEnabled.bind(breakpoint,false));else
contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Enable breakpoint":"Enable Breakpoint"),breakpoint.setEnabled.bind(breakpoint,true));}},populateTextAreaContextMenu:function(contextMenu,lineNumber)
{var textSelection=this.textEditor.selection();if(textSelection&&!textSelection.isEmpty()){var selection=this.textEditor.copyRange(textSelection);var addToWatchLabel=WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Add to watch":"Add to Watch");contextMenu.appendItem(addToWatchLabel,this._innerAddToWatch.bind(this,selection));var evaluateLabel=WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Evaluate in console":"Evaluate in Console");contextMenu.appendItem(evaluateLabel,this._evaluateInConsole.bind(this,selection));contextMenu.appendSeparator();}else if(this._uiSourceCode.project().type()===WebInspector.projectTypes.Debugger){var liveEditLabel=WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Live edit":"Live Edit");var liveEditSupport=WebInspector.LiveEditSupport.liveEditSupportForUISourceCode(this._uiSourceCode);if(!liveEditSupport)
return;contextMenu.appendItem(liveEditLabel,liveEdit.bind(this,liveEditSupport));contextMenu.appendSeparator();}
function liveEdit(liveEditSupport)
{var liveEditUISourceCode=liveEditSupport.uiSourceCodeForLiveEdit(this._uiSourceCode);if(!liveEditUISourceCode)
return;WebInspector.Revealer.reveal(liveEditUISourceCode.uiLocation(lineNumber));}
function addSourceMapURL(scriptFile)
{WebInspector.AddSourceMapURLDialog.show(this.element,addSourceMapURLDialogCallback.bind(null,scriptFile));}
function addSourceMapURLDialogCallback(scriptFile,url)
{if(!url)
return;scriptFile.addSourceMapURL(url);}
WebInspector.UISourceCodeFrame.prototype.populateTextAreaContextMenu.call(this,contextMenu,lineNumber);if(this._uiSourceCode.project().type()===WebInspector.projectTypes.Network&&WebInspector.settings.jsSourceMapsEnabled.get()){if(this._scriptFileForTarget.size){var scriptFile=this._scriptFileForTarget.values()[0];var addSourceMapURLLabel=WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Add source map\u2026":"Add Source Map\u2026");contextMenu.appendItem(addSourceMapURLLabel,addSourceMapURL.bind(this,scriptFile));contextMenu.appendSeparator();}}},_workingCopyChanged:function(event)
{if(this._supportsEnabledBreakpointsWhileEditing()||this._scriptFileForTarget.size)
return;if(this._uiSourceCode.isDirty())
this._muteBreakpointsWhileEditing();else
this._restoreBreakpointsAfterEditing();},_workingCopyCommitted:function(event)
{if(this._supportsEnabledBreakpointsWhileEditing())
return;if(!this._scriptFileForTarget.size){this._restoreBreakpointsAfterEditing();return;}
var liveEditError;var liveEditErrorData;var contextScript;var succeededEdits=0;var failedEdits=0;function liveEditCallback(error,errorData,script)
{if(error){liveEditError=error;liveEditErrorData=errorData;contextScript=script;failedEdits++;}else
succeededEdits++;if(succeededEdits+failedEdits!==scriptFiles.length)
return;if(!failedEdits)
WebInspector.LiveEditSupport.logSuccess();else
WebInspector.LiveEditSupport.logDetailedError(liveEditError,liveEditErrorData,contextScript)
this._scriptsPanel.setIgnoreExecutionLineEvents(false);}
this._scriptsPanel.setIgnoreExecutionLineEvents(true);this._hasCommittedLiveEdit=true;var scriptFiles=this._scriptFileForTarget.values();for(var i=0;i<scriptFiles.length;++i)
scriptFiles[i].commitLiveEdit(liveEditCallback.bind(this));},_didMergeToVM:function()
{if(this._supportsEnabledBreakpointsWhileEditing())
return;this._updateDivergedInfobar();this._restoreBreakpointsIfConsistentScripts();},_didDivergeFromVM:function()
{if(this._supportsEnabledBreakpointsWhileEditing())
return;this._updateDivergedInfobar();this._muteBreakpointsWhileEditing();},_muteBreakpointsWhileEditing:function()
{if(this._muted)
return;for(var lineNumber=0;lineNumber<this._textEditor.linesCount;++lineNumber){var breakpointDecoration=this._textEditor.getAttribute(lineNumber,"breakpoint");if(!breakpointDecoration)
continue;this._removeBreakpointDecoration(lineNumber);this._addBreakpointDecoration(lineNumber,breakpointDecoration.columnNumber,breakpointDecoration.condition,breakpointDecoration.enabled,true);}
this._muted=true;},_updateDivergedInfobar:function()
{if(this._uiSourceCode.project().type()!==WebInspector.projectTypes.FileSystem){this._hideDivergedInfobar();return;}
var scriptFiles=this._scriptFileForTarget.values();var hasDivergedScript=false;for(var i=0;i<scriptFiles.length;++i)
hasDivergedScript=hasDivergedScript||scriptFiles[i].hasDivergedFromVM();if(this._divergedInfobar){if(!hasDivergedScript||this._hasCommittedLiveEdit)
this._hideDivergedInfobar();}else{if(hasDivergedScript&&!this._uiSourceCode.isDirty()&&!this._hasCommittedLiveEdit)
this._showDivergedInfobar();}},_supportsEnabledBreakpointsWhileEditing:function()
{return this._uiSourceCode.project().type()===WebInspector.projectTypes.Snippets;},_restoreBreakpointsIfConsistentScripts:function()
{var scriptFiles=this._scriptFileForTarget.values();for(var i=0;i<scriptFiles.length;++i)
if(scriptFiles[i].hasDivergedFromVM()||scriptFiles[i].isMergingToVM())
return;this._restoreBreakpointsAfterEditing();},_restoreBreakpointsAfterEditing:function()
{delete this._muted;var breakpoints={};for(var lineNumber=0;lineNumber<this._textEditor.linesCount;++lineNumber){var breakpointDecoration=this._textEditor.getAttribute(lineNumber,"breakpoint");if(breakpointDecoration){breakpoints[lineNumber]=breakpointDecoration;this._removeBreakpointDecoration(lineNumber);}}
this._removeAllBreakpoints();for(var lineNumberString in breakpoints){var lineNumber=parseInt(lineNumberString,10);if(isNaN(lineNumber))
continue;var breakpointDecoration=breakpoints[lineNumberString];this._setBreakpoint(lineNumber,breakpointDecoration.columnNumber,breakpointDecoration.condition,breakpointDecoration.enabled);}},_removeAllBreakpoints:function()
{var breakpoints=this._breakpointManager.breakpointsForUISourceCode(this._uiSourceCode);for(var i=0;i<breakpoints.length;++i)
breakpoints[i].remove();},_getPopoverAnchor:function(element,event)
{var target=WebInspector.context.flavor(WebInspector.Target);if(!target||!target.debuggerModel.isPaused())
return;var textPosition=this.textEditor.coordinatesToCursorPosition(event.x,event.y);if(!textPosition)
return;var mouseLine=textPosition.startLine;var mouseColumn=textPosition.startColumn;var textSelection=this.textEditor.selection().normalize();if(textSelection&&!textSelection.isEmpty()){if(textSelection.startLine!==textSelection.endLine||textSelection.startLine!==mouseLine||mouseColumn<textSelection.startColumn||mouseColumn>textSelection.endColumn)
return;var leftCorner=this.textEditor.cursorPositionToCoordinates(textSelection.startLine,textSelection.startColumn);var rightCorner=this.textEditor.cursorPositionToCoordinates(textSelection.endLine,textSelection.endColumn);var anchorBox=new AnchorBox(leftCorner.x,leftCorner.y,rightCorner.x-leftCorner.x,leftCorner.height);anchorBox.highlight={lineNumber:textSelection.startLine,startColumn:textSelection.startColumn,endColumn:textSelection.endColumn-1};anchorBox.forSelection=true;return anchorBox;}
var token=this.textEditor.tokenAtTextPosition(textPosition.startLine,textPosition.startColumn);if(!token)
return;var lineNumber=textPosition.startLine;var line=this.textEditor.line(lineNumber);var tokenContent=line.substring(token.startColumn,token.endColumn);var isIdentifier=token.type.startsWith("js-variable")||token.type.startsWith("js-property")||token.type=="js-def";if(!isIdentifier&&(token.type!=="js-keyword"||tokenContent!=="this"))
return;var leftCorner=this.textEditor.cursorPositionToCoordinates(lineNumber,token.startColumn);var rightCorner=this.textEditor.cursorPositionToCoordinates(lineNumber,token.endColumn-1);var anchorBox=new AnchorBox(leftCorner.x,leftCorner.y,rightCorner.x-leftCorner.x,leftCorner.height);anchorBox.highlight={lineNumber:lineNumber,startColumn:token.startColumn,endColumn:token.endColumn-1};return anchorBox;},_resolveObjectForPopover:function(anchorBox,showCallback,objectGroupName)
{var target=WebInspector.context.flavor(WebInspector.Target);if(!target||!target.debuggerModel.isPaused()){this._popoverHelper.hidePopover();return;}
var lineNumber=anchorBox.highlight.lineNumber;var startHighlight=anchorBox.highlight.startColumn;var endHighlight=anchorBox.highlight.endColumn;var line=this.textEditor.line(lineNumber);if(!anchorBox.forSelection){while(startHighlight>1&&line.charAt(startHighlight-1)==='.'){var token=this.textEditor.tokenAtTextPosition(lineNumber,startHighlight-2);if(!token){this._popoverHelper.hidePopover();return;}
startHighlight=token.startColumn;}}
var evaluationText=line.substring(startHighlight,endHighlight+1);var selectedCallFrame=target.debuggerModel.selectedCallFrame();selectedCallFrame.evaluate(evaluationText,objectGroupName,false,true,false,false,showObjectPopover.bind(this));function showObjectPopover(result,wasThrown)
{var target=WebInspector.context.flavor(WebInspector.Target);if(selectedCallFrame.target()!=target||!target.debuggerModel.isPaused()||!result){this._popoverHelper.hidePopover();return;}
this._popoverAnchorBox=anchorBox;showCallback(target.runtimeModel.createRemoteObject(result),wasThrown,this._popoverAnchorBox);if(this._popoverAnchorBox){var highlightRange=new WebInspector.TextRange(lineNumber,startHighlight,lineNumber,endHighlight);this._popoverAnchorBox._highlightDescriptor=this.textEditor.highlightRange(highlightRange,"source-frame-eval-expression");}}},_onHidePopover:function()
{if(!this._popoverAnchorBox)
return;if(this._popoverAnchorBox._highlightDescriptor)
this.textEditor.removeHighlight(this._popoverAnchorBox._highlightDescriptor);delete this._popoverAnchorBox;},_addBreakpointDecoration:function(lineNumber,columnNumber,condition,enabled,mutedWhileEditing)
{var breakpoint={condition:condition,enabled:enabled,columnNumber:columnNumber};this.textEditor.setAttribute(lineNumber,"breakpoint",breakpoint);var disabled=!enabled||mutedWhileEditing;this.textEditor.addBreakpoint(lineNumber,disabled,!!condition);},_removeBreakpointDecoration:function(lineNumber)
{this.textEditor.removeAttribute(lineNumber,"breakpoint");this.textEditor.removeBreakpoint(lineNumber);},_onKeyDown:function(event)
{if(event.keyIdentifier==="U+001B"){if(this._popoverHelper.isPopoverVisible()){this._popoverHelper.hidePopover();event.consume();}}},_editBreakpointCondition:function(lineNumber,breakpoint)
{this._conditionElement=this._createConditionElement(lineNumber);this.textEditor.addDecoration(lineNumber,this._conditionElement);function finishEditing(committed,element,newText)
{this.textEditor.removeDecoration(lineNumber,this._conditionElement);delete this._conditionEditorElement;delete this._conditionElement;if(!committed)
return;if(breakpoint)
breakpoint.setCondition(newText);else
this._setBreakpoint(lineNumber,0,newText,true);}
var config=new WebInspector.InplaceEditor.Config(finishEditing.bind(this,true),finishEditing.bind(this,false));WebInspector.InplaceEditor.startEditing(this._conditionEditorElement,config);this._conditionEditorElement.value=breakpoint?breakpoint.condition():"";this._conditionEditorElement.select();},_createConditionElement:function(lineNumber)
{var conditionElement=document.createElementWithClass("div","source-frame-breakpoint-condition");var labelElement=conditionElement.createChild("label","source-frame-breakpoint-message");labelElement.htmlFor="source-frame-breakpoint-condition";labelElement.createTextChild(WebInspector.UIString("The breakpoint on line %d will stop only if this expression is true:",lineNumber+1));var editorElement=conditionElement.createChild("input","monospace");editorElement.id="source-frame-breakpoint-condition";editorElement.type="text";this._conditionEditorElement=editorElement;return conditionElement;},setExecutionLine:function(lineNumber)
{this._executionLineNumber=lineNumber;if(this.loaded)
this.textEditor.setExecutionLine(lineNumber);},clearExecutionLine:function()
{if(this.loaded&&typeof this._executionLineNumber==="number")
this.textEditor.clearExecutionLine();delete this._executionLineNumber;},_shouldIgnoreExternalBreakpointEvents:function()
{if(this._supportsEnabledBreakpointsWhileEditing())
return false;if(this._muted)
return true;var scriptFiles=this._scriptFileForTarget.values();var hasDivergingOrMergingFile=false;for(var i=0;i<scriptFiles.length;++i)
if(scriptFiles[i].isDivergingFromVM()||scriptFiles[i].isMergingToVM())
return true;return false;},_breakpointAdded:function(event)
{var uiLocation=(event.data.uiLocation);if(uiLocation.uiSourceCode!==this._uiSourceCode)
return;if(this._shouldIgnoreExternalBreakpointEvents())
return;var breakpoint=(event.data.breakpoint);if(this.loaded)
this._addBreakpointDecoration(uiLocation.lineNumber,uiLocation.columnNumber,breakpoint.condition(),breakpoint.enabled(),false);},_breakpointRemoved:function(event)
{var uiLocation=(event.data.uiLocation);if(uiLocation.uiSourceCode!==this._uiSourceCode)
return;if(this._shouldIgnoreExternalBreakpointEvents())
return;var breakpoint=(event.data.breakpoint);var remainingBreakpoint=this._breakpointManager.findBreakpointOnLine(this._uiSourceCode,uiLocation.lineNumber);if(!remainingBreakpoint&&this.loaded)
this._removeBreakpointDecoration(uiLocation.lineNumber);},_consoleMessageAdded:function(event)
{var message=(event.data);if(this.loaded)
this.addMessageToSource(message.lineNumber,message.originalMessage);},_consoleMessageRemoved:function(event)
{var message=(event.data);if(this.loaded)
this.removeMessageFromSource(message.lineNumber,message.originalMessage);},_consoleMessagesCleared:function(event)
{this.clearMessages();},_onSourceMappingChanged:function(event)
{var data=(event.data);this._updateScriptFile(data.target);this._updateLinesWithoutMappingHighlight();},_updateLinesWithoutMappingHighlight:function()
{var linesCount=this.textEditor.linesCount;for(var i=0;i<linesCount;++i)
this.textEditor.toggleLineClass(i,"cm-line-without-source-mapping",!WebInspector.debuggerWorkspaceBinding.uiLineHasMapping(this._uiSourceCode,i));},_updateScriptFile:function(target)
{var oldScriptFile=this._scriptFileForTarget.get(target);var newScriptFile=WebInspector.debuggerWorkspaceBinding.scriptFile(this._uiSourceCode,target);this._scriptFileForTarget.remove(target);if(oldScriptFile){oldScriptFile.removeEventListener(WebInspector.ResourceScriptFile.Events.DidMergeToVM,this._didMergeToVM,this);oldScriptFile.removeEventListener(WebInspector.ResourceScriptFile.Events.DidDivergeFromVM,this._didDivergeFromVM,this);if(this._muted&&!this._uiSourceCode.isDirty())
this._restoreBreakpointsIfConsistentScripts();}
if(newScriptFile)
this._scriptFileForTarget.set(target,newScriptFile);delete this._hasCommittedLiveEdit;this._updateDivergedInfobar();if(newScriptFile){newScriptFile.addEventListener(WebInspector.ResourceScriptFile.Events.DidMergeToVM,this._didMergeToVM,this);newScriptFile.addEventListener(WebInspector.ResourceScriptFile.Events.DidDivergeFromVM,this._didDivergeFromVM,this);if(this.loaded)
newScriptFile.checkMapping();}},onTextEditorContentLoaded:function()
{if(typeof this._executionLineNumber==="number")
this.setExecutionLine(this._executionLineNumber);var breakpointLocations=this._breakpointManager.breakpointLocationsForUISourceCode(this._uiSourceCode);for(var i=0;i<breakpointLocations.length;++i)
this._breakpointAdded({data:breakpointLocations[i]});var messages=WebInspector.presentationConsoleMessageHelper.consoleMessages(this._uiSourceCode);for(var i=0;i<messages.length;++i){var message=messages[i];this.addMessageToSource(message.lineNumber,message.originalMessage);}
var scriptFiles=this._scriptFileForTarget.values();for(var i=0;i<scriptFiles.length;++i)
scriptFiles[i].checkMapping();this._updateLinesWithoutMappingHighlight();},_handleGutterClick:function(event)
{if(this._muted)
return;var eventData=(event.data);var lineNumber=eventData.lineNumber;var eventObject=eventData.event;if(eventObject.button!=0||eventObject.altKey||eventObject.ctrlKey||eventObject.metaKey)
return;this._toggleBreakpoint(lineNumber,eventObject.shiftKey);eventObject.consume(true);},_toggleBreakpoint:function(lineNumber,onlyDisable)
{var breakpoint=this._breakpointManager.findBreakpointOnLine(this._uiSourceCode,lineNumber);if(breakpoint){if(onlyDisable)
breakpoint.setEnabled(!breakpoint.enabled());else
breakpoint.remove();}else
this._setBreakpoint(lineNumber,0,"",true);},toggleBreakpointOnCurrentLine:function()
{if(this._muted)
return;var selection=this.textEditor.selection();if(!selection)
return;this._toggleBreakpoint(selection.startLine,false);},_setBreakpoint:function(lineNumber,columnNumber,condition,enabled)
{this._breakpointManager.setBreakpoint(this._uiSourceCode,lineNumber,columnNumber,condition,enabled);WebInspector.notifications.dispatchEventToListeners(WebInspector.UserMetrics.UserAction,{action:WebInspector.UserMetrics.UserActionNames.SetBreakpoint,url:this._uiSourceCode.originURL(),line:lineNumber,enabled:enabled});},_continueToLine:function(lineNumber)
{var executionContext=WebInspector.context.flavor(WebInspector.ExecutionContext);if(!executionContext)
return;var rawLocation=WebInspector.debuggerWorkspaceBinding.uiLocationToRawLocation(executionContext.target(),this._uiSourceCode,lineNumber,0);if(!rawLocation)
return;this._scriptsPanel.continueToLocation(rawLocation);},dispose:function()
{this._breakpointManager.removeEventListener(WebInspector.BreakpointManager.Events.BreakpointAdded,this._breakpointAdded,this);this._breakpointManager.removeEventListener(WebInspector.BreakpointManager.Events.BreakpointRemoved,this._breakpointRemoved,this);WebInspector.presentationConsoleMessageHelper.removeConsoleMessageEventListener(WebInspector.PresentationConsoleMessageHelper.Events.ConsoleMessageAdded,this._uiSourceCode,this._consoleMessageAdded,this);WebInspector.presentationConsoleMessageHelper.removeConsoleMessageEventListener(WebInspector.PresentationConsoleMessageHelper.Events.ConsoleMessageRemoved,this._uiSourceCode,this._consoleMessageRemoved,this);WebInspector.presentationConsoleMessageHelper.removeConsoleMessageEventListener(WebInspector.PresentationConsoleMessageHelper.Events.ConsoleMessagesCleared,this._uiSourceCode,this._consoleMessagesCleared,this);this._uiSourceCode.removeEventListener(WebInspector.UISourceCode.Events.SourceMappingChanged,this._onSourceMappingChanged,this);this._uiSourceCode.removeEventListener(WebInspector.UISourceCode.Events.WorkingCopyChanged,this._workingCopyChanged,this);this._uiSourceCode.removeEventListener(WebInspector.UISourceCode.Events.WorkingCopyCommitted,this._workingCopyCommitted,this);this._uiSourceCode.removeEventListener(WebInspector.UISourceCode.Events.TitleChanged,this._showBlackboxInfobarIfNeeded,this);WebInspector.settings.skipStackFramesPattern.removeChangeListener(this._showBlackboxInfobarIfNeeded,this);WebInspector.settings.skipContentScripts.removeChangeListener(this._showBlackboxInfobarIfNeeded,this);WebInspector.UISourceCodeFrame.prototype.dispose.call(this);},__proto__:WebInspector.UISourceCodeFrame.prototype};WebInspector.CSSSourceFrame=function(uiSourceCode)
{WebInspector.UISourceCodeFrame.call(this,uiSourceCode);this._registerShortcuts();}
WebInspector.CSSSourceFrame.prototype={_registerShortcuts:function()
{var shortcutKeys=WebInspector.ShortcutsScreen.SourcesPanelShortcuts;for(var i=0;i<shortcutKeys.IncreaseCSSUnitByOne.length;++i)
this.addShortcut(shortcutKeys.IncreaseCSSUnitByOne[i].key,this._handleUnitModification.bind(this,1));for(var i=0;i<shortcutKeys.DecreaseCSSUnitByOne.length;++i)
this.addShortcut(shortcutKeys.DecreaseCSSUnitByOne[i].key,this._handleUnitModification.bind(this,-1));for(var i=0;i<shortcutKeys.IncreaseCSSUnitByTen.length;++i)
this.addShortcut(shortcutKeys.IncreaseCSSUnitByTen[i].key,this._handleUnitModification.bind(this,10));for(var i=0;i<shortcutKeys.DecreaseCSSUnitByTen.length;++i)
this.addShortcut(shortcutKeys.DecreaseCSSUnitByTen[i].key,this._handleUnitModification.bind(this,-10));},_modifyUnit:function(unit,change)
{var unitValue=parseInt(unit,10);if(isNaN(unitValue))
return null;var tail=unit.substring((unitValue).toString().length);return String.sprintf("%d%s",unitValue+change,tail);},_handleUnitModification:function(change)
{var selection=this.textEditor.selection().normalize();var token=this.textEditor.tokenAtTextPosition(selection.startLine,selection.startColumn);if(!token){if(selection.startColumn>0)
token=this.textEditor.tokenAtTextPosition(selection.startLine,selection.startColumn-1);if(!token)
return false;}
if(token.type!=="css-number")
return false;var cssUnitRange=new WebInspector.TextRange(selection.startLine,token.startColumn,selection.startLine,token.endColumn);var cssUnitText=this.textEditor.copyRange(cssUnitRange);var newUnitText=this._modifyUnit(cssUnitText,change);if(!newUnitText)
return false;this.textEditor.editRange(cssUnitRange,newUnitText);selection.startColumn=token.startColumn;selection.endColumn=selection.startColumn+newUnitText.length;this.textEditor.setSelection(selection);return true;},__proto__:WebInspector.UISourceCodeFrame.prototype};WebInspector.NavigatorView=function()
{WebInspector.VBox.call(this);this.registerRequiredCSS("navigatorView.css");this.element.classList.add("navigator-container");var scriptsOutlineElement=this.element.createChild("div","outline-disclosure navigator");var scriptsTreeElement=scriptsOutlineElement.createChild("ol");this._scriptsTree=new WebInspector.NavigatorTreeOutline(scriptsTreeElement);this.setDefaultFocusedElement(this._scriptsTree.element);this._uiSourceCodeNodes=new Map();this._subfolderNodes=new Map();this._rootNode=new WebInspector.NavigatorRootTreeNode(this);this._rootNode.populate();this.element.addEventListener("contextmenu",this.handleContextMenu.bind(this),false);}
WebInspector.NavigatorView.Events={ItemSelected:"ItemSelected",ItemRenamed:"ItemRenamed",}
WebInspector.NavigatorView.iconClassForType=function(type)
{if(type===WebInspector.NavigatorTreeOutline.Types.Domain)
return"navigator-domain-tree-item";if(type===WebInspector.NavigatorTreeOutline.Types.FileSystem)
return"navigator-folder-tree-item";return"navigator-folder-tree-item";}
WebInspector.NavigatorView.prototype={setWorkspace:function(workspace)
{this._workspace=workspace;this._workspace.addEventListener(WebInspector.Workspace.Events.UISourceCodeAdded,this._uiSourceCodeAdded,this);this._workspace.addEventListener(WebInspector.Workspace.Events.UISourceCodeRemoved,this._uiSourceCodeRemoved,this);this._workspace.addEventListener(WebInspector.Workspace.Events.ProjectRemoved,this._projectRemoved.bind(this),this);},wasShown:function()
{if(this._loaded)
return;this._loaded=true;this._workspace.uiSourceCodes().forEach(this._addUISourceCode.bind(this));},accept:function(uiSourceCode)
{return!uiSourceCode.project().isServiceProject();},_addUISourceCode:function(uiSourceCode)
{if(!this.accept(uiSourceCode))
return;var projectNode=this._projectNode(uiSourceCode.project());var folderNode=this._folderNode(projectNode,uiSourceCode.parentPath());var uiSourceCodeNode=new WebInspector.NavigatorUISourceCodeTreeNode(this,uiSourceCode);this._uiSourceCodeNodes.set(uiSourceCode,uiSourceCodeNode);folderNode.appendChild(uiSourceCodeNode);},_uiSourceCodeAdded:function(event)
{var uiSourceCode=(event.data);this._addUISourceCode(uiSourceCode);},_uiSourceCodeRemoved:function(event)
{var uiSourceCode=(event.data);this._removeUISourceCode(uiSourceCode);},_projectRemoved:function(event)
{var project=(event.data);var uiSourceCodes=project.uiSourceCodes();for(var i=0;i<uiSourceCodes.length;++i)
this._removeUISourceCode(uiSourceCodes[i]);},_projectNode:function(project)
{if(!project.displayName())
return this._rootNode;var projectNode=this._rootNode.child(project.id());if(!projectNode){var type=project.type()===WebInspector.projectTypes.FileSystem?WebInspector.NavigatorTreeOutline.Types.FileSystem:WebInspector.NavigatorTreeOutline.Types.Domain;projectNode=new WebInspector.NavigatorFolderTreeNode(this,project,project.id(),type,"",project.displayName());this._rootNode.appendChild(projectNode);}
return projectNode;},_folderNode:function(projectNode,folderPath)
{if(!folderPath)
return projectNode;var subfolderNodes=this._subfolderNodes.get(projectNode);if(!subfolderNodes){subfolderNodes=(new StringMap());this._subfolderNodes.set(projectNode,subfolderNodes);}
var folderNode=subfolderNodes.get(folderPath);if(folderNode)
return folderNode;var parentNode=projectNode;var index=folderPath.lastIndexOf("/");if(index!==-1)
parentNode=this._folderNode(projectNode,folderPath.substring(0,index));var name=folderPath.substring(index+1);folderNode=new WebInspector.NavigatorFolderTreeNode(this,null,name,WebInspector.NavigatorTreeOutline.Types.Folder,folderPath,name);subfolderNodes.set(folderPath,folderNode);parentNode.appendChild(folderNode);return folderNode;},revealUISourceCode:function(uiSourceCode,select)
{var node=this._uiSourceCodeNodes.get(uiSourceCode);if(!node)
return;if(this._scriptsTree.selectedTreeElement)
this._scriptsTree.selectedTreeElement.deselect();this._lastSelectedUISourceCode=uiSourceCode;node.reveal(select);},_sourceSelected:function(uiSourceCode,focusSource)
{this._lastSelectedUISourceCode=uiSourceCode;var data={uiSourceCode:uiSourceCode,focusSource:focusSource};this.dispatchEventToListeners(WebInspector.NavigatorView.Events.ItemSelected,data);},sourceDeleted:function(uiSourceCode)
{},_removeUISourceCode:function(uiSourceCode)
{var node=this._uiSourceCodeNodes.get(uiSourceCode);if(!node)
return;var projectNode=this._projectNode(uiSourceCode.project());var subfolderNodes=this._subfolderNodes.get(projectNode);var parentNode=node.parent;this._uiSourceCodeNodes.remove(uiSourceCode);parentNode.removeChild(node);node=parentNode;while(node){parentNode=node.parent;if(!parentNode||!node.isEmpty())
break;if(subfolderNodes)
subfolderNodes.remove(node._folderPath);parentNode.removeChild(node);node=parentNode;}},_updateIcon:function(uiSourceCode)
{var node=this._uiSourceCodeNodes.get(uiSourceCode);node.updateIcon();},reset:function()
{var nodes=this._uiSourceCodeNodes.values();for(var i=0;i<nodes.length;++i)
nodes[i].dispose();this._scriptsTree.removeChildren();this._uiSourceCodeNodes.clear();this._subfolderNodes.clear();this._rootNode.reset();},handleContextMenu:function(event)
{var contextMenu=new WebInspector.ContextMenu(event);this._appendAddFolderItem(contextMenu);contextMenu.show();},_appendAddFolderItem:function(contextMenu)
{function addFolder()
{WebInspector.isolatedFileSystemManager.addFileSystem();}
var addFolderLabel=WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Add folder to workspace":"Add Folder to Workspace");contextMenu.appendItem(addFolderLabel,addFolder);},_handleContextMenuRefresh:function(project,path)
{project.refresh(path);},_handleContextMenuCreate:function(project,path,uiSourceCode)
{this.create(project,path,uiSourceCode);},_handleContextMenuRename:function(uiSourceCode)
{this.rename(uiSourceCode,false);},_handleContextMenuExclude:function(project,path)
{var shouldExclude=window.confirm(WebInspector.UIString("Are you sure you want to exclude this folder?"));if(shouldExclude){WebInspector.startBatchUpdate();project.excludeFolder(path);WebInspector.endBatchUpdate();}},_handleContextMenuDelete:function(uiSourceCode)
{var shouldDelete=window.confirm(WebInspector.UIString("Are you sure you want to delete this file?"));if(shouldDelete)
uiSourceCode.project().deleteFile(uiSourceCode.path());},handleFileContextMenu:function(event,uiSourceCode)
{var contextMenu=new WebInspector.ContextMenu(event);contextMenu.appendApplicableItems(uiSourceCode);contextMenu.appendSeparator();var project=uiSourceCode.project();if(project.type()===WebInspector.projectTypes.FileSystem){var path=uiSourceCode.parentPath();contextMenu.appendItem(WebInspector.UIString("Rename\u2026"),this._handleContextMenuRename.bind(this,uiSourceCode));contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Make a copy\u2026":"Make a Copy\u2026"),this._handleContextMenuCreate.bind(this,project,path,uiSourceCode));contextMenu.appendItem(WebInspector.UIString("Delete"),this._handleContextMenuDelete.bind(this,uiSourceCode));contextMenu.appendSeparator();}
this._appendAddFolderItem(contextMenu);contextMenu.show();},handleFolderContextMenu:function(event,node)
{var contextMenu=new WebInspector.ContextMenu(event);var path="/";var projectNode=node;while(projectNode.parent!==this._rootNode){path="/"+projectNode.id+path;projectNode=projectNode.parent;}
var project=projectNode._project;if(project.type()===WebInspector.projectTypes.FileSystem){contextMenu.appendItem(WebInspector.UIString("Refresh"),this._handleContextMenuRefresh.bind(this,project,path));contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"New file":"New File"),this._handleContextMenuCreate.bind(this,project,path));contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Exclude folder":"Exclude Folder"),this._handleContextMenuExclude.bind(this,project,path));}
contextMenu.appendSeparator();this._appendAddFolderItem(contextMenu);function removeFolder()
{var shouldRemove=window.confirm(WebInspector.UIString("Are you sure you want to remove this folder?"));if(shouldRemove)
project.remove();}
if(project.type()===WebInspector.projectTypes.FileSystem&&node===projectNode){var removeFolderLabel=WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Remove folder from workspace":"Remove Folder from Workspace");contextMenu.appendItem(removeFolderLabel,removeFolder);}
contextMenu.show();},rename:function(uiSourceCode,deleteIfCanceled)
{var node=this._uiSourceCodeNodes.get(uiSourceCode);console.assert(node);node.rename(callback.bind(this));function callback(committed)
{if(!committed){if(deleteIfCanceled)
uiSourceCode.remove();return;}
this.dispatchEventToListeners(WebInspector.NavigatorView.Events.ItemRenamed,uiSourceCode);this._updateIcon(uiSourceCode);this._sourceSelected(uiSourceCode,true)}},create:function(project,path,uiSourceCodeToCopy)
{var filePath;var uiSourceCode;function contentLoaded(content)
{createFile.call(this,content||"");}
if(uiSourceCodeToCopy)
uiSourceCodeToCopy.requestContent(contentLoaded.bind(this));else
createFile.call(this);function createFile(content)
{project.createFile(path,null,content||"",fileCreated.bind(this));}
function fileCreated(path)
{if(!path)
return;filePath=path;uiSourceCode=project.uiSourceCode(filePath);if(!uiSourceCode){console.assert(uiSourceCode)
return;}
this._sourceSelected(uiSourceCode,false);this.revealUISourceCode(uiSourceCode,true);this.rename(uiSourceCode,true);}},__proto__:WebInspector.VBox.prototype}
WebInspector.SourcesNavigatorView=function()
{WebInspector.NavigatorView.call(this);WebInspector.targetManager.addEventListener(WebInspector.TargetManager.Events.InspectedURLChanged,this._inspectedURLChanged,this);}
WebInspector.SourcesNavigatorView.prototype={accept:function(uiSourceCode)
{if(!WebInspector.NavigatorView.prototype.accept(uiSourceCode))
return false;return uiSourceCode.project().type()!==WebInspector.projectTypes.ContentScripts&&uiSourceCode.project().type()!==WebInspector.projectTypes.Snippets;},_inspectedURLChanged:function(event)
{var nodes=this._uiSourceCodeNodes.values();for(var i=0;i<nodes.length;++i){var uiSourceCode=nodes[i].uiSourceCode();var inspectedPageURL=WebInspector.targetManager.inspectedPageURL();if(inspectedPageURL&&uiSourceCode.url===inspectedPageURL)
this.revealUISourceCode(uiSourceCode,true);}},_addUISourceCode:function(uiSourceCode)
{WebInspector.NavigatorView.prototype._addUISourceCode.call(this,uiSourceCode);var inspectedPageURL=WebInspector.targetManager.inspectedPageURL();if(inspectedPageURL&&uiSourceCode.url===inspectedPageURL)
this.revealUISourceCode(uiSourceCode,true);},__proto__:WebInspector.NavigatorView.prototype}
WebInspector.ContentScriptsNavigatorView=function()
{WebInspector.NavigatorView.call(this);}
WebInspector.ContentScriptsNavigatorView.prototype={accept:function(uiSourceCode)
{if(!WebInspector.NavigatorView.prototype.accept(uiSourceCode))
return false;return uiSourceCode.project().type()===WebInspector.projectTypes.ContentScripts;},__proto__:WebInspector.NavigatorView.prototype}
WebInspector.NavigatorTreeOutline=function(element)
{TreeOutline.call(this,element);this.element=element;this.comparator=WebInspector.NavigatorTreeOutline._treeElementsCompare;}
WebInspector.NavigatorTreeOutline.Types={Root:"Root",Domain:"Domain",Folder:"Folder",UISourceCode:"UISourceCode",FileSystem:"FileSystem"}
WebInspector.NavigatorTreeOutline._treeElementsCompare=function compare(treeElement1,treeElement2)
{function typeWeight(treeElement)
{var type=treeElement.type();if(type===WebInspector.NavigatorTreeOutline.Types.Domain){if(treeElement.titleText===WebInspector.targetManager.inspectedPageDomain())
return 1;return 2;}
if(type===WebInspector.NavigatorTreeOutline.Types.FileSystem)
return 3;if(type===WebInspector.NavigatorTreeOutline.Types.Folder)
return 4;return 5;}
var typeWeight1=typeWeight(treeElement1);var typeWeight2=typeWeight(treeElement2);var result;if(typeWeight1>typeWeight2)
result=1;else if(typeWeight1<typeWeight2)
result=-1;else{var title1=treeElement1.titleText;var title2=treeElement2.titleText;result=title1.compareTo(title2);}
return result;}
WebInspector.NavigatorTreeOutline.prototype={scriptTreeElements:function()
{var result=[];if(this.children.length){for(var treeElement=this.children[0];treeElement;treeElement=treeElement.traverseNextTreeElement(false,this,true)){if(treeElement instanceof WebInspector.NavigatorSourceTreeElement)
result.push(treeElement.uiSourceCode);}}
return result;},__proto__:TreeOutline.prototype}
WebInspector.BaseNavigatorTreeElement=function(type,title,iconClasses,hasChildren,noIcon)
{this._type=type;TreeElement.call(this,"",null,hasChildren);this._titleText=title;this._iconClasses=iconClasses;this._noIcon=noIcon;}
WebInspector.BaseNavigatorTreeElement.prototype={onattach:function()
{this.listItemElement.removeChildren();if(this._iconClasses){for(var i=0;i<this._iconClasses.length;++i)
this.listItemElement.classList.add(this._iconClasses[i]);}
this.listItemElement.createChild("div","selection");if(!this._noIcon)
this.imageElement=this.listItemElement.createChild("img","icon");this.titleElement=this.listItemElement.createChild("div","base-navigator-tree-element-title");this.titleElement.textContent=this._titleText},updateIconClasses:function(iconClasses)
{for(var i=0;i<this._iconClasses.length;++i)
this.listItemElement.classList.remove(this._iconClasses[i]);this._iconClasses=iconClasses;for(var i=0;i<this._iconClasses.length;++i)
this.listItemElement.classList.add(this._iconClasses[i]);},onreveal:function()
{if(this.listItemElement)
this.listItemElement.scrollIntoViewIfNeeded(true);},get titleText()
{return this._titleText;},set titleText(titleText)
{if(this._titleText===titleText)
return;this._titleText=titleText||"";if(this.titleElement)
this.titleElement.textContent=this._titleText;},type:function()
{return this._type;},__proto__:TreeElement.prototype}
WebInspector.NavigatorFolderTreeElement=function(navigatorView,type,title)
{var iconClass=WebInspector.NavigatorView.iconClassForType(type);WebInspector.BaseNavigatorTreeElement.call(this,type,title,[iconClass],true);this._navigatorView=navigatorView;}
WebInspector.NavigatorFolderTreeElement.prototype={onpopulate:function()
{this._node.populate();},onattach:function()
{WebInspector.BaseNavigatorTreeElement.prototype.onattach.call(this);this.collapse();this.listItemElement.addEventListener("contextmenu",this._handleContextMenuEvent.bind(this),false);},setNode:function(node)
{this._node=node;var paths=[];while(node&&!node.isRoot()){paths.push(node._title);node=node.parent;}
paths.reverse();this.tooltip=paths.join("/");},_handleContextMenuEvent:function(event)
{if(!this._node)
return;this.select();this._navigatorView.handleFolderContextMenu(event,this._node);},__proto__:WebInspector.BaseNavigatorTreeElement.prototype}
WebInspector.NavigatorSourceTreeElement=function(navigatorView,uiSourceCode,title)
{this._navigatorView=navigatorView;this._uiSourceCode=uiSourceCode;WebInspector.BaseNavigatorTreeElement.call(this,WebInspector.NavigatorTreeOutline.Types.UISourceCode,title,this._calculateIconClasses(),false);this.tooltip=uiSourceCode.originURL();}
WebInspector.NavigatorSourceTreeElement.prototype={get uiSourceCode()
{return this._uiSourceCode;},_calculateIconClasses:function()
{return["navigator-"+this._uiSourceCode.contentType().name()+"-tree-item"];},updateIcon:function()
{this.updateIconClasses(this._calculateIconClasses());},onattach:function()
{WebInspector.BaseNavigatorTreeElement.prototype.onattach.call(this);this.listItemElement.draggable=true;this.listItemElement.addEventListener("click",this._onclick.bind(this),false);this.listItemElement.addEventListener("contextmenu",this._handleContextMenuEvent.bind(this),false);this.listItemElement.addEventListener("mousedown",this._onmousedown.bind(this),false);this.listItemElement.addEventListener("dragstart",this._ondragstart.bind(this),false);},_onmousedown:function(event)
{if(event.which===1)
this._uiSourceCode.requestContent(callback.bind(this));function callback(content)
{this._warmedUpContent=content;}},_shouldRenameOnMouseDown:function()
{if(!this._uiSourceCode.canRename())
return false;var isSelected=this===this.treeOutline.selectedTreeElement;var isFocused=this.treeOutline.childrenListElement.isSelfOrAncestor(document.activeElement);return isSelected&&isFocused&&!WebInspector.isBeingEdited(this.treeOutline.element);},selectOnMouseDown:function(event)
{if(event.which!==1||!this._shouldRenameOnMouseDown()){TreeElement.prototype.selectOnMouseDown.call(this,event);return;}
setTimeout(rename.bind(this),300);function rename()
{if(this._shouldRenameOnMouseDown())
this._navigatorView.rename(this.uiSourceCode,false);}},_ondragstart:function(event)
{event.dataTransfer.setData("text/plain",this._warmedUpContent);event.dataTransfer.effectAllowed="copy";return true;},onspace:function()
{this._navigatorView._sourceSelected(this.uiSourceCode,true);return true;},_onclick:function(event)
{this._navigatorView._sourceSelected(this.uiSourceCode,false);},ondblclick:function(event)
{var middleClick=event.button===1;this._navigatorView._sourceSelected(this.uiSourceCode,!middleClick);return false;},onenter:function()
{this._navigatorView._sourceSelected(this.uiSourceCode,true);return true;},ondelete:function()
{this._navigatorView.sourceDeleted(this.uiSourceCode);return true;},_handleContextMenuEvent:function(event)
{this.select();this._navigatorView.handleFileContextMenu(event,this._uiSourceCode);},__proto__:WebInspector.BaseNavigatorTreeElement.prototype}
WebInspector.NavigatorTreeNode=function(id)
{this.id=id;this._children=new StringMap();}
WebInspector.NavigatorTreeNode.prototype={treeElement:function(){throw"Not implemented";},dispose:function(){},isRoot:function()
{return false;},hasChildren:function()
{return true;},populate:function()
{if(this.isPopulated())
return;if(this.parent)
this.parent.populate();this._populated=true;this.wasPopulated();},wasPopulated:function()
{var children=this.children();for(var i=0;i<children.length;++i)
this.treeElement().appendChild(children[i].treeElement());},didAddChild:function(node)
{if(this.isPopulated())
this.treeElement().appendChild(node.treeElement());},willRemoveChild:function(node)
{if(this.isPopulated())
this.treeElement().removeChild(node.treeElement());},isPopulated:function()
{return this._populated;},isEmpty:function()
{return!this._children.size;},child:function(id)
{return this._children.get(id)||null;},children:function()
{return this._children.values();},appendChild:function(node)
{this._children.set(node.id,node);node.parent=this;this.didAddChild(node);},removeChild:function(node)
{this.willRemoveChild(node);this._children.remove(node.id);delete node.parent;node.dispose();},reset:function()
{this._children.clear();}}
WebInspector.NavigatorRootTreeNode=function(navigatorView)
{WebInspector.NavigatorTreeNode.call(this,"");this._navigatorView=navigatorView;}
WebInspector.NavigatorRootTreeNode.prototype={isRoot:function()
{return true;},treeElement:function()
{return this._navigatorView._scriptsTree;},__proto__:WebInspector.NavigatorTreeNode.prototype}
WebInspector.NavigatorUISourceCodeTreeNode=function(navigatorView,uiSourceCode)
{WebInspector.NavigatorTreeNode.call(this,uiSourceCode.name());this._navigatorView=navigatorView;this._uiSourceCode=uiSourceCode;this._treeElement=null;}
WebInspector.NavigatorUISourceCodeTreeNode.prototype={uiSourceCode:function()
{return this._uiSourceCode;},updateIcon:function()
{if(this._treeElement)
this._treeElement.updateIcon();},treeElement:function()
{if(this._treeElement)
return this._treeElement;this._treeElement=new WebInspector.NavigatorSourceTreeElement(this._navigatorView,this._uiSourceCode,"");this.updateTitle();this._uiSourceCode.addEventListener(WebInspector.UISourceCode.Events.TitleChanged,this._titleChanged,this);this._uiSourceCode.addEventListener(WebInspector.UISourceCode.Events.WorkingCopyChanged,this._workingCopyChanged,this);this._uiSourceCode.addEventListener(WebInspector.UISourceCode.Events.WorkingCopyCommitted,this._workingCopyCommitted,this);return this._treeElement;},updateTitle:function(ignoreIsDirty)
{if(!this._treeElement)
return;var titleText=this._uiSourceCode.displayName();if(!ignoreIsDirty&&(this._uiSourceCode.isDirty()||this._uiSourceCode.hasUnsavedCommittedChanges()))
titleText="*"+titleText;this._treeElement.titleText=titleText;},hasChildren:function()
{return false;},dispose:function()
{if(!this._treeElement)
return;this._uiSourceCode.removeEventListener(WebInspector.UISourceCode.Events.TitleChanged,this._titleChanged,this);this._uiSourceCode.removeEventListener(WebInspector.UISourceCode.Events.WorkingCopyChanged,this._workingCopyChanged,this);this._uiSourceCode.removeEventListener(WebInspector.UISourceCode.Events.WorkingCopyCommitted,this._workingCopyCommitted,this);},_titleChanged:function(event)
{this.updateTitle();},_workingCopyChanged:function(event)
{this.updateTitle();},_workingCopyCommitted:function(event)
{this.updateTitle();},reveal:function(select)
{this.parent.populate();this.parent.treeElement().expand();this._treeElement.reveal();if(select)
this._treeElement.select(true);},rename:function(callback)
{if(!this._treeElement)
return;var treeOutlineElement=this._treeElement.treeOutline.element;WebInspector.markBeingEdited(treeOutlineElement,true);function commitHandler(element,newTitle,oldTitle)
{if(newTitle!==oldTitle){this._treeElement.titleText=newTitle;this._uiSourceCode.rename(newTitle,renameCallback.bind(this));return;}
afterEditing.call(this,true);}
function renameCallback(success)
{if(!success){WebInspector.markBeingEdited(treeOutlineElement,false);this.updateTitle();this.rename(callback);return;}
afterEditing.call(this,true);}
function cancelHandler()
{afterEditing.call(this,false);}
function afterEditing(committed)
{WebInspector.markBeingEdited(treeOutlineElement,false);this.updateTitle();this._treeElement.treeOutline.childrenListElement.focus();if(callback)
callback(committed);}
var editingConfig=new WebInspector.InplaceEditor.Config(commitHandler.bind(this),cancelHandler.bind(this));this.updateTitle(true);WebInspector.InplaceEditor.startEditing(this._treeElement.titleElement,editingConfig);window.getSelection().setBaseAndExtent(this._treeElement.titleElement,0,this._treeElement.titleElement,1);},__proto__:WebInspector.NavigatorTreeNode.prototype}
WebInspector.NavigatorFolderTreeNode=function(navigatorView,project,id,type,folderPath,title)
{WebInspector.NavigatorTreeNode.call(this,id);this._navigatorView=navigatorView;this._project=project;this._type=type;this._folderPath=folderPath;this._title=title;}
WebInspector.NavigatorFolderTreeNode.prototype={treeElement:function()
{if(this._treeElement)
return this._treeElement;this._treeElement=this._createTreeElement(this._title,this);return this._treeElement;},_createTreeElement:function(title,node)
{var treeElement=new WebInspector.NavigatorFolderTreeElement(this._navigatorView,this._type,title);treeElement.setNode(node);return treeElement;},wasPopulated:function()
{if(!this._treeElement||this._treeElement._node!==this)
return;this._addChildrenRecursive();},_addChildrenRecursive:function()
{var children=this.children();for(var i=0;i<children.length;++i){var child=children[i];this.didAddChild(child);if(child instanceof WebInspector.NavigatorFolderTreeNode)
child._addChildrenRecursive();}},_shouldMerge:function(node)
{return this._type!==WebInspector.NavigatorTreeOutline.Types.Domain&&node instanceof WebInspector.NavigatorFolderTreeNode;},didAddChild:function(node)
{function titleForNode(node)
{return node._title;}
if(!this._treeElement)
return;var children=this.children();if(children.length===1&&this._shouldMerge(node)){node._isMerged=true;this._treeElement.titleText=this._treeElement.titleText+"/"+node._title;node._treeElement=this._treeElement;this._treeElement.setNode(node);return;}
var oldNode;if(children.length===2)
oldNode=children[0]!==node?children[0]:children[1];if(oldNode&&oldNode._isMerged){delete oldNode._isMerged;var mergedToNodes=[];mergedToNodes.push(this);var treeNode=this;while(treeNode._isMerged){treeNode=treeNode.parent;mergedToNodes.push(treeNode);}
mergedToNodes.reverse();var titleText=mergedToNodes.map(titleForNode).join("/");var nodes=[];treeNode=oldNode;do{nodes.push(treeNode);children=treeNode.children();treeNode=children.length===1?children[0]:null;}while(treeNode&&treeNode._isMerged);if(!this.isPopulated()){this._treeElement.titleText=titleText;this._treeElement.setNode(this);for(var i=0;i<nodes.length;++i){delete nodes[i]._treeElement;delete nodes[i]._isMerged;}
return;}
var oldTreeElement=this._treeElement;var treeElement=this._createTreeElement(titleText,this);for(var i=0;i<mergedToNodes.length;++i)
mergedToNodes[i]._treeElement=treeElement;oldTreeElement.parent.appendChild(treeElement);oldTreeElement.setNode(nodes[nodes.length-1]);oldTreeElement.titleText=nodes.map(titleForNode).join("/");oldTreeElement.parent.removeChild(oldTreeElement);this._treeElement.appendChild(oldTreeElement);if(oldTreeElement.expanded)
treeElement.expand();}
if(this.isPopulated())
this._treeElement.appendChild(node.treeElement());},willRemoveChild:function(node)
{if(node._isMerged||!this.isPopulated())
return;this._treeElement.removeChild(node._treeElement);},__proto__:WebInspector.NavigatorTreeNode.prototype};WebInspector.RevisionHistoryView=function()
{WebInspector.VBox.call(this);this.registerRequiredCSS("revisionHistory.css");this.element.classList.add("revision-history-drawer");this.element.classList.add("outline-disclosure");this._uiSourceCodeItems=new Map();var olElement=this.element.createChild("ol");this._treeOutline=new TreeOutline(olElement);function populateRevisions(uiSourceCode)
{if(uiSourceCode.history.length)
this._createUISourceCodeItem(uiSourceCode);}
WebInspector.workspace.uiSourceCodes().forEach(populateRevisions.bind(this));WebInspector.workspace.addEventListener(WebInspector.Workspace.Events.UISourceCodeContentCommitted,this._revisionAdded,this);WebInspector.workspace.addEventListener(WebInspector.Workspace.Events.UISourceCodeRemoved,this._uiSourceCodeRemoved,this);WebInspector.workspace.addEventListener(WebInspector.Workspace.Events.ProjectRemoved,this._projectRemoved,this);}
WebInspector.RevisionHistoryView.showHistory=function(uiSourceCode)
{if(!WebInspector.RevisionHistoryView._view)
WebInspector.RevisionHistoryView._view=new WebInspector.RevisionHistoryView();var view=WebInspector.RevisionHistoryView._view;WebInspector.inspectorView.showCloseableViewInDrawer("history",WebInspector.UIString("History"),view);view._revealUISourceCode(uiSourceCode);}
WebInspector.RevisionHistoryView.prototype={_createUISourceCodeItem:function(uiSourceCode)
{var uiSourceCodeItem=new TreeElement(uiSourceCode.displayName(),null,true);uiSourceCodeItem.selectable=false;for(var i=0;i<this._treeOutline.children.length;++i){if(this._treeOutline.children[i].title.localeCompare(uiSourceCode.displayName())>0){this._treeOutline.insertChild(uiSourceCodeItem,i);break;}}
if(i===this._treeOutline.children.length)
this._treeOutline.appendChild(uiSourceCodeItem);this._uiSourceCodeItems.set(uiSourceCode,uiSourceCodeItem);var revisionCount=uiSourceCode.history.length;for(var i=revisionCount-1;i>=0;--i){var revision=uiSourceCode.history[i];var historyItem=new WebInspector.RevisionHistoryTreeElement(revision,uiSourceCode.history[i-1],i!==revisionCount-1);uiSourceCodeItem.appendChild(historyItem);}
var linkItem=new TreeElement("",null,false);linkItem.selectable=false;uiSourceCodeItem.appendChild(linkItem);var revertToOriginal=linkItem.listItemElement.createChild("span","revision-history-link revision-history-link-row");revertToOriginal.textContent=WebInspector.UIString("apply original content");revertToOriginal.addEventListener("click",this._revertToOriginal.bind(this,uiSourceCode));var clearHistoryElement=uiSourceCodeItem.listItemElement.createChild("span","revision-history-link");clearHistoryElement.textContent=WebInspector.UIString("revert");clearHistoryElement.addEventListener("click",this._clearHistory.bind(this,uiSourceCode));return uiSourceCodeItem;},_revertToOriginal:function(uiSourceCode)
{uiSourceCode.revertToOriginal();WebInspector.notifications.dispatchEventToListeners(WebInspector.UserMetrics.UserAction,{action:WebInspector.UserMetrics.UserActionNames.ApplyOriginalContent,url:uiSourceCode.url});},_clearHistory:function(uiSourceCode)
{uiSourceCode.revertAndClearHistory(this._removeUISourceCode.bind(this));WebInspector.notifications.dispatchEventToListeners(WebInspector.UserMetrics.UserAction,{action:WebInspector.UserMetrics.UserActionNames.RevertRevision,url:uiSourceCode.url});},_revisionAdded:function(event)
{var uiSourceCode=(event.data.uiSourceCode);var uiSourceCodeItem=this._uiSourceCodeItems.get(uiSourceCode);if(!uiSourceCodeItem){uiSourceCodeItem=this._createUISourceCodeItem(uiSourceCode);return;}
var historyLength=uiSourceCode.history.length;var historyItem=new WebInspector.RevisionHistoryTreeElement(uiSourceCode.history[historyLength-1],uiSourceCode.history[historyLength-2],false);if(uiSourceCodeItem.children.length)
uiSourceCodeItem.children[0].allowRevert();uiSourceCodeItem.insertChild(historyItem,0);},_revealUISourceCode:function(uiSourceCode)
{var uiSourceCodeItem=this._uiSourceCodeItems.get(uiSourceCode);if(uiSourceCodeItem){uiSourceCodeItem.reveal();uiSourceCodeItem.expand();}},_uiSourceCodeRemoved:function(event)
{var uiSourceCode=(event.data);this._removeUISourceCode(uiSourceCode);},_removeUISourceCode:function(uiSourceCode)
{var uiSourceCodeItem=this._uiSourceCodeItems.get(uiSourceCode);if(!uiSourceCodeItem)
return;this._treeOutline.removeChild(uiSourceCodeItem);this._uiSourceCodeItems.remove(uiSourceCode);},_projectRemoved:function(event)
{var project=event.data;project.uiSourceCodes().forEach(this._removeUISourceCode.bind(this));},__proto__:WebInspector.VBox.prototype}
WebInspector.RevisionHistoryTreeElement=function(revision,baseRevision,allowRevert)
{TreeElement.call(this,revision.timestamp.toLocaleTimeString(),null,true);this.selectable=false;this._revision=revision;this._baseRevision=baseRevision;this._revertElement=document.createElement("span");this._revertElement.className="revision-history-link";this._revertElement.textContent=WebInspector.UIString("apply revision content");this._revertElement.addEventListener("click",this._revision.revertToThis.bind(this._revision),false);if(!allowRevert)
this._revertElement.classList.add("hidden");}
WebInspector.RevisionHistoryTreeElement.prototype={onattach:function()
{this.listItemElement.classList.add("revision-history-revision");},onexpand:function()
{this.listItemElement.appendChild(this._revertElement);if(this._wasExpandedOnce)
return;this._wasExpandedOnce=true;this.childrenListElement.classList.add("source-code");if(this._baseRevision)
this._baseRevision.requestContent(step1.bind(this));else
this._revision.uiSourceCode.requestOriginalContent(step1.bind(this));function step1(baseContent)
{this._revision.requestContent(step2.bind(this,baseContent));}
function step2(baseContent,newContent)
{var baseLines=difflib.stringAsLines(baseContent);var newLines=difflib.stringAsLines(newContent);var sm=new difflib.SequenceMatcher(baseLines,newLines);var opcodes=sm.get_opcodes();var lastWasSeparator=false;for(var idx=0;idx<opcodes.length;idx++){var code=opcodes[idx];var change=code[0];var b=code[1];var be=code[2];var n=code[3];var ne=code[4];var rowCount=Math.max(be-b,ne-n);var topRows=[];var bottomRows=[];for(var i=0;i<rowCount;i++){if(change==="delete"||(change==="replace"&&b<be)){var lineNumber=b++;this._createLine(lineNumber,null,baseLines[lineNumber],"removed");lastWasSeparator=false;}
if(change==="insert"||(change==="replace"&&n<ne)){var lineNumber=n++;this._createLine(null,lineNumber,newLines[lineNumber],"added");lastWasSeparator=false;}
if(change==="equal"){b++;n++;if(!lastWasSeparator)
this._createLine(null,null,"    \u2026","separator");lastWasSeparator=true;}}}}},oncollapse:function()
{this._revertElement.remove();},_createLine:function(baseLineNumber,newLineNumber,lineContent,changeType)
{var child=new TreeElement("",null,false);child.selectable=false;this.appendChild(child);var lineElement=document.createElement("span");function appendLineNumber(lineNumber)
{var numberString=lineNumber!==null?numberToStringWithSpacesPadding(lineNumber+1,4):spacesPadding(4);var lineNumberSpan=document.createElement("span");lineNumberSpan.classList.add("webkit-line-number");lineNumberSpan.textContent=numberString;child.listItemElement.appendChild(lineNumberSpan);}
appendLineNumber(baseLineNumber);appendLineNumber(newLineNumber);var contentSpan=document.createElement("span");contentSpan.textContent=lineContent;child.listItemElement.appendChild(contentSpan);child.listItemElement.classList.add("revision-history-line");contentSpan.classList.add("revision-history-line-"+changeType);},allowRevert:function()
{this._revertElement.classList.remove("hidden");},__proto__:TreeElement.prototype};WebInspector.ScopeChainSidebarPane=function()
{WebInspector.SidebarPane.call(this,WebInspector.UIString("Scope Variables"));this._sections=[];this._expandedSections={};this._expandedProperties=[];}
WebInspector.ScopeChainSidebarPane.prototype={update:function(callFrame)
{this.bodyElement.removeChildren();if(!callFrame){var infoElement=document.createElement("div");infoElement.className="info";infoElement.textContent=WebInspector.UIString("Not Paused");this.bodyElement.appendChild(infoElement);return;}
for(var i=0;i<this._sections.length;++i){var section=this._sections[i];if(!section.title)
continue;if(section.expanded)
this._expandedSections[section.title]=true;else
delete this._expandedSections[section.title];}
this._sections=[];var foundLocalScope=false;var scopeChain=callFrame.scopeChain;for(var i=0;i<scopeChain.length;++i){var scope=scopeChain[i];var title=null;var subtitle=scope.object.description;var emptyPlaceholder=null;var extraProperties=[];var declarativeScope;switch(scope.type){case DebuggerAgent.ScopeType.Local:foundLocalScope=true;title=WebInspector.UIString("Local");emptyPlaceholder=WebInspector.UIString("No Variables");subtitle=undefined;var thisObject=callFrame.thisObject();if(thisObject)
extraProperties.push(new WebInspector.RemoteObjectProperty("this",thisObject));if(i==0){var details=callFrame.target().debuggerModel.debuggerPausedDetails();if(!callFrame.isAsync()){var exception=details.exception();if(exception)
extraProperties.push(new WebInspector.RemoteObjectProperty("<exception>",exception));}
var returnValue=callFrame.returnValue();if(returnValue)
extraProperties.push(new WebInspector.RemoteObjectProperty("<return>",returnValue));}
declarativeScope=true;break;case DebuggerAgent.ScopeType.Closure:title=WebInspector.UIString("Closure");emptyPlaceholder=WebInspector.UIString("No Variables");subtitle=undefined;declarativeScope=true;break;case DebuggerAgent.ScopeType.Catch:title=WebInspector.UIString("Catch");subtitle=undefined;declarativeScope=true;break;case DebuggerAgent.ScopeType.With:title=WebInspector.UIString("With Block");declarativeScope=false;break;case DebuggerAgent.ScopeType.Global:title=WebInspector.UIString("Global");declarativeScope=false;break;}
if(!title||title===subtitle)
subtitle=undefined;var runtimeModel=callFrame.target().runtimeModel;if(declarativeScope)
var scopeObject=runtimeModel.createScopeRemoteObject(scope.object,new WebInspector.ScopeRef(i,callFrame.id,undefined));else
var scopeObject=runtimeModel.createRemoteObject(scope.object);var section=new WebInspector.ObjectPropertiesSection(scopeObject,title,subtitle,emptyPlaceholder,true,extraProperties,WebInspector.ScopeVariableTreeElement);section.editInSelectedCallFrameWhenPaused=true;section.pane=this;if(scope.type===DebuggerAgent.ScopeType.Global)
section.expanded=false;else if(!foundLocalScope||scope.type===DebuggerAgent.ScopeType.Local||title in this._expandedSections)
section.expanded=true;this._sections.push(section);this.bodyElement.appendChild(section.element);}},__proto__:WebInspector.SidebarPane.prototype}
WebInspector.ScopeVariableTreeElement=function(property)
{WebInspector.ObjectPropertyTreeElement.call(this,property);}
WebInspector.ScopeVariableTreeElement.prototype={onattach:function()
{WebInspector.ObjectPropertyTreeElement.prototype.onattach.call(this);if(this.hasChildren&&this.propertyIdentifier in this.treeOutline.section.pane._expandedProperties)
this.expand();},onexpand:function()
{this.treeOutline.section.pane._expandedProperties[this.propertyIdentifier]=true;},oncollapse:function()
{delete this.treeOutline.section.pane._expandedProperties[this.propertyIdentifier];},get propertyIdentifier()
{if("_propertyIdentifier"in this)
return this._propertyIdentifier;var section=this.treeOutline.section;this._propertyIdentifier=section.title+":"+(section.subtitle?section.subtitle+":":"")+this.propertyPath();return this._propertyIdentifier;},__proto__:WebInspector.ObjectPropertyTreeElement.prototype};WebInspector.SourcesNavigator=function(workspace)
{WebInspector.Object.call(this);this._workspace=workspace;this._tabbedPane=new WebInspector.TabbedPane();this._tabbedPane.shrinkableTabs=true;this._tabbedPane.element.classList.add("navigator-tabbed-pane");this._tabbedPaneController=new WebInspector.ExtensibleTabbedPaneController(this._tabbedPane,"navigator-view",this._navigatorViewCreated.bind(this));this._navigatorViews=new StringMap();}
WebInspector.SourcesNavigator.Events={SourceSelected:"SourceSelected",SourceRenamed:"SourceRenamed"}
WebInspector.SourcesNavigator.prototype={_navigatorViewCreated:function(id,view)
{var navigatorView=(view);navigatorView.addEventListener(WebInspector.NavigatorView.Events.ItemSelected,this._sourceSelected,this);navigatorView.addEventListener(WebInspector.NavigatorView.Events.ItemRenamed,this._sourceRenamed,this);this._navigatorViews.set(id,navigatorView);navigatorView.setWorkspace(this._workspace);},get view()
{return this._tabbedPane;},_navigatorViewIdForUISourceCode:function(uiSourceCode)
{var ids=this._tabbedPaneController.viewIds();for(var i=0;i<ids.length;++i){var id=ids[i]
this._tabbedPaneController.viewForId(id);var navigatorView=this._navigatorViews.get(id);if(navigatorView.accept(uiSourceCode))
return id;}
return null;},revealUISourceCode:function(uiSourceCode)
{var id=this._navigatorViewIdForUISourceCode(uiSourceCode);if(!id)
return;var navigatorView=this._navigatorViews.get(id);console.assert(navigatorView);navigatorView.revealUISourceCode(uiSourceCode,true);this._tabbedPane.selectTab(id);},_sourceSelected:function(event)
{this.dispatchEventToListeners(WebInspector.SourcesNavigator.Events.SourceSelected,event.data);},_sourceRenamed:function(event)
{this.dispatchEventToListeners(WebInspector.SourcesNavigator.Events.SourceRenamed,event.data);},__proto__:WebInspector.Object.prototype}
WebInspector.SnippetsNavigatorView=function()
{WebInspector.NavigatorView.call(this);}
WebInspector.SnippetsNavigatorView.prototype={accept:function(uiSourceCode)
{if(!WebInspector.NavigatorView.prototype.accept(uiSourceCode))
return false;return uiSourceCode.project().type()===WebInspector.projectTypes.Snippets;},handleContextMenu:function(event)
{var contextMenu=new WebInspector.ContextMenu(event);contextMenu.appendItem(WebInspector.UIString("New"),this._handleCreateSnippet.bind(this));contextMenu.show();},handleFileContextMenu:function(event,uiSourceCode)
{var contextMenu=new WebInspector.ContextMenu(event);contextMenu.appendItem(WebInspector.UIString("Run"),this._handleEvaluateSnippet.bind(this,uiSourceCode));contextMenu.appendItem(WebInspector.UIString("Rename"),this.rename.bind(this,uiSourceCode));contextMenu.appendItem(WebInspector.UIString("Remove"),this._handleRemoveSnippet.bind(this,uiSourceCode));contextMenu.appendSeparator();contextMenu.appendItem(WebInspector.UIString("New"),this._handleCreateSnippet.bind(this));contextMenu.show();},_handleEvaluateSnippet:function(uiSourceCode)
{var executionContext=WebInspector.context.flavor(WebInspector.ExecutionContext);if(uiSourceCode.project().type()!==WebInspector.projectTypes.Snippets||!executionContext)
return;WebInspector.scriptSnippetModel.evaluateScriptSnippet(executionContext,uiSourceCode);},_handleRemoveSnippet:function(uiSourceCode)
{if(uiSourceCode.project().type()!==WebInspector.projectTypes.Snippets)
return;uiSourceCode.remove();},_handleCreateSnippet:function()
{this.create(WebInspector.scriptSnippetModel.project(),"")},sourceDeleted:function(uiSourceCode)
{this._handleRemoveSnippet(uiSourceCode);},__proto__:WebInspector.NavigatorView.prototype};WebInspector.StyleSheetOutlineDialog=function(uiSourceCode,selectItemCallback)
{WebInspector.SelectionDialogContentProvider.call(this);this._selectItemCallback=selectItemCallback;this._cssParser=new WebInspector.CSSParser();this._cssParser.addEventListener(WebInspector.CSSParser.Events.RulesParsed,this.refresh.bind(this));this._cssParser.parse(uiSourceCode.workingCopy());}
WebInspector.StyleSheetOutlineDialog.show=function(view,uiSourceCode,selectItemCallback)
{if(WebInspector.Dialog.currentInstance())
return;var delegate=new WebInspector.StyleSheetOutlineDialog(uiSourceCode,selectItemCallback);var filteredItemSelectionDialog=new WebInspector.FilteredItemSelectionDialog(delegate);WebInspector.Dialog.show(view.element,filteredItemSelectionDialog);}
WebInspector.StyleSheetOutlineDialog.prototype={itemCount:function()
{return this._cssParser.rules().length;},itemKeyAt:function(itemIndex)
{var rule=this._cssParser.rules()[itemIndex];return rule.selectorText||rule.atRule;},itemScoreAt:function(itemIndex,query)
{var rule=this._cssParser.rules()[itemIndex];return-rule.lineNumber;},renderItem:function(itemIndex,query,titleElement,subtitleElement)
{var rule=this._cssParser.rules()[itemIndex];titleElement.textContent=rule.selectorText||rule.atRule;this.highlightRanges(titleElement,query);subtitleElement.textContent=":"+(rule.lineNumber+1);},selectItem:function(itemIndex,promptValue)
{var rule=this._cssParser.rules()[itemIndex];var lineNumber=rule.lineNumber;if(!isNaN(lineNumber)&&lineNumber>=0)
this._selectItemCallback(lineNumber,rule.columnNumber);},dispose:function()
{this._cssParser.dispose();},__proto__:WebInspector.SelectionDialogContentProvider.prototype};WebInspector.TabbedEditorContainerDelegate=function(){}
WebInspector.TabbedEditorContainerDelegate.prototype={viewForFile:function(uiSourceCode){},}
WebInspector.TabbedEditorContainer=function(delegate,settingName,placeholderText)
{WebInspector.Object.call(this);this._delegate=delegate;this._tabbedPane=new WebInspector.TabbedPane();this._tabbedPane.setPlaceholderText(placeholderText);this._tabbedPane.setTabDelegate(new WebInspector.EditorContainerTabDelegate(this));this._tabbedPane.closeableTabs=true;this._tabbedPane.element.id="sources-editor-container-tabbed-pane";this._tabbedPane.addEventListener(WebInspector.TabbedPane.EventTypes.TabClosed,this._tabClosed,this);this._tabbedPane.addEventListener(WebInspector.TabbedPane.EventTypes.TabSelected,this._tabSelected,this);this._tabIds=new Map();this._files={};this._previouslyViewedFilesSetting=WebInspector.settings.createSetting(settingName,[]);this._history=WebInspector.TabbedEditorContainer.History.fromObject(this._previouslyViewedFilesSetting.get());}
WebInspector.TabbedEditorContainer.Events={EditorSelected:"EditorSelected",EditorClosed:"EditorClosed"}
WebInspector.TabbedEditorContainer._tabId=0;WebInspector.TabbedEditorContainer.maximalPreviouslyViewedFilesCount=30;WebInspector.TabbedEditorContainer.prototype={get view()
{return this._tabbedPane;},get visibleView()
{return this._tabbedPane.visibleView;},fileViews:function()
{return(this._tabbedPane.tabViews());},show:function(parentElement)
{this._tabbedPane.show(parentElement);},showFile:function(uiSourceCode)
{this._innerShowFile(uiSourceCode,true);},closeFile:function(uiSourceCode)
{var tabId=this._tabIds.get(uiSourceCode);if(!tabId)
return;this._closeTabs([tabId]);},historyUISourceCodes:function()
{var uriToUISourceCode={};for(var id in this._files){var uiSourceCode=this._files[id];uriToUISourceCode[uiSourceCode.uri()]=uiSourceCode;}
var result=[];var uris=this._history._urls();for(var i=0;i<uris.length;++i){var uiSourceCode=uriToUISourceCode[uris[i]];if(uiSourceCode)
result.push(uiSourceCode);}
return result;},_addViewListeners:function()
{if(!this._currentView)
return;this._currentView.addEventListener(WebInspector.SourceFrame.Events.ScrollChanged,this._scrollChanged,this);this._currentView.addEventListener(WebInspector.SourceFrame.Events.SelectionChanged,this._selectionChanged,this);},_removeViewListeners:function()
{if(!this._currentView)
return;this._currentView.removeEventListener(WebInspector.SourceFrame.Events.ScrollChanged,this._scrollChanged,this);this._currentView.removeEventListener(WebInspector.SourceFrame.Events.SelectionChanged,this._selectionChanged,this);},_scrollChanged:function(event)
{var lineNumber=(event.data);this._history.updateScrollLineNumber(this._currentFile.uri(),lineNumber);this._history.save(this._previouslyViewedFilesSetting);},_selectionChanged:function(event)
{var range=(event.data);this._history.updateSelectionRange(this._currentFile.uri(),range);this._history.save(this._previouslyViewedFilesSetting);},_innerShowFile:function(uiSourceCode,userGesture)
{if(this._currentFile===uiSourceCode)
return;this._removeViewListeners();this._currentFile=uiSourceCode;var tabId=this._tabIds.get(uiSourceCode)||this._appendFileTab(uiSourceCode,userGesture);this._tabbedPane.selectTab(tabId,userGesture);if(userGesture)
this._editorSelectedByUserAction();this._currentView=this.visibleView;this._addViewListeners();var eventData={currentFile:this._currentFile,userGesture:userGesture};this.dispatchEventToListeners(WebInspector.TabbedEditorContainer.Events.EditorSelected,eventData);},_titleForFile:function(uiSourceCode)
{var maxDisplayNameLength=30;var title=uiSourceCode.displayName(true).trimMiddle(maxDisplayNameLength);if(uiSourceCode.isDirty()||uiSourceCode.hasUnsavedCommittedChanges())
title+="*";return title;},_maybeCloseTab:function(id,nextTabId)
{var uiSourceCode=this._files[id];var shouldPrompt=uiSourceCode.isDirty()&&uiSourceCode.project().canSetFileContent();if(!shouldPrompt||confirm(WebInspector.UIString("Are you sure you want to close unsaved file: %s?",uiSourceCode.name()))){uiSourceCode.resetWorkingCopy();if(nextTabId)
this._tabbedPane.selectTab(nextTabId,true);this._tabbedPane.closeTab(id,true);return true;}
return false;},_closeTabs:function(ids)
{var dirtyTabs=[];var cleanTabs=[];for(var i=0;i<ids.length;++i){var id=ids[i];var uiSourceCode=this._files[id];if(uiSourceCode.isDirty())
dirtyTabs.push(id);else
cleanTabs.push(id);}
if(dirtyTabs.length)
this._tabbedPane.selectTab(dirtyTabs[0],true);this._tabbedPane.closeTabs(cleanTabs,true);for(var i=0;i<dirtyTabs.length;++i){var nextTabId=i+1<dirtyTabs.length?dirtyTabs[i+1]:null;if(!this._maybeCloseTab(dirtyTabs[i],nextTabId))
break;}},addUISourceCode:function(uiSourceCode)
{var uri=uiSourceCode.uri();if(this._userSelectedFiles)
return;var index=this._history.index(uri)
if(index===-1)
return;var tabId=this._tabIds.get(uiSourceCode)||this._appendFileTab(uiSourceCode,false);if(!index){this._innerShowFile(uiSourceCode,false);return;}
if(!this._currentFile)
return;var currentProjectType=this._currentFile.project().type();var addedProjectType=uiSourceCode.project().type();var snippetsProjectType=WebInspector.projectTypes.Snippets;if(this._history.index(this._currentFile.uri())&&currentProjectType===snippetsProjectType&&addedProjectType!==snippetsProjectType)
this._innerShowFile(uiSourceCode,false);},removeUISourceCode:function(uiSourceCode)
{this.removeUISourceCodes([uiSourceCode]);},removeUISourceCodes:function(uiSourceCodes)
{var tabIds=[];for(var i=0;i<uiSourceCodes.length;++i){var uiSourceCode=uiSourceCodes[i];var tabId=this._tabIds.get(uiSourceCode);if(tabId)
tabIds.push(tabId);}
this._tabbedPane.closeTabs(tabIds);},_editorClosedByUserAction:function(uiSourceCode)
{this._userSelectedFiles=true;this._history.remove(uiSourceCode.uri());this._updateHistory();},_editorSelectedByUserAction:function()
{this._userSelectedFiles=true;this._updateHistory();},_updateHistory:function()
{var tabIds=this._tabbedPane.lastOpenedTabIds(WebInspector.TabbedEditorContainer.maximalPreviouslyViewedFilesCount);function tabIdToURI(tabId)
{return this._files[tabId].uri();}
this._history.update(tabIds.map(tabIdToURI.bind(this)));this._history.save(this._previouslyViewedFilesSetting);},_tooltipForFile:function(uiSourceCode)
{return uiSourceCode.originURL();},_appendFileTab:function(uiSourceCode,userGesture)
{var view=this._delegate.viewForFile(uiSourceCode);var title=this._titleForFile(uiSourceCode);var tooltip=this._tooltipForFile(uiSourceCode);var tabId=this._generateTabId();this._tabIds.set(uiSourceCode,tabId);this._files[tabId]=uiSourceCode;var savedSelectionRange=this._history.selectionRange(uiSourceCode.uri());if(savedSelectionRange)
view.setSelection(savedSelectionRange);var savedScrollLineNumber=this._history.scrollLineNumber(uiSourceCode.uri());if(savedScrollLineNumber)
view.scrollToLine(savedScrollLineNumber);this._tabbedPane.appendTab(tabId,title,view,tooltip,userGesture);this._updateFileTitle(uiSourceCode);this._addUISourceCodeListeners(uiSourceCode);return tabId;},_tabClosed:function(event)
{var tabId=(event.data.tabId);var userGesture=(event.data.isUserGesture);var uiSourceCode=this._files[tabId];if(this._currentFile===uiSourceCode){this._removeViewListeners();delete this._currentView;delete this._currentFile;}
this._tabIds.remove(uiSourceCode);delete this._files[tabId];this._removeUISourceCodeListeners(uiSourceCode);this.dispatchEventToListeners(WebInspector.TabbedEditorContainer.Events.EditorClosed,uiSourceCode);if(userGesture)
this._editorClosedByUserAction(uiSourceCode);},_tabSelected:function(event)
{var tabId=(event.data.tabId);var userGesture=(event.data.isUserGesture);var uiSourceCode=this._files[tabId];this._innerShowFile(uiSourceCode,userGesture);},_addUISourceCodeListeners:function(uiSourceCode)
{uiSourceCode.addEventListener(WebInspector.UISourceCode.Events.TitleChanged,this._uiSourceCodeTitleChanged,this);uiSourceCode.addEventListener(WebInspector.UISourceCode.Events.WorkingCopyChanged,this._uiSourceCodeWorkingCopyChanged,this);uiSourceCode.addEventListener(WebInspector.UISourceCode.Events.WorkingCopyCommitted,this._uiSourceCodeWorkingCopyCommitted,this);uiSourceCode.addEventListener(WebInspector.UISourceCode.Events.SavedStateUpdated,this._uiSourceCodeSavedStateUpdated,this);},_removeUISourceCodeListeners:function(uiSourceCode)
{uiSourceCode.removeEventListener(WebInspector.UISourceCode.Events.TitleChanged,this._uiSourceCodeTitleChanged,this);uiSourceCode.removeEventListener(WebInspector.UISourceCode.Events.WorkingCopyChanged,this._uiSourceCodeWorkingCopyChanged,this);uiSourceCode.removeEventListener(WebInspector.UISourceCode.Events.WorkingCopyCommitted,this._uiSourceCodeWorkingCopyCommitted,this);uiSourceCode.removeEventListener(WebInspector.UISourceCode.Events.SavedStateUpdated,this._uiSourceCodeSavedStateUpdated,this);},_updateFileTitle:function(uiSourceCode)
{var tabId=this._tabIds.get(uiSourceCode);if(tabId){var title=this._titleForFile(uiSourceCode);this._tabbedPane.changeTabTitle(tabId,title);if(uiSourceCode.hasUnsavedCommittedChanges())
this._tabbedPane.setTabIcon(tabId,"editor-container-unsaved-committed-changes-icon",WebInspector.UIString("Changes to this file were not saved to file system."));else
this._tabbedPane.setTabIcon(tabId,"");}},_uiSourceCodeTitleChanged:function(event)
{var uiSourceCode=(event.target);this._updateFileTitle(uiSourceCode);this._updateHistory();},_uiSourceCodeWorkingCopyChanged:function(event)
{var uiSourceCode=(event.target);this._updateFileTitle(uiSourceCode);},_uiSourceCodeWorkingCopyCommitted:function(event)
{var uiSourceCode=(event.target);this._updateFileTitle(uiSourceCode);},_uiSourceCodeSavedStateUpdated:function(event)
{var uiSourceCode=(event.target);this._updateFileTitle(uiSourceCode);},reset:function()
{delete this._userSelectedFiles;},_generateTabId:function()
{return"tab_"+(WebInspector.TabbedEditorContainer._tabId++);},currentFile:function()
{return this._currentFile;},__proto__:WebInspector.Object.prototype}
WebInspector.TabbedEditorContainer.HistoryItem=function(url,selectionRange,scrollLineNumber)
{this.url=url;this._isSerializable=url.length<WebInspector.TabbedEditorContainer.HistoryItem.serializableUrlLengthLimit;this.selectionRange=selectionRange;this.scrollLineNumber=scrollLineNumber;}
WebInspector.TabbedEditorContainer.HistoryItem.serializableUrlLengthLimit=4096;WebInspector.TabbedEditorContainer.HistoryItem.fromObject=function(serializedHistoryItem)
{var selectionRange=serializedHistoryItem.selectionRange?WebInspector.TextRange.fromObject(serializedHistoryItem.selectionRange):undefined;return new WebInspector.TabbedEditorContainer.HistoryItem(serializedHistoryItem.url,selectionRange,serializedHistoryItem.scrollLineNumber);}
WebInspector.TabbedEditorContainer.HistoryItem.prototype={serializeToObject:function()
{if(!this._isSerializable)
return null;var serializedHistoryItem={};serializedHistoryItem.url=this.url;serializedHistoryItem.selectionRange=this.selectionRange;serializedHistoryItem.scrollLineNumber=this.scrollLineNumber;return serializedHistoryItem;}}
WebInspector.TabbedEditorContainer.History=function(items)
{this._items=items;this._rebuildItemIndex();}
WebInspector.TabbedEditorContainer.History.fromObject=function(serializedHistory)
{var items=[];for(var i=0;i<serializedHistory.length;++i)
items.push(WebInspector.TabbedEditorContainer.HistoryItem.fromObject(serializedHistory[i]));return new WebInspector.TabbedEditorContainer.History(items);}
WebInspector.TabbedEditorContainer.History.prototype={index:function(url)
{var index=this._itemsIndex[url];if(typeof index==="number")
return index;return-1;},_rebuildItemIndex:function()
{this._itemsIndex={};for(var i=0;i<this._items.length;++i){console.assert(!this._itemsIndex.hasOwnProperty(this._items[i].url));this._itemsIndex[this._items[i].url]=i;}},selectionRange:function(url)
{var index=this.index(url);return index!==-1?this._items[index].selectionRange:undefined;},updateSelectionRange:function(url,selectionRange)
{if(!selectionRange)
return;var index=this.index(url);if(index===-1)
return;this._items[index].selectionRange=selectionRange;},scrollLineNumber:function(url)
{var index=this.index(url);return index!==-1?this._items[index].scrollLineNumber:undefined;},updateScrollLineNumber:function(url,scrollLineNumber)
{var index=this.index(url);if(index===-1)
return;this._items[index].scrollLineNumber=scrollLineNumber;},update:function(urls)
{for(var i=urls.length-1;i>=0;--i){var index=this.index(urls[i]);var item;if(index!==-1){item=this._items[index];this._items.splice(index,1);}else
item=new WebInspector.TabbedEditorContainer.HistoryItem(urls[i]);this._items.unshift(item);this._rebuildItemIndex();}},remove:function(url)
{var index=this.index(url);if(index!==-1){this._items.splice(index,1);this._rebuildItemIndex();}},save:function(setting)
{setting.set(this._serializeToObject());},_serializeToObject:function()
{var serializedHistory=[];for(var i=0;i<this._items.length;++i){var serializedItem=this._items[i].serializeToObject();if(serializedItem)
serializedHistory.push(serializedItem);if(serializedHistory.length===WebInspector.TabbedEditorContainer.maximalPreviouslyViewedFilesCount)
break;}
return serializedHistory;},_urls:function()
{var result=[];for(var i=0;i<this._items.length;++i)
result.push(this._items[i].url);return result;}}
WebInspector.EditorContainerTabDelegate=function(editorContainer)
{this._editorContainer=editorContainer;}
WebInspector.EditorContainerTabDelegate.prototype={closeTabs:function(tabbedPane,ids)
{this._editorContainer._closeTabs(ids);}};WebInspector.WatchExpressionsSidebarPane=function()
{WebInspector.SidebarPane.call(this,WebInspector.UIString("Watch Expressions"));this.section=new WebInspector.WatchExpressionsSection();this.bodyElement.appendChild(this.section.element);var refreshButton=document.createElement("button");refreshButton.className="pane-title-button refresh";refreshButton.addEventListener("click",this._refreshButtonClicked.bind(this),false);refreshButton.title=WebInspector.UIString("Refresh");this.titleElement.appendChild(refreshButton);var addButton=document.createElement("button");addButton.className="pane-title-button add";addButton.addEventListener("click",this._addButtonClicked.bind(this),false);this.titleElement.appendChild(addButton);addButton.title=WebInspector.UIString("Add watch expression");this._requiresUpdate=true;WebInspector.context.addFlavorChangeListener(WebInspector.ExecutionContext,this.refreshExpressions,this);}
WebInspector.WatchExpressionsSidebarPane.prototype={wasShown:function()
{this._refreshExpressionsIfNeeded();},refreshExpressions:function()
{this._requiresUpdate=true;this._refreshExpressionsIfNeeded();},addExpression:function(expression)
{this.section.addExpression(expression);this.expand();},_refreshExpressionsIfNeeded:function()
{if(this._requiresUpdate&&this.isShowing()){this.section.update();delete this._requiresUpdate;}else
this._requiresUpdate=true;},_addButtonClicked:function(event)
{event.consume();this.expand();this.section.addNewExpressionAndEdit();},_refreshButtonClicked:function(event)
{event.consume();this.refreshExpressions();},__proto__:WebInspector.SidebarPane.prototype}
WebInspector.WatchExpressionsSection=function()
{this._watchObjectGroupId="watch-group";WebInspector.PropertiesSection.call(this,"");this.treeElementConstructor=WebInspector.WatchedPropertyTreeElement;this.skipProto=false;this._expandedExpressions={};this._expandedProperties={};this.emptyElement=document.createElement("div");this.emptyElement.className="info";this.emptyElement.textContent=WebInspector.UIString("No Watch Expressions");this.watchExpressions=WebInspector.settings.watchExpressions.get();this.headerElement.className="hidden";this.editable=true;this.expanded=true;this.propertiesElement.classList.add("watch-expressions");this.element.addEventListener("mousemove",this._mouseMove.bind(this),true);this.element.addEventListener("mouseout",this._mouseOut.bind(this),true);this.element.addEventListener("dblclick",this._sectionDoubleClick.bind(this),false);this.emptyElement.addEventListener("contextmenu",this._emptyElementContextMenu.bind(this),false);}
WebInspector.WatchExpressionsSection.NewWatchExpression="\xA0";WebInspector.WatchExpressionsSection.prototype={update:function(e)
{if(e)
e.consume();function appendResult(expression,watchIndex,result,wasThrown)
{if(!result)
return;var property=new WebInspector.RemoteObjectProperty(expression,result);property.watchIndex=watchIndex;property.wasThrown=wasThrown;properties.push(property);if(properties.length==propertyCount){this.updateProperties(properties);if(this._newExpressionAdded){delete this._newExpressionAdded;var treeElement=this.findAddedTreeElement();if(treeElement)
treeElement.startEditing();}
if(this._lastMouseMovePageY)
this._updateHoveredElement(this._lastMouseMovePageY);}}
WebInspector.targetManager.targets().forEach(function(target){target.runtimeAgent().releaseObjectGroup(this._watchObjectGroupId)},this);var properties=[];var propertyCount=0;for(var i=0;i<this.watchExpressions.length;++i){if(!this.watchExpressions[i])
continue;++propertyCount;}
var currentExecutionContext=WebInspector.context.flavor(WebInspector.ExecutionContext);if(currentExecutionContext){for(var i=0;i<this.watchExpressions.length;++i){var expression=this.watchExpressions[i];if(!expression)
continue;currentExecutionContext.evaluate(expression,this._watchObjectGroupId,false,true,false,false,appendResult.bind(this,expression,i));}}
if(!propertyCount){if(!this.emptyElement.parentNode)
this.element.appendChild(this.emptyElement);}else{if(this.emptyElement.parentNode)
this.element.removeChild(this.emptyElement);}
this.expanded=(propertyCount!=0);},updateProperties:function(properties)
{this.propertiesTreeOutline.removeChildren();WebInspector.ObjectPropertyTreeElement.populateWithProperties(this.propertiesTreeOutline,properties,[],WebInspector.WatchExpressionTreeElement,WebInspector.WatchExpressionsSection.CompareProperties,false,null);this.propertiesForTest=properties;},addExpression:function(expression)
{this.watchExpressions.push(expression);this.saveExpressions();this.update();},addNewExpressionAndEdit:function()
{this._newExpressionAdded=true;this.watchExpressions.push(WebInspector.WatchExpressionsSection.NewWatchExpression);this.update();},_sectionDoubleClick:function(event)
{if(event.target!==this.element&&event.target!==this.propertiesElement&&event.target!==this.emptyElement)
return;event.consume();this.addNewExpressionAndEdit();},updateExpression:function(element,value)
{if(value===null){var index=element.property.watchIndex;this.watchExpressions.splice(index,1);}
else
this.watchExpressions[element.property.watchIndex]=value;this.saveExpressions();this.update();},_deleteAllExpressions:function()
{this.watchExpressions=[];this.saveExpressions();this.update();},findAddedTreeElement:function()
{var children=this.propertiesTreeOutline.children;for(var i=0;i<children.length;++i){if(children[i].property.name===WebInspector.WatchExpressionsSection.NewWatchExpression)
return children[i];}
return null;},saveExpressions:function()
{var toSave=[];for(var i=0;i<this.watchExpressions.length;i++)
if(this.watchExpressions[i])
toSave.push(this.watchExpressions[i]);WebInspector.settings.watchExpressions.set(toSave);return toSave.length;},_mouseMove:function(e)
{if(this.propertiesElement.firstChild)
this._updateHoveredElement(e.pageY);},_mouseOut:function()
{if(this._hoveredElement){this._hoveredElement.classList.remove("hovered");delete this._hoveredElement;}
delete this._lastMouseMovePageY;},_updateHoveredElement:function(pageY)
{var candidateElement=this.propertiesElement.firstChild;while(true){var next=candidateElement.nextSibling;while(next&&!next.clientHeight)
next=next.nextSibling;if(!next||next.totalOffsetTop()>pageY)
break;candidateElement=next;}
if(this._hoveredElement!==candidateElement){if(this._hoveredElement)
this._hoveredElement.classList.remove("hovered");if(candidateElement)
candidateElement.classList.add("hovered");this._hoveredElement=candidateElement;}
this._lastMouseMovePageY=pageY;},_emptyElementContextMenu:function(event)
{var contextMenu=new WebInspector.ContextMenu(event);contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Add watch expression":"Add Watch Expression"),this.addNewExpressionAndEdit.bind(this));contextMenu.show();},__proto__:WebInspector.PropertiesSection.prototype}
WebInspector.WatchExpressionsSection.CompareProperties=function(propertyA,propertyB)
{if(propertyA.watchIndex==propertyB.watchIndex)
return 0;else if(propertyA.watchIndex<propertyB.watchIndex)
return-1;else
return 1;}
WebInspector.WatchExpressionTreeElement=function(property)
{WebInspector.ObjectPropertyTreeElement.call(this,property);}
WebInspector.WatchExpressionTreeElement.prototype={onexpand:function()
{WebInspector.ObjectPropertyTreeElement.prototype.onexpand.call(this);this.treeOutline.section._expandedExpressions[this._expression()]=true;},oncollapse:function()
{WebInspector.ObjectPropertyTreeElement.prototype.oncollapse.call(this);delete this.treeOutline.section._expandedExpressions[this._expression()];},onattach:function()
{WebInspector.ObjectPropertyTreeElement.prototype.onattach.call(this);if(this.treeOutline.section._expandedExpressions[this._expression()])
this.expanded=true;},_expression:function()
{return this.property.name;},update:function()
{WebInspector.ObjectPropertyTreeElement.prototype.update.call(this);if(this.property.wasThrown){this.valueElement.textContent=WebInspector.UIString("<not available>");this.listItemElement.classList.add("dimmed");}else
this.listItemElement.classList.remove("dimmed");var deleteButton=document.createElement("input");deleteButton.type="button";deleteButton.title=WebInspector.UIString("Delete watch expression.");deleteButton.classList.add("enabled-button");deleteButton.classList.add("delete-button");deleteButton.addEventListener("click",this._deleteButtonClicked.bind(this),false);this.listItemElement.addEventListener("contextmenu",this._contextMenu.bind(this),false);this.listItemElement.insertBefore(deleteButton,this.listItemElement.firstChild);},populateContextMenu:function(contextMenu)
{if(!this.isEditing()){contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Add watch expression":"Add Watch Expression"),this.treeOutline.section.addNewExpressionAndEdit.bind(this.treeOutline.section));contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Delete watch expression":"Delete Watch Expression"),this._deleteButtonClicked.bind(this));}
if(this.treeOutline.section.watchExpressions.length>1)
contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Delete all watch expressions":"Delete All Watch Expressions"),this._deleteAllButtonClicked.bind(this));},_contextMenu:function(event)
{var contextMenu=new WebInspector.ContextMenu(event);this.populateContextMenu(contextMenu);contextMenu.show();},_deleteAllButtonClicked:function()
{this.treeOutline.section._deleteAllExpressions();},_deleteButtonClicked:function()
{this.treeOutline.section.updateExpression(this,null);},renderPromptAsBlock:function()
{return true;},elementAndValueToEdit:function()
{return{element:this.nameElement,value:this.property.name.trim()};},editingCancelled:function(element,context)
{if(!context.elementToEdit.textContent)
this.treeOutline.section.updateExpression(this,null);WebInspector.ObjectPropertyTreeElement.prototype.editingCancelled.call(this,element,context);},applyExpression:function(expression)
{expression=expression.trim();this.property.name=expression||null;this.treeOutline.section.updateExpression(this,expression);},__proto__:WebInspector.ObjectPropertyTreeElement.prototype}
WebInspector.WatchedPropertyTreeElement=function(property)
{WebInspector.ObjectPropertyTreeElement.call(this,property);}
WebInspector.WatchedPropertyTreeElement.prototype={onattach:function()
{WebInspector.ObjectPropertyTreeElement.prototype.onattach.call(this);if(this.hasChildren&&this.propertyPath()in this.treeOutline.section._expandedProperties)
this.expand();},onexpand:function()
{WebInspector.ObjectPropertyTreeElement.prototype.onexpand.call(this);this.treeOutline.section._expandedProperties[this.propertyPath()]=true;},oncollapse:function()
{WebInspector.ObjectPropertyTreeElement.prototype.oncollapse.call(this);delete this.treeOutline.section._expandedProperties[this.propertyPath()];},__proto__:WebInspector.ObjectPropertyTreeElement.prototype};WebInspector.ThreadsSidebarPane=function()
{WebInspector.SidebarPane.call(this,WebInspector.UIString("Threads"));this._targetsToPlacards=new Map();this._placardsToTargets=new Map();this._selectedPlacard=null;WebInspector.targetManager.addModelListener(WebInspector.DebuggerModel,WebInspector.DebuggerModel.Events.DebuggerPaused,this._onDebuggerStateChanged,this);WebInspector.targetManager.addModelListener(WebInspector.DebuggerModel,WebInspector.DebuggerModel.Events.DebuggerResumed,this._onDebuggerStateChanged,this);WebInspector.context.addFlavorChangeListener(WebInspector.Target,this._targetChanged,this);WebInspector.targetManager.observeTargets(this);}
WebInspector.ThreadsSidebarPane.prototype={targetAdded:function(target)
{var placard=new WebInspector.Placard(target.name(),"");placard.element.addEventListener("click",this._onPlacardClick.bind(this,placard),false);var currentTarget=WebInspector.context.flavor(WebInspector.Target);if(currentTarget===target)
this._selectPlacard(placard);this._targetsToPlacards.set(target,placard);this._placardsToTargets.set(placard,target);this.bodyElement.appendChild(placard.element);this._updateDebuggerState(target);},targetRemoved:function(target)
{var placard=this._targetsToPlacards.remove(target);this._placardsToTargets.remove(placard);this.bodyElement.removeChild(placard.element);},_targetChanged:function(event)
{var newTarget=(event.data);var placard=(this._targetsToPlacards.get(newTarget));this._selectPlacard(placard);},_onDebuggerStateChanged:function(event)
{var debuggerModel=(event.target);this._updateDebuggerState(debuggerModel.target());},_updateDebuggerState:function(target)
{var placard=this._targetsToPlacards.get(target);placard.subtitle=target.debuggerModel.isPaused()?WebInspector.UIString("paused"):WebInspector.UIString("");},_selectPlacard:function(placard)
{if(placard===this._selectedPlacard)
return;if(this._selectedPlacard)
this._selectedPlacard.selected=false;this._selectedPlacard=placard;placard.selected=true;},_onPlacardClick:function(placard)
{WebInspector.context.setFlavor(WebInspector.Target,this._placardsToTargets.get(placard));placard.element.scrollIntoViewIfNeeded();},__proto__:WebInspector.SidebarPane.prototype};WebInspector.FormatterScriptMapping=function(target,editorAction)
{this._target=target;this._editorAction=editorAction;}
WebInspector.FormatterScriptMapping.prototype={rawLocationToUILocation:function(rawLocation)
{var debuggerModelLocation=(rawLocation);var script=debuggerModelLocation.script();var uiSourceCode=this._editorAction._uiSourceCodes.get(script);if(!uiSourceCode)
return null;var formatData=this._editorAction._formatData.get(uiSourceCode);if(!formatData)
return null;var mapping=formatData.mapping;var lineNumber=debuggerModelLocation.lineNumber;var columnNumber=debuggerModelLocation.columnNumber||0;var formattedLocation=mapping.originalToFormatted(lineNumber,columnNumber);return uiSourceCode.uiLocation(formattedLocation[0],formattedLocation[1]);},uiLocationToRawLocation:function(uiSourceCode,lineNumber,columnNumber)
{var formatData=this._editorAction._formatData.get(uiSourceCode);if(!formatData)
return null;var originalLocation=formatData.mapping.formattedToOriginal(lineNumber,columnNumber);for(var i=0;i<formatData.scripts.length;++i){if(formatData.scripts[i].target()===this._target)
return this._target.debuggerModel.createRawLocation(formatData.scripts[i],originalLocation[0],originalLocation[1])}
return null;},isIdentity:function()
{return false;},uiLineHasMapping:function(uiSourceCode,lineNumber)
{return true;}}
WebInspector.FormatterScriptMapping.FormatData=function(projectId,path,mapping,scripts)
{this.projectId=projectId;this.path=path;this.mapping=mapping;this.scripts=scripts;}
WebInspector.FormatterProjectDelegate=function(workspace,id)
{WebInspector.ContentProviderBasedProjectDelegate.call(this,workspace,id,WebInspector.projectTypes.Formatter);}
WebInspector.FormatterProjectDelegate.prototype={displayName:function()
{return"formatter";},_addFormatted:function(name,sourceURL,contentType,content)
{var contentProvider=new WebInspector.StaticContentProvider(contentType,content);return this.addContentProvider(sourceURL,name+":formatted","deobfuscated:"+sourceURL,contentProvider);},_removeFormatted:function(path)
{this.removeFile(path);},__proto__:WebInspector.ContentProviderBasedProjectDelegate.prototype}
WebInspector.ScriptFormatterEditorAction=function()
{this._projectId="formatter:";this._projectDelegate=new WebInspector.FormatterProjectDelegate(WebInspector.workspace,this._projectId);this._uiSourceCodes=new Map();this._formattedPaths=new StringMap();this._formatData=new Map();this._pathsToFormatOnLoad=new StringSet();this._scriptMappingByTarget=new Map();this._workspace=WebInspector.workspace;WebInspector.targetManager.observeTargets(this);}
WebInspector.ScriptFormatterEditorAction.prototype={targetAdded:function(target)
{this._scriptMappingByTarget.set(target,new WebInspector.FormatterScriptMapping(target,this));target.debuggerModel.addEventListener(WebInspector.DebuggerModel.Events.GlobalObjectCleared,this._debuggerReset,this);},targetRemoved:function(target)
{this._scriptMappingByTarget.remove(target);this._cleanForTarget(target);target.debuggerModel.removeEventListener(WebInspector.DebuggerModel.Events.GlobalObjectCleared,this._debuggerReset,this);},_editorSelected:function(event)
{var uiSourceCode=(event.data);this._updateButton(uiSourceCode);var path=uiSourceCode.project().id()+":"+uiSourceCode.path();if(this._isFormatableScript(uiSourceCode)&&uiSourceCode.url&&this._pathsToFormatOnLoad.contains(path)&&!this._formattedPaths.get(path))
this._formatUISourceCodeScript(uiSourceCode);},_editorClosed:function(event)
{var uiSourceCode=(event.data.uiSourceCode);var wasSelected=(event.data.wasSelected);if(wasSelected)
this._updateButton(null);this._discardFormattedUISourceCodeScript(uiSourceCode);},_updateButton:function(uiSourceCode)
{this._button.element.classList.toggle("hidden",!this._isFormatableScript(uiSourceCode));},button:function(sourcesView)
{if(this._button)
return this._button.element;this._sourcesView=sourcesView;this._sourcesView.addEventListener(WebInspector.SourcesView.Events.EditorSelected,this._editorSelected.bind(this));this._sourcesView.addEventListener(WebInspector.SourcesView.Events.EditorClosed,this._editorClosed.bind(this));this._button=new WebInspector.StatusBarButton(WebInspector.UIString("Pretty print"),"sources-toggle-pretty-print-status-bar-item");this._button.toggled=false;this._button.addEventListener("click",this._toggleFormatScriptSource,this);this._updateButton(null);return this._button.element;},_isFormatableScript:function(uiSourceCode)
{if(!uiSourceCode)
return false;var supportedProjectTypes=[WebInspector.projectTypes.Network,WebInspector.projectTypes.Debugger,WebInspector.projectTypes.ContentScripts];if(supportedProjectTypes.indexOf(uiSourceCode.project().type())===-1)
return false;var contentType=uiSourceCode.contentType();return contentType===WebInspector.resourceTypes.Script||contentType===WebInspector.resourceTypes.Document;},_toggleFormatScriptSource:function()
{var uiSourceCode=this._sourcesView.currentUISourceCode();if(!this._isFormatableScript(uiSourceCode))
return;this._formatUISourceCodeScript(uiSourceCode);WebInspector.notifications.dispatchEventToListeners(WebInspector.UserMetrics.UserAction,{action:WebInspector.UserMetrics.UserActionNames.TogglePrettyPrint,enabled:true,url:uiSourceCode.originURL()});},_showIfNeeded:function(uiSourceCode,formattedUISourceCode,mapping)
{if(uiSourceCode!==this._sourcesView.currentUISourceCode())
return;var sourceFrame=this._sourcesView.viewForFile(uiSourceCode);var start=[0,0];if(sourceFrame){var selection=sourceFrame.selection();start=mapping.originalToFormatted(selection.startLine,selection.startColumn);}
this._sourcesView.showSourceLocation(formattedUISourceCode,start[0],start[1]);this._updateButton(formattedUISourceCode);},_discardFormattedUISourceCodeScript:function(formattedUISourceCode)
{var formatData=this._formatData.get(formattedUISourceCode);if(!formatData)
return;this._formatData.remove(formattedUISourceCode);var path=formatData.projectId+":"+formatData.path;this._formattedPaths.remove(path);this._pathsToFormatOnLoad.remove(path);for(var i=0;i<formatData.scripts.length;++i){this._uiSourceCodes.remove(formatData.scripts[i]);WebInspector.debuggerWorkspaceBinding.popSourceMapping(formatData.scripts[i]);}
this._projectDelegate._removeFormatted(formattedUISourceCode.path());},_cleanForTarget:function(target)
{var uiSourceCodes=this._formatData.keys();for(var i=0;i<uiSourceCodes.length;++i){WebInspector.debuggerWorkspaceBinding.setSourceMapping(target,uiSourceCodes[i],null);var formatData=this._formatData.get(uiSourceCodes[i]);var scripts=[];for(var j=0;j<formatData.scripts.length;++j){if(formatData.scripts[j].target()===target)
this._uiSourceCodes.remove(formatData.scripts[j]);else
scripts.push(formatData.scripts[j]);}
if(scripts.length)
formatData.scripts=scripts;else{this._formattedPaths.remove(formatData.projectId+":"+formatData.path);this._formatData.remove(uiSourceCodes[i]);this._projectDelegate._removeFormatted(uiSourceCodes[i].path());}}},_debuggerReset:function(event)
{var debuggerModel=(event.target);this._cleanForTarget(debuggerModel.target());},_scriptsForUISourceCode:function(uiSourceCode)
{function isInlineScript(script)
{return script.isInlineScript();}
if(uiSourceCode.contentType()===WebInspector.resourceTypes.Document){var scripts=[];var targets=WebInspector.targetManager.targets();for(var i=0;i<targets.length;++i)
scripts.pushAll(targets[i].debuggerModel.scriptsForSourceURL(uiSourceCode.url));return scripts.filter(isInlineScript);}
if(uiSourceCode.contentType()===WebInspector.resourceTypes.Script){var rawLocations=WebInspector.debuggerWorkspaceBinding.uiLocationToRawLocations(uiSourceCode,0,0);return rawLocations.map(function(rawLocation){return rawLocation.script()});}
return[];},_formatUISourceCodeScript:function(uiSourceCode)
{var formattedPath=this._formattedPaths.get(uiSourceCode.project().id()+":"+uiSourceCode.path());if(formattedPath){var uiSourceCodePath=formattedPath;var formattedUISourceCode=this._workspace.uiSourceCode(this._projectId,uiSourceCodePath);var formatData=formattedUISourceCode?this._formatData.get(formattedUISourceCode):null;if(formatData)
this._showIfNeeded(uiSourceCode,(formattedUISourceCode),formatData.mapping);return;}
uiSourceCode.requestContent(contentLoaded.bind(this));function contentLoaded(content)
{var formatter=WebInspector.Formatter.createFormatter(uiSourceCode.contentType());formatter.formatContent(uiSourceCode.highlighterType(),content||"",innerCallback.bind(this));}
function innerCallback(formattedContent,formatterMapping)
{var scripts=this._scriptsForUISourceCode(uiSourceCode);var name;if(uiSourceCode.contentType()===WebInspector.resourceTypes.Document)
name=uiSourceCode.displayName();else
name=uiSourceCode.name()||(scripts.length?scripts[0].scriptId:"");formattedPath=this._projectDelegate._addFormatted(name,uiSourceCode.url,uiSourceCode.contentType(),formattedContent);var formattedUISourceCode=(this._workspace.uiSourceCode(this._projectId,formattedPath));var formatData=new WebInspector.FormatterScriptMapping.FormatData(uiSourceCode.project().id(),uiSourceCode.path(),formatterMapping,scripts);this._formatData.set(formattedUISourceCode,formatData);var path=uiSourceCode.project().id()+":"+uiSourceCode.path();this._formattedPaths.set(path,formattedPath);this._pathsToFormatOnLoad.add(path);for(var i=0;i<scripts.length;++i){this._uiSourceCodes.set(scripts[i],formattedUISourceCode);var scriptMapping=(this._scriptMappingByTarget.get(scripts[i].target()));WebInspector.debuggerWorkspaceBinding.pushSourceMapping(scripts[i],scriptMapping);}
var targets=WebInspector.targetManager.targets();for(var i=0;i<targets.length;++i){var scriptMapping=(this._scriptMappingByTarget.get(targets[i]));WebInspector.debuggerWorkspaceBinding.setSourceMapping(targets[i],formattedUISourceCode,scriptMapping);}
this._showIfNeeded(uiSourceCode,formattedUISourceCode,formatterMapping);}}};WebInspector.InplaceFormatterEditorAction=function()
{}
WebInspector.InplaceFormatterEditorAction.prototype={_editorSelected:function(event)
{var uiSourceCode=(event.data);this._updateButton(uiSourceCode);},_editorClosed:function(event)
{var wasSelected=(event.data.wasSelected);if(wasSelected)
this._updateButton(null);},_updateButton:function(uiSourceCode)
{this._button.element.classList.toggle("hidden",!this._isFormattable(uiSourceCode));},button:function(sourcesView)
{if(this._button)
return this._button.element;this._sourcesView=sourcesView;this._sourcesView.addEventListener(WebInspector.SourcesView.Events.EditorSelected,this._editorSelected.bind(this));this._sourcesView.addEventListener(WebInspector.SourcesView.Events.EditorClosed,this._editorClosed.bind(this));this._button=new WebInspector.StatusBarButton(WebInspector.UIString("Format"),"sources-toggle-pretty-print-status-bar-item");this._button.toggled=false;this._button.addEventListener("click",this._formatSourceInPlace,this);this._updateButton(null);return this._button.element;},_isFormattable:function(uiSourceCode)
{if(!uiSourceCode)
return false;return uiSourceCode.contentType()===WebInspector.resourceTypes.Stylesheet||uiSourceCode.project().type()===WebInspector.projectTypes.Snippets;},_formatSourceInPlace:function()
{var uiSourceCode=this._sourcesView.currentUISourceCode();if(!this._isFormattable(uiSourceCode))
return;if(uiSourceCode.isDirty())
contentLoaded.call(this,uiSourceCode.workingCopy());else
uiSourceCode.requestContent(contentLoaded.bind(this));function contentLoaded(content)
{var formatter=WebInspector.Formatter.createFormatter(uiSourceCode.contentType());formatter.formatContent(uiSourceCode.highlighterType(),content||"",innerCallback.bind(this));}
function innerCallback(formattedContent,formatterMapping)
{if(uiSourceCode.workingCopy()===formattedContent)
return;var sourceFrame=this._sourcesView.viewForFile(uiSourceCode);var start=[0,0];if(sourceFrame){var selection=sourceFrame.selection();start=formatterMapping.originalToFormatted(selection.startLine,selection.startColumn);}
uiSourceCode.setWorkingCopy(formattedContent);this._sourcesView.showSourceLocation(uiSourceCode,start[0],start[1]);}},};WebInspector.Formatter=function()
{}
WebInspector.Formatter.createFormatter=function(contentType)
{if(contentType===WebInspector.resourceTypes.Script||contentType===WebInspector.resourceTypes.Document||contentType===WebInspector.resourceTypes.Stylesheet)
return new WebInspector.ScriptFormatter();return new WebInspector.IdentityFormatter();}
WebInspector.Formatter.locationToPosition=function(lineEndings,lineNumber,columnNumber)
{var position=lineNumber?lineEndings[lineNumber-1]+1:0;return position+columnNumber;}
WebInspector.Formatter.positionToLocation=function(lineEndings,position)
{var lineNumber=lineEndings.upperBound(position-1);if(!lineNumber)
var columnNumber=position;else
var columnNumber=position-lineEndings[lineNumber-1]-1;return[lineNumber,columnNumber];}
WebInspector.Formatter.prototype={formatContent:function(mimeType,content,callback)
{}}
WebInspector.ScriptFormatter=function()
{this._tasks=[];}
WebInspector.ScriptFormatter.prototype={formatContent:function(mimeType,content,callback)
{content=content.replace(/\r\n?|[\n\u2028\u2029]/g,"\n").replace(/^\uFEFF/,'');const method="format";var parameters={mimeType:mimeType,content:content,indentString:WebInspector.settings.textEditorIndent.get()};this._tasks.push({data:parameters,callback:callback});this._worker.postMessage({method:method,params:parameters});},_didFormatContent:function(event)
{var task=this._tasks.shift();var originalContent=task.data.content;var formattedContent=event.data.content;var mapping=event.data["mapping"];var sourceMapping=new WebInspector.FormatterSourceMappingImpl(originalContent.lineEndings(),formattedContent.lineEndings(),mapping);task.callback(formattedContent,sourceMapping);},get _worker()
{if(!this._cachedWorker){this._cachedWorker=Runtime.startWorker("script_formatter_worker");this._cachedWorker.onmessage=(this._didFormatContent.bind(this));}
return this._cachedWorker;}}
WebInspector.IdentityFormatter=function()
{this._tasks=[];}
WebInspector.IdentityFormatter.prototype={formatContent:function(mimeType,content,callback)
{callback(content,new WebInspector.IdentityFormatterSourceMapping());}}
WebInspector.FormatterMappingPayload=function()
{this.original=[];this.formatted=[];}
WebInspector.FormatterSourceMapping=function()
{}
WebInspector.FormatterSourceMapping.prototype={originalToFormatted:function(lineNumber,columnNumber){},formattedToOriginal:function(lineNumber,columnNumber){}}
WebInspector.IdentityFormatterSourceMapping=function()
{}
WebInspector.IdentityFormatterSourceMapping.prototype={originalToFormatted:function(lineNumber,columnNumber)
{return[lineNumber,columnNumber||0];},formattedToOriginal:function(lineNumber,columnNumber)
{return[lineNumber,columnNumber||0];}}
WebInspector.FormatterSourceMappingImpl=function(originalLineEndings,formattedLineEndings,mapping)
{this._originalLineEndings=originalLineEndings;this._formattedLineEndings=formattedLineEndings;this._mapping=mapping;}
WebInspector.FormatterSourceMappingImpl.prototype={originalToFormatted:function(lineNumber,columnNumber)
{var originalPosition=WebInspector.Formatter.locationToPosition(this._originalLineEndings,lineNumber,columnNumber||0);var formattedPosition=this._convertPosition(this._mapping.original,this._mapping.formatted,originalPosition||0);return WebInspector.Formatter.positionToLocation(this._formattedLineEndings,formattedPosition);},formattedToOriginal:function(lineNumber,columnNumber)
{var formattedPosition=WebInspector.Formatter.locationToPosition(this._formattedLineEndings,lineNumber,columnNumber||0);var originalPosition=this._convertPosition(this._mapping.formatted,this._mapping.original,formattedPosition);return WebInspector.Formatter.positionToLocation(this._originalLineEndings,originalPosition||0);},_convertPosition:function(positions1,positions2,position)
{var index=positions1.upperBound(position)-1;var convertedPosition=positions2[index]+position-positions1[index];if(index<positions2.length-1&&convertedPosition>positions2[index+1])
convertedPosition=positions2[index+1];return convertedPosition;}};WebInspector.SourcesView=function(workspace,sourcesPanel)
{WebInspector.VBox.call(this);this.registerRequiredCSS("sourcesView.css");this.element.id="sources-panel-sources-view";this.setMinimumAndPreferredSizes(50,25,150,100);this._workspace=workspace;this._sourcesPanel=sourcesPanel;this._searchableView=new WebInspector.SearchableView(this);this._searchableView.setMinimalSearchQuerySize(0);this._searchableView.show(this.element);this._sourceFramesByUISourceCode=new Map();var tabbedEditorPlaceholderText=WebInspector.isMac()?WebInspector.UIString("Hit Cmd+P to open a file"):WebInspector.UIString("Hit Ctrl+P to open a file");this._editorContainer=new WebInspector.TabbedEditorContainer(this,"previouslyViewedFiles",tabbedEditorPlaceholderText);this._editorContainer.show(this._searchableView.element);this._editorContainer.addEventListener(WebInspector.TabbedEditorContainer.Events.EditorSelected,this._editorSelected,this);this._editorContainer.addEventListener(WebInspector.TabbedEditorContainer.Events.EditorClosed,this._editorClosed,this);this._historyManager=new WebInspector.EditingLocationHistoryManager(this,this.currentSourceFrame.bind(this));this._statusBarContainerElement=this.element.createChild("div","sources-status-bar");function appendButtonForExtension(EditorAction)
{this._statusBarContainerElement.appendChild(EditorAction.button(this));}
var editorActions=(self.runtime.instances(WebInspector.SourcesView.EditorAction));editorActions.forEach(appendButtonForExtension.bind(this));this._scriptViewStatusBarItemsContainer=this._statusBarContainerElement.createChild("div","inline-block");this._scriptViewStatusBarTextContainer=this._statusBarContainerElement.createChild("div","hbox");WebInspector.startBatchUpdate();this._workspace.uiSourceCodes().forEach(this._addUISourceCode.bind(this));WebInspector.endBatchUpdate();this._workspace.addEventListener(WebInspector.Workspace.Events.UISourceCodeAdded,this._uiSourceCodeAdded,this);this._workspace.addEventListener(WebInspector.Workspace.Events.UISourceCodeRemoved,this._uiSourceCodeRemoved,this);this._workspace.addEventListener(WebInspector.Workspace.Events.ProjectRemoved,this._projectRemoved.bind(this),this);function handleBeforeUnload(event)
{if(event.returnValue)
return;var unsavedSourceCodes=WebInspector.workspace.unsavedSourceCodes();if(!unsavedSourceCodes.length)
return;event.returnValue=WebInspector.UIString("DevTools have unsaved changes that will be permanently lost.");WebInspector.inspectorView.showPanel("sources");for(var i=0;i<unsavedSourceCodes.length;++i)
WebInspector.Revealer.reveal(unsavedSourceCodes[i]);}
window.addEventListener("beforeunload",handleBeforeUnload,true);this._shortcuts={};this.element.addEventListener("keydown",this._handleKeyDown.bind(this),false);}
WebInspector.SourcesView.Events={EditorClosed:"EditorClosed",EditorSelected:"EditorSelected",}
WebInspector.SourcesView.prototype={registerShortcuts:function(registerShortcutDelegate)
{function registerShortcut(shortcuts,handler)
{registerShortcutDelegate(shortcuts,handler);this._registerShortcuts(shortcuts,handler);}
registerShortcut.call(this,WebInspector.ShortcutsScreen.SourcesPanelShortcuts.JumpToPreviousLocation,this._onJumpToPreviousLocation.bind(this));registerShortcut.call(this,WebInspector.ShortcutsScreen.SourcesPanelShortcuts.JumpToNextLocation,this._onJumpToNextLocation.bind(this));registerShortcut.call(this,WebInspector.ShortcutsScreen.SourcesPanelShortcuts.CloseEditorTab,this._onCloseEditorTab.bind(this));registerShortcut.call(this,WebInspector.ShortcutsScreen.SourcesPanelShortcuts.GoToLine,this._showGoToLineDialog.bind(this));registerShortcut.call(this,WebInspector.ShortcutsScreen.SourcesPanelShortcuts.GoToMember,this._showOutlineDialog.bind(this));registerShortcut.call(this,[WebInspector.KeyboardShortcut.makeDescriptor("o",WebInspector.KeyboardShortcut.Modifiers.CtrlOrMeta|WebInspector.KeyboardShortcut.Modifiers.Shift)],this._showOutlineDialog.bind(this));registerShortcut.call(this,WebInspector.ShortcutsScreen.SourcesPanelShortcuts.ToggleBreakpoint,this._toggleBreakpoint.bind(this));registerShortcut.call(this,WebInspector.ShortcutsScreen.SourcesPanelShortcuts.Save,this._save.bind(this));registerShortcut.call(this,WebInspector.ShortcutsScreen.SourcesPanelShortcuts.SaveAll,this._saveAll.bind(this));},_registerShortcuts:function(keys,handler)
{for(var i=0;i<keys.length;++i)
this._shortcuts[keys[i].key]=handler;},_handleKeyDown:function(event)
{var shortcutKey=WebInspector.KeyboardShortcut.makeKeyFromEvent(event);var handler=this._shortcuts[shortcutKey];if(handler&&handler())
event.consume(true);},wasShown:function()
{WebInspector.VBox.prototype.wasShown.call(this);WebInspector.context.setFlavor(WebInspector.SourcesView,this);},willHide:function()
{WebInspector.context.setFlavor(WebInspector.SourcesView,null);WebInspector.VBox.prototype.willHide.call(this);},statusBarContainerElement:function()
{return this._statusBarContainerElement;},defaultFocusedElement:function()
{return this._editorContainer.view.defaultFocusedElement();},searchableView:function()
{return this._searchableView;},visibleView:function()
{return this._editorContainer.visibleView;},currentSourceFrame:function()
{var view=this.visibleView();if(!(view instanceof WebInspector.SourceFrame))
return null;return(view);},currentUISourceCode:function()
{return this._currentUISourceCode;},_onCloseEditorTab:function(event)
{var uiSourceCode=this.currentUISourceCode();if(!uiSourceCode)
return false;this._editorContainer.closeFile(uiSourceCode);return true;},_onJumpToPreviousLocation:function(event)
{this._historyManager.rollback();return true;},_onJumpToNextLocation:function(event)
{this._historyManager.rollover();return true;},_uiSourceCodeAdded:function(event)
{var uiSourceCode=(event.data);this._addUISourceCode(uiSourceCode);},_addUISourceCode:function(uiSourceCode)
{if(uiSourceCode.project().isServiceProject())
return;this._editorContainer.addUISourceCode(uiSourceCode);var currentUISourceCode=this._currentUISourceCode;if(currentUISourceCode&&currentUISourceCode.project().isServiceProject()&&currentUISourceCode!==uiSourceCode&&currentUISourceCode.url===uiSourceCode.url){this._showFile(uiSourceCode);this._editorContainer.removeUISourceCode(currentUISourceCode);}},_uiSourceCodeRemoved:function(event)
{var uiSourceCode=(event.data);this._removeUISourceCodes([uiSourceCode]);},_removeUISourceCodes:function(uiSourceCodes)
{this._editorContainer.removeUISourceCodes(uiSourceCodes);for(var i=0;i<uiSourceCodes.length;++i){this._removeSourceFrame(uiSourceCodes[i]);this._historyManager.removeHistoryForSourceCode(uiSourceCodes[i]);}},_projectRemoved:function(event)
{var project=event.data;var uiSourceCodes=project.uiSourceCodes();this._removeUISourceCodes(uiSourceCodes);if(project.type()===WebInspector.projectTypes.Network)
this._editorContainer.reset();},_updateScriptViewStatusBarItems:function()
{this._scriptViewStatusBarItemsContainer.removeChildren();this._scriptViewStatusBarTextContainer.removeChildren();var sourceFrame=this.currentSourceFrame();if(!sourceFrame)
return;var statusBarItems=sourceFrame.statusBarItems()||[];for(var i=0;i<statusBarItems.length;++i)
this._scriptViewStatusBarItemsContainer.appendChild(statusBarItems[i]);var statusBarText=sourceFrame.statusBarText();if(statusBarText)
this._scriptViewStatusBarTextContainer.appendChild(statusBarText);},showSourceLocation:function(uiSourceCode,lineNumber,columnNumber,omitFocus,omitHighlight)
{this._historyManager.updateCurrentState();var sourceFrame=this._showFile(uiSourceCode);if(typeof lineNumber==="number")
sourceFrame.revealPosition(lineNumber,columnNumber,!omitHighlight);this._historyManager.pushNewState();if(!omitFocus)
sourceFrame.focus();WebInspector.notifications.dispatchEventToListeners(WebInspector.UserMetrics.UserAction,{action:WebInspector.UserMetrics.UserActionNames.OpenSourceLink,url:uiSourceCode.originURL(),lineNumber:lineNumber});},_showFile:function(uiSourceCode)
{var sourceFrame=this._getOrCreateSourceFrame(uiSourceCode);if(this._currentUISourceCode===uiSourceCode)
return sourceFrame;this._currentUISourceCode=uiSourceCode;this._editorContainer.showFile(uiSourceCode);this._updateScriptViewStatusBarItems();return sourceFrame;},_createSourceFrame:function(uiSourceCode)
{var sourceFrame;switch(uiSourceCode.contentType()){case WebInspector.resourceTypes.Script:sourceFrame=new WebInspector.JavaScriptSourceFrame(this._sourcesPanel,uiSourceCode);break;case WebInspector.resourceTypes.Document:sourceFrame=new WebInspector.JavaScriptSourceFrame(this._sourcesPanel,uiSourceCode);break;case WebInspector.resourceTypes.Stylesheet:sourceFrame=new WebInspector.CSSSourceFrame(uiSourceCode);break;default:sourceFrame=new WebInspector.UISourceCodeFrame(uiSourceCode);break;}
sourceFrame.setHighlighterType(uiSourceCode.highlighterType());this._sourceFramesByUISourceCode.set(uiSourceCode,sourceFrame);this._historyManager.trackSourceFrameCursorJumps(sourceFrame);return sourceFrame;},_getOrCreateSourceFrame:function(uiSourceCode)
{return this._sourceFramesByUISourceCode.get(uiSourceCode)||this._createSourceFrame(uiSourceCode);},_sourceFrameMatchesUISourceCode:function(sourceFrame,uiSourceCode)
{switch(uiSourceCode.contentType()){case WebInspector.resourceTypes.Script:case WebInspector.resourceTypes.Document:return sourceFrame instanceof WebInspector.JavaScriptSourceFrame;case WebInspector.resourceTypes.Stylesheet:return sourceFrame instanceof WebInspector.CSSSourceFrame;default:return!(sourceFrame instanceof WebInspector.JavaScriptSourceFrame);}},_recreateSourceFrameIfNeeded:function(uiSourceCode)
{var oldSourceFrame=this._sourceFramesByUISourceCode.get(uiSourceCode);if(!oldSourceFrame)
return;if(this._sourceFrameMatchesUISourceCode(oldSourceFrame,uiSourceCode)){oldSourceFrame.setHighlighterType(uiSourceCode.highlighterType());}else{this._editorContainer.removeUISourceCode(uiSourceCode);this._removeSourceFrame(uiSourceCode);}},viewForFile:function(uiSourceCode)
{return this._getOrCreateSourceFrame(uiSourceCode);},_removeSourceFrame:function(uiSourceCode)
{var sourceFrame=this._sourceFramesByUISourceCode.get(uiSourceCode);if(!sourceFrame)
return;this._sourceFramesByUISourceCode.remove(uiSourceCode);sourceFrame.dispose();},clearCurrentExecutionLine:function()
{if(this._executionSourceFrame)
this._executionSourceFrame.clearExecutionLine();delete this._executionSourceFrame;},setExecutionLine:function(uiLocation)
{var sourceFrame=this._getOrCreateSourceFrame(uiLocation.uiSourceCode);sourceFrame.setExecutionLine(uiLocation.lineNumber);this._executionSourceFrame=sourceFrame;},_editorClosed:function(event)
{var uiSourceCode=(event.data);this._historyManager.removeHistoryForSourceCode(uiSourceCode);var wasSelected=false;if(this._currentUISourceCode===uiSourceCode){delete this._currentUISourceCode;wasSelected=true;}
this._updateScriptViewStatusBarItems();this._searchableView.resetSearch();var data={};data.uiSourceCode=uiSourceCode;data.wasSelected=wasSelected;this.dispatchEventToListeners(WebInspector.SourcesView.Events.EditorClosed,data);},_editorSelected:function(event)
{var uiSourceCode=(event.data.currentFile);var shouldUseHistoryManager=uiSourceCode!==this._currentUISourceCode&&event.data.userGesture;if(shouldUseHistoryManager)
this._historyManager.updateCurrentState();var sourceFrame=this._showFile(uiSourceCode);if(shouldUseHistoryManager)
this._historyManager.pushNewState();this._searchableView.setReplaceable(!!sourceFrame&&sourceFrame.canEditSource());this._searchableView.resetSearch();this.dispatchEventToListeners(WebInspector.SourcesView.Events.EditorSelected,uiSourceCode);},sourceRenamed:function(uiSourceCode)
{this._recreateSourceFrameIfNeeded(uiSourceCode);},searchCanceled:function()
{if(this._searchView)
this._searchView.searchCanceled();delete this._searchView;delete this._searchQuery;},performSearch:function(query,shouldJump,jumpBackwards)
{this._searchableView.updateSearchMatchesCount(0);var sourceFrame=this.currentSourceFrame();if(!sourceFrame)
return;this._searchView=sourceFrame;this._searchQuery=query;function finishedCallback(view,searchMatches)
{if(!searchMatches)
return;this._searchableView.updateSearchMatchesCount(searchMatches);}
function currentMatchChanged(currentMatchIndex)
{this._searchableView.updateCurrentMatchIndex(currentMatchIndex);}
function searchResultsChanged()
{this.performSearch(query,false,false);}
this._searchView.performSearch(query,shouldJump,!!jumpBackwards,finishedCallback.bind(this),currentMatchChanged.bind(this),searchResultsChanged.bind(this));},jumpToNextSearchResult:function()
{if(!this._searchView)
return;if(this._searchView!==this.currentSourceFrame()){this.performSearch(this._searchQuery,true);return;}
this._searchView.jumpToNextSearchResult();},jumpToPreviousSearchResult:function()
{if(!this._searchView)
return;if(this._searchView!==this.currentSourceFrame()){this.performSearch(this._searchQuery,true);if(this._searchView)
this._searchView.jumpToLastSearchResult();return;}
this._searchView.jumpToPreviousSearchResult();},replaceSelectionWith:function(text)
{var sourceFrame=this.currentSourceFrame();if(!sourceFrame){console.assert(sourceFrame);return;}
sourceFrame.replaceSelectionWith(text);},replaceAllWith:function(query,text)
{var sourceFrame=this.currentSourceFrame();if(!sourceFrame){console.assert(sourceFrame);return;}
sourceFrame.replaceAllWith(query,text);},_showOutlineDialog:function(event)
{var uiSourceCode=this._editorContainer.currentFile();if(!uiSourceCode)
return false;switch(uiSourceCode.contentType()){case WebInspector.resourceTypes.Document:case WebInspector.resourceTypes.Script:WebInspector.JavaScriptOutlineDialog.show(this,uiSourceCode,this.showSourceLocation.bind(this,uiSourceCode));return true;case WebInspector.resourceTypes.Stylesheet:WebInspector.StyleSheetOutlineDialog.show(this,uiSourceCode,this.showSourceLocation.bind(this,uiSourceCode));return true;default:return true;}},showOpenResourceDialog:function(query)
{var uiSourceCodes=this._editorContainer.historyUISourceCodes();var defaultScores=new Map();for(var i=1;i<uiSourceCodes.length;++i)
defaultScores.set(uiSourceCodes[i],uiSourceCodes.length-i);WebInspector.OpenResourceDialog.show(this,this.element,query,defaultScores);},_showGoToLineDialog:function(event)
{if(this._currentUISourceCode)
this.showOpenResourceDialog(":");return true;},_save:function()
{this._saveSourceFrame(this.currentSourceFrame());return true;},_saveAll:function()
{var sourceFrames=this._editorContainer.fileViews();sourceFrames.forEach(this._saveSourceFrame.bind(this));return true;},_saveSourceFrame:function(sourceFrame)
{if(!sourceFrame)
return;if(!(sourceFrame instanceof WebInspector.UISourceCodeFrame))
return;var uiSourceCodeFrame=(sourceFrame);uiSourceCodeFrame.commitEditing();},_toggleBreakpoint:function()
{var sourceFrame=this.currentSourceFrame();if(!sourceFrame)
return false;if(sourceFrame instanceof WebInspector.JavaScriptSourceFrame){var javaScriptSourceFrame=(sourceFrame);javaScriptSourceFrame.toggleBreakpointOnCurrentLine();return true;}
return false;},toggleBreakpointsActiveState:function(active)
{this._editorContainer.view.element.classList.toggle("breakpoints-deactivated",!active);},__proto__:WebInspector.VBox.prototype}
WebInspector.SourcesView.EditorAction=function()
{}
WebInspector.SourcesView.EditorAction.prototype={button:function(sourcesView){}}
WebInspector.SourcesView.SwitchFileActionDelegate=function()
{}
WebInspector.SourcesView.SwitchFileActionDelegate._nextFile=function(currentUISourceCode)
{function fileNamePrefix(name)
{var lastDotIndex=name.lastIndexOf(".");var namePrefix=name.substr(0,lastDotIndex!==-1?lastDotIndex:name.length);return namePrefix.toLowerCase();}
var uiSourceCodes=currentUISourceCode.project().uiSourceCodes();var candidates=[];var path=currentUISourceCode.parentPath();var name=currentUISourceCode.name();var namePrefix=fileNamePrefix(name);for(var i=0;i<uiSourceCodes.length;++i){var uiSourceCode=uiSourceCodes[i];if(path!==uiSourceCode.parentPath())
continue;if(fileNamePrefix(uiSourceCode.name())===namePrefix)
candidates.push(uiSourceCode.name());}
candidates.sort(String.naturalOrderComparator);var index=mod(candidates.indexOf(name)+1,candidates.length);var fullPath=(path?path+"/":"")+candidates[index];var nextUISourceCode=currentUISourceCode.project().uiSourceCode(fullPath);return nextUISourceCode!==currentUISourceCode?nextUISourceCode:null;},WebInspector.SourcesView.SwitchFileActionDelegate.prototype={handleAction:function()
{var sourcesView=WebInspector.context.flavor(WebInspector.SourcesView);if(!sourcesView)
return false;var currentUISourceCode=sourcesView.currentUISourceCode();if(!currentUISourceCode)
return true;var nextUISourceCode=WebInspector.SourcesView.SwitchFileActionDelegate._nextFile(currentUISourceCode);if(!nextUISourceCode)
return true;sourcesView.showSourceLocation(nextUISourceCode);return true;}};WebInspector.AdvancedSearchView=function()
{WebInspector.VBox.call(this);this._searchId=0;this.element.classList.add("search-view");this._searchPanelElement=this.element.createChild("div","search-drawer-header");this._searchPanelElement.addEventListener("keydown",this._onKeyDown.bind(this),false);this._searchResultsElement=this.element.createChild("div");this._searchResultsElement.className="search-results";this._search=this._searchPanelElement.createChild("input");this._search.placeholder=WebInspector.UIString("Search sources");this._search.setAttribute("type","text");this._search.classList.add("search-config-search");this._search.setAttribute("results","0");this._search.setAttribute("size",30);this._ignoreCaseLabel=this._searchPanelElement.createChild("label");this._ignoreCaseLabel.classList.add("search-config-label");this._ignoreCaseCheckbox=this._ignoreCaseLabel.createChild("input");this._ignoreCaseCheckbox.setAttribute("type","checkbox");this._ignoreCaseCheckbox.classList.add("search-config-checkbox");this._ignoreCaseLabel.createTextChild(WebInspector.UIString("Ignore case"));this._regexLabel=this._searchPanelElement.createChild("label");this._regexLabel.classList.add("search-config-label");this._regexCheckbox=this._regexLabel.createChild("input");this._regexCheckbox.setAttribute("type","checkbox");this._regexCheckbox.classList.add("search-config-checkbox");this._regexLabel.createTextChild(WebInspector.UIString("Regular expression"));this._searchStatusBarElement=this.element.createChild("div","search-status-bar-summary");this._searchMessageElement=this._searchStatusBarElement.createChild("div","search-message");this._searchProgressPlaceholderElement=this._searchStatusBarElement.createChild("div");this._searchStatusBarElement.createChild("div","search-message-spacer");this._searchResultsMessageElement=this._searchStatusBarElement.createChild("div","search-message");WebInspector.settings.advancedSearchConfig=WebInspector.settings.createSetting("advancedSearchConfig",new WebInspector.SearchConfig("",true,false).toPlainObject());this._load();WebInspector.AdvancedSearchView._instance=this;this._searchScope=new WebInspector.SourcesSearchScope();}
WebInspector.AdvancedSearchView.prototype={_buildSearchConfig:function()
{return new WebInspector.SearchConfig(this._search.value,this._ignoreCaseCheckbox.checked,this._regexCheckbox.checked);},_toggle:function(queryCandidate)
{if(queryCandidate)
this._search.value=queryCandidate;this.focus();this._startIndexing();},_onIndexingFinished:function(finished)
{delete this._isIndexing;this._indexingFinished(finished);if(!finished)
delete this._pendingSearchConfig;if(!this._pendingSearchConfig)
return;var searchConfig=this._pendingSearchConfig;delete this._pendingSearchConfig;this._innerStartSearch(searchConfig);},_startIndexing:function()
{this._isIndexing=true;if(this._progressIndicator)
this._progressIndicator.done();this._progressIndicator=new WebInspector.ProgressIndicator();this._indexingStarted(this._progressIndicator);this._searchScope.performIndexing(this._progressIndicator,this._onIndexingFinished.bind(this));},_onSearchResult:function(searchId,searchResult)
{if(searchId!==this._searchId)
return;this._addSearchResult(searchResult);if(!searchResult.searchMatches.length)
return;if(!this._searchResultsPane)
this._searchResultsPane=this._searchScope.createSearchResultsPane(this._searchConfig);this._resetResults();this._searchResultsElement.appendChild(this._searchResultsPane.element);this._searchResultsPane.addSearchResult(searchResult);},_onSearchFinished:function(searchId,finished)
{if(searchId!==this._searchId)
return;if(!this._searchResultsPane)
this._nothingFound();this._searchFinished(finished);delete this._searchConfig;},_startSearch:function(searchConfig)
{this._resetSearch();++this._searchId;if(!this._isIndexing)
this._startIndexing();this._pendingSearchConfig=searchConfig;},_innerStartSearch:function(searchConfig)
{this._searchConfig=searchConfig;if(this._progressIndicator)
this._progressIndicator.done();this._progressIndicator=new WebInspector.ProgressIndicator();this._searchStarted(this._progressIndicator);this._searchScope.performSearch(searchConfig,this._progressIndicator,this._onSearchResult.bind(this,this._searchId),this._onSearchFinished.bind(this,this._searchId));},_resetSearch:function()
{this._stopSearch();if(this._searchResultsPane){this._resetResults();delete this._searchResultsPane;}},_stopSearch:function()
{if(this._progressIndicator)
this._progressIndicator.cancel();if(this._searchScope)
this._searchScope.stopSearch();delete this._searchConfig;},_searchStarted:function(progressIndicator)
{this._resetResults();this._resetCounters();this._searchMessageElement.textContent=WebInspector.UIString("Searching\u2026");progressIndicator.show(this._searchProgressPlaceholderElement);this._updateSearchResultsMessage();if(!this._searchingView)
this._searchingView=new WebInspector.EmptyView(WebInspector.UIString("Searching\u2026"));this._searchingView.show(this._searchResultsElement);},_indexingStarted:function(progressIndicator)
{this._searchMessageElement.textContent=WebInspector.UIString("Indexing\u2026");progressIndicator.show(this._searchProgressPlaceholderElement);},_indexingFinished:function(finished)
{this._searchMessageElement.textContent=finished?"":WebInspector.UIString("Indexing interrupted.");},_updateSearchResultsMessage:function()
{if(this._searchMatchesCount&&this._searchResultsCount)
this._searchResultsMessageElement.textContent=WebInspector.UIString("Found %d matches in %d files.",this._searchMatchesCount,this._nonEmptySearchResultsCount);else
this._searchResultsMessageElement.textContent="";},_resetResults:function()
{if(this._searchingView)
this._searchingView.detach();if(this._notFoundView)
this._notFoundView.detach();this._searchResultsElement.removeChildren();},_resetCounters:function()
{this._searchMatchesCount=0;this._searchResultsCount=0;this._nonEmptySearchResultsCount=0;},_nothingFound:function()
{this._resetResults();if(!this._notFoundView)
this._notFoundView=new WebInspector.EmptyView(WebInspector.UIString("No matches found."));this._notFoundView.show(this._searchResultsElement);this._searchResultsMessageElement.textContent=WebInspector.UIString("No matches found.");},_addSearchResult:function(searchResult)
{this._searchMatchesCount+=searchResult.searchMatches.length;this._searchResultsCount++;if(searchResult.searchMatches.length)
this._nonEmptySearchResultsCount++;this._updateSearchResultsMessage();},_searchFinished:function(finished)
{this._searchMessageElement.textContent=finished?WebInspector.UIString("Search finished."):WebInspector.UIString("Search interrupted.");},focus:function()
{WebInspector.setCurrentFocusElement(this._search);this._search.select();},willHide:function()
{this._stopSearch();},_onKeyDown:function(event)
{switch(event.keyCode){case WebInspector.KeyboardShortcut.Keys.Enter.code:this._onAction();break;}},_save:function()
{WebInspector.settings.advancedSearchConfig.set(this._buildSearchConfig().toPlainObject());},_load:function()
{var searchConfig=WebInspector.SearchConfig.fromPlainObject(WebInspector.settings.advancedSearchConfig.get());this._search.value=searchConfig.query();this._ignoreCaseCheckbox.checked=searchConfig.ignoreCase();this._regexCheckbox.checked=searchConfig.isRegex();},_onAction:function()
{var searchConfig=this._buildSearchConfig();if(!searchConfig.query()||!searchConfig.query().length)
return;this._save();this._startSearch(searchConfig);},__proto__:WebInspector.VBox.prototype}
WebInspector.SearchResultsPane=function(searchConfig)
{this._searchConfig=searchConfig;this.element=document.createElement("div");}
WebInspector.SearchResultsPane.prototype={get searchConfig()
{return this._searchConfig;},addSearchResult:function(searchResult){}}
WebInspector.AdvancedSearchView.ToggleDrawerViewActionDelegate=function()
{}
WebInspector.AdvancedSearchView.ToggleDrawerViewActionDelegate.prototype={handleAction:function()
{var searchView=WebInspector.AdvancedSearchView._instance;if(!searchView||!searchView.isShowing()||searchView._search!==document.activeElement){var selection=window.getSelection();var queryCandidate="";if(selection.rangeCount)
queryCandidate=selection.toString().replace(/\r?\n.*/,"");WebInspector.inspectorView.showPanel("sources");WebInspector.inspectorView.showViewInDrawer("sources.search");WebInspector.AdvancedSearchView._instance._toggle(queryCandidate);}else{WebInspector.inspectorView.closeDrawer();}
return true;}}
WebInspector.FileBasedSearchResult=function(uiSourceCode,searchMatches){this.uiSourceCode=uiSourceCode;this.searchMatches=searchMatches;}
WebInspector.SearchScope=function()
{}
WebInspector.SearchScope.prototype={performSearch:function(searchConfig,progress,searchResultCallback,searchFinishedCallback){},performIndexing:function(progress,callback){},stopSearch:function(){},createSearchResultsPane:function(searchConfig){}};WebInspector.FileBasedSearchResultsPane=function(searchConfig)
{WebInspector.SearchResultsPane.call(this,searchConfig);this._searchResults=[];this.element.id="search-results-pane-file-based";this._treeOutlineElement=document.createElement("ol");this._treeOutlineElement.className="search-results-outline-disclosure";this.element.appendChild(this._treeOutlineElement);this._treeOutline=new TreeOutline(this._treeOutlineElement);this._matchesExpandedCount=0;}
WebInspector.FileBasedSearchResultsPane.matchesExpandedByDefaultCount=20;WebInspector.FileBasedSearchResultsPane.fileMatchesShownAtOnce=20;WebInspector.FileBasedSearchResultsPane.prototype={addSearchResult:function(searchResult)
{this._searchResults.push(searchResult);var uiSourceCode=searchResult.uiSourceCode;if(!uiSourceCode)
return;this._addFileTreeElement(searchResult);},_addFileTreeElement:function(searchResult)
{var fileTreeElement=new WebInspector.FileBasedSearchResultsPane.FileTreeElement(this._searchConfig,searchResult);this._treeOutline.appendChild(fileTreeElement);if(this._matchesExpandedCount<WebInspector.FileBasedSearchResultsPane.matchesExpandedByDefaultCount)
fileTreeElement.expand();this._matchesExpandedCount+=searchResult.searchMatches.length;},__proto__:WebInspector.SearchResultsPane.prototype}
WebInspector.FileBasedSearchResultsPane.FileTreeElement=function(searchConfig,searchResult)
{TreeElement.call(this,"",null,true);this._searchConfig=searchConfig;this._searchResult=searchResult;this.toggleOnClick=true;this.selectable=false;}
WebInspector.FileBasedSearchResultsPane.FileTreeElement.prototype={onexpand:function()
{if(this._initialized)
return;this._updateMatchesUI();this._initialized=true;},_updateMatchesUI:function()
{this.removeChildren();var toIndex=Math.min(this._searchResult.searchMatches.length,WebInspector.FileBasedSearchResultsPane.fileMatchesShownAtOnce);if(toIndex<this._searchResult.searchMatches.length){this._appendSearchMatches(0,toIndex-1);this._appendShowMoreMatchesElement(toIndex-1);}else{this._appendSearchMatches(0,toIndex);}},onattach:function()
{this._updateSearchMatches();},_updateSearchMatches:function()
{this.listItemElement.classList.add("search-result");var fileNameSpan=document.createElement("span");fileNameSpan.className="search-result-file-name";fileNameSpan.textContent=this._searchResult.uiSourceCode.fullDisplayName();this.listItemElement.appendChild(fileNameSpan);var matchesCountSpan=document.createElement("span");matchesCountSpan.className="search-result-matches-count";var searchMatchesCount=this._searchResult.searchMatches.length;if(searchMatchesCount===1)
matchesCountSpan.textContent=WebInspector.UIString("(%d match)",searchMatchesCount);else
matchesCountSpan.textContent=WebInspector.UIString("(%d matches)",searchMatchesCount);this.listItemElement.appendChild(matchesCountSpan);if(this.expanded)
this._updateMatchesUI();},_appendSearchMatches:function(fromIndex,toIndex)
{var searchResult=this._searchResult;var uiSourceCode=searchResult.uiSourceCode;var searchMatches=searchResult.searchMatches;var queries=this._searchConfig.queries();var regexes=[];for(var i=0;i<queries.length;++i)
regexes.push(createSearchRegex(queries[i],!this._searchConfig.ignoreCase(),this._searchConfig.isRegex()));for(var i=fromIndex;i<toIndex;++i){var lineNumber=searchMatches[i].lineNumber;var lineContent=searchMatches[i].lineContent;var matchRanges=[];for(var j=0;j<regexes.length;++j)
matchRanges=matchRanges.concat(this._regexMatchRanges(lineContent,regexes[j]));var anchor=this._createAnchor(uiSourceCode,lineNumber,matchRanges[0].offset);var numberString=numberToStringWithSpacesPadding(lineNumber+1,4);var lineNumberSpan=document.createElement("span");lineNumberSpan.classList.add("search-match-line-number");lineNumberSpan.textContent=numberString;anchor.appendChild(lineNumberSpan);var contentSpan=this._createContentSpan(lineContent,matchRanges);anchor.appendChild(contentSpan);var searchMatchElement=new TreeElement("");searchMatchElement.selectable=false;this.appendChild(searchMatchElement);searchMatchElement.listItemElement.className="search-match source-code";searchMatchElement.listItemElement.appendChild(anchor);}},_appendShowMoreMatchesElement:function(startMatchIndex)
{var matchesLeftCount=this._searchResult.searchMatches.length-startMatchIndex;var showMoreMatchesText=WebInspector.UIString("Show all matches (%d more).",matchesLeftCount);this._showMoreMatchesTreeElement=new TreeElement(showMoreMatchesText);this.appendChild(this._showMoreMatchesTreeElement);this._showMoreMatchesTreeElement.listItemElement.classList.add("show-more-matches");this._showMoreMatchesTreeElement.onselect=this._showMoreMatchesElementSelected.bind(this,startMatchIndex);},_createAnchor:function(uiSourceCode,lineNumber,columnNumber)
{return WebInspector.Linkifier.linkifyUsingRevealer(uiSourceCode.uiLocation(lineNumber,columnNumber),"",uiSourceCode.url,lineNumber);},_createContentSpan:function(lineContent,matchRanges)
{var contentSpan=document.createElement("span");contentSpan.className="search-match-content";contentSpan.textContent=lineContent;WebInspector.highlightRangesWithStyleClass(contentSpan,matchRanges,"highlighted-match");return contentSpan;},_regexMatchRanges:function(lineContent,regex)
{regex.lastIndex=0;var match;var offset=0;var matchRanges=[];while((regex.lastIndex<lineContent.length)&&(match=regex.exec(lineContent)))
matchRanges.push(new WebInspector.SourceRange(match.index,match[0].length));return matchRanges;},_showMoreMatchesElementSelected:function(startMatchIndex)
{this.removeChild(this._showMoreMatchesTreeElement);this._appendSearchMatches(startMatchIndex,this._searchResult.searchMatches.length);return false;},__proto__:TreeElement.prototype};WebInspector.SourcesSearchScope=function()
{this._searchId=0;}
WebInspector.SourcesSearchScope._filesComparator=function(uiSourceCode1,uiSourceCode2)
{if(uiSourceCode1.isDirty()&&!uiSourceCode2.isDirty())
return-1;if(!uiSourceCode1.isDirty()&&uiSourceCode2.isDirty())
return 1;if(uiSourceCode1.url&&!uiSourceCode2.url)
return-1;if(!uiSourceCode1.url&&uiSourceCode2.url)
return 1;return String.naturalOrderComparator(uiSourceCode1.fullDisplayName(),uiSourceCode2.fullDisplayName());}
WebInspector.SourcesSearchScope.prototype={performIndexing:function(progress,indexingFinishedCallback)
{this.stopSearch();var projects=this._projects();var compositeProgress=new WebInspector.CompositeProgress(progress);progress.addEventListener(WebInspector.Progress.Events.Canceled,indexingCanceled);for(var i=0;i<projects.length;++i){var project=projects[i];var projectProgress=compositeProgress.createSubProgress(project.uiSourceCodes().length);project.indexContent(projectProgress);}
compositeProgress.addEventListener(WebInspector.Progress.Events.Done,indexingFinishedCallback.bind(this,true));function indexingCanceled()
{indexingFinishedCallback(false);progress.done();}},_projects:function()
{function filterOutServiceProjects(project)
{return!project.isServiceProject()||project.type()===WebInspector.projectTypes.Formatter;}
function filterOutContentScriptsIfNeeded(project)
{return WebInspector.settings.searchInContentScripts.get()||project.type()!==WebInspector.projectTypes.ContentScripts;}
return WebInspector.workspace.projects().filter(filterOutServiceProjects).filter(filterOutContentScriptsIfNeeded);},performSearch:function(searchConfig,progress,searchResultCallback,searchFinishedCallback)
{this.stopSearch();this._searchResultCandidates=[];this._searchResultCallback=searchResultCallback;this._searchFinishedCallback=searchFinishedCallback;this._searchConfig=searchConfig;var projects=this._projects();var barrier=new CallbackBarrier();var compositeProgress=new WebInspector.CompositeProgress(progress);var searchContentProgress=compositeProgress.createSubProgress();var findMatchingFilesProgress=new WebInspector.CompositeProgress(compositeProgress.createSubProgress());for(var i=0;i<projects.length;++i){var project=projects[i];var weight=project.uiSourceCodes().length;var findMatchingFilesInProjectProgress=findMatchingFilesProgress.createSubProgress(weight);var barrierCallback=barrier.createCallback();var filesMathingFileQuery=this._projectFilesMatchingFileQuery(project,searchConfig);var callback=this._processMatchingFilesForProject.bind(this,this._searchId,project,filesMathingFileQuery,barrierCallback);project.findFilesMatchingSearchRequest(searchConfig,filesMathingFileQuery,findMatchingFilesInProjectProgress,callback);}
barrier.callWhenDone(this._processMatchingFiles.bind(this,this._searchId,searchContentProgress,this._searchFinishedCallback.bind(this,true)));},_projectFilesMatchingFileQuery:function(project,searchConfig,dirtyOnly)
{var result=[];var uiSourceCodes=project.uiSourceCodes();for(var i=0;i<uiSourceCodes.length;++i){var uiSourceCode=uiSourceCodes[i];if(dirtyOnly&&!uiSourceCode.isDirty())
continue;if(this._searchConfig.filePathMatchesFileQuery(uiSourceCode.fullDisplayName()))
result.push(uiSourceCode.path());}
result.sort(String.naturalOrderComparator);return result;},_processMatchingFilesForProject:function(searchId,project,filesMathingFileQuery,callback,files)
{if(searchId!==this._searchId){this._searchFinishedCallback(false);return;}
files.sort(String.naturalOrderComparator);files=files.intersectOrdered(filesMathingFileQuery,String.naturalOrderComparator);var dirtyFiles=this._projectFilesMatchingFileQuery(project,this._searchConfig,true);files=files.mergeOrdered(dirtyFiles,String.naturalOrderComparator);var uiSourceCodes=[];for(var i=0;i<files.length;++i){var uiSourceCode=project.uiSourceCode(files[i]);if(uiSourceCode)
uiSourceCodes.push(uiSourceCode);}
uiSourceCodes.sort(WebInspector.SourcesSearchScope._filesComparator);this._searchResultCandidates=this._searchResultCandidates.mergeOrdered(uiSourceCodes,WebInspector.SourcesSearchScope._filesComparator);callback();},_processMatchingFiles:function(searchId,progress,callback)
{if(searchId!==this._searchId){this._searchFinishedCallback(false);return;}
var files=this._searchResultCandidates;if(!files.length){progress.done();callback();return;}
progress.setTotalWork(files.length);var fileIndex=0;var maxFileContentRequests=20;var callbacksLeft=0;for(var i=0;i<maxFileContentRequests&&i<files.length;++i)
scheduleSearchInNextFileOrFinish.call(this);function searchInNextFile(uiSourceCode)
{if(uiSourceCode.isDirty())
contentLoaded.call(this,uiSourceCode,uiSourceCode.workingCopy());else
uiSourceCode.checkContentUpdated(contentUpdated.bind(this,uiSourceCode));}
function contentUpdated(uiSourceCode)
{uiSourceCode.requestContent(contentLoaded.bind(this,uiSourceCode));}
function scheduleSearchInNextFileOrFinish()
{if(fileIndex>=files.length){if(!callbacksLeft){progress.done();callback();return;}
return;}
++callbacksLeft;var uiSourceCode=files[fileIndex++];setTimeout(searchInNextFile.bind(this,uiSourceCode),0);}
function contentLoaded(uiSourceCode,content)
{function matchesComparator(a,b)
{return a.lineNumber-b.lineNumber;}
progress.worked(1);var matches=[];var queries=this._searchConfig.queries();if(content!==null){for(var i=0;i<queries.length;++i){var nextMatches=WebInspector.ContentProvider.performSearchInContent(content,queries[i],!this._searchConfig.ignoreCase(),this._searchConfig.isRegex())
matches=matches.mergeOrdered(nextMatches,matchesComparator);}}
if(matches){var searchResult=new WebInspector.FileBasedSearchResult(uiSourceCode,matches);this._searchResultCallback(searchResult);}
--callbacksLeft;scheduleSearchInNextFileOrFinish.call(this);}},stopSearch:function()
{++this._searchId;},createSearchResultsPane:function(searchConfig)
{return new WebInspector.FileBasedSearchResultsPane(searchConfig);}};WebInspector.SourcesPanel=function(workspaceForTest)
{WebInspector.Panel.call(this,"sources");this.registerRequiredCSS("sourcesPanel.css");new WebInspector.UpgradeFileSystemDropTarget(this.element);this._workspace=workspaceForTest||WebInspector.workspace;this.debugToolbar=this._createDebugToolbar();this._debugToolbarDrawer=this._createDebugToolbarDrawer();const initialDebugSidebarWidth=225;this._splitView=new WebInspector.SplitView(true,true,"sourcesPanelSplitViewState",initialDebugSidebarWidth);this._splitView.enableShowModeSaving();this._splitView.show(this.element);const initialNavigatorWidth=225;this.editorView=new WebInspector.SplitView(true,false,"sourcesPanelNavigatorSplitViewState",initialNavigatorWidth);this.editorView.enableShowModeSaving();this.editorView.element.id="scripts-editor-split-view";this.editorView.element.tabIndex=0;this.editorView.show(this._splitView.mainElement());this._navigator=new WebInspector.SourcesNavigator(this._workspace);this._navigator.view.setMinimumSize(100,25);this._navigator.view.show(this.editorView.sidebarElement());this._navigator.addEventListener(WebInspector.SourcesNavigator.Events.SourceSelected,this._sourceSelected,this);this._navigator.addEventListener(WebInspector.SourcesNavigator.Events.SourceRenamed,this._sourceRenamed,this);this._sourcesView=new WebInspector.SourcesView(this._workspace,this);this._sourcesView.addEventListener(WebInspector.SourcesView.Events.EditorSelected,this._editorSelected.bind(this));this._sourcesView.addEventListener(WebInspector.SourcesView.Events.EditorClosed,this._editorClosed.bind(this));this._sourcesView.registerShortcuts(this.registerShortcuts.bind(this));this._sourcesView.show(this.editorView.mainElement());this._debugSidebarResizeWidgetElement=document.createElementWithClass("div","resizer-widget");this._debugSidebarResizeWidgetElement.id="scripts-debug-sidebar-resizer-widget";this._splitView.addEventListener(WebInspector.SplitView.Events.ShowModeChanged,this._updateDebugSidebarResizeWidget,this);this._updateDebugSidebarResizeWidget();this._splitView.installResizer(this._debugSidebarResizeWidgetElement);if(WebInspector.experimentsSettings.isEnabled("documentation"))
self.runtime.loadModule("documentation");this.sidebarPanes={};this.sidebarPanes.threads=new WebInspector.ThreadsSidebarPane();this.sidebarPanes.watchExpressions=new WebInspector.WatchExpressionsSidebarPane();this.sidebarPanes.callstack=new WebInspector.CallStackSidebarPane();this.sidebarPanes.callstack.addEventListener(WebInspector.CallStackSidebarPane.Events.CallFrameSelected,this._callFrameSelectedInSidebar.bind(this));this.sidebarPanes.callstack.registerShortcuts(this.registerShortcuts.bind(this));this.sidebarPanes.scopechain=new WebInspector.ScopeChainSidebarPane();this.sidebarPanes.jsBreakpoints=new WebInspector.JavaScriptBreakpointsSidebarPane(WebInspector.breakpointManager,this.showUISourceCode.bind(this));this.sidebarPanes.domBreakpoints=WebInspector.domBreakpointsSidebarPane.createProxy(this);this.sidebarPanes.xhrBreakpoints=new WebInspector.XHRBreakpointsSidebarPane();this.sidebarPanes.eventListenerBreakpoints=new WebInspector.EventListenerBreakpointsSidebarPane();this._extensionSidebarPanes=[];this._installDebuggerSidebarController();WebInspector.dockController.addEventListener(WebInspector.DockController.Events.DockSideChanged,this._dockSideChanged.bind(this));WebInspector.settings.splitVerticallyWhenDockedToRight.addChangeListener(this._dockSideChanged.bind(this));this._dockSideChanged();this._updateDebuggerButtons();this._pauseOnExceptionEnabledChanged();WebInspector.settings.pauseOnExceptionEnabled.addChangeListener(this._pauseOnExceptionEnabledChanged,this);this._setTarget(WebInspector.context.flavor(WebInspector.Target));WebInspector.breakpointManager.addEventListener(WebInspector.BreakpointManager.Events.BreakpointsActiveStateChanged,this._breakpointsActiveStateChanged,this);WebInspector.context.addFlavorChangeListener(WebInspector.Target,this._onCurrentTargetChanged,this);WebInspector.targetManager.addModelListener(WebInspector.DebuggerModel,WebInspector.DebuggerModel.Events.DebuggerWasEnabled,this._debuggerWasEnabled,this);WebInspector.targetManager.addModelListener(WebInspector.DebuggerModel,WebInspector.DebuggerModel.Events.DebuggerWasDisabled,this._debuggerReset,this);WebInspector.targetManager.addModelListener(WebInspector.DebuggerModel,WebInspector.DebuggerModel.Events.DebuggerPaused,this._debuggerPaused,this);WebInspector.targetManager.addModelListener(WebInspector.DebuggerModel,WebInspector.DebuggerModel.Events.DebuggerResumed,this._debuggerResumed,this);WebInspector.targetManager.addModelListener(WebInspector.DebuggerModel,WebInspector.DebuggerModel.Events.CallFrameSelected,this._callFrameSelected,this);WebInspector.targetManager.addModelListener(WebInspector.DebuggerModel,WebInspector.DebuggerModel.Events.ConsoleCommandEvaluatedInSelectedCallFrame,this._consoleCommandEvaluatedInSelectedCallFrame,this);WebInspector.targetManager.addModelListener(WebInspector.DebuggerModel,WebInspector.DebuggerModel.Events.GlobalObjectCleared,this._debuggerReset,this);WebInspector.targetManager.observeTargets(this);}
WebInspector.SourcesPanel.minToolbarWidth=215;WebInspector.SourcesPanel.prototype={_setTarget:function(target)
{if(!target)
return;if(target.debuggerModel.isPaused()){this._showDebuggerPausedDetails((target.debuggerModel.debuggerPausedDetails()));var callFrame=target.debuggerModel.selectedCallFrame();if(callFrame)
this._selectCallFrame(callFrame);}else{this._paused=false;this._clearInterface();this._toggleDebuggerSidebarButton.setEnabled(true);}},_onCurrentTargetChanged:function(event)
{var target=(event.data);this._setTarget(target);},defaultFocusedElement:function()
{return this._sourcesView.defaultFocusedElement();},paused:function()
{return this._paused;},wasShown:function()
{WebInspector.context.setFlavor(WebInspector.SourcesPanel,this);WebInspector.Panel.prototype.wasShown.call(this);},willHide:function()
{WebInspector.Panel.prototype.willHide.call(this);WebInspector.context.setFlavor(WebInspector.SourcesPanel,null);},searchableView:function()
{return this._sourcesView.searchableView();},_consoleCommandEvaluatedInSelectedCallFrame:function(event)
{var target=(event.target.target());if(WebInspector.context.flavor(WebInspector.Target)!==target)
return;this.sidebarPanes.scopechain.update(target.debuggerModel.selectedCallFrame());},_debuggerPaused:function(event)
{var details=(event.data);if(!this._paused)
WebInspector.inspectorView.setCurrentPanel(this);if(WebInspector.context.flavor(WebInspector.Target)===details.target())
this._showDebuggerPausedDetails(details);else if(!this._paused)
WebInspector.context.setFlavor(WebInspector.Target,details.target());},_showDebuggerPausedDetails:function(details)
{this._paused=true;this._updateDebuggerButtons();this.sidebarPanes.callstack.update(details);function didCreateBreakpointHitStatusMessage(element)
{this.sidebarPanes.callstack.setStatus(element);}
function didGetUILocation(uiLocation)
{var breakpoint=WebInspector.breakpointManager.findBreakpointOnLine(uiLocation.uiSourceCode,uiLocation.lineNumber);if(!breakpoint)
return;this.sidebarPanes.jsBreakpoints.highlightBreakpoint(breakpoint);this.sidebarPanes.callstack.setStatus(WebInspector.UIString("Paused on a JavaScript breakpoint."));}
if(details.reason===WebInspector.DebuggerModel.BreakReason.DOM){WebInspector.domBreakpointsSidebarPane.highlightBreakpoint(details.auxData);WebInspector.domBreakpointsSidebarPane.createBreakpointHitStatusMessage(details,didCreateBreakpointHitStatusMessage.bind(this));}else if(details.reason===WebInspector.DebuggerModel.BreakReason.EventListener){var eventName=details.auxData["eventName"];var targetName=details.auxData["targetName"];this.sidebarPanes.eventListenerBreakpoints.highlightBreakpoint(eventName,targetName);var eventNameForUI=WebInspector.EventListenerBreakpointsSidebarPane.eventNameForUI(eventName,details.auxData);this.sidebarPanes.callstack.setStatus(WebInspector.UIString("Paused on a \"%s\" Event Listener.",eventNameForUI));}else if(details.reason===WebInspector.DebuggerModel.BreakReason.XHR){this.sidebarPanes.xhrBreakpoints.highlightBreakpoint(details.auxData["breakpointURL"]);this.sidebarPanes.callstack.setStatus(WebInspector.UIString("Paused on a XMLHttpRequest."));}else if(details.reason===WebInspector.DebuggerModel.BreakReason.Exception)
this.sidebarPanes.callstack.setStatus(WebInspector.UIString("Paused on exception: '%s'.",details.auxData["description"]));else if(details.reason===WebInspector.DebuggerModel.BreakReason.Assert)
this.sidebarPanes.callstack.setStatus(WebInspector.UIString("Paused on assertion."));else if(details.reason===WebInspector.DebuggerModel.BreakReason.CSPViolation)
this.sidebarPanes.callstack.setStatus(WebInspector.UIString("Paused on a script blocked due to Content Security Policy directive: \"%s\".",details.auxData["directiveText"]));else if(details.reason===WebInspector.DebuggerModel.BreakReason.DebugCommand)
this.sidebarPanes.callstack.setStatus(WebInspector.UIString("Paused on a debugged function"));else{if(details.callFrames.length)
WebInspector.debuggerWorkspaceBinding.createCallFrameLiveLocation(details.callFrames[0],didGetUILocation.bind(this));else
console.warn("ScriptsPanel paused, but callFrames.length is zero.");}
this._splitView.showBoth(true);this._toggleDebuggerSidebarButton.setEnabled(false);window.focus();InspectorFrontendHost.bringToFront();},_debuggerResumed:function(event)
{var target=(event.target.target());if(WebInspector.context.flavor(WebInspector.Target)!==target)
return;this._paused=false;this._clearInterface();this._toggleDebuggerSidebarButton.setEnabled(true);},_debuggerWasEnabled:function(event)
{var target=(event.target.target());if(WebInspector.context.flavor(WebInspector.Target)!==target)
return;this._updateDebuggerButtons();},_debuggerReset:function(event)
{this._debuggerResumed(event);},get visibleView()
{return this._sourcesView.visibleView();},showUISourceCode:function(uiSourceCode,lineNumber,columnNumber,forceShowInPanel)
{this._showEditor(forceShowInPanel);this._sourcesView.showSourceLocation(uiSourceCode,lineNumber,columnNumber);},_showEditor:function(forceShowInPanel)
{WebInspector.inspectorView.showPanel("sources");},showUILocation:function(uiLocation,forceShowInPanel)
{this.showUISourceCode(uiLocation.uiSourceCode,uiLocation.lineNumber,uiLocation.columnNumber,forceShowInPanel);},_revealInNavigator:function(uiSourceCode)
{this._navigator.revealUISourceCode(uiSourceCode);},setIgnoreExecutionLineEvents:function(ignoreExecutionLineEvents)
{this._ignoreExecutionLineEvents=ignoreExecutionLineEvents;},_executionLineChanged:function(uiLocation)
{this._sourcesView.clearCurrentExecutionLine();this._sourcesView.setExecutionLine(uiLocation);if(this._ignoreExecutionLineEvents)
return;this._sourcesView.showSourceLocation(uiLocation.uiSourceCode,uiLocation.lineNumber,0,undefined,true);},_callFrameSelected:function(event)
{var callFrame=(event.data);if(!callFrame||callFrame.target()!==WebInspector.context.flavor(WebInspector.Target))
return;this._selectCallFrame(callFrame);},_selectCallFrame:function(callFrame)
{this.sidebarPanes.scopechain.update(callFrame);this.sidebarPanes.watchExpressions.refreshExpressions();this.sidebarPanes.callstack.setSelectedCallFrame(callFrame);WebInspector.debuggerWorkspaceBinding.createCallFrameLiveLocation(callFrame,this._executionLineChanged.bind(this));},_sourceSelected:function(event)
{var uiSourceCode=(event.data.uiSourceCode);this._sourcesView.showSourceLocation(uiSourceCode,undefined,undefined,!event.data.focusSource)},_sourceRenamed:function(event)
{var uiSourceCode=(event.data);this._sourcesView.sourceRenamed(uiSourceCode);},_pauseOnExceptionEnabledChanged:function()
{var enabled=WebInspector.settings.pauseOnExceptionEnabled.get();this._pauseOnExceptionButton.toggled=enabled;this._pauseOnExceptionButton.title=WebInspector.UIString(enabled?"Don't pause on exceptions.":"Pause on exceptions.");this._debugToolbarDrawer.classList.toggle("expanded",enabled);},_updateDebuggerButtons:function()
{var currentTarget=WebInspector.context.flavor(WebInspector.Target);if(!currentTarget)
return;if(this._paused){this._updateButtonTitle(this._pauseButton,WebInspector.UIString("Resume script execution (%s)."))
this._pauseButton.state=true;this._pauseButton.setLongClickOptionsEnabled((function(){return[this._longResumeButton]}).bind(this));this._pauseButton.setEnabled(true);this._stepOverButton.setEnabled(true);this._stepIntoButton.setEnabled(true);this._stepOutButton.setEnabled(true);}else{this._updateButtonTitle(this._pauseButton,WebInspector.UIString("Pause script execution (%s)."))
this._pauseButton.state=false;this._pauseButton.setLongClickOptionsEnabled(null);this._pauseButton.setEnabled(!currentTarget.debuggerModel.isPausing());this._stepOverButton.setEnabled(false);this._stepIntoButton.setEnabled(false);this._stepOutButton.setEnabled(false);}},_clearInterface:function()
{this.sidebarPanes.callstack.update(null);this.sidebarPanes.scopechain.update(null);this.sidebarPanes.jsBreakpoints.clearBreakpointHighlight();WebInspector.domBreakpointsSidebarPane.clearBreakpointHighlight();this.sidebarPanes.eventListenerBreakpoints.clearBreakpointHighlight();this.sidebarPanes.xhrBreakpoints.clearBreakpointHighlight();this._sourcesView.clearCurrentExecutionLine();this._updateDebuggerButtons();},_togglePauseOnExceptions:function()
{WebInspector.settings.pauseOnExceptionEnabled.set(!this._pauseOnExceptionButton.toggled);},_runSnippet:function()
{var uiSourceCode=this._sourcesView.currentUISourceCode();if(uiSourceCode.project().type()!==WebInspector.projectTypes.Snippets)
return false;var currentExecutionContext=WebInspector.context.flavor(WebInspector.ExecutionContext);if(!currentExecutionContext)
return false;WebInspector.scriptSnippetModel.evaluateScriptSnippet(currentExecutionContext,uiSourceCode);return true;},_editorSelected:function(event)
{var uiSourceCode=(event.data);this._editorChanged(uiSourceCode);},_editorClosed:function(event)
{var wasSelected=(event.data.wasSelected);if(wasSelected)
this._editorChanged(null);},_editorChanged:function(uiSourceCode)
{var isSnippet=uiSourceCode&&uiSourceCode.project().type()===WebInspector.projectTypes.Snippets;this._runSnippetButton.element.classList.toggle("hidden",!isSnippet);},togglePause:function()
{var target=WebInspector.context.flavor(WebInspector.Target);if(!target)
return true;if(this._paused){this._paused=false;target.debuggerModel.resume();}else{target.debuggerModel.pause();}
this._clearInterface();return true;},_prepareToResume:function()
{if(!this._paused)
return null;this._paused=false;this._clearInterface();var target=WebInspector.context.flavor(WebInspector.Target);return target?target.debuggerModel:null;},_longResume:function()
{var debuggerModel=this._prepareToResume();if(!debuggerModel)
return true;debuggerModel.skipAllPausesUntilReloadOrTimeout(500);debuggerModel.resume();return true;},_stepOverClicked:function()
{var debuggerModel=this._prepareToResume();if(!debuggerModel)
return true;debuggerModel.stepOver();return true;},_stepIntoClicked:function()
{var debuggerModel=this._prepareToResume();if(!debuggerModel)
return true;debuggerModel.stepInto();return true;},_stepOutClicked:function()
{var debuggerModel=this._prepareToResume();if(!debuggerModel)
return true;debuggerModel.stepOut();return true;},_callFrameSelectedInSidebar:function(event)
{var callFrame=(event.data);callFrame.target().debuggerModel.setSelectedCallFrame(callFrame);},continueToLocation:function(rawLocation)
{if(!this._prepareToResume())
return;rawLocation.continueToLocation();},_toggleBreakpointsClicked:function(event)
{WebInspector.breakpointManager.setBreakpointsActive(!WebInspector.breakpointManager.breakpointsActive());},_breakpointsActiveStateChanged:function(event)
{var active=event.data;this._toggleBreakpointsButton.toggled=!active;this.sidebarPanes.jsBreakpoints.listElement.classList.toggle("breakpoints-list-deactivated",!active);this._sourcesView.toggleBreakpointsActiveState(active);if(active)
this._toggleBreakpointsButton.title=WebInspector.UIString("Deactivate breakpoints.");else
this._toggleBreakpointsButton.title=WebInspector.UIString("Activate breakpoints.");},_createDebugToolbar:function()
{var debugToolbar=document.createElementWithClass("div","scripts-debug-toolbar");var title,handler;var platformSpecificModifier=WebInspector.KeyboardShortcut.Modifiers.CtrlOrMeta;title=WebInspector.UIString("Run snippet (%s).");handler=this._runSnippet.bind(this);this._runSnippetButton=this._createButtonAndRegisterShortcuts("scripts-run-snippet",title,handler,WebInspector.ShortcutsScreen.SourcesPanelShortcuts.RunSnippet);debugToolbar.appendChild(this._runSnippetButton.element);this._runSnippetButton.element.classList.add("hidden");this._pauseButton=this._createButtonAndRegisterShortcutsForAction("scripts-pause","","debugger.toggle-pause");debugToolbar.appendChild(this._pauseButton.element);title=WebInspector.UIString("Resume with all pauses blocked for 500 ms");this._longResumeButton=new WebInspector.StatusBarButton(title,"scripts-long-resume");this._longResumeButton.addEventListener("click",this._longResume.bind(this),this);title=WebInspector.UIString("Step over next function call (%s).");handler=this._stepOverClicked.bind(this);this._stepOverButton=this._createButtonAndRegisterShortcuts("scripts-step-over",title,handler,WebInspector.ShortcutsScreen.SourcesPanelShortcuts.StepOver);debugToolbar.appendChild(this._stepOverButton.element);title=WebInspector.UIString("Step into next function call (%s).");handler=this._stepIntoClicked.bind(this);this._stepIntoButton=this._createButtonAndRegisterShortcuts("scripts-step-into",title,handler,WebInspector.ShortcutsScreen.SourcesPanelShortcuts.StepInto);debugToolbar.appendChild(this._stepIntoButton.element);title=WebInspector.UIString("Step out of current function (%s).");handler=this._stepOutClicked.bind(this);this._stepOutButton=this._createButtonAndRegisterShortcuts("scripts-step-out",title,handler,WebInspector.ShortcutsScreen.SourcesPanelShortcuts.StepOut);debugToolbar.appendChild(this._stepOutButton.element);this._toggleBreakpointsButton=new WebInspector.StatusBarButton(WebInspector.UIString("Deactivate breakpoints."),"scripts-toggle-breakpoints");this._toggleBreakpointsButton.toggled=false;this._toggleBreakpointsButton.addEventListener("click",this._toggleBreakpointsClicked,this);debugToolbar.appendChild(this._toggleBreakpointsButton.element);this._pauseOnExceptionButton=new WebInspector.StatusBarButton("","scripts-pause-on-exceptions-status-bar-item");this._pauseOnExceptionButton.addEventListener("click",this._togglePauseOnExceptions,this);debugToolbar.appendChild(this._pauseOnExceptionButton.element);return debugToolbar;},_createDebugToolbarDrawer:function()
{var debugToolbarDrawer=document.createElementWithClass("div","scripts-debug-toolbar-drawer");var label=WebInspector.UIString("Pause On Caught Exceptions");var setting=WebInspector.settings.pauseOnCaughtException;debugToolbarDrawer.appendChild(WebInspector.SettingsUI.createSettingCheckbox(label,setting,true));return debugToolbarDrawer;},_updateButtonTitle:function(button,buttonTitle)
{var hasShortcuts=button.shortcuts&&button.shortcuts.length;if(hasShortcuts)
button.title=String.vsprintf(buttonTitle,[button.shortcuts[0].name]);else
button.title=buttonTitle;},_createButtonAndRegisterShortcuts:function(buttonId,buttonTitle,handler,shortcuts)
{var button=new WebInspector.StatusBarButton(buttonTitle,buttonId);button.element.addEventListener("click",handler,false);button.shortcuts=shortcuts;this._updateButtonTitle(button,buttonTitle);this.registerShortcuts(shortcuts,handler);return button;},_createButtonAndRegisterShortcutsForAction:function(buttonId,buttonTitle,actionId)
{function handler()
{return WebInspector.actionRegistry.execute(actionId);}
var shortcuts=WebInspector.shortcutRegistry.shortcutDescriptorsForAction(actionId);return this._createButtonAndRegisterShortcuts(buttonId,buttonTitle,handler,shortcuts);},addToWatch:function(expression)
{this.sidebarPanes.watchExpressions.addExpression(expression);},_installDebuggerSidebarController:function()
{this._toggleNavigatorSidebarButton=this.editorView.createShowHideSidebarButton("navigator","scripts-navigator-show-hide-button");this.editorView.mainElement().appendChild(this._toggleNavigatorSidebarButton.element);this._toggleDebuggerSidebarButton=this._splitView.createShowHideSidebarButton("debugger","scripts-debugger-show-hide-button");this._splitView.mainElement().appendChild(this._toggleDebuggerSidebarButton.element);this._splitView.mainElement().appendChild(this._debugSidebarResizeWidgetElement);},_updateDebugSidebarResizeWidget:function()
{this._debugSidebarResizeWidgetElement.classList.toggle("hidden",this._splitView.showMode()!==WebInspector.SplitView.ShowMode.Both);},_showLocalHistory:function(uiSourceCode)
{WebInspector.RevisionHistoryView.showHistory(uiSourceCode);},appendApplicableItems:function(event,contextMenu,target)
{this._appendUISourceCodeItems(event,contextMenu,target);this._appendRemoteObjectItems(contextMenu,target);},_suggestReload:function()
{if(window.confirm(WebInspector.UIString("It is recommended to restart inspector after making these changes. Would you like to restart it?")))
WebInspector.reload();},_mapFileSystemToNetwork:function(uiSourceCode)
{WebInspector.SelectUISourceCodeForProjectTypesDialog.show(uiSourceCode.name(),[WebInspector.projectTypes.Network,WebInspector.projectTypes.ContentScripts],mapFileSystemToNetwork.bind(this),this.editorView.mainElement())
function mapFileSystemToNetwork(networkUISourceCode)
{this._workspace.addMapping(networkUISourceCode,uiSourceCode,WebInspector.fileSystemWorkspaceBinding);this._suggestReload();}},_removeNetworkMapping:function(uiSourceCode)
{if(confirm(WebInspector.UIString("Are you sure you want to remove network mapping?"))){this._workspace.removeMapping(uiSourceCode);this._suggestReload();}},_mapNetworkToFileSystem:function(networkUISourceCode)
{WebInspector.SelectUISourceCodeForProjectTypesDialog.show(networkUISourceCode.name(),[WebInspector.projectTypes.FileSystem],mapNetworkToFileSystem.bind(this),this.editorView.mainElement())
function mapNetworkToFileSystem(uiSourceCode)
{this._workspace.addMapping(networkUISourceCode,uiSourceCode,WebInspector.fileSystemWorkspaceBinding);this._suggestReload();}},_appendUISourceCodeMappingItems:function(contextMenu,uiSourceCode)
{if(uiSourceCode.project().type()===WebInspector.projectTypes.FileSystem){var hasMappings=!!uiSourceCode.url;if(!hasMappings)
contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Map to network resource\u2026":"Map to Network Resource\u2026"),this._mapFileSystemToNetwork.bind(this,uiSourceCode));else
contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Remove network mapping":"Remove Network Mapping"),this._removeNetworkMapping.bind(this,uiSourceCode));}
function filterProject(project)
{return project.type()===WebInspector.projectTypes.FileSystem;}
if(uiSourceCode.project().type()===WebInspector.projectTypes.Network||uiSourceCode.project().type()===WebInspector.projectTypes.ContentScripts){if(!this._workspace.projects().filter(filterProject).length)
return;if(this._workspace.uiSourceCodeForURL(uiSourceCode.url)===uiSourceCode)
contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Map to file system resource\u2026":"Map to File System Resource\u2026"),this._mapNetworkToFileSystem.bind(this,uiSourceCode));}},_appendUISourceCodeItems:function(event,contextMenu,target)
{if(!(target instanceof WebInspector.UISourceCode))
return;var uiSourceCode=(target);var project=uiSourceCode.project();if(project.type()!==WebInspector.projectTypes.FileSystem)
contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Local modifications\u2026":"Local Modifications\u2026"),this._showLocalHistory.bind(this,uiSourceCode));this._appendUISourceCodeMappingItems(contextMenu,uiSourceCode);if(uiSourceCode.contentType()===WebInspector.resourceTypes.Script&&project.type()!==WebInspector.projectTypes.Snippets)
this.sidebarPanes.callstack.appendBlackboxURLContextMenuItems(contextMenu,uiSourceCode.url,project.type()===WebInspector.projectTypes.ContentScripts);if(!event.target.isSelfOrDescendant(this.editorView.sidebarElement())){contextMenu.appendSeparator();contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Reveal in navigator":"Reveal in Navigator"),this._handleContextMenuReveal.bind(this,uiSourceCode));}},_handleContextMenuReveal:function(uiSourceCode)
{this.editorView.showBoth();this._revealInNavigator(uiSourceCode);},_appendRemoteObjectItems:function(contextMenu,target)
{if(!(target instanceof WebInspector.RemoteObject))
return;var remoteObject=(target);contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Store as global variable":"Store as Global Variable"),this._saveToTempVariable.bind(this,remoteObject));if(remoteObject.type==="function")
contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Show function definition":"Show Function Definition"),this._showFunctionDefinition.bind(this,remoteObject));},_saveToTempVariable:function(remoteObject)
{var currentExecutionContext=WebInspector.context.flavor(WebInspector.ExecutionContext);if(!currentExecutionContext)
return;currentExecutionContext.evaluate("this","",false,true,false,false,didGetGlobalObject.bind(null,currentExecutionContext.target()));function didGetGlobalObject(target,global,wasThrown)
{function remoteFunction(value)
{var prefix="temp";var index=1;while((prefix+index)in this)
++index;var name=prefix+index;this[name]=value;return name;}
if(wasThrown||!global)
failedToSave(target,global);else
global.callFunction(remoteFunction,[WebInspector.RemoteObject.toCallArgument(remoteObject)],didSave.bind(null,global));}
function didSave(global,result,wasThrown)
{var currentExecutionContext=WebInspector.context.flavor(WebInspector.ExecutionContext);global.release();if(!currentExecutionContext||wasThrown||!result||result.type!=="string")
failedToSave(global.target(),result);else
WebInspector.ConsoleModel.evaluateCommandInConsole(currentExecutionContext,result.value);}
function failedToSave(target,result)
{var message=WebInspector.UIString("Failed to save to temp variable.");if(result){message+=" "+result.description;result.release();}
WebInspector.console.error(message);}},_showFunctionDefinition:function(remoteObject)
{var debuggerModel=remoteObject.target().debuggerModel;function didGetFunctionDetails(response)
{if(!response||!response.location)
return;var location=response.location;if(!location)
return;var uiLocation=WebInspector.debuggerWorkspaceBinding.rawLocationToUILocation(location);if(uiLocation)
this.showUILocation(uiLocation,true);}
debuggerModel.functionDetails(remoteObject,didGetFunctionDetails.bind(this));},showGoToSourceDialog:function()
{this._sourcesView.showOpenResourceDialog();},_dockSideChanged:function()
{var vertically=WebInspector.dockController.isVertical()&&WebInspector.settings.splitVerticallyWhenDockedToRight.get();this._splitVertically(vertically);},_splitVertically:function(vertically)
{if(this.sidebarPaneView&&vertically===!this._splitView.isVertical())
return;if(this.sidebarPaneView)
this.sidebarPaneView.detach();this._splitView.setVertical(!vertically);if(!vertically)
this._splitView.uninstallResizer(this._sourcesView.statusBarContainerElement());else
this._splitView.installResizer(this._sourcesView.statusBarContainerElement());var vbox=new WebInspector.VBox();vbox.element.appendChild(this._debugToolbarDrawer);vbox.element.appendChild(this.debugToolbar);vbox.setMinimumAndPreferredSizes(25,25,WebInspector.SourcesPanel.minToolbarWidth,100);var sidebarPaneStack=new WebInspector.SidebarPaneStack();sidebarPaneStack.element.classList.add("flex-auto");sidebarPaneStack.show(vbox.element);if(!vertically){for(var pane in this.sidebarPanes)
sidebarPaneStack.addPane(this.sidebarPanes[pane]);this._extensionSidebarPanesContainer=sidebarPaneStack;this.sidebarPaneView=vbox;}else{var splitView=new WebInspector.SplitView(true,true,"sourcesPanelDebuggerSidebarSplitViewState",0.5);vbox.show(splitView.mainElement());sidebarPaneStack.addPane(this.sidebarPanes.threads);sidebarPaneStack.addPane(this.sidebarPanes.callstack);sidebarPaneStack.addPane(this.sidebarPanes.jsBreakpoints);sidebarPaneStack.addPane(this.sidebarPanes.domBreakpoints);sidebarPaneStack.addPane(this.sidebarPanes.xhrBreakpoints);sidebarPaneStack.addPane(this.sidebarPanes.eventListenerBreakpoints);var tabbedPane=new WebInspector.SidebarTabbedPane();tabbedPane.show(splitView.sidebarElement());tabbedPane.addPane(this.sidebarPanes.scopechain);tabbedPane.addPane(this.sidebarPanes.watchExpressions);this._extensionSidebarPanesContainer=tabbedPane;this.sidebarPaneView=splitView;}
for(var i=0;i<this._extensionSidebarPanes.length;++i)
this._extensionSidebarPanesContainer.addPane(this._extensionSidebarPanes[i]);this.sidebarPaneView.show(this._splitView.sidebarElement());this.sidebarPanes.threads.expand();this.sidebarPanes.scopechain.expand();this.sidebarPanes.jsBreakpoints.expand();this.sidebarPanes.callstack.expand();this._sidebarPaneStack=sidebarPaneStack;this._updateTargetsSidebarVisibility();if(WebInspector.settings.watchExpressions.get().length>0)
this.sidebarPanes.watchExpressions.expand();},addExtensionSidebarPane:function(id,pane)
{this._extensionSidebarPanes.push(pane);this._extensionSidebarPanesContainer.addPane(pane);this.setHideOnDetach();},sourcesView:function()
{return this._sourcesView;},targetAdded:function(target)
{this._updateTargetsSidebarVisibility();},targetRemoved:function(target)
{this._updateTargetsSidebarVisibility();},_updateTargetsSidebarVisibility:function()
{if(!this._sidebarPaneStack)
return;this._sidebarPaneStack.togglePaneHidden(this.sidebarPanes.threads,WebInspector.targetManager.targets().length<2);},__proto__:WebInspector.Panel.prototype}
WebInspector.UpgradeFileSystemDropTarget=function(element)
{element.addEventListener("dragenter",this._onDragEnter.bind(this),true);element.addEventListener("dragover",this._onDragOver.bind(this),true);this._element=element;}
WebInspector.UpgradeFileSystemDropTarget.dragAndDropFilesType="Files";WebInspector.UpgradeFileSystemDropTarget.prototype={_onDragEnter:function(event)
{if(event.dataTransfer.types.indexOf(WebInspector.UpgradeFileSystemDropTarget.dragAndDropFilesType)===-1)
return;event.consume(true);},_onDragOver:function(event)
{if(event.dataTransfer.types.indexOf(WebInspector.UpgradeFileSystemDropTarget.dragAndDropFilesType)===-1)
return;event.dataTransfer.dropEffect="copy";event.consume(true);if(this._dragMaskElement)
return;this._dragMaskElement=this._element.createChild("div","fill drag-mask");this._dragMaskElement.createChild("div","fill drag-mask-inner").textContent=WebInspector.UIString("Drop workspace folder here");this._dragMaskElement.addEventListener("drop",this._onDrop.bind(this),true);this._dragMaskElement.addEventListener("dragleave",this._onDragLeave.bind(this),true);},_onDrop:function(event)
{event.consume(true);this._removeMask();var items=(event.dataTransfer.items);if(!items.length)
return;var entry=items[0].webkitGetAsEntry();if(!entry.isDirectory)
return;InspectorFrontendHost.upgradeDraggedFileSystemPermissions(entry.filesystem);},_onDragLeave:function(event)
{event.consume(true);this._removeMask();},_removeMask:function()
{this._dragMaskElement.remove();delete this._dragMaskElement;}}
WebInspector.SourcesPanel.ContextMenuProvider=function()
{}
WebInspector.SourcesPanel.ContextMenuProvider.prototype={appendApplicableItems:function(event,contextMenu,target)
{WebInspector.inspectorView.panel("sources").appendApplicableItems(event,contextMenu,target);}}
WebInspector.SourcesPanel.UILocationRevealer=function()
{}
WebInspector.SourcesPanel.UILocationRevealer.prototype={reveal:function(uiLocation)
{if(uiLocation instanceof WebInspector.UILocation)
(WebInspector.inspectorView.panel("sources")).showUILocation(uiLocation);}}
WebInspector.SourcesPanel.UISourceCodeRevealer=function()
{}
WebInspector.SourcesPanel.UISourceCodeRevealer.prototype={reveal:function(uiSourceCode)
{if(uiSourceCode instanceof WebInspector.UISourceCode)
(WebInspector.inspectorView.panel("sources")).showUISourceCode(uiSourceCode);}}
WebInspector.SourcesPanel.ShowGoToSourceDialogActionDelegate=function(){}
WebInspector.SourcesPanel.ShowGoToSourceDialogActionDelegate.prototype={handleAction:function()
{var panel=(WebInspector.inspectorView.showPanel("sources"));if(!panel)
return false;panel.showGoToSourceDialog();return true;}}
WebInspector.SourcesPanel.DisableJavaScriptSettingDelegate=function()
{WebInspector.UISettingDelegate.call(this);}
WebInspector.SourcesPanel.DisableJavaScriptSettingDelegate.prototype={settingElement:function()
{var disableJSElement=WebInspector.SettingsUI.createSettingCheckbox(WebInspector.UIString("Disable JavaScript"),WebInspector.settings.javaScriptDisabled);this._disableJSCheckbox=disableJSElement.getElementsByTagName("input")[0];WebInspector.settings.javaScriptDisabled.addChangeListener(this._settingChanged,this);var disableJSInfoParent=this._disableJSCheckbox.parentElement.createChild("span","monospace");this._disableJSInfo=disableJSInfoParent.createChild("span","object-info-state-note hidden");this._disableJSInfo.title=WebInspector.UIString("JavaScript is blocked on the inspected page (may be disabled in browser settings).");WebInspector.targetManager.addEventListener(WebInspector.TargetManager.Events.MainFrameNavigated,this._updateScriptDisabledCheckbox,this);this._updateScriptDisabledCheckbox();return disableJSElement;},_settingChanged:function(event)
{PageAgent.setScriptExecutionDisabled(event.data,this._updateScriptDisabledCheckbox.bind(this));},_updateScriptDisabledCheckbox:function()
{PageAgent.getScriptExecutionStatus(executionStatusCallback.bind(this));function executionStatusCallback(error,status)
{if(error||!status)
return;var forbidden=(status==="forbidden");var disabled=forbidden||(status==="disabled");this._disableJSInfo.classList.toggle("hidden",!forbidden);this._disableJSCheckbox.checked=disabled;this._disableJSCheckbox.disabled=forbidden;}},__proto__:WebInspector.UISettingDelegate.prototype}
WebInspector.SourcesPanel.TogglePauseActionDelegate=function()
{}
WebInspector.SourcesPanel.TogglePauseActionDelegate.prototype={handleAction:function()
{var panel=(WebInspector.inspectorView.showPanel("sources"));if(!panel)
return false;panel.togglePause();return true;}};