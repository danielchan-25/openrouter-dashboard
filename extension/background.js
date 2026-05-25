const BASE = 'https://openrouter.ai/api/v1';
const KEY_STORAGE = 'openrouter_mgmt_key';

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('refreshBadge', { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'refreshBadge') await updateBadge();
});

async function updateBadge() {
  const result = await chrome.storage.local.get([KEY_STORAGE]);
  const key = result[KEY_STORAGE];
  if (!key) {
    chrome.action.setBadgeText({ text: '' });
    return;
  }
  try {
    const res = await fetch(BASE + '/key', {
      headers: { 'Authorization': 'Bearer ' + key }
    });
    if (!res.ok) {
      chrome.action.setBadgeText({ text: 'ERR' });
      chrome.action.setBadgeBackgroundColor({ color: '#f85149' });
      return;
    }
    const data = await res.json();
    const cost = data.data?.usage_daily;
    if (cost != null) {
      const text = cost >= 100 ? '$' + Math.round(cost) : '$' + cost.toFixed(2);
      chrome.action.setBadgeText({ text });
      chrome.action.setBadgeBackgroundColor({ color: '#3fb950' });
    }
  } catch (_) {}
}
