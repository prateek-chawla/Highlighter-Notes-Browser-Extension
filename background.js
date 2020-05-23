chrome.runtime.onInstalled.addListener(initialiseStorage);

function initialiseStorage() {
	chrome.storage.sync.get("highlightsExtInit", function (results) {
		if (!results.highlightsExtInit) {
			chrome.storage.sync.set({ highlightsExt: {} });
			chrome.storage.sync.set({ notesExt: {} });
			chrome.storage.sync.set({ highlighterExtInit: true });
		}
	});
}

chrome.tabs.onUpdated.addListener(function renderHighlights() {
	chrome.tabs.executeScript({ file: "render-highlights.js" }, function () {
		if (chrome.runtime.lastError) console.log(chrome.runtime.lastError.message);
	});
});
