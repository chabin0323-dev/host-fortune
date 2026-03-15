import React, { useState, useEffect } from 'react';

// --- 鑑定データベース（本格占い師仕様） ---
const fortuneDatabase = {
  general: [
    "銀河の配置があなたの魂の刻印と重なり、今、運命の歯車が静かに、かつ力強く回り始めました。これまでの苦労は、すべて今日この瞬間の輝きのための伏線だったのです。目に見えない守護の力が、あなたを正しい場所へと導こうとしています。",
    "静寂の中にこそ、真実の響きがあります。今は外側の喧騒から離れ、自らの深淵を見つめる時。あなたの直感という名の羅針盤は、すでに進むべき方角を指し示しています。恐れることはありません、その微かな光こそが黄金の未来への入り口です。",
    "変革の風があなたの元へ届いています。これは単なる変化ではなく、魂の脱皮とも言える重要な局面。古い殻を脱ぎ捨て、本来のあなたとして羽ばたく準備を整えてください。直感的に選んだ道にこそ、最大の豊かさが眠っています。",
    "太陽の輝きがあなたの宿命の領域を照らし出しています。今は、あなたが主役として舞台に立つべき時。周囲の期待に応えるだけでなく、あなた自身の情熱の炎を燃やしてください。その輝きが、多くの人々を救い、引き寄せるでしょう。",
    "月が象徴する「無意識の領域」が活発になっています。夢やふとした瞬間の思いつきに、重要なメッセージが隠されているようです。論理よりも感性を、思考よりも鼓動を優先させることで、滞っていた運気は劇的に改善へと向かいます。"
  ],
  actions: [
    "午前中のうちに、東の方角に向かって深く三回呼吸をする。",
    "手帳やノートの白紙のページに、あなたの理想の未来を一つだけ書き記す。",
    "古いレシートや不要なメールを整理し、新しい運気が入る「空白」を作る。",
    "水の流れる音を聞きながら、鏡に向かって自分自身に微笑みかける。",
    "紫色の花、あるいは紫色の小物を目につく場所に置く。"
  ],
  advises: [
    "沈黙は金なり。今日は多くを語らず、聴く側に回ることで、重要な智恵を授かります。",
    "他人の評価という鏡を捨て、あなた自身の心の鏡を磨くことに集中してください。",
    "「与えること」から始めれば、宇宙の法則に従って、倍以上の豊かさが返ってきます。",
    "足元を固める時です。日常の小さなルーチンを丁寧にこなすことが、大きな飛躍を支えます。",
    "偶然を装った「シンクロニシティ」に敏感になってください。それは天からのサインです。"
  ],
  luckyItems: [
    "アンティーク調の鍵", "シルクのナイトキャップ", "天然石のペーパーウェイト", 
    "手書きのメッセージカード", "アロマオイル（サンダルウッド）", "銀のブックマーク"
  ],
  luckyColors: [
    "ミッドナイトネイビー", "シャンパンゴールド", "ライラックパープル", 
    "セージグリーン", "テラコッタオレンジ", "パールホワイト"
  ]
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

  const getWeeklyDates = () => {
    const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];
    const dates = [];
    const baseDate = new Date();
    if (targetDate === '明日') baseDate.setDate(baseDate.getDate() + 1);
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      dates.push({ date: `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`, day: dayLabels[d.getDay()] });
    }
    return dates;
  };
  const weeklyDates = getWeeklyDates();

  const generateFortune = () => {
    setLoading(true);
    // ユーザーの属性と日付から一意の数値を生成
    const seedText = formData.year + formData.month + formData.day + formData.bloodType + formData.constellation + formData.zodiac + new Date().getDate();
    let seed = 0;
    for (let i = 0; i < seedText.length; i++) seed += seedText.charCodeAt(i);

    const select = (arr: any[], offset = 0) => arr[(seed + offset) % arr.length];

    const result = {
      general: select(fortuneDatabase.general),
      action: select(fortuneDatabase.actions, 10),
      advise: select(fortuneDatabase.advises, 20),
      stars: {
        total: (seed % 3) + 3,
        money: (seed % 5) + 1,
        health: ((seed + 7) % 5) + 1,
        love: ((seed + 13) % 5) + 1,
        work: ((seed + 21) % 5) + 1,
      },
      lucky: {
        item: select(fortuneDatabase.luckyItems, 5),
        color: select(fortuneDatabase.luckyColors, 15),
        number: (seed % 9) + 1
      }
    };
    setFortuneResult(result);
    setTimeout(() => { setLoading(false); setPage('RESULT'); window.scrollTo(0, 0); }, 2000);
  };

  const handleLock = () => { localStorage.setItem('fortune_fixed_data', JSON.stringify(formData)); setIsLocked(true); };
  const handleUnlock = () => { localStorage.removeItem('fortune_fixed_data'); setIsLocked(false); };
  const handleResetForOther = () => { setFormData(initialData); setIsLocked(false); };

  const renderStars = (count: number) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < count ? "text-yellow-400" : "text-gray-600"}>★</span>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center pb-20 overflow-x-hidden relative">
      
      {/* 取扱説明書 */}
      <div className="mt-8 mb-10 flex items-center gap-3">
        <div className="flex items-center gap-1 text-3xl font-bold">
          <span className="text-blue-500">m</span><span className="text-green-500">i</span><span className="text-yellow-400">★</span><span className="text-blue-400">k</span><span className="text-purple-500">e</span>
          <span className="text-xs text-gray-500 self-end mb-1 ml-1 font-normal tracking-tighter">ver.2 Premium</span>
        </div>
        <button onClick={() => setShowManual(true)} className="py-1 px-2.5 rounded-full bg-white/5 border border-white/10 text-[9px] text-gray-400">取扱説明書</button>
      </div>

      {showManual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowManual(false)}></div>
          <div className="relative bg-[#111827] border border-slate-700 p-8 rounded-3xl max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-cyan-400 mb-6 border-b border-slate-800 pb-2">鑑定マニュアル</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li>1. 情報を正確に入力し「運勢を占う」をタップ。</li>
              <li>2. 「入力を固定」で次回の入力を省略。</li>
              <li>3. 高度な解析エンジンがあなたの宿命を読み解きます。</li>
            </ul>
            <button onClick={() => setShowManual(false)} className="mt-8 w-full py-3 bg-gradient-to-r from-fuchsia-600 to-cyan-600 rounded-xl font-bold">閉じる</button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md px-5 text-left">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-fuchsia-500/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 border-4 border-t-cyan-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-4xl text-yellow-400">★</div>
            </div>
            <p className="mt-8 text-cyan-400 tracking-widest animate-pulse">運命の糸を読み解いています...</p>
          </div>
        ) : page === 'INPUT' ? (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="text-center text-2xl font-bold mb-8 bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">占いたい方の情報を入力して下さい</h2>
            
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2"><p className="text-blue-300">生年月日</p><p>年</p><select disabled={isLocked} value={formData.year} onChange={(e)=>setFormData({...formData, year: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3">{Array.from({ length: 77 }, (_, i) => (2026 - i).toString()).map(y => <option key={y} value={y}>{y}</option>)}</select></div>
              <div className="space-y-2 flex flex-col justify-end"><p>月</p><select disabled={isLocked} value={formData.month} onChange={(e)=>setFormData({...formData, month: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3"><option>不明</option>{Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map(m => <option key={m} value={m}>{m}</option>)}</select></div>
              <div className="space-y-2 flex flex-col justify-end"><p>日</p><select disabled={isLocked} value={formData.day} onChange={(e)=>setFormData({...formData, day: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3"><option>不明</option>{Array.from({ length: 31 }, (_, i) => (i + 1).toString()).map(d => <option key={d} value={d}>{d}</option>)}</select></div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2"><p className="text-blue-300">血液型</p><select disabled={isLocked} value={formData.bloodType} onChange={(e)=>setFormData({...formData, bloodType: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3"><option>不明</option><option>A型</option><option>B型</option><option>O型</option><option>AB型</option></select></div>
              <div className="space-y-2"><p className="text-blue-300">星座</p><select disabled={isLocked} value={formData.constellation} onChange={(e)=>setFormData({...formData, constellation: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3"><option>不明</option><option>牡羊座</option><option>牡牛座</option><option>双子座</option><option>蟹座</option><option>獅子座</option><option>乙女座</option><option>天秤座</option><option>蠍座</option><option>射手座</option><option>山羊座</option><option>水瓶座</option><option>魚座</option></select></div>
              <div className="space-y-2"><p className="text-blue-300">干支</p><select disabled={isLocked} value={formData.zodiac} onChange={(e)=>setFormData({...formData, zodiac: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3"><option>不明</option><option>子</option><option>丑</option><option>寅</option><option>卯</option><option>辰</option><option>巳</option><option>午</option><option>未</option><option>申</option><option>酉</option><option>戌</option><option>亥</option></select></div>
            </div>

            <div className="space-y-3">
              <p className="text-blue-300 text-xs">占う日</p>
              <div className="flex bg-[#0f172a] rounded-lg p-1 border border-slate-800">
                {(['今日', '明日'] as const).map((d) => (
                  <button key={d} onClick={() => setTargetDate(d)} className={`flex-1 py-3 text-sm rounded-lg ${targetDate === d ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500'}`}>{d}</button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {!isLocked ? <button onClick={handleLock} className="bg-[#2c3748] text-gray-200 text-xs py-2.5 px-6 rounded-lg border border-slate-700">入力を固定する</button> :
              <><button onClick={handleUnlock} className="bg-red-900/30 text-red-200 text-xs py-2.5 px-4 rounded-lg border border-red-800/50">固定を解除</button><button onClick={handleResetForOther} className="bg-[#2c3748] text-gray-200 text-xs py-2.5 px-4 rounded-lg border border-slate-700">他人を占う</button></>}
            </div>

            <button onClick={generateFortune} className="w-full py-5 rounded-2xl font-bold text-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 mt-2 tracking-widest text-white active:scale-95 shadow-lg shadow-fuchsia-500/20">運勢を占う</button>
            <p className="text-center text-gray-500 text-[10px] mt-4 tracking-tighter">Powered by Celestial Analysis Engine ver.2.0</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-10">
            <div className="bg-[#111827] border border-slate-800 p-5 rounded-xl text-center shadow-inner">
              <p className="text-cyan-400 text-[10px] mb-1 font-bold uppercase tracking-widest">Reading Date</p>
              <p className="text-xl font-bold tracking-widest text-white">{weeklyDates[0].date}</p>
            </div>

            <div className="bg-[#1e1e1e] p-7 rounded-3xl border border-gray-800 shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-white">今日の総合運</h3>
              <div className="mb-5">{renderStars(fortuneResult.stars.total)}</div>
              <p className="text-[15px] text-gray-300 leading-relaxed font-light">{fortuneResult.general}</p>
            </div>

            <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-emerald-900/40">
              <h3 className="text-lg font-bold text-emerald-400 mb-3 font-serif italic">今日の開運アクション</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{fortuneResult.action}</p>
            </div>

            <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800">
              <h3 className="text-lg font-bold mb-3 text-white">今日のアドバイス</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{fortuneResult.advise}</p>
            </div>

            <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-yellow-900/20">
              <h3 className="text-lg font-bold text-yellow-500 mb-6 font-serif italic tracking-tighter">今週のバイオリズム</h3>
              <div className="space-y-4">
                {weeklyDates.map((item, idx) => (
                  <div key={idx} className="bg-black/40 p-4 rounded-xl border border-gray-800/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] text-gray-400 font-mono">{item.date}（{item.day}）</span>
                      {renderStars(idx === 0 ? fortuneResult.stars.total : (idx % 2 === 0 ? 3 : 4))}
                    </div>
                    <p className="text-[12px] text-gray-400 leading-relaxed italic">
                      {idx === 0 ? fortuneResult.general.substring(0, 35) + "..." : '宇宙のエネルギーは緩やかに推移。内なる調和を保つことで開運へと繋がります。'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1e1e1e] p-5 rounded-2xl border border-gray-800">
                <p className="font-bold mb-2 text-sm text-yellow-500">金運</p>
                <div className="mb-2 text-xs">{renderStars(fortuneResult.stars.money)}</div>
                <p className="text-[10px] text-gray-500">価値ある投資への好機</p>
              </div>
              <div className="bg-[#1e1e1e] p-5 rounded-2xl border border-gray-800">
                <p className="font-bold mb-2 text-sm text-green-500">健康運</p>
                <div className="mb-2 text-xs">{renderStars(fortuneResult.stars.health)}</div>
                <p className="text-[10px] text-gray-500">心身の浄化を優先すべき時</p>
              </div>
            </div>

            <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800">
              <h3 className="text-lg font-bold mb-6 text-white">ラッキー情報</h3>
              <div className="space-y-3 text-sm">
                <div className="bg-black/40 p-4 rounded-xl border border-white/5"><span className="text-fuchsia-400 font-bold tracking-wider">アイテム：</span> {fortuneResult.lucky.item}</div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5"><span className="text-cyan-400 font-bold tracking-wider">カラー：</span> {fortuneResult.lucky.color}</div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5"><span className="text-emerald-400 font-bold tracking-wider">ナンバー：</span> {fortuneResult.lucky.number}</div>
              </div>
            </div>

            <div className="pt-6 pb-12">
              <button onClick={() => setPage('INPUT')} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm tracking-widest font-medium transition-colors hover:text-white">← 戻って入力をやり直す</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
