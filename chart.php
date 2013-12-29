<?php	include_once 'inc/header.html.php';?>
<div class="content-inner">
<h1 class="title"><span>Chart</span></h1>
<div>
	<p>Hold down the Ctrl key and select data. If two columns of data are selected a bar chart will be drawn, otherwise it will be a linear chart.</p>
	<table class="excelTable">
		<tr>
			<th></th>
			<th>1</th>
			<th>2</th>
		</tr>
		<tr>
			<th>A</th>
			<td><input id="a1" type ="text" value="styczeń" /></td>
			<td><input id="a2" type ="text" value="24" /></td>
		</tr>
		<tr>
			<th>B</th>
			<td><input id="b1" type ="text" value="luty"/></td>
			<td><input id="b2" type ="text" value="33" /></td>
		</tr>
		<tr>
			<th>C</th>
			<td><input id="c1" type ="text" value="marzec"/></td>
			<td><input id="c2" type ="text" value="12" /></td>
		</tr>
		<tr>
			<th>D</th>
			<td><input id="d1" type ="text" value="kwiecien"/></td>
			<td><input id="d2" type ="text" value="12" /></td>
		</tr>
	</table>
	<a class="addRow">
		Add row
	</a>
	<div class="buttons">
		<input class= "draw" type="button" value="draw" />
		<input class= "clear" type="button" value="reset" />
		
	</div>
	<div class="error">
	</div>
	<canvas id="chart" style= "width:500px; height: 500px;"></canvas>
</div>
</div>
<?php	include_once 'inc/footer.html.php';?>