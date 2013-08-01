<?php
    require_once("xml2json.php");


    // Filename from where XML contents are to be read.
    $fileLocation = $_POST['fileLocation'];




    //Read the XML contents from the input file.
    file_exists($fileLocation) or die('Could not find file ' . $fileLocation);
    $xmlStringContents = file_get_contents($fileLocation);


    $jsonContents = "";
    // Convert it to JSON now.
    // xml2json simply takes a String containing XML contents as input.
    $jsonContents = xml2json::transformXmlStringToJson($xmlStringContents);


    echo($jsonContents);
?>
