// Background script for Chrome extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Bookmark Manager extension installed');
});

// Handle bookmark operations
chrome.bookmarks.onCreated.addListener((id, bookmark) => {
  console.log('Bookmark created:', bookmark);
});

chrome.bookmarks.onRemoved.addListener((id, removeInfo) => {
  console.log('Bookmark removed:', id);
});

chrome.bookmarks.onChanged.addListener((id, changeInfo) => {
  console.log('Bookmark changed:', id, changeInfo);
});