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
/*
function (clickedBtnSwitch, otherBtnSwitch, actionToPerform, actionToDisable) {
    clickedBtnSwitch = !clickedBtnSwitch
    if (clickedBtnSwitch) {
        if (otherBtnSwitch) {
            document.removeEventListener("mousep", actionToDisable)
            otherBtnSwitch=!otherBtnSwitch
        }
        document.addEventListener("mousep",actionToPerform)
    } else {
        document.removeEventListener("mouseup",actionToPerform)
    }
}
*/
function addHighlight() {
	// const url = chrome.tabs.getCurrent(function (tab) {
	// 	return tab.url;
	// });
	console.log("Mouseup");
	const sel = window.getSelection();
	highlighter(ADD_HIGHLIGHT, sel);
	addToStorage(sel, "yellow", window.location.href);
}

function removeHighlight() {
	const url = chrome.tabs.getCurrent(function (tab) {
		return tab.url;
	});
	const sel = window.getSelection();
	highlighter(REMOVE_HIGHLIGHT, sel);
	addToStorage(sel, "yellow", window.location.href);
	sel.removeAllRanges();
}

function highlightHandler(action, url) {
	const sel = window.getSelection();
	highlighter(REMOVE_HIGHLIGHT, sel);
	addToStorage(sel, "yellow", url);
	sel.removeAllRanges();
}
