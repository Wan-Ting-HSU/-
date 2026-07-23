'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ---------------------------------------------------------------------------
// 四大關卡
// ---------------------------------------------------------------------------
export const STAGE_ORDER = ['atrium', 'ventricle', 'avnode', 'treatment'];

export const STAGE_META = {
  atrium: { title: '心房', subtitle: 'Atrium', variant: 'happy', tint: '#FFE1E7', ring: '#FF6B81' },
  ventricle: { title: '心室', subtitle: 'Ventricle', variant: 'strong', tint: '#FFE9DC', ring: '#FF8A5B' },
  avnode: { title: '房室結', subtitle: 'AV Node', variant: 'link', tint: '#DFF6F1', ring: '#3FBFAE' },
  treatment: { title: '治療處置', subtitle: '危急心電圖判斷', variant: 'alert', tint: '#FFE1E7', ring: '#E14F68' },
};

const NEEDED_CORRECT = 3; // 每關需答對幾題才算過關
const FINAL_WRONG_PENALTY_MS = 20 * 1000; // 最終關卡答錯，罰 20 秒

// ---------------------------------------------------------------------------
// 最終案例池：隨機出現，每個案例對應四關各自的純文字線索
// 取材自台北榮總心電圖室教學講義
// ---------------------------------------------------------------------------
export const FINAL_CASES = [
  {
    id: 'af',
    label: '心房顫動（Atrial Fibrillation）',
    clues: {
      atrium: 'P-P interval 不規則，看不到明顯的 P 波，代之以粗細不一的顫動波',
      ventricle: 'R-R interval 不規則（irregularly irregular），QRS 多為窄波',
      avnode: '心室反應（ventricular response）忽快忽慢，無固定房室傳導比',
      treatment: '否',
    },
  },
  {
    id: 'afl',
    label: '心房撲動（Atrial Flutter）',
    clues: {
      atrium: 'II、III、aVF 導程可見規則的鋸齒狀撲動波（sawtooth pattern）',
      ventricle: 'QRS 窄小，心室率規則，2:1 傳導時心室率約 150 bpm',
      avnode: '心房與心室之傳導比固定（如 2:1、3:1、4:1），非傳統可測量之 PR interval',
      treatment: '否',
    },
  },
  {
    id: 'mobitz2',
    label: '第二度房室傳導阻斷 Mobitz type II',
    clues: {
      atrium: 'P-P interval 規則，心房速率正常',
      ventricle: 'QRS 可能寬大（常合併束支病變），R-R interval 間歇性不規則',
      avnode: 'PR interval 固定不變，但間歇性有 P 波無法下傳心室（無漸進性延長）',
      treatment: '是',
    },
  },
  {
    id: 'vt',
    label: '心室頻脈（Ventricular Tachycardia）',
    clues: {
      atrium: 'P 波不易辨識，或與 QRS 呈現房室分離（AV dissociation）',
      ventricle: '寬大 QRS，規則節律，心率通常 > 150-200 bpm，單一型態',
      avnode: '心房與心室各自活動，彼此非同步',
      treatment: '是',
    },
  },
  {
    id: 'wpw',
    label: 'WPW 症候群（Wolff-Parkinson-White Syndrome）',
    clues: {
      atrium: 'P 波型態正常',
      ventricle: 'QRS 前緣可見 delta wave，QRS 波變寬',
      avnode: 'PR interval 明顯縮短，電衝動經由附加旁道（Kent bundle）提前到達心室',
      treatment: '否',
    },
  },
  {
    id: 'cavb',
    label: '完全房室傳導阻滯（Complete AV Block）',
    clues: {
      atrium: 'P-P interval 規則，心房速率約 75 bpm',
      ventricle: 'R-R interval 規則，心室速率約 38 bpm，QRS 寬大（junctional / ventricular escape rhythm 型態）',
      avnode: 'P 波與 QRS 之間無固定關聯性，P 波可能落在 QRS 之前、之中或之後',
      treatment: '是',
    },
  },
  {
    id: 'vf',
    label: '心室顫動（Ventricular Fibrillation）',
    clues: {
      atrium: '心房電氣活動無法辨識',
      ventricle: '混亂不規則波動，振幅忽大忽小，無法識別 QRS 或 T 波',
      avnode: '房室之間已無正常電氣傳導關係可言',
      treatment: '是',
    },
  },
  {
    id: 'mobitz1',
    label: '第二度房室傳導阻斷 Mobitz type I（Wenckebach）',
    clues: {
      atrium: 'P-P interval 規則，心房速率正常',
      ventricle: 'QRS 通常窄小，R-R interval 逐漸縮短，直到出現一次長間歇後重新開始',
      avnode: 'PR interval 逐漸延長，直到有一個 P 波無法下傳心室，之後 PR interval 重新開始（Wenckebach 現象）',
      treatment: '否',
    },
  },
];

const initialStages = () => ({
  atrium: { completed: false, clue: null, correctCount: 0, wrongCount: 0 },
  ventricle: { completed: false, clue: null, correctCount: 0, wrongCount: 0 },
  avnode: { completed: false, clue: null, correctCount: 0, wrongCount: 0 },
  treatment: { completed: false, clue: null, correctCount: 0, wrongCount: 0 },
});

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandomCaseId(excludeId) {
  const candidates = FINAL_CASES.filter((c) => c.id !== excludeId);
  const pool = candidates.length > 0 ? candidates : FINAL_CASES;
  return pool[Math.floor(Math.random() * pool.length)].id;
}

// 產生最終題的選項 id 陣列（正確案例 + 3 個隨機錯誤案例，順序打亂），
// 一回合內固定不變，答錯不會重新洗牌選項。
function buildFinalOptionIds(correctCaseId) {
  const others = shuffle(FINAL_CASES.filter((c) => c.id !== correctCaseId)).slice(0, 3);
  return shuffle([correctCaseId, ...others.map((c) => c.id)]);
}

export const useGameStore = create(
  persist(
    (set, get) => ({
      // gamePhase: info | start | stage_select | stage_quiz | final_quiz | leaderboard
      gamePhase: 'info',

      player: { name: '', unit: '' },

      startTime: null,
      endTime: null,
      penaltyMs: 0,

      activeStageId: null,
      currentQuestionId: null,

      stages: initialStages(),

      finalWrongAttempts: 0,
      selectedCaseId: null, // 本回合隨機抽中的最終案例
      finalOptionIds: [], // 本回合最終題的選項 id（固定順序）

      leaderboard: [],

      // -----------------------------------------------------------------
      setPlayerInfo: (name, unit) => set({ player: { name, unit } }),

      startGame: () => {
        const caseId = pickRandomCaseId(null);
        set({
          gamePhase: 'stage_select',
          startTime: Date.now(),
          endTime: null,
          penaltyMs: 0,
          activeStageId: null,
          currentQuestionId: null,
          stages: initialStages(),
          finalWrongAttempts: 0,
          selectedCaseId: caseId,
          finalOptionIds: buildFinalOptionIds(caseId),
        });
      },

      enterStage: (stageId, questionId) =>
        set({ gamePhase: 'stage_quiz', activeStageId: stageId, currentQuestionId: questionId }),

      setCurrentQuestion: (questionId) => set({ currentQuestionId: questionId }),

      answerStageQuestion: (isCorrect) => {
        const state = get();
        const stageId = state.activeStageId;
        if (!stageId) return;
        const stage = { ...state.stages[stageId] };
        if (isCorrect) {
          stage.correctCount += 1;
          if (stage.correctCount >= NEEDED_CORRECT && !stage.completed) {
            stage.completed = true;
            const caseObj = FINAL_CASES.find((c) => c.id === state.selectedCaseId);
            stage.clue = caseObj ? caseObj.clues[stageId] : null;
          }
        } else {
          stage.wrongCount += 1;
        }
        set({ stages: { ...state.stages, [stageId]: stage } });
      },

      backToStageSelect: () =>
        set({ gamePhase: 'stage_select', activeStageId: null, currentQuestionId: null }),

      enterFinalQuiz: () => set({ gamePhase: 'final_quiz' }),

      penalizeFinalWrong: () =>
        set((state) => ({
          penaltyMs: state.penaltyMs + FINAL_WRONG_PENALTY_MS,
          finalWrongAttempts: state.finalWrongAttempts + 1,
        })),

      finishGame: () => {
        const state = get();
        const endTime = Date.now();
        const totalMs = Math.max(0, endTime - state.startTime) + state.penaltyMs;
        const entry = {
          name: state.player.name?.trim() || '匿名實習生',
          unit: state.player.unit?.trim() || '-',
          timeMs: totalMs,
          date: new Date().toLocaleString('zh-TW', { hour12: false }),
        };
        const leaderboard = [...state.leaderboard, entry].sort((a, b) => a.timeMs - b.timeMs);
        set({ gamePhase: 'leaderboard', endTime, leaderboard });
      },

      goToStart: () => set({ gamePhase: 'start' }),
      goToInfo: () => set({ gamePhase: 'info', player: { name: '', unit: '' } }),
      restartRun: () => set({ gamePhase: 'start' }),
    }),
    {
      name: 'ecg-teaching-game-storage-v2',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const GAME_CONSTS = { NEEDED_CORRECT, FINAL_WRONG_PENALTY_MS };
