/*********************************************************************************************************************************************
* NEST PROJECT PLATFORM TOP-BAR SCRIPT
* Copyright JAMK University of Applied Sciences 2010
* UX Trainee Jani Martikainen, 2012
*
* The showing of the list of peoples that have been logged in
* 
***********************************************************************************************************************************************
*
* SimpleModal OSX Style Modal Dialog
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

function peopleList() {
	$j.modal("<div id='peopleTitle'>"+
		"<div id='peopleOnlineImage'></div>"+
		"<div class='peopleDialogTexts'>"+
		"<p>UserNameGoesHere</p>"+
		"<p><span>Online users: 12</span></p>"+
		"</div>"+
	"</div>"+
	"<div class='people'>"+
		"<a class='simplemodal-close'><img src='../navibar/graphics/online_shout_windows/off_btn.png' /></a>"+
	"</div>"+
	"<div id='peopleListContent' class='nestTextAreaTopBar'>"+
	"<ul>"+
		"<li><span class='clickable simplemodal-close'>NakkeNakuttaja</span></li>"+
		"</ul>"+
	"</div>",
		{
		position: ["0",],
		containerId: 'shoutContainer',
		dataId: 'peopleContent',
		minWidth: 270,
		maxWidth: 270,
		minHeight: 130,
		maxHeight: 130,
		onOpen: showContainer,
		onClose: composeMsg
		});
};