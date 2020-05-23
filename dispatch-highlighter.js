let addHighlightSwitch = false;
let removeHighlightSwitch = false;

chrome.runtime.onMessage.addListener(function (req) {
	if (req.action === ADD_HIGHLIGHT) {
		addHighlightSwitch = !addHighlightSwitch;
		if (addHighlightSwitch) {
			if (removeHighlightSwitch) {
				document.removeEventListener("mouseup", removeHighlight);
				removeHighlightSwitch = !removeHighlightSwitch;
			}
			document.addEventListener("mouseup", addHighlight);
		} else {
			document.removeEventListener("mouseup", addHighlight);
		}
	} else if (req.action === REMOVE_HIGHLIGHT) {
		removeHighlightSwitch = !removeHighlightSwitch;
		if (removeHighlightSwitch) {
			if (addHighlightSwitch) {
				document.removeEventListener("mouseup", addHighlight);
				addHighlightSwitch = !addHighlightSwitch;
			}

			document.addEventListener("mouseup", removeHighlight);
		} else {
			document.removeEventListener("mouseup", removeHighlight);
		}
	}
});

function addHighlight() {
	const sel = window.getSelection();
	if (sel.isCollapsed) return;
	selObj = extractFromSel(sel);
	addToStorage(selObj, "yellow", window.location.href, ADD_HIGHLIGHT);
	highlighter(ADD_HIGHLIGHT, selObj);
	sel.removeAllRanges();
}

function removeHighlight() {
	const sel = window.getSelection();
	if (sel.isCollapsed) return;
	selObj = extractFromSel(sel);
	addToStorage(selObj, "yellow", window.location.href, REMOVE_HIGHLIGHT);
	highlighter(REMOVE_HIGHLIGHT, selObj);
	sel.removeAllRanges();
}
