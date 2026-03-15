import React, { useState, useEffect } from 'react';

const DIRECTIONS = ["北", "北東", "東", "南東", "南", "南西", "西", "北西"];
const L_ITEMS = ["天然石のブレスレット", "銀のブックマーク", "シルクのハンカチ", "アンティークの鍵", "革のパスケース", "クリスタルの置物", "手書きのメッセージ", "お気に入りの万年筆"];
const L_COLORS = [
  { name: "ミッドナイトネイビー", hex: "#1e3a8a" },
  { name: "シャンパンゴールド", hex: "#d4af37" },
  { name: "パールホワイト", hex: "#f8fafc" },
  { name: "ローズマダー", hex: "#e11d48" },
  { name: "セージグリーン", hex: "#10b981" },
  { name: "テラコッタ", hex: "#c2410c" },
  { name: "ライラック", hex: "#a855f7" },
  { name: "コバルトブルー", hex: "#2563eb" }
];

const App: React.FC = () => {
  const [page, setPage] = useState<'INPUT' | 'RESULT'>('INPUT');
  const [loading, setLoading] = useState(false);
  const [targetDate, setTargetDate] = useState<'今日' | '明日'>('今日');
  const [isLocked, setIsLocked] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fortuneResult, setFortuneResult] = useState<any>(null);

  const [yVal, setYVal] = useState('不明');
  const [mVal, setMVal] = useState('不明');
  const [dVal, setDVal] = useState('不明');
  const [btVal, setBtVal] = useState('不明');
  const [csVal, setCsVal] = useState('不明');
  const [zdVal, setZdVal] = useState('不明');

  useEffect(() => {
    const saved = localStorage.getItem('mike_aura_v16');
    if (saved) {
      const d = JSON.parse(saved);
      setYVal(d.y); setMVal(d.m); setDVal(d.d);
      setBtVal(d.bt); setCsVal(d.cs); setZdVal(d.zd);
      setIsLocked(true);
    }
  }, []);

  const getSynchronizedComment = (type: string, stars: number) => {
    const database: any = {
      money: [
        "今は守りに徹する時。無駄な支出を抑えることが、将来の豊かさの種になります。",
        "収支のバランスを意識して。節約を楽しむ心の余裕が運気を好転させます。",
        "金運は安定。自分への投資や知識を深めるための出費にツキがあります。",
        "豊かさの波が接近中。直感を信じることでお得な情報を掴み取れるでしょう。",
        "最強の財運が到来！大きな利益を手にする好機です。迷わず行動を。"
      ],
      health: [
        "心身ともに疲れが出やすい時期。無理をせず、今日は早めに休息をとって。",
        "少し気力が減退気味。栄養のある食事と深い呼吸でエネルギーを回復させて。",
        "健康状態は良好です。軽い散歩を日常に取り入れることでさらに整います。",
        "エネルギーが満ち溢れています。活動的に動けますが、睡眠時間は削らずに。",
        "生命力が最高潮！研ぎ澄まされた感覚で、何事にも全力で取り組めます。"
      ],
      love: [
        "今は自分を磨く準備期間。焦らず、心の静寂を大切に過ごしてください。",
        "周囲との距離感を大切に。控えめな振る舞いがあなたの魅力を引き立てます。",
        "安定した運気。素直な笑顔を心がけることで身近な人との絆が深まります。",
        "愛の女神が微笑んでいます。一歩踏み出す勇気が運命を劇的に変えるでしょう。",
        "魂が共鳴するような最高の恋愛運。奇跡的な展開が訪れる予感があります。"
      ],
      work: [
        "集中力が途切れがち。今あるタスクを丁寧に片付けることで信頼を維持して。",
        "足元を固める時期。ルーチンワークに楽しみを見出すことで飛躍の土台が完成。",
        "着実な進歩が見込める日。周囲との協調性を大切にすると円滑に進みます。",
        "独創的なアイデアが認められる兆し。自信を持って提案を発信しましょう。",
        "仕事運は絶好調！卓越した手腕で周囲を圧倒し、新たなステージへ進めます。"
      ]
    };
    return database[type][stars - 1] || "穏やかな運気です。";
  };

  const handleStartFortune = () => {
    if (yVal === '不明' && mVal === '不明' && dVal === '不明' && btVal === '不明' && csVal === '不明' && zdVal === '不明') {
      setErrorMsg('生年月日などの情報を入力してください（最低１つ以上）');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const baseDate = new Date();
      if (targetDate === '明日') baseDate.setDate(baseDate.getDate() + 1);
      
      const pSeed = (yVal + btVal + csVal + zdVal).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const birthBase = (yVal === '不明') ? new Date(2000, 0, 1) : new Date(`${yVal}-${mVal === '不明' ? '01' : mVal.padStart(2,'0')}-${dVal === '不明' ? '01' : dVal.padStart(2,'0')}`);
      const diff = Math.floor((baseDate.getTime() - birthBase.getTime()) / (24 * 60 * 60 * 1000));
      
      const e = Math.sin((2 * Math.PI * (diff + 5)) / 28) * 50 + 50;
      const mainStar = Math.max(1, Math.min(5, Math.floor(e / 20) + 1));

      // オーラカラーの選出（属性や星の数で変化）
      const color1 = L_COLORS[pSeed % L_COLORS.length];
      const color2 = L_COLORS[(pSeed + mainStar) % L_COLORS.length];

      setFortuneResult({
        dateStr: `${baseDate.getFullYear()}年${(baseDate.getMonth() + 1)}月${baseDate.getDate()}日`,
        general: mainStar >= 4 ? "運命の歯車が力強く噛み合っています。これまでの迷いが晴れ、進むべき黄金の道が目の前に現れるでしょう。" : "今は静かに内なる力を蓄える時です。周囲の喧騒から一度離れ、自分の本心と向き合うことで開運します。",
        aura: { c1: color1.hex, c2: color2.hex, name1: color1.name, name2: color2.name },
        stars: {
          total: mainStar,
          money: { s: Math.max(1, Math.min(5, (pSeed % 5) + 1)), c: getSynchronizedComment("money", Math.max(1, Math.min(5, (pSeed % 5) + 1))) },
          health: { s: Math.max(1, Math.min(5, (diff % 5) + 1)), c: getSynchronizedComment("health", Math.max(1, Math.min(5, (diff % 5) + 1))) },
          love: { s: Math.max(1, Math.min(5, ((pSeed + baseDate.getDate()) % 4) + 2)), c: getSynchronizedComment("love", Math.max(1, Math.min(5, ((pSeed + baseDate.getDate()) % 4) + 2))) },
          work: { s: Math.max(1, Math.min(5, ((pSeed + 10) % 5) + 1)), c: getSynchronizedComment("work", Math.max(1, Math.min(5, ((pSeed + 10) % 5) + 1))) }
        },
        lucky: { direction: DIRECTIONS[pSeed % 8], number: (pSeed % 9) + 1, item: L_ITEMS[pSeed % L_ITEMS.length] }
      });
      setLoading(false); setPage('RESULT'); window.scrollTo(0, 0);
    }, 2000);
  };

  const renderStars = (count: number) => (
    <div className="flex gap-1 justify-center">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < count ? "text-yellow-400 text-lg" : "text-gray-800 text-lg"}>★</span>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center pb-20 relative text-center overflow-x-hidden">
      
      {errorMsg && <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold animate-bounce text-sm whitespace-nowrap">⚠️ {errorMsg}</div>}

      <div className="mt-8 mb-10 flex items-center justify-center gap-3">
        <div className="flex items-center gap-1 text-3xl font-bold">
          <span className="text-blue-500">m</span><span className="text-green-500">i</span><span className="text-yellow-400">★</span><span className="text-blue-400">k</span><span className="text-purple-500">e</span>
          <span className="text-[10px] text-gray-500 self-end mb-1 ml-1 font-mono uppercase">Premium</span>
        </div>
        <button onClick={() => setShowManual(true)} className="py-1 px-3 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400">取扱説明書</button>
      </div>

      <div className="w-full max-w-md px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]"><div className="w-20 h-20 border-4 border-t-cyan-400 border-white/10 rounded-full animate-spin"></div><p className="mt-8 text-cyan-400 tracking-widest animate-pulse font-serif">魂の波動を解析中...</p></div>
        ) : page === 'INPUT' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">情報を入力して下さい</h2>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2"><p className="text-blue-300 font-bold">生年月日</p><select value={yVal} onChange={(e)=>setYVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white outline-none"><option value="不明">年</option>{Array.from({ length: 80 }, (_, i) => (2026 - i).toString()).map(v => <option key={v} value={v}>{v}年</option>)}</select></div>
              <div className="space-y-2 flex flex-col justify-end"><select value={mVal} onChange={(e)=>setMVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white outline-none"><option value="不明">月</option>{Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map(v => <option key={v} value={v}>{v}月</option>)}</select></div>
              <div className="space-y-2 flex flex-col justify-end"><select value={dVal} onChange={(e)=>setDVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white outline-none"><option value="不明">日</option>{Array.from({ length: 31 }, (_, i) => (i + 1).toString()).map(v => <option key={v} value={v}>{v}日</option>)}</select></div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2"><p className="text-blue-300 font-bold">血液型</p><select value={btVal} onChange={(e)=>setBtVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white outline-none"><option value="不明">選択</option>{["A型","B型","O型","AB型"].map(v=><option key={v} value={v}>{v}</option>)}</select></div>
              <div className="space-y-2 text-center"><p className="text-blue-300 font-bold">星座</p><select value={csVal} onChange={(e)=>setCsVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white outline-none"><option value="不明">選択</option>{["牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座", "天秤座", "蠍座", "射手座", "山羊座", "水瓶座", "魚座"].map(v=><option key={v} value={v}>{v}</option>)}</select></div>
              <div className="space-y-2 text-center"><p className="text-blue-300 font-bold">干支</p><select value={zdVal} onChange={(e)=>setZdVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white outline-none"><option value="不明">選択</option>{["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"].map(v=><option key={v} value={v}>{v}</option>)}</select></div>
            </div>
            <div className="flex bg-[#111] rounded-xl p-1 border border-white/10"><button onClick={() => setTargetDate('今日')} className={`flex-1 py-3 text-xs rounded-lg transition-all ${targetDate === '今日' ? 'bg-indigo-600' : 'text-gray-500'}`}>今日</button><button onClick={() => setTargetDate('明日')} className={`flex-1 py-3 text-xs rounded-lg transition-all ${targetDate === '明日' ? 'bg-indigo-600' : 'text-gray-500'}`}>明日</button></div>
            <div className="flex justify-end gap-2 pt-2">{!isLocked ? <button onClick={()=>{localStorage.setItem('mike_aura_v16', JSON.stringify({y:yVal,m:mVal,d:dVal,bt:btVal,cs:csVal,zd:zdVal})); setIsLocked(true);}} className="bg-[#222] text-gray-400 text-[10px] py-2 px-6 rounded-lg border border-white/5">入力を固定</button> : <><button onClick={()=>{localStorage.removeItem('mike_aura_v16'); setIsLocked(false);}} className="bg-red-900/20 text-red-400 text-[10px] py-2 px-4 rounded-lg">解除</button><button onClick={()=>{setYVal('不明');setMVal('不明');setDVal('不明');setBtVal('不明');setCsVal('不明');setZdVal('不明');setIsLocked(false);}} className="bg-[#222] text-gray-400 text-[10px] py-2 px-4 rounded-lg border border-white/5">他人を占う</button></>}</div>
            <button onClick={handleStartFortune} className="w-full py-5 rounded-2xl font-bold text-lg bg-gradient-to-r from-fuchsia-600 to-cyan-600 shadow-lg active:scale-95 transition-all">鑑定を開始する</button>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-10 pb-10 text-left">
            <div className="bg-[#111] border border-white/10 p-5 rounded-xl text-center shadow-inner"><p className="text-cyan-400 text-[10px] font-bold uppercase">鑑定日：{fortuneResult.dateStr}</p></div>
            <div className="bg-[#1e1e1e] p-7 rounded-3xl border border-gray-800 shadow-xl"><h3 className="text-lg font-bold mb-4 text-white text-center border-b border-gray-800 pb-3">今日の総合運</h3><div className="flex justify-center mb-5">{renderStars(fortuneResult.stars.total)}</div><p className="text-[15px] text-gray-300 leading-relaxed font-light">{fortuneResult.general}</p></div>
            
            {/* ★運命のオーラ解析アニメーション */}
            <div className="bg-[#111] p-8 rounded-2xl border border-white/10 overflow-hidden relative">
              <h3 className="text-sm font-bold text-white mb-6 text-center">運命のオーラ解析</h3>
              <div className="flex flex-col items-center gap-6">
                {/* オーラを表現するアニメーションサークル */}
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 rounded-full blur-3xl opacity-60 animate-pulse" style={{ background: fortuneResult.aura.c1 }}></div>
                  <div className="absolute inset-0 rounded-full blur-2xl opacity-60 animate-bounce" style={{ background: fortuneResult.aura.c2, animationDuration: '3s' }}></div>
                  <div className="absolute inset-2 rounded-full border border-white/20 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Current Aura</p>
                      <div className="w-12 h-1 mx-auto mt-1 rounded-full" style={{ background: `linear-gradient(to right, ${fortuneResult.aura.c1}, ${fortuneResult.aura.c2})` }}></div>
                    </div>
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs text-gray-300">今日のあなたは</p>
                  <p className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    <span style={{ color: fortuneResult.aura.c1 }}>{fortuneResult.aura.name1}</span> と <span style={{ color: fortuneResult.aura.c2 }}>{fortuneResult.aura.name2}</span>
                  </p>
                  <p className="text-xs text-gray-400">の光が混ざり合う神秘的な波動です</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[{ label: '金運', star: fortuneResult.stars.money.s, color: 'text-yellow-500', comm: fortuneResult.stars.money.c }, { label: '健康運', star: fortuneResult.stars.health.s, color: 'text-emerald-500', comm: fortuneResult.stars.health.c }, { label: '恋愛運', star: fortuneResult.stars.love.s, color: 'text-pink-500', comm: fortuneResult.stars.love.c }, { label: '仕事運', star: fortuneResult.stars.work.s, color: 'text-cyan-500', comm: fortuneResult.stars.work.c }].map((u, i) => (
                <div key={i} className="bg-[#1e1e1e] p-5 rounded-2xl border border-gray-800">
                  <div className="flex justify-between items-center mb-3"><p className={`font-bold text-sm ${u.color}`}>{u.label}</p><div className="flex gap-0.5">{renderStars(u.star)}</div></div>
                  <p className="text-[12px] text-gray-300 leading-relaxed font-light">{u.comm}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#111] p-6 rounded-2xl border border-white/10 text-left">
              <h3 className="text-sm font-bold text-white mb-6 text-center">本日のラッキー指針</h3>
              <div className="space-y-3 text-xs">
                <div className="bg-black/40 p-3 rounded-xl flex justify-between px-4"><span className="text-gray-400">ラッキーアイテム</span><span className="text-yellow-400 font-bold">{fortuneResult.lucky.item}</span></div>
                <div className="bg-black/40 p-3 rounded-xl flex justify-between px-4"><span className="text-gray-400">吉方位</span><span className="text-yellow-400 font-bold">{fortuneResult.lucky.direction}</span></div>
              </div>
            </div>

            <button onClick={() => setPage('INPUT')} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs tracking-widest mt-6">戻って入力をやり直す</button>
          </div>
        )}
      </div>

      {showManual && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6" onClick={() => setShowManual(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <div className="relative bg-[#111827] border border-slate-700 p-8 rounded-3xl max-w-sm w-full shadow-2xl text-left text-sm text-gray-300" onClick={e=>e.stopPropagation()}>
            <h3 className="text-xl font-bold text-cyan-400 mb-6 border-b border-slate-800 pb-2 text-center font-serif">鑑定マニュアル</h3>
            <ul className="space-y-4">
              <li>1. 情報を入力し「鑑定を開始」をタップ。</li>
              <li>2. あなたの「魂の色（オーラ）」を解析し、アニメーションで表示します。</li>
              <li>3. 星の数と完全に同期したプロのアドバイスをお届けします。</li>
            </ul>
            <button onClick={() => setShowManual(false)} className="mt-8 w-full py-3 bg-gradient-to-r from-fuchsia-600 to-cyan-600 rounded-xl font-bold text-white shadow-lg">閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
