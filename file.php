<?php	include_once 'inc/header.html.php';?>
	<h1 class="title"><span>Local files reading with native drag and drop</span></h1>
	<div id="dragAndDrop">
		<p>Drag image in green box over the yellow cointainer and drop it to add it to drop area.<br/>
		You can also drag and drop your local image or text files but because it is new HTML5 feature result depends on browser.
		</p>
		<ul>
			<li><a draggable="true" href="#"><img width="200" src="img/big-banner1.jpg" /></a></li>
			<li><a draggable="true" href="#"><img width="200" src="img/big-banner2.jpg" /></a></li>
			<li><a draggable="true" href="#"><img width="200" src="img/big-banner3.jpg" /></a></li>
		</ul>
		<div id="drop" ><h1>Drop image here</h1></div>
	</div>
<?php	include_once 'inc/footer.html.php';?>