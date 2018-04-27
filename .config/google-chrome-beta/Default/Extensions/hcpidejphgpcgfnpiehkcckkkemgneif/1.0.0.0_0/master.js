var lsUiStyle="uiStyle",lsConfirmDeleteCookies="confirmDeleteCookies",lsConfirmRestoreStoredCookies="confirmRestoreStoredCookies",lsRestoreFixExpiration="restoreFixExpiration",lsConfirmDeleteStoredCookies="confirmDeleteStoredCookies",lsFilterDomain="filterDomain",lsFilterName="filterName",lsFilterValue="filterValue",lsRememberFilterCloseTab="rememberFilter",lsPopupHeight="popupHeight",lsPopupWidth="popupWidth",confirmDeleteCookies,confirmRestoreStoredCookies,restoreFixExpiration,confirmDeleteStoredCookies,
filterDomain,filterName,filterValue,rememberFilter,popupHeight,popupWidth,uiStyle=void 0!=localStorage[lsUiStyle]?localStorage[lsUiStyle]:"start";$("#styleLink").attr("href","http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.12/themes/"+uiStyle+"/jquery-ui.css");var hostPage,allCookies,cookieCheckBoxPrefix="cookieCheckBox-",cookieRowPrefix="cookieRow-",lsSavedCookies="savedCookies",lsMaxSavedCookies="maxSavedCookies",maxSavedCookies;
$(document).ready(function(){aQ();hostPage=window.location.pathname.replace(/^.*\/([^\/]*)/,"$1").replace(/\.html/,"");"popup"==hostPage?(a2(),$("input:button").button(),bm(),$("#filterDomainInput").focus(),aN(),loadCookies(),$("#newExpirationDatePicker").datepicker({changeMonth:!0,changeYear:!0,showOtherMonths:!0,selectOtherMonths:!0,numberOfMonths:2,showButtonPanel:!0}),bd()):"options"==hostPage&&(a8(),$("#saveButton").click(function(){bt();
return!1}),$("#closeButton").click(function(){bv();return!1}))});function a2(){aW("#newExpirationHours",24);aW("#newExpirationMinutes",60);aW("#newExpirationSeconds",60)}function aW(a,b){for(var c=0;c<b;c++){var d=c;10>c&&(d="0"+c);$(a).append("'<option value='"+c+"'>"+d+"</option>")}}
function bd(){$("#previousThemeAnchor").click(function(){bA(-1);return!1});$("#nextThemeAnchor").click(function(){bA(1);return!1});$("#styleSelect").change(function(){aO()});$("#loadCookiesAnchor").click(function(){loadCookies();return!1});$("#clearFiltersAnchor").click(function(){bj();return!1});$("#selectAllButton").click(function(){bz()});$(document).on("click","#selectAllCookiesAnchor",function(){bz();$("#saveCookiesErrorSpan").html("");
return!1});$("#selectNoneButton").click(function(){by()});$("#saveOrRestoreButton").click(function(){bg()});$("#deleteButton").click(function(){ao()});$("#saveSelectedCookiesAnchor").click(function(){aK();return!1});$("#editCookieValueAnchor").click(function(){aX();return!1});$("#filterDomainInput").attr("autofocus","autofocus");$(document).on("click",".cookieDetailsAnchor",function(){var a=$(this).attr("cookieId");aV(a);
return!1});$(document).on("click",".restoreSavedCookiesAnchor",function(){var a=$(this).attr("cookieName");aq(a);return!1});$(document).on("click",".delete_session_anchor",function(){var a=$(this).attr("cookieName"),b=$(this).attr("cookieTitle");aw(a,b);return!1})}
function aN(){$("#filterDomainInput").keydown(function(a){13!=a.which&&loadCookies()});$("#filterNameInput").keydown(function(a){13!=a.which&&loadCookies()});$("#filterValueInput").keydown(function(a){13!=a.which&&loadCookies()})}function bj(){$("#filterDomainInput,#filterNameInput,#filterValueInput").val("");loadCookies()}
function loadCookies(){chrome.cookies.getAll({},function(a){a=bf(a);$("#cookieCountSpan").html(bB(a.length));a.sort(sortDomain);allCookies=a;var b="<table id='tab2'><tr id='row1'><td id='col1b'><b>Domain</b></td><td id='col2b'><b>Name</b></td><td align='right' id='col3b'><b>Expiration</b></td><td></td></tr>";if(0==a.length)b+="<tr><td colspan='5'>no cookies returned!</td></tr>";else for(var c=0,d;d=a[c];c++)b+="<tr id='"+cookieRowPrefix+c+"'><td><input type='checkbox' id='"+cookieCheckBoxPrefix+
c+"' />"+aT(d.domain,35)+"</td><td><a class='cookieDetailsAnchor' cookieId='"+c+"' href=''>"+aT(d.name,30)+"</a></td><td name='date' align='right'>"+aE(d.expirationDate)+"</td><td name='time' align='right'>"+aF(d.expirationDate)+"</td></tr>";$("#listDiv").html(b+"</table>");a=parseInt($("#col1b").width(),10);b=parseInt($("#col2b").width(),10);c=parseInt($("#col3b").width(),10);$("#col1a").attr("width",a);$("#col2a").attr("width",b);
$("#col3a").attr("width",c);$("#row1").hide()})}function bf(a){var b=[],c,d,f;a1($("#filterDomainInput").val());ba($("#filterNameInput").val());a5($("#filterValueInput").val());0<filterDomain.length&&(c=RegExp(filterDomain,"i"));0<filterName.length&&(d=RegExp(filterName,"i"));0<filterValue.length&&(f=RegExp(filterValue,"i"));for(var e=0,g;g=a[e];e++)bp(g,c,d,f)&&b.push(g);return b}
function bp(a,b,c,d){return void 0==b&&void 0==c&&void 0==d?!0:void 0!=b&&-1==a.domain.search(b)||void 0!=c&&-1==a.name.search(c)||void 0!=d&&-1==a.value.search(d)?!1:!0}function aT(a,b){return a.length<b?a:a.substring(0,b)+"..."}
function ay(a){if(void 0==a)return"session";var b=new Date(1E3*a),a=b.getDate(),c=b.getMonth()+1,d=b.getFullYear(),f=b.getHours(),e=b.getMinutes(),b=b.getSeconds();10>e&&(e="0"+e);10>b&&(b="0"+b);return c+"/"+a+"/"+d+" "+f+":"+e+":"+b}function aE(a){if(void 0==a)return"session";var b=new Date(1E3*a),a=b.getDate(),c=b.getMonth()+1,b=b.getFullYear();return c+"/"+a+"/"+b}
function aF(a){if(void 0==a)return"";var b=new Date(1E3*a),a=b.getHours(),c=b.getMinutes(),b=b.getSeconds();10>c&&(c="0"+c);10>b&&(b="0"+b);return a+":"+c+":"+b}function sortDomain(a,b){var c=bx(a.domain).toLowerCase(),d=bx(b.domain).toLowerCase();if(c<d)return-1;if(c>d)return 1;c=a.domain.toLowerCase();d=b.domain.toLowerCase();if(c<d)return-1;if(c>d)return 1;c=a.name.toLowerCase();d=b.name.toLowerCase();return c<d?-1:c>d?1:0}
function bx(a){var b=a.split(".");return 2>=b.length?a:b[b.length-2]+"."+b[b.length-1]}function sortIntDescending(a,b){var c=-1*parseInt(a,10),d=-1*parseInt(b,10);return c<d?-1:c>d?1:0}
function aV(a){a=parseInt(a,10);a>=allCookies.length?a=0:0>a&&(a=allCookies.length-1);var b=allCookies[a];$("#currentCookieId").attr("cookieId",a);$("#detailsDomainSpan").html(b.domain);$("#detailsNameSpan").html(b.name);$("#detailsValueDiv").html(b.value);$("#detailsHostOnlySpan").html(b.hostOnly?"true":"false");$("#detailsPathSpan").html(b.path);$("#detailsSecureSpan").html(b.secure?"true":"false");$("#detailsHttpOnlySpan").html(b.httpOnly?"true":"false");$("#detailsSessionSpan").html(b.session?
"true":"false");$("#detailsExpirationDateSpan").html(ay(b.expirationDate));$("#detailsStoreIdSpan").html(b.storeId);$("#cookieDetailsDiv").dialog("destroy").dialog({autoOpen:!1,width:725,modal:!0,buttons:{Previous:function(){aV(a-1)},Next:function(){aV(a+1)},Edit:function(){aX()},Close:function(){$(this).dialog("close")}}});$("#cookieDetailsDiv").dialog("option","title","Cookie Details");$("#cookieDetailsDiv").dialog("open")}
function aX(){var a=parseInt($("#currentCookieId").attr("cookieId"),10);a>=allCookies.length?a=0:0>a&&(a=allCookies.length-1);a=allCookies[a];$("#editDomainSpan").html(a.domain);$("#editNameSpan").html(a.name);$("#editValueCurrentDiv").html(a.value);$("#editValueNewTextArea").val(a.value);var b=$("#editValueNewTextArea").attr("cols");$("#editValueNewTextArea").attr("rows",a.value.length/b+2);$("#editExpirationDateSpan").html(ay(a.expirationDate));a=new Date(ay(a.expirationDate));
$("#newExpirationDatePicker").datepicker("setDate",a);$("#newExpirationHours").val(a.getHours());$("#newExpirationMinutes").val(a.getMinutes());$("#newExpirationSeconds").val(a.getSeconds());$("#editCookieDiv").dialog("destroy").dialog({autoOpen:!1,width:725,modal:!0,buttons:{Save:function(){a3()},Cancel:function(){$(this).dialog("close")}}});$("#editCookieDiv").dialog("option","title","Edit Cookie Value");$("#editCookieDiv").dialog("open")}
function a3(){var a=parseInt($("#currentCookieId").attr("cookieId"),10),b=$("#editValueCurrentDiv").html(),c=String($("#editValueNewTextArea").val()),c=$.trim(c),d=new Date($("#editExpirationDateSpan").html()),f=aH();if(b!=c||d!=f){var e=allCookies[a],b="http"+(e.secure?"s":"")+"://"+e.domain+e.path,g=f.getTime()/1E3;chrome.cookies.set({url:b,name:e.name,value:c,path:e.path,secure:e.secure,httpOnly:e.httpOnly,expirationDate:g,storeId:e.storeId},function(){e.value=c;
e.expirationDate=g;$("#detailsValueDiv").html(e.value);$("#detailsExpirationDateSpan").html(ay(e.expirationDate));$("#cookieDetailsDiv").dialog("option","maxHeight",600);$("#editCookieDiv").dialog("close");d!=f&&($("#cookieRow-"+a+' > td[name="date"]').html(aE(e.expirationDate)),$("#cookieRow-"+a+' > td[name="time"]').html(aF(e.expirationDate)))})}else $("#editCookieDiv").dialog("close")}
function bz(){$('input[id^="'+cookieCheckBoxPrefix+'"]').attr("checked",!0)}function by(){$('input[id^="'+cookieCheckBoxPrefix+'"]').attr("checked",!1)}
function ao(){if(confirmDeleteCookies){for(var a=0,b=0;allCookies[b];b++)$("#"+cookieCheckBoxPrefix+b).attr("checked")&&a++;bq("Delete Cookies","Are you sure you want to delete the selected cookies?<br/><br/>Selected cookies count: "+a,deleteSelectedCookies,null,null)}else deleteSelectedCookies(!0)}
function deleteSelectedCookies(a){if(a){for(var a=[],b=0,c;c=allCookies[b];b++)$("#"+cookieCheckBoxPrefix+b).attr("checked")&&(a.push(b),bk(b,c));a.sort(sortIntDescending);for(b=0;b<a.length;b++)c=a[b],allCookies.splice(c,1),$("#"+cookieRowPrefix+c).hide();$("#cookieCountSpan").html(bB(allCookies.length))}}function bk(a,b){chrome.cookies.remove({url:"http"+(b.secure?"s":"")+"://"+b.domain+b.path,name:b.name,storeId:b.storeId},function(){})}
function bA(a){a=parseInt($("#styleSelect option:selected").attr("id"),10)+a;23<a&&(a=0);0>a&&(a=23);uiStyle=$("#styleSelect option[id="+a+"]").val();$("#styleSelect").val(String(uiStyle));$("#styleLink").attr("href","http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.12/themes/"+uiStyle+"/jquery-ui.css");localStorage[lsUiStyle]=uiStyle}
function aO(){uiStyle=$("#styleSelect").val();$("#styleLink").attr("href","http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.12/themes/"+uiStyle+"/jquery-ui.css");localStorage[lsUiStyle]=uiStyle}
function bg(){var a="",b=$("#filterDomainInput").val(),c=$("#filterNameInput").val(),d=$("#filterValueInput").val();0<b.length&&(a+="Domain: ["+b+"]");0<c.length&&(0<a.length&&(a+=" "),a+="Name: ["+c+"]");0<d.length&&(0<a.length&&(a+=" "),a+="Value: ["+d+"]");0==a.length&&(a="All Selected Cookies");$("#savedCookiesTitle").val(a);$("#savedCookiesTitle").css("width",370);$("#savedCookiesContainerDiv").attr("style","height:"+(popupHeight-100)+"px; overflow:auto;");$("#saveCookiesErrorSpan").html("");
aL();$("#saveCookiesDialogDiv").dialog("destroy").dialog({autoOpen:!1,width:460,modal:!0,buttons:{Close:function(){$(this).dialog("close")}}});$("#saveCookiesDialogDiv").dialog("option","title","Save/Restore Cookies");$("#saveCookiesDialogDiv").dialog("open")}function aI(){maxSavedCookies=localStorage[lsMaxSavedCookies];void 0==maxSavedCookies?aJ(-1):maxSavedCookies=parseInt(maxSavedCookies,10)}
function aJ(a){maxSavedCookies=a;localStorage[lsMaxSavedCookies]=maxSavedCookies}function aG(){aI();for(var a=0;a<=maxSavedCookies;a++)if(void 0==localStorage[aY(a)])return aY(a);aJ(maxSavedCookies+1);return aY(maxSavedCookies)}function aY(a){return lsSavedCookies+"-"+a}
function sortSavedCookies(a,b){var c=a.title.toLowerCase(),d=b.title.toLowerCase();return c<d?-1:c>d?1:0}
function aK(){$("#saveCookiesErrorSpan").html("");var a=$("#savedCookiesTitle").val();if(""==a.length)$("#saveCookiesErrorSpan").html("Title is required.");else{for(var b=[],c=0,d;d=allCookies[c];c++)$("#"+cookieCheckBoxPrefix+c).attr("checked")&&b.push(d);0==b.length?$("#saveCookiesErrorSpan").html('Could not save. No cookies have been selected (checked) for saving.&nbsp;&nbsp;&nbsp;<a href="" id="selectAllCookiesAnchor">select all</a>'):(a={title:a,saved:String(new Date),cookies:b},
b=aG(),localStorage[b]=JSON.stringify(a),aL())}}
function aL(){$("#savedCookiesDiv").html("");var a="<table><tr><td></td><td><b>Title</b></td><td><b>Saved</b></td><td><b>Cookies</b></td><td><b>Delete</b></td></tr>";aI();for(var b=[],c=0;c<=maxSavedCookies;c++)if(void 0!=localStorage[aY(c)]){var d=JSON.parse(localStorage[aY(c)]);b.push({name:aY(c),title:d.title,saved:d.saved,cookieCount:d.cookies.length})}b.sort(sortSavedCookies);for(c=0;d=b[c];c++)var f=1==d.cookieCount?
"application.png":2==d.cookieCount?"application_double.png":"application_cascade.png",a=a+"<tr>",a=a+("<td><a class='restoreSavedCookiesAnchor' cookieName='"+d.name+"' href='' title='Restore Saved Cookies'><img src='"+f+"' class='move-icon-down'></a></td>"),a=a+("<td><a class='restoreSavedCookiesAnchor' cookieName='"+d.name+"' href='' title='Restore Saved Cookies'>"+d.title+"</a></td>"),a=a+("<td>"+String(d.saved).replace(/ GMT.+/,"")+"</td>"),a=a+("<td align='center'>"+bB(d.cookieCount)+"</td>"),
f=d.title.replace(/'/g,"'").replace(/"/g,""),a=a+("<td align='center'><a class='delete_session_anchor' cookieName='"+d.name+"' cookieTitle='"+f+"' title='Delete Saved Cookies'><img class='delete-session-img move-icon-down' src='tab_close_2.png' class='move-icon-down'></a></td>"),a=a+"</tr>";a+="</table>";0==b.length&&(a="<br/><br/>&nbsp;&nbsp;&nbsp;<i>No saved cookies were found.</i>");$("#savedCookiesDiv").append(a);$(".delete_session_anchor").hover(function(){$(this).children(".delete-session-img").attr("src",
"tab_close_2_hover.png")},function(){$(this).children(".delete-session-img").attr("src","tab_close_2.png")})}function aw(a,b){confirmDeleteStoredCookies?bq("Delete Saved Cookies","Are you sure you want to delete these Saved Cookies?<br/><br/>"+b,deleteSavedCookies,a,null):deleteSavedCookies(!0,a)}function deleteSavedCookies(a,b){a&&(localStorage.removeItem(b),aL())}
function bB(a){for(var b=(a+"").split("."),a=b[0],b=1<b.length?"."+b[1]:"",c=/(\d+)(\d{3})/;c.test(a);)a=a.replace(c,"$1,$2");return a+b}function bq(a,b,c,d,f){$("#confirmSpan").html("<br/>"+b);$("#confirmDiv").dialog("destroy").dialog({autoOpen:!1,width:460,modal:!0,buttons:{Yes:function(){c(!0,d,f);$(this).dialog("close")},No:function(){c(!1,d,f);$(this).dialog("close")}}});$("#confirmDiv").dialog("option","title",a);$("#confirmDiv").dialog("open")}
function aq(a){if(confirmRestoreStoredCookies){var b=JSON.parse(localStorage[a]);bq("Restore Saved Cookies","Are you sure you want to restore these Saved Cookies?<br/><br/>"+b.title,restoreSavedCookies,a,null)}else restoreSavedCookies(!0,a)}function restoreSavedCookies(a,b){a&&chrome.extension.getBackgroundPage().ak(b,loadCookies)}
function ak(a,b){var c=JSON.parse(localStorage[a]);if(void 0==c||void 0==c.cookies)$("#saveCookiesErrorSpan").html("Error restoring saved cookies.");else{for(var d=0,f;f=c.cookies[d];d++)bh(f);void 0!=b&&b()}}
function bh(a){var b="http"+(a.secure?"s":"")+"://"+a.domain+a.path,c=a.expirationDate;restoreFixExpiration&&void 0!=c&&new Date(1E3*c)<new Date&&(c+=31556926);chrome.cookies.set({url:b,name:a.name,value:a.value,path:a.path,secure:a.secure,httpOnly:a.httpOnly,expirationDate:c,storeId:a.storeId})}
function aH(){var a=new Date($("#newExpirationDatePicker").datepicker("getDate")),b=parseInt($("#newExpirationHours").val(),10),c=parseInt($("#newExpirationMinutes").val(),10),d=parseInt($("#newExpirationSeconds").val(),10);a.setHours(b);a.setMinutes(c);a.setSeconds(d);return a}
function aQ(){az();aa();aB();af();a0();a9();a4();aR();a6();bb()}
function bm(){$("#styleSelect").val(uiStyle);rememberFilter&&(void 0!=filterDomain&&null!=filterDomain&&""!=filterDomain&&0<filterDomain.length&&"undefined"!=filterDomain)&&$("#filterDomainInput").val(filterDomain);rememberFilter&&(void 0!=filterName&&null!=filterName&&""!=filterName&&0<filterName.length&&"undefined"!=filterName)&&$("#filterNameInput").val(filterName);rememberFilter&&(void 0!=filterValue&&null!=filterValue&&""!=filterValue&&0<filterValue.length&&"undefined"!=filterValue)&&
$("#filterValueInput").val(filterValue);var a="height:"+popupHeight+"px; overflow:auto;";$("#cookiesDiv").attr("style",a);a="height:"+(popupHeight-100)+"px; overflow:auto;";$("#detailsDialogueContainer").attr("style",a);$("#editDialogueContainer").attr("style",a);$("body").css("min-width",popupWidth);700==popupWidth?$("#filterDomainInput,#filterNameInput,#filterValueInput").css("width","120px"):750==popupWidth&&$("#filterDomainInput,#filterNameInput,#filterValueInput").css("width","140px")}
function a8(){$("input:button").button();$("#confirmDeleteCookiesCheckBox").attr("checked",confirmDeleteCookies);$("#confirmRestoreStoredCookiesCheckBox").attr("checked",confirmRestoreStoredCookies);$("#restoreFixExpirationCheckBox").attr("checked",restoreFixExpiration);$("#confirmDeleteStoredCookiesCheckBox").attr("checked",confirmDeleteStoredCookies);$("#rememberFilterCheckBox").attr("checked",rememberFilter);$("#heightSelect").val(popupHeight);$("#widthSelect").val(popupWidth);bC()}
function az(){confirmDeleteCookies=localStorage[lsConfirmDeleteCookies];void 0==confirmDeleteCookies?aA(!0):confirmDeleteCookies=/^true$/i.test(confirmDeleteCookies)}function aA(a){confirmDeleteCookies=a;localStorage[lsConfirmDeleteCookies]=confirmDeleteCookies}
function aa(){confirmRestoreStoredCookies=localStorage[lsConfirmRestoreStoredCookies];void 0==confirmRestoreStoredCookies?ae(!0):confirmRestoreStoredCookies=/^true$/i.test(confirmRestoreStoredCookies)}function ae(a){confirmRestoreStoredCookies=a;localStorage[lsConfirmRestoreStoredCookies]=confirmRestoreStoredCookies}
function aB(){restoreFixExpiration=localStorage[lsRestoreFixExpiration];void 0==restoreFixExpiration?aC(!0):restoreFixExpiration=/^true$/i.test(restoreFixExpiration)}function aC(a){restoreFixExpiration=a;localStorage[lsRestoreFixExpiration]=restoreFixExpiration}
function af(){confirmDeleteStoredCookies=localStorage[lsConfirmDeleteStoredCookies];void 0==confirmDeleteStoredCookies?ah(!0):confirmDeleteStoredCookies=/^true$/i.test(confirmDeleteStoredCookies)}function ah(a){confirmDeleteStoredCookies=a;localStorage[lsConfirmDeleteStoredCookies]=confirmDeleteStoredCookies}
function a0(){filterDomain=localStorage[lsFilterDomain];void 0==filterDomain&&a1("")}function a1(a){filterDomain=a;localStorage[lsFilterDomain]=filterDomain}function a9(){filterName=localStorage[lsFilterName];void 0==filterName&&ba("")}function ba(a){filterName=a;localStorage[lsFilterName]=filterName}function a4(){filterValue=localStorage[lsFilterValue];void 0==filterValue&&a5("")}
function a5(a){filterValue=a;localStorage[lsFilterValue]=filterValue}function aR(){rememberFilter=localStorage[lsRememberFilterCloseTab];void 0==rememberFilter?aS(!0):rememberFilter=/^true$/i.test(rememberFilter)}function aS(a){rememberFilter=a;localStorage[lsRememberFilterCloseTab]=rememberFilter}
function a6(){popupHeight=localStorage[lsPopupHeight];void 0==popupHeight?a7(450):popupHeight=parseInt(popupHeight,10)}function a7(a){popupHeight=a;localStorage[lsPopupHeight]=popupHeight}function bb(){popupWidth=localStorage[lsPopupWidth];void 0==popupWidth?bc(750):popupWidth=parseInt(popupWidth,10)}function bc(a){popupWidth=a;localStorage[lsPopupWidth]=popupWidth}
function bC(){uiStyle=localStorage[lsUiStyle];void 0==uiStyle&&(uiStyle="start");$("#styleLink").attr("href","http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.12/themes/"+uiStyle+"/jquery-ui.css")}
function bt(){aA($("#confirmDeleteCookiesCheckBox").attr("checked"));ae($("#confirmRestoreStoredCookiesCheckBox").attr("checked"));aC($("#restoreFixExpirationCheckBox").attr("checked"));ah($("#confirmDeleteStoredCookiesCheckBox").attr("checked"));aS($("#rememberFilterCheckBox").attr("checked"));a7($("#heightSelect").val());bc($("#widthSelect").val());
$("#statusSpan").html("Saved!");setTimeout(function(){$("#statusSpan").html("")},1E3)}function bv(){window.close()};
