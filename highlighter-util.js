function extractFromSel(sel) {
	let anchor = sel.anchorNode;
	let focus = sel.focusNode;
	let range = sel.getRangeAt(0);
	let node = range.commonAncestorContainer;
	let focusOffset = sel.focusOffset;
	let anchorOffset = sel.anchorOffset;
	return { anchor, focus, node, focusOffset, anchorOffset };
}
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

function addToStorage(sel, color, url) {
	// let url=url
	// console.log(url)
	chrome.storage.sync.get("highlightsExt", function (results) {
		console.log("results --> ", results);
		console.log("highlightsExt --> ", results.highlightsExt);
		// console.log("o----> ",url);
		highlightsExt = results.highlightsExt;
		if (!highlightsExt[url]) highlightsExt[url] = [];
		//save obj + color
			let obj = new Object();
			//pickup here
			obj.anchorNode =sel.anchorNode.cloneNode(true)
			obj.anchorOffset = sel.anchorOffset;
			obj.focusNode = sel.focusNode.cloneNode(true);
			obj.focusOffset = sel.focusOffset;
			obj.isCollapsed = sel.isCollapsed;
			obj.color=color

		highlightsExt[url].push(obj);
		console.log(obj);
		chrome.storage.sync.set({ highlightsExt: highlightsExt });
		console.log("Added To storage");
	});
	retrieveFromStorage();
}

function retrieveFromStorage() {
	chrome.storage.sync.get("highlightsExt", function (results) {
		console.log(results);
		console.log(results.highlightsExt);
	});
}
