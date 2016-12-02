<?php

include_once('feedsList.php');

function getFeed($url){
	$name = str_replace('http://','',$url);
	$name = str_replace('https://','',$name);
	$name = str_replace('.xml','',$name);
	$name = str_replace('/','-',$name);
	$name = str_replace('.','-',$name);
	$xml = file_get_contents($url);

	$xmlObj = new SimpleXMLElement($xml);

	$prettyName = '';
	if($xmlObj->channel[0]){
		$prettyName = $xmlObj->channel[0]->title;
	} 
	elseif($xmlObj->title){
		$prettyName = $xmlObj->title;
	}

	$addedfile = file_put_contents('feeds/'.$name.'.xml', $xml);
	return array('name' => $name, 'prettyName' => $prettyName, 'localFile' => 'feeds/'.$name.'.xml');
}


//$feedsObj = [];
$feedsString = '';

foreach($feeds as $feed){
	$feedInfo = getFeed($feed);
	$feedsString .= 'id=' . $feedInfo['name'] . ',title=' . $feedInfo['prettyName'] . ',url=' . $feed . ',localFile=' . $feedInfo['localFile'] . "\r\n";
	//$feedObj = ['id' => $feedInfo['name'], 'prettyName' => $feedInfo['prettyName'], 'url' => $feed];
	//array_push($feedsObj,$feedObj);
};

$listFile = file_put_contents('feeds/feedsList.txt', $feedsString);


?>



