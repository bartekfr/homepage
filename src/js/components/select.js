var Select = (function(window) {
	"use stric";
	/**
	 * Finds and highlights search phrase in given element
	 * @param {DOM element} element
	 * @param {string} textToFind
	 * @returns {object}
	 */
	return function (element, text) {
		var root = element;
		var selection = window.getSelection();
		var endIndex = 0;;
		var range = null;
		if(typeof text !== "undefined") {
			selectTextRange();
		}

		function selectTextRange() {
			range = getRangeOfText(root, text, endIndex);
			selectRange();
		}

		function selectNextTextRange() {
			if(!range) {
				return false;
			}
			endIndex = range.endIndex;
			selectTextRange();
			if(!range) {
				endIndex = 0;
				selectTextRange();
			}
		}

		function clearSelection () {
			if (selection.empty) {  // Chrome
				selection.empty();
			} else if (selection.removeAllRanges) {  // Firefox
				selection.removeAllRanges();
			}
		}

		function selectRange() {
			if(!range) {
				return false;
			}
			clearSelection(selection);
			selection.addRange(range);
			console.log(range);
		}

		function setText(newText) {
			endIndex = 0;
			text = newText;
			selectTextRange();
		}

		return {
			setText: setText,
			selectNext: selectNextTextRange
		};
	}
})(window);

//TODO: move to separate file
(function(window, document) {
	"use stric";
	//init
	var rootEl = document.getElementById("root");
	if(!rootEl) {
		return false;
	}
	var nextBtn = document.getElementById("next");
	var textToFind = document.getElementById("textToFind");
	var findBtn = document.getElementById("find");
	var text;
	var select = Select(rootEl);

	findBtn.addEventListener("click", function() {
		text = textToFind.value;
		select.setText(text);
	}, false);

	nextBtn.addEventListener("click", function(e) {
		e.preventDefault();
		select.selectNext();
	}, false);

})(window, document);