import './globals.css';

export const metadata = {
  title: '心電圖判讀解謎挑戰',
  description: '醫檢實習生心電圖判讀訓練互動遊戲',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
