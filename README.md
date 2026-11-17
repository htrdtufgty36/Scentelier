# Scentelier — Find Your Signature Scent

一個以**香調 × 香氣氛圍**雙軸探索不同品牌香水的繁體中文靜態網站。支援香調多選、氛圍多選、品牌篩選、關鍵字搜尋、香水詳情與一鍵重設。

## 如何使用
開啟 `index.html`，選擇香調或氛圍即可即時顯示符合條件的香水。不同篩選組別以 AND 組合，同組多選為 OR。資料為示範性人工整理清單，不是即時全網搜尋。香氣氛圍為編輯主觀標籤。

## 如何擴充
先閱讀 [AGENTS.md](AGENTS.md)，再依規則在 `data/perfumes.js` 新增一筆物件；無須手動建立卡片或複製頁面。這是本作業的核心：AI 可按一致規範持續新增內容。

## 部署 GitHub Pages
1. 登入 GitHub，建立 **Public** repository，例如 `scentelier`。
2. 將本專案**資料夾內的所有檔案及子資料夾**上傳到 repository 根目錄（確認根目錄直接看得到 `index.html` 和 `AGENTS.md`）。
3. 開啟 repository → **Settings** → **Pages**。
4. 在 **Build and deployment** 選擇 **Deploy from a branch**，Branch 選 `main`、資料夾選 `/ (root)`，按 **Save**。
5. 等待 GitHub Pages 發布，開啟 `https://你的帳號.github.io/scentelier/`（以實際帳號與 repository 名稱為準）。
6. 測試搜尋、篩選與詳情，並將 repository 與公開網址交給老師。

## 技術
HTML5 / CSS3 / Vanilla JavaScript，無建置流程、無後端、無 API 金鑰。

## 免責
本網站為非商業課堂練習。香水資料與香材描述僅供探索參考；官方資訊以品牌網站為準。CSS 瓶身為示意圖，非商品官方圖片。

## 2026-11-16 資料庫擴充與推薦排序
目前收錄 **62 款、7 個品牌**。選取香調與氛圍後，網站會分成「完全符合」（同時符合兩類）及「部分符合」（只符合其中一類），而不是把部分符合的香水直接排除。品牌及關鍵字搜尋仍為必須符合的條件。資料來源以品牌官方系列／試香組頁為主，中文描述與氛圍標籤是 Scentelier 的編輯整理，並非品牌官方推薦。

官方參考來源：
- [Le Labo 經典系列](https://www.lelabofragrances.com/classic-collection.html)
- [Jo Malone London 熱門香水](https://www.jomalone.com/colognes/colognes-bestsellers)
- [Maison Margiela REPLICA Memory Box](https://www.maisonmargiela-fragrances.us/replica-memory-box/3614273668811.html?geo=false)
- [Aesop 香水系列](https://www.aesop.com/hk/en/c/fragrance/)
- [Diptyque 香水系列](https://diptyqueparis.com/en-nc/pages/fragrance-collections)
- [Byredo Discovery Set](https://www.byredo.com/sg_en/p/discovery-set-eau-de-parfum-6x2ml)
- [Acqua di Parma Selection Set](https://www.acquadiparma.com/en/us/selection-set-10x1%2C5-ml/PREASSORTEDSELECTIONSET2025.html)


### 正裝價格功能
新增 SW19 經典 8 款（50ml；台灣代理商公開原價 NT$3,280，查詢日期 2026-11-16），目前共 70 款、8 品牌。其餘 62 款尚未逐項核實台灣官方正裝價格，顯示「價格待確認」；設定價格上限時暫不納入。資料來源：https://www.plaisirin.com/categories/sw19 。


### V4 更新與價格透明度
收錄 82 款香水、10 個品牌，其中 20 款有可查來源的正裝台幣定價。其餘商品不猜測價格，保留「價格待確認」。新增台灣自有品牌 P.Seven 與日本品牌 SHIRO。

### V5：香氣優先與未知價格保留
設定價格上限時，已知超過預算的香水會被排除；價格未核實者仍列於香氣推薦結果，標示「請於專櫃或門市確認」，**不表示符合預算**。完全符合香調與氛圍者優先，部分符合者另區顯示；每區將有已確認價格的商品列在未知價格商品之前。此版本未新增經查核的價格資料。
