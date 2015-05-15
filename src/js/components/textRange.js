/**
 * @author Bartek Fryzowicz
 * Finds text in given element and returns Range object representing it
 * @param {DOM element} element
 * @param {string} textToFind
 * @param {number} startIndex
 * @returns {Range}
*/
function getRangeOfText(element, textToFind, startIndex) {
	"use strict";
	var rootIsElement = element instanceof Element;
	var textIsString = typeof textToFind === "string";
	if(!rootIsElement || !textIsString) {
		throw "Invalid arguments";
	}
	if(typeof startIndex === "undefined") {
		startIndex = 0;
	}

	return findRangeForTextInElement(element, textToFind, startIndex);

	/**
	 * Returns Range object representing text in given element
	 * @param {DOM element} node
	 * @param {string} text
	 * @param {number} start
	 * @returns {Range}
	*/
	function findRangeForTextInElement(node, text, start) {
		var range = document.createRange();
		var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
		var caret = 0;
		var currentNode = null;
		var l = 0;
		var startSet = false;
		var endSet = false;
		var textLength = text.length;
		var textGlobalStartIndex = node.textContent.indexOf(text, start);
		var textGolablEndIndex = textGlobalStartIndex + textLength;
		if(textGlobalStartIndex < 0) {
			return null;
		}
		while(walker.nextNode()) {
			currentNode = walker.currentNode;
			l = currentNode.textContent.length;
			caret += l;
			//set start position of a range
			if((caret >= textGlobalStartIndex) && !startSet) {
				var startOffset = l - (caret - textGlobalStartIndex);
				range.setStart(currentNode, startOffset);
				startSet = true;
			}
			//if range start position has been already set, try to set end position
			if(startSet && (caret >= textGolablEndIndex)) {
				var endOffset = l - (caret - textGolablEndIndex);
				range.setEnd(currentNode, endOffset);
				endSet = true;
				break;
			}
		}
		range.endIndex = textGolablEndIndex;
		return (startSet && endSet) ? range : null;
	}

	function isInline(node) {
		var tagName = node.tagName;
		var inlineElements = ["SPAN", "STRONG"]; // to do: list all inline elements
		var index = inlineElements.indexOf(tagName);
		return index >= 0 ? true: false;
	}
}