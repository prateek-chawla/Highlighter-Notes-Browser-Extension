let addHighlightSwitch = false;
let removeHighlightSwitch = false;
let action, color;

chrome.runtime.onMessage.addListener(function (req) {
	if (req.action === ADD_HIGHLIGHT) {
		action = req.action;
		color = req.color;
		addHighlightSwitch = !addHighlightSwitch;
		if (addHighlightSwitch) {
			if (removeHighlightSwitch) {
				document.removeEventListener("mouseup", highlightHandler);
				removeHighlightSwitch = !removeHighlightSwitch;
			}
			document.addEventListener("mouseup", highlightHandler);
		} else {
			document.removeEventListener("mouseup", highlightHandler);
		}
	} else if (req.action === REMOVE_HIGHLIGHT) {
		action = req.action;
		color = req.color;
		removeHighlightSwitch = !removeHighlightSwitch;
		if (removeHighlightSwitch) {
			if (addHighlightSwitch) {
				document.removeEventListener("mouseup", highlightHandler);
				addHighlightSwitch = !addHighlightSwitch;
			}
			document.addEventListener("mouseup", highlightHandler);
		} else {
			document.removeEventListener("mouseup", highlightHandler);
		}
	}
});

function highlightHandler() {
	console.log("highlight handler with action ", action, "and color ", color);
	const sel = window.getSelection();
	if (sel.isCollapsed) return;
	sel.color = color;
	selObj = extractFromSel(sel);
	addToStorage(selObj, window.location.href, action);
	highlighter(action, selObj);
	sel.removeAllRanges();
}
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
