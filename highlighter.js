// Actions
const ADD_HIGHLIGHT = "ADD";
const REMOVE_HIGHLIGHT = "REMOVE";

function highlighter(action, selObj) {
	let anchorFlag = false;
	let focusFlag = false;

	const { anchor, focus, node, focusOffset, anchorOffset, color } = selObj;

	if (focus.nodeType !== 3 && focus.getElementsByTagName("img").length > 0)
		return;
	if (anchor.nodeType !== 3 && anchor.getElementsByTagName("img").length > 0)
		return;
	if (anchor === focus) {
		preOffset = anchorOffset <= focusOffset ? anchorOffset : focusOffset;
		postOffset = anchorOffset > focusOffset ? anchorOffset : focusOffset;
		takeAction(action, node, true, preOffset, true, postOffset);
	} else highlightRec(action, node);

	function highlightRec(action, node) {
		if (anchorFlag && focusFlag) return;

		if (node.nodeType === 3) {
			const len = node.nodeValue.length;
			if (node === anchor) {
				if (!anchorFlag) anchorFlag = true;
				if (!focusFlag) {
					takeAction(action, node, true, anchorOffset, false, len);
				} else {
					takeAction(action, node, false, 0, true, anchorOffset);
				}
			} else if (node === focus) {
				if (!focusFlag) focusFlag = true;
				if (!anchorFlag) {
					takeAction(action, node, true, focusOffset, false, len);
				} else {
					takeAction(action, node, false, 0, true, focusOffset);
				}
			} else if (!anchorFlag && !focusFlag) return;
			else if (anchorFlag || focusFlag) {
				takeAction(action, node, false, 0, false, len);
			}
			return;
		}
		node.childNodes.forEach(function (child) {
			highlightRec(action, child);
		});
	}
}
