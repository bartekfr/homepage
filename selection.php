<?php	include_once 'inc/header.html.php';?>
	<h1 class="title"><span>Highlight search text</span></h1>
	<p>Works in Firefox and Chrome</p>
	<div class="selection">
		<form id="form">
			<input type="text" id="textToFind" />
			<span class="buttons">
				<input type="submit" value="find" id="find" />
			</span>
			<a href="#" id="next">Next</a>
		</form>
		<div class="lorem-text" id="root">
			<section>
				<p><span>apple</span></p>
			</section>
			<section>
				<p>
				<span>lorem apple pie this is apple pie</span></p><p>he is another <strong>apple pie</strong>
				</p>
			</section>
			<section>
				<p>
					Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
				</p>
			</section>
		</div>
	</div>
<?php	include_once 'inc/footer.html.php';?>