WebInspector.WikiParser=function(wikiMarkupText)
{var text=wikiMarkupText;this._tokenizer=new WebInspector.WikiParser.Tokenizer(text);this._document=this._parse();}
WebInspector.WikiParser.Section=function()
{this.title;this.values;this.singleValue;}
WebInspector.WikiParser.Field=function()
{this.name;this.value;}
WebInspector.WikiParser.FieldValue;WebInspector.WikiParser.Values;WebInspector.WikiParser.Value;WebInspector.WikiParser.TokenType={Text:"Text",OpeningTable:"OpeningTable",ClosingTable:"ClosingTable",RowSeparator:"RowSeparator",CellSeparator:"CellSeparator",NameSeparator:"NameSeparator",OpeningCurlyBrackets:"OpeningCurlyBrackets",ClosingCurlyBrackets:"ClosingCurlyBrackets",Exclamation:"Exclamation",OpeningSquareBrackets:"OpeningSquareBrackets",ClosingBrackets:"ClosingBrackets",EqualSign:"EqualSign",EqualSignInCurlyBrackets:"EqualSignInCurlyBrackets",VerticalLine:"VerticalLine",DoubleQuotes:"DoubleQuotes",TripleQuotes:"TripleQuotes",OpeningCodeTag:"OpeningCodeTag",ClosingCodeTag:"ClosingCodeTag",Bullet:"Bullet",LineEnd:"LineEnd",CodeBlock:"CodeBlock",Space:"Space"}
WebInspector.WikiParser.Token=function(result,type)
{this._value=result;this._type=type;}
WebInspector.WikiParser.Token.prototype={value:function()
{return this._value;},type:function()
{return this._type;}}
WebInspector.WikiParser.Tokenizer=function(str)
{this._text=str;this._oldText=str;this._token=this._internalNextToken();this._mode=WebInspector.WikiParser.Tokenizer.Mode.Normal;}
WebInspector.WikiParser.Tokenizer.Mode={Normal:"Normal",Link:"Link"}
WebInspector.WikiParser.Tokenizer.prototype={_setMode:function(mode)
{this._mode=mode;this._text=this._oldText;this._token=this._internalNextToken();},_isNormalMode:function()
{return this._mode===WebInspector.WikiParser.Tokenizer.Mode.Normal;},peekToken:function()
{return this._token;},nextToken:function()
{var token=this._token;this._oldText=this._text;this._token=this._internalNextToken();return token;},_internalNextToken:function()
{if(WebInspector.WikiParser.newLineWithSpace.test(this._text)){var result=WebInspector.WikiParser.newLineWithSpace.exec(this._text);var begin=result.index;var end=this._text.length;var lineEnd=WebInspector.WikiParser.newLineWithoutSpace.exec(this._text);if(lineEnd)
end=lineEnd.index;var token=this._text.substring(begin,end).replace(/\n /g,"\n").replace(/{{=}}/g,"=");this._text=this._text.substring(end+1);return new WebInspector.WikiParser.Token(token,WebInspector.WikiParser.TokenType.CodeBlock);}
for(var i=0;i<WebInspector.WikiParser._tokenDescriptors.length;++i){if(this._isNormalMode()&&WebInspector.WikiParser._tokenDescriptors[i].type===WebInspector.WikiParser.TokenType.Space)
continue;var result=WebInspector.WikiParser._tokenDescriptors[i].regex.exec(this._text);if(result){this._text=this._text.substring(result.index+result[0].length);return new WebInspector.WikiParser.Token(result[0],WebInspector.WikiParser._tokenDescriptors[i].type);}}
for(var lastIndex=0;lastIndex<this._text.length;++lastIndex){var testString=this._text.substring(lastIndex);for(var i=0;i<WebInspector.WikiParser._tokenDescriptors.length;++i){if(this._isNormalMode()&&WebInspector.WikiParser._tokenDescriptors[i].type===WebInspector.WikiParser.TokenType.Space)
continue;if(WebInspector.WikiParser._tokenDescriptors[i].regex.test(testString)){var token=this._text.substring(0,lastIndex);this._text=this._text.substring(lastIndex);return new WebInspector.WikiParser.Token(token,WebInspector.WikiParser.TokenType.Text);}}}
var token=this._text;this._text="";return new WebInspector.WikiParser.Token(token,WebInspector.WikiParser.TokenType.Text);},clone:function()
{var tokenizer=new WebInspector.WikiParser.Tokenizer(this._text);tokenizer._token=this._token;tokenizer._text=this._text;tokenizer._oldText=this._oldText;tokenizer._mode=this._mode;return tokenizer;},hasMoreTokens:function()
{return!!this._text.length;}}
WebInspector.WikiParser.openingTable=/^\n{{{!}}/;WebInspector.WikiParser.closingTable=/^\n{{!}}}/;WebInspector.WikiParser.cellSeparator=/^\n{{!}}/;WebInspector.WikiParser.rowSeparator=/^\n{{!}}-/;WebInspector.WikiParser.nameSeparator=/^\n!/;WebInspector.WikiParser.exclamation=/^{{!}}/;WebInspector.WikiParser.openingCurlyBrackets=/^{{/;WebInspector.WikiParser.equalSign=/^=/;WebInspector.WikiParser.equalSignInCurlyBrackets=/^{{=}}/;WebInspector.WikiParser.closingCurlyBrackets=/^\s*}}/;WebInspector.WikiParser.oneOpeningSquareBracket=/^\n*\[/;WebInspector.WikiParser.twoOpeningSquareBrackets=/^\n*\[\[/;WebInspector.WikiParser.oneClosingBracket=/^\n*\]/;WebInspector.WikiParser.twoClosingBrackets=/^\n*\]\]/;WebInspector.WikiParser.tripleQuotes=/^\n*'''/;WebInspector.WikiParser.doubleQuotes=/^\n*''/;WebInspector.WikiParser.openingCodeTag=/^<code\s*>/;WebInspector.WikiParser.closingCodeTag=/^<\/code\s*>/;WebInspector.WikiParser.closingBullet=/^\*/;WebInspector.WikiParser.lineEnd=/^\n/;WebInspector.WikiParser.verticalLine=/^\n*\|/;WebInspector.WikiParser.newLineWithSpace=/^\n [^ ]/;WebInspector.WikiParser.newLineWithoutSpace=/\n[^ ]/;WebInspector.WikiParser.space=/^ /;WebInspector.WikiParser.TokenDescriptor=function(regex,type)
{this.regex=regex;this.type=type;}
WebInspector.WikiParser._tokenDescriptors=[new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.closingTable,WebInspector.WikiParser.TokenType.ClosingTable),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.openingTable,WebInspector.WikiParser.TokenType.OpeningTable),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.rowSeparator,WebInspector.WikiParser.TokenType.RowSeparator),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.cellSeparator,WebInspector.WikiParser.TokenType.CellSeparator),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.nameSeparator,WebInspector.WikiParser.TokenType.NameSeparator),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.exclamation,WebInspector.WikiParser.TokenType.Exclamation),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.equalSignInCurlyBrackets,WebInspector.WikiParser.TokenType.EqualSignInCurlyBrackets),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.equalSign,WebInspector.WikiParser.TokenType.EqualSign),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.openingTable,WebInspector.WikiParser.TokenType.OpeningTable),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.openingCurlyBrackets,WebInspector.WikiParser.TokenType.OpeningCurlyBrackets),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.verticalLine,WebInspector.WikiParser.TokenType.VerticalLine),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.closingCurlyBrackets,WebInspector.WikiParser.TokenType.ClosingCurlyBrackets),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.twoOpeningSquareBrackets,WebInspector.WikiParser.TokenType.OpeningSquareBrackets),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.twoClosingBrackets,WebInspector.WikiParser.TokenType.ClosingBrackets),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.oneOpeningSquareBracket,WebInspector.WikiParser.TokenType.OpeningSquareBrackets),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.oneClosingBracket,WebInspector.WikiParser.TokenType.ClosingBrackets),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.newLineWithSpace,WebInspector.WikiParser.TokenType.CodeBlock),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.tripleQuotes,WebInspector.WikiParser.TokenType.TripleQuotes),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.doubleQuotes,WebInspector.WikiParser.TokenType.DoubleQuotes),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.openingCodeTag,WebInspector.WikiParser.TokenType.OpeningCodeTag),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.closingCodeTag,WebInspector.WikiParser.TokenType.ClosingCodeTag),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.closingBullet,WebInspector.WikiParser.TokenType.Bullet),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.lineEnd,WebInspector.WikiParser.TokenType.LineEnd),new WebInspector.WikiParser.TokenDescriptor(WebInspector.WikiParser.space,WebInspector.WikiParser.TokenType.Space)]
WebInspector.WikiParser.prototype={document:function()
{return this._document;},_secondTokenType:function()
{var tokenizer=this._tokenizer.clone();if(!tokenizer.hasMoreTokens())
return null;tokenizer.nextToken();if(!tokenizer.hasMoreTokens())
return null;return tokenizer.nextToken().type();},_parse:function()
{var obj={};while(this._tokenizer.hasMoreTokens()){var section=this._parseSection();if(section.title)
obj[section.title]=section.singleValue||section.values;}
return obj;},_parseSection:function()
{var section=new WebInspector.WikiParser.Section();if(!this._tokenizer.hasMoreTokens()||this._tokenizer.nextToken().type()!==WebInspector.WikiParser.TokenType.OpeningCurlyBrackets)
return section;var title=this._deleteTrailingSpaces(this._parseSectionTitle());if(!title.length)
return section;section.title=title;if(this._tokenizer.peekToken().type()===WebInspector.WikiParser.TokenType.ClosingCurlyBrackets){this._tokenizer.nextToken();return section;}
var secondTokenType=this._secondTokenType();if(!secondTokenType||secondTokenType!==WebInspector.WikiParser.TokenType.EqualSign){section.singleValue=this._parseMarkupText();}else{section.values={};while(this._tokenizer.hasMoreTokens()){var field=this._parseField();section.values[field.name]=field.value;if(this._tokenizer.peekToken().type()===WebInspector.WikiParser.TokenType.ClosingCurlyBrackets){this._tokenizer.nextToken();return section;}}}
var token=this._tokenizer.nextToken();if(token.type()!==WebInspector.WikiParser.TokenType.ClosingCurlyBrackets)
throw new Error("Two closing curly brackets expected; found "+token.value());return section;},_parseField:function()
{var field=new WebInspector.WikiParser.Field();field.name=this._parseFieldName();var token=this._tokenizer.peekToken();switch(token.type()){case WebInspector.WikiParser.TokenType.OpeningCurlyBrackets:field.value=this._parseArray();break;case WebInspector.WikiParser.TokenType.LineEnd:this._tokenizer.nextToken();break;case WebInspector.WikiParser.TokenType.ClosingCurlyBrackets:return field;default:if(field.name.toUpperCase()==="CODE")
field.value=this._parseExampleCode();else
field.value=this._parseMarkupText();}
return field;},_parseArray:function()
{var array=[];while(this._tokenizer.peekToken().type()===WebInspector.WikiParser.TokenType.OpeningCurlyBrackets)
array.push(this._parseSection());if(this._tokenizer.peekToken().type()===WebInspector.WikiParser.TokenType.VerticalLine)
this._tokenizer.nextToken();return array;},_parseSectionTitle:function()
{var title="";while(this._tokenizer.hasMoreTokens()){var token=this._tokenizer.peekToken();switch(token.type()){case WebInspector.WikiParser.TokenType.ClosingCurlyBrackets:return title;case WebInspector.WikiParser.TokenType.VerticalLine:this._tokenizer.nextToken();return title;case WebInspector.WikiParser.TokenType.Text:title+=this._tokenizer.nextToken().value();break;default:throw new Error("Title could not be parsed. Unexpected token "+token.value());}}
return title;},_parseFieldName:function()
{var name="";while(this._tokenizer.hasMoreTokens()){var token=this._tokenizer.peekToken();switch(token.type()){case WebInspector.WikiParser.TokenType.ClosingCurlyBrackets:return name;case WebInspector.WikiParser.TokenType.EqualSign:this._tokenizer.nextToken();return name;case WebInspector.WikiParser.TokenType.VerticalLine:case WebInspector.WikiParser.TokenType.Text:name+=this._tokenizer.nextToken().value();break;default:throw new Error("Name could not be parsed. Unexpected token "+token.value());}}
return name;},_parseExampleCode:function()
{var code="";function wrapIntoArticleElement()
{var plainText=new WebInspector.WikiParser.PlainText(code);var block=new WebInspector.WikiParser.Block([plainText])
var articleElement=new WebInspector.WikiParser.Block([block]);return articleElement;}
while(this._tokenizer.hasMoreTokens()){var token=this._tokenizer.peekToken();switch(token.type()){case WebInspector.WikiParser.TokenType.ClosingCurlyBrackets:return wrapIntoArticleElement();case WebInspector.WikiParser.TokenType.VerticalLine:this._tokenizer.nextToken();return wrapIntoArticleElement();case WebInspector.WikiParser.TokenType.Exclamation:this._tokenizer.nextToken();code+="|";break;case WebInspector.WikiParser.TokenType.EqualSignInCurlyBrackets:this._tokenizer.nextToken();code+="=";break;default:this._tokenizer.nextToken();code+=token.value();}}
return wrapIntoArticleElement();},_parseMarkupText:function()
{var children=[];var blockChildren=[];var text="";function processSimpleText()
{var currentText=this._deleteTrailingSpaces(text);if(!currentText.length)
return;var simpleText=new WebInspector.WikiParser.PlainText(currentText);blockChildren.push(simpleText);text="";}
function processBlock()
{if(blockChildren.length){children.push(new WebInspector.WikiParser.Block(blockChildren));blockChildren=[];}}
while(this._tokenizer.hasMoreTokens()){var token=this._tokenizer.peekToken();switch(token.type()){case WebInspector.WikiParser.TokenType.RowSeparator:case WebInspector.WikiParser.TokenType.NameSeparator:case WebInspector.WikiParser.TokenType.CellSeparator:case WebInspector.WikiParser.TokenType.ClosingTable:case WebInspector.WikiParser.TokenType.VerticalLine:case WebInspector.WikiParser.TokenType.ClosingCurlyBrackets:if(token.type()===WebInspector.WikiParser.TokenType.VerticalLine)
this._tokenizer.nextToken();processSimpleText.call(this);processBlock();return new WebInspector.WikiParser.Block(children);case WebInspector.WikiParser.TokenType.TripleQuotes:this._tokenizer.nextToken();processSimpleText.call(this);blockChildren.push(this._parseHighlight());break;case WebInspector.WikiParser.TokenType.DoubleQuotes:this._tokenizer.nextToken();processSimpleText.call(this);blockChildren.push(this._parseItalics());break;case WebInspector.WikiParser.TokenType.OpeningSquareBrackets:processSimpleText.call(this);blockChildren.push(this._parseLink());break;case WebInspector.WikiParser.TokenType.OpeningCodeTag:this._tokenizer.nextToken();processSimpleText.call(this);blockChildren.push(this._parseCode());break;case WebInspector.WikiParser.TokenType.Bullet:this._tokenizer.nextToken();processSimpleText.call(this);processBlock();children.push(this._parseBullet());break;case WebInspector.WikiParser.TokenType.CodeBlock:this._tokenizer.nextToken();processSimpleText.call(this);processBlock();var code=new WebInspector.WikiParser.CodeBlock(this._trimLeadingNewLines(token.value()));children.push(code);break;case WebInspector.WikiParser.TokenType.LineEnd:this._tokenizer.nextToken();processSimpleText.call(this);processBlock();break;case WebInspector.WikiParser.TokenType.EqualSignInCurlyBrackets:this._tokenizer.nextToken();text+="=";break;case WebInspector.WikiParser.TokenType.Exclamation:this._tokenizer.nextToken();text+="|";break;case WebInspector.WikiParser.TokenType.OpeningTable:this._tokenizer.nextToken();processSimpleText.call(this);processBlock();children.push(this._parseTable());break;case WebInspector.WikiParser.TokenType.ClosingBrackets:case WebInspector.WikiParser.TokenType.Text:case WebInspector.WikiParser.TokenType.EqualSign:this._tokenizer.nextToken();text+=token.value();break;default:this._tokenizer.nextToken();return null;}}
processSimpleText.call(this);processBlock();return new WebInspector.WikiParser.Block(children);},_parseLink:function()
{var tokenizer=this._tokenizer.clone();this._tokenizer.nextToken();this._tokenizer._setMode(WebInspector.WikiParser.Tokenizer.Mode.Link);var url="";var children=[];function finalizeLink()
{this._tokenizer._setMode(WebInspector.WikiParser.Tokenizer.Mode.Normal);return new WebInspector.WikiParser.Link(url,children);}
function recoverAsText()
{this._tokenizer=tokenizer;return this._parseTextUntilBrackets();}
while(this._tokenizer.hasMoreTokens()){var token=this._tokenizer.nextToken();switch(token.type()){case WebInspector.WikiParser.TokenType.ClosingBrackets:if(this._isLink(url))
return finalizeLink.call(this);return recoverAsText.call(this);case WebInspector.WikiParser.TokenType.VerticalLine:case WebInspector.WikiParser.TokenType.Space:case WebInspector.WikiParser.TokenType.Exclamation:if(this._isLink(url)){children.push(this._parseLinkName());return finalizeLink.call(this);}
return recoverAsText.call(this);default:url+=token.value();}}
return finalizeLink.call(this);},_parseLinkName:function()
{var children=[];var text="";function processSimpleText()
{text=this._deleteTrailingSpaces(text);if(!text.length)
return;var simpleText=new WebInspector.WikiParser.PlainText(text);children.push(simpleText);text="";}
while(this._tokenizer.hasMoreTokens()){var token=this._tokenizer.nextToken();switch(token.type()){case WebInspector.WikiParser.TokenType.ClosingBrackets:processSimpleText.call(this);return new WebInspector.WikiParser.Inline(WebInspector.WikiParser.ArticleElement.Type.Inline,children);case WebInspector.WikiParser.TokenType.OpeningCodeTag:processSimpleText.call(this);children.push(this._parseCode());break;default:text+=token.value();break;}}
return new WebInspector.WikiParser.Inline(WebInspector.WikiParser.ArticleElement.Type.Inline,children);},_parseCode:function()
{var children=[];var text="";function processSimpleText()
{text=this._deleteTrailingSpaces(text);if(!text.length)
return;var simpleText=new WebInspector.WikiParser.PlainText(text);children.push(simpleText);text="";}
while(this._tokenizer.hasMoreTokens()){var token=this._tokenizer.peekToken();switch(token.type()){case WebInspector.WikiParser.TokenType.ClosingCodeTag:this._tokenizer.nextToken();processSimpleText.call(this);var code=new WebInspector.WikiParser.Inline(WebInspector.WikiParser.ArticleElement.Type.Code,children);return code;case WebInspector.WikiParser.TokenType.OpeningSquareBrackets:processSimpleText.call(this);children.push(this._parseLink());break;default:this._tokenizer.nextToken();text+=token.value();}}
text=this._deleteTrailingSpaces(text);if(text.length)
children.push(new WebInspector.WikiParser.PlainText(text));return new WebInspector.WikiParser.Inline(WebInspector.WikiParser.ArticleElement.Type.Code,children);},_parseBullet:function()
{var children=[];while(this._tokenizer.hasMoreTokens()){var token=this._tokenizer.peekToken()
switch(token.type()){case WebInspector.WikiParser.TokenType.OpeningSquareBrackets:children.push(this._parseLink());break;case WebInspector.WikiParser.TokenType.OpeningCodeTag:this._tokenizer.nextToken();children.push(this._parseCode());break;case WebInspector.WikiParser.TokenType.LineEnd:this._tokenizer.nextToken();return new WebInspector.WikiParser.Block(children,true);default:this._tokenizer.nextToken();var text=this._deleteTrailingSpaces(token.value());if(text.length){var simpleText=new WebInspector.WikiParser.PlainText(text);children.push(simpleText);text="";}}}
return new WebInspector.WikiParser.Block(children,true);},_parseHighlight:function()
{var text="";while(this._tokenizer.hasMoreTokens()){var token=this._tokenizer.nextToken();if(token.type()===WebInspector.WikiParser.TokenType.TripleQuotes){text=this._deleteTrailingSpaces(text);return new WebInspector.WikiParser.PlainText(text,true);}else{text+=token.value();}}
return new WebInspector.WikiParser.PlainText(text,true);},_parseItalics:function()
{var text="";while(this._tokenizer.hasMoreTokens){var token=this._tokenizer.nextToken();if(token.type()===WebInspector.WikiParser.TokenType.DoubleQuotes){text=this._deleteTrailingSpaces(text);return new WebInspector.WikiParser.PlainText(text,false,true);}else{text+=token.value();}}
return new WebInspector.WikiParser.PlainText(text,false,true);},_parseTextUntilBrackets:function()
{var text=this._tokenizer.nextToken().value();while(this._tokenizer.hasMoreTokens()){var token=this._tokenizer.peekToken();switch(token.type()){case WebInspector.WikiParser.TokenType.VerticalLine:this._tokenizer.nextToken();return new WebInspector.WikiParser.PlainText(text);case WebInspector.WikiParser.TokenType.ClosingCurlyBrackets:case WebInspector.WikiParser.TokenType.OpeningSquareBrackets:return new WebInspector.WikiParser.PlainText(text);default:this._tokenizer.nextToken();text+=token.value();}}
return new WebInspector.WikiParser.PlainText(text);},_parseTable:function()
{var columnNames=[];var rows=[];while(this._tokenizer.hasMoreTokens()&&this._tokenizer.peekToken().type()!==WebInspector.WikiParser.TokenType.RowSeparator)
this._tokenizer.nextToken();if(!this._tokenizer.hasMoreTokens())
throw new Error("Table could not be parsed");this._tokenizer.nextToken();while(this._tokenizer.peekToken().type()===WebInspector.WikiParser.TokenType.NameSeparator){this._tokenizer.nextToken();columnNames.push(this._parseMarkupText());}
while(this._tokenizer.peekToken().type()===WebInspector.WikiParser.TokenType.RowSeparator){this._tokenizer.nextToken();var row=[];while(this._tokenizer.peekToken().type()===WebInspector.WikiParser.TokenType.CellSeparator){this._tokenizer.nextToken();row.push(this._parseMarkupText());}
rows.push(row);}
var token=this._tokenizer.nextToken();if(token.type()!==WebInspector.WikiParser.TokenType.ClosingTable)
throw new Error("Table could not be parsed. {{!}}} expected; found "+token.value());for(var i=0;i<rows.length;++i){if(rows[i].length!==columnNames.length)
throw new Error(String.sprintf("Table could not be parsed. Row %d has %d cells; expected %d.",i,rows[i].length,columnNames[i].length));}
return new WebInspector.WikiParser.Table(columnNames,rows);},_deleteTrailingSpaces:function(str)
{return str.replace(/[\n\r]*$/gm,"");},_trimLeadingNewLines:function(str)
{return str.replace(/^\n*/,"");},_isInternalLink:function(str)
{var len=str.length;return/^[a-zA-Z\/-]+$/.test(str);},_isLink:function(str)
{if(this._isInternalLink(str))
return true;var url=new WebInspector.ParsedURL(str);return url.isValid;}}
WebInspector.WikiParser.ArticleElement=function(type)
{this._type=type;}
WebInspector.WikiParser.ArticleElement.prototype={type:function()
{return this._type;}}
WebInspector.WikiParser.ArticleElement.Type={PlainText:"PlainText",Link:"Link",Code:"Code",Block:"Block",CodeBlock:"CodeBlock",Inline:"Inline",Table:"Table"};WebInspector.WikiParser.Table=function(columnNames,rows)
{WebInspector.WikiParser.ArticleElement.call(this,WebInspector.WikiParser.ArticleElement.Type.Table);this._columnNames=columnNames;this._rows=rows;}
WebInspector.WikiParser.Table.prototype={columnNames:function()
{return this._columnNames;},rows:function()
{return this._rows;},__proto__:WebInspector.WikiParser.ArticleElement.prototype}
WebInspector.WikiParser.PlainText=function(text,highlight,italic)
{WebInspector.WikiParser.ArticleElement.call(this,WebInspector.WikiParser.ArticleElement.Type.PlainText);this._text=text.unescapeHTML();this._isHighlighted=highlight||false;this._isItalic=italic||false;}
WebInspector.WikiParser.PlainText.prototype={text:function()
{return this._text;},isHighlighted:function()
{return this._isHighlighted;},__proto__:WebInspector.WikiParser.ArticleElement.prototype}
WebInspector.WikiParser.Block=function(children,hasBullet)
{WebInspector.WikiParser.ArticleElement.call(this,WebInspector.WikiParser.ArticleElement.Type.Block);this._children=children;this._hasBullet=hasBullet||false;}
WebInspector.WikiParser.Block.prototype={children:function()
{return this._children;},hasChildren:function()
{return!!this._children&&!!this._children.length;},hasBullet:function()
{return this._hasBullet;},__proto__:WebInspector.WikiParser.ArticleElement.prototype}
WebInspector.WikiParser.CodeBlock=function(text)
{WebInspector.WikiParser.ArticleElement.call(this,WebInspector.WikiParser.ArticleElement.Type.CodeBlock);this._code=text.unescapeHTML();}
WebInspector.WikiParser.CodeBlock.prototype={code:function()
{return this._code;},__proto__:WebInspector.WikiParser.ArticleElement.prototype}
WebInspector.WikiParser.Inline=function(type,children)
{WebInspector.WikiParser.ArticleElement.call(this,type)
this._children=children;}
WebInspector.WikiParser.Inline.prototype={children:function()
{return this._children;},__proto__:WebInspector.WikiParser.ArticleElement.prototype}
WebInspector.WikiParser.Link=function(url,children)
{WebInspector.WikiParser.Inline.call(this,WebInspector.WikiParser.ArticleElement.Type.Link,children);this._url=url;}
WebInspector.WikiParser.Link.prototype={url:function()
{return this._url;},__proto__:WebInspector.WikiParser.Inline.prototype};WebInspector.JSArticle=function()
{this.pageTitle;this.standardizationStatus;this.summary;this.parameters=[];this.methods;this.remarks;this.examples=[];}
WebInspector.JSArticle.Parameter=function(name,dataType,optional,description)
{this.name=WebInspector.JSArticle.unfoldStringValue(name);this.dataType=WebInspector.JSArticle.unfoldStringValue(dataType);var textContent=WebInspector.JSArticle.unfoldStringValue(optional);this.optional=textContent?textContent.toUpperCase()==="YES":false;this.description=description;}
WebInspector.JSArticle.Example=function(language,code,liveUrl,description)
{this.language=WebInspector.JSArticle.unfoldStringValue(language);this.code=WebInspector.JSArticle.unfoldStringValue(code);this.liveUrl=WebInspector.JSArticle.unfoldStringValue(liveUrl);this.description=description;}
WebInspector.JSArticle.Method=function(returnValueName,returnValueDescription)
{this.returnValueName=WebInspector.JSArticle.unfoldStringValue(returnValueName);this.returnValueDescription=returnValueDescription;}
WebInspector.JSArticle.unfoldStringValue=function(block)
{if(block&&block.hasChildren()&&block.children()[0].hasChildren())
return block.children()[0].children()[0].text();return null;}
WebInspector.JSArticle.parse=function(wikiMarkupText)
{var wikiParser=new WebInspector.WikiParser(wikiMarkupText);var wikiDocument=wikiParser.document();var article=new WebInspector.JSArticle();article.pageTitle=wikiDocument["Page_Title"];if(typeof article.pageTitle!=="string")
delete article.pageTitle;article.standardizationStatus=wikiDocument["Standardization_Status"];if(article.standardizationStatus!=="string")
delete article.standardizationStatus;var apiObjectMethod=wikiDocument["API_Object_Method"];if(apiObjectMethod){var returnValueName=apiObjectMethod["Javascript_data_type"];var returnValue=apiObjectMethod["Return_value_description"];if(returnValueName&&returnValue)
article.methods=new WebInspector.JSArticle.Method(returnValueName,returnValue);}
article.remarks=wikiDocument["Remarks_Section"]?wikiDocument["Remarks_Section"]["Remarks"]:null;article.summary=wikiDocument["Summary_Section"];var examples=wikiDocument["Examples_Section"]&&wikiDocument["Examples_Section"]["Examples"]?wikiDocument["Examples_Section"]["Examples"]:[];if(!Array.isArray(examples)&&typeof examples!=="undefined")
examples=[examples];for(var i=0;i<examples.length;++i){if(!examples[i].values)
break;var language=examples[i].values["Language"];var code=examples[i].values["Code"];var liveUrl=examples[i].values["LiveURL"];var description=examples[i].values["Description"];article.examples.push(new WebInspector.JSArticle.Example(language,code,liveUrl,description));}
var parameters=apiObjectMethod?apiObjectMethod["Parameters"]:[];if(!Array.isArray(parameters)&&typeof parameters!=="undefined")
parameters=[parameters];for(var i=0;i<parameters.length;++i){if(!parameters[i].values)
break;var name=parameters[i].values["Name"];var dataType=parameters[i].values["Data type"];var optional=parameters[i].values["Optional"];var description=parameters[i].values["Description"];article.parameters.push(new WebInspector.JSArticle.Parameter(name,dataType,optional,description));}
return article;};WebInspector.DocumentationCatalog=function()
{this._articleList=new StringMap();this._loader=new WebInspector.DocumentationCatalog.Loader(this);}
WebInspector.DocumentationCatalog.instance=function()
{if(!WebInspector.DocumentationCatalog._instance)
WebInspector.DocumentationCatalog._instance=new WebInspector.DocumentationCatalog();return WebInspector.DocumentationCatalog._instance;}
WebInspector.DocumentationCatalog.ItemDescriptor=function(url,name,searchTerm)
{this._url=String.sprintf(WebInspector.DocumentationCatalog._articleURLFormat,url,searchTerm);this._name=name;this._searchItem=searchTerm;}
WebInspector.DocumentationCatalog.ItemDescriptor.prototype={url:function()
{return this._url;},name:function()
{return this._name;},searchItem:function()
{return this._searchItem;}}
WebInspector.DocumentationCatalog.apiURLPrefix="http://docs.webplatform.org/w/api.php?action=query";WebInspector.DocumentationCatalog._articleURLFormat=WebInspector.DocumentationCatalog.apiURLPrefix+"&titles=%s%s&prop=revisions&rvprop=timestamp|content&format=json";WebInspector.DocumentationCatalog._articleListURLFormat=WebInspector.DocumentationCatalog.apiURLPrefix+"&generator=allpages&gaplimit=500&gapfrom=%s&format=json";WebInspector.DocumentationCatalog.prototype={itemDescriptors:function(searchTerm)
{return this._articleList.get(searchTerm)||[];},constantDescriptors:function(sourceName)
{return[new WebInspector.DocumentationCatalog.ItemDescriptor("javascript/"+sourceName+"/",sourceName,"constants")]},startLoadingIfNeeded:function()
{if(this._loader._state===WebInspector.DocumentationCatalog.Loader.DownloadStates.NotStarted)
this._loader._loadArticleList();},isLoading:function()
{return this._loader._state===WebInspector.DocumentationCatalog.Loader.DownloadStates.InProgress;},_addDescriptorToList:function(itemPath)
{var correctedItemPath=itemPath.replace(" ","_");var tokens=correctedItemPath.split("/");if(tokens.length===1)
return;var propertyName=tokens.pop();var sourceName=tokens.length===1?"window":tokens.pop();if(!sourceName)
return;var descriptors=this._articleList.get(propertyName);if(!descriptors){descriptors=[];this._articleList.set(propertyName,descriptors);}
var sourcePath=tokens.join("/")+"/"+(sourceName==="window"?"":sourceName+"/");descriptors.push(new WebInspector.DocumentationCatalog.ItemDescriptor(sourcePath,sourceName,propertyName));},}
WebInspector.DocumentationCatalog.Loader=function(catalog)
{this._sectionIndex=0;this._section=WebInspector.DocumentationCatalog.Loader._sections[0];this._state=WebInspector.DocumentationCatalog.Loader.DownloadStates.NotStarted;this._catalog=catalog;}
WebInspector.DocumentationCatalog.Loader.DownloadStates={NotStarted:"NotStarted",InProgress:"InProgress",Finished:"Finished",Failed:"Failed"};WebInspector.DocumentationCatalog.Loader._sections=["dom/","javascript/"];WebInspector.DocumentationCatalog.Loader.prototype={_loadArticleList:function()
{if(this._state===WebInspector.DocumentationCatalog.Loader.DownloadStates.Finished)
return;this._state=WebInspector.DocumentationCatalog.Loader.DownloadStates.InProgress;var url=String.sprintf(WebInspector.DocumentationCatalog._articleListURLFormat,this._section);var boundReset=this._resetDownload.bind(this);loadXHR(url).then(this._processData.bind(this),boundReset).catch(boundReset);},_processData:function(responseText)
{if(!responseText){this._resetDownload.call(this);return;}
var json=JSON.parse(responseText);var pages=json["query"]["pages"];for(var article in pages)
this._catalog._addDescriptorToList(pages[article]["title"]);var sections=WebInspector.DocumentationCatalog.Loader._sections;this._section=json["query-continue"]["allpages"]["gapcontinue"];while(this._sectionIndex<sections.length&&this._section>sections[this._sectionIndex]&&!this._section.startsWith(sections[this._sectionIndex]))
++this._sectionIndex;if(this._sectionIndex===sections.length){this._state=WebInspector.DocumentationCatalog.Loader.DownloadStates.Finished;return;}
if(this._section<sections[this._sectionIndex])
this._section=sections[this._sectionIndex];this._loadArticleList();},_resetDownload:function()
{WebInspector.console.error("Documentation article list download failed");this._state=WebInspector.DocumentationCatalog.Loader.DownloadStates.Failed;}};WebInspector.DocumentationView=function()
{WebInspector.View.call(this);this.element.classList.add("documentation-view");this.registerRequiredCSS("documentationView.css");}
WebInspector.DocumentationView.showDocumentationURL=function(url,searchItem)
{if(!WebInspector.DocumentationView._view)
WebInspector.DocumentationView._view=new WebInspector.DocumentationView();var view=WebInspector.DocumentationView._view;view.element.removeChildren();WebInspector.inspectorView.showCloseableViewInDrawer("documentation",WebInspector.UIString("Documentation"),view);view.showDocumentation(url,searchItem);}
WebInspector.DocumentationView._languageToMimeType={"javascript":"text/javascript","html":"text/html"};WebInspector.DocumentationView.prototype={showDocumentation:function(url,searchItem)
{if(!url){this._createEmptyPage();return;}
loadXHR(url).then(this._createArticle.bind(this,searchItem),this._createEmptyPage.bind(this)).catch(this._createEmptyPage.bind(this));},_createArticle:function(searchItem,responseText)
{var json=JSON.parse(responseText);var pages=json["query"]["pages"];var wikiKeys=Object.keys(pages);if(wikiKeys.length===1&&wikiKeys[0]==="-1"){this._createEmptyPage();return;}
var wikiMarkupText=pages[wikiKeys[0]]["revisions"]["0"]["*"];var article;try{article=WebInspector.JSArticle.parse(wikiMarkupText);}catch(error){console.error("Article could not be parsed. "+error.message);}
if(!article){this._createEmptyPage();return;}
this.element.removeChildren();var renderer=new WebInspector.DocumentationView.Renderer(article,searchItem);this.element.appendChild(renderer.renderJSArticle());},_createEmptyPage:function()
{this.element.removeChildren();var emptyPage=this.element.createChild("div","documentation-empty-page fill");var pageTitle=emptyPage.createChild("div","documentation-not-found");pageTitle.textContent=WebInspector.UIString("No documentation found.");emptyPage.createChild("div","documentation-empty-page-align");},__proto__:WebInspector.View.prototype}
WebInspector.DocumentationView.Renderer=function(article,searchItem)
{this._searchItem=searchItem;this._element=document.createElement("div");this._article=article;}
WebInspector.DocumentationView.Renderer.prototype={renderJSArticle:function()
{this._element.appendChild(this._createPageTitle(this._article.pageTitle,this._searchItem));var signatureElement=this._createSignatureSection(this._article.parameters,this._article.methods);if(signatureElement)
this._element.appendChild(signatureElement);var descriptionElement=this._element.createChild("div","documentation-description");var summarySection=this._article.summary?this._renderBlock(this._article.summary):null;if(summarySection)
descriptionElement.appendChild(summarySection);var parametersSection=this._createParametersSection(this._article.parameters);if(parametersSection)
descriptionElement.appendChild(parametersSection);var examplesSection=this._createExamplesSection(this._article.examples);if(examplesSection){var examplesTitle=this._element.createChild("div","documentation-title");examplesTitle.textContent=WebInspector.UIString("Examples");descriptionElement=this._element.createChild("div","documentation-description");descriptionElement.appendChild(examplesSection);}
var remarksSection=this._article.remarks?this._renderBlock(this._article.remarks):null;if(remarksSection){var remarksTitle=this._element.createChild("div","documentation-title");remarksTitle.textContent=WebInspector.UIString("Remarks");descriptionElement=this._element.createChild("div","documentation-description");descriptionElement.appendChild(remarksSection);}
return this._element;},_createPageTitle:function(titleText,searchItem)
{var pageTitle=document.createElementWithClass("div","documentation-page-title");if(titleText)
pageTitle.textContent=titleText;else if(searchItem)
pageTitle.textContent=searchItem;return pageTitle;},_createSignatureSection:function(parameters,method)
{if(!parameters.length&&!method)
return null;var signature=document.createElementWithClass("div","documentation-method-signature monospace");if(method&&method.returnValueName){var returnTypeElement=signature.createChild("span","documentation-parameter-data-type-value");returnTypeElement.textContent=method.returnValueName;}
var methodName=signature.createChild("span","documentation-method-name");methodName.textContent=this._searchItem.split(".").peekLast()+"(";for(var i=0;i<parameters.length;++i){if(i>0)
signature.createTextChild(",")
var parameterType=signature.createChild("span","documentation-parameter-data-type-value");parameterType.textContent=parameters[i].dataType;var parameterName=signature.createChild("span","documentation-parameter-name");parameterName.textContent=parameters[i].name;}
signature.createTextChild(")");return signature;},_createParametersSection:function(parameters)
{if(!parameters.length)
return null;var table=document.createElementWithClass("table","documentation-table");var tableBody=table.createChild("tbody");var headerRow=tableBody.createChild("tr","documentation-table-row");var tableHeader=headerRow.createChild("th","documentation-table-header");tableHeader.textContent=WebInspector.UIString("Parameters");tableHeader.colSpan=3;for(var i=0;i<parameters.length;++i){var tableRow=tableBody.createChild("tr","documentation-table-row");var type=tableRow.createChild("td","documentation-table-cell");type.textContent=parameters[i].dataType;var name=tableRow.createChild("td","documentation-table-cell");name.textContent=parameters[i].optional?WebInspector.UIString("(optional)\n"):"";name.textContent+=parameters[i].name;var description=tableRow.createChild("td","documentation-table-cell");if(parameters[i].description)
description.appendChild(this._renderBlock((parameters[i].description)));}
return table;},_createExamplesSection:function(examples)
{if(!examples.length)
return;var section=document.createElementWithClass("div","documentation-section");for(var i=0;i<examples.length;++i){var example=section.createChild("div","documentation-example");var exampleDescription=example.createChild("div","documentation-example-description-section");if(examples[i].description){var description=this._renderBlock((examples[i].description));description.classList.add("documentation-text");exampleDescription.appendChild(description);}
var code=example.createChild("div","documentation-code source-code");code.textContent=examples[i].code;if(!examples[i].language)
continue;var syntaxHighlighter=new WebInspector.DOMSyntaxHighlighter(WebInspector.DocumentationView._languageToMimeType[examples[i].language.toLowerCase()],true);syntaxHighlighter.syntaxHighlightNode(code);}
return section;},_renderBlock:function(article)
{var element;var elementTypes=WebInspector.WikiParser.ArticleElement.Type;switch(article.type()){case elementTypes.Inline:element=document.createElement("span");break;case elementTypes.Link:element=document.createElementWithClass("a","documentation-link");element.href=article.url();if(!article.children().length)
element.textContent=article.url();break;case elementTypes.Code:element=document.createElementWithClass("span","documentation-code-tag");break;case elementTypes.CodeBlock:element=document.createElementWithClass("pre","documentation-code source-code");element.textContent=article.code();break;case elementTypes.PlainText:element=document.createElement("span");element.textContent=article.text();if(article.isHighlighted())
element.classList.add("documentation-highlighted-text");break;case elementTypes.Block:element=document.createElement(article.hasBullet()?"li":"div");if(!article.hasBullet())
element.classList.add("documentation-paragraph");break;case elementTypes.Table:return this._renderTable((article));default:throw new Error("Unknown ArticleElement type "+article.type());}
if(article.type()===WebInspector.WikiParser.ArticleElement.Type.Block||article.type()===WebInspector.WikiParser.ArticleElement.Type.Code||article.type()===WebInspector.WikiParser.ArticleElement.Type.Inline){for(var i=0;i<article.children().length;++i){var child=this._renderBlock(article.children()[i]);if(child)
element.appendChild(child);}}
return element;},_renderTable:function(table)
{var tableElement=document.createElementWithClass("table","documentation-table");var tableBody=tableElement.createChild("tbody");var headerRow=tableBody.createChild("tr","documentation-table-row");for(var i=0;i<table.columnNames().length;++i){var tableHeader=headerRow.createChild("th","documentation-table-header");tableHeader.appendChild(this._renderBlock(table.columnNames()[i]));}
for(var i=0;i<table.rows().length;++i){var tableRow=tableBody.createChild("tr","documentation-table-row");var row=table.rows()[i];for(var j=0;j<row.length;++j){var cell=tableRow.createChild("td","documentation-table-cell");cell.appendChild(this._renderBlock(row[j]));}}
return tableElement;}}
WebInspector.DocumentationView.ContextMenuProvider=function()
{}
WebInspector.DocumentationView.ContextMenuProvider.prototype={appendApplicableItems:function(event,contextMenu,target)
{if(!(target instanceof WebInspector.CodeMirrorTextEditor))
return;WebInspector.DocumentationCatalog.instance().startLoadingIfNeeded();if(WebInspector.DocumentationCatalog.instance().isLoading()){var itemName=WebInspector.useLowerCaseMenuTitles()?"Loading documentation...":"Loading Documentation...";contextMenu.appendItem(itemName,function(){},true);return;}
var textEditor=(target);var descriptors=this._determineDescriptors(textEditor);if(!descriptors.length)
return;if(descriptors.length===1){var formatString=WebInspector.useLowerCaseMenuTitles()?"Show documentation for %s.%s":"Show Documentation for %s.%s";var methodName=String.sprintf("%s.%s",descriptors[0].name(),descriptors[0].searchItem());contextMenu.appendItem(WebInspector.UIString(formatString,descriptors[0].name(),descriptors[0].searchItem()),WebInspector.DocumentationView.showDocumentationURL.bind(null,descriptors[0].url(),methodName));return;}
var subMenuItem=contextMenu.appendSubMenuItem(WebInspector.UIString(WebInspector.useLowerCaseMenuTitles()?"Show documentation for...":"Show Documentation for..."));for(var i=0;i<descriptors.length;++i){var methodName=String.sprintf("%s.%s",descriptors[i].name(),descriptors[i].searchItem());subMenuItem.appendItem(methodName,WebInspector.DocumentationView.showDocumentationURL.bind(null,descriptors[i].url(),methodName));}},_determineDescriptors:function(textEditor)
{var catalog=WebInspector.DocumentationCatalog.instance();var textSelection=textEditor.selection().normalize();var previousTokenText=findPreviousToken(textSelection);if(!textSelection.isEmpty()){if(textSelection.startLine!==textSelection.endLine)
return[];return computeDescriptors(textSelection);}
var descriptors=computeDescriptors(getTokenRangeByColumn(textSelection.startColumn));if(descriptors.length)
return descriptors;return computeDescriptors(getTokenRangeByColumn(textSelection.startColumn-1));function getTokenRangeByColumn(column)
{var token=textEditor.tokenAtTextPosition(textSelection.startLine,column);if(!token)
return null;return new WebInspector.TextRange(textSelection.startLine,token.startColumn,textSelection.startLine,token.endColumn);}
function computeDescriptors(textRange)
{if(!textRange)
return[];var propertyName=textEditor.copyRange(textRange);var descriptors=catalog.itemDescriptors(propertyName);if(descriptors.length)
return descriptors;if(propertyName.toUpperCase()!==propertyName||!previousTokenText||!window[previousTokenText]||!window[previousTokenText][propertyName])
return[];return catalog.constantDescriptors(previousTokenText);}
function findPreviousToken(textRange)
{var line=textEditor.line(textRange.startLine);if(textRange.startColumn<3||line[textRange.startColumn-1]!==".")
return null;var token=textEditor.tokenAtTextPosition(textRange.startLine,textRange.startColumn-2);return token?line.substring(token.startColumn,token.endColumn):null;}}};