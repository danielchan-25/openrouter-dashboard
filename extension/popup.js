const BASE = 'https://openrouter.ai/api/v1';
const KEY_STORAGE = 'openrouter_mgmt_key';
const THEME_STORAGE = 'openrouter_theme';
const LANG_STORAGE = 'openrouter_lang';
const REFRESH_INTERVAL = 30000;

let refreshTimer = null;
let loadingCount = 0;
let currentLang = 'zh-CN';
let storedKey = null;

const LANG = {
  'zh-CN': {
    title: 'OpenRouter 仪表盘', refresh: '刷新',
    keyPlaceholder: '输入你的 Management Key...', save: '保存', clear: '清除',
    loading: '加载中...', updatedAt: '更新于 ',
    creditSummary: '额度概览', totalLimit: '总额度', totalUsed: '已用量',
    remaining: '剩余量', todayCost: '费用', weekCost: '本周', monthCost: '本月',
    todayReqToken: '请求 / Token', weekReqToken: '本周', monthReqToken: '本月',
    delayNote: '统计延迟约 1 天',
    accountCredits: '信用额度', purchased: '已购买', consumed: '已消耗',
    remainingCredits: '剩余额度',
    summary: '汇总',
    totalRequests: '总请求数', promptTokens: 'Prompt Tokens', completionTokens: 'Completion Tokens',
    needsMgmtKey: '需 Management Key', noLimitSet: '未设置额度限制',
    enterKey: '请输入有效的 API Key',
    themeLight: '白天', themeDark: '夜晚', themeAuto: '系统自动',
    keyExpires: 'Key 将于 {d} 天后过期', keyExpired: 'Key 已过期', keyNever: '永不过期',
    fullVersion: '查看完整版 ↗',
    refreshHint: '每 30 秒自动刷新',
    summaryDelay: '（活动数据延迟约 1 天）',
    usageByModel: '各模型用量（汇总）',
    model: '模型', requests: '请求数', prompt: 'Prompt', completion: 'Completion', cost: '费用',
    recentActivity: '最近使用记录', date: '日期', provider: '提供商',
    noActivity: '暂无活动数据', noRecords: '暂无使用记录',
  },
  'zh-TW': {
    title: 'OpenRouter 儀表板', refresh: '重新整理',
    keyPlaceholder: '輸入你的 Management Key...', save: '儲存', clear: '清除',
    loading: '載入中...', updatedAt: '更新於 ',
    creditSummary: '額度概覽', totalLimit: '總額度', totalUsed: '已用量',
    remaining: '剩餘量', todayCost: '費用', weekCost: '本週', monthCost: '本月',
    todayReqToken: '請求 / Token', weekReqToken: '本週', monthReqToken: '本月',
    delayNote: '統計延遲約 1 天',
    accountCredits: '信用額度', purchased: '已購買', consumed: '已消耗',
    remainingCredits: '剩餘額度',
    summary: '彙總',
    totalRequests: '總請求數', promptTokens: 'Prompt Tokens', completionTokens: 'Completion Tokens',
    needsMgmtKey: '需 Management Key', noLimitSet: '未設定額度限制',
    enterKey: '請輸入有效的 API Key',
    themeLight: '白天', themeDark: '夜晚', themeAuto: '系統自動',
    keyExpires: 'Key 將於 {d} 天後過期', keyExpired: 'Key 已過期', keyNever: '永不過期',
    fullVersion: '查看完整版 ↗',
    refreshHint: '每 30 秒自動重新整理',
    summaryDelay: '（活動數據延遲約 1 天）',
    usageByModel: '各模型用量（彙總）',
    model: '模型', requests: '請求數', prompt: 'Prompt', completion: 'Completion', cost: '費用',
    recentActivity: '最近使用記錄', date: '日期', provider: '提供商',
    noActivity: '暫無活動數據', noRecords: '暫無使用記錄',
  },
  'en': {
    title: 'OpenRouter Dashboard', refresh: 'Refresh',
    keyPlaceholder: 'Enter your Management Key...', save: 'Save', clear: 'Clear',
    loading: 'Loading...', updatedAt: 'Updated at ',
    creditSummary: 'Credit Summary', totalLimit: 'Total Limit', totalUsed: 'Used',
    remaining: 'Remaining', todayCost: 'Cost', weekCost: 'Week', monthCost: 'Month',
    todayReqToken: 'Req / Token', weekReqToken: 'Week', monthReqToken: 'Month',
    delayNote: '~1 day delay',
    accountCredits: 'Account Credits', purchased: 'Purchased', consumed: 'Consumed',
    remainingCredits: 'Remaining',
    summary: 'Summary',
    totalRequests: 'Total Requests', promptTokens: 'Prompt Tokens', completionTokens: 'Completion Tokens',
    needsMgmtKey: 'Requires Mgmt Key', noLimitSet: 'No limit set',
    enterKey: 'Please enter a valid API Key',
    themeLight: 'Light', themeDark: 'Dark', themeAuto: 'Auto',
    keyExpires: 'Key expires in {d} days', keyExpired: 'Key has expired', keyNever: 'Never expires',
    fullVersion: 'Open full version ↗',
    refreshHint: 'Auto-refresh every 30s',
    summaryDelay: '(~1 day delay)',
    usageByModel: 'Usage by Model',
    model: 'Model', requests: 'Requests', prompt: 'Prompt', completion: 'Completion', cost: 'Cost',
    recentActivity: 'Recent Activity', date: 'Date', provider: 'Provider',
    noActivity: 'No activity data', noRecords: 'No records',
  },
};

const EMOJI_MAP = {
  title: '📊', creditSummary: '💳', totalLimit: '💰', totalUsed: '📊', remaining: '📦',
  todayCost: '💵', weekCost: '🗓️', monthCost: '📆',
  todayReqToken: '📈', weekReqToken: '📈', monthReqToken: '📈',
  accountCredits: '🏦', purchased: '🛒', consumed: '🔥', remainingCredits: '💎',
  summary: '📋', totalRequests: '🔄', promptTokens: '📝', completionTokens: '✅',
  usageByModel: '🤖', model: '🧠', requests: '🔄', prompt: '📝', completion: '✅', cost: '💵',
  recentActivity: '📜', date: '🗓️', provider: '🔌',
  noActivity: '📭', noRecords: '📭',
  loading: '⏳', refresh: '🔄',
};

function t(key) {
  let s = (LANG[currentLang] && LANG[currentLang][key]) || key;
  if (EMOJI_MAP[key]) s = EMOJI_MAP[key] + ' ' + s;
  return s;
}
function tfmt(key, data) {
  let s = t(key);
  for (const [k, v] of Object.entries(data)) s = s.replace('{' + k + '}', v);
  return s;
}

const $ = s => document.querySelector(s);
const apiKeyInput = $('#apiKeyInput');
const saveKeyBtn = $('#saveKeyBtn');
const clearKeyBtn = $('#clearKeyBtn');
const toggleKeyVis = $('#toggleKeyVis');
const dashboard = $('#dashboard');
const loading = $('#loading');
const errorEl = $('#error');
const refreshBtn = $('#refreshBtn');
const lastUpdated = $('#lastUpdated');
const themeSelect = $('#themeSelect');
const langSelect = $('#langSelect');
const modelBody = $('#modelBody');
const logBody = $('#logBody');

function getKey() { return storedKey; }
function setKey(v) {
  storedKey = v;
  if (v) chrome.storage.local.set({ [KEY_STORAGE]: v });
  else chrome.storage.local.remove(KEY_STORAGE);
}
async function loadStored() {
  return new Promise(resolve => {
    chrome.storage.local.get([KEY_STORAGE, THEME_STORAGE, LANG_STORAGE], result => {
      storedKey = result[KEY_STORAGE] || null;
      currentLang = result[LANG_STORAGE] || 'zh-CN';
      const savedTheme = result[THEME_STORAGE] || 'auto';
      resolve(savedTheme);
    });
  });
}

/* ---- Theme ---- */
function getSystemTheme() {
  const h = new Date().getHours();
  return h >= 6 && h < 18 ? 'light' : 'dark';
}
function applyTheme(mode) {
  if (mode === 'auto') mode = getSystemTheme();
  document.documentElement.setAttribute('data-theme', mode);
}
themeSelect.addEventListener('change', () => {
  const v = themeSelect.value;
  chrome.storage.local.set({ [THEME_STORAGE]: v });
  applyTheme(v);
});
function startThemeTimer() {
  const msToNextMin = (60 - new Date().getSeconds()) * 1000 - new Date().getMilliseconds();
  setTimeout(() => {
    if (themeSelect.value === 'auto') applyTheme('auto');
    setInterval(() => {
      if (themeSelect.value === 'auto') applyTheme('auto');
    }, 60000);
  }, msToNextMin);
}

/* ---- Language ---- */
function applyLanguage() {
  currentLang = langSelect.value;
  chrome.storage.local.set({ [LANG_STORAGE]: currentLang });
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  const tl = { light: '\u2600\ufe0f ', dark: '\u{1f319} ', auto: '\u{1f504} ' };
  const tk = { light: 'themeLight', dark: 'themeDark', auto: 'themeAuto' };
  for (const [v, k] of Object.entries(tk)) {
    const o = themeSelect.querySelector('option[value="' + v + '"]');
    if (o) o.textContent = tl[v] + t(k);
  }
  apiKeyInput.placeholder = t('keyPlaceholder');
  document.title = t('title');
  if (!dashboard.classList.contains('hidden')) refresh();
  updateLastUpdated();
}
langSelect.addEventListener('change', applyLanguage);

/* ---- Formatting ---- */
function fmtCurrency(n) {
  if (n == null || isNaN(n)) return '—';
  return (n < 0 ? '-$' : '$') + Math.abs(n).toFixed(2);
}
function fmtTokens(n) {
  if (n == null || isNaN(n)) return '—';
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 10_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}
function fmtNumber(n) {
  if (n == null || isNaN(n)) return '—';
  return n.toLocaleString();
}
function fmtTime() { return new Date().toLocaleTimeString(); }

/* ---- Loading ---- */
function setLoading(on) {
  loadingCount += on ? 1 : -1;
  const show = loadingCount > 0;
  loading.classList.toggle('hidden', !show);
  dashboard.classList.toggle('hidden', show);
}

/* ---- API ---- */
function headers() { return { 'Authorization': 'Bearer ' + getKey(), 'Content-Type': 'application/json' }; }
async function apiGet(path) {
  const res = await fetch(BASE + path, { headers: headers() });
  if (!res.ok) {
    let body = '';
    try { body = await res.text(); } catch (_) {}
    throw new Error('HTTP ' + res.status + (body ? ': ' + body.slice(0, 300) : ''));
  }
  return res.json();
}
function showError(msg) {
  if (!msg) { errorEl.classList.add('hidden'); return; }
  errorEl.textContent = msg;
  errorEl.classList.remove('hidden');
}

/* ---- Data processing ---- */
function processActivity(items) {
  if (!items || !items.length) return null;
  const byModel = {};
  let totalReqs = 0, totalPrompt = 0, totalCompletion = 0;
  const periodReqs = { today: 0, week: 0, month: 0 };
  const periodToks = { today: 0, week: 0, month: 0 };
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const wk = new Date(now); wk.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const weekStart = wk.toISOString().slice(0, 10);
  const monthStart = now.toISOString().slice(0, 7) + '-01';
  for (const item of items) {
    const m = item.model || item.model_permaslug || 'unknown';
    if (!byModel[m]) byModel[m] = { requests: 0, prompt: 0, completion: 0, cost: 0 };
    byModel[m].requests += item.requests || 0;
    byModel[m].prompt += item.prompt_tokens || 0;
    byModel[m].completion += item.completion_tokens || 0;
    byModel[m].cost += item.usage || 0;
    totalReqs += item.requests || 0;
    totalPrompt += item.prompt_tokens || 0;
    totalCompletion += item.completion_tokens || 0;
    const d = item.date;
    const r = item.requests || 0;
    const to = (item.prompt_tokens || 0) + (item.completion_tokens || 0);
    if (d === today) { periodReqs.today += r; periodToks.today += to; }
    if (d >= weekStart) { periodReqs.week += r; periodToks.week += to; }
    if (d >= monthStart) { periodReqs.month += r; periodToks.month += to; }
  }
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));
  const modelSorted = Object.entries(byModel).sort((a, b) => b[1].requests - a[1].requests);
  return { totalReqs, totalPrompt, totalCompletion, modelSorted, sorted, periodReqs, periodToks };
}

/* ---- Render ---- */
function renderKeyData(d) {
  if (!d.data) {
    for (const id of ['totalLimit', 'totalUsed', 'remaining', 'todayUsage', 'weekUsage', 'monthUsage']) {
      $('#' + id).textContent = '—';
    }
    $('#remaining').className = 'value';
    $('#keyExpiry').className = 'hidden';
    return;
  }
  const { limit, usage: used, limit_remaining: remaining,
          usage_daily, usage_weekly, usage_monthly, expires_at } = d.data;
  if (limit != null) {
    $('#totalLimit').textContent = fmtCurrency(limit);
  } else {
    $('#totalLimit').textContent = t('noLimitSet');
    $('#totalLimit').style.fontSize = '14px';
  }
  $('#totalUsed').textContent = fmtCurrency(used);
  const remainingEl = $('#remaining');
  remainingEl.textContent = fmtCurrency(remaining);
  remainingEl.className = 'value';
  if (remaining != null) {
    if (remaining <= 0) remainingEl.classList.add('red');
    else if (limit != null && remaining < limit * 0.2) remainingEl.classList.add('yellow');
    else if (limit == null && remaining < 1) remainingEl.classList.add('yellow');
    else remainingEl.classList.add('green');
  }
  $('#todayUsage').textContent = fmtCurrency(usage_daily);
  $('#weekUsage').textContent = fmtCurrency(usage_weekly);
  $('#monthUsage').textContent = fmtCurrency(usage_monthly);

  const expiryEl = $('#keyExpiry');
  if (!expires_at) {
    expiryEl.className = 'hidden';
  } else {
    const diff = new Date(expires_at) - new Date();
    const days = Math.ceil(diff / 86400000);
    if (days <= 0) {
      expiryEl.textContent = t('keyExpired');
      expiryEl.className = 'danger';
    } else if (days <= 7) {
      expiryEl.textContent = tfmt('keyExpires', { d: days });
      expiryEl.className = 'warn';
    } else {
      expiryEl.className = 'hidden';
    }
  }
}

function renderCreditsData(d) {
  if (!d.data) {
    for (const id of ['creditsPurchased', 'creditsConsumed', 'creditsRemaining']) {
      $('#' + id).textContent = '—';
    }
    $('#creditsRemaining').className = 'value';
    return;
  }
  const { total_credits, total_usage } = d.data;
  const purchased = total_credits ?? 0;
  const consumed = total_usage ?? 0;
  const remaining = purchased - consumed;
  $('#creditsPurchased').textContent = fmtCurrency(purchased);
  $('#creditsConsumed').textContent = fmtCurrency(consumed);
  const el = $('#creditsRemaining');
  el.textContent = fmtCurrency(remaining);
  el.className = 'value';
  if (remaining <= 0) el.classList.add('red');
  else if (remaining < purchased * 0.2) el.classList.add('yellow');
  else el.classList.add('green');
}

function renderActivityData(result) {
  if (!result) {
    $('#totalRequests').textContent = '—';
    $('#totalPromptTokens').textContent = '—';
    $('#totalCompletionTokens').textContent = '—';
    modelBody.innerHTML = '<tr><td colspan="5" style="color:var(--text-secondary);text-align:center;padding:18px;">' + t('noActivity') + '</td></tr>';
    return;
  }
  const { totalReqs, totalPrompt, totalCompletion, modelSorted } = result;
  $('#totalRequests').textContent = fmtNumber(totalReqs);
  $('#totalPromptTokens').textContent = fmtTokens(totalPrompt);
  $('#totalCompletionTokens').textContent = fmtTokens(totalCompletion);

  modelBody.innerHTML = '';
  for (const [model, data] of modelSorted) {
    modelBody.insertAdjacentHTML('beforeend', `
      <tr>
        <td class="model-name" title="${model}">${model}</td>
        <td class="numeric">${fmtNumber(data.requests)}</td>
        <td class="numeric">${fmtTokens(data.prompt)}</td>
        <td class="numeric">${fmtTokens(data.completion)}</td>
        <td class="numeric">${fmtCurrency(data.cost)}</td>
      </tr>`);
  }
}

function renderActivityLog(result) {
  if (!result) {
    logBody.innerHTML = '<tr><td colspan="7" style="color:var(--text-secondary);text-align:center;padding:18px;">' + t('noRecords') + '</td></tr>';
    return;
  }
  const { sorted, periodReqs, periodToks } = result;

  const fmtP = v => v === 0 && !sorted.some(i => i.date >= new Date().toISOString().slice(0, 10))
    ? '—' : fmtNumber(v);
  $('#todayActivity').textContent = fmtP(periodReqs.today) + ' / ' + fmtP(periodToks.today);
  $('#weekActivity').textContent = fmtNumber(periodReqs.week) + ' / ' + fmtTokens(periodToks.week);
  $('#monthActivity').textContent = fmtNumber(periodReqs.month) + ' / ' + fmtTokens(periodToks.month);

  logBody.innerHTML = '';
  for (const item of sorted) {
    logBody.insertAdjacentHTML('beforeend', `
      <tr>
        <td style="white-space:nowrap;font-size:11px;color:var(--text-secondary)">${item.date}</td>
        <td class="model-name" title="${item.model}">${item.model}</td>
        <td style="font-size:11px">${item.provider_name || '—'}</td>
        <td class="numeric">${fmtNumber(item.requests)}</td>
        <td class="numeric">${fmtTokens(item.prompt_tokens)}</td>
        <td class="numeric">${fmtTokens(item.completion_tokens)}</td>
        <td class="numeric">${fmtCurrency(item.usage)}</td>
      </tr>`);
  }
}

function updateLastUpdated() {
  lastUpdated.textContent = t('updatedAt') + fmtTime();
}

/* ---- Main refresh ---- */
async function refresh() {
  showError(null);
  const key = getKey();
  if (!key) {
    dashboard.classList.add('hidden');
    loading.classList.add('hidden');
    return;
  }

  const results = await Promise.allSettled([
    apiGet('/key'), apiGet('/credits'), apiGet('/activity'),
  ]);

  const keyData = results[0].status === 'fulfilled' ? results[0].value : { error: results[0].reason.message };
  const creditsData = results[1].status === 'fulfilled' ? results[1].value : { error: results[1].reason.message };
  const activityResp = results[2].status === 'fulfilled' ? results[2].value : { error: results[2].reason.message };

  renderKeyData(keyData);
  renderCreditsData(creditsData);

  if (activityResp.data) {
    const result = processActivity(activityResp.data);
    renderActivityData(result);
    renderActivityLog(result);
  } else {
    $('#totalRequests').textContent = t('needsMgmtKey');
    $('#totalPromptTokens').textContent = '';
    $('#totalCompletionTokens').textContent = '';
    modelBody.innerHTML = '<tr><td colspan="5" style="color:var(--text-secondary);text-align:center;padding:18px;">' + t('needsMgmtKey') + '</td></tr>';
    logBody.innerHTML = '<tr><td colspan="7" style="color:var(--text-secondary);text-align:center;padding:18px;">' + t('needsMgmtKey') + '</td></tr>';
    for (const id of ['todayActivity', 'weekActivity', 'monthActivity']) $('#' + id).textContent = '—';
  }

  updateLastUpdated();
}

/* ---- Timer ---- */
function startTimer() {
  stopTimer();
  const now = new Date();
  const sec = now.getSeconds();
  const ms = now.getMilliseconds();
  const toNext = sec < 30 ? (30 - sec) * 1000 - ms : (60 - sec) * 1000 - ms;
  refreshTimer = setTimeout(() => {
    refresh();
    refreshTimer = setInterval(refresh, REFRESH_INTERVAL);
  }, toNext);
}
function stopTimer() {
  if (refreshTimer) { clearTimeout(refreshTimer); clearInterval(refreshTimer); refreshTimer = null; }
}

/* ---- Key UI ---- */
toggleKeyVis.addEventListener('click', () => {
  if (apiKeyInput.type === 'password') { apiKeyInput.type = 'text'; toggleKeyVis.textContent = '\u{1f441}'; }
  else { apiKeyInput.type = 'password'; toggleKeyVis.textContent = '\u{1f441}'; }
});
saveKeyBtn.addEventListener('click', () => {
  const val = apiKeyInput.value.trim();
  if (!val) { showError(t('enterKey')); return; }
  setKey(val);
  showError(null);
  dashboard.classList.remove('hidden');
  setLoading(true);
  refresh().then(() => setLoading(false));
  startTimer();
});
clearKeyBtn.addEventListener('click', () => {
  setKey(null);
  apiKeyInput.value = '';
  dashboard.classList.add('hidden');
  loading.classList.add('hidden');
  showError(null);
  stopTimer();
});
refreshBtn.addEventListener('click', () => {
  refreshBtn.classList.add('spinning');
  refresh().finally(() => refreshBtn.classList.remove('spinning'));
});
apiKeyInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveKeyBtn.click(); });

/* ---- Init ---- */
async function init() {
  const savedTheme = await loadStored();

  langSelect.value = currentLang;
  themeSelect.value = savedTheme;

  applyLanguage();
  applyTheme(savedTheme);
  startThemeTimer();

  if (storedKey) {
    apiKeyInput.value = storedKey;
    dashboard.classList.remove('hidden');
    setLoading(true);
    await refresh();
    setLoading(false);
    startTimer();
  }
}

init();
