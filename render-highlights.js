function renderHighlights() {
	url = window.location.href;
	chrome.storage.sync.get("highlightsExt", function (results) {
		highlightsExt = results.highlightsExt;
		if (!highlightsExt[url]) return;
		for (storedObj of highlightsExt[url]) {
			renderHighlight(storedObj);
		}
	});
}

function renderHighlight(storedObj) {
	try {
		anchor = getNodeFromPath(storedObj.anchorNode);
		focus = getNodeFromPath(storedObj.focusNode);
		node = getNodeFromPath(storedObj.node);
	} catch (err) {
		return;
	}
	if (!anchor || !node || !focus) return;
	focusOffset = storedObj.focusOffset;
	anchorOffset = storedObj.anchorOffset;
	color = storedObj.color;
	action = storedObj.action;
	if (
		anchor.textContent !== storedObj.anchorString ||
		focus.textContent !== storedObj.focusString
	) {
		console.log("DOM Changed");
		return;
	}
	selObj = { anchor, focus, node, focusOffset, anchorOffset, color };
	highlighter(action, selObj);
}

renderHighlights();
