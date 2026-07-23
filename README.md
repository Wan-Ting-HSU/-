# 心電圖判讀解謎挑戰 — 部署指南

這是一個給醫檢實習生訓練心電圖判讀的互動解謎遊戲，使用 Next.js + React + Zustand + Tailwind CSS 建置。

## 專案結構

```
ecg-game-project/
├── app/
│   ├── layout.js        # 全站版型
│   ├── page.js           # 首頁（載入遊戲）
│   ├── globals.css       # Tailwind 全域樣式
│   └── game/
│       ├── gameStore.js  # Zustand store（含 persist，寫入 localStorage）
│       └── ECGGame.jsx   # 遊戲主元件（卡通愛心 UI）
├── package.json
├── next.config.mjs
├── tailwind.config.js
├── postcss.config.js
└── .gitignore
```

---

## 方法一：部署到 Vercel（推薦，免費、最簡單）

Vercel 是 Next.js 官方推薦的部署平台，設定幾乎是全自動的。

### 步驟

1. **安裝需求**：先確認電腦已安裝 [Node.js](https://nodejs.org)（18 版以上）與 [Git](https://git-scm.com)。

2. **本機測試**（建議上線前先在自己電腦跑一次）：
   ```bash
   cd ecg-game-project
   npm install
   npm run dev
   ```
   開瀏覽器輸入 `http://localhost:3000`，確認遊戲能正常運作、答題、計時、排行榜都正常。

3. **建立 GitHub 儲存庫**：
   - 到 [github.com](https://github.com) 新增一個新的 repository（可設為 Private）。
   - 在專案資料夾內執行：
     ```bash
     git init
     git add .
     git commit -m "first commit"
     git branch -M main
     git remote add origin https://github.com/你的帳號/你的repo名稱.git
     git push -u origin main
     ```

4. **連接 Vercel**：
   - 到 [vercel.com](https://vercel.com) 註冊／登入（可直接用 GitHub 帳號登入）。
   - 點選「Add New... → Project」。
   - 選擇剛剛推上去的 GitHub repository，Vercel 會自動偵測到這是 Next.js 專案。
   - 直接點「Deploy」，不需要改任何設定。
   - 等待約 1-2 分鐘，Vercel 會給你一個網址，例如 `https://ecg-teaching-game.vercel.app`，這就是正式上線的網址。

5. **之後要更新內容**（例如加題目、改設計）：
   - 直接修改本機檔案 → `git add .` → `git commit -m "說明"` → `git push`
   - Vercel 會自動偵測到 GitHub 有新的 commit，自動重新部署，幾十秒後網站就更新了。

6. **綁定自訂網域（選用）**：
   - 在 Vercel 專案的 Settings → Domains 裡輸入你買的網域，依照指示到你的網域商（GoDaddy、Namecheap、Cloudflare 等）設定 DNS，即可用自己的網址。

### 不想用 Git／GitHub 的話

也可以直接安裝 Vercel CLI，跳過 GitHub：
```bash
npm install -g vercel
cd ecg-game-project
vercel
```
依照互動式問答操作即可（第一次會要求登入），完成後一樣會得到正式網址。之後每次要更新，重新執行 `vercel --prod` 即可。

---

## 方法二：部署到 Netlify

1. 一樣先 `git push` 到 GitHub（同上）。
2. 到 [netlify.com](https://netlify.com) 註冊/登入，選 「Add new site → Import an existing project」。
3. 選擇 GitHub repository。
4. Build command 填：`npm run build`；Publish directory 填：`.next`
   （建議另外安裝 Netlify 的 `@netlify/plugin-nextjs` 套件以完整支援 Next.js App Router，Netlify 匯入時通常會自動幫你加上。）
5. 點「Deploy site」，等待建置完成即可拿到網址。

---

## 重要提醒

- **排行榜資料只存在使用者自己的瀏覽器**（`localStorage`），不同人、不同裝置看到的排行榜不會互通。如果之後想做「全體實習生共用的排行榜」，需要另外接資料庫（例如 Vercel 的 Postgres/KV、Supabase、Firebase 等），屬於後端功能，需要額外開發。
- 網站上線後是**公開網址**，任何知道網址的人都能玩。若只想給院內實習生使用，可以：
  - 不主動公開網址、僅私下分享連結；或
  - 在 Vercel/Netlify 設定簡單的密碼保護（Vercel Pro 方案有「Password Protection」功能）；或
  - 之後加上登入機制（需額外開發）。
- 若要調整題庫、最終案例、UI 顏色等，直接編輯 `app/game/gameStore.js`（案例與線索）與 `app/game/ECGGame.jsx`（題庫、UI），存檔後照上面「之後要更新內容」的步驟推上去即可。
