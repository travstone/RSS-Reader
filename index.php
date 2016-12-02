<?php
	$feedsList = file('feeds/feedsList.txt');
	$feedsObj = array();
	foreach ($feedsList as $line) {
		$feedInstanceCleaned = array();
		$feedInstancePropsArray = explode(',', $line);
		foreach ($feedInstancePropsArray as $feedInstanceProp) {
		 	$feedInstancePropsKeyValueArray = explode('=', $feedInstanceProp);
		 	$feedInstancePropsKeyValueArrayLength = count($feedInstancePropsKeyValueArray);
		 	for ($i = 0; $i < $feedInstancePropsKeyValueArrayLength;) {
		 		$feedInstanceCleaned[$feedInstancePropsKeyValueArray[$i]] = $feedInstancePropsKeyValueArray[$i+1];
		 		$i+=2;
		 	}
		}
		array_push($feedsObj,$feedInstanceCleaned);
	}

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<title>RSS</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href="css/bootstrap.css" media="screen" rel="stylesheet" type="text/css" />
	<link href="css/screen.css" media="screen" rel="stylesheet" type="text/css" />
</head>
<body>
	<section id="header" class="">
		<header>
			<div class="header-inner">
				<span class="feed-nav-container">
					<a href="#" class="btn btn-primary btn-sm toggle-nav" id="action-toggle-nav">
						<span class="glyphicon glyphicon-sort"></span><!--&nbsp;&nbsp;Feeds-->
					</a>

					<ul id="top-menu">
				<?php
					foreach ($feedsObj as $feed) {
						echo '<li><a class="feed-nav btn btn-primary btn-sm" href="#'.$feed['id'].'">
						<span class="glyphicon glyphicon-eye-open"></span>&nbsp;&nbsp;'.$feed['title'].'</a></li>';
					}

				?>
					</ul>

				</span>
				<span id="nav-current"></span>
				<span id="messages"></span>
				<span class="prefs-container">
					<a href="#" id="action-update-prefs" class="btn btn-default btn-sm">
						<span class="glyphicon glyphicon-cog"></span><!-- &nbsp;&nbsp;Update Feeds --></a>
		<!-- 			<a href="#" id="action-expand-all" data-view-all-expanded="false" class="btn btn-default btn-sm">
						<span class="glyphicon glyphicon-folder-open"></span>&nbsp;&nbsp;Expand All</a> -->
					<ul id="prefs-menu">
						<li><a href="#" id="action-update-feeds" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-cloud-download"></span>&nbsp;&nbsp;Update Feeds</a></li>
						<li><a href="#" id="onClick-update-num-items"  class="btn btn-default btn-sm"><span class="glyphicon glyphicon-filter"></span>&nbsp;&nbsp;<span id="num-items-display"></span> Items Per Feed</a></li>
						<li><a href="#" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-edit"></span>&nbsp;&nbsp;Add/Remove Feed</a></li>
						<li><a href="#" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-text-height"></span>&nbsp;&nbsp;Text Size</a></li>
					</ul>
				</span>
			</div>
		</header>
	</section>
	<section id="main" class="">
		<div id="rendered" class="container" data-num-items="2">
		<?php
			foreach ($feedsObj as $feed) {
				echo '<div id="'.$feed['id'].'" class="feed-group container well col-xs-12 col-sm-12 col-md-12 col-lg-12" data-feed-group="'.$feed['id'].'"></div>'."\r\n";
			}

		?>
		</div>
	</section>
	<div class="snippet-container">
		<form id="num-items-form" name="number-of-items" role="form" class="form-horizontal popup-form hidden">
			<div class="form-group">
				<label for="number-of-items-input" class="col-sm-2 control-label">Number of Items: </label>
    			<div class="col-sm-10">
					<input name="number-of-items-input" id="number-of-items-input" type="number" class="form-control" value="" placeholder="Enter number" />
				</div>	
			</div>
			<div class="form-group">
    			<div class="col-sm-12">
					<button id="action-update-num-items" class="btn btn-primary btn-sm"><span class="glyphicon glyphicon-check"></span>&nbsp;&nbsp;Update</button>
					<a href="#" id="action-cancel-num-item" class="btn btn-default btn-sm" role="button">Cancel</a>
				</div>
			</div>
		</form>
	</div>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="js/bootstrap.js"></script>
<script src="js/dom.js"></script>
<script src="js/nav.js"></script>
<script src="js/TabScrollerCustom.js"></script>
</body>
</html>