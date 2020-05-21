// function dispatchHighlighter(action) {
// 	chrome.tabs.query({ active: true, currentWindow: true }, function (tabList) {
// 		chrome.tabs.sendMessage(tabList[0].id, { action: action });
// 	});
// }
chrome.runtime.onInstalled.addListener(function initialiseStorage() {
	chrome.storage.sync.set({ highlightsExt: {} });
	console.log("storage set");
});
