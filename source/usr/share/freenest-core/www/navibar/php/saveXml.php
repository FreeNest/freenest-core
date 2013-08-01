<?php

/**
*Needs to be made to only modify the menuItems - part of the xml
*as the config may later contain other stuff, eg read the xml, modify 
*menuItems, save
* */
$uid = $_SERVER['PHP_AUTH_USER'];
if(strtolower($uid) != 'adminuser') die('Rage!'); //RAGE ಥ_ಥ

if (isset($_POST['menuItems']) && isset($_POST['xmlLoc'])) {



    $menuItems = json_decode($_POST['menuItems']);
    $file = $_POST['xmlLoc'];
    

    $xml = new SimpleXMLElement('<topBarMenu />');
    

    foreach($menuItems as $key=>$menuItem) {
        $menuItemElement = $xml->addChild('menuItem');
        $menuItemElement->addAttribute('text', htmlspecialchars($menuItem->text));
        


        foreach($menuItem->menuLinks as $menuLink) {
            $menuLinkElement = $menuItemElement->addChild('menuLink', htmlspecialchars($menuLink->text));
            $menuLinkElement->addAttribute('link', $menuLink->link);
            
            if($menuLink->popUp == 'true') {
                $menuLinkElement->addAttribute('popUp', 'true');
            }
        }
    }
    
    //chdir('/var/www/navibar/');
    writeToFile(/*realpath($file)*/'/var/www/navibar/' . $file, $xml->asXML());

}

function writeToFile($file, $stuff) { //writes stuff to files!
    $handle = fopen($file, 'w') or die('can\'t open file');
    fwrite($handle, $stuff);
}

?>
