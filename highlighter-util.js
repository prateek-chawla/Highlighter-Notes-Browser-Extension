function extractFromSel(sel) {
	anchor = sel.anchorNode;
	focus = sel.focusNode;
	range = sel.getRangeAt(0);
	node = range.commonAncestorContainer;
	focusOffset = sel.focusOffset;
	anchorOffset = sel.anchorOffset;
	color = sel.color || "#f5b80d";
	return { anchor, focus, node, focusOffset, anchorOffset, color };
}

function addDocFrag(node, preFlag, preOffset, postFlag, postOffset,color) {
	if (node.parentNode.className === "highlighter-ext" && node.parentNode.style.backgroundColor===color) return;
	const frag = document.createDocumentFragment();
	const span = document.createElement("span");
	const text = node.nodeValue;
	span.style.backgroundColor = color;
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
		const prevColor = node.parentNode.style.backgroundColor
		if (preFlag && preOffset > 0) {
			const preSpan = document.createElement("span");
			preSpan.style.backgroundColor = prevColor;
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
			postSpan.style.backgroundColor = prevColor;
			postSpan.className = "highlighter-ext";
			postSpan.textContent = text.substring(postOffset);
			frag.appendChild(postSpan);
		}

		node.parentNode.replaceWith(frag);
	}
}

function takeAction(action, node, preFlag, preOffset, postFlag, postOffset,color) {
	if (action === ADD_HIGHLIGHT)
		addDocFrag(node, preFlag, preOffset, postFlag, postOffset,color);
	else if (action === REMOVE_HIGHLIGHT)
		removeDocFrag(node, preFlag, preOffset, postFlag, postOffset);
}

function addToStorage(selObj, url, action) {
	anchorPath = getPath(selObj.anchor);
	focusPath = getPath(selObj.focus);
	nodePath = getPath(selObj.node);
	chrome.storage.sync.get("highlightsExt", function (results) {
		highlightsExt = results.highlightsExt;
		if (!highlightsExt[url]) highlightsExt[url] = [];
		let obj = new Object();
		obj.anchorNode = anchorPath;
		obj.anchorOffset = selObj.anchorOffset;
		obj.focusNode = focusPath;
		obj.node = nodePath;
		obj.focusOffset = selObj.focusOffset;
		obj.isCollapsed = selObj.isCollapsed;
		obj.color = selObj.color;
		obj.anchorString = selObj.anchor.textContent;
		obj.focusString = selObj.focus.textContent;
		obj.action = action;
		highlightsExt[url].push(obj);
		chrome.storage.sync.set({ highlightsExt: highlightsExt }, () => {
			console.log("Added To Storage");
		});
	});
}

function getPath(node) {
	let path = [];
	let parent;
	if (node === document.documentElement) return path;
	while (node !== document.body) {
		parent = node.parentNode;
		let idx = Array.prototype.indexOf.call(parent.childNodes, node);
		path.push(idx);
		node = parent;
	}
	return path;
}

function getNodeFromPath(path) {
	node = document.body;
	for (let idx = path.length - 1; idx >= 0; idx--) {
		if (!node) return null;
		node = node.childNodes[path[idx]];
	}
	return node;
}
