/*********************************************************************************************************************************************
* NEST PROJECT PLATFORM TOP-BAR SCRIPT
* Copyright JAMK University of Applied Sciences 2010
* Ilkka Turunen, 2011
* Refactored to work with SimpleModal peoplelist by
* UXTeam,
* UXTrainee Jani Martikainen, 2012
* FreeNEST Summer Factory 2012
* This script handles the instant messaging ("shouting") features of the Nest Top Bar
***********FUNCTIONS*************
* function receivedMsg() - Checks if there's a new shout to display
* function handleMsgResult() - Handler for showing incoming shout(s)
* function showShoutQueue() - Shows all fecthed shouts
* function replyMsg() - Shows dialog for viewing received shout
* function sendReplyMsg() - Marks shout read
* function markMsgRead() - Ajax call for php
* function composeMsg() - Function for composing new shout or replying to existing
* function paginate() - Function for showing more than 3 shouts in the box
* function changePage() - Function for changing between pages
* function showContainer() - Function for showing dialog animation
* function hideContainer() - Function for hiding dialog animation
* function sendMsg() - Ajax call for php to sending shouts
* function exitModal() - Function to show "Shout sent" dialog
* function closeModal() - Function for "killing" SimpleModal dialogs and resetting variables
***********************************************************************************************************************************************
*
* SimpleModal
* http://www.ericmmartin.com/projects/simplemodal/
* http://code.google.com/p/simplemodal/
*
* Copyright (c) 2010 Eric Martin - http://ericmmartin.com
*
* Licensed under the MIT license:
*   http://www.opensource.org/licenses/mit-license.php
*
* Revision: $jId: osx.js 238 2010-03-11 05:56:57Z emartin24 $j
*
**********************************************************************************************************************************************/
var $j = jQuery.noConflict();
var topbarLocation = 'https://' + document.domain + '/navibar/';
var target="";
var isreceive=0;
var remsg = 0;
var listOpen = false;

function receivedMsg(){
    $j.ajax({ 
        type: "POST",
        url: "/navibar/php/checkShout.php",
		dataType: 'json',
		cache: false,
        async: true,
        success: function(shout){handleMsgResult(shout);}
    });
}//END OF receivedMsg

function handleMsgResult(shout){
	shouts = shout;
	/*Shout is constructed in following form:
	msg.shout_$i.sender_name
	msg.shout_$i.sender_uid
	msg.shout_$i.message_id
	msg.shout_$i.message_received
	msg.shout_$i.message
	*/

	function countProperties(obj) {
			var prop;
			var propCount = 0;

			for (prop in obj) {
				++propCount;
			}
			return propCount;
	}
	
	queueLength = countProperties(shouts);
	//If there's shouts in the queue, we handle them
	if (queueLength > 0) {
		//Dirty trick to change sender_name from CamelCase to Camel Case
		for(i = 0; i < queueLength; ++i){
			eval('shouts.shout_'+i+'.sender_name = shouts.shout_'+i+'.sender_name.replace(/([a-z])([A-Z])/, "$1 $2")');
		}
		if(this.isreceive==0){
			this.isreceive=1;
			$j.modal("<div class='newShoutContainer'>"+
			"<div id='shoutTitle'>"+
			"<div id='newShoutsImage'><p class='newShoutsNumber'>"+queueLength+"</p></div>"+
			"<div class='shoutDialogTexts'>"+
			"<a onClick='showShoutQueue(shouts, queueLength)' class='clickable'><p>you have new shout(s)</p></a>"+
			"</div>"+
			"</div>"+
			"</div>", {
			focus: false,
			position: ["0",],
			containerId: 'shoutContainer',
			dataId: 'shoutContent',
			escClose: false,
			minWidth: 270,
			maxWidth: 270,
			minHeight: 40,
			maxHeight: 40,
			onOpen: showContainer,
			onClose: hideContainer
			});
		}
	}
}//END OF handleMsgResult

function paginate(itemsPerPage) {
	var items = $j('.shoutSender'), iL = items.length || 0;

	this.turnPage = function(pageNum) {
		var startItem = (pageNum*itemsPerPage) - itemsPerPage;
		for (var i = 0; i < iL; ++i) {
			items[i].style.display = (startItem <= i && i < (startItem + itemsPerPage)) ? 'block' : 'none';
		}
	}
}

//show and handles the incoming "Shout Queue"
function showShoutQueue(shouts, queueLength) {
	//Only one message on queue, we'll show the message right away
	if (queueLength == 1) {
		$j('#shoutContent').fadeOut('slow');
		$j('.simplemodal-container').animate({height: 130}, 'slow', function(){
		$j('#shoutContent').html("<div class='newShoutContainer'></div>");
		});
		replyMsg(shouts.shout_0);
	}
	
	//There's more than one incoming shout, so we prepare our queue for them
	else {
		$j('#shoutContent').fadeOut('slow');
		$j('.simplemodal-container').animate({height: 130}, 'slow', function(){
			$j('#shoutContent').html("<div class='newShoutContainer'>");
			if(queueLength < 4 ) showQueue(); //Shouts fit on one page, no need to do anything special
			if(queueLength > 3 ) showQueuePagination(); //Shouts take more than one page, we need to initialize pagination
		});
		
		//Only three incoming shouts
		function showQueue() {
			for(i = 0; i < queueLength; ++i) {
				$j('.newShoutContainer').append("<div onClick='replyMsg(shouts.shout_"+i+")' class='shoutSender clickable shout_"+i+"'>"+
					"<div id='shoutImage'></div>"+
					"<div class='shoutDialogTexts'>"+
						"<p>"+eval('shouts.shout_'+i+'.sender_name')+"</p>"+
						"<p><span>"+eval('shouts.shout_'+i+'.message_received')+"</span></p>"+
					"</div>"+
				"</div>");
			}
			$j('.shoutSender.prev_'+i+'').css('display', 'none');
			$j('.newShoutContainer').append("<p class='buttons shoutQueue'>"+
			"<button onclick='closeModal()' class='nestbutton-shout'>Close</button></p>"+
			"</div>");
			$j('#shoutContent').show();
		}
		
		//Pagination if there's more than 3 incoming shouts
		function showQueuePagination() {
			
			for(i = 0; i < queueLength; ++i) {
				$j('.newShoutContainer').append("<div onClick='replyMsg(shouts.shout_"+i+")' class='shoutSender clickable shout_"+i+"'>"+
					"<div id='shoutImage'></div>"+
					"<div class='shoutDialogTexts'>"+
						"<p>"+eval('shouts.shout_'+i+'.sender_name')+"</p>"+
						"<p><span>"+eval('shouts.shout_'+i+'.message_received')+"</span></p>"+
					"</div>"+
				"</div>");
			}
			
			//Hide all but first 3 shouts and let the Paginate() handle the hiding/showing from now on.
			for(i = 0; i < queueLength; ++i) {
				x = i + 3;
				$j('.shoutSender.shout_'+x).css('display', 'none');
			}
			//Argument is the number of shouts in one page
			P = new paginate(3);
			$j('.newShoutContainer').append("<p class='buttons shoutQueue'>"+
			"<button onClick='changePage(2, P, queueLength)' class='nestbutton-shout nextButton'>Next</button>"+
			"<button onClick='closeModal()' class='nestbutton-shout'>Close</button></p>"+
			"</div>");
			$j('#shoutContent').show();
		}
	}
};//End of showShoutQueue()

//Function for browsing all generated pages
function changePage(num, P, qL) {
	P.turnPage(num);
	//This could be done more elegantly
	if(num == 1) {
	$j('.buttons.shoutQueue').html("<button onClick='changePage(2, P)' class='nestbutton-shout nextButton'>Next</button>"+
			"<button onClick='closeModal()' class='nestbutton-shout'>Close</button></p>"+
			"</div>");
	}
	
	if(num == 2 && queueLength <= 6) {
	$j('.buttons.shoutQueue').html("<button onClick='changePage(1, P)' class='nestbutton-shout prevButton'>Prev</button>"+
			"<button onClick='closeModal()' class='nestbutton-shout'>Close</button></p>"+
			"</div>");
	}
	
	if(num == 2 && queueLength > 6) {
	$j('.buttons.shoutQueue').html("<button onClick='changePage(1, P)' class='nestbutton-shout prevButton'>Prev</button>"+
			"<button onClick='changePage(3, P)' class='nestbutton-shout nextButton'>Next</button>"+
			"<button onClick='closeModal()' class='nestbutton-shout'>Close</button></p>"+
			"</div>");
	}
	
	if(num == 3){
		$j('.buttons.shoutQueue').html("<button onClick='changePage(2, P)' class='nestbutton-shout prevButton'>Prev</button>"+
			"<button onClick='closeModal()' class='nestbutton-shout'>Close</button></p>"+
			"</div>");
	}
}//End of changePage()

//Opens dialog for replying to shout
function replyMsg(shout) {
	this.remsg = 1;
	$j('#shoutContent').fadeOut('slow');
	$j('#shoutContainer').html("<div id='shoutTitle'>"+
				"<div id='shoutImage'></div>"+
				"<div class='shoutDialogTexts'>"+
				"<div class='shout-close'>"+
				"<a class='simplemodal-close shout-close-icon' onClick='closeModal()'></a>"+
				"</div>"+
					"<p>"+shout.sender_name+"</p>"+
					"<p><span>"+shout.message_received+"</span></p>"+
				"</div>"+
			"</div>"+
			"<div class='clearer'></div>"+
			"<div class='shoutData'>"+
				"<textarea id='shoutMessageText' readonly='true' class='nestTextAreaTopBar'>"+shout.message+"</textarea>"+
				"<p class='buttons'><button class='nestbutton-shout' onClick='markMsgRead(\""+shout.sender_uid+"\", \""+shout.message_id+"\")'>Mark as read</button>"+
				"<button class='nestbutton-shout' onClick='sendReplyMsg(\""+shout.sender_name+"\",\""+shout.sender_uid+"\",\""+shout.message_id+"\")'>Reply</button><a class='simplemodal-close'>"+
				"<button class='nestbutton-shout' onClick='closeModal()'>Close</button></a></p>"+
			"</div>"+
		"</div>");
		$j('#shoutContent').fadeIn('fast');
		
	setTeamboardStateToFalse();
};//End of replyMsg()

/*reply button pressed, shout will be marked as read and we
start composing reply shout to sender*/
function sendReplyMsg(recipient, sender, id) {
	markMsgRead(sender, id);
    setTimeout("composeMsg('"+recipient+"');",1000);
	this.isreceive=0;
};//End of reply message

/*Function to mark shout as read and we are ready
to look up new shouts*/
function markMsgRead(sender, msgid){
    $j.ajax({ 
		type: "POST",
		url: topbarLocation + "/php/markShout.php",
		data: "from="+sender+"&id="+msgid,
		async: false,
		success: function(message){
			if(message=="ok"){
				this.isreceive=0;
				this.remsg = 0;
				closeModal();
			}
			else {
				alert("error with marking "+message);
			}
		}
	});
}//End of markMsgRead

/*Function for composing new shout*/
function composeMsg(recipient, ind){
	this.remsg = ind;
	/*New SimpleModal dialog for writing a shout or replying to received shout
	this.remsg tells us if we are compsing a new shout or replying. Yes, it is a
	very lame way to handle this*/
	if	(this.remsg == 0) { //New shout
		target = recipient;
		$j('#shoutContainer').fadeIn('fast');
		$j('#shoutContent').html("<div id='shoutTitle'>"+
		"<div id='shoutImage'></div>"+
					"<div class='shoutDialogTexts'>"+
						"<p>Send a shout</p>"+
						"<p><span>To: "+recipient+"</span></p>"+
					"</div>"+
				"</div>"+
				"<div class='clearer'></div>"+
				"<div class='shout-close'>"+
					"<a class='simplemodal-close shout-close-icon' onClick='closeModal()'></a>"+ //change here
				"</div>"+
				
				"<div class='shoutData'>"+
					"<textarea id='shoutMessageText' class='nestTextAreaTopBar'></textarea>"+
					"<p class='buttons'><button class='nestbutton-shout' onClick='sendMsg()'>Send</button><a class='simplemodal-close'><button class='nestbutton-shout' onClick='closeModal()'>Cancel</button></a></p>"+
				"</div>"+
			"</div>");
	}
	
	else { //We are replying to shout, this.remsg needs to be set to 0
		this.remsg = 0;
		target = recipient;
		$j.modal("<div id='shoutTitle'>"+
					"<div id='shoutImage'></div>"+
					"<div class='shoutDialogTexts'>"+
						"<p>Send a shout</p>"+
						"<p><span>To: "+recipient+"</span></p>"+
					"</div>"+
				"</div>"+
				
				"<div class='shout-close'>"+
					"<a class='simplemodal-close shout-close-icon' onClick='closeModal()'  title='Closing window now sets message as read and reply will not be send'></a>"+ //change here
				"</div>"+
				
				"<div class='shoutData'>"+
					"<textarea id='shoutMessageText' class='nestTextAreaTopBar'></textarea>"+
					"<p class='buttons'><button class='nestbutton-shout' onClick='sendMsg()'>Send</button><a class='simplemodal-close'><button class='nestbutton-shout' onClick='closeModal()' title='Closing window now sets message as read and reply will not be send'>Cancel</button></a></p>"+
				"</div>"+
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
		});//End of SimpleModal-dialog
	}

	setTeamboardStateToFalse();
}//End of composeMsg()

//Animation for opening the SimpleModal-dialog
function showContainer(dialog) {
	listOpen = true; //prevents case where user could dublicate userlist content
	dialog.data.show();	
	dialog.container.slideDown('slow');
}//showContainer ends

//Animation for closing the SimpleModal-Dialog
function hideContainer(dialog) {
	listOpen = false;
	dialog.container.slideUp('slow', function() {
		$j.modal.close();
		setTimeout("receivedMsg()",1000);
		this.isreceive=0;
		this.remsg = 0;
	});
}//hideContainer ends

/*functiong for sending shout*/
function sendMsg(){
	recipient = target;
	message = encodeURIComponent($j("#shoutMessageText").val());
	$j.ajax({ 
		type: "POST",
		url: topbarLocation + '/php/sendShout.php',
		data: "to="+this.target+"&msg="+message,
		async: true,
		success: function(msg){exitModal(msg, recipient);}
	});

	setTeamboardStateToTrue();
}//End of sendMsg()

/*Shout is sent, showing the "Shout sent to" dialog*/
function exitModal(msg, recipient){
	this.remsg = 0;
	$j('#shoutContent').fadeOut('slow');
	$j('.simplemodal-container').animate({height: 40}, 'slow', function(){
	    $j('#shoutContent').html("<div class='newShoutContainer'>"+
			"<div id='shoutSentImage'></div>"+
			"<div class='shoutDialogTexts'>"+
				"<p>Shout sent to</p>"+
				"<p><span>To: "+recipient+"</span></p>"+
			"</div>"+
			"<p class='buttons sent'><button onclick='closeModal()' class='nestbutton-shout'>Close</button></p>"+	
			"</div>"+
		"</div>");
		$j('#shoutContent').show();
	});

	setTeamboardStateToTrue();
}//End of exitModal()

/*"Kills" the SimpleModal and starts looking for new shouts*/
function closeModal(){
	$j.modal.close();
    setTimeout("receivedMsg()",1000);
    this.isreceive=0;

	setTeamboardStateToTrue();
};//End of closeModal

// Check if Teamboard is open and allow it to get
function setTeamboardStateToTrue() {
	if ($(".kineticjs-content").length != 0)
		Teamboard.boardManager.boardState = true;
}

// Check if Teamboard is open and prevent it getting keypresses
function setTeamboardStateToFalse() {
	if ($(".kineticjs-content").length != 0)
		Teamboard.boardManager.boardState = false;
}