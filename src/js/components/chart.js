/*
@author: Bartlomiej Fryzowicz
All rights reserved.
e-mail: bfryzowicz@gmail.com
*/
(function($) {
 $.fn.chart = function(data, options) {
		var values = [];
		var names = [];
		var index = 0;
		$.each(data, function(i, val){
			values[index] = val;
			names[index] = i;
			index++;
		}); // convert key-value object to two separate arrays width keys and values :
		var width = this.width();//canvas real size
		var height = this.height();
		var canvasPadding = 40;
		var realWidth = width - canvasPadding; // chart area width
		var realHeight = height - 2 * canvasPadding;
		var realX0 = 0 + canvasPadding ; // real X0 and real Y0 - coordinates of chart  point 0 in real canvas unit
		var realY0 = height - canvasPadding;
		var max = 0;
		$(values).each(function(i) {
			if(values[i] > max) {
				max = values[i];
			}
		}); // max value
		var scale = (realHeight - 20) / max; //ratio between data and canvas unit
		var scaleValues = $.map(values, function(el, i) {
			return values[i] * scale;
		});  // value scaled to canvas unit - use it for draw
		var settings = $.extend( {
			color : '#f00',
			title : "Example chart",
			spacing : 30,
			unit: Math.pow(10, max.toString().length - 1),
			axisFont: "10px Arial",
			chartWidth: 1
		}, options);
		var numberOfColumn = values.length; // number of data
		var fullWidth = (width - 2 * canvasPadding)/numberOfColumn;
		var colWidth = fullWidth - settings.spacing;

		function drawAxis (context) {
			var strokeWidth = 1;
			var x0 = realX0 + 0.5 ;
			var y0 = realY0 + 0.5;
			context.strokeStyle = "#000";
			context.lineWidth = strokeWidth;

			// y axis
			context.beginPath();
			context.moveTo(x0, 5 + canvasPadding);
			context.lineTo(x0, y0 + 1); //add 2
			context.stroke();
			context.closePath();

			//x axis
			context.beginPath();
			context.moveTo(x0 - 5, y0);
			context.lineTo(realWidth - 5, y0);
			context.stroke();

			//arrows
			// y arrow
			context.lineWidth = 1;
			context.beginPath();
			context.moveTo(x0, 0 + canvasPadding);
			context.lineTo(x0 + 4, 15 + canvasPadding);
			context.lineTo(x0 - 4, 15 + canvasPadding);
			context.closePath();
			context.fill();
			context.closePath();
			//x arrow
			context.beginPath();
			context.moveTo(realWidth, y0);
			context.lineTo(realWidth - 15, y0 - 4);
			context.lineTo(realWidth - 15, y0 + 4);
			context.closePath();
			context.fill();
			context.closePath();
			// y values
			var unit = settings.unit ;
			var steps = max / unit + 1;
			var arrowY = canvasPadding + 15;
			var scaleUnit = unit * (scale);
			//y values
			for (var i = 0; i < steps ; i++) {
				var y = y0 -i * scaleUnit;
				if (y <= arrowY) {
					break;
				}

				if(i !== 0) {
					context.fillRect(x0 - 5, y, 5, 1);
				}
				context.font = settings.axisFont;
				context.fillText( unit * i, 5, y - 4);
			}

			for (var j = 0; j < numberOfColumn ; j++) {
				context.font = settings.axisFont;
				context.fillText( names[j], x0 + j * fullWidth, y0 + 10);
			}

		}

		return this.each(function() {

			var canvas = $(this).attr({width: width, height: height});
			//G_vmlCanvasManager.initElement(canvas);

			var ctx = canvas[0].getContext('2d');
			//translate by fractional pixels to draw sharp 1px width axis
			//ctx.translate(0.5, 0.5);
			var prevStep = realX0,
				prevVal = realY0 - scaleValues[0];

			ctx.lineWidth = settings.chartWidth;
			for(var i= 0; i < numberOfColumn; i++){
				var val = scaleValues[i];
				var x, y;
				ctx.fillStyle = settings.color;

				if (Object.prototype.toString.call( data ) === '[object Array]' ) {
					x = i * fullWidth + realX0;
					y = realY0 - val;
					ctx.beginPath();
					ctx.moveTo(prevStep, prevVal);
					ctx.lineTo(x, y);
					ctx.stroke();
					ctx.closePath();
					ctx.beginPath();
					ctx.arc(x, y, 2, (Math.PI / 180) * 0, (Math.PI / 180) * 360);
					ctx.fill();
					ctx.closePath();
					prevVal = y;
					prevStep = x;
				} else {
					ctx.fillRect (fullWidth * i + realX0, realY0 - val, colWidth, val);
				}

			}
			ctx.fillStyle = "#000";
			ctx.textBaseline = 'top';
			ctx.font = "14pt Arial";
			ctx.fillText( settings.title, realX0, 10);
			drawAxis(ctx);

		});
  };
})(jQuery);

var createExcel;
(function($) {
	createExcel = function(elementSelector){
		var $this = this;
		this.table = $(elementSelector);
		this.ctrlPressed = false;
		this.selectedInputs = $('input.active', $this.table);
		this.isThereSecondColumn = false;
		this.clearButton = $('.clear');
		this.addRowButton = $('.addRow');
		this.error= '';
		this.errorBtn = $('.error');

		var $document = $(document);
		$document.off('.excel');
		$this.addRowButton.on('click', function(){
			var lastRow = $('tr:last-child', $this.table);
			var rowNumber = $('tr', $this.table).size();
			var columnNumber = lastRow.find('td').length + 1;
			var letterNumber  = 65 + rowNumber - 1 ;
			var letterCode  = String.fromCharCode(letterNumber);
			var newLastRow = $('<tr><th>' + letterCode + '</th></tr>').insertAfter(lastRow);
			for(var i = 1; i < columnNumber; i++) {
				var inputId = letterCode.toLowerCase() + i;
				inputId = unescape(inputId);
				var input = '<input type="text" value="" id="' + inputId + '" />';
				newLastRow.append('<td>' + input + '</td>');
			}
		});

		$this.clearButton.on('click', function(){
			$this.selectedInputs.removeClass('active');
			$this.firstColumn = '';
			$this.firstColumnInput = '';
			$this.firstColumnValues = '';
			$this.secondColumnInput = '';
			$this.secondColumnValues = '';
			$this.isThereSecondColumn = false;
			$this.errorBtn.html('');
			$this.error = '';
		});

		$document.on('keydown.excel',  function(e) {
			if(e.which === 17) {
				$this.ctrlPressed = true;
			}
		});

		$document.on('keyup.excel',  function(e) {
			if(e.which === 17) {
				$this.selectedInputs = $('input.active', $this.table);
				$this.ctrlPressed = false;
				$this.findColumns($this.selectedInputs);
				$this.separateColumns($this.selectedInputs);
				$this.getValues();
				$this.validate();
				$this.createFinalDataObject();
				$this.showErrors();
			}
		});

		$this.table.on('mouseover', 'input', function(e){
			var element = $(this);
			if($this.ctrlPressed) {
				$this.markAsReaded(element);
			}
		});
	};

	createExcel.prototype.markAsReaded = function(el) {
		el.addClass('active');
	};

	createExcel.prototype.checkWhichColumn =  function(element){
		var id = element.attr('id');
		var column = id.slice(1,2);
		return column;
	};

	createExcel.prototype.findColumns = function(inputs) {
		var $this = this;
		this.firstColumn = this.checkWhichColumn(inputs.eq(0));
		inputs.each(function() {
			var col = $this.checkWhichColumn($(this));
			if (col !== $this.firstColumn) {
				$this.secondColumn = col;
				$this.isThereSecondColumn = true;
			}
		});
	};

	createExcel.prototype.separateColumns = function(inputs) {
		var $this = this;
		$this.firstColumnInputs = inputs.filter(function(){
			return $(this).attr('id').search($this.firstColumn) + 1;
		});

		if ($this.isThereSecondColumn) {
			$this.secondColumnInputs = inputs.filter(function(){
				return $(this).attr('id').search($this.secondColumn) + 1;
			});
		}
	};

	createExcel.prototype.getValues =  function() {
		this.firstColumnValues = this.firstColumnInputs.map(function(){
			return $(this).val();
		});
		if(this.isThereSecondColumn) {
			this.secondColumnValues = this.secondColumnInputs.map(function(){
				return $(this).val();
			});
		}
	};

	createExcel.prototype.validate = function() {
		if(this.isThereSecondColumn && this.firstColumnValues.length !== this.secondColumnValues.length) {
			this.error += 'thre is not enough data' + '<br/>';
		} else {
			this.error = '';
		}
	};

	createExcel.prototype.showErrors = function(){
		this.errorBtn.html(this.error);
	};

	createExcel.prototype.createFinalDataObject = function() {
		var $this = this;
		var i = 0;
		if($this.isThereSecondColumn) {
			$this.dataFinal = {};
			for(i = 0; i < $this.firstColumnValues.length; i++) {

				$this.dataFinal[$this.firstColumnValues[i]] = parseFloat($this.secondColumnValues[i]);
			}
		} else {
			$this.dataFinal = [];
			for(i = 0; i < $this.firstColumnValues.length; i++) {
				$this.dataFinal[i] = parseFloat($this.firstColumnValues[i]);
				if(isNaN($this.dataFinal[i])) {
					$this.error = 'Values are not numeric';
					$this.selectedInputs.removeClass('active');
				}
			}
		}
	};
})(jQuery);

if($('.excelTable').length) {
	var grid = new createExcel('.excelTable');
	$('.draw').on('click', function(){
		$('#chart').chart(grid.dataFinal, {color: "#595959"});
	});
}










//-----------------------------------------------------------------------------------
