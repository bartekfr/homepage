<?php	include_once 'inc/header.html.php';?>
	<h1 class="title"><span>Importance of transformation order</span></h1>
	<p>
		We can think about performing a multiple transformations in two ways. We can consider fixed or a moving (local) coordinates system.
		In the first case,
		the object is transformed itself and the transformation functions are applied in the opposite order compared to how they are written in CSS.
		In the second case, however, we transform a local coordinates system attached to object and order of transformation is the same as in CSS.
		<br/>In both cases the end result is of course the same.<br/>
		Because of my leziness, examples below work fine only in firefox and opera for the moment.

	</p>
<section class="order">
	<h1>Rotate x Scale</h1>
	<h2>multiple transformation functions applied to single element</h2>
	<div class="c" style="transform: rotate(-45deg) scale(2, 1); transform">rotate x scale</div>
	<h2>equivalent transformation obtained with nested elements and one transformation function per element </h2>
	<div class="b" style="transform: rotate(-45deg)">rotate
		<div class="c" style="transform: scale(2, 1)">scale</div>
	</div>
	<!--rotatin matrix x scale matrix -->
	<h2>corresponding transformation matrix applied to single element</h2>
	<div class="c" style="transform: matrix( 1.414, -1.414, 0.707, 0.707, 0, 0	)">rotate x scale
	</div>
</section>


<section class="order">
	<h1>Scale x Rotate</h1>
	<h2>multiple transformation functions applied to single element</h2>
	<div class="c" style="transform:  scale(2, 1) rotate(-45deg)">scale x rotate</div>
	<h2>equivalent transformation obtained with nested elements and one transformation function per element </h2>
	<div class="b" style="transform: scale(2, 1)">scale
		<div class="c" style="transform: rotate(-45deg)">rotate</div>
	</div>
	<!--scale matrix x rotation matrix -->
	<h2>corresponding transformation matrix applied to single element</h2>
	<div class="c" style="transform: matrix( 1.414, -0.707, 1.414, 0.707, 0, 0	)">scale x rotate
	</div>
</section>
<section class="order">
	<!-- translateX x rotate-->
	<h1>TranslateX x Rotate</h1>
	<h2>multiple transformation functions applied to single element</h2>
	<div class="c" style="transform: translate(30px, 0) rotate(90deg)">translate x rotate</div>
	<h2>equivalent transformation obtained with nested elements and one transformation function per element </h2>
	<div class="b" style="transform: translate(30px, 0)">translate
		<div class="c" style="transform: rotate(90deg)">rotate</div>
	</div>
	<h2>corresponding transformation matrix applied to single element</h2>
	<div class="c" style="transform: matrix( 0, 1, -1, 0, 30, 0); clear: both">translate x rotate
	</div>
</section>
<section class="order">
	<!-- rotate x trabnslate-->
	<h1>Rotate x TranslateX</h1>
	<h2>multiple transformation functions applied to single element</h2>
	<div class="c" style="transform:  rotate(90deg) translate(30px, 0)">rotate x translate</div>
	<h2>equivalent transformation obtained with nested elements and one transformation function per element </h2>
	<div class="b" style="transform: rotate(90deg)">rotate
		<div class="c" style="transform: translate(30px, 0)">translate</div>
	</div>
	<h2>corresponding transformation matrix applied to single element</h2>
	<div class="c" style="transform: matrix( 0, 1, -1, 0, 0, 30); clear: both">rotate x translate
	</div>
</section>
<?php	include_once 'inc/footer.html.php';?>