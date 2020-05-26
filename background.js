const SAVE_NOTE = "SAVE_NOTE";
const RENDER_HIGHLIGHTS = "RENDER_HIGHLIGHTS";
chrome.runtime.onInstalled.addListener(initialiseStorage);
highlightExtData = {
	btnStates: {
		add: false,
		remove: false,
		clear: false,
		notes: false,
	},
	lastUsed: true,
	lastColor: "#fff475",
};

function initialiseStorage() {
	chrome.storage.sync.get("highlightsExtInit", function (results) {
		if (!results.highlightsExtInit) {
			chrome.storage.sync.set({ highlightsExt: {} });
			chrome.storage.sync.set({ notesExt: {} });
			chrome.storage.sync.set({ highlighterExtInit: true });
			chrome.storage.sync.set({ highlighterExtColor: "#fff475" });
		}
	});
}

chrome.tabs.onUpdated.addListener(renderHighlights);


function renderHighlights() {
	chrome.tabs.executeScript({ file: "render-highlights.js" }, function () {
		if (chrome.runtime.lastError) console.log(chrome.runtime.lastError.message);
	});
}
