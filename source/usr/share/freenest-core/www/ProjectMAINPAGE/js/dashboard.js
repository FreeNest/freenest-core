/* 
* NEST PROJECT PLATFORM TOP-BAR SCRIPT
* Copyright JAMK University of Applied Sciences 2010
* Ilkka Turunen, Leo-Matti Lehtonen 2010
*
* This script handles the creation and subsequent handling of the Nest Dashboard
* 
* INCLUDES
*
*
*
* VARIABLES
* html - Contains the news extracted from foswikis NestNewsTopic
* newsArticles - Array containing the parsed news articles
* user - Logged in username
* 
*/

/*********************************************************************************************************************
* INCLUDES
**********************************************************************************************************************/


/*********************************************************************************************************************
* GLOBAL VARIABLES
**********************************************************************************************************************/
/*
	var html = $.ajax({
  		url: "https://"+document.domain+"/ProjectFOSWIKI/bin/view/Main/NestNewsTopic?raw=on",
 		cache: false, 
		async: false
	}).responseText;

	html = html.split("| *Type* | *Date* | *About* | *Who* |")[1];
	news = html.split("</textarea>")[0];
	
	newsArticles= news.split("\n");
*/
	var user = $.ajax({
		type: "POST",
  		url: "https://"+document.domain+"/navibar/php/authedUser.php",
		data: "host="+document.domain,
		async: false
	
 	}).responseText;
	
/***********************************************************************************************************************
* FUNCTIONS 
************************************************************************************************************************/

$(document).ready(function(){
	//createNavigation();
	//getOnlinePeople();


  $("div.menu ul li.grey ul").slideDown();
  $("div#activity ul li.silver ul").slideDown();
  
  $("div.menu ul li").click(function(){
    var ul = $(this).find('ul'); 
    if(ul.css('display') === 'block') {
      ul.slideUp();
    }else ul.slideDown();
  });
/*	
	for(i=1;i<=6&&i<newsArticles.length;i++){
		article = newsArticles[i].split("|");
	
		$("#news").append("<div class='newsitem'><div class='date'><p><b>"+article[2]+"<br/> "+article[1]+"</b><br/> <i>"+article[4]+"</b></i></p></div><div class='newscontent'><p>"+article[3]+"</p></div></div>");
	}//end of for
*/	
	//Append link for more news
	//$("#news").append("<div class='newsitem'><p>Read all news posts: <a href='https://"+document.domain+"/ProjectFOSWIKI'> Click here for more</a></p></div><br/>");

	$("#authed").append('Welcome, '+user+'<a href="https://'+document.domain+'/logoff.php" id="logOffButton"><img id="LogOffImage" src="https://'+document.domain+'/navibar/graphics/logoff.png" alt="Log out" /> </a>');

	$("#LogOffImage").hover(function(){
		
		$(this).attr("src","https://"+document.domain+"/navibar/graphics/logofffloat.png");
	}, function () {
		$(this).attr("src","https://"+document.domain+"/navibar/graphics/logoff.png");
	});

	

}); //END OF document.ready

function getOnlinePeople(){
	//$('#peopleList').append("<ul class='peepList'></ul>"); //make list
	
	//AJAX people online and after that their last acting times
	var peopleOnline = $.ajax({ 
				type: "POST",
		  		url: "https://"+document.domain+"/navibar/php/onlinePeople.php",
				data: "mod=nick",
		 		async: false
		 	}).responseText;

	var lastActTime = $.ajax({
				type: "POST",
		  		url: "https://"+document.domain+"/navibar/php/onlinePeople.php",
				data: "mod=act",
		 		async: false
		 	}).responseText;
	
	usno=0;
	var peoples=peopleOnline.split(';');
	var peoples_act=lastActTime.split(';');	 //Split the resulting strings into arrays
	for(i=0;i<(peoples.length);i++){
	
		if(peoples_act[i].match("minutes")||peoples_act[i].match("seconds")||peoples_act[i].match("minute")||peoples_act[i].match("second")){//not idle, format entry accordingng
		
		$('.peepList').append("<li class='listItem listUnEven listPeople' id='"+i+"'><img src='https://"+document.domain+"/navibar/graphics/online.png' alt='act' class='onlinePic'/> "+peoples[i]+"</li>");
		}else { //is idle, will be marked as such
			
			$('.peepList').append("<li class='listItem listUnEven listPeople' id='"+i+"'><img src='https://"+document.domain+"/navibar/graphics/idle.png' alt='act' class='onlinePic'/> "+peoples[i]+"</li>");
		}
		usno++;
	}
	
		//fill in the empty gaps
		for(i=0;i<(3-(peoples.length));i++){
			$('.peepList').append("<li class='listItem listUnEven' id='ep"+i+"'></li>");
		}

}//END OF getOnlinePeople()

function createNavigation(){
	$("#menulist").append('<li class="green"><img src="images/knowledge_icon.png" alt="" class="icon" />'+menuItems[0]+'<ul id="ulGreen"></ul></li>');
		for(i=0;i<appCat[0][1].length;i++){
			$("#ulGreen").append("<li><a href='"+links[appCat[0][1][i]]+"'>"+appCat[0][1][i]+"</a></li>");
		} //First category

	$("#menulist").append('<li class="yellow"><img src="images/communication_icon.png" alt="" class="icon" />'+menuItems[1]+'<ul id="ulYellow"></ul></li>');
		for(i=0;i<appCat[1][1].length;i++){
			$("#ulYellow").append("<li><a href='"+links[appCat[1][1][i]]+"'>"+appCat[1][1][i]+"</a></li>");
		} //Second Category

	$("#menulist").append('<li class="blue"><img src="images/collaboration_icon.png" alt="" class="icon" />'+menuItems[2]+'<ul id="ulBlue"></ul></li>');
		for(i=0;i<appCat[2][1].length;i++){
			$("#ulBlue").append("<li><a href='"+links[appCat[2][1][i]]+"'>"+appCat[2][1][i]+"</a></li>");
		} //Third Category

	$("#menulist").append('<li class="red"><img src="images/administration_icon.png" alt="" class="icon" />'+menuItems[3]+'<ul id="ulRed"></ul></li>');
		for(i=0;i<appCat[3][1].length;i++){
			$("#ulRed").append("<li><a href='"+links[appCat[3][1][i]]+"'>"+appCat[3][1][i]+"</a></li>");
		} //Fourth

	favorites = getFavorites();
	$("#menulist").append('<li class="grey"><img src="images/favorites_icon.png" alt="" class="icon" />Favorites<ul id="ulGray"></ul></li>');
		for(i=0;i<favorites.length;i++){
			//alert(favorites);
			$("#ulGray").append("<li><a href='"+links[favorites[i]]+"'>"+favorites[i]+"</a></li>");
		} //Favorites
	
}//END OF createNavigation()

function getFavorites(){
var favorites = $.ajax({
			type: "POST",
		  	url: "https://"+document.domain+"/navibar/php/usersFavorites.php",
			data: "mod=get",
		 	async: false
		 	}).responseText;
	//alert(favorites);
	var favoriteItems=favorites.split(';');	

	return favoriteItems;
}
