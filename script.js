// ===== DOM =====
const result = document.getElementById("result");
const rateValue = document.getElementById("rateValue");

const ageMin = document.getElementById("ageMin");
const ageMax = document.getElementById("ageMax");
const ageMinValue = document.getElementById("ageMinValue");
const ageMaxValue = document.getElementById("ageMaxValue");

const sexTabs = document.querySelectorAll(".sexTab");

const regionSelect = document.getElementById("region");
const prefSelect = document.getElementById("pref");

// --- Income (V2) ---
const incomeSelect = document.getElementById("income");
const resultIncome = document.getElementById("resultIncome");
const rateIncomeValue = document.getElementById("rateIncomeValue");
const incomeCard = document.getElementById("incomeCard");

// ===== State =====
let currentSex = "male";
let currentRegion = "all";
let currentPref = "all";

// income state
let currentIncomeBand = "none";
let incomeRatioData = null;

let populationData = null;
// 期待するJSON構造：
// { prefSlug: { male: { "18": n, ..., "100": n, "100+": n }, female: {...} }, ... }

// ===== Pref master (47) =====
const PREFS_BY_REGION = [
  { key: "all", label: "全国", prefs: [{ value: "all", label: "全国" }] },
  {
    key: "hokkaido_tohoku",
    label: "北海道・東北",
    prefs: [
      { value: "hokkaido", label: "北海道" },
      { value: "aomori", label: "青森県" },
      { value: "iwate", label: "岩手県" },
      { value: "miyagi", label: "宮城県" },
      { value: "akita", label: "秋田県" },
      { value: "yamagata", label: "山形県" },
      { value: "fukushima", label: "福島県" }
    ]
  },
  {
    key: "kanto",
    label: "関東",
    prefs: [
      { value: "ibaraki", label: "茨城県" },
      { value: "tochigi", label: "栃木県" },
      { value: "gunma", label: "群馬県" },
      { value: "saitama", label: "埼玉県" },
      { value: "chiba", label: "千葉県" },
      { value: "tokyo", label: "東京都" },
      { value: "kanagawa", label: "神奈川県" }
    ]
  },
  {
    key: "chubu",
    label: "中部",
    prefs: [
      { value: "niigata", label: "新潟県" },
      { value: "toyama", label: "富山県" },
      { value: "ishikawa", label: "石川県" },
      { value: "fukui", label: "福井県" },
      { value: "yamanashi", label: "山梨県" },
      { value: "nagano", label: "長野県" },
      { value: "gifu", label: "岐阜県" },
      { value: "shizuoka", label: "静岡県" },
      { value: "aichi", label: "愛知県" }
    ]
  },
  {
    key: "kinki",
    label: "近畿",
    prefs: [
      { value: "mie", label: "三重県" },
      { value: "shiga", label: "滋賀県" },
      { value: "kyoto", label: "京都府" },
      { value: "osaka", label: "大阪府" },
      { value: "hyogo", label: "兵庫県" },
      { value: "nara", label: "奈良県" },
      { value: "wakayama", label: "和歌山県" }
    ]
  },
  {
    key: "chugoku",
    label: "中国",
    prefs: [
      { value: "tottori", label: "鳥取県" },
      { value: "shimane", label: "島根県" },
      { value: "okayama", label: "岡山県" },
      { value: "hiroshima", label: "広島県" },
      { value: "yamaguchi", label: "山口県" }
    ]
  },
  {
    key: "shikoku",
    label: "四国",
    prefs: [
      { value: "tokushima", label: "徳島県" },
      { value: "kagawa", label: "香川県" },
      { value: "ehime", label: "愛媛県" },
      { value: "kochi", label: "高知県" }
    ]
  },
  {
    key: "kyushu_okinawa",
    label: "九州・沖縄",
    prefs: [
      { value: "fukuoka", label: "福岡県" },
      { value: "saga", label: "佐賀県" },
      { value: "nagasaki", label: "長崎県" },
      { value: "kumamoto", label: "熊本県" },
      { value: "oita", label: "大分県" },
      { value: "miyazaki", label: "宮崎県" },
      { value: "kagoshima", label: "鹿児島県" },
      { value: "okinawa", label: "沖縄県" }
    ]
  }
];

// ===== Helpers =====
function formatPercent(value) {
  if (typeof value !== "number" || isNaN(value)) return "–";
  if (value >= 1) {
    return value.toFixed(2);
  }
  return value.toFixed(4);
}

function clampRanges() {
  if (Number(ageMin.value) > Number(ageMax.value)) {
    ageMax.value = ageMin.value;
  }
}

function renderRegionOptions() {
  regionSelect.innerHTML = "";
  PREFS_BY_REGION.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r.key;
    opt.textContent = r.label;
    regionSelect.appendChild(opt);
  });
}

function renderPrefOptions(regionKey) {
  const region = PREFS_BY_REGION.find(r => r.key === regionKey) || PREFS_BY_REGION[0];

  prefSelect.innerHTML = "";
  region.prefs.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.value;
    opt.textContent = p.label;
    prefSelect.appendChild(opt);
  });

  if (regionKey === "all") {
    prefSelect.value = "all";
  } else {
    prefSelect.value = region.prefs[0].value;
  }
  currentPref = prefSelect.value;
}

function sumAges(prefSlug, sex, minA, maxA) {
  if (!populationData) return 0;

  const prefObj = populationData[prefSlug];
  if (!prefObj || !prefObj[sex]) return 0;

  const ages = prefObj[sex];

  let total = 0;
  for (let a = minA; a <= maxA; a++) {
    const v = ages[String(a)];
    if (typeof v === "number") total += v;
  }

function formatPercent(value) {
  if (value >= 1) {
    return value.toFixed(2);
  }
  return value.toFixed(4);
}


  // 上限が100のとき「100歳以上」も含める仕様
  if (maxA >= 100 && typeof ages["100+"] === "number") {
    total += ages["100+"];
  }

  return total;
}

// 全国の同性別・未婚者「総数」（年齢条件なし）
function sumAllUnmarriedNationwideBySex(sex) {
  if (!populationData) return 0;

  const prefObj = populationData["all"];
  if (!prefObj || !prefObj[sex]) return 0;

  const ages = prefObj[sex];

  let total = 0;
  for (let a = 18; a <= 100; a++) {
    const v = ages[String(a)];
    if (typeof v === "number") total += v;
  }

  if (typeof ages["100+"] === "number") {
    total += ages["100+"];
  }

  return total;
}

// --- income helpers ---
function toAgeBand(age) {
  if (age == null || Number.isNaN(age)) return null;

  const a = Number(age);

  if (a <= 19) return "18-19";
  if (a <= 24) return "20～24";
  if (a <= 29) return "25～29";
  if (a <= 34) return "30～34";
  if (a <= 39) return "35～39";
  if (a <= 44) return "40～44";
  if (a <= 49) return "45～49";
  if (a <= 54) return "50～54";
  if (a <= 59) return "55～59";
  if (a <= 64) return "60～64";
  if (a <= 69) return "65～69";
  return "70+";
}


// 年齢範囲内の人口構成で重み付けして、年収帯の割合を推定
function getWeightedIncomeRatio(prefSlug, sex, minA, maxA, incomeBand) {
  if (!incomeRatioData || incomeBand === "none") return 1.0;

  const agesObj = populationData?.[prefSlug]?.[sex];
  if (!agesObj) return 0;

  let denom = 0;
  let numer = 0;

  for (let a = minA; a <= maxA; a++) {
    const count = agesObj[String(a)] || 0;
    if (count <= 0) continue;

    const band = toAgeBand(a);
    const r = incomeRatioData?.[sex]?.[band]?.[incomeBand];
    if (typeof r !== "number") continue;

    denom += count;
    numer += count * r;
  }

  // 100+ を含める
  if (maxA >= 100) {
    const count100p = agesObj["100+"] || 0;
    const r = incomeRatioData?.[sex]?.["65+"]?.[incomeBand]
    if (count100p > 0 && typeof r === "number") {
      denom += count100p;
      numer += count100p * r;
    }
  }

  if (denom === 0) return 0;
  return numer / denom;
}

// ===== Core render =====
function render() {
  clampRanges();

  ageMinValue.textContent = ageMin.value;
  ageMaxValue.textContent = ageMax.value;

  // 年収の選択値を毎回同期（イベントが不発でも動く）
if (incomeSelect) {
  currentIncomeBand = incomeSelect.value;

  if (incomeCard) {
    incomeCard.style.opacity = (currentIncomeBand === "none") ? "0.65" : "1.0";
  }
}


  if (!populationData) {
    result.textContent = "読み込み中…";
    rateValue.textContent = "–";
    if (resultIncome) resultIncome.textContent = "読み込み中…";
    if (rateIncomeValue) rateIncomeValue.textContent = "–";
    return;
  }

  const minA = Number(ageMin.value);
  const maxA = Number(ageMax.value);

  // 分子：選択都道府県（全国も含む）
  const selectedPop = sumAges(currentPref, currentSex, minA, maxA);

  // 分母：全国の同性別「総数」（年齢条件なし）
  const totalPop = sumAllUnmarriedNationwideBySex(currentSex);

  // 人数表示
  result.textContent = selectedPop.toLocaleString() + " 人";

  // 該当率（母数＝全国の同性別未婚者総数）
  if (totalPop > 0) {
    const rate = (selectedPop / totalPop) * 100;
    rateValue.textContent = formatPercent(rate); // 小さくなりやすいので4桁
  } else {
    rateValue.textContent = "–";

  }

  // ---- income result (sub-main) ----
  if (!incomeSelect || !resultIncome || !rateIncomeValue) return;

  if (!incomeRatioData) {
    resultIncome.textContent = "読み込み中…";
    rateIncomeValue.textContent = "–";
    return;
  }

  if (currentIncomeBand === "none") {
    resultIncome.textContent = "–";
    rateIncomeValue.textContent = "–";
    return;
  }

  const wRatio = getWeightedIncomeRatio(currentPref, currentSex, minA, maxA, currentIncomeBand);
  const estimatedIncomePop = Math.round(selectedPop * wRatio);

  resultIncome.textContent = estimatedIncomePop.toLocaleString() + " 人";

  if (totalPop > 0) {
    const rate2 = (estimatedIncomePop / totalPop) * 100;
    rateIncomeValue.textContent = formatPercent(rate2);
  } else {
    rateIncomeValue.textContent = "–";
  }
}

// ===== Events =====
// 性別タブ
sexTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    sexTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentSex = tab.dataset.sex;
    render();
  });
});

// 地域→都道府県
regionSelect.addEventListener("change", () => {
  currentRegion = regionSelect.value;
  renderPrefOptions(currentRegion);
  render();
});

prefSelect.addEventListener("change", () => {
  currentPref = prefSelect.value;
  render();
});

// 年齢レンジ
ageMin.addEventListener("input", render);
ageMax.addEventListener("input", render);

// 年収
if (incomeSelect) {
  incomeSelect.addEventListener("change", () => {
    currentIncomeBand = incomeSelect.value;

    // ★ サブメイン演出：指定なしなら薄く、選択したら濃く
    if (incomeCard) {
      incomeCard.style.opacity = (currentIncomeBand === "none") ? "0.65" : "1.0";
    }

    render();
  });
}

// ===== Init =====
async function init() {
  renderRegionOptions();
  regionSelect.value = "all";
  renderPrefOptions("all");

  // income 初期
  if (incomeSelect) incomeSelect.value = "none";
  currentIncomeBand = "none";
  if (incomeCard) incomeCard.style.opacity = "0.65";

  // 実データ読み込み
  const res = await fetch("./data/population_unmarried_18_100.json");
  populationData = await res.json();

  // 年収比率（推定）読み込み
  // ※ income_ratio.json が data/ に必要
  try {
    const res2 = await fetch("./data/income_ratio.json");
    incomeRatioData = await res2.json();
  } catch (e) {
    // income 未導入でも落ちないようにする
    incomeRatioData = null;
    if (resultIncome) resultIncome.textContent = "（年収データ未設定）";
    if (rateIncomeValue) rateIncomeValue.textContent = "–";
  }

  render();
}

init();
