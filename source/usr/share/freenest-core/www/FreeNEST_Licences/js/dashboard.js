/* 
* NEST PROJECT PLATFORM TOP-BAR SCRIPT
* Copyright JAMK University of Applied Sciences 2010
* Ilkka Turunen, Leo-Matti Lehtonen 2010
*
* This script handles the creation and subsequent handling of the Nest Dashboard
* 
* INCLUDES
* NestIncludes.js needs to be included to get the proper configurations.
*
*
* VARIABLES
* html - Contains the news extracted from foswikis NestNewsTopic
* newsArticles - Array containing the parsed news articles
* user - Logged in username
* 
*/


/***********************************************************************************************************************
* FUNCTIONS 
************************************************************************************************************************/

$j(document).ready(function(){
	//createNavigation();
	//getOnlinePeople();


  $j("div.menu ul li.grey ul").slideDown();
  $j("div#activity ul li.silver ul").slideDown();
  
  $j("div.menu ul li").click(function(){
    var ul = $j(this).find('ul'); 
    if(ul.css('display') === 'block') {
      ul.css('display','none');
    }else ul.css('display','block');
  });
	
}); //END OF document.ready


