<?php

include_once('feedsList.php');
include_once('getFeeds.php');


$feedsObj = [];


foreach($feeds as $feed){
	$feedInfo = getFeed($feed);
	$feed = ['id' => $feedInfo['name'], 'prettyName' => $feedInfo['prettyName'], 'url' => $feed];
	array_push($feedsObj,$feed);
};



?>



