<?php

#if (isset($_GET['cmd'])) $_POST['cmd'] = $_GET['cmd'];
if (isset($_POST['cmd'])) {
    $cmd = $_POST['cmd'];

    include_once "htmlElementHelper.php";

     $topbar = new TopbarStructure();


    if ($cmd === 'buildTopbar') {
        $topbar->buildStructure();
    }
    else if ($cmd === 'getConf') {

        $items = array();
        foreach($topbar->getConf()->menuItem as $item)
        {
            $links = array();
            foreach($item->menuLink as $link)
            {
                $links[] = json_encode($link);
            }
            $items[] = sprintf('{ "links": [ %s ] }', implode(',', $links));   
        }
        printf('{ "items": [ %s ] }', implode(',', $items));
    }

}


class TopbarStructure {

   const confFileLocation = '../conf/topbarConfig.xml';
   const menuLinkClass = 'menuLink';
   const topBarMenuClass = 'topbarMenu';
   const tabsClass = 'topbarTabs';
   const tabButtonClass = 'tabButton';
   const tabButtonLinkClass = 'tabButtonLink';
   const linkButtonClass = 'linkButton';
   const buttonsBarClass = 'buttonsBar';
   const nestLogoLocation = '../graphics/nestLogo.png';
   const topbarWrapperClass = 'topbar';
   const bottomColourId = 'bottomColour';

   private $conf, $tabButtonCount;

   function __construct() {
      $this->conf = simplexml_load_file(self::confFileLocation); //->topBarMenu
      $this->tabButtonCount = 0;
   }
   
    function getConf() {
        return $this->conf;
    }


   /* Build the topbar structure */
   public function buildStructure() {

      $topbarWrapper = new html_element('div');
      $topbarWrapper->set('id', 'topbar');
      $topbarWrapper->set('class', self::topbarWrapperClass);

      $topbarWidgetContainer = new html_element('div');
      $topbarWidgetContainer->set('id', 'topbar-widget-container');
      $topbarWrapper->inject($topbarWidgetContainer);
      


   
      //Topbar div
      $topbarMenus = new html_element('div');
      $topbarMenus->set('class', self::topBarMenuClass);
      $topbarMenus->set('id', 'topbarMenu');



      //Tabs-bar
      $tabsList = new html_element('ul');
      $tabsList->set('class', self::tabsClass);


      //Loop through categories (tabs)
      $menuItemNumber = 0;
      $menuItems = $this->conf->menuItem;
      
      foreach($menuItems as $menuItem) {

         //Add a tab
         $tabButton=$this->createTabButton($menuItem['text']);
         $tabsList->inject($tabButton);


         $buttonsBar = new html_element('div');
         $buttonsBar->set('class', self::buttonsBarClass);
         $buttonsBar->set('id', "tab_".$menuItemNumber);

         
         //Add link buttons
         foreach($menuItem->menuLink as $menuLink) {

            $link = $this->createLink($menuLink, $menuLink['link']);
            $linkClasses = self::menuLinkClass;
            
            if($menuLink['popUp'] == true) {
                $linkClasses = $linkClasses . ' popUp';
            }
            
            $link->set('class', $linkClasses);	
            $linkButton = $this->createButton($link);
            $buttonsBar->inject($linkButton);

         }

            
            /* Add all button bars to an array 
             * as they can't be injected yet
             */
            
            $allButtonBarsArr[] = $buttonsBar;

            ++$menuItemNumber;
      }


#      $nestLogo = $this->createImage(self::nestLogoLocation);
#      $nestLogo->set('id', 'nestLogo');
#      $nestLogo->set('alt', 'Logo');

        $nestLogo = new html_element('div');
        $nestLogo->set('id', 'nestLogo');

      $topbarWrapper->inject($nestLogo);

      
      //Add tabs to menu
      $topbarMenus->inject($tabsList);

      $buttonsBar = new html_element('div');
      $buttonsBar->set('class', self::buttonsBarClass);
      $buttonsBar->set('id', "tab_".$menuItemNumber);



      /*
      *Add buttons to menu. Has to be done here so that
      *buttons will appear below the tabs
      */  
      foreach($allButtonBarsArr as $buttonsBar) {
         $topbarMenus->inject($buttonsBar);
      }

      $topbarWrapper->inject($topbarMenus);

      $bottomColourDiv = new html_element('div');
      $bottomColourDiv->set('id', self::bottomColourId);
      $bottomColourDiv->set('text', '&nbsp;');
      $topbarWrapper->inject($bottomColourDiv);

      $topbarWrapper->output();

   }

   /*
   ******************
   *Private functions
   ******************
   */


   //Creates a basic link
   private function createLink($title, $address, $target='_parent') {
      $link = new html_element('a');
      $link->set('href', $address);
      $link->set('text', $title);
      $link->set('target', $target);
      return $link;
   }


   //Create a img-element
   private function createImage($source) {
      $img = new html_element('img');
      $img->set('src', $source);
      return $img;
   }


   /* Creates a tab-button, which is a
    * li-element with a link
    */
   private function createTabButton($title) {
      $tabButton = new html_element('li');
      $tabButtonId = str_replace(' ', '_', $title) . "_tabBtn";
      $tabButton->set('id', $tabButtonId);
      $tabButton->set('class', self::tabButtonClass . " " . $tabButtonId);

      $tabButtonLink = $this->createLink($title, "#tab_".$this->tabButtonCount);
      $tabButtonLink->set('class', self::tabButtonLinkClass);
      $tabButton->inject($tabButtonLink);

      $this->tabButtonCount++;

      return $tabButton;
   }

   
   //Creates a div and injects argument link inside it
   
   private function createButton($link, $class=self::linkButtonClass, $id="") {
      $linkButton = new html_element('div');
      $linkButton->set('class', $class);

      if($id!="") {
         $linkButton->set('id', $id);
      }

      $linkButton->inject($link);

      return $linkButton;
   }

}








?>
