/* 
* NEST PRODUCT PLATFORM 
* Copyright JAMK University of Applied Sciences 2010
* UX Team, FreeNEST Summer Factory 2012
*
******************************
FUNCTIONS
******************************
*/

$j(document).ready(function(){
	//createNavigation();
	//getOnlinePeople();

$j("#licences_left_paragraph ul li").click(function(){
    var id = $j(this).attr('id'); 
    $j("."+id).toggle().siblings().css('display', 'none');
  });
	
}); //END OF document.ready


