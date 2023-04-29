const defaultSearches = {
  "Найти в Google": "https://google.com/search?q=%s",
  "Найти в Яндекс": "https://yandex.ru/search/?text=%s"
};

chrome.runtime.onInstalled.addListener(async () => {
  Object.entries(defaultSearches).forEach(([title], index) => {
    chrome.contextMenus.create({
      id: title,
      title,
      type: "normal",
      contexts: ["selection"],
    });
  });

  await chrome.storage.sync.set({ searches: defaultSearches });
});

chrome.contextMenus.onClicked.addListener(async (item, tab) => {
  const { searches } = await chrome.storage.sync.get("searches");

  const searchUrl = searches[item.menuItemId].replace("%s", "");
  const textToFind = item.selectionText.replaceAll(" ", "+");
  const urlToOpen = `${searchUrl}${textToFind}`;
  
  chrome.tabs.create({ url: urlToOpen, index: tab.index + 1 });
});
