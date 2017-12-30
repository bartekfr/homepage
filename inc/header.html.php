<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title>Bartek Fryzowicz</title>
		<meta name="description" content="">
 		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="css/css.css">
		<link href='http://fonts.googleapis.com/css?family=Asap:400,700' rel='stylesheet' type='text/css'>
		<script src="js/vendor/modernizr-2.6.2.min.js"></script>
	</head>
	<body>
		<!--[if lt IE 7]>
			<p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
		<![endif]-->
		<div class="wrapper">
			<header class="main-header" role="banner">
				<div class="inner">
					<h1 id="logo">
						<a title="home" href="/">
							<img src="img/BF-logo.svg" alt="logo" />
						</a>
					</h1>
					<div id="show-menu">menu</div>
					<?php $activePage = basename($_SERVER['PHP_SELF'], ".php");?>

					<nav class="main-menu" role="navigation">
						<ul >
							<li class="item"><a id="experiments" class="<?php echo ($activePage == 'index') ? 'active': ''; ?>" href="/">Experiments</a></li>
							<li class="item"><a id="portfolio" class="<?php echo ($activePage == 'projects') ? 'active': ''; ?>" href="projects">Portfolio</a></li>
						</ul>
					</nav>
				</div>

			</header>
			<main id="main" role="main">
					<article class="content inner">