chrome.runtime.onInstalled.addListener(initialiseStorage);
chrome.tabs.onUpdated.addListener(renderHighlights);

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

function renderHighlights() {
	chrome.tabs.executeScript({ file: "content-scripts/render-highlights.js" }, function () {
		if (chrome.runtime.lastError) console.log(chrome.runtime.lastError.message);
	});
}