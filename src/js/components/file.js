(function() {
	var drop = document.getElementById('drop');
		if(!drop) {
			return false;
		}
		var dragSection = document.getElementById('dragAndDrop');

		var images = dragSection.getElementsByTagName('a');
		for(var i =0; i < images.length; i++) {
			images[i].ondragstart = dragstart;
			images[i].ondragend = dragend;
		}

		function dragstart(event) {
			event = event || window.event;
			event.dataTransfer.setData("text", this.innerHTML);
			this.className = "dragStart";
		}

		function dragend() {
			this.className = "";
		}

		drop.ondragenter = function(event) {
			event = event || window.event;
			event.preventDefault();
			//event.dataTransfer.dropEffect = "copy";
			return false;
		};

		drop.ondragover = function(event) {
			event = event || window.event;
			//event.preventDefault();
			return false;
		};

		var dropped = false;

		drop.ondrop = function(event) {
			if(!dropped) {
				drop.innerHTML = "";
			}
			dropped = true;
			event = event || window.event;
			//event.preventDefault();
			var files = event.dataTransfer.files;
			var result;
			if(files) {
				for (var i = 0, l = files.length; i < l; i++) {
					var f = files[i];
					var reader = new FileReader();
					if(f.type.search('image') !== (-1)){
						if(f.size < (3 * 1024 * 1024)) {
							reader.onload = function() {
								result = this.result;
								document.getElementById('drop').innerHTML += '<img src="' + result + '" />';
							};
							reader.readAsDataURL(f);
						} else {
							document.getElementById('drop').innerHTML += "File is too big. Try to upload smaller image.<br/>";
						}
					} else if(f.type.search('text') !== (-1)){
						reader.onload = function() {
							result = this.result;
							document.getElementById('drop').innerHTML += result + "<br/>" ;
						};
						reader.readAsText(f);
					}
					drop.innerHTML += "<p>File name: " + f.name + " <br/>" + "File size: " + f.size + " bytes  </p>";
				}
			}
			drop.innerHTML += event.dataTransfer.getData("text");
			return false;
		};
})();
