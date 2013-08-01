<?php

if (!isset($_POST['matchedText'])) die();

$possibleTopics = $_POST['matchedText'];

$filename = "/usr/share/freenest-tools/Foswiki/WikiWord/WikiWords.txt"; //needs a better solution
$contents = file_get_contents($filename);

$matches = array();

foreach ( $possibleTopics as $topic) {
  if( strpos( $contents, $topic ) )
  {
    $matches[] = $topic;
  }
}

echo json_encode($matches);

?>
