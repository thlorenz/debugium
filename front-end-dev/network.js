WebInspector.HAREntry=function(request)
{this._request=request;}
WebInspector.HAREntry.prototype={build:function()
{var entry={startedDateTime:new Date(this._request.startTime*1000),time:this._request.timing?WebInspector.HAREntry._toMilliseconds(this._request.duration):0,request:this._buildRequest(),response:this._buildResponse(),cache:{},timings:this._buildTimings()};if(this._request.connectionId!=="0")
entry.connection=this._request.connectionId;var page=this._request.target().networkLog.pageLoadForRequest(this._request);if(page)
entry.pageref="page_"+page.id;return entry;},_buildRequest:function()
{var headersText=this._request.requestHeadersText();var res={method:this._request.requestMethod,url:this._buildRequestURL(this._request.url),httpVersion:this._request.requestHttpVersion(),headers:this._request.requestHeaders(),queryString:this._buildParameters(this._request.queryParameters||[]),cookies:this._buildCookies(this._request.requestCookies||[]),headersSize:headersText?headersText.length:-1,bodySize:this.requestBodySize};if(this._request.requestFormData)
res.postData=this._buildPostData();return res;},_buildResponse:function()
{var headersText=this._request.responseHeadersText;return{status:this._request.statusCode,statusText:this._request.statusText,httpVersion:this._request.responseHttpVersion(),headers:this._request.responseHeaders,cookies:this._buildCookies(this._request.responseCookies||[]),content:this._buildContent(),redirectURL:this._request.responseHeaderValue("Location")||"",headersSize:headersText?headersText.length:-1,bodySize:this.responseBodySize,_error:this._request.localizedFailDescription};},_buildContent:function()
{var content={size:this._request.resourceSize,mimeType:this._request.mimeType||"x-unknown",};var compression=this.responseCompression;if(typeof compression==="number")
content.compression=compression;return content;},_buildTimings:function()
{var timing=this._request.timing;if(!timing)
return{blocked:-1,dns:-1,connect:-1,send:0,wait:0,receive:0,ssl:-1};function firstNonNegative(values)
{for(var i=0;i<values.length;++i){if(values[i]>=0)
return values[i];}
console.assert(false,"Incomplete requet timing information.");}
var blocked=firstNonNegative([timing.dnsStart,timing.connectStart,timing.sendStart]);var dns=-1;if(timing.dnsStart>=0)
dns=firstNonNegative([timing.connectStart,timing.sendStart])-timing.dnsStart;var connect=-1;if(timing.connectStart>=0)
connect=timing.sendStart-timing.connectStart;var send=timing.sendEnd-timing.sendStart;var wait=timing.receiveHeadersEnd-timing.sendEnd;var receive=WebInspector.HAREntry._toMilliseconds(this._request.duration)-timing.receiveHeadersEnd;var ssl=-1;if(timing.sslStart>=0&&timing.sslEnd>=0)
ssl=timing.sslEnd-timing.sslStart;return{blocked:blocked,dns:dns,connect:connect,send:send,wait:wait,receive:receive,ssl:ssl};},_buildPostData:function()
{var res={mimeType:this._request.requestContentType(),text:this._request.requestFormData};if(this._request.formParameters)
res.params=this._buildParameters(this._request.formParameters);return res;},_buildParameters:function(parameters)
{return parameters.slice();},_buildRequestURL:function(url)
{return url.split("#",2)[0];},_buildCookies:function(cookies)
{return cookies.map(this._buildCookie.bind(this));},_buildCookie:function(cookie)
{return{name:cookie.name(),value:cookie.value(),path:cookie.path(),domain:cookie.domain(),expires:cookie.expiresDate(new Date(this._request.startTime*1000)),httpOnly:cookie.httpOnly(),secure:cookie.secure()};},get requestBodySize()
{return!this._request.requestFormData?0:this._request.requestFormData.length;},get responseBodySize()
{if(this._request.cached||this._request.statusCode===304)
return 0;if(!this._request.responseHeadersText)
return-1;return this._request.transferSize-this._request.responseHeadersText.length;},get responseCompression()
{if(this._request.cached||this._request.statusCode===304||this._request.statusCode===206)
return;if(!this._request.responseHeadersText)
return;return this._request.resourceSize-this.responseBodySize;}}
WebInspector.HAREntry._toMilliseconds=function(time)
{return time===-1?-1:time*1000;}
WebInspector.HARLog=function(requests)
{this._requests=requests;}
WebInspector.HARLog.prototype={build:function()
{return{version:"1.2",creator:this._creator(),pages:this._buildPages(),entries:this._requests.map(this._convertResource.bind(this))}},_creator:function()
{var webKitVersion=/AppleWebKit\/([^ ]+)/.exec(window.navigator.userAgent);return{name:"WebInspector",version:webKitVersion?webKitVersion[1]:"n/a"};},_buildPages:function()
{var seenIdentifiers={};var pages=[];for(var i=0;i<this._requests.length;++i){var page=this._requests[i].target().networkLog.pageLoadForRequest(this._requests[i]);if(!page||seenIdentifiers[page.id])
continue;seenIdentifiers[page.id]=true;pages.push(this._convertPage(page));}
return pages;},_convertPage:function(page)
{return{startedDateTime:new Date(page.startTime*1000),id:"page_"+page.id,title:page.url,pageTimings:{onContentLoad:this._pageEventTime(page,page.contentLoadTime),onLoad:this._pageEventTime(page,page.loadTime)}}},_convertResource:function(request)
{return(new WebInspector.HAREntry(request)).build();},_pageEventTime:function(page,time)
{var startTime=page.startTime;if(time===-1||startTime===-1)
return-1;return WebInspector.HAREntry._toMilliseconds(time-startTime);}}
WebInspector.HARWriter=function()
{}
WebInspector.HARWriter.prototype={write:function(stream,requests,progress)
{this._stream=stream;this._harLog=(new WebInspector.HARLog(requests)).build();this._pendingRequests=1;var entries=this._harLog.entries;for(var i=0;i<entries.length;++i){var content=requests[i].content;if(typeof content==="undefined"&&requests[i].finished){++this._pendingRequests;requests[i].requestContent(this._onContentAvailable.bind(this,entries[i]));}else if(content!==null)
entries[i].response.content.text=content;}
var compositeProgress=new WebInspector.CompositeProgress(progress);this._writeProgress=compositeProgress.createSubProgress();if(--this._pendingRequests){this._requestsProgress=compositeProgress.createSubProgress();this._requestsProgress.setTitle(WebInspector.UIString("Collecting content…"));this._requestsProgress.setTotalWork(this._pendingRequests);}else
this._beginWrite();},_onContentAvailable:function(entry,content)
{if(content!==null)
entry.response.content.text=content;if(this._requestsProgress)
this._requestsProgress.worked();if(!--this._pendingRequests){this._requestsProgress.done();this._beginWrite();}},_beginWrite:function()
{const jsonIndent=2;this._text=JSON.stringify({log:this._harLog},null,jsonIndent);this._writeProgress.setTitle(WebInspector.UIString("Writing file…"));this._writeProgress.setTotalWork(this._text.length);this._bytesWritten=0;this._writeNextChunk(this._stream);},_writeNextChunk:function(stream,error)
{if(this._bytesWritten>=this._text.length||error){stream.close();this._writeProgress.done();return;}
const chunkSize=100000;var text=this._text.substring(this._bytesWritten,this._bytesWritten+chunkSize);this._bytesWritten+=text.length;stream.write(text,this._writeNextChunk.bind(this));this._writeProgress.setWorked(this._bytesWritten);}};WebInspector.RequestView=function(request)
{WebInspector.VBox.call(this);this.registerRequiredCSS("resourceView.css");this.element.classList.add("resource-view");this.request=request;}
WebInspector.RequestView.prototype={hasContent:function()
{return false;},__proto__:WebInspector.VBox.prototype}
WebInspector.RequestView.hasTextContent=function(request)
{if(request.type.isTextType())
return true;if(request.type===WebInspector.resourceTypes.Other||request.hasErrorStatusCode())
return!!request.content&&!request.contentEncoded;return false;}
WebInspector.RequestView.nonSourceViewForRequest=function(request)
{switch(request.type){case WebInspector.resourceTypes.Image:return new WebInspector.ImageView(request);case WebInspector.resourceTypes.Font:return new WebInspector.FontView(request);default:return new WebInspector.RequestView(request);}};WebInspector.NetworkItemView=function(request)
{WebInspector.TabbedPane.call(this);this.element.classList.add("network-item-view");var headersView=new WebInspector.RequestHeadersView(request);this.appendTab("headers",WebInspector.UIString("Headers"),headersView);this.addEventListener(WebInspector.TabbedPane.EventTypes.TabSelected,this._tabSelected,this);if(request.type===WebInspector.resourceTypes.WebSocket){var frameView=new WebInspector.ResourceWebSocketFrameView(request);this.appendTab("webSocketFrames",WebInspector.UIString("Frames"),frameView);}else{var responseView=new WebInspector.RequestResponseView(request);var previewView=new WebInspector.RequestPreviewView(request,responseView);this.appendTab("preview",WebInspector.UIString("Preview"),previewView);this.appendTab("response",WebInspector.UIString("Response"),responseView);}
if(request.requestCookies||request.responseCookies){this._cookiesView=new WebInspector.RequestCookiesView(request);this.appendTab("cookies",WebInspector.UIString("Cookies"),this._cookiesView);}
if(request.timing){var timingView=new WebInspector.RequestTimingView(request);this.appendTab("timing",WebInspector.UIString("Timing"),timingView);}
this._request=request;}
WebInspector.NetworkItemView.prototype={wasShown:function()
{WebInspector.TabbedPane.prototype.wasShown.call(this);this._selectTab();},currentSourceFrame:function()
{var view=this.visibleView;if(view&&view instanceof WebInspector.SourceFrame)
return(view);return null;},_selectTab:function(tabId)
{if(!tabId)
tabId=WebInspector.settings.resourceViewTab.get();if(!this.selectTab(tabId))
this.selectTab("headers");},_tabSelected:function(event)
{if(!event.data.isUserGesture)
return;WebInspector.settings.resourceViewTab.set(event.data.tabId);WebInspector.notifications.dispatchEventToListeners(WebInspector.UserMetrics.UserAction,{action:WebInspector.UserMetrics.UserActionNames.NetworkRequestTabSelected,tab:event.data.tabId,url:this._request.url});},request:function()
{return this._request;},__proto__:WebInspector.TabbedPane.prototype}
WebInspector.RequestContentView=function(request)
{WebInspector.RequestView.call(this,request);}
WebInspector.RequestContentView.prototype={hasContent:function()
{return true;},get innerView()
{return this._innerView;},set innerView(innerView)
{this._innerView=innerView;},wasShown:function()
{this._ensureInnerViewShown();},_ensureInnerViewShown:function()
{if(this._innerViewShowRequested)
return;this._innerViewShowRequested=true;function callback(content)
{this._innerViewShowRequested=false;this.contentLoaded();}
this.request.requestContent(callback.bind(this));},contentLoaded:function()
{},__proto__:WebInspector.RequestView.prototype};WebInspector.RequestCookiesView=function(request)
{WebInspector.VBox.call(this);this.registerRequiredCSS("requestCookiesView.css");this.element.classList.add("request-cookies-view");this._request=request;}
WebInspector.RequestCookiesView.prototype={wasShown:function()
{this._request.addEventListener(WebInspector.NetworkRequest.Events.RequestHeadersChanged,this._refreshCookies,this);this._request.addEventListener(WebInspector.NetworkRequest.Events.ResponseHeadersChanged,this._refreshCookies,this);if(!this._gotCookies){if(!this._emptyView){this._emptyView=new WebInspector.EmptyView(WebInspector.UIString("This request has no cookies."));this._emptyView.show(this.element);}
return;}
if(!this._cookiesTable)
this._buildCookiesTable();},willHide:function()
{this._request.removeEventListener(WebInspector.NetworkRequest.Events.RequestHeadersChanged,this._refreshCookies,this);this._request.removeEventListener(WebInspector.NetworkRequest.Events.ResponseHeadersChanged,this._refreshCookies,this);},get _gotCookies()
{return(this._request.requestCookies&&this._request.requestCookies.length)||(this._request.responseCookies&&this._request.responseCookies.length);},_buildCookiesTable:function()
{this.detachChildViews();this._cookiesTable=new WebInspector.CookiesTable(true);this._cookiesTable.setCookieFolders([{folderName:WebInspector.UIString("Request Cookies"),cookies:this._request.requestCookies},{folderName:WebInspector.UIString("Response Cookies"),cookies:this._request.responseCookies}]);this._cookiesTable.show(this.element);},_refreshCookies:function()
{delete this._cookiesTable;if(!this._gotCookies||!this.isShowing())
return;this._buildCookiesTable();},__proto__:WebInspector.VBox.prototype};WebInspector.RequestHeadersView=function(request)
{WebInspector.VBox.call(this);this.registerRequiredCSS("resourceView.css");this.registerRequiredCSS("requestHeadersView.css");this.element.classList.add("request-headers-view");this._request=request;this._headersListElement=document.createElement("ol");this._headersListElement.className="outline-disclosure";this.element.appendChild(this._headersListElement);this._headersTreeOutline=new TreeOutline(this._headersListElement);this._headersTreeOutline.expandTreeElementsWhenArrowing=true;this._remoteAddressTreeElement=new TreeElement("",null,false);this._remoteAddressTreeElement.selectable=false;this._remoteAddressTreeElement.hidden=true;this._headersTreeOutline.appendChild(this._remoteAddressTreeElement);this._urlTreeElement=new TreeElement("",null,false);this._urlTreeElement.selectable=false;this._headersTreeOutline.appendChild(this._urlTreeElement);this._requestMethodTreeElement=new TreeElement("",null,false);this._requestMethodTreeElement.selectable=false;this._headersTreeOutline.appendChild(this._requestMethodTreeElement);this._statusCodeTreeElement=new TreeElement("",null,false);this._statusCodeTreeElement.selectable=false;this._headersTreeOutline.appendChild(this._statusCodeTreeElement);this._requestHeadersTreeElement=new TreeElement("",null,true);this._requestHeadersTreeElement.expanded=true;this._requestHeadersTreeElement.selectable=false;this._headersTreeOutline.appendChild(this._requestHeadersTreeElement);this._decodeRequestParameters=true;this._showRequestHeadersText=false;this._showResponseHeadersText=false;this._queryStringTreeElement=new TreeElement("",null,true);this._queryStringTreeElement.expanded=true;this._queryStringTreeElement.selectable=false;this._queryStringTreeElement.hidden=true;this._headersTreeOutline.appendChild(this._queryStringTreeElement);this._formDataTreeElement=new TreeElement("",null,true);this._formDataTreeElement.expanded=true;this._formDataTreeElement.selectable=false;this._formDataTreeElement.hidden=true;this._headersTreeOutline.appendChild(this._formDataTreeElement);this._requestPayloadTreeElement=new TreeElement(WebInspector.UIString("Request Payload"),null,true);this._requestPayloadTreeElement.expanded=true;this._requestPayloadTreeElement.selectable=false;this._requestPayloadTreeElement.hidden=true;this._headersTreeOutline.appendChild(this._requestPayloadTreeElement);this._responseHeadersTreeElement=new TreeElement("",null,true);this._responseHeadersTreeElement.expanded=true;this._responseHeadersTreeElement.selectable=false;this._headersTreeOutline.appendChild(this._responseHeadersTreeElement);}
WebInspector.RequestHeadersView.prototype={wasShown:function()
{this._request.addEventListener(WebInspector.NetworkRequest.Events.RemoteAddressChanged,this._refreshRemoteAddress,this);this._request.addEventListener(WebInspector.NetworkRequest.Events.RequestHeadersChanged,this._refreshRequestHeaders,this);this._request.addEventListener(WebInspector.NetworkRequest.Events.ResponseHeadersChanged,this._refreshResponseHeaders,this);this._request.addEventListener(WebInspector.NetworkRequest.Events.FinishedLoading,this._refreshHTTPInformation,this);this._refreshURL();this._refreshQueryString();this._refreshRequestHeaders();this._refreshResponseHeaders();this._refreshHTTPInformation();this._refreshRemoteAddress();},willHide:function()
{this._request.removeEventListener(WebInspector.NetworkRequest.Events.RemoteAddressChanged,this._refreshRemoteAddress,this);this._request.removeEventListener(WebInspector.NetworkRequest.Events.RequestHeadersChanged,this._refreshRequestHeaders,this);this._request.removeEventListener(WebInspector.NetworkRequest.Events.ResponseHeadersChanged,this._refreshResponseHeaders,this);this._request.removeEventListener(WebInspector.NetworkRequest.Events.FinishedLoading,this._refreshHTTPInformation,this);},_formatHeader:function(name,value)
{var fragment=document.createDocumentFragment();fragment.createChild("div","header-name").textContent=name+":";fragment.createChild("div","header-value source-code").textContent=value;return fragment;},_formatParameter:function(value,className,decodeParameters)
{var errorDecoding=false;if(decodeParameters){value=value.replace(/\+/g," ");if(value.indexOf("%")>=0){try{value=decodeURIComponent(value);}catch(e){errorDecoding=true;}}}
var div=document.createElement("div");div.className=className;if(errorDecoding)
div.createChild("span","error-message").textContent=WebInspector.UIString("(unable to decode value)");else
div.textContent=value;return div;},_refreshURL:function()
{this._urlTreeElement.title=this._formatHeader(WebInspector.UIString("Request URL"),this._request.url);},_refreshQueryString:function()
{var queryString=this._request.queryString();var queryParameters=this._request.queryParameters;this._queryStringTreeElement.hidden=!queryParameters;if(queryParameters)
this._refreshParams(WebInspector.UIString("Query String Parameters"),queryParameters,queryString,this._queryStringTreeElement);},_refreshFormData:function()
{this._formDataTreeElement.hidden=true;this._requestPayloadTreeElement.hidden=true;var formData=this._request.requestFormData;if(!formData)
return;var formParameters=this._request.formParameters;if(formParameters){this._formDataTreeElement.hidden=false;this._refreshParams(WebInspector.UIString("Form Data"),formParameters,formData,this._formDataTreeElement);}else{this._requestPayloadTreeElement.hidden=false;try{var json=JSON.parse(formData);this._refreshRequestJSONPayload(json,formData);}catch(e){this._populateTreeElementWithSourceText(this._requestPayloadTreeElement,formData);}}},_populateTreeElementWithSourceText:function(treeElement,sourceText)
{var sourceTextElement=document.createElement("span");sourceTextElement.classList.add("header-value");sourceTextElement.classList.add("source-code");sourceTextElement.textContent=String(sourceText||"").trim();var sourceTreeElement=new TreeElement(sourceTextElement);sourceTreeElement.selectable=false;treeElement.removeChildren();treeElement.appendChild(sourceTreeElement);},_refreshParams:function(title,params,sourceText,paramsTreeElement)
{paramsTreeElement.removeChildren();paramsTreeElement.listItemElement.removeChildren();paramsTreeElement.listItemElement.createTextChild(title);var headerCount=document.createElement("span");headerCount.classList.add("header-count");headerCount.textContent=WebInspector.UIString(" (%d)",params.length);paramsTreeElement.listItemElement.appendChild(headerCount);function toggleViewSource(event)
{paramsTreeElement._viewSource=!paramsTreeElement._viewSource;this._refreshParams(title,params,sourceText,paramsTreeElement);}
paramsTreeElement.listItemElement.appendChild(this._createViewSourceToggle(paramsTreeElement._viewSource,toggleViewSource.bind(this)));if(paramsTreeElement._viewSource){this._populateTreeElementWithSourceText(paramsTreeElement,sourceText);return;}
var toggleTitle=this._decodeRequestParameters?WebInspector.UIString("view URL encoded"):WebInspector.UIString("view decoded");var toggleButton=this._createToggleButton(toggleTitle);toggleButton.addEventListener("click",this._toggleURLDecoding.bind(this),false);paramsTreeElement.listItemElement.appendChild(toggleButton);for(var i=0;i<params.length;++i){var paramNameValue=document.createDocumentFragment();var name=this._formatParameter(params[i].name+":","header-name",this._decodeRequestParameters);var value=this._formatParameter(params[i].value,"header-value source-code",this._decodeRequestParameters);paramNameValue.appendChild(name);paramNameValue.appendChild(value);var parmTreeElement=new TreeElement(paramNameValue,null,false);parmTreeElement.selectable=false;paramsTreeElement.appendChild(parmTreeElement);}},_refreshRequestJSONPayload:function(parsedObject,sourceText)
{var treeElement=this._requestPayloadTreeElement;treeElement.removeChildren();var listItem=this._requestPayloadTreeElement.listItemElement;listItem.removeChildren();listItem.createTextChild(this._requestPayloadTreeElement.title);function toggleViewSource(event)
{treeElement._viewSource=!treeElement._viewSource;this._refreshRequestJSONPayload(parsedObject,sourceText);}
listItem.appendChild(this._createViewSourceToggle(treeElement._viewSource,toggleViewSource.bind(this)));if(treeElement._viewSource){this._populateTreeElementWithSourceText(this._requestPayloadTreeElement,sourceText);}else{var object=WebInspector.RemoteObject.fromLocalObject(parsedObject);var section=new WebInspector.ObjectPropertiesSection(object,object.description);section.expand();section.editable=false;listItem.appendChild(section.element);}},_createViewSourceToggle:function(viewSource,handler)
{var viewSourceToggleTitle=viewSource?WebInspector.UIString("view parsed"):WebInspector.UIString("view source");var viewSourceToggleButton=this._createToggleButton(viewSourceToggleTitle);viewSourceToggleButton.addEventListener("click",handler,false);return viewSourceToggleButton;},_toggleURLDecoding:function(event)
{this._decodeRequestParameters=!this._decodeRequestParameters;this._refreshQueryString();this._refreshFormData();},_refreshRequestHeaders:function()
{var treeElement=this._requestHeadersTreeElement;var headers=this._request.requestHeaders();headers=headers.slice();headers.sort(function(a,b){return a.name.toLowerCase().compareTo(b.name.toLowerCase())});var headersText=this._request.requestHeadersText();if(this._showRequestHeadersText&&headersText)
this._refreshHeadersText(WebInspector.UIString("Request Headers"),headers.length,headersText,treeElement);else
this._refreshHeaders(WebInspector.UIString("Request Headers"),headers,treeElement,headersText===undefined);if(headersText){var toggleButton=this._createHeadersToggleButton(this._showRequestHeadersText);toggleButton.addEventListener("click",this._toggleRequestHeadersText.bind(this),false);treeElement.listItemElement.appendChild(toggleButton);}
this._refreshFormData();},_refreshResponseHeaders:function()
{var treeElement=this._responseHeadersTreeElement;var headers=this._request.sortedResponseHeaders;var headersText=this._request.responseHeadersText;if(this._showResponseHeadersText)
this._refreshHeadersText(WebInspector.UIString("Response Headers"),headers.length,headersText,treeElement);else
this._refreshHeaders(WebInspector.UIString("Response Headers"),headers,treeElement);if(headersText){var toggleButton=this._createHeadersToggleButton(this._showResponseHeadersText);toggleButton.addEventListener("click",this._toggleResponseHeadersText.bind(this),false);treeElement.listItemElement.appendChild(toggleButton);}},_refreshHTTPInformation:function()
{var requestMethodElement=this._requestMethodTreeElement;requestMethodElement.hidden=!this._request.statusCode;var statusCodeElement=this._statusCodeTreeElement;statusCodeElement.hidden=!this._request.statusCode;if(this._request.statusCode){var statusCodeFragment=document.createDocumentFragment();statusCodeFragment.createChild("div","header-name").textContent=WebInspector.UIString("Status Code")+":";var statusCodeImage=statusCodeFragment.createChild("div","resource-status-image");statusCodeImage.title=this._request.statusCode+" "+this._request.statusText;if(this._request.statusCode<300||this._request.statusCode===304)
statusCodeImage.classList.add("green-ball");else if(this._request.statusCode<400)
statusCodeImage.classList.add("orange-ball");else
statusCodeImage.classList.add("red-ball");requestMethodElement.title=this._formatHeader(WebInspector.UIString("Request Method"),this._request.requestMethod);var statusTextElement=statusCodeFragment.createChild("div","header-value source-code");var statusText=this._request.statusCode+" "+this._request.statusText;if(this._request.fetchedViaServiceWorker){statusText+=" "+WebInspector.UIString("(from ServiceWorker)");statusTextElement.classList.add("status-from-cache");}else if(this._request.cached){statusText+=" "+WebInspector.UIString("(from cache)");statusTextElement.classList.add("status-from-cache");}
statusTextElement.textContent=statusText;statusCodeElement.title=statusCodeFragment;}},_refreshHeadersTitle:function(title,headersTreeElement,headersLength)
{headersTreeElement.listItemElement.removeChildren();headersTreeElement.listItemElement.createTextChild(title);var headerCount=WebInspector.UIString(" (%d)",headersLength);headersTreeElement.listItemElement.createChild("span","header-count").textContent=headerCount;},_refreshHeaders:function(title,headers,headersTreeElement,provisionalHeaders)
{headersTreeElement.removeChildren();var length=headers.length;this._refreshHeadersTitle(title,headersTreeElement,length);if(provisionalHeaders){var cautionText=WebInspector.UIString("Provisional headers are shown");var cautionFragment=document.createDocumentFragment();cautionFragment.createChild("div","warning-icon-small");cautionFragment.createChild("div","caution").textContent=cautionText;var cautionTreeElement=new TreeElement(cautionFragment);cautionTreeElement.selectable=false;headersTreeElement.appendChild(cautionTreeElement);}
headersTreeElement.hidden=!length&&!provisionalHeaders;for(var i=0;i<length;++i){var headerTreeElement=new TreeElement(this._formatHeader(headers[i].name,headers[i].value));headerTreeElement.selectable=false;headersTreeElement.appendChild(headerTreeElement);}},_refreshHeadersText:function(title,count,headersText,headersTreeElement)
{this._populateTreeElementWithSourceText(headersTreeElement,headersText);this._refreshHeadersTitle(title,headersTreeElement,count);},_refreshRemoteAddress:function()
{var remoteAddress=this._request.remoteAddress();var treeElement=this._remoteAddressTreeElement;treeElement.hidden=!remoteAddress;if(remoteAddress)
treeElement.title=this._formatHeader(WebInspector.UIString("Remote Address"),remoteAddress);},_toggleRequestHeadersText:function(event)
{this._showRequestHeadersText=!this._showRequestHeadersText;this._refreshRequestHeaders();},_toggleResponseHeadersText:function(event)
{this._showResponseHeadersText=!this._showResponseHeadersText;this._refreshResponseHeaders();},_createToggleButton:function(title)
{var button=document.createElement("span");button.classList.add("header-toggle");button.textContent=title;return button;},_createHeadersToggleButton:function(isHeadersTextShown)
{var toggleTitle=isHeadersTextShown?WebInspector.UIString("view parsed"):WebInspector.UIString("view source");return this._createToggleButton(toggleTitle);},__proto__:WebInspector.VBox.prototype};WebInspector.RequestHTMLView=function(request,dataURL)
{WebInspector.RequestView.call(this,request);this._dataURL=dataURL;this.element.classList.add("html");}
WebInspector.RequestHTMLView.prototype={hasContent:function()
{return true;},wasShown:function()
{this._createIFrame();},willHide:function(parentElement)
{this.element.removeChildren();},_createIFrame:function()
{this.element.removeChildren();var iframe=document.createElement("iframe");iframe.setAttribute("sandbox","");iframe.setAttribute("src",this._dataURL);this.element.appendChild(iframe);},__proto__:WebInspector.RequestView.prototype};WebInspector.RequestJSONView=function(request,parsedJSON)
{WebInspector.RequestView.call(this,request);this._parsedJSON=parsedJSON;this.element.classList.add("json");}
WebInspector.RequestJSONView.parseJSON=function(text)
{var prefix="";var start=/[{[]/.exec(text);if(start&&start.index){prefix=text.substring(0,start.index);text=text.substring(start.index);}
try{return new WebInspector.ParsedJSON(JSON.parse(text),prefix,"");}catch(e){return null;}}
WebInspector.RequestJSONView.parseJSONP=function(text)
{var start=text.indexOf("(");var end=text.lastIndexOf(")");if(start==-1||end==-1||end<start)
return null;var prefix=text.substring(0,start+1);var suffix=text.substring(end);text=text.substring(start+1,end);try{return new WebInspector.ParsedJSON(JSON.parse(text),prefix,suffix);}catch(e){return null;}}
WebInspector.RequestJSONView.prototype={hasContent:function()
{return true;},wasShown:function()
{this._initialize();},_initialize:function()
{if(this._initialized)
return;this._initialized=true;var obj=WebInspector.RemoteObject.fromLocalObject(this._parsedJSON.data);var title=this._parsedJSON.prefix+obj.description+this._parsedJSON.suffix;var section=new WebInspector.ObjectPropertiesSection(obj,title);section.expand();section.editable=false;this.element.appendChild(section.element);},__proto__:WebInspector.RequestView.prototype}
WebInspector.ParsedJSON=function(data,prefix,suffix)
{this.data=data;this.prefix=prefix;this.suffix=suffix;};WebInspector.RequestPreviewView=function(request,responseView)
{WebInspector.RequestContentView.call(this,request);this._responseView=responseView;}
WebInspector.RequestPreviewView.prototype={contentLoaded:function()
{if(!this.request.content&&!this.request.contentError()){if(!this._emptyView){this._emptyView=this._createEmptyView();this._emptyView.show(this.element);this.innerView=this._emptyView;}}else{if(this._emptyView){this._emptyView.detach();delete this._emptyView;}
if(!this._previewView)
this._previewView=this._createPreviewView();this._previewView.show(this.element);this.innerView=this._previewView;}},_createEmptyView:function()
{return this._createMessageView(WebInspector.UIString("This request has no preview available."));},_createMessageView:function(message)
{return new WebInspector.EmptyView(message);},_jsonView:function()
{var parsedJSON=WebInspector.RequestJSONView.parseJSON(this.request.content||"");return parsedJSON?new WebInspector.RequestJSONView(this.request,parsedJSON):null;},_htmlErrorPreview:function()
{var whitelist=["text/html","text/plain","application/xhtml+xml"];if(whitelist.indexOf(this.request.mimeType)===-1)
return null;var dataURL=this.request.asDataURL();if(dataURL===null)
return null;return new WebInspector.RequestHTMLView(this.request,dataURL);},_createPreviewView:function()
{if(this.request.contentError())
return this._createMessageView(WebInspector.UIString("Failed to load response data"));var mimeType=this.request.mimeType||"";if(mimeType==="application/json"||mimeType.endsWith("+json")){var jsonView=this._jsonView();if(jsonView)
return jsonView;}
if(this.request.hasErrorStatusCode()){var htmlErrorPreview=this._htmlErrorPreview();if(htmlErrorPreview)
return htmlErrorPreview;}
if(this.request.type===WebInspector.resourceTypes.XHR){var jsonView=this._jsonView();if(jsonView)
return jsonView;var htmlErrorPreview=this._htmlErrorPreview();if(htmlErrorPreview)
return htmlErrorPreview;}
if(this._responseView.sourceView)
return this._responseView.sourceView;if(this.request.type===WebInspector.resourceTypes.Other)
return this._createEmptyView();return WebInspector.RequestView.nonSourceViewForRequest(this.request);},__proto__:WebInspector.RequestContentView.prototype};WebInspector.RequestResponseView=function(request)
{WebInspector.RequestContentView.call(this,request);}
WebInspector.RequestResponseView._maxFormattedResourceSize=100000;WebInspector.RequestResponseView.prototype={get sourceView()
{if(this._sourceView||!WebInspector.RequestView.hasTextContent(this.request))
return this._sourceView;if(this.request.resourceSize>=WebInspector.RequestResponseView._maxFormattedResourceSize){this._sourceView=new WebInspector.ResourceSourceFrameFallback(this.request);return this._sourceView;}
var sourceFrame=new WebInspector.ResourceSourceFrame(this.request);sourceFrame.setHighlighterType(this.request.type.canonicalMimeType()||this.request.mimeType);this._sourceView=sourceFrame;return this._sourceView;},_createMessageView:function(message)
{return new WebInspector.EmptyView(message);},contentLoaded:function()
{if((!this.request.content||!this.sourceView)&&!this.request.contentError()){if(!this._emptyView){this._emptyView=this._createMessageView(WebInspector.UIString("This request has no response data available."));this._emptyView.show(this.element);this.innerView=this._emptyView;}}else{if(this._emptyView){this._emptyView.detach();delete this._emptyView;}
if(this.request.content&&this.sourceView){this.sourceView.show(this.element);this.innerView=this.sourceView;}else{if(!this._errorView)
this._errorView=this._createMessageView(WebInspector.UIString("Failed to load response data"));this._errorView.show(this.element);this.innerView=this._errorView;}}},__proto__:WebInspector.RequestContentView.prototype};WebInspector.RequestTimingView=function(request)
{WebInspector.VBox.call(this);this.element.classList.add("resource-timing-view");this._request=request;}
WebInspector.RequestTimingView.prototype={wasShown:function()
{this._request.addEventListener(WebInspector.NetworkRequest.Events.TimingChanged,this._refresh,this);this._request.addEventListener(WebInspector.NetworkRequest.Events.FinishedLoading,this._refresh,this);if(!this._request.timing){if(!this._emptyView){this._emptyView=new WebInspector.EmptyView(WebInspector.UIString("This request has no detailed timing info."));this._emptyView.show(this.element);this.innerView=this._emptyView;}
return;}
if(this._emptyView){this._emptyView.detach();delete this._emptyView;}
this._refresh();},willHide:function()
{this._request.removeEventListener(WebInspector.NetworkRequest.Events.TimingChanged,this._refresh,this);this._request.removeEventListener(WebInspector.NetworkRequest.Events.FinishedLoading,this._refresh,this);},_refresh:function()
{if(this._tableElement)
this._tableElement.remove();this._tableElement=WebInspector.RequestTimingView.createTimingTable(this._request);this.element.appendChild(this._tableElement);},__proto__:WebInspector.VBox.prototype}
WebInspector.RequestTimingView.createTimingTable=function(request)
{var tableElement=document.createElementWithClass("table","network-timing-table");function addRow(title,className,start,end)
{var tr=tableElement.createChild("tr");tr.createChild("td").createTextChild(title);var td=tr.createChild("td");td.width=chartWidth+"px";var row=td.createChild("div","network-timing-row");var bar=row.createChild("span","network-timing-bar "+className);bar.style.left=Math.floor(scale*start)+"px";bar.style.right=Math.floor(scale*(total-end))+"px";bar.textContent="\u200B";var label=row.createChild("span","network-timing-bar-title");if(total-end<start)
label.style.right=(scale*(total-end))+"px";else
label.style.left=(scale*start)+"px";label.textContent=Number.secondsToString((end-start)/1000,true);}
function firstPositive(numbers)
{for(var i=0;i<numbers.length;++i){if(numbers[i]>0)
return numbers[i];}
return undefined;}
function createCommunicationTimingTable()
{if(blocking>0)
addRow(WebInspector.UIString("Stalled"),"blocking",0,blocking);if(timing.proxyStart!==-1)
addRow(WebInspector.UIString("Proxy negotiation"),"proxy",timing.proxyStart,timing.proxyEnd);if(timing.dnsStart!==-1)
addRow(WebInspector.UIString("DNS Lookup"),"dns",timing.dnsStart,timing.dnsEnd);if(timing.connectStart!==-1)
addRow(WebInspector.UIString("Initial connection"),"connecting",timing.connectStart,timing.connectEnd);if(timing.sslStart!==-1)
addRow(WebInspector.UIString("SSL"),"ssl",timing.sslStart,timing.sslEnd);addRow(WebInspector.UIString("Request sent"),"sending",timing.sendStart,timing.sendEnd);addRow(WebInspector.UIString("Waiting (TTFB)"),"waiting",timing.sendEnd,timing.receiveHeadersEnd);if(request.endTime!==-1)
addRow(WebInspector.UIString("Content Download"),"receiving",(request.responseReceivedTime-timing.requestTime)*1000,total);}
function createServiceWorkerTimingTable()
{addRow(WebInspector.UIString("Stalled"),"blocking",0,timing.serviceWorkerFetchStart);addRow(WebInspector.UIString("Request to ServiceWorker"),"serviceworker",timing.serviceWorkerFetchStart,timing.serviceWorkerFetchEnd);addRow(WebInspector.UIString("ServiceWorker Preparation"),"serviceworker",timing.serviceWorkerFetchStart,timing.serviceWorkerFetchReady);addRow(WebInspector.UIString("Waiting (TTFB)"),"waiting",timing.serviceWorkerFetchEnd,timing.receiveHeadersEnd);if(request.endTime!==-1)
addRow(WebInspector.UIString("Content Download"),"receiving",(request.responseReceivedTime-timing.requestTime)*1000,total);}
var timing=request.timing;var blocking=firstPositive([timing.dnsStart,timing.connectStart,timing.sendStart]);var endTime=firstPositive([request.endTime,request.responseReceivedTime,timing.requestTime]);var total=(endTime-timing.requestTime)*1000;const chartWidth=200;var scale=chartWidth/total;if(request.fetchedViaServiceWorker)
createServiceWorkerTimingTable();else
createCommunicationTimingTable();if(!request.finished){var cell=tableElement.createChild("tr").createChild("td","caution");cell.colSpan=2;cell.createTextChild(WebInspector.UIString("CAUTION: request is not finished yet!"));}
return tableElement;};WebInspector.ResourceWebSocketFrameView=function(request)
{WebInspector.VBox.call(this);this.registerRequiredCSS("webSocketFrameView.css");this.element.classList.add("websocket-frame-view");this._request=request;this.element.removeChildren();var columns=[{id:"data",title:WebInspector.UIString("Data"),sortable:false,weight:88,longText:true},{id:"length",title:WebInspector.UIString("Length"),sortable:false,align:WebInspector.DataGrid.Align.Right,weight:5},{id:"time",title:WebInspector.UIString("Time"),weight:7}]
this._dataGrid=new WebInspector.SortableDataGrid(columns,undefined,undefined,undefined,this._onContextMenu.bind(this));this._dataGrid.setCellClass("websocket-frame-view-td");var comparator=(WebInspector.ResourceWebSocketFrameNodeTimeComparator);this._dataGrid.sortNodes(comparator,true);this.refresh();this._dataGrid.setName("ResourceWebSocketFrameView");this._dataGrid.show(this.element);}
WebInspector.ResourceWebSocketFrameView.OpCodes={ContinuationFrame:0,TextFrame:1,BinaryFrame:2,ConnectionCloseFrame:8,PingFrame:9,PongFrame:10};WebInspector.ResourceWebSocketFrameView.opCodeDescriptions=(function()
{var opCodes=WebInspector.ResourceWebSocketFrameView.OpCodes;var map=[];map[opCodes.ContinuationFrame]="Continuation Frame";map[opCodes.TextFrame]="Text Frame";map[opCodes.BinaryFrame]="Binary Frame";map[opCodes.ContinuationFrame]="Connection Close Frame";map[opCodes.PingFrame]="Ping Frame";map[opCodes.PongFrame]="Pong Frame";return map;})();WebInspector.ResourceWebSocketFrameView.opCodeDescription=function(opCode,mask)
{var rawDescription=WebInspector.ResourceWebSocketFrameView.opCodeDescriptions[opCode]||"";var localizedDescription=WebInspector.UIString(rawDescription);return WebInspector.UIString("%s (Opcode %d%s)",localizedDescription,opCode,(mask?", mask":""));}
WebInspector.ResourceWebSocketFrameView.prototype={refresh:function()
{this._dataGrid.rootNode().removeChildren();var frames=this._request.frames();for(var i=frames.length-1;i>=0;--i)
this._dataGrid.insertChild(new WebInspector.ResourceWebSocketFrameNode(frames[i]));},show:function(parentElement,insertBefore)
{this.refresh();WebInspector.View.prototype.show.call(this,parentElement,insertBefore);},_onContextMenu:function(contextMenu,node)
{contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Copy message":"Copy Message"),this._copyMessage.bind(this,node.data));},_copyMessage:function(row)
{InspectorFrontendHost.copyText(row.data);},__proto__:WebInspector.VBox.prototype}
WebInspector.ResourceWebSocketFrameNode=function(frame)
{this._frame=frame;this._dataText=frame.text;this._length=frame.text.length;this._timeText=(new Date(frame.time*1000)).toLocaleTimeString();this._isTextFrame=frame.opCode===WebInspector.ResourceWebSocketFrameView.OpCodes.TextFrame;if(!this._isTextFrame)
this._dataText=WebInspector.ResourceWebSocketFrameView.opCodeDescription(frame.opCode,frame.mask);WebInspector.SortableDataGridNode.call(this,{data:this._dataText,length:this._length,time:this._timeText});}
WebInspector.ResourceWebSocketFrameNode.prototype={createCells:function()
{var element=this._element;element.classList.toggle("websocket-frame-view-row-error",this._frame.type===WebInspector.NetworkRequest.WebSocketFrameType.Error);element.classList.toggle("websocket-frame-view-row-outcoming",this._frame.type===WebInspector.NetworkRequest.WebSocketFrameType.Send);element.classList.toggle("websocket-frame-view-row-opcode",!this._isTextFrame);WebInspector.SortableDataGridNode.prototype.createCells.call(this);},__proto__:WebInspector.SortableDataGridNode.prototype}
WebInspector.ResourceWebSocketFrameNodeTimeComparator=function(a,b)
{return a._frame.time-b._frame.time;};WebInspector.NetworkLogView=function(filterBar,coulmnsVisibilitySetting)
{WebInspector.VBox.call(this);this.registerRequiredCSS("networkLogView.css");this.registerRequiredCSS("filter.css");this._filterBar=filterBar;this._coulmnsVisibilitySetting=coulmnsVisibilitySetting;this._allowRequestSelection=false;this._nodesByRequestId=new StringMap();this._staleRequestIds={};this._mainRequestLoadTime=-1;this._mainRequestDOMContentLoadedTime=-1;this._matchedRequestCount=0;this._highlightedSubstringChanges=[];this._filters=[];this._currentMatchedRequestNode=null;this._currentMatchedRequestIndex=-1;this._createStatusbarButtons();this._createStatusBarItems();this._linkifier=new WebInspector.Linkifier();this._allowPopover=true;this._rowHeight=0;this._addFilters();this._resetSuggestionBuilder();this._initializeView();this._recordButton.toggled=true;WebInspector.targetManager.observeTargets(this);WebInspector.targetManager.addModelListener(WebInspector.NetworkManager,WebInspector.NetworkManager.EventTypes.RequestStarted,this._onRequestStarted,this);WebInspector.targetManager.addModelListener(WebInspector.NetworkManager,WebInspector.NetworkManager.EventTypes.RequestUpdated,this._onRequestUpdated,this);WebInspector.targetManager.addModelListener(WebInspector.NetworkManager,WebInspector.NetworkManager.EventTypes.RequestFinished,this._onRequestUpdated,this);WebInspector.targetManager.addModelListener(WebInspector.ResourceTreeModel,WebInspector.ResourceTreeModel.EventTypes.WillReloadPage,this._willReloadPage,this);WebInspector.targetManager.addModelListener(WebInspector.ResourceTreeModel,WebInspector.ResourceTreeModel.EventTypes.MainFrameNavigated,this._mainFrameNavigated,this);WebInspector.targetManager.addModelListener(WebInspector.ResourceTreeModel,WebInspector.ResourceTreeModel.EventTypes.Load,this._loadEventFired,this);WebInspector.targetManager.addModelListener(WebInspector.ResourceTreeModel,WebInspector.ResourceTreeModel.EventTypes.DOMContentLoaded,this._domContentLoadedEventFired,this);}
WebInspector.NetworkLogView.HTTPSchemas={"http":true,"https":true,"ws":true,"wss":true};WebInspector.NetworkLogView._responseHeaderColumns=["Cache-Control","Connection","Content-Encoding","Content-Length","ETag","Keep-Alive","Last-Modified","Server","Vary"];WebInspector.NetworkLogView.defaultColumnsVisibility={method:true,status:true,scheme:false,domain:false,remoteAddress:false,type:true,initiator:true,cookies:false,setCookies:false,size:true,time:true,connectionId:false,"Cache-Control":false,"Connection":false,"Content-Encoding":false,"Content-Length":false,"ETag":false,"Keep-Alive":false,"Last-Modified":false,"Server":false,"Vary":false};WebInspector.NetworkLogView._defaultRefreshDelay=500;WebInspector.NetworkLogView.FilterType={Domain:"Domain",HasResponseHeader:"HasResponseHeader",Method:"Method",MimeType:"MimeType",Scheme:"Scheme",SetCookieDomain:"SetCookieDomain",SetCookieName:"SetCookieName",SetCookieValue:"SetCookieValue",StatusCode:"StatusCode"};WebInspector.NetworkLogView._searchKeys=Object.values(WebInspector.NetworkLogView.FilterType);WebInspector.NetworkLogView._columnTitles={"name":WebInspector.UIString("Name"),"method":WebInspector.UIString("Method"),"status":WebInspector.UIString("Status"),"scheme":WebInspector.UIString("Scheme"),"domain":WebInspector.UIString("Domain"),"remoteAddress":WebInspector.UIString("Remote Address"),"type":WebInspector.UIString("Type"),"initiator":WebInspector.UIString("Initiator"),"cookies":WebInspector.UIString("Cookies"),"setCookies":WebInspector.UIString("Set-Cookies"),"size":WebInspector.UIString("Size"),"time":WebInspector.UIString("Time"),"connectionId":WebInspector.UIString("Connection Id"),"timeline":WebInspector.UIString("Timeline"),"Cache-Control":WebInspector.UIString("Cache-Control"),"Connection":WebInspector.UIString("Connection"),"Content-Encoding":WebInspector.UIString("Content-Encoding"),"Content-Length":WebInspector.UIString("Content-Length"),"ETag":WebInspector.UIString("ETag"),"Keep-Alive":WebInspector.UIString("Keep-Alive"),"Last-Modified":WebInspector.UIString("Last-Modified"),"Server":WebInspector.UIString("Server"),"Vary":WebInspector.UIString("Vary")};WebInspector.NetworkLogView.prototype={targetAdded:function(target)
{target.networkLog.requests.forEach(this._appendRequest.bind(this));},targetRemoved:function(target)
{},allowRequestSelection:function()
{return this._allowRequestSelection;},_addFilters:function()
{this._textFilterUI=new WebInspector.TextFilterUI();this._textFilterUI.addEventListener(WebInspector.FilterUI.Events.FilterChanged,this._filterChanged,this);this._filterBar.addFilter(this._textFilterUI);var types=[];for(var typeId in WebInspector.resourceTypes){var resourceType=WebInspector.resourceTypes[typeId];types.push({name:resourceType.name(),label:resourceType.categoryTitle()});}
this._resourceTypeFilterUI=new WebInspector.NamedBitSetFilterUI(types,WebInspector.settings.networkResourceTypeFilters);this._resourceTypeFilterUI.addEventListener(WebInspector.FilterUI.Events.FilterChanged,this._filterChanged.bind(this),this);this._filterBar.addFilter(this._resourceTypeFilterUI);var dataURLSetting=WebInspector.settings.networkHideDataURL;this._dataURLFilterUI=new WebInspector.CheckboxFilterUI("hide-data-url",WebInspector.UIString("Hide data URLs"),true,dataURLSetting);this._dataURLFilterUI.addEventListener(WebInspector.FilterUI.Events.FilterChanged,this._filterChanged.bind(this),this);this._filterBar.addFilter(this._dataURLFilterUI);},_resetSuggestionBuilder:function()
{this._suggestionBuilder=new WebInspector.FilterSuggestionBuilder(WebInspector.NetworkLogView._searchKeys);this._textFilterUI.setSuggestionBuilder(this._suggestionBuilder);},_filterChanged:function(event)
{this._removeAllNodeHighlights();this._parseFilterQuery(this._textFilterUI.value());this._filterRequests();},_initializeView:function()
{this.element.id="network-container";this._createSortingFunctions();this._createCalculators();this._createTable();this._createTimelineGrid();this._summaryBarElement=this.element.createChild("div","network-summary-bar");this._updateRowsSize();this._popoverHelper=new WebInspector.PopoverHelper(this.element,this._getPopoverAnchor.bind(this),this._showPopover.bind(this),this._onHidePopover.bind(this));this._popoverHelper.setTimeout(100);this.switchViewMode(true);},statusBarItems:function()
{return[this._recordButton.element,this._clearButton.element,this._filterBar.filterButton().element,this._largerRequestsButton.element,this._preserveLogCheckbox.element,this._disableCacheCheckbox.element,this._progressBarContainer];},usesLargeRows:function()
{return!!WebInspector.settings.resourcesLargeRows.get();},setAllowPopover:function(flag)
{this._allowPopover=flag;},elementsToRestoreScrollPositionsFor:function()
{if(!this._dataGrid)
return[];return[this._dataGrid.scrollContainer];},_createTimelineGrid:function()
{this._timelineGrid=new WebInspector.TimelineGrid();this._timelineGrid.element.classList.add("network-timeline-grid");this._dataGrid.element.appendChild(this._timelineGrid.element);},_createTable:function()
{var columns=[];columns.push({id:"name",titleDOMFragment:this._makeHeaderFragment(WebInspector.UIString("Name"),WebInspector.UIString("Path")),title:WebInspector.NetworkLogView._columnTitles["name"],sortable:true,weight:20,disclosure:true});columns.push({id:"method",title:WebInspector.NetworkLogView._columnTitles["method"],sortable:true,weight:6});columns.push({id:"status",titleDOMFragment:this._makeHeaderFragment(WebInspector.UIString("Status"),WebInspector.UIString("Text")),title:WebInspector.NetworkLogView._columnTitles["status"],sortable:true,weight:6});columns.push({id:"scheme",title:WebInspector.NetworkLogView._columnTitles["scheme"],sortable:true,weight:6});columns.push({id:"domain",title:WebInspector.NetworkLogView._columnTitles["domain"],sortable:true,weight:6});columns.push({id:"remoteAddress",title:WebInspector.NetworkLogView._columnTitles["remoteAddress"],sortable:true,weight:10,align:WebInspector.DataGrid.Align.Right});columns.push({id:"type",title:WebInspector.NetworkLogView._columnTitles["type"],sortable:true,weight:6});columns.push({id:"initiator",title:WebInspector.NetworkLogView._columnTitles["initiator"],sortable:true,weight:10});columns.push({id:"cookies",title:WebInspector.NetworkLogView._columnTitles["cookies"],sortable:true,weight:6,align:WebInspector.DataGrid.Align.Right});columns.push({id:"setCookies",title:WebInspector.NetworkLogView._columnTitles["setCookies"],sortable:true,weight:6,align:WebInspector.DataGrid.Align.Right});columns.push({id:"size",titleDOMFragment:this._makeHeaderFragment(WebInspector.UIString("Size"),WebInspector.UIString("Content")),title:WebInspector.NetworkLogView._columnTitles["size"],sortable:true,weight:6,align:WebInspector.DataGrid.Align.Right});columns.push({id:"time",titleDOMFragment:this._makeHeaderFragment(WebInspector.UIString("Time"),WebInspector.UIString("Latency")),title:WebInspector.NetworkLogView._columnTitles["time"],sortable:true,weight:6,align:WebInspector.DataGrid.Align.Right});columns.push({id:"connectionId",title:WebInspector.NetworkLogView._columnTitles["connectionId"],sortable:true,weight:6});var responseHeaderColumns=WebInspector.NetworkLogView._responseHeaderColumns;for(var i=0;i<responseHeaderColumns.length;++i){var headerName=responseHeaderColumns[i];var descriptor={id:headerName,title:WebInspector.NetworkLogView._columnTitles[headerName],weight:6}
if(headerName==="Content-Length")
descriptor.align=WebInspector.DataGrid.Align.Right;columns.push(descriptor);}
columns.push({id:"timeline",titleDOMFragment:document.createDocumentFragment(),title:WebInspector.NetworkLogView._columnTitles["timeline"],sortable:false,weight:40,sort:WebInspector.DataGrid.Order.Ascending});this._dataGrid=new WebInspector.SortableDataGrid(columns);this._dataGrid.setStickToBottom(true);this._updateColumns();this._dataGrid.setName("networkLog");this._dataGrid.setResizeMethod(WebInspector.DataGrid.ResizeMethod.Last);this._dataGrid.element.classList.add("network-log-grid");this._dataGrid.element.addEventListener("contextmenu",this._contextMenu.bind(this),true);this._dataGrid.show(this.element);this._dataGrid.addEventListener(WebInspector.DataGrid.Events.SortingChanged,this._sortItems,this);this._dataGrid.addEventListener(WebInspector.DataGrid.Events.ColumnsResized,this._updateDividersIfNeeded,this);this._patchTimelineHeader();this._dataGrid.sortNodes(this._sortingFunctions.startTime,false);},_makeHeaderFragment:function(title,subtitle)
{var fragment=document.createDocumentFragment();fragment.createTextChild(title);var subtitleDiv=fragment.createChild("div","network-header-subtitle");subtitleDiv.createTextChild(subtitle);return fragment;},_patchTimelineHeader:function()
{var timelineSorting=document.createElement("select");var option=document.createElement("option");option.value="startTime";option.label=WebInspector.UIString("Timeline");timelineSorting.appendChild(option);option=document.createElement("option");option.value="startTime";option.label=WebInspector.UIString("Start Time");timelineSorting.appendChild(option);option=document.createElement("option");option.value="responseTime";option.label=WebInspector.UIString("Response Time");timelineSorting.appendChild(option);option=document.createElement("option");option.value="endTime";option.label=WebInspector.UIString("End Time");timelineSorting.appendChild(option);option=document.createElement("option");option.value="duration";option.label=WebInspector.UIString("Duration");timelineSorting.appendChild(option);option=document.createElement("option");option.value="latency";option.label=WebInspector.UIString("Latency");timelineSorting.appendChild(option);var header=this._dataGrid.headerTableHeader("timeline");header.replaceChild(timelineSorting,header.firstChild);timelineSorting.addEventListener("click",function(event){event.consume()},false);timelineSorting.addEventListener("change",this._sortByTimeline.bind(this),false);this._timelineSortSelector=timelineSorting;},_createSortingFunctions:function()
{this._sortingFunctions={};this._sortingFunctions.name=WebInspector.NetworkDataGridNode.NameComparator;this._sortingFunctions.method=WebInspector.NetworkDataGridNode.RequestPropertyComparator.bind(null,"method",false);this._sortingFunctions.status=WebInspector.NetworkDataGridNode.RequestPropertyComparator.bind(null,"statusCode",false);this._sortingFunctions.scheme=WebInspector.NetworkDataGridNode.RequestPropertyComparator.bind(null,"scheme",false);this._sortingFunctions.domain=WebInspector.NetworkDataGridNode.RequestPropertyComparator.bind(null,"domain",false);this._sortingFunctions.remoteAddress=WebInspector.NetworkDataGridNode.RemoteAddressComparator;this._sortingFunctions.type=WebInspector.NetworkDataGridNode.RequestPropertyComparator.bind(null,"mimeType",false);this._sortingFunctions.initiator=WebInspector.NetworkDataGridNode.InitiatorComparator;this._sortingFunctions.cookies=WebInspector.NetworkDataGridNode.RequestCookiesCountComparator;this._sortingFunctions.setCookies=WebInspector.NetworkDataGridNode.ResponseCookiesCountComparator;this._sortingFunctions.size=WebInspector.NetworkDataGridNode.SizeComparator;this._sortingFunctions.time=WebInspector.NetworkDataGridNode.RequestPropertyComparator.bind(null,"duration",false);this._sortingFunctions.connectionId=WebInspector.NetworkDataGridNode.RequestPropertyComparator.bind(null,"connectionId",false);this._sortingFunctions.timeline=WebInspector.NetworkDataGridNode.RequestPropertyComparator.bind(null,"startTime",false);this._sortingFunctions.startTime=WebInspector.NetworkDataGridNode.RequestPropertyComparator.bind(null,"startTime",false);this._sortingFunctions.endTime=WebInspector.NetworkDataGridNode.RequestPropertyComparator.bind(null,"endTime",false);this._sortingFunctions.responseTime=WebInspector.NetworkDataGridNode.RequestPropertyComparator.bind(null,"responseReceivedTime",false);this._sortingFunctions.duration=WebInspector.NetworkDataGridNode.RequestPropertyComparator.bind(null,"duration",true);this._sortingFunctions.latency=WebInspector.NetworkDataGridNode.RequestPropertyComparator.bind(null,"latency",true);},_createCalculators:function()
{this._timeCalculator=new WebInspector.NetworkTransferTimeCalculator();this._durationCalculator=new WebInspector.NetworkTransferDurationCalculator();this._calculators={};this._calculators.timeline=this._timeCalculator;this._calculators.startTime=this._timeCalculator;this._calculators.endTime=this._timeCalculator;this._calculators.responseTime=this._timeCalculator;this._calculators.duration=this._durationCalculator;this._calculators.latency=this._durationCalculator;this._calculator=this._timeCalculator;},_sortItems:function()
{this._removeAllNodeHighlights();var columnIdentifier=this._dataGrid.sortColumnIdentifier();if(columnIdentifier==="timeline"){this._sortByTimeline();return;}
var sortingFunction=this._sortingFunctions[columnIdentifier];if(!sortingFunction)
return;this._dataGrid.sortNodes(sortingFunction,!this._dataGrid.isSortOrderAscending());this._highlightNthMatchedRequestForSearch(this._updateMatchCountAndFindMatchIndex(this._currentMatchedRequestNode),false);this._timelineSortSelector.selectedIndex=0;WebInspector.notifications.dispatchEventToListeners(WebInspector.UserMetrics.UserAction,{action:WebInspector.UserMetrics.UserActionNames.NetworkSort,column:columnIdentifier,sortOrder:this._dataGrid.sortOrder()});},_sortByTimeline:function()
{this._removeAllNodeHighlights();var selectedIndex=this._timelineSortSelector.selectedIndex;if(!selectedIndex)
selectedIndex=1;var selectedOption=this._timelineSortSelector[selectedIndex];var value=selectedOption.value;this._setCalculator(this._calculators[value]);var sortingFunction=this._sortingFunctions[value];this._dataGrid.sortNodes(sortingFunction);this._highlightNthMatchedRequestForSearch(this._updateMatchCountAndFindMatchIndex(this._currentMatchedRequestNode),false);this._dataGrid.markColumnAsSortedBy("timeline",WebInspector.DataGrid.Order.Ascending);},_createStatusBarItems:function()
{this._progressBarContainer=document.createElement("div");this._progressBarContainer.className="status-bar-item";},_updateSummaryBar:function()
{var requestsNumber=this._nodesByRequestId.size;if(!requestsNumber){if(this._summaryBarElement._isDisplayingWarning)
return;this._summaryBarElement._isDisplayingWarning=true;this._summaryBarElement.removeChildren();this._summaryBarElement.createChild("div","warning-icon-small");var text=WebInspector.UIString("No requests captured. Reload the page to see detailed information on the network activity.");this._summaryBarElement.createTextChild(text);this._summaryBarElement.title=text;return;}
delete this._summaryBarElement._isDisplayingWarning;var transferSize=0;var selectedRequestsNumber=0;var selectedTransferSize=0;var baseTime=-1;var maxTime=-1;var nodes=this._nodesByRequestId.values();for(var i=0;i<nodes.length;++i){var request=nodes[i].request();var requestTransferSize=request.transferSize;transferSize+=requestTransferSize;if(!nodes[i]._isFilteredOut){selectedRequestsNumber++;selectedTransferSize+=requestTransferSize;}
if(request.url===request.target().resourceTreeModel.inspectedPageURL())
baseTime=request.startTime;if(request.endTime>maxTime)
maxTime=request.endTime;}
var text="";if(selectedRequestsNumber!==requestsNumber){text+=String.sprintf(WebInspector.UIString("%d / %d requests"),selectedRequestsNumber,requestsNumber);text+="  \u2758  "+String.sprintf(WebInspector.UIString("%s / %s transferred"),Number.bytesToString(selectedTransferSize),Number.bytesToString(transferSize));}else{text+=String.sprintf(WebInspector.UIString("%d requests"),requestsNumber);text+="  \u2758  "+String.sprintf(WebInspector.UIString("%s transferred"),Number.bytesToString(transferSize));}
if(baseTime!==-1&&this._mainRequestLoadTime!==-1&&this._mainRequestDOMContentLoadedTime!==-1&&this._mainRequestDOMContentLoadedTime>baseTime){text+="  \u2758  "+String.sprintf(WebInspector.UIString("%s (load: %s, DOMContentLoaded: %s)"),Number.secondsToString(maxTime-baseTime),Number.secondsToString(this._mainRequestLoadTime-baseTime),Number.secondsToString(this._mainRequestDOMContentLoadedTime-baseTime));}
this._summaryBarElement.textContent=text;this._summaryBarElement.title=text;},_scheduleRefresh:function()
{if(this._needsRefresh)
return;this._needsRefresh=true;if(this.isShowing()&&!this._refreshTimeout)
this._refreshTimeout=setTimeout(this.refresh.bind(this),WebInspector.NetworkLogView._defaultRefreshDelay);},_updateDividersIfNeeded:function()
{var timelineOffset=this._dataGrid.columnOffset("timeline");if(timelineOffset)
this._timelineGrid.element.style.left=timelineOffset+"px";var calculator=this.calculator();var proceed=true;if(!this.isShowing()){this._scheduleRefresh();proceed=false;}else{calculator.setDisplayWindow(this._timelineGrid.dividersElement.clientWidth);proceed=this._timelineGrid.updateDividers(calculator);}
if(!proceed)
return;if(calculator.startAtZero){return;}
this._timelineGrid.removeEventDividers();if(this._mainRequestLoadTime!==-1){var percent=calculator.computePercentageFromEventTime(this._mainRequestLoadTime);var loadDivider=document.createElement("div");loadDivider.className="network-event-divider network-red-divider";var loadDividerPadding=document.createElement("div");loadDividerPadding.className="network-event-divider-padding";loadDividerPadding.title=WebInspector.UIString("Load event");loadDividerPadding.appendChild(loadDivider);loadDividerPadding.style.left=percent+"%";this._timelineGrid.addEventDivider(loadDividerPadding);}
if(this._mainRequestDOMContentLoadedTime!==-1){var percent=calculator.computePercentageFromEventTime(this._mainRequestDOMContentLoadedTime);var domContentLoadedDivider=document.createElement("div");domContentLoadedDivider.className="network-event-divider network-blue-divider";var domContentLoadedDividerPadding=document.createElement("div");domContentLoadedDividerPadding.className="network-event-divider-padding";domContentLoadedDividerPadding.title=WebInspector.UIString("DOMContentLoaded event");domContentLoadedDividerPadding.appendChild(domContentLoadedDivider);domContentLoadedDividerPadding.style.left=percent+"%";this._timelineGrid.addEventDivider(domContentLoadedDividerPadding);}},_refreshIfNeeded:function()
{if(this._needsRefresh)
this.refresh();},_invalidateAllItems:function()
{var requestIds=this._nodesByRequestId.keys();for(var i=0;i<requestIds.length;++i)
this._staleRequestIds[requestIds[i]]=true;},calculator:function()
{return this._calculator;},_setCalculator:function(x)
{if(!x||this._calculator===x)
return;this._calculator=x;this._calculator.reset();if(this._calculator.startAtZero)
this._timelineGrid.hideEventDividers();else
this._timelineGrid.showEventDividers();this._invalidateAllItems();this.refresh();},_createStatusbarButtons:function()
{this._recordButton=new WebInspector.StatusBarButton(WebInspector.UIString("Record Network Log"),"record-profile-status-bar-item");this._recordButton.addEventListener("click",this._onRecordButtonClicked,this);this._clearButton=new WebInspector.StatusBarButton(WebInspector.UIString("Clear"),"clear-status-bar-item");this._clearButton.addEventListener("click",this._reset,this);this._largerRequestsButton=new WebInspector.StatusBarButton(WebInspector.UIString("Use small resource rows."),"network-larger-resources-status-bar-item");this._largerRequestsButton.toggled=WebInspector.settings.resourcesLargeRows.get();this._largerRequestsButton.addEventListener("click",this._toggleLargerRequests,this);this._preserveLogCheckbox=new WebInspector.StatusBarCheckbox(WebInspector.UIString("Preserve log"));this._preserveLogCheckbox.element.title=WebInspector.UIString("Do not clear log on page reload / navigation.");this._disableCacheCheckbox=new WebInspector.StatusBarCheckbox(WebInspector.UIString("Disable cache"));WebInspector.SettingsUI.bindCheckbox(this._disableCacheCheckbox.inputElement,WebInspector.settings.cacheDisabled);this._disableCacheCheckbox.element.title=WebInspector.UIString("Disable cache (while DevTools is open).");},_loadEventFired:function(event)
{if(!this._recordButton.toggled)
return;var data=(event.data);this._mainRequestLoadTime=data||-1;this._scheduleRefresh();},_domContentLoadedEventFired:function(event)
{if(!this._recordButton.toggled)
return;var data=(event.data);this._mainRequestDOMContentLoadedTime=data||-1;this._scheduleRefresh();},wasShown:function()
{this._refreshIfNeeded();},willHide:function()
{this._popoverHelper.hidePopover();},refresh:function()
{this._needsRefresh=false;if(this._refreshTimeout){clearTimeout(this._refreshTimeout);delete this._refreshTimeout;}
this._removeAllNodeHighlights();var boundariesChanged=false;var calculator=this.calculator();if(calculator.updateBoundariesForEventTime){boundariesChanged=calculator.updateBoundariesForEventTime(this._mainRequestLoadTime)||boundariesChanged;boundariesChanged=calculator.updateBoundariesForEventTime(this._mainRequestDOMContentLoadedTime)||boundariesChanged;}
var dataGrid=this._dataGrid;var rootNode=dataGrid.rootNode();var nodesToInsert=[];for(var requestId in this._staleRequestIds){var node=this._nodesByRequestId.get(requestId);if(!node)
continue;if(!node._isFilteredOut)
rootNode.removeChild(node);node._isFilteredOut=!this._applyFilter(node);if(!node._isFilteredOut)
nodesToInsert.push(node);}
for(var i=0;i<nodesToInsert.length;++i){var node=nodesToInsert[i];var request=node.request();node.refresh();dataGrid.insertChild(node);node._isMatchingSearchQuery=this._matchRequest(request);if(calculator.updateBoundaries(request))
boundariesChanged=true;}
this._highlightNthMatchedRequestForSearch(this._updateMatchCountAndFindMatchIndex(this._currentMatchedRequestNode),false);if(boundariesChanged){this._updateDividersIfNeeded();var nodes=this._nodesByRequestId.values();for(var i=0;i<nodes.length;++i)
nodes[i].refreshGraph();}
this._staleRequestIds={};this._updateSummaryBar();},_onRecordButtonClicked:function()
{if(!this._recordButton.toggled)
this._reset();this._recordButton.toggled=!this._recordButton.toggled;},_reset:function()
{this.dispatchEventToListeners(WebInspector.NetworkLogView.EventTypes.ViewCleared);this._clearSearchMatchedList();if(this._popoverHelper)
this._popoverHelper.hidePopover();if(this._calculator)
this._calculator.reset();var nodes=this._nodesByRequestId.values();for(var i=0;i<nodes.length;++i)
nodes[i].dispose();this._nodesByRequestId.clear();this._staleRequestIds={};this._resetSuggestionBuilder();if(this._dataGrid){this._dataGrid.rootNode().removeChildren();this._updateDividersIfNeeded();this._updateSummaryBar();}
this._mainRequestLoadTime=-1;this._mainRequestDOMContentLoadedTime=-1;},_onRequestStarted:function(event)
{if(this._recordButton.toggled){var request=(event.data);this._appendRequest(request);}},_appendRequest:function(request)
{var node=new WebInspector.NetworkDataGridNode(this,request);var originalRequestNode=this._nodesByRequestId.get(request.requestId);if(originalRequestNode)
this._nodesByRequestId.set(originalRequestNode.request().requestId,originalRequestNode);this._nodesByRequestId.set(request.requestId,node);if(request.redirects){for(var i=0;i<request.redirects.length;++i)
this._refreshRequest(request.redirects[i]);}
this._refreshRequest(request);},_onRequestUpdated:function(event)
{var request=(event.data);this._refreshRequest(request);},_refreshRequest:function(request)
{if(!this._nodesByRequestId.get(request.requestId))
return;this._suggestionBuilder.addItem(WebInspector.NetworkLogView.FilterType.Domain,request.domain);this._suggestionBuilder.addItem(WebInspector.NetworkLogView.FilterType.Method,request.requestMethod);this._suggestionBuilder.addItem(WebInspector.NetworkLogView.FilterType.MimeType,request.mimeType);this._suggestionBuilder.addItem(WebInspector.NetworkLogView.FilterType.Scheme,""+request.scheme);this._suggestionBuilder.addItem(WebInspector.NetworkLogView.FilterType.StatusCode,""+request.statusCode);var responseHeaders=request.responseHeaders;for(var i=0,l=responseHeaders.length;i<l;++i)
this._suggestionBuilder.addItem(WebInspector.NetworkLogView.FilterType.HasResponseHeader,responseHeaders[i].name);var cookies=request.responseCookies;for(var i=0,l=cookies?cookies.length:0;i<l;++i){var cookie=cookies[i];this._suggestionBuilder.addItem(WebInspector.NetworkLogView.FilterType.SetCookieDomain,cookie.domain());this._suggestionBuilder.addItem(WebInspector.NetworkLogView.FilterType.SetCookieName,cookie.name());this._suggestionBuilder.addItem(WebInspector.NetworkLogView.FilterType.SetCookieValue,cookie.value());}
this._staleRequestIds[request.requestId]=true;this._scheduleRefresh();},_willReloadPage:function(event)
{this._recordButton.toggled=true;if(!this._preserveLogCheckbox.checked())
this._reset();},_mainFrameNavigated:function(event)
{if(!this._recordButton.toggled||this._preserveLogCheckbox.checked())
return;var frame=(event.data);var loaderId=frame.loaderId;var requestsToPick=[];var requests=frame.target().networkLog.requests;for(var i=0;i<requests.length;++i){var request=requests[i];if(request.loaderId===loaderId)
requestsToPick.push(request);}
this._reset();for(var i=0;i<requestsToPick.length;++i)
this._appendRequest(requestsToPick[i]);},switchViewMode:function(detailed)
{if(this._detailedMode===detailed)
return;this._detailedMode=detailed;if(detailed){if(this._dataGrid.selectedNode)
this._dataGrid.selectedNode.selected=false;}else{this._removeAllNodeHighlights();this._popoverHelper.hidePopover();}
this.element.classList.toggle("brief-mode",!detailed);this._updateColumns();},_toggleLargerRequests:function()
{WebInspector.settings.resourcesLargeRows.set(!WebInspector.settings.resourcesLargeRows.get());this._updateRowsSize();},rowHeight:function()
{return this._rowHeight;},_updateRowsSize:function()
{var largeRows=this.usesLargeRows();this._largerRequestsButton.toggled=largeRows;this._rowHeight=largeRows?41:21;this._largerRequestsButton.title=WebInspector.UIString(largeRows?"Use small resource rows.":"Use large resource rows.");this._dataGrid.element.classList.toggle("small",!largeRows);this._timelineGrid.element.classList.toggle("small",!largeRows);this.dispatchEventToListeners(WebInspector.NetworkLogView.EventTypes.RowSizeChanged,{largeRows:largeRows});},_getPopoverAnchor:function(element,event)
{if(!this._allowPopover)
return;var anchor=element.enclosingNodeOrSelfWithClass("network-graph-bar")||element.enclosingNodeOrSelfWithClass("network-graph-label");if(anchor&&anchor.parentElement.request&&anchor.parentElement.request.timing)
return anchor;anchor=element.enclosingNodeOrSelfWithClass("network-script-initiated");if(anchor&&anchor.request){var request=(anchor.request);var initiator=anchor.request.initiator();if(initiator&&(initiator.stackTrace||initiator.asyncStackTrace))
return anchor;}},_showPopover:function(anchor,popover)
{var content;if(anchor.classList.contains("network-script-initiated"))
content=this._generateScriptInitiatedPopoverContent(anchor.request);else
content=WebInspector.RequestTimingView.createTimingTable(anchor.parentElement.request);popover.show(content,anchor);},_onHidePopover:function()
{this._linkifier.reset();},_generateScriptInitiatedPopoverContent:function(request)
{var framesTable=document.createElementWithClass("table","network-stack-trace");function appendStackTrace(stackTrace)
{for(var i=0;i<stackTrace.length;++i){var stackFrame=stackTrace[i];var row=document.createElement("tr");row.createChild("td").textContent=stackFrame.functionName||WebInspector.UIString("(anonymous function)");row.createChild("td").textContent=" @ ";row.createChild("td").appendChild(this._linkifier.linkifyConsoleCallFrame(request.target(),stackFrame));framesTable.appendChild(row);}}
var initiator=(request.initiator());if(initiator.stackTrace)
appendStackTrace.call(this,initiator.stackTrace);var asyncStackTrace=initiator.asyncStackTrace;while(asyncStackTrace){var callFrames=asyncStackTrace.callFrames;if(!callFrames||!callFrames.length)
break;var row=framesTable.createChild("tr");row.createChild("td","network-async-trace-description").textContent=WebInspector.asyncStackTraceLabel(asyncStackTrace.description);row.createChild("td");row.createChild("td");appendStackTrace.call(this,callFrames);asyncStackTrace=asyncStackTrace.asyncStackTrace;}
return framesTable;},_updateColumns:function()
{var detailedMode=!!this._detailedMode;var visibleColumns={"name":true};if(detailedMode){visibleColumns["timeline"]=true;var columnsVisibility=this._coulmnsVisibilitySetting.get();for(var columnIdentifier in columnsVisibility)
visibleColumns[columnIdentifier]=columnsVisibility[columnIdentifier];}
this._dataGrid.setColumnsVisiblity(visibleColumns);},_toggleColumnVisibility:function(columnIdentifier)
{var columnsVisibility=this._coulmnsVisibilitySetting.get();columnsVisibility[columnIdentifier]=!columnsVisibility[columnIdentifier];this._coulmnsVisibilitySetting.set(columnsVisibility);this._updateColumns();},_getConfigurableColumnIDs:function()
{if(this._configurableColumnIDs)
return this._configurableColumnIDs;var columnTitles=WebInspector.NetworkLogView._columnTitles;function compare(id1,id2)
{return columnTitles[id1].compareTo(columnTitles[id2]);}
var columnIDs=Object.keys(this._coulmnsVisibilitySetting.get());this._configurableColumnIDs=columnIDs.sort(compare);return this._configurableColumnIDs;},_contextMenu:function(event)
{var contextMenu=new WebInspector.ContextMenu(event);if(this._detailedMode&&event.target.isSelfOrDescendant(this._dataGrid.headerTableBody)){var columnsVisibility=this._coulmnsVisibilitySetting.get();var columnIDs=this._getConfigurableColumnIDs();var columnTitles=WebInspector.NetworkLogView._columnTitles;for(var i=0;i<columnIDs.length;++i){var columnIdentifier=columnIDs[i];contextMenu.appendCheckboxItem(columnTitles[columnIdentifier],this._toggleColumnVisibility.bind(this,columnIdentifier),!!columnsVisibility[columnIdentifier]);}
contextMenu.show();return;}
var gridNode=this._dataGrid.dataGridNodeFromNode(event.target);var request=gridNode&&gridNode.request();function openResourceInNewTab(url)
{InspectorFrontendHost.openInNewTab(url);}
if(request){contextMenu.appendItem(WebInspector.openLinkExternallyLabel(),openResourceInNewTab.bind(null,request.url));contextMenu.appendSeparator();contextMenu.appendItem(WebInspector.copyLinkAddressLabel(),this._copyLocation.bind(this,request));if(request.requestHeadersText())
contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Copy request headers":"Copy Request Headers"),this._copyRequestHeaders.bind(this,request));if(request.responseHeadersText)
contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Copy response headers":"Copy Response Headers"),this._copyResponseHeaders.bind(this,request));if(request.finished)
contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Copy response":"Copy Response"),this._copyResponse.bind(this,request));contextMenu.appendItem(WebInspector.UIString("Copy as cURL"),this._copyCurlCommand.bind(this,request));}
contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Copy all as HAR":"Copy All as HAR"),this._copyAll.bind(this));contextMenu.appendSeparator();contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Save as HAR with content":"Save as HAR with Content"),this._exportAll.bind(this));contextMenu.appendSeparator();contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Clear browser cache":"Clear Browser Cache"),this._clearBrowserCache.bind(this));contextMenu.appendItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Clear browser cookies":"Clear Browser Cookies"),this._clearBrowserCookies.bind(this));if(request&&request.type===WebInspector.resourceTypes.XHR){contextMenu.appendSeparator();contextMenu.appendItem(WebInspector.UIString("Replay XHR"),this._replayXHR.bind(this,request.requestId));contextMenu.appendSeparator();}
contextMenu.show();},_replayXHR:function(requestId)
{NetworkAgent.replayXHR(requestId);},_harRequests:function()
{var requests=this._nodesByRequestId.values().map(function(node){return node.request();});var httpRequests=requests.filter(WebInspector.NetworkLogView.HTTPRequestsFilter);httpRequests=httpRequests.filter(WebInspector.NetworkLogView.FinishedRequestsFilter);return httpRequests.filter(WebInspector.NetworkLogView.NonDevToolsRequestsFilter);},_copyAll:function()
{var harArchive={log:(new WebInspector.HARLog(this._harRequests())).build()};InspectorFrontendHost.copyText(JSON.stringify(harArchive,null,2));},_copyLocation:function(request)
{InspectorFrontendHost.copyText(request.url);},_copyRequestHeaders:function(request)
{InspectorFrontendHost.copyText(request.requestHeadersText());},_copyResponse:function(request)
{function callback(content)
{if(request.contentEncoded)
content=request.asDataURL();InspectorFrontendHost.copyText(content||"");}
request.requestContent(callback);},_copyResponseHeaders:function(request)
{InspectorFrontendHost.copyText(request.responseHeadersText);},_copyCurlCommand:function(request)
{InspectorFrontendHost.copyText(this._generateCurlCommand(request));},_exportAll:function()
{var filename=WebInspector.targetManager.inspectedPageDomain()+".har";var stream=new WebInspector.FileOutputStream();stream.open(filename,openCallback.bind(this));function openCallback(accepted)
{if(!accepted)
return;var progressIndicator=new WebInspector.ProgressIndicator();this._progressBarContainer.appendChild(progressIndicator.element);var harWriter=new WebInspector.HARWriter();harWriter.write(stream,this._harRequests(),progressIndicator);}},_clearBrowserCache:function()
{if(confirm(WebInspector.UIString("Are you sure you want to clear browser cache?")))
NetworkAgent.clearBrowserCache();},_clearBrowserCookies:function()
{if(confirm(WebInspector.UIString("Are you sure you want to clear browser cookies?")))
NetworkAgent.clearBrowserCookies();},_matchRequest:function(request)
{var re=this._searchRegExp;if(!re)
return false;return re.test(request.name())||re.test(request.path());},_clearSearchMatchedList:function()
{this._matchedRequestCount=-1;this._currentMatchedRequestNode=null;this._removeAllHighlights();},_removeAllHighlights:function()
{this._removeAllNodeHighlights();for(var i=0;i<this._highlightedSubstringChanges.length;++i)
WebInspector.revertDomChanges(this._highlightedSubstringChanges[i]);this._highlightedSubstringChanges=[];},_highlightNthMatchedRequestForSearch:function(n,reveal)
{this._removeAllHighlights();var nodes=this._dataGrid.rootNode().children;var matchCount=0;var node=null;for(var i=0;i<nodes.length;++i){if(nodes[i]._isMatchingSearchQuery){if(matchCount===n){node=nodes[i];break;}
matchCount++;}}
if(!node){this._currentMatchedRequestNode=null;return;}
var request=node.request();var regExp=this._searchRegExp;var nameMatched=request.name().match(regExp);var pathMatched=request.path().match(regExp);if(!nameMatched&&pathMatched&&!this._largerRequestsButton.toggled)
this._toggleLargerRequests();if(reveal)
WebInspector.Revealer.reveal(request);var highlightedSubstringChanges=node.highlightMatchedSubstring(regExp);this._highlightedSubstringChanges.push(highlightedSubstringChanges);this._currentMatchedRequestNode=node;this._currentMatchedRequestIndex=n;this.dispatchEventToListeners(WebInspector.NetworkLogView.EventTypes.SearchIndexUpdated,n);},performSearch:function(query,shouldJump,jumpBackwards)
{var currentMatchedRequestNode=this._currentMatchedRequestNode;this._clearSearchMatchedList();this._searchRegExp=createPlainTextSearchRegex(query,"i");var nodes=this._dataGrid.rootNode().children;for(var i=0;i<nodes.length;++i)
nodes[i]._isMatchingSearchQuery=this._matchRequest(nodes[i].request());var newMatchedRequestIndex=this._updateMatchCountAndFindMatchIndex(currentMatchedRequestNode);if(!newMatchedRequestIndex&&jumpBackwards)
newMatchedRequestIndex=this._matchedRequestCount-1;this._highlightNthMatchedRequestForSearch(newMatchedRequestIndex,shouldJump);},_updateMatchCountAndFindMatchIndex:function(node)
{var nodes=this._dataGrid.rootNode().children;var matchCount=0;var matchIndex=0;for(var i=0;i<nodes.length;++i){if(!nodes[i]._isMatchingSearchQuery)
continue;if(node===nodes[i])
matchIndex=matchCount;matchCount++;}
if(this._matchedRequestCount!==matchCount){this._matchedRequestCount=matchCount;this.dispatchEventToListeners(WebInspector.NetworkLogView.EventTypes.SearchCountUpdated,matchCount);}
return matchIndex;},_normalizeSearchResultIndex:function(index)
{return(index+this._matchedRequestCount)%this._matchedRequestCount;},_applyFilter:function(node)
{var request=node.request();if(!this._resourceTypeFilterUI.accept(request.type.name()))
return false;if(this._dataURLFilterUI.checked()&&request.parsedURL.isDataURL())
return false;for(var i=0;i<this._filters.length;++i){if(!this._filters[i](request))
return false;}
return true;},_parseFilterQuery:function(query)
{var parsedQuery=this._suggestionBuilder.parseQuery(query);this._filters=parsedQuery.text.map(this._createTextFilter);for(var key in parsedQuery.filters){var filterType=(key);this._filters.push(this._createFilter(filterType,parsedQuery.filters[key]));}},_createTextFilter:function(text)
{var regexp=new RegExp(text.escapeForRegExp(),"i");return WebInspector.NetworkLogView._requestNameOrPathFilter.bind(null,regexp);},_createFilter:function(type,value){switch(type){case WebInspector.NetworkLogView.FilterType.Domain:return WebInspector.NetworkLogView._requestDomainFilter.bind(null,value);case WebInspector.NetworkLogView.FilterType.HasResponseHeader:return WebInspector.NetworkLogView._requestResponseHeaderFilter.bind(null,value);case WebInspector.NetworkLogView.FilterType.Method:return WebInspector.NetworkLogView._requestMethodFilter.bind(null,value);case WebInspector.NetworkLogView.FilterType.MimeType:return WebInspector.NetworkLogView._requestMimeTypeFilter.bind(null,value);case WebInspector.NetworkLogView.FilterType.Scheme:return WebInspector.NetworkLogView._requestSchemeFilter.bind(null,value);case WebInspector.NetworkLogView.FilterType.SetCookieDomain:return WebInspector.NetworkLogView._requestSetCookieDomainFilter.bind(null,value);case WebInspector.NetworkLogView.FilterType.SetCookieName:return WebInspector.NetworkLogView._requestSetCookieNameFilter.bind(null,value);case WebInspector.NetworkLogView.FilterType.SetCookieValue:return WebInspector.NetworkLogView._requestSetCookieValueFilter.bind(null,value);case WebInspector.NetworkLogView.FilterType.StatusCode:return WebInspector.NetworkLogView._statusCodeFilter.bind(null,value);}
return this._createTextFilter(type+":"+value);},_filterRequests:function()
{this._removeAllHighlights();this._invalidateAllItems();this.refresh();},jumpToPreviousSearchResult:function()
{if(!this._matchedRequestCount)
return;var index=this._normalizeSearchResultIndex(this._currentMatchedRequestIndex-1);this._highlightNthMatchedRequestForSearch(index,true);},jumpToNextSearchResult:function()
{if(!this._matchedRequestCount)
return;var index=this._normalizeSearchResultIndex(this._currentMatchedRequestIndex+1);this._highlightNthMatchedRequestForSearch(index,true);},searchCanceled:function()
{delete this._searchRegExp;this._clearSearchMatchedList();this.dispatchEventToListeners(WebInspector.NetworkLogView.EventTypes.SearchCountUpdated,0);},revealAndHighlightRequest:function(request)
{this._removeAllNodeHighlights();var node=this._nodesByRequestId.get(request.requestId);if(node){node.reveal();this._highlightNode(node);}},_removeAllNodeHighlights:function()
{if(this._highlightedNode){this._highlightedNode.element().classList.remove("highlighted-row");delete this._highlightedNode;}},_highlightNode:function(node)
{WebInspector.runCSSAnimationOnce(node.element(),"highlighted-row");this._highlightedNode=node;},_generateCurlCommand:function(request)
{var command=["curl"];var ignoredHeaders={"host":1,"method":1,"path":1,"scheme":1,"version":1};function escapeStringWin(str)
{return"\""+str.replace(/"/g,"\"\"").replace(/%/g,"\"%\"").replace(/\\/g,"\\\\").replace(/[\r\n]+/g,"\"^$&\"")+"\"";}
function escapeStringPosix(str)
{function escapeCharacter(x)
{var code=x.charCodeAt(0);if(code<256){return code<16?"\\x0"+code.toString(16):"\\x"+code.toString(16);}
code=code.toString(16);return"\\u"+("0000"+code).substr(code.length,4);}
if(/[^\x20-\x7E]|\'/.test(str)){return"$\'"+str.replace(/\\/g,"\\\\").replace(/\'/g,"\\\'").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[^\x20-\x7E]/g,escapeCharacter)+"'";}else{return"'"+str+"'";}}
var escapeString=WebInspector.isWin()?escapeStringWin:escapeStringPosix;command.push(escapeString(request.url).replace(/[[{}\]]/g,"\\$&"));var inferredMethod="GET";var data=[];var requestContentType=request.requestContentType();if(requestContentType&&requestContentType.startsWith("application/x-www-form-urlencoded")&&request.requestFormData){data.push("--data");data.push(escapeString(request.requestFormData));ignoredHeaders["content-length"]=true;inferredMethod="POST";}else if(request.requestFormData){data.push("--data-binary");data.push(escapeString(request.requestFormData));ignoredHeaders["content-length"]=true;inferredMethod="POST";}
if(request.requestMethod!==inferredMethod){command.push("-X");command.push(request.requestMethod);}
var requestHeaders=request.requestHeaders();for(var i=0;i<requestHeaders.length;i++){var header=requestHeaders[i];var name=header.name.replace(/^:/,"");if(name.toLowerCase()in ignoredHeaders)
continue;command.push("-H");command.push(escapeString(name+": "+header.value));}
command=command.concat(data);command.push("--compressed");return command.join(" ");},__proto__:WebInspector.VBox.prototype}
WebInspector.NetworkLogView.Filter;WebInspector.NetworkLogView._requestNameOrPathFilter=function(regex,request)
{return regex.test(request.name())||regex.test(request.path());}
WebInspector.NetworkLogView._requestDomainFilter=function(value,request)
{return request.domain===value;}
WebInspector.NetworkLogView._requestResponseHeaderFilter=function(value,request)
{return request.responseHeaderValue(value)!==undefined;}
WebInspector.NetworkLogView._requestMethodFilter=function(value,request)
{return request.requestMethod===value;}
WebInspector.NetworkLogView._requestMimeTypeFilter=function(value,request)
{return request.mimeType===value;}
WebInspector.NetworkLogView._requestSchemeFilter=function(value,request)
{return request.scheme===value;}
WebInspector.NetworkLogView._requestSetCookieDomainFilter=function(value,request)
{var cookies=request.responseCookies;for(var i=0,l=cookies?cookies.length:0;i<l;++i){if(cookies[i].domain()===value)
return false;}
return false;}
WebInspector.NetworkLogView._requestSetCookieNameFilter=function(value,request)
{var cookies=request.responseCookies;for(var i=0,l=cookies?cookies.length:0;i<l;++i){if(cookies[i].name()===value)
return false;}
return false;}
WebInspector.NetworkLogView._requestSetCookieValueFilter=function(value,request)
{var cookies=request.responseCookies;for(var i=0,l=cookies?cookies.length:0;i<l;++i){if(cookies[i].value()===value)
return false;}
return false;}
WebInspector.NetworkLogView._statusCodeFilter=function(value,request)
{return(""+request.statusCode)===value;}
WebInspector.NetworkLogView.HTTPRequestsFilter=function(request)
{return request.parsedURL.isValid&&(request.scheme in WebInspector.NetworkLogView.HTTPSchemas);}
WebInspector.NetworkLogView.NonDevToolsRequestsFilter=function(request)
{return!WebInspector.NetworkManager.hasDevToolsRequestHeader(request);}
WebInspector.NetworkLogView.FinishedRequestsFilter=function(request)
{return request.finished;}
WebInspector.NetworkLogView.EventTypes={ViewCleared:"ViewCleared",RowSizeChanged:"RowSizeChanged",RequestSelected:"RequestSelected",SearchCountUpdated:"SearchCountUpdated",SearchIndexUpdated:"SearchIndexUpdated"};WebInspector.NetworkPanel=function()
{WebInspector.Panel.call(this,"network");this.registerRequiredCSS("networkPanel.css");this._panelStatusBarElement=this.element.createChild("div","panel-status-bar");this._filterBar=new WebInspector.FilterBar();this._filtersContainer=this.element.createChild("div","network-filters-header hidden");this._filtersContainer.appendChild(this._filterBar.filtersElement());this._filterBar.addEventListener(WebInspector.FilterBar.Events.FiltersToggled,this._onFiltersToggled,this);this._filterBar.setName("networkPanel");this._searchableView=new WebInspector.SearchableView(this);this._searchableView.show(this.element);var contentsElement=this._searchableView.element;this._splitView=new WebInspector.SplitView(true,false,"networkPanelSplitViewState");this._splitView.show(contentsElement);this._splitView.hideMain();var defaultColumnsVisibility=WebInspector.NetworkLogView.defaultColumnsVisibility;var networkLogColumnsVisibilitySetting=WebInspector.settings.createSetting("networkLogColumnsVisibility",defaultColumnsVisibility);var savedColumnsVisibility=networkLogColumnsVisibilitySetting.get();var columnsVisibility={};for(var columnId in defaultColumnsVisibility)
columnsVisibility[columnId]=savedColumnsVisibility.hasOwnProperty(columnId)?savedColumnsVisibility[columnId]:defaultColumnsVisibility[columnId];networkLogColumnsVisibilitySetting.set(columnsVisibility);this._networkLogView=new WebInspector.NetworkLogView(this._filterBar,networkLogColumnsVisibilitySetting);this._networkLogView.show(this._splitView.sidebarElement());var viewsContainerView=new WebInspector.VBox();this._viewsContainerElement=viewsContainerView.element;this._viewsContainerElement.id="network-views";if(!this._networkLogView.usesLargeRows())
this._viewsContainerElement.classList.add("small");viewsContainerView.show(this._splitView.mainElement());this._networkLogView.addEventListener(WebInspector.NetworkLogView.EventTypes.ViewCleared,this._onViewCleared,this);this._networkLogView.addEventListener(WebInspector.NetworkLogView.EventTypes.RowSizeChanged,this._onRowSizeChanged,this);this._networkLogView.addEventListener(WebInspector.NetworkLogView.EventTypes.RequestSelected,this._onRequestSelected,this);this._networkLogView.addEventListener(WebInspector.NetworkLogView.EventTypes.SearchCountUpdated,this._onSearchCountUpdated,this);this._networkLogView.addEventListener(WebInspector.NetworkLogView.EventTypes.SearchIndexUpdated,this._onSearchIndexUpdated,this);this._closeButtonElement=this._viewsContainerElement.createChild("div","close-button");this._closeButtonElement.id="network-close-button";this._closeButtonElement.addEventListener("click",this._toggleGridMode.bind(this),false);this._viewsContainerElement.appendChild(this._closeButtonElement);var statusBarItems=this._networkLogView.statusBarItems();for(var i=0;i<statusBarItems.length;++i)
this._panelStatusBarElement.appendChild(statusBarItems[i]);function sourceFrameGetter()
{return this._networkItemView.currentSourceFrame();}
WebInspector.GoToLineDialog.install(this,sourceFrameGetter.bind(this));}
WebInspector.NetworkPanel.prototype={_onFiltersToggled:function(event)
{var toggled=(event.data);this._filtersContainer.classList.toggle("hidden",!toggled);this.element.classList.toggle("filters-toggled",toggled);this.doResize();},elementsToRestoreScrollPositionsFor:function()
{return this._networkLogView.elementsToRestoreScrollPositionsFor();},searchableView:function()
{return this._searchableView;},handleShortcut:function(event)
{if(this._viewingRequestMode&&event.keyCode===WebInspector.KeyboardShortcut.Keys.Esc.code){this._toggleGridMode();event.handled=true;return;}
WebInspector.Panel.prototype.handleShortcut.call(this,event);},wasShown:function()
{WebInspector.Panel.prototype.wasShown.call(this);},revealAndHighlightRequest:function(request)
{this._toggleGridMode();if(request)
this._networkLogView.revealAndHighlightRequest(request);},_onViewCleared:function(event)
{this._closeVisibleRequest();this._toggleGridMode();this._viewsContainerElement.removeChildren();this._viewsContainerElement.appendChild(this._closeButtonElement);},_onRowSizeChanged:function(event)
{this._viewsContainerElement.classList.toggle("small",!event.data.largeRows);},_onSearchCountUpdated:function(event)
{var count=(event.data);this._searchableView.updateSearchMatchesCount(count);},_onSearchIndexUpdated:function(event)
{var index=(event.data);this._searchableView.updateCurrentMatchIndex(index);},_onRequestSelected:function(event)
{var request=(event.data);this._showRequest(request);},_showRequest:function(request)
{if(!request)
return;this._toggleViewingRequestMode();if(this._networkItemView){this._networkItemView.detach();delete this._networkItemView;}
var view=new WebInspector.NetworkItemView(request);view.show(this._viewsContainerElement);this._networkItemView=view;},_closeVisibleRequest:function()
{this.element.classList.remove("viewing-resource");if(this._networkItemView){this._networkItemView.detach();delete this._networkItemView;}},_toggleGridMode:function()
{if(this._viewingRequestMode){this._viewingRequestMode=false;this.element.classList.remove("viewing-resource");this._splitView.hideMain();}
this._networkLogView.switchViewMode(true);this._networkLogView.setAllowPopover(true);this._networkLogView._allowRequestSelection=false;},_toggleViewingRequestMode:function()
{if(this._viewingRequestMode)
return;this._viewingRequestMode=true;this.element.classList.add("viewing-resource");this._splitView.showBoth();this._networkLogView.setAllowPopover(false);this._networkLogView._allowRequestSelection=true;this._networkLogView.switchViewMode(false);},performSearch:function(query,shouldJump,jumpBackwards)
{this._networkLogView.performSearch(query,shouldJump,jumpBackwards);},jumpToPreviousSearchResult:function()
{this._networkLogView.jumpToPreviousSearchResult();},jumpToNextSearchResult:function()
{this._networkLogView.jumpToNextSearchResult();},searchCanceled:function()
{this._networkLogView.searchCanceled();},appendApplicableItems:function(event,contextMenu,target)
{function reveal(request)
{WebInspector.inspectorView.setCurrentPanel(this);this.revealAndHighlightRequest(request);}
function appendRevealItem(request)
{var revealText=WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Reveal in Network panel":"Reveal in Network Panel");contextMenu.appendItem(revealText,reveal.bind(this,request));}
if(target instanceof WebInspector.Resource){var resource=(target);if(resource.request)
appendRevealItem.call(this,resource.request);return;}
if(target instanceof WebInspector.UISourceCode){var uiSourceCode=(target);var resource=WebInspector.resourceForURL(uiSourceCode.url);if(resource&&resource.request)
appendRevealItem.call(this,resource.request);return;}
if(!(target instanceof WebInspector.NetworkRequest))
return;var request=(target);if(this._networkItemView&&this._networkItemView.isShowing()&&this._networkItemView.request()===request)
return;appendRevealItem.call(this,request);},__proto__:WebInspector.Panel.prototype}
WebInspector.NetworkPanel.ContextMenuProvider=function()
{}
WebInspector.NetworkPanel.ContextMenuProvider.prototype={appendApplicableItems:function(event,contextMenu,target)
{WebInspector.inspectorView.panel("network").appendApplicableItems(event,contextMenu,target);}}
WebInspector.NetworkPanel.RequestRevealer=function()
{}
WebInspector.NetworkPanel.RequestRevealer.prototype={reveal:function(request,lineNumber)
{if(request instanceof WebInspector.NetworkRequest){var panel=(WebInspector.inspectorView.showPanel("network"));if(panel)
panel.revealAndHighlightRequest(request);}}}
WebInspector.NetworkTimeCalculator=function(startAtZero)
{this.startAtZero=startAtZero;}
WebInspector.NetworkTimeCalculator._latencyDownloadTotalFormat=new WebInspector.UIStringFormat("%s latency, %s download (%s total)");WebInspector.NetworkTimeCalculator._latencyFormat=new WebInspector.UIStringFormat("%s latency");WebInspector.NetworkTimeCalculator._downloadFormat=new WebInspector.UIStringFormat("%s download");WebInspector.NetworkTimeCalculator._fromServiceWorkerFormat=new WebInspector.UIStringFormat("%s (from ServiceWorker)");WebInspector.NetworkTimeCalculator._fromCacheFormat=new WebInspector.UIStringFormat("%s (from cache)");WebInspector.NetworkTimeCalculator.prototype={paddingLeft:function()
{return 0;},computePosition:function(time)
{return(time-this._minimumBoundary)/this.boundarySpan()*this._workingArea;},formatTime:function(value,precision)
{return Number.secondsToString(value);},minimumBoundary:function()
{return this._minimumBoundary;},zeroTime:function()
{return this._minimumBoundary;},maximumBoundary:function()
{return this._maximumBoundary;},boundarySpan:function()
{return this._maximumBoundary-this._minimumBoundary;},reset:function()
{delete this._minimumBoundary;delete this._maximumBoundary;},_value:function(item)
{return 0;},setDisplayWindow:function(clientWidth)
{this._workingArea=clientWidth;},computeBarGraphPercentages:function(request)
{if(request.startTime!==-1)
var start=((request.startTime-this._minimumBoundary)/this.boundarySpan())*100;else
var start=0;if(request.responseReceivedTime!==-1)
var middle=((request.responseReceivedTime-this._minimumBoundary)/this.boundarySpan())*100;else
var middle=(this.startAtZero?start:100);if(request.endTime!==-1)
var end=((request.endTime-this._minimumBoundary)/this.boundarySpan())*100;else
var end=(this.startAtZero?middle:100);if(this.startAtZero){end-=start;middle-=start;start=0;}
return{start:start,middle:middle,end:end};},computePercentageFromEventTime:function(eventTime)
{if(eventTime!==-1&&!this.startAtZero)
return((eventTime-this._minimumBoundary)/this.boundarySpan())*100;return 0;},updateBoundariesForEventTime:function(eventTime)
{if(eventTime===-1||this.startAtZero)
return false;if(typeof this._maximumBoundary==="undefined"||eventTime>this._maximumBoundary){this._maximumBoundary=eventTime;return true;}
return false;},computeBarGraphLabels:function(request)
{var rightLabel="";if(request.responseReceivedTime!==-1&&request.endTime!==-1)
rightLabel=Number.secondsToString(request.endTime-request.responseReceivedTime);var hasLatency=request.latency>0;if(hasLatency)
var leftLabel=Number.secondsToString(request.latency);else
var leftLabel=rightLabel;if(request.timing)
return{left:leftLabel,right:rightLabel};if(hasLatency&&rightLabel){var total=Number.secondsToString(request.duration);var tooltip=WebInspector.NetworkTimeCalculator._latencyDownloadTotalFormat.format(leftLabel,rightLabel,total);}else if(hasLatency)
var tooltip=WebInspector.NetworkTimeCalculator._latencyFormat.format(leftLabel);else if(rightLabel)
var tooltip=WebInspector.NetworkTimeCalculator._downloadFormat.format(rightLabel);if(request.fetchedViaServiceWorker)
tooltip=WebInspector.NetworkTimeCalculator._fromServiceWorkerFormat.format(tooltip);else if(request.cached)
tooltip=WebInspector.NetworkTimeCalculator._fromCacheFormat.format(tooltip);return{left:leftLabel,right:rightLabel,tooltip:tooltip};},updateBoundaries:function(request)
{var didChange=false;var lowerBound;if(this.startAtZero)
lowerBound=0;else
lowerBound=this._lowerBound(request);if(lowerBound!==-1&&(typeof this._minimumBoundary==="undefined"||lowerBound<this._minimumBoundary)){this._minimumBoundary=lowerBound;didChange=true;}
var upperBound=this._upperBound(request);if(upperBound!==-1&&(typeof this._maximumBoundary==="undefined"||upperBound>this._maximumBoundary)){this._maximumBoundary=upperBound;didChange=true;}
return didChange;},_lowerBound:function(request)
{return 0;},_upperBound:function(request)
{return 0;}}
WebInspector.NetworkTransferTimeCalculator=function()
{WebInspector.NetworkTimeCalculator.call(this,false);}
WebInspector.NetworkTransferTimeCalculator.prototype={formatTime:function(value,precision)
{return Number.secondsToString(value-this.zeroTime());},_lowerBound:function(request)
{return request.startTime;},_upperBound:function(request)
{return request.endTime;},__proto__:WebInspector.NetworkTimeCalculator.prototype}
WebInspector.NetworkTransferDurationCalculator=function()
{WebInspector.NetworkTimeCalculator.call(this,true);}
WebInspector.NetworkTransferDurationCalculator.prototype={formatTime:function(value,precision)
{return Number.secondsToString(value);},_upperBound:function(request)
{return request.duration;},__proto__:WebInspector.NetworkTimeCalculator.prototype}
WebInspector.NetworkDataGridNode=function(parentView,request)
{WebInspector.SortableDataGridNode.call(this,{});this._parentView=parentView;this._request=request;this._linkifier=new WebInspector.Linkifier();this._isFilteredOut=true;this._isMatchingSearchQuery=false;this._staleGraph=true;}
WebInspector.NetworkDataGridNode.prototype={request:function()
{return this._request;},nodeSelfHeight:function(){return this._parentView.rowHeight();},createCells:function()
{this._nameCell=null;this._timelineCell=null;this._element.classList.toggle("network-error-row",this._isFailed());WebInspector.SortableDataGridNode.prototype.createCells.call(this);this._updateGraph();},createCell:function(columnIdentifier)
{var cell=this.createTD(columnIdentifier);switch(columnIdentifier){case"name":this._renderNameCell(cell);break;case"timeline":this._createTimelineBar(cell);break;case"method":cell.setTextAndTitle(this._request.requestMethod);break;case"status":this._renderStatusCell(cell);break;case"scheme":cell.setTextAndTitle(this._request.scheme);break;case"domain":cell.setTextAndTitle(this._request.domain);break;case"remoteAddress":cell.setTextAndTitle(this._request.remoteAddress());break;case"cookies":cell.setTextAndTitle(this._arrayLength(this._request.requestCookies));break;case"setCookies":cell.setTextAndTitle(this._arrayLength(this._request.responseCookies));break;case"connectionId":cell.setTextAndTitle(this._request.connectionId);break;case"type":cell.setTextAndTitle(this._request.mimeType||this._request.requestContentType()||"");break;case"initiator":this._renderInitiatorCell(cell);break;case"size":this._renderSizeCell(cell);break;case"time":this._renderTimeCell(cell);break;default:cell.setTextAndTitle(this._request.responseHeaderValue(columnIdentifier)||"");break;}
return cell;},_arrayLength:function(array)
{return array?""+array.length:"";},willAttach:function()
{if(this._staleGraph)
this._updateGraph();},wasDetached:function()
{if(this._linkifiedInitiatorAnchor)
this._linkifiedInitiatorAnchor.remove();},dispose:function()
{this._linkifier.reset();},_onClick:function()
{if(!this._parentView.allowRequestSelection())
this.select();},select:function()
{this._parentView.dispatchEventToListeners(WebInspector.NetworkLogView.EventTypes.RequestSelected,this._request);WebInspector.SortableDataGridNode.prototype.select.apply(this,arguments);WebInspector.notifications.dispatchEventToListeners(WebInspector.UserMetrics.UserAction,{action:WebInspector.UserMetrics.UserActionNames.NetworkRequestSelected,url:this._request.url});},highlightMatchedSubstring:function(regexp)
{this.element();var domChanges=[];var matchInfo=this._nameCell.textContent.match(regexp);if(matchInfo)
WebInspector.highlightSearchResult(this._nameCell,matchInfo.index,matchInfo[0].length,domChanges);return domChanges;},_openInNewTab:function()
{InspectorFrontendHost.openInNewTab(this._request.url);},get selectable()
{return this._parentView.allowRequestSelection();},_createTimelineBar:function(cell)
{cell=cell.createChild("div");this._timelineCell=cell;cell.className="network-graph-side";this._barAreaElement=cell.createChild("div","network-graph-bar-area");this._barAreaElement.request=this._request;var type=this._request.type.name();var cached=this._request.cached;this._barLeftElement=this._barAreaElement.createChild("div","network-graph-bar");this._barLeftElement.classList.add(type,"waiting");this._barLeftElement.classList.toggle("cached",cached);this._barRightElement=this._barAreaElement.createChild("div","network-graph-bar");this._barRightElement.classList.add(type);this._barRightElement.classList.toggle("cached",cached);this._labelLeftElement=this._barAreaElement.createChild("div","network-graph-label");this._labelLeftElement.classList.add("waiting");this._labelRightElement=this._barAreaElement.createChild("div","network-graph-label");cell.addEventListener("mouseover",this._refreshLabelPositions.bind(this),false);},_isFailed:function()
{return(this._request.failed&&!this._request.statusCode)||(this._request.statusCode>=400);},_renderNameCell:function(cell)
{this._nameCell=cell;cell.addEventListener("click",this._onClick.bind(this),false);cell.addEventListener("dblclick",this._openInNewTab.bind(this),false);var iconElement;if(this._request.type===WebInspector.resourceTypes.Image){var previewImage=document.createElementWithClass("img","image-network-icon-preview");this._request.populateImageSource(previewImage);iconElement=document.createElementWithClass("div","icon");iconElement.appendChild(previewImage);}else{iconElement=document.createElementWithClass("img","icon");}
iconElement.classList.add(this._request.type.name());cell.appendChild(iconElement);cell.createTextChild(this._request.name());this._appendSubtitle(cell,this._request.path());cell.title=this._request.url;},_renderStatusCell:function(cell)
{cell.classList.toggle("network-dim-cell",!this._isFailed()&&(this._request.cached||!this._request.statusCode));if(this._request.failed&&!this._request.canceled){var failText=WebInspector.UIString("(failed)");if(this._request.localizedFailDescription){cell.createTextChild(failText);this._appendSubtitle(cell,this._request.localizedFailDescription);cell.title=failText+" "+this._request.localizedFailDescription;}else
cell.setTextAndTitle(failText);}else if(this._request.statusCode){cell.createTextChild(""+this._request.statusCode);this._appendSubtitle(cell,this._request.statusText);cell.title=this._request.statusCode+" "+this._request.statusText;}else if(this._request.parsedURL.isDataURL()){cell.setTextAndTitle(WebInspector.UIString("(data)"));}else if(this._request.canceled){cell.setTextAndTitle(WebInspector.UIString("(canceled)"));}else if(this._request.finished){cell.setTextAndTitle(WebInspector.UIString("Finished"));}else{cell.setTextAndTitle(WebInspector.UIString("(pending)"));}},_renderInitiatorCell:function(cell)
{var request=this._request;var initiator=request.initiatorInfo();switch(initiator.type){case WebInspector.NetworkRequest.InitiatorType.Parser:cell.title=initiator.url+":"+initiator.lineNumber;cell.appendChild(WebInspector.linkifyResourceAsNode(initiator.url,initiator.lineNumber-1));this._appendSubtitle(cell,WebInspector.UIString("Parser"));break;case WebInspector.NetworkRequest.InitiatorType.Redirect:cell.title=initiator.url;console.assert(request.redirectSource);var redirectSource=(request.redirectSource);cell.appendChild(WebInspector.linkifyRequestAsNode(redirectSource));this._appendSubtitle(cell,WebInspector.UIString("Redirect"));break;case WebInspector.NetworkRequest.InitiatorType.Script:if(!this._linkifiedInitiatorAnchor){this._linkifiedInitiatorAnchor=this._linkifier.linkifyScriptLocation(request.target(),null,initiator.url,initiator.lineNumber-1,initiator.columnNumber-1);this._linkifiedInitiatorAnchor.title="";}
cell.appendChild(this._linkifiedInitiatorAnchor);this._appendSubtitle(cell,WebInspector.UIString("Script"));cell.classList.add("network-script-initiated");cell.request=request;break;default:cell.title="";cell.classList.add("network-dim-cell");cell.setTextAndTitle(WebInspector.UIString("Other"));}},_renderSizeCell:function(cell)
{if(this._request.fetchedViaServiceWorker){cell.setTextAndTitle(WebInspector.UIString("(from ServiceWorker)"));cell.classList.add("network-dim-cell");}else if(this._request.cached){cell.setTextAndTitle(WebInspector.UIString("(from cache)"));cell.classList.add("network-dim-cell");}else{var resourceSize=Number.bytesToString(this._request.resourceSize);var transferSize=Number.bytesToString(this._request.transferSize);cell.setTextAndTitle(transferSize);this._appendSubtitle(cell,resourceSize);}},_renderTimeCell:function(cell)
{if(this._request.duration>0){cell.setTextAndTitle(Number.secondsToString(this._request.duration));this._appendSubtitle(cell,Number.secondsToString(this._request.latency));}else{cell.classList.add("network-dim-cell");cell.setTextAndTitle(WebInspector.UIString("Pending"));}},_appendSubtitle:function(cellElement,subtitleText)
{var subtitleElement=document.createElement("div");subtitleElement.className="network-cell-subtitle";subtitleElement.textContent=subtitleText;cellElement.appendChild(subtitleElement);},refreshGraph:function()
{if(!this._timelineCell)
return;this._staleGraph=true;if(this.attached())
this.dataGrid.scheduleUpdate();},_updateGraph:function()
{this._staleGraph=false;if(!this._timelineCell)
return;var calculator=this._parentView.calculator();var percentages=calculator.computeBarGraphPercentages(this._request);this._percentages=percentages;this._barAreaElement.classList.remove("hidden");this._barLeftElement.style.setProperty("left",percentages.start+"%");this._barLeftElement.style.setProperty("right",(100-percentages.middle)+"%");this._barRightElement.style.setProperty("left",percentages.middle+"%");this._barRightElement.style.setProperty("right",(100-percentages.end)+"%");var labels=calculator.computeBarGraphLabels(this._request);this._labelLeftElement.textContent=labels.left;this._labelRightElement.textContent=labels.right;var tooltip=(labels.tooltip||"");this._barLeftElement.title=tooltip;this._labelLeftElement.title=tooltip;this._labelRightElement.title=tooltip;this._barRightElement.title=tooltip;},_refreshLabelPositions:function()
{if(!this._percentages)
return;this._labelLeftElement.style.removeProperty("left");this._labelLeftElement.style.removeProperty("right");this._labelLeftElement.classList.remove("before");this._labelLeftElement.classList.remove("hidden");this._labelRightElement.style.removeProperty("left");this._labelRightElement.style.removeProperty("right");this._labelRightElement.classList.remove("after");this._labelRightElement.classList.remove("hidden");const labelPadding=10;const barRightElementOffsetWidth=this._barRightElement.offsetWidth;const barLeftElementOffsetWidth=this._barLeftElement.offsetWidth;if(this._barLeftElement){var leftBarWidth=barLeftElementOffsetWidth-labelPadding;var rightBarWidth=(barRightElementOffsetWidth-barLeftElementOffsetWidth)-labelPadding;}else{var leftBarWidth=(barLeftElementOffsetWidth-barRightElementOffsetWidth)-labelPadding;var rightBarWidth=barRightElementOffsetWidth-labelPadding;}
const labelLeftElementOffsetWidth=this._labelLeftElement.offsetWidth;const labelRightElementOffsetWidth=this._labelRightElement.offsetWidth;const labelBefore=(labelLeftElementOffsetWidth>leftBarWidth);const labelAfter=(labelRightElementOffsetWidth>rightBarWidth);const graphElementOffsetWidth=this._timelineCell.offsetWidth;if(labelBefore&&(graphElementOffsetWidth*(this._percentages.start/100))<(labelLeftElementOffsetWidth+10))
var leftHidden=true;if(labelAfter&&(graphElementOffsetWidth*((100-this._percentages.end)/100))<(labelRightElementOffsetWidth+10))
var rightHidden=true;if(barLeftElementOffsetWidth==barRightElementOffsetWidth){if(labelBefore&&!labelAfter)
leftHidden=true;else if(labelAfter&&!labelBefore)
rightHidden=true;}
if(labelBefore){if(leftHidden)
this._labelLeftElement.classList.add("hidden");this._labelLeftElement.style.setProperty("right",(100-this._percentages.start)+"%");this._labelLeftElement.classList.add("before");}else{this._labelLeftElement.style.setProperty("left",this._percentages.start+"%");this._labelLeftElement.style.setProperty("right",(100-this._percentages.middle)+"%");}
if(labelAfter){if(rightHidden)
this._labelRightElement.classList.add("hidden");this._labelRightElement.style.setProperty("left",this._percentages.end+"%");this._labelRightElement.classList.add("after");}else{this._labelRightElement.style.setProperty("left",this._percentages.middle+"%");this._labelRightElement.style.setProperty("right",(100-this._percentages.end)+"%");}},__proto__:WebInspector.SortableDataGridNode.prototype}
WebInspector.NetworkDataGridNode.NameComparator=function(a,b)
{var aFileName=a._request.name();var bFileName=b._request.name();if(aFileName>bFileName)
return 1;if(bFileName>aFileName)
return-1;return a._request.indentityCompare(b._request);}
WebInspector.NetworkDataGridNode.RemoteAddressComparator=function(a,b)
{var aRemoteAddress=a._request.remoteAddress();var bRemoteAddress=b._request.remoteAddress();if(aRemoteAddress>bRemoteAddress)
return 1;if(bRemoteAddress>aRemoteAddress)
return-1;return a._request.indentityCompare(b._request);}
WebInspector.NetworkDataGridNode.SizeComparator=function(a,b)
{if(b._request.cached&&!a._request.cached)
return 1;if(a._request.cached&&!b._request.cached)
return-1;return(a._request.transferSize-b._request.transferSize)||a._request.indentityCompare(b._request);}
WebInspector.NetworkDataGridNode.InitiatorComparator=function(a,b)
{var aInitiator=a._request.initiatorInfo();var bInitiator=b._request.initiatorInfo();if(aInitiator.type<bInitiator.type)
return-1;if(aInitiator.type>bInitiator.type)
return 1;if(typeof aInitiator.__source==="undefined")
aInitiator.__source=WebInspector.displayNameForURL(aInitiator.url);if(typeof bInitiator.__source==="undefined")
bInitiator.__source=WebInspector.displayNameForURL(bInitiator.url);if(aInitiator.__source<bInitiator.__source)
return-1;if(aInitiator.__source>bInitiator.__source)
return 1;if(aInitiator.lineNumber<bInitiator.lineNumber)
return-1;if(aInitiator.lineNumber>bInitiator.lineNumber)
return 1;if(aInitiator.columnNumber<bInitiator.columnNumber)
return-1;if(aInitiator.columnNumber>bInitiator.columnNumber)
return 1;return a._request.indentityCompare(b._request);}
WebInspector.NetworkDataGridNode.RequestCookiesCountComparator=function(a,b)
{var aScore=a._request.requestCookies?a._request.requestCookies.length:0;var bScore=b._request.requestCookies?b._request.requestCookies.length:0;return(aScore-bScore)||a._request.indentityCompare(b._request);}
WebInspector.NetworkDataGridNode.ResponseCookiesCountComparator=function(a,b)
{var aScore=a._request.responseCookies?a._request.responseCookies.length:0;var bScore=b._request.responseCookies?b._request.responseCookies.length:0;return(aScore-bScore)||a._request.indentityCompare(b._request);}
WebInspector.NetworkDataGridNode.RequestPropertyComparator=function(propertyName,revert,a,b)
{var aValue=a._request[propertyName];var bValue=b._request[propertyName];if(aValue>bValue)
return revert?-1:1;if(bValue>aValue)
return revert?1:-1;return a._request.indentityCompare(b._request);};