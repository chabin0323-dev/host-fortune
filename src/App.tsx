import React, { useState, useEffect } from 'react';

// --- 精密鑑定用定数定義 ---
const ELEMENTS = {
  FIRE: ['牡羊座', '獅子座', '射手座'],
  EARTH: ['牡牛座', '乙女座', '山羊座'],
  AIR: ['双子座', '天秤座', '水瓶座'],
  WATER: ['蟹座', '蠍座', '魚座']
};

const DIRECTIONS = ["北", "北東", "東", "南東", "南", "南西", "西", "北西"];

const fortuneDatabase = {
  elementMessages: {
    FIRE: {
      A: "情熱の火を内に秘めた今のあなたは、冷静な判断力と爆発的な行動力が共鳴しています。一歩引いて全体を俯瞰することで、勝利への最短距離が見えるでしょう。",
      B: "自由な創造力が溢れ出す時期です。周囲の形式にとらわれず、直感のままに動くことで、停滞していた運命が劇的に動き始めます。",
      O: "リーダーシップが輝きを放ちます。あなたの放つポジティブなエネルギーが、周囲の協力者を引き寄せ、大きな目的を達成する土壌を整えるでしょう。",
      AB: "独自の感性と情熱が融合し、誰も思いつかないようなアイデアが生まれる予兆。鋭い観察眼を活かして、隠れたチャンスを掴み取ってください。",
      default: "魂の情熱が再燃しています。直感を信じ、恐れずに最初の一歩を踏み出すことで、宇宙はあなたの味方を始めます。"
    },
    EARTH: {
      A: "誠実な努力が形になる時。足元を固め、目の前の課題に丁寧に向き合うことで、揺るぎない安定と信頼を手に入れることができるでしょう。",
      B: "現実的な視点の中に、遊び心を取り入れてみてください。堅実さと柔軟性を併せ持つことで、思わぬ方向から豊かさが舞い込みます。",
      O: "大地のような包容力が運気を支えます。他者を支える姿勢が、巡り巡ってあなた自身の大きな成功へと繋がっていく慈愛の時期です。",
      AB: "緻密な分析力が冴え渡ります。複雑に見える問題も、今のあなたなら核心を見抜き、最適な解決策を導き出すことができるはずです。",
      default: "安定の波動が流れています。焦らず、自分のペースを守ることで、確実な実りへと繋がる一日になるでしょう。"
    },
    AIR: {
      A: "洗練されたコミュニケーションが扉を開きます。知的な対話を通じて、新しい情報の波をキャッチし、自分自身の可能性を広げていく時期です。",
      B: "変化の風を乗りこなしてください。好奇心の赴くままに新しい世界へ飛び込むことで、人生のパラダイムシフトが起こるでしょう。",
      O: "社交運が最高潮です。人との繋がりが新たなチャンスを運び込みます。軽やかなフットワークを意識して、多くの人と交流しましょう。",
      AB: "論理と直感のバランスが完璧です。あなたの独創的な視点は、周囲に新しい風を吹き込み、価値観の刷新をもたらすことになります。",
      default: "情報と知性が運命の鍵です。柔軟な思考を持つことで、どのような状況も有利に進めることができるでしょう。"
    },
    WATER: {
      A: "深い共感力が幸運を引き寄せます。自分自身と向き合い、心の声に従うことで、本当の望みが現実化していく神秘的な流れの中にいます。",
      B: "感情の波を愛おしんでください。感受性が豊かになっている今、芸術や音楽から得られるインスピレーションが、未来を明るく照らします。",
      O: "溢れる慈愛が周囲を癒します。あなたの優しさが波紋のように広がり、愛に満ちた素晴らしい環境が整っていくでしょう。",
      AB: "神秘的な直感力が冴え、物事の裏側を見抜く力が備わっています。自分の内側に宿る無限の知恵を信じて行動してください。",
      default: "感情の豊かさが運命を彩ります。純粋な心を持ち続けることが、最大の守護となるでしょう。"
    },
    UNKNOWN: "今のあなたは未知の可能性に満ちています。既存の枠組みにとらわれず、自分自身の内なる声を信じることで、新しい道が開かれるでしょう。"
  },
  luckyItems: ["アンティーク調の鍵", "シルクの布", "天然石", "銀のブックマーク", "手書きのメモ", "クリスタル", "麻のポーチ"],
  luckyColors: ["ミッドナイトブルー", "シャンパンゴールド", "ライラック", "セージグリーン", "テラコッタ", "パールホワイト"]
};

const App: React.FC = () => {
  const [page, setPage] = useState<'INPUT' | 'RESULT'>('INPUT');
  const [loading, setLoading] = useState(false);
  const [targetDate, setTargetDate] = useState<'今日' | '明日'>('今日');
  const [isLocked, setIsLocked] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [fortuneResult, setFortuneResult] = useState<any>(null);

  const initialData = { year: '1980', month: '1', day: '1', bloodType: '不明', constellation: '不明', zodiac: '不明' };
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    const saved = localStorage.getItem('fortune_fixed_data');
    if (saved) { setFormData(JSON.parse(saved)); setIsLocked(true); }
  }, []);

  const calculateBiorhythm = (birth: Date, target: Date) => {
    const diff = Math.floor((target.getTime() - birth.getTime()) / (24 * 60 * 60 * 1000));
    return {
      physical: Math.round(Math.sin((2 * Math.PI * diff) / 23) * 50 + 50),
      emotional: Math.round(Math.sin((2 * Math.PI * diff) / 28) * 50 + 50),
      intellectual: Math.round(Math.sin((2 * Math.PI * diff) / 33) * 50 + 50)
    };
  };

  const getWeeklyDates = () => {
    const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];
    const dates = [];
    const baseDate = new Date();
    if (targetDate === '明日') baseDate.setDate(baseDate.getDate() + 1);
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      dates.push({ 
        date: `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`, 
        day: dayLabels[d.getDay()], 
        raw: new Date(d) 
      });
    }
    return dates;
  };
  const weeklyDates = getWeeklyDates();

  const generateFortune = () => {
    setLoading(true);
    const birthDate = new Date(`${formData.year}-${formData.month}-${formData.day}`);
    const target = weeklyDates[0].raw;
    const seedText = formData.year + formData.month + formData.day + formData.bloodType + formData.constellation + target.getDate();
    let seed = 0;
    for (let i = 0; i < seedText.length; i++) seed += seedText.charCodeAt(i);

    let message = "";
    if (formData.constellation === "不明") {
      message = fortuneDatabase.elementMessages.UNKNOWN;
    } else {
      let element: keyof typeof fortuneDatabase.elementMessages = 'FIRE';
      if (ELEMENTS.EARTH.includes(formData.constellation)) element = 'EARTH';
      if (ELEMENTS.AIR.includes(formData.constellation)) element = 'AIR';
      if (ELEMENTS.WATER.includes(formData.constellation)) element = 'WATER';

      const bloodKey = formData.bloodType.replace('型', '') as 'A' | 'B' | 'O' | 'AB';
      message = (fortuneDatabase.elementMessages[element] as any)[bloodKey] || (fortuneDatabase.elementMessages[element] as any).default;
    }

    const bio = calculateBiorhythm(birthDate, target);

    const result = {
      general: message,
      bio: bio,
      lucky: {
        item: fortuneDatabase.luckyItems[seed % fortuneDatabase.luckyItems.length],
        color: fortuneDatabase.luckyColors[(seed + 7) % fortuneDatabase.luckyColors.length],
        number: (seed % 9) + 1,
        direction: DIRECTIONS[(seed + target.getDate()) % DIRECTIONS.length]
      },
      stars: {
        total: Math.floor(bio.emotional / 20) + 1,
        money: (seed % 5) + 1,
        health: Math.floor(bio.physical / 20) + 1,
        love: (seed % 4) + 2,
        work: Math.floor(bio.intellectual / 20) + 1,
      },
      comments: {
        money: "必要なものを見極めると金運が安定します。",
        health: "軽い運動が心身のバランスを整えてくれます。",
        love: "焦らず穏やかに向き合うことで関係が深まります。",
        work: "今日は地道な努力が実りやすい日です。"
      }
    };
    setFortuneResult(result);
    setTimeout(() => { setLoading(false); setPage('RESULT'); window.scrollTo(0, 0); }, 2000);
  };

  const renderStars = (count: number) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < count ? "text-yellow-400" : "text-gray-800"}>★</span>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center pb-20 relative overflow-x-hidden">
      
      {/* ロゴと取扱説明書ボタン */}
      <div className="mt-8 mb-10 flex items-center gap-3">
        <div className="flex items-center gap-1 text-3xl font-bold">
          <span className="text-blue-500">m</span><span className="text-green-500">i</span><span className="text-yellow-400">★</span><span className="text-blue-400">k</span><span className="text-purple-500">e</span>
          <span className="text-[10px] text-gray-500 self-end mb-1 ml-1 font-normal tracking-tighter">ver.2 Premium</span>
        </div>
        <button onClick={() => setShowManual(true)} className="py-1 px-2.5 rounded-full bg-white/5 border border-white/10 text-[9px] text-gray-400 hover:text-white transition-colors">
          取扱説明書
        </button>
      </div>

      {showManual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowManual(false)}></div>
          <div className="relative bg-[#111827] border border-slate-700 p-8 rounded-3xl max-w-sm w-full shadow-2xl text-left">
            <h3 className="text-xl font-bold text-cyan-400 mb-6 border-b border-slate-800 pb-2">鑑定マニュアル</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li>1. 情報を正確に入力し「運勢を占う」をタップしてください。</li>
              <li>2. 情報が分からない場合は「不明」を選択しても鑑定可能です。</li>
              <li>3. 「入力を固定する」と、高度な解析に基づきあなたの情報を常に優先表示します。</li>
              <li>4. 他の方を占う際は「他人を占う」をご利用ください。</li>
            </ul>
            <button onClick={() => setShowManual(false)} className="mt-8 w-full py-3 bg-gradient-to-r from-fuchsia-600 to-cyan-600 rounded-xl font-bold">閉じる</button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md px-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-700">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-fuchsia-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-cyan-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse text-yellow-400">★</div>
            </div>
            <p className="mt-8 text-cyan-400 tracking-[0.2em] font-light animate-pulse text-sm">運命の糸を読み解いています...</p>
          </div>
        ) : page === 'INPUT' ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-center text-2xl font-bold mb-8 bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              占いたい方の情報を入力して下さい
            </h2>
            
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2">
                <p className="text-blue-300">生年月日</p><p>年</p>
                <select disabled={isLocked} value={formData.year} onChange={(e)=>setFormData({...formData, year: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3 outline-none">
                  {Array.from({ length: 80 }, (_, i) => (2026 - i).toString()).map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <p>月</p>
                <select disabled={isLocked} value={formData.month} onChange={(e)=>setFormData({...formData, month: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3 outline-none">
                  {Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <p>日</p>
                <select disabled={isLocked} value={formData.day} onChange={(e)=>setFormData({...formData, day: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3 outline-none">
                  {Array.from({ length: 31 }, (_, i) => (i + 1).toString()).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2">
                <p className="text-blue-300">血液型</p>
                <select disabled={isLocked} value={formData.bloodType} onChange={(e)=>setFormData({...formData, bloodType: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3">
                  <option>不明</option><option>A型</option><option>B型</option><option>O型</option><option>AB型</option>
                </select>
              </div>
              <div className="space-y-2">
                <p className="text-blue-300">星座</p>
                <select disabled={isLocked} value={formData.constellation} onChange={(e)=>setFormData({...formData, constellation: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3">
                  <option>不明</option><option>牡羊座</option><option>牡牛座</option><option>双子座</option><option>蟹座</option><option>獅子座</option><option>乙女座</option><option>天秤座</option><option>蠍座</option><option>射手座</option><option>山羊座</option><option>水瓶座</option><option>魚座</option>
                </select>
              </div>
              <div className="space-y-2">
                <p className="text-blue-300">干支</p>
                <select disabled={isLocked} value={formData.zodiac} onChange={(e)=>setFormData({...formData, zodiac: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3">
                  <option>不明</option><option>子</option><option>丑</option><option>寅</option><option>卯</option><option>辰</option><option>巳</option><option>午</option><option>未</option><option>申</option><option>酉</option><option>戌</option><option>亥</option>
                </select>
              </div>
            </div>

            <div className="flex bg-[#0f172a] rounded-xl p-1 border border-slate-800">
              {(['今日', '明日'] as const).map((d) => (
                <button key={d} onClick={() => setTargetDate(d)} className={`flex-1 py-3 text-xs rounded-lg transition-all ${targetDate === d ? 'bg-indigo-600 text-white' : 'text-gray-500'}`}>{d}の運勢を占う</button>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {!isLocked ? (
                <button onClick={() => {localStorage.setItem('fortune_fixed_data', JSON.stringify(formData)); setIsLocked(true);}} className="bg-[#2c3748] text-gray-200 text-[10px] py-2 px-5 rounded-lg border border-slate-700">入力を固定する</button>
              ) : (
                <><button onClick={() => {localStorage.removeItem('fortune_fixed_data'); setIsLocked(false);}} className="bg-red-900/20 text-red-300 text-[10px] py-2 px-4 rounded-lg border border-red-900/40 text-xs">解除</button><button onClick={() => {setFormData(initialData); setIsLocked(false);}} className="bg-[#2c3748] text-gray-200 text-[10px] py-2 px-4 rounded-lg border border-slate-700 text-xs">他人を占う</button></>
              )}
            </div>

            <button onClick={generateFortune} className="w-full py-5 rounded-2xl font-bold text-lg bg-gradient-to-r from-fuchsia-500 to-cyan-500 mt-2 active:scale-95 shadow-lg shadow-fuchsia-500/20">鑑定を開始する</button>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-10 text-left pb-10">
            <div className="bg-[#111827] border border-slate-800 p-5 rounded-xl text-center shadow-inner">
              <p className="text-cyan-400 text-[10px] mb-1 font-bold uppercase tracking-widest text-xs">鑑定日</p>
              <p className="text-xl font-bold tracking-widest text-white">{weeklyDates[0].date}</p>
            </div>

            {/* 総合運 */}
            <div className="bg-[#1e1e1e] p-7 rounded-3xl border border-gray-800 shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-white">今日の総合運</h3>
              <div className="mb-5">{renderStars(fortuneResult.stars.total)}</div>
              <p className="text-[15px] text-gray-300 leading-relaxed font-light">{fortuneResult.general}</p>
            </div>

            {/* 精密バイオリズム */}
            <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800">
              <h3 className="text-sm font-bold text-white mb-2">精密バイオリズム解析</h3>
              <p className="text-[10px] text-gray-500 mb-6 leading-relaxed">
                ※生年月日から算出される身体・感情・知性の周期的なリズムです。現在のコンディションを視覚化しています。
              </p>
              <div className="space-y-5">
                {[
                  { label: '身体 (Physical)', val: fortuneResult.bio.physical, color: 'bg-emerald-500' },
                  { label: '感情 (Emotional)', val: fortuneResult.bio.emotional, color: 'bg-pink-500' },
                  { label: '知性 (Intellectual)', val: fortuneResult.bio.intellectual, color: 'bg-cyan-500' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] text-gray-400"><span>{item.label}</span><span>{item.val}%</span></div>
                    <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} transition-all duration-1000 shadow-[0_0_8px_rgba(255,255,255,0.3)]`} style={{ width: `${item.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 今週のバイオリズム */}
            <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-yellow-900/20">
              <h3 className="text-lg font-bold text-yellow-500 mb-6 font-serif italic tracking-tighter">今週のバイオリズム</h3>
              <div className="space-y-4">
                {weeklyDates.map((item, idx) => (
                  <div key={idx} className="bg-black/40 p-4 rounded-xl border border-gray-800/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] text-gray-400 font-mono">{item.date}（{item.day}）</span>
                      {renderStars(idx === 0 ? fortuneResult.stars.total : (idx % 2 === 0 ? 3 : 4))}
                    </div>
                    <p className="text-[12px] text-gray-300 leading-relaxed italic">
                      {idx === 0 ? fortuneResult.general.substring(0, 35) + "..." : '穏やかな流れです。丁寧な対話が開運の鍵となります。'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 本日のラッキー指針 */}
            <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800">
              <h3 className="text-sm font-bold text-white mb-6">本日のラッキー指針</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col items-center">
                  <span className="text-[10px] text-emerald-400 font-bold mb-1">ラッキー方位</span>
                  <span className="text-lg font-bold text-white">{fortuneResult.lucky.direction}</span>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col items-center">
                  <span className="text-[10px] text-fuchsia-400 font-bold mb-1">ナンバー</span>
                  <span className="text-lg font-bold text-white">{fortuneResult.lucky.number}</span>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-xs">
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-gray-500">アイテム:</span><span className="text-gray-200 font-bold">{fortuneResult.lucky.item}</span>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex justify-between">
                  <span className="text-gray-500">カラー:</span><span className="text-gray-200 font-bold">{fortuneResult.lucky.color}</span>
                </div>
              </div>
            </div>

            {/* 四大運勢 */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: '金運', star: fortuneResult.stars.money, color: 'text-yellow-500', comm: fortuneResult.comments.money },
                { label: '健康運', star: fortuneResult.stars.health, color: 'text-emerald-500', comm: fortuneResult.comments.health },
                { label: '恋愛運', star: fortuneResult.stars.love, color: 'text-pink-500', comm: fortuneResult.comments.love },
                { label: '仕事運', star: fortuneResult.stars.work, color: 'text-cyan-500', comm: fortuneResult.comments.work }
              ].map((u, i) => (
                <div key={i} className="bg-[#1e1e1e] p-4 rounded-2xl border border-gray-800">
                  <p className={`font-bold mb-2 text-xs ${u.color}`}>{u.label}</p>
                  <div className="mb-2">{renderStars(u.star)}</div>
                  <p className="text-[10px] text-gray-500 leading-tight">{u.comm}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setPage('INPUT')} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-gray-500 text-xs tracking-widest mt-6">
              戻って入力をやり直す
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
