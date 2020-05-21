// Actions
const ADD_HIGHLIGHT = "ADD";
const REMOVE_HIGHLIGHT = "REMOVE";

function highlighter(action, sel) {
	console.log(sel)
	const { anchor, focus, node, focusOffset, anchorOffset } = extractFromSel(
		sel
	);
	let anchorFlag = false;
	let focusFlag = false;

	if (sel.isCollapsed) return;
	if (focus.nodeType !== 3 && focus.getElementsByTagName("img").length > 0)
		return;
	// throw Error
	if (anchor.nodeType !== 3 && anchor.getElementsByTagName("img").length > 0)
		return;
	// throw Error
		console.log("after return statements")
	if (anchor === focus) {
		preOffset = anchorOffset <= focusOffset ? anchorOffset : focusOffset;
		postOffset = anchorOffset > focusOffset ? anchorOffset : focusOffset;
		takeAction(action, node, true, preOffset, true, postOffset);
		console.log("Recursive not taken")
	} else highlightRec(action, node);

	function highlightRec(action, node) {
		console.log("rec", node)
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
			} else if (anchorFlag || focusFlag) {
				takeAction(action, node, false, 0, false, len);
			}
			return;
		}
		node.childNodes.forEach(function (child) {
			if ((sel.containsNode(child), true)) {
				highlightRec(action, child);
			}
		});
	}

	//------------------------>

	function addDocFrag(node, preFlag, preOffset, postFlag, postOffset) {
		if (node.parentNode.className === "highlighter-ext") return;
		const frag = document.createDocumentFragment();
		const span = document.createElement("span");
		const text = node.nodeValue;
		span.style.backgroundColor = "yellow";
		span.className = "highlighter-ext";
		if (preFlag && preOffset > 0) {
			const preSpan = document.createTextNode(text.substring(0, preOffset));
			frag.appendChild(preSpan);
		}

		const spanText = text.substring(preOffset, postOffset);
		span.appendChild(document.createTextNode(spanText));
		frag.appendChild(span);
		if (postFlag && postOffset < text.length) {
			const postSpan = document.createTextNode(text.substring(postOffset));
			frag.appendChild(postSpan);
		}
		node.replaceWith(frag);
	}

	function removeDocFrag(node, preFlag, preOffset, postFlag, postOffset) {
		if (node.parentNode.className === "highlighter-ext") {
			const frag = document.createDocumentFragment();
			const text = node.nodeValue;
			if (preFlag && preOffset > 0) {
				const preSpan = document.createElement("span");
				preSpan.style.backgroundColor = "yellow";
				preSpan.className = "highlighter-ext";
				preSpan.textContent = text.substring(0, preOffset);
				frag.appendChild(preSpan);
			}

			const textNode = document.createTextNode(
				text.substring(preOffset, postOffset)
			);
			frag.appendChild(textNode);

			if (postFlag && postOffset < text.length) {
				const postSpan = document.createElement("span");
				postSpan.style.backgroundColor = "yellow";
				postSpan.className = "highlighter-ext";
				postSpan.textContent = text.substring(postOffset);
				frag.appendChild(postSpan);
			}

			node.parentNode.replaceWith(frag);
		}
	}

	function takeAction(action, node, preFlag, preOffset, postFlag, postOffset) {
		if (action === ADD_HIGHLIGHT)
			addDocFrag(node, preFlag, preOffset, postFlag, postOffset);
		else if (action === REMOVE_HIGHLIGHT)
			removeDocFrag(node, preFlag, preOffset, postFlag, postOffset);
	}

	function extractFromSel(sel) {
		let anchor = sel.anchorNode;
		let focus = sel.focusNode;
		let node = sel.nodeContainer || sel.getRangeAt(0).commonAncestorContainer;
		let focusOffset = sel.focusOffset;
		let anchorOffset = sel.anchorOffset;
		return { anchor, focus, node, focusOffset, anchorOffset };
	}
}
