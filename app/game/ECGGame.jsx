'use client';

import { useEffect, useMemo, useState } from 'react';
import { useGameStore, STAGE_ORDER, STAGE_META, GAME_CONSTS, FINAL_CASES } from './gameStore';

// =============================================================================
// 設計代幣
// =============================================================================
const COLORS = {
  coral: '#FF6B81',
  coralDark: '#E14F68',
  coralSoft: '#FFE1E7',
  mint: '#3FBFAE',
  mintDark: '#2E9C8E',
  mintSoft: '#DFF6F1',
  sunshine: '#FFC857',
  sunshineSoft: '#FFF1D3',
  ink: '#332044',
  cream: '#FFF7F2',
};

function FontLoader() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .font-display { font-family: 'Fredoka', 'Nunito', sans-serif; }
        .font-body { font-family: 'Nunito', sans-serif; }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.08); }
          30% { transform: scale(0.98); }
          45% { transform: scale(1.05); }
          60% { transform: scale(1); }
        }
        .heartbeat { animation: heartbeat 2.2s ease-in-out infinite; transform-origin: center; }
        @keyframes ecgScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .ecg-scroll { animation: ecgScroll 2.6s linear infinite; }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .float-slow { animation: floatY 3.4s ease-in-out infinite; }
        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .sparkle { animation: sparkle 1.8s ease-in-out infinite; }
      `}</style>
    </>
  );
}

// =============================================================================
// 卡通愛心吉祥物
// =============================================================================
function CartoonHeart({ variant = 'happy', size = 72, animated = false, className = '' }) {
  const palette = {
    happy: { fill: COLORS.coral, cheek: '#FFB0BE', accent: '#FFFFFF' },
    strong: { fill: '#FF8A5B', cheek: '#FFD2AE', accent: '#FFFFFF' },
    link: { fill: COLORS.mint, cheek: '#BDEFE4', accent: '#FFFFFF' },
    alert: { fill: COLORS.coralDark, cheek: '#FFC2CC', accent: '#FFFFFF' },
  }[variant] || { fill: COLORS.coral, cheek: '#FFB0BE', accent: '#FFFFFF' };

  return (
    <svg
      viewBox="0 0 120 116"
      width={size}
      height={(size * 116) / 120}
      className={`${animated ? 'heartbeat' : ''} ${className}`}
    >
      <path
        d="M60 108 C18 78 4 52 4 32 C4 13 19 1 36 1 C48 1 57 9 60 19 C63 9 72 1 84 1 C101 1 116 13 116 32 C116 52 102 78 60 108 Z"
        fill={palette.fill}
      />
      <path d="M22 30 C22 20 30 13 39 14" stroke={palette.accent} strokeOpacity="0.55" strokeWidth="5" strokeLinecap="round" fill="none" />
      <ellipse cx="33" cy="53" rx="8" ry="4.5" fill={palette.cheek} />
      <ellipse cx="85" cy="53" rx="8" ry="4.5" fill={palette.cheek} />
      <circle cx="41" cy="42" r="4.6" fill={COLORS.ink} />
      <circle cx="79" cy="42" r="4.6" fill={COLORS.ink} />
      <circle cx="42.6" cy="40.3" r="1.3" fill="#fff" />
      <circle cx="80.6" cy="40.3" r="1.3" fill="#fff" />

      {variant === 'alert' ? (
        <ellipse cx="60" cy="60" rx="5.5" ry="7" fill={COLORS.ink} />
      ) : variant === 'strong' ? (
        <path d="M48 58 L72 58" stroke={COLORS.ink} strokeWidth="4.5" strokeLinecap="round" />
      ) : (
        <path d="M46 57 Q60 70 74 57" stroke={COLORS.ink} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      )}

      {variant === 'happy' && (
        <path d="M56 78 c-3-3-8-2-8 2 c0 3 4 5 8 8 c4-3 8-5 8-8 c0-4-5-5-8-2 Z" fill="#fff" opacity="0.85" />
      )}
      {variant === 'strong' && (
        <>
          <rect x="24" y="18" width="72" height="9" rx="4.5" fill="#3B2E86" />
          <circle cx="24" cy="22.5" r="5.5" fill="#3B2E86" />
          <circle cx="96" cy="22.5" r="5.5" fill="#3B2E86" />
        </>
      )}
      {variant === 'link' && (
        <path
          d="M63 70 L54 84 L61 84 L57 96 L70 78 L63 78 Z"
          fill={COLORS.sunshine}
          stroke="#B8862A"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      )}
      {variant === 'alert' && (
        <g>
          <rect x="40" y="70" width="40" height="16" rx="4" fill="#FFEDEF" stroke="#E14F68" strokeWidth="2" />
          <line x1="48" y1="70" x2="48" y2="86" stroke="#E14F68" strokeWidth="1.5" strokeDasharray="2 2" />
          <line x1="72" y1="70" x2="72" y2="86" stroke="#E14F68" strokeWidth="1.5" strokeDasharray="2 2" />
        </g>
      )}
    </svg>
  );
}

// =============================================================================
// 心電圖跑動裝飾條
// =============================================================================
function EcgTraceStrip({ color = COLORS.coral, height = 26 }) {
  const seg =
    'M0,20 L18,20 Q24,9 30,20 L38,20 L44,33 L50,3 L56,31 L62,20 L84,20 Q90,11 96,20 L120,20 L138,20 Q144,9 150,20 L158,20 L164,33 L170,3 L176,31 L182,20 L200,20';
  return (
    <div className="overflow-hidden w-full" style={{ height }}>
      <div className="flex ecg-scroll" style={{ width: '200%' }}>
        {[0, 1].map((i) => (
          <svg key={i} viewBox="0 0 200 40" style={{ width: '50%', height: '100%' }} preserveAspectRatio="none">
            <path d={seg} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ))}
      </div>
    </div>
  );
}

function Sparkles() {
  return (
    <>
      <span className="absolute -top-2 left-6 text-lg sparkle" style={{ animationDelay: '0.2s' }}>✨</span>
      <span className="absolute top-4 -right-3 text-sm sparkle" style={{ animationDelay: '0.8s' }}>✨</span>
      <span className="absolute -bottom-1 left-1/2 text-xs sparkle" style={{ animationDelay: '1.3s' }}>✨</span>
    </>
  );
}

// =============================================================================
// 題庫（心房 / 心室 / 房室結）— 取材自 113-1 / 113-2 / 114-1 / 114-2
// 專技高考（醫事檢驗師）臨床生理學與病理學 純文字題，只附答案不附解析
// =============================================================================
const QUESTION_BANK = {
  atrium: [
    {
      id: 'a1',
      stem: '下列何者較符合右心房擴大的心電圖特徵？',
      options: [
        '導程 II、aVF 的 P 波波幅為 4 mm，寬度為 0.07 秒',
        '導程 I 的 P 波波幅為 2 mm，寬度為 0.07 秒',
        '導程 V1 的 P 波為正負雙相且負波為 -4 mm，正波為 1 mm',
        '導程 V1 的 P 波為正波，波幅為 2 mm',
      ],
      answerIndex: 0,
    },
    {
      id: 'a2',
      stem: '心電圖胸導程 V1 顯現前段向上波較為顯著的雙相 P 波，是何種心臟異常之心電圖變化？',
      options: ['右心房增大', '左心房增大', '右心室肥大', '左心室肥大'],
      answerIndex: 0,
    },
    {
      id: 'a3',
      stem: '有關正常竇性心律的敘述，下列何者正確？',
      options: ['心跳速率為每分鐘 50～100 下', 'P 波的振幅高低不規律', 'QRS 速度不規律', '每一個 QRS 波前皆有一個 P 波'],
      answerIndex: 3,
    },
    {
      id: 'a4',
      stem: '心電圖第 II 導（lead II）之正確連接法為：',
      options: ['左腿－左臂', '左腿－右臂', '右腿－右臂', '左臂－右臂'],
      answerIndex: 1,
    },
    {
      id: 'a5',
      stem: '心電圖上的 P 波代表下列何者？',
      options: ['心房去極化', '心房再極化', '心室去極化', '心室再極化'],
      answerIndex: 0,
    },
    {
      id: 'a6',
      stem: '在心電圖的操作中，四肢的誘導電極以下列何者來當地線？',
      options: ['左手', '左腳', '右手', '右腳'],
      answerIndex: 3,
    },
  ],
  ventricle: [
    {
      id: 'v1',
      stem: '關於心電圖 QT 區間（QT interval）的敘述，下列何者正確？',
      options: [
        'QT 間隔等同於心室肌肉的動作電位間距（action potential duration）',
        'QTc = QT / 立方根(RR)',
        '若 QTc = 0.40 秒為 QT 過短',
        '若 QTc = 0.42 秒則為 QT 過長',
      ],
      answerIndex: 0,
    },
    {
      id: 'v2',
      stem: '有關 QTc 間距的敘述，下列何者正確？',
      options: ['QTc 間距大於 384 ms 顯示 QTc 間距過長', 'QT 間距測量自 QRS 波起始點至 T 波起始點', 'QT 間距測量自 QRS 波起始點至 T 波結束點', 'QTc 間距＝QT 間距÷RR 間距'],
      answerIndex: 2,
    },
    {
      id: 'v3',
      stem: '下列心電圖心軸何者正常？',
      options: ['QRS 複合波 Lead I 為正，aVF 為正', 'QRS 複合波 Lead I 為正，aVF 為負', 'QRS 複合波 Lead I 為負，aVF 為正', 'QRS 複合波 Lead I 為負，aVF 為負'],
      answerIndex: 0,
    },
    {
      id: 'v4',
      stem: '有關電解質對心電圖的影響，下列何者錯誤？',
      options: ['高血鉀會造成尖且對稱的 T 波', '低血鉀會造成 U 波', '高血鈣會縮短 QT 區間', '低血鈉會造成 ST 段上升'],
      answerIndex: 3,
    },
    {
      id: 'v5',
      stem: '在正常情況下，心電圖波幅的電位，10 mm 代表多少 mV？',
      options: ['0.1', '1', '10', '100'],
      answerIndex: 1,
    },
    {
      id: 'v6',
      stem: '心跳規律時，在正常心電圖送紙速度下，RR 間隔（RR interval）為 0.75 秒，則心跳速率每分鐘約為幾次？',
      options: ['50', '60', '80', '100'],
      answerIndex: 2,
    },
    {
      id: 'v7',
      stem: '心電圖之 QRS 左軸偏位，是指 QRS 之電力軸為多少？',
      options: ['小於 110°', '大於 110°', '小於 -30°', '大於 -30°'],
      answerIndex: 2,
    },
    {
      id: 'v8',
      stem: '標準肢導程 Ⅰ 及 Ⅲ 之 QRS 波電位，分別為肢導程 Ⅰ＝+3 mm，肢導程 Ⅲ＝+1 mm，則肢導程 Ⅱ 的 QRS 波電位為多少？',
      options: ['+2 mm', '-2 mm', '+4 mm', '-4 mm'],
      answerIndex: 2,
    },
    {
      id: 'v9',
      stem: '左心室側壁發生 ST 段上升型心肌梗塞，此時心電圖變化會出現於下列那些導程？',
      options: ['Ⅱ，Ⅲ，aVF', 'Ⅰ，aVL，V6', 'V1，V2', 'V3，V4'],
      answerIndex: 1,
    },
    {
      id: 'v10',
      stem: '心電圖出現下列結果，何者最可能被診斷為左心室肥厚？',
      options: [
        'V6 導程的 R 波 + V1 導程的 S 波為 30 mm',
        'V5 導程的 R 波高度為 24 mm',
        'V6 導程的 R 波高度為 28 mm',
        'aVF 導程的 R 波高度達 15 mm',
      ],
      answerIndex: 2,
    },
    {
      id: 'v11',
      stem: '若心電圖 QRS 複合波在導程 Ⅰ 為負、aVF 為正，則心軸為何？',
      options: ['正常心軸', '心軸左移', '心軸右移', '極度心軸右移'],
      answerIndex: 2,
    },
    {
      id: 'v12',
      stem: '在心室去極化中，有關波形的定義，下列何者正確？',
      options: ['Q 波是心室去極化首度出現向上的波形', 'P 波是心室去極化最主要的波形', 'S 波是 R 波之後出現的向下波', 'R 波是 Q 波之後出現的向下波'],
      answerIndex: 2,
    },
    {
      id: 'v13',
      stem: '計算肢導程 aVL 及 aVF 之 QRS 波電位的代數和，得 aVL＝+5 mm，aVF＝+4 mm，則 aVR 之 QRS 波電位為多少？',
      options: ['-5 mm', '-1 mm', '-9 mm', '+1 mm'],
      answerIndex: 2,
    },
    {
      id: 'v14',
      stem: '心電圖出現 Ⅰ 導程為深的 S 波，Ⅱ 導程為雙相的 rS 波，Ⅲ 導程有高的 R 波，一般可判定為：',
      options: ['左軸偏位（LAD）', '右軸偏位（RAD）', '不定軸（indeterminated axis）', '正常軸位'],
      answerIndex: 1,
    },
    {
      id: 'v15',
      stem: 'QRS 正平面（frontal plane）軸圖中 -150° 為 a、-30° 為 b、+60° 為 c、+120° 為 d，此 a、b、c、d 向量位置分別代表心電圖的那幾個導程？',
      options: ['aVL、aVR、aVF、Ⅲ', 'aVR、aVL、Ⅱ、Ⅲ', 'aVR、Ⅰ、Ⅱ、aVF', 'aVL、Ⅰ、Ⅱ、Ⅲ'],
      answerIndex: 1,
    },
    {
      id: 'v16',
      stem: '若 12 導程心電圖左右手接反，下列那個導極較不會受到明顯影響？',
      options: ['V4', 'aVR', 'I', 'aVL'],
      answerIndex: 0,
    },
    {
      id: 'v17',
      stem: '心電圖上 T 波倒置的可能原因，下列何者錯誤？',
      options: ['心肌缺氧', '使用毛地黃', '鎂離子過高', '心肌肥厚'],
      answerIndex: 2,
    },
    {
      id: 'v18',
      stem: '有關心電圖的代數關係，下列何者錯誤？',
      options: ['aVR＋aVL＋aVF＝0', 'aVR＝2/3 VR', 'aVL＝（Lead Ⅰ－Lead Ⅲ）/2', 'aVF＝（Lead Ⅱ＋Lead Ⅲ）/2'],
      answerIndex: 1,
    },
    {
      id: 'v19',
      stem: '左前下降冠狀動脈發生心肌梗塞後，造成心肌永久性壞死，心電圖產生何種變化？',
      options: ['T 波顛倒', 'ST 上升', 'ST 下降', '出現深而寬的 q 或 Q 波'],
      answerIndex: 3,
    },
    {
      id: 'v20',
      stem: '當 QRS 正平面（frontal plane）軸顯示心軸偏右（right axis deviation），此時 Ⅰ 導程與 aVF 導程的 QRS 波方向應分別為何？',
      options: ['正向、正向', '正向、負向', '負向、正向', '負向、負向'],
      answerIndex: 2,
    },
  ],
  avnode: [
    {
      id: 'n1',
      stem: '下列何種細胞類型與心臟跳動最無關？',
      options: ['節律細胞', '電氣傳導細胞', '結締組織細胞', '心肌細胞'],
      answerIndex: 2,
    },
    {
      id: 'n2',
      stem: '常規 12 導程心電圖中屬於單極的導程數目為何？',
      options: ['12', '9', '6', '3'],
      answerIndex: 1,
    },
    {
      id: 'n3',
      stem: '下列四者的興奮順序應為何？①房室結（AV node） ②希氏束（bundle of His） ③蒲金氏纖維（Purkinje fibers） ④竇房結（SA node）',
      options: ['①②③④', '④①②③', '④③①②', '①④②③'],
      answerIndex: 1,
    },
    {
      id: 'n4',
      stem: '下列何種疾病無法以心電圖作為診斷？',
      options: ['心律不整', '心肌梗塞', '心包膜炎', '二尖瓣膜脫垂'],
      answerIndex: 3,
    },
    {
      id: 'n5',
      stem: '房室結內傳導延長，心電圖變化為 PR 期間大於 0.20 秒，P 波後面都有 QRS 波，是屬於何種房室傳導阻滯（A-V block）？',
      options: [
        '第一級房室阻滯（first degree A-V block）',
        '第三級房室阻滯（third degree A-V block）',
        '右束支傳導阻滯（right bundle branch block）',
        '左束支傳導阻滯（left bundle branch block）',
      ],
      answerIndex: 0,
    },
    {
      id: 'n6',
      stem: '某患者心電圖紀錄顯示，其房室傳導正臨界正常與第一級房室傳導阻滯（atrioventricular block）之間，下列敘述何者正確？',
      options: [
        'PR interval 橫跨心電圖紙剛好滿一個大格',
        'PR interval 橫跨心電圖紙剛好滿十個小格',
        'PR segment 橫跨心電圖紙剛好滿一個大格',
        'PR segment 橫跨心電圖紙剛好滿十個小格',
      ],
      answerIndex: 0,
    },
    {
      id: 'n7',
      stem: '下列何者為正常心臟的電氣傳導順序？①希氏束（bundle of His） ②竇房結（SA node） ③房室結（AV node） ④蒲金氏纖維（Purkinje fibers）',
      options: ['③②①④', '②①③④', '②③①④', '③①②④'],
      answerIndex: 2,
    },
    {
      id: 'n8',
      stem: '下列對於操作心電圖機器，完成一張標準 12 導程心電圖的敘述，何者錯誤？',
      options: [
        '肢體導極放置於左手、左腳、右手、右腳',
        '胸前導極 V6 放置於左胸第五肋間與腋中線交界',
        '胸前導極 V1 放置於胸骨右緣與第三肋間交界',
        '胸前導極 V4 放置於左胸第五肋間與鎖骨中線交界',
      ],
      answerIndex: 2,
    },
  ],
};

// =============================================================================
// 治療處置關卡：只顯示心律名稱，判斷是否為需通報之危急心電圖
// =============================================================================
const TREATMENT_BANK = [
  { id: 't1', stem: '心室頻脈（Ventricular Tachycardia, VT）', answer: true },
  { id: 't2', stem: '心室顫動（Ventricular Fibrillation, VF）', answer: true },
  { id: 't3', stem: '短暫陣發性心室頻脈（Short run VT）', answer: true },
  { id: 't4', stem: '陣發性上心室頻脈（PSVT）', answer: true },
  { id: 't5', stem: '完全房室傳導阻滯（Complete AV Block）', answer: true },
  { id: 't6', stem: '第二度房室傳導阻斷 Mobitz type II', answer: true },
  { id: 't7', stem: '高度房室傳導阻滯（High Grade AV Block）', answer: true },
  { id: 't8', stem: '急性心肌梗塞（Acute MI）', answer: true },
  { id: 't9', stem: '第一度房室傳導阻斷（First Degree AV Block）', answer: false },
  { id: 't10', stem: '第二度房室傳導阻斷 Mobitz type I（Wenckebach）', answer: false },
  { id: 't11', stem: '竇性心律不整（Sinus Arrhythmia）', answer: false },
  { id: 't12', stem: '心房顫動（Atrial Fibrillation）', answer: false },
  { id: 't13', stem: '心房撲動（Atrial Flutter）', answer: false },
  { id: 't14', stem: '心房過早收縮（APC）', answer: false },
  { id: 't15', stem: '心室過早收縮，二連律型態（VPC Bigeminy）', answer: false },
  { id: 't16', stem: 'WPW 症候群（Wolff-Parkinson-White Syndrome）', answer: false },
  { id: 't17', stem: '竇性心搏過緩（Sinus Bradycardia）', answer: false },
  { id: 't18', stem: '右束枝傳導阻滯（RBBB）', answer: false },
  { id: 't19', stem: '竇性心搏過速（Sinus Tachycardia）', answer: false },
  { id: 't20', stem: '左束枝傳導阻滯（LBBB）', answer: false },
];

// =============================================================================
// 工具函式
// =============================================================================
function formatMMSS(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const mm = Math.floor(totalSec / 60);
  const ss = totalSec % 60;
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

function pickRandomFrom(list, excludeId) {
  const candidates = list.filter((q) => q.id !== excludeId);
  const pool = candidates.length > 0 ? candidates : list;
  return pool[Math.floor(Math.random() * pool.length)];
}

function findQuestion(stageId, id) {
  if (stageId === 'treatment') return TREATMENT_BANK.find((q) => q.id === id) || null;
  return QUESTION_BANK[stageId].find((q) => q.id === id) || null;
}

function pickRandomQuestion(stageId, excludeId) {
  const bank = stageId === 'treatment' ? TREATMENT_BANK : QUESTION_BANK[stageId];
  return pickRandomFrom(bank, excludeId);
}

// =============================================================================
// 計時器（心跳藥丸）
// =============================================================================
function useElapsedTime(startTime, penaltyMs, frozenEndTime) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (frozenEndTime) return;
    const id = setInterval(() => setTick((t) => t + 1), 250);
    return () => clearInterval(id);
  }, [frozenEndTime]);

  if (!startTime) return 0;
  const now = frozenEndTime || Date.now();
  return Math.max(0, now - startTime) + penaltyMs;
}

function Timer() {
  const startTime = useGameStore((s) => s.startTime);
  const penaltyMs = useGameStore((s) => s.penaltyMs);
  const endTime = useGameStore((s) => s.endTime);
  const elapsed = useElapsedTime(startTime, penaltyMs, endTime);

  return (
    <div
      className="flex items-center gap-2 rounded-full px-4 py-1.5 font-display font-semibold text-sm shadow-md"
      style={{ background: COLORS.ink, color: '#fff' }}
    >
      <CartoonHeart variant="happy" size={22} animated />
      <span className="tabular-nums tracking-wide">{formatMMSS(elapsed)}</span>
      {penaltyMs > 0 && (
        <span className="text-xs font-body" style={{ color: COLORS.sunshine }}>
          (+{penaltyMs / 1000}s 罰時)
        </span>
      )}
    </div>
  );
}

function PillButton({ children, onClick, disabled, tone = 'coral', className = '' }) {
  const bg =
    tone === 'coral' ? COLORS.coral : tone === 'mint' ? COLORS.mint : tone === 'dark' ? COLORS.ink : COLORS.sunshine;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-display font-semibold rounded-full transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_0_rgba(0,0,0,0.12)] hover:brightness-105 ${className}`}
      style={{ background: bg, color: tone === 'sunshine' ? COLORS.ink : '#fff' }}
    >
      {children}
    </button>
  );
}

// =============================================================================
// 個人資料輸入
// =============================================================================
function InfoScreen() {
  const setPlayerInfo = useGameStore((s) => s.setPlayerInfo);
  const goToStart = useGameStore((s) => s.goToStart);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const canSubmit = name.trim().length > 0;

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div
        className="w-full max-w-md rounded-[32px] shadow-xl p-8 border-4 relative"
        style={{ background: '#fff', borderColor: COLORS.coralSoft }}
      >
        <div className="text-center mb-6 relative inline-flex flex-col items-center w-full">
          <div className="relative float-slow">
            <CartoonHeart variant="happy" size={84} />
            <Sparkles />
          </div>
          <h1 className="text-2xl font-display font-bold mt-2" style={{ color: COLORS.ink }}>
            心電圖判讀解謎挑戰
          </h1>
          <p className="text-sm font-body mt-1" style={{ color: '#8A7A93' }}>
            實習生訓練專用・請先輸入個人資料
          </p>
        </div>
        <div className="space-y-4 font-body">
          <div>
            <label className="block text-sm font-bold mb-1" style={{ color: COLORS.ink }}>
              姓名 *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="請輸入姓名"
              className="w-full rounded-2xl border-2 px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: COLORS.coralSoft }}
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1" style={{ color: COLORS.ink }}>
              單位／學號（選填）
            </label>
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="例如：檢驗科實習生 A"
              className="w-full rounded-2xl border-2 px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: COLORS.coralSoft }}
            />
          </div>
          <PillButton
            disabled={!canSubmit}
            onClick={() => {
              setPlayerInfo(name, unit);
              goToStart();
            }}
            className="w-full py-3"
          >
            下一步 →
          </PillButton>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 開場規則說明
// =============================================================================
function StartScreen() {
  const startGame = useGameStore((s) => s.startGame);
  const player = useGameStore((s) => s.player);
  const rules = [
    { icon: '🔓', text: '四個關卡可任意順序挑戰：心房、心室、房室結、治療處置' },
    { icon: '✅', text: '每關答對 3 題即過關，獲得一條純文字線索' },
    { icon: '🎲', text: '最終案例將從多種心律中隨機抽選一種' },
    { icon: '⏭️', text: '不必全破也可直接挑戰最終診斷，但線索會不完整' },
    { icon: '⚠️', text: '最終診斷答錯不會結束遊戲，但會 +20 秒罰時' },
    { icon: '🏆', text: '完成後會記錄到本機排行榜' },
  ];
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-lg rounded-[32px] shadow-xl p-8 border-4" style={{ background: '#fff', borderColor: COLORS.mintSoft }}>
        <div className="flex items-center gap-3 mb-4">
          <CartoonHeart variant="happy" size={56} />
          <div>
            <h2 className="text-lg font-display font-bold" style={{ color: COLORS.ink }}>
              歡迎，{player.name || '實習生'}！
            </h2>
            <p className="text-sm font-body" style={{ color: '#8A7A93' }}>
              按下開始後即開始計時，直到最終判讀成功才會停止。
            </p>
          </div>
        </div>

        <ul className="space-y-2.5 text-sm font-body mb-3" style={{ color: COLORS.ink }}>
          {rules.map((r, i) => (
            <li key={i} className="flex gap-2 items-start">
              <span>{r.icon}</span>
              <span>{r.text}</span>
            </li>
          ))}
        </ul>

        <div className="rounded-2xl overflow-hidden mb-5" style={{ background: COLORS.cream }}>
          <EcgTraceStrip color={COLORS.coral} height={30} />
        </div>

        <PillButton onClick={startGame} className="w-full py-3.5 text-base">
          開始遊戲・開始計時 💗
        </PillButton>
      </div>
    </div>
  );
}

// =============================================================================
// 關卡選擇
// =============================================================================
function StageCard({ stageId }) {
  const meta = STAGE_META[stageId];
  const stage = useGameStore((s) => s.stages[stageId]);
  const enterStage = useGameStore((s) => s.enterStage);

  const handleEnter = () => {
    const q = pickRandomQuestion(stageId, null);
    enterStage(stageId, q.id);
  };

  return (
    <div
      className="rounded-[28px] border-4 p-5 flex flex-col gap-3 shadow-md transition hover:-translate-y-0.5"
      style={{ background: stage.completed ? '#fff' : meta.tint, borderColor: stage.completed ? COLORS.sunshine : meta.ring }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="rounded-full flex items-center justify-center"
            style={{ background: '#fff', width: 56, height: 56, boxShadow: `0 0 0 3px ${meta.ring} inset` }}
          >
            <CartoonHeart variant={meta.variant} size={38} />
          </div>
          <div>
            <div className="font-display font-bold" style={{ color: COLORS.ink }}>
              {meta.title}
            </div>
            <div className="text-xs font-body" style={{ color: '#9A8AA3' }}>
              {meta.subtitle}
            </div>
          </div>
        </div>
        {stage.completed ? (
          <span
            className="text-xs font-display font-bold rounded-full px-3 py-1"
            style={{ background: COLORS.sunshineSoft, color: '#8A6A1A' }}
          >
            已解鎖 ✓
          </span>
        ) : (
          <span className="text-xs font-display font-bold rounded-full px-3 py-1" style={{ background: '#fff', color: '#B0A3B8' }}>
            未解鎖
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: GAME_CONSTS.NEEDED_CORRECT }).map((_, i) => (
          <span key={i} style={{ opacity: i < stage.correctCount ? 1 : 0.25 }}>
            <CartoonHeart variant="happy" size={16} />
          </span>
        ))}
        <span className="text-xs font-body ml-1" style={{ color: '#9A8AA3' }}>
          {Math.min(stage.correctCount, GAME_CONSTS.NEEDED_CORRECT)} / {GAME_CONSTS.NEEDED_CORRECT}
        </span>
      </div>

      {stage.completed && (
        <div className="text-xs font-body bg-white border-2 rounded-2xl p-2.5 leading-relaxed" style={{ borderColor: COLORS.sunshineSoft, color: '#5C4A66' }}>
          💡 {stage.clue}
        </div>
      )}

      <PillButton onClick={handleEnter} tone={stage.completed ? 'sunshine' : 'dark'} className="py-2 text-sm">
        {stage.completed ? '重新挑戰（複習）' : '進入挑戰'}
      </PillButton>
    </div>
  );
}

function StageSelectScreen() {
  const stages = useGameStore((s) => s.stages);
  const enterFinalQuiz = useGameStore((s) => s.enterFinalQuiz);
  const completedCount = STAGE_ORDER.filter((id) => stages[id].completed).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-display font-bold flex items-center gap-2" style={{ color: COLORS.ink }}>
          <CartoonHeart variant="happy" size={30} /> 關卡選擇
        </h2>
        <Timer />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {STAGE_ORDER.map((id) => (
          <StageCard key={id} stageId={id} />
        ))}
      </div>

      <div className="rounded-[28px] p-5 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ background: COLORS.ink, color: '#fff' }}>
        <div className="text-sm font-body flex items-center gap-2">
          <span className="font-display font-bold">已收集線索：{completedCount} / 4</span>
          {completedCount < 4 && <span className="opacity-60 text-xs">（未全破也可挑戰，但線索會不完整）</span>}
        </div>
        <PillButton onClick={enterFinalQuiz} className="px-6 py-2.5 whitespace-nowrap">
          🎯 前往最終診斷挑戰
        </PillButton>
      </div>
    </div>
  );
}

// =============================================================================
// 關卡答題
// =============================================================================
function StageQuizScreen() {
  const activeStageId = useGameStore((s) => s.activeStageId);
  const currentQuestionId = useGameStore((s) => s.currentQuestionId);
  const stage = useGameStore((s) => s.stages[activeStageId]);
  const answerStageQuestion = useGameStore((s) => s.answerStageQuestion);
  const setCurrentQuestion = useGameStore((s) => s.setCurrentQuestion);
  const backToStageSelect = useGameStore((s) => s.backToStageSelect);

  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const question = useMemo(() => findQuestion(activeStageId, currentQuestionId), [activeStageId, currentQuestionId]);
  if (!question) return null;
  const meta = STAGE_META[activeStageId];
  const isTreatment = activeStageId === 'treatment';

  const options = isTreatment ? ['是，需立即通報', '否，非危急心律'] : question.options;
  const answerIndex = isTreatment ? (question.answer ? 0 : 1) : question.answerIndex;

  const handleSelect = (idx) => {
    if (feedback) return;
    setSelected(idx);
    const isCorrect = idx === answerIndex;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    answerStageQuestion(isCorrect);
  };

  const handleNext = () => {
    setSelected(null);
    setFeedback(null);
    if (stage.completed) {
      backToStageSelect();
      return;
    }
    const nextQ = pickRandomQuestion(activeStageId, question.id);
    setCurrentQuestion(nextQ.id);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 font-display font-bold" style={{ color: COLORS.ink }}>
          <CartoonHeart variant={meta.variant} size={30} />
          {meta.title} 關卡
        </div>
        <Timer />
      </div>

      <div className="rounded-[28px] shadow-md border-4 p-6" style={{ background: '#fff', borderColor: meta.tint }}>
        <div className="flex items-center gap-1.5 mb-3">
          {Array.from({ length: GAME_CONSTS.NEEDED_CORRECT }).map((_, i) => (
            <span key={i} style={{ opacity: i < stage.correctCount ? 1 : 0.25 }}>
              <CartoonHeart variant="happy" size={14} />
            </span>
          ))}
          <span className="text-xs font-body ml-1" style={{ color: '#9A8AA3' }}>
            {Math.min(stage.correctCount, GAME_CONSTS.NEEDED_CORRECT)} / {GAME_CONSTS.NEEDED_CORRECT}
          </span>
        </div>

        {isTreatment ? (
          <div className="mb-5">
            <div className="text-xs font-body mb-2" style={{ color: '#9A8AA3' }}>
              此心律是否為需立即通報之危急心電圖？
            </div>
            <div
              className="text-xl font-display font-bold rounded-2xl px-5 py-5 text-center"
              style={{ background: meta.tint, color: COLORS.ink }}
            >
              {question.stem}
            </div>
          </div>
        ) : (
          <p className="font-body leading-relaxed mb-5 whitespace-pre-line" style={{ color: COLORS.ink }}>
            {question.stem}
          </p>
        )}

        <div className="space-y-2.5 font-body">
          {options.map((opt, idx) => {
            const isSelected = selected === idx;
            const isAnswer = answerIndex === idx;
            let style = { borderColor: '#EEE4EA', background: '#fff' };
            if (feedback && isSelected && feedback === 'correct') style = { borderColor: COLORS.mint, background: COLORS.mintSoft };
            else if (feedback && isSelected && feedback === 'wrong') style = { borderColor: COLORS.coralDark, background: COLORS.coralSoft };
            else if (feedback && isAnswer) style = { borderColor: COLORS.mint, background: COLORS.mintSoft };
            return (
              <button
                key={idx}
                disabled={!!feedback}
                onClick={() => handleSelect(idx)}
                className="w-full text-left rounded-2xl border-2 px-4 py-2.5 text-sm transition hover:-translate-y-0.5"
                style={style}
              >
                {!isTreatment && (
                  <span className="font-display font-bold mr-2" style={{ color: '#B0A3B8' }}>
                    {String.fromCharCode(65 + idx)}.
                  </span>
                )}
                {opt}
              </button>
            );
          })}
        </div>

        {feedback && (
          <div
            className="mt-4 rounded-2xl px-4 py-3 text-sm font-body font-semibold"
            style={
              feedback === 'correct'
                ? { background: COLORS.mintSoft, color: COLORS.mintDark }
                : { background: COLORS.coralSoft, color: COLORS.coralDark }
            }
          >
            {feedback === 'correct' ? '✅ 答對了！' : '❌ 答錯了，正確答案已標示。'}
            {stage.completed && feedback === 'correct' && (
              <div className="mt-1">🎉 恭喜過關！已解鎖線索：「{stage.clue}」</div>
            )}
          </div>
        )}

        <div className="mt-5 flex justify-between items-center">
          <button onClick={backToStageSelect} className="text-sm font-body hover:opacity-70 transition" style={{ color: '#B0A3B8' }}>
            ← 返回關卡選擇
          </button>
          {feedback && (
            <PillButton onClick={handleNext} tone="dark" className="px-5 py-2 text-sm">
              {stage.completed ? '完成，返回關卡選擇' : '下一題'}
            </PillButton>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 最終診斷
// =============================================================================
function ClueSlot({ stageId }) {
  const meta = STAGE_META[stageId];
  const stage = useGameStore((s) => s.stages[stageId]);
  return (
    <div
      className="rounded-2xl border-2 p-3 text-sm font-body"
      style={{
        background: stage.completed ? '#fff' : '#F4EEF2',
        borderColor: stage.completed ? meta.ring : '#E6DCE3',
        color: stage.completed ? COLORS.ink : '#B0A3B8',
      }}
    >
      <div className="flex items-center gap-1.5 font-display font-bold mb-1">
        <CartoonHeart variant={meta.variant} size={20} />
        <span>{meta.title}</span>
      </div>
      <div className={stage.completed ? '' : 'italic'}>{stage.completed ? stage.clue : '尚未解鎖'}</div>
    </div>
  );
}

function FinalQuizScreen() {
  const backToStageSelect = useGameStore((s) => s.backToStageSelect);
  const penalizeFinalWrong = useGameStore((s) => s.penalizeFinalWrong);
  const finishGame = useGameStore((s) => s.finishGame);
  const finalWrongAttempts = useGameStore((s) => s.finalWrongAttempts);
  const selectedCaseId = useGameStore((s) => s.selectedCaseId);
  const finalOptionIds = useGameStore((s) => s.finalOptionIds);

  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const optionCases = useMemo(
    () => finalOptionIds.map((id) => FINAL_CASES.find((c) => c.id === id)).filter(Boolean),
    [finalOptionIds]
  );

  const handleSelect = (caseId) => {
    if (feedback === 'correct') return;
    setSelected(caseId);
    if (caseId === selectedCaseId) {
      setFeedback('correct');
    } else {
      setFeedback('wrong');
      penalizeFinalWrong();
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setFeedback(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="font-display font-bold text-lg flex items-center gap-2" style={{ color: COLORS.ink }}>
          <CartoonHeart variant="alert" size={30} animated /> 最終診斷挑戰
        </div>
        <Timer />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {STAGE_ORDER.map((id) => (
          <ClueSlot key={id} stageId={id} />
        ))}
      </div>

      <div className="rounded-[28px] shadow-md border-4 p-6" style={{ background: '#fff', borderColor: COLORS.coralSoft }}>
        <p className="font-body leading-relaxed mb-5" style={{ color: COLORS.ink }}>
          請整合以上四條線索，判讀此病人最可能的心電圖診斷：
        </p>

        <div className="space-y-2.5 font-body">
          {optionCases.map((c, idx) => {
            const isSelected = selected === c.id;
            let style = { borderColor: '#EEE4EA', background: '#fff' };
            if (feedback && isSelected && feedback === 'correct') style = { borderColor: COLORS.mint, background: COLORS.mintSoft };
            if (feedback && isSelected && feedback === 'wrong') style = { borderColor: COLORS.coralDark, background: COLORS.coralSoft };
            return (
              <button
                key={c.id}
                disabled={feedback === 'correct'}
                onClick={() => handleSelect(c.id)}
                className="w-full text-left rounded-2xl border-2 px-4 py-2.5 text-sm transition hover:-translate-y-0.5"
                style={style}
              >
                <span className="font-display font-bold mr-2" style={{ color: '#B0A3B8' }}>
                  {String.fromCharCode(65 + idx)}.
                </span>
                {c.label}
              </button>
            );
          })}
        </div>

        {feedback === 'wrong' && (
          <div className="mt-4 rounded-2xl px-4 py-3 text-sm font-body font-semibold" style={{ background: COLORS.coralSoft, color: COLORS.coralDark }}>
            ❌ 診斷不正確，已加罰 20 秒。請參考線索重新判斷。
            <div className="mt-2">
              <PillButton onClick={handleRetry} className="px-4 py-1.5 text-xs">
                重新作答
              </PillButton>
            </div>
          </div>
        )}

        {feedback === 'correct' && (
          <div className="mt-4 rounded-2xl px-4 py-3 text-sm font-body font-semibold" style={{ background: COLORS.mintSoft, color: COLORS.mintDark }}>
            ✅ 診斷正確！
            <div className="mt-2">
              <PillButton onClick={finishGame} tone="mint" className="px-4 py-1.5 text-xs">
                停止計時・查看成績
              </PillButton>
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between text-xs font-body" style={{ color: '#B0A3B8' }}>
          <button onClick={backToStageSelect} className="hover:opacity-70 transition">
            ← 返回關卡選擇（繼續收集線索）
          </button>
          {finalWrongAttempts > 0 && <span>已答錯 {finalWrongAttempts} 次（+{finalWrongAttempts * 20}s）</span>}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// 排行榜
// =============================================================================
function LeaderboardScreen() {
  const leaderboard = useGameStore((s) => s.leaderboard);
  const player = useGameStore((s) => s.player);
  const endTime = useGameStore((s) => s.endTime);
  const startTime = useGameStore((s) => s.startTime);
  const penaltyMs = useGameStore((s) => s.penaltyMs);
  const restartRun = useGameStore((s) => s.restartRun);
  const goToInfo = useGameStore((s) => s.goToInfo);

  const myTimeMs = endTime && startTime ? endTime - startTime + penaltyMs : null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-2">
          <CartoonHeart variant="happy" size={72} animated />
        </div>
        <h2 className="text-xl font-display font-bold" style={{ color: COLORS.ink }}>
          挑戰完成！🏆
        </h2>
        {myTimeMs !== null && (
          <p className="font-body mt-1" style={{ color: '#8A7A93' }}>
            {player.name} 本次用時：
            <span className="font-display font-bold" style={{ color: COLORS.coral }}>
              {' '}
              {formatMMSS(myTimeMs)}
            </span>
          </p>
        )}
      </div>

      <div className="rounded-[28px] shadow-md border-4 overflow-hidden mb-6" style={{ borderColor: COLORS.sunshineSoft }}>
        <div
          className="grid grid-cols-12 text-xs font-display font-bold px-4 py-2.5"
          style={{ background: COLORS.ink, color: '#fff' }}
        >
          <div className="col-span-1">#</div>
          <div className="col-span-4">姓名</div>
          <div className="col-span-3">單位</div>
          <div className="col-span-2">用時</div>
          <div className="col-span-2">日期</div>
        </div>
        {leaderboard.length === 0 && <div className="text-center text-sm font-body py-6" style={{ color: '#B0A3B8' }}>目前尚無紀錄</div>}
        {leaderboard.map((entry, idx) => (
          <div
            key={idx}
            className="grid grid-cols-12 px-4 py-2.5 text-sm font-body border-t-2"
            style={{ borderColor: '#F4EEF2', background: idx === 0 ? COLORS.sunshineSoft : '#fff' }}
          >
            <div className="col-span-1 font-display font-bold" style={{ color: '#9A8AA3' }}>{idx + 1}</div>
            <div className="col-span-4 truncate">{entry.name}</div>
            <div className="col-span-3 truncate" style={{ color: '#B0A3B8' }}>{entry.unit}</div>
            <div className="col-span-2 font-display">{formatMMSS(entry.timeMs)}</div>
            <div className="col-span-2 text-xs truncate" style={{ color: '#B0A3B8' }}>{entry.date}</div>
          </div>
        ))}
      </div>

      <p className="text-xs text-center font-body mb-4" style={{ color: '#B0A3B8' }}>
        ※ 排行榜紀錄僅保存於本裝置瀏覽器（localStorage），不會同步到其他裝置。
      </p>

      <div className="flex gap-3 justify-center">
        <PillButton onClick={restartRun} className="px-5 py-2.5 text-sm">
          🔄 再次挑戰
        </PillButton>
        <PillButton onClick={goToInfo} tone="dark" className="px-5 py-2.5 text-sm">
          更換使用者
        </PillButton>
      </div>
    </div>
  );
}

// =============================================================================
// 主元件
// =============================================================================
export default function ECGGame() {
  const gamePhase = useGameStore((s) => s.gamePhase);

  return (
    <>
      <FontLoader />
      <div
        className="min-h-screen px-4 py-8 font-body"
        style={{ background: `linear-gradient(180deg, ${COLORS.cream} 0%, #FFFDF9 50%, #F2FBF9 100%)` }}
      >
        {gamePhase === 'info' && <InfoScreen />}
        {gamePhase === 'start' && <StartScreen />}
        {gamePhase === 'stage_select' && <StageSelectScreen />}
        {gamePhase === 'stage_quiz' && <StageQuizScreen />}
        {gamePhase === 'final_quiz' && <FinalQuizScreen />}
        {gamePhase === 'leaderboard' && <LeaderboardScreen />}
      </div>
    </>
  );
}
