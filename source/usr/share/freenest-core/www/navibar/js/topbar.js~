/**
 @author Riku Hokkanen
 
*/
 function loggedIn() {
        var user =  $.ajax({
            type: "POST",
            url: topbarLocation + 'php/authedUser.php',
            data: "logged_in= 1",
            async: false

        }).responseText;
	if(user== false)
	{
		window.location='http://' + document.domain;
	}

    }


var topbarLocation = 'https://' + document.domain + '/navibar/';
loggedIn();
var $j = jQuery.noConflict();

importJs(topbarLocation + 'js/jqueryUI/js/jquery-ui-1.8.13.custom.min.js');
importJs(topbarLocation + 'js/jquery.simplemodal.1.4.1.min');
importJs(topbarLocation + 'js/wikiwordlinks.js');
importJs(topbarLocation + 'js/topbarShout.js');

$j(function () {

    // get config after init is done
    $j.when(topbar.init()).done(topbar.getConf);
    
});

/**@namespace Topbar */
var topbar = function () {

    var originalButtonHeight = null;
    var originalButtonPosition = null;
    var tabRaiseHeight = '5';
    var tabs = null;
    var homeButtonToMainPage = false;
    var styleSheetLocation = topbarLocation + 'style/style.css';
    var tabMoveSpeed = 100;
    var config = null;
    
    return {
        'init' : init,        
        'getConf' : getConf,
        'setTabRaiseHeight' : setTabRaiseHeight
    };

    function setConfig(newConfig)
    {
        config = newConfig
    }

    function init() {

        $j('head').append('<link rel="stylesheet" href="' + styleSheetLocation + '" type="text/css" />');
        var def = $j.Deferred();
        $j.ajax({
            url: topbarLocation + 'php/topbar.php',
            data: 'cmd=buildTopbar',
            type:'POST',
            success: function(ret) {
                afterTopbarLoad(ret);
                def.resolve();
            }            
        });
        return def.promise();
    }

    function getConf() {
        var def = $j.Deferred();
        $j.ajax({
            type: 'POST',
            url: topbarLocation + 'php/topbar.php',
            data: 'cmd=getConf',
            success: function(confData) {
                setConfig($j.parseJSON(confData));
                def.resolve();
                addTopbarFunctions();
            }
        });
        return def.promise();
    }

    //Stuff to do after topbar structure has been loaded
    function afterTopbarLoad(menus) {
        var topbar = ($j('#topbar').length > 0) ? $j('#topbar') : $j('#topBar'); //as topbar is referred to as both topbar and topBar..
        
        //topbar.replaceWith(menus);
        topbar.append($j(menus).children());
        
        
        //create WikiWord - links
        WikiWordLinks.createLinks();
        
        patchWork(getLoggedUser());
        
        $j('#bottomColour').append(
            '<div id="logins">'+
			'<span>' + getLoggedUser() + '</span>' +
            '<div id="logoutBtn" title = "Log off" ></div>'+
			'</div>'
        );
        

        
        if( isAdmin() ) addEditButtons();
        
	// TeamBarometer / TeamVote
                $j.ajax({
                        url: topbarLocation + 'conf/teamConfig.json',
                        dataType: 'json',
                        async: false,
                        success: function(ret) {
                                if (ret == null) return false;
                                var teamBarometerLocation = '/ProjectTEAMBAROMETER/';
                                if (ret.barometerEnabled) {
                                        importJs(teamBarometerLocation + 'js/teamBarometer.js');
                                        $j('head').append('<link rel="stylesheet" href="' + teamBarometerLocation + 'style/freenest.css" type="text/css" />');
                                                teamBarometer("#topbar-widget-container", teamBarometerLocation);
                                }
                                if (ret.voteEnabled) {
                                        importJs('/ProjectTEAMVOTE/js/initVote.js');
                                        initializeVote();
                                }
                        }
                });        
        
        
    //$j(window).knm(function(){window.parent.location='http://www.youtube.com/watch?v=dQw4w9WgXcQ&ob=av2e';});
    }
    
    function addTopbarFunctions() {      
        createTabs();

        //add click events
        $j('.tabButton').click(tabButtonClick);
        $j('.linkButton').click(linkButtonClick);
                
        $j('#logoutBtn').click(logoutBtnClick);
        $j('#nestLogo').click(nestLogoClick);
        
        //changePopUpLinks();
        
        fireFoxHoverPatch();
        
        setTimeout(selectTabAndApp,300);
    }
    
    //prevents popup links from opening to default target, popup instead
//    function changePopUpLinks() {
//        $j('a.popUp').click( function(e) { 
//            e.preventDefault();
//            popUpWindow(e.target.href);
//        });
//        
//    }

    function getLoggedUser() {
        var user = $j.ajax({
            type: "POST",
            url: topbarLocation + 'php/authedUser.php',
            data: "host=" + document.domain,
            async: false

        }).responseText;


        return user;


    }
    
    function isAdmin() {
        return (getLoggedUser() == 'Admin User');
    }

    function tabButtonEvents(event, ui) {        
        var barColourId = $j(ui.tab).parent().attr('id');
        
        originalButtonHeight = 27;
        originalButtonPosition = 0;

       $j('#bottomColour').attr('class', barColourId + ' defaultbarColour');

        $j(ui.tab).parent().animate({
            height : ('+=' + tabRaiseHeight),
            bottom : ('+=' + tabRaiseHeight)

        }, tabMoveSpeed).siblings().animate({ //possibly just remove attributes
            height : originalButtonHeight,
            bottom : originalButtonPosition
        }, tabMoveSpeed, null, function() {
            $j(ui.tab).parent().siblings().removeAttr("style");
        });

    }
    
    //gets id of a tab and selects it
    function tabButtonClick() {
        tabs.tabs("select", getTabButtonIndex(this));
    }
    
    function getTabButtonIndex(button) {
        var href = $j(button).children(':first').attr('href');
        var regex = /[0-9]+/;
        return regex.exec(href);
    }

    function linkButtonClick() {
        var link = $j(this).children(':first');
        
        var href = link.attr('href');
        if(link.hasClass('popUp')) {
            popUpWindow(href);
        } else {
            window.parent.location = href;
        }
        return false;
    }

    function setTabRaiseHeight(height) {
        tabRaiseHeight = height;
    }
    
    function logoutBtnClick() {
       $.ajax({
		    url: topbarLocation+"php/logoff.php", 
		    data: {logoff:1},
		    type: 'post',
		    success: function(data){
			if(data == true){window.location='http://' + document.domain+"?status=loggedoff";}
			}
		});
    }
    
    //The logo should be a link w/ an image, but..
    function nestLogoClick() {
        window.parent.location = topbarLocation + '../ProjectMAINPAGE';
    }
    
    function createTabs() {
        
            tabs = jQuery("#topbarMenu").tabs({ select: tabButtonEvents, selected: -1, add:onAddTab});
            $j('.topbarTabs').disableSelection(); //disable text selection
    }
   
    function selectTabAndApp() {
        var location = getLocation();
        var menu = null;
        var link = null;

        //for(menuTabIndex in config.items) {
        var menuTabIndex = 0;
        while(config.items[menuTabIndex]) {
            menu = config.items[menuTabIndex];
            //for(appIndex in menu.links) {
            var appIndex = 0;
            while(menu.links[appIndex]) {
                link = menu.links[appIndex]['@attributes']['link'];
                if(location === getPathRoot(link)) {
                    
                    tabs.tabs("select", menuTabIndex);
                    $j('#tab_' + menuTabIndex + ' div').eq(appIndex).addClass('selected');
                    return;
                }
                ++appIndex;
            }
            ++menuTabIndex;
        }
    }
    
/** Editing stuff.. and this really would need objects. Feat lots of inline html
*/

    function addEditButtons() {
        var widgetSlot = $j('<div class="widget-slot" />');
        var container = $j('<div id="editButtons" />');
        var editButton = createButton('Edit', startEditing);
        container.append(editButton);
        widgetSlot.append(container);
        $j('#topbar-widget-container').prepend(widgetSlot);
    }
    
    function startEditing() {
    
        var saveButton = createButton('Save', saveTopbar);
        var stopEditButton = createButton('Cancel', reloadTopbar); //might be better to just reload topbar
        var resetButton = createButton('Reset', resetDialog);
        var editButtonsContainer = $j('#editButtons');
        
        editButtonsContainer.append(resetButton);
        editButtonsContainer.append(saveButton);
        editButtonsContainer.append(stopEditButton);
        
        editButtonsContainer.children('#editBtn').remove();
    
        $j('.topbarTabs').sortable({items:'li:not(.addButton)', snap: true, axis: 'x', zIndex: 9001});
        buttonsBarSortable($j('.buttonsBar'));
        
        $j('.linkButton a').click(function() {return false}); //disable links during editing
        $j('.linkButton').unbind();
        
        var addTabButton = $j('<li id="addTabButton" class="addButton"></li>');
        $j('.topbarTabs').append(addTabButton);
        addTabButton.click(createNewTab);

        createAddLinkButton($j('.buttonsBar'));
        
        $j('.tabButton').dblclick(editTabTitle);
        $j('.linkButton').dblclick(editLink);
    }
    
    function reloadTopbar() {
        $j('#topBar').children().remove();
        $j.when(init()).done(getConf);
    }
    
    function createAddLinkButton(target) {
        $j.each(target, function(key, value) {
            var addLinkButton = $j('<div class="addLinkButton">+</div>');
            addLinkButton.click(createNewLink);
            $j(value).append(addLinkButton);
        });
    }
    
    /** Creates a span button with onclick event */
    function createButton(title, onClick, btnClass, btnId) {
        var btnClass = btnClass || 'topbarBtn';
        var btnId = btnId || title.toLowerCase();
        
        var btn = $j('<div id="' + btnId + 'Btn" class="' + btnClass + '"> ' + title + ' </div>');
        btn.click(onClick);
        
        return btn;
    }    
    
    function buttonsBarSortable(target) {
        $j.each(target, function(key, value) {
            $j(value).sortable({items: 'div:not(.addLinkButton)', snap: true, axis: 'x', revert: true, zIndex: 9001});
        });
    }
    
    function editTabTitle(event) {
    
        var editTitleDialog = $j(
            '<div class="dialog" id="editTitleDialog" title="Type new title">' +
                '<fieldset>' +
                '<label for="newTitle" class="pop-left">Name</label>' +
                    '<input type="text" id="newTitle" value="' + $j(event.currentTarget).children('a').text() +'"/>' +
                '</fieldset>' +
            '</div>'
        ).dialog({
            height:100,
            modal:true,
            resizable: false,
            buttons: {
                Ok: function() {
                    $j(event.currentTarget).children('a').text($j('#newTitle').val());
                    $j(this).dialog('close');                 
                },
                'Cancel': function() {
                    $j(this).dialog('close');
                },
                'Delete this tab': function() {
                    tabs.tabs('remove', getTabButtonIndex($j(event.currentTarget))); //TODO
                    $j(this).dialog('close');
                }
            },
            close: function() {
                editTitleDialog.remove();
            }

        });
        
    }
    
    function createNewTab () {
        if(tabs.tabs('length') < 9) {
            tabs.tabs( "add", "#tab_" + tabs.tabs('length'), 'New Tab');
        }
    }
    
    function onAddTab(event, ui) {
        var addButton = $j(ui.tab).parent() // = .addButton
            .addClass('tabButton')
            .siblings('.addButton').detach();
            
        $j(ui.panel).addClass('buttonsBar').addClass('newBarColour');
        createAddLinkButton($j(ui.panel));
        buttonsBarSortable($j(ui.panel));
        
        $j(ui.tab).parent().click(tabButtonClick);
        $j(ui.tab).parent().dblclick(editTabTitle);
        
        $j(ui.tab).parent().parent().append(addButton);
        
    } 
       
    function createNewLink(event) {
        var parent = $j(event.currentTarget).parent();
        var addLinkButton = $j(event.currentTarget).detach();
        
        var newLink = $j(
            '<div class="linkButton">' +
                '<a class="menuLink" target="_parent" href="">New Link</a>' +
            '</div>');
        parent.append(newLink);
        newLink.dblclick(editLink);
        newLink.children('a').click(function() {return false});
            
        parent.append(addLinkButton);
           
    }
    
    /**
    *Creates a dialog for editing link target and text. The dialog is destroyed
    *when done. It would be better if the same dialog could be reused 
    *Also, needs keybinds.*/
    function editLink(event) {
        
        function isPopUpChecked() {
            if($j('#editPopUpToggle:checked').val() !== undefined) {
                return true;
            }
            return false;
        }
        
        function isLinkPopUp() {
            if($j(event.currentTarget).children('a').hasClass('popUp')) {
                return true;
            }
            return false;
        }
        
        
        
        var editLinkDialog = $j(
            '<div class="dialog" id="editLinkDialog" title="Edit this link">' +
                '<fieldset>' +
                '<label for="newText" class="pop-left">Text</label>' +
                    '<input type="text" id="newText" value="' + $j(event.currentTarget).children('a').text() + '"></input></fieldset>' +
                '<fieldset><label for="newTarget" class="pop-left">Target</label>' +
                    '<input type="text" id="newTarget" value="' + $j(event.currentTarget).children('a').attr('href') + '"></input></fieldset>' +
                '<fieldset><label for="editPopUpToggle" class="pop-left">Popup</label>' +
                    '<input type="checkbox" id="editPopUpToggle" ' + ( isLinkPopUp() ? 'checked' : '' ) +'></input>' +
                '</fieldset>' +
            '</div>'
        ).dialog({
            //buttons
            modal:true,
            resizable: false,
            buttons: {
                Ok: function() {
                    $j(event.currentTarget).children('a').text(
                        $j('#newText').val()
                    );
                    $j(event.currentTarget).children('a').attr('href',
                        $j('#newTarget').val()
                    );
                    
//                    if($j('#editPopUpToggle:checked').val() !== undefined) {
                    if( isPopUpChecked() ) {
                        $j(event.currentTarget).children('a').addClass('popUp');
                    } else {
                        $j(event.currentTarget).children('a').removeClass('popUp');
                    }
                    
                    $j(this).dialog('close');     
                },
                Delete: function() {
                    $j(event.currentTarget).remove();
                    $j(this).dialog('close');
                }
            },
            //onclose
            close: function() {
                editLinkDialog.remove(); 
            }
        });       
        
    } // :------)
    
    function resetDialog() {
    
        function reset() {
            $j.post(
                topbarLocation + 'php/resetConfigs.php',
                function (data) {
                    if(data.length > 0) {
                        errorDialog(data);
                    } else {
                        $j('#resetDialog').dialog('close');
                        reloadTopbar();
                    }
                }
            );
        };
        
        var dialog = $j(
            '<div class="dialog" id="resetDialog">' +
                '<div id="reset-dialog-content"><p>Are you sure you want to reset FreeNest topbar tabs and links to defaults?</p></div>' +
            '</div>'
        ).dialog({
            title: 'Reset',
            modal:true,
            position: 'top',
            resizable: false,
            draggable: false,
            buttons: {
                Yes: reset, 
                Cancel: function() {
                    $j(this).dialog('close');
                }
            },
            close: function() {
                dialog.remove();
            }
        
        });
        
    }
    
    function errorDialog(error) {
        var dialog = $j(
            '<div class="dialog" id="resetDialog">' +
                error +
            '</div>'
        ).dialog({
            buttons: {
                Ok: function() {
                    $j(this).dialog('close');
                }
            },
            close: function() {
                dialog.remove();
            }
        
        });        
    }
    
    function convertTopbarToJson() {
        var json = [];
    
        $j.each($j('.tabButton'), function (key, value) {
            var tabNumber = getTabButtonIndex(value);
            
            var menuItem = {
                text: $j(value).text(),
                menuLinks: []
            }
            
            var panel = $j('#tab_' + tabNumber);

            $j.each(panel.children('.linkButton'), function(key, value) {
                var menuLink = {
                    link: $j(value).children('a').attr('href'),
                    text: $j(value).children('a').text(),
                    popUp: $j(value).children('a').hasClass('popUp') ? 'true' : 'false'
                }
                
                menuItem.menuLinks.push(menuLink);
            });
            
            json.push(menuItem);
            
        });
        
        
        return json;
    }
    
    function saveTopbar() {
        $j.post(
            topbarLocation + 'php/saveXml.php',
            {
                'menuItems': JSON.stringify( convertTopbarToJson() ),
                'xmlLoc': 'conf/topbarConfig.xml'
            },
            reloadTopbar
        );
            
    }

}();

/**Returns everything between the first slash and the second */
function getPathRoot(url)
{
    var newUrl = url.split('/');

    if (newUrl.length > 0)  {
        return newUrl[1];
    } else {
        return false;
    }
}

/**Returns the current location (first folder inside the domain) */
function getLocation() {
    return getPathRoot(top.location.pathname);
}

function importJs(script) {
    $j.ajax({
        url : script,
        dataType : "script",
        async : false,
        success : function (js){
            eval(js);
        }
    });
}

function popUpWindow(url, height, width){
    if(height===undefined) height=800;
    if(width===undefined) width=600;
    
	var newWindow=null;
	var mywidth = $j(window).width();
	var newWidth = 0.8*mywidth;
	
	//var windowName = 'name'+Math.floor(Math.random()*11;
	var windowName = 'popUp' + getPathRoot(url);
	
	newWindow = window.open(url, windowName,'height='+height+',width='+width+',scrollbars=1, left='+newWidth);
	
	if(newWindow !== null) {
	    newWindow.focus();
	}

}

function fireFoxHoverPatch(){
    if(getLocation()=="ProjectWEBMIN"){
        $j(".menuLink").hover(function () {
                if(!$j(this).parent().hasClass("selected")){
                    $j(this).parent().css("background-color","#FFF");
                    $j(this).css("color", "#000");
                }
            },
            function () {
                if(!$j(this).parent().hasClass("selected")){
                    $j(this).parent().css("background-color", "");
                    $j(this).css("color", "#FFF");
                }
            });
    }
}
//derp to be removed asap
function patchWork(user) {
    var intervalIDs = [];
    /*Quick help window until real one gets implemented as widget/addon/whatev.*/
    $j("#topbar-widget-container").append('<div class="widget-slot"><div id="topbar-help-widget" class="clickable"></div>');
    //$j("#topbar-help-widget").append('<div id="help-dialog" title="FreeNest-help" style="display: none;"><p>Help not implemented yet, please use <a href="http://conceptnest.org/www/what-is-freenest" target="_blank">conceptnest.org/www/what-is-freenest</a> instead.</div>')
    $j("#topbar-help-widget").append('<div id="freenest-help-container" class="mood-round-corners-bottom" title="FreeNest-help" style="display: none;">'+
        '<div id="freenest-help-header">'+
            '<div id="freenest-help-info-icon"></div>'+
            '<h3>FreeNest - Help</h3>'+
            '<div id="freenest-help-close-button"></div>'+
        '</div>'+
        '<div id="freenest-help-content">'+
            '<p>Help not implemented yet,'+
            '<br>please use <a href="http://freenest.org/about">freenest.org/about</a> instead.'+
            '</p>'+
        '</div>'+
    '</div>');

     $j("#topbar-help-widget").toggle(function(){
            $j( "#freenest-help-container" ).dialog({
                                modal: false,
                                dialogClass: 'freenest-reset',
                                position: 'top'
                                }).siblings().hide();
    }, function() {
        $j( "#freenest-help-container" ).dialog("close");
    });

    $j("#freenest-help-close-button").click(function(){
        $j( "#freenest-help-container" ).dialog("close");
    });

    $j("#topbar-widget-container").append('<div class="widget-slot"><div id="peopleListTab"></div></div>');
    $j("#peopleListTab").append('<div id="peopleList"></div>');
    $j("#peopleListTab").append('<div id="peopleTab" class="closedPeeps">' +
		'<p id="onlineNumber">loading</p></div>');
	$j("#peopleListTab").append('<div id="peopleList"></div>');
                
    markActivity();
    fixOnlineNumbers(); //Set the online number right
    
    if(intervalIDs.length === 0) {
        var intervalIDs = []; // quick and dirty solution for calling init more than once..
        intervalIDs.push(setInterval(fixOnlineNumbers, 60000));
        intervalIDs.push(setInterval(receivedMsg, 5000));
    } else {
        for(var i in intervalIDs) {
            clearInterval(i);
        }
    }
    
    /*Peoplelist SimpleModal stuff starts here*/
    $j("#peopleTab").toggle(function () {
       peopleTabClick();
    }, function() {
        //close
        closeModal();
    });
    
    function peopleTabClick(){
		if (listOpen == false) {
		$j.modal("<div id='peopleTitle'>"+
			"<div id='peopleOnlineImage'></div>"+
			"<div class='peopleDialogTexts'>"+
			"<p class='userName'>"+ user +"</p>"+
			"<p class='nroPeep'></p>"+
			"</div>"+
		"</div>"+
		"<div class='shout-close'>"+
			"<a class='simplemodal-close shout-close-icon' onClick='closeModal()'></a>"+
		"</div>"+
		"<div id='peopleListContent' class='nestTextAreaTopBar'>"+
		"</div>",
			{
			position: ["0",],
			containerId: 'shoutContainer',
			dataId: 'shoutContent',
			escClose: false,
			minWidth: 270,
			maxWidth: 270,
			minHeight: 130,
			maxHeight: 130,
			onOpen: showContainer,
			onClose: hideContainer
			});
			
			peepTabAppear();
		}
    }
	
    function peepTabAppear(){ 
        //refresh favorites
        getOnlinePeople();
        $j('.nroPeep').append("<span>Online users: "+usno+"</span>");
        //attach hover listener to
    
    }//END OF favTabAppear()
    
    function getOnlinePeople(){
        $j('#peopleListContent').append("<ul class='peepList'></ul>"); //make list

        //AJAX people online and after that their last acting times
        var peopleOnline = $j.ajax({ 
            type: "POST",
            url: topbarLocation + 'php/onlinePeople.php',
            data: "mod=nick",
            async: false
        }).responseText;

        var lastActTime = $j.ajax({
            type: "POST",
            url: topbarLocation + 'php/onlinePeople.php',
            data: "mod=act",
            async: false
        }).responseText;

        usno=0;
        var peoples=peopleOnline.split(';');
        var peoples_act=lastActTime.split(';');     //Split the resulting strings into arrays
		for(i=0;i<(peoples.length);i++){
		/*Why oh why I have to trim this thing...*/
		trimmed = peoples[i].replace(/^\s+|\s+$/g, '');

        if(peoples_act[i].match("minutes")||peoples_act[i].match("seconds")||peoples_act[i].match("minute")||peoples_act[i].match("second")){//WHATISTHISIDONTEVEN
		    $j('.peepList').append(
                "<li class='peopleListVisuals' id='"+i+"'><span>" +
               "<a class='clickable' onClick=\"composeMsg('"+trimmed+"', 0)\">"+trimmed+"</a></li>"
            );

		}
		else if(peoples_act[i].match("1 hour")){ //is idle, will be marked as such
            $j('.peepList').append(
                "<li class='peopleListVisuals' id='"+i+"'><span>" +
                peoples[i]+"</span></li>"
            );
        }
		else{ //been idle for more than 1h, will be "logged out"
            $j('.peepList').append(
            "<li class='peopleListVisuals' id='"+i+"'><span></span></li>"
            );
            usno--;
        }

        usno++;
        }
    }//END OF getOnlinePeople()
    
    function markActivity(){
     $j.ajax({
        type: "POST",
        url: "https://"+document.domain+"/navibar/php/activityTrigger.php"
    });
    
    }//END OF markActivity()
}

    function fixOnlineNumbers(){
        //Get the number of people
        var peopleNumbers = $j.ajax({ 
                    type: "POST",
                    url: topbarLocation + 'php/onlinePeople.php',
                    data: "mod=nr",
                    async: false
        }).responseText;
        //set the number to the appropriate field
        $j("#onlineNumber").html(peopleNumbers);
    }
    

//(function($){$.fn.knm=function(callback,code){if(code==undefined)code="38,38,40,40,37,39,37,39,66,65";return this.each(function(){var kkeys=[];$(this).keydown(function(e){kkeys.push(e.keyCode);if(kkeys.toString().indexOf(code)>=0){$(this).unbind('keydown',arguments.callee);callback(e);}},true);});}})(jQuery);
    

