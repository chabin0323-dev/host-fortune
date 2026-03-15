import React, { useState, useEffect } from 'react';

const DIRECTIONS = ["北", "北東", "東", "南東", "南", "南西", "西", "北西"];
const L_ITEMS = ["天然石のブレスレット", "銀のブックマーク", "シルクのハンカチ", "アンティークの鍵", "革のパスケース", "クリスタルの置物", "手書きのメッセージ", "お気に入りの万年筆"];
const L_COLORS = ["ミッドナイトネイビー", "シャンパンゴールド", "パールホワイト", "ローズマダー", "セージグリーン", "テラコッタ", "ライラック", "コバルトブルー"];

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
    const saved = localStorage.getItem('mike_premium_v13');
    if (saved) {
      const d = JSON.parse(saved);
      setYVal(d.y); setMVal(d.m); setDVal(d.d); setBtVal(d.bt); setCsVal(d.cs); setZdVal(d.zd);
      setIsLocked(true);
    }
  }, []);

  const years = Array.from({ length: 80 }, (_, i) => (2026 - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  const handleStartFortune = () => {
    // 【修正：厳格な入力チェック】
    // 一つでも「不明」があればテロップを出す（他人を占う場合も最低限の入力は必要とする）
    if (yVal === '不明' || mVal === '不明' || dVal === '不明' || btVal === '不明' || csVal === '不明' || zdVal === '不明') {
      setErrorMsg('全ての項目を正しく入力してください');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const baseDate = new Date();
      if (targetDate === '明日') baseDate.setDate(baseDate.getDate() + 1);
      
      const pSeed = (yVal + btVal + csVal + zdVal).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const birthBase = new Date(`${yVal}-${mVal.padStart(2,'0')}-${dVal.padStart(2,'0')}`);
      
      // 【修正：より激しく動く波形ロジック】
      const getBioAtDate = (t: Date) => {
        const diff = Math.floor((t.getTime() - birthBase.getTime()) / (24 * 60 * 60 * 1000));
        // 振幅を大きくし、位相をずらして複雑な波を作る
        const p = Math.sin((2 * Math.PI * diff) / 23) * 45 + 50;
        const e = Math.sin((2 * Math.PI * (diff + 5)) / 28) * 45 + 50;
        const i = Math.sin((2 * Math.PI * (diff + 10)) / 33) * 45 + 50;
        const total = (p + e + i) / 3;
        // 星の計算（1〜5）
        const star = Math.max(1, Math.min(5, Math.floor(total / 20) + 1));
        return { p, e, i, star, total };
      };

      const mainBio = getBioAtDate(baseDate);
      
      // 折れ線グラフ用：変化を際立たせる
      const curvePoints = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() - 3 + i);
        return getBioAtDate(d).total;
      });

      const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];
      const weekly = Array.from({ length: 7 }, (_, idx) => {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() + idx);
        return { date: `${d.getMonth() + 1}/${d.getDate()}`, day: dayLabels[d.getDay()], star: getBioAtDate(d).star };
      });

      setFortuneResult({
        dateStr: `${baseDate.getFullYear()}年${(baseDate.getMonth() + 1)}月${baseDate.getDate()}日`,
        general: mainBio.star >= 4 ? "運命の歯車が力強く噛み合っています。これまでの迷いが晴れ、進むべき黄金の道が目の前に現れるでしょう。直感を信じて前進してください。" : "今は静かに内なる力を蓄える時です。周囲の喧騒から一度離れ、自分の本心と向き合うことで、新しい運気の扉が開かれます。",
        stars: {
          total: mainBio.star,
          money: { s: Math.max(1, Math.min(5, (pSeed % 5) + 1)), c: "金運の波が押し寄せています。自分への投資が将来的に大きな実りとなって返ってくる時期です。" },
          health: { s: Math.max(1, Math.min(5, Math.floor(mainBio.p / 20) + 1)), c: "エネルギーが満ち溢れています。適度な運動を取り入れることで、精神的な安定も手に入るでしょう。" },
          love: { s: Math.max(1, Math.min(5, ((pSeed + 3) % 4) + 2)), c: "魂が共鳴するような出会いや、関係の進展が期待できます。素直な気持ちを伝えることが幸運の鍵です。" },
          work: { s: Math.max(1, Math.min(5, Math.floor(mainBio.i / 20) + 1)), c: "あなたの才能が正当に評価される兆し。新しいプロジェクトや提案には積極的に関わっていきましょう。" }
        },
        lucky: { direction: DIRECTIONS[pSeed % 8], number: (pSeed % 9) + 1, item: L_ITEMS[pSeed % L_ITEMS.length], color: L_COLORS[pSeed % L_COLORS.length] },
        curvePoints,
        weekly
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
      
      {/* 【修正：エラーテロップ】 */}
      {errorMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold animate-bounce text-sm whitespace-nowrap">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* ヘッダー */}
      <div className="mt-8 mb-10 flex items-center justify-center gap-3">
        <div className="flex items-center gap-1 text-3xl font-bold">
          <span className="text-blue-500">m</span><span className="text-green-500">i</span><span className="text-yellow-400">★</span><span className="text-blue-400">k</span><span className="text-purple-500">e</span>
          <span className="text-[10px] text-gray-500 self-end mb-1 ml-1 font-mono uppercase">Premium</span>
        </div>
        <button onClick={() => setShowManual(true)} className="py-1 px-3 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400">取扱説明書</button>
      </div>

      <div className="w-full max-w-md px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-20 h-20 border-4 border-t-cyan-400 border-white/10 rounded-full animate-spin"></div>
            <p className="mt-8 text-cyan-400 tracking-widest animate-pulse font-serif">運命の波動を解析中...</p>
          </div>
        ) : page === 'INPUT' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">占いたい方の情報を入力</h2>
            
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2"><p className="text-blue-300 font-bold">生年月日</p>
                <select value={yVal} onChange={(e)=>setYVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none outline-none">
                  <option value="不明">年</option>{years.map(v => <option key={v} value={v}>{v}年</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <select value={mVal} onChange={(e)=>setMVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none outline-none">
                  <option value="不明">月</option>{months.map(v => <option key={v} value={v}>{v}月</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <select value={dVal} onChange={(e)=>setDVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none outline-none">
                  <option value="不明">日</option>{days.map(v => <option key={v} value={v}>{v}日</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2"><p className="text-blue-300 font-bold">血液型</p>
                <select value={btVal} onChange={(e)=>setBtVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none">
                  <option value="不明">選択</option>{["A型","B型","O型","AB型"].map(v=><option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-2"><p className="text-blue-300 font-bold">星座</p>
                <select value={csVal} onChange={(e)=>setCsVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none">
                  <option value="不明">選択</option>{["牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座", "天秤座", "蠍座", "射手座", "山羊座", "水瓶座", "魚座"].map(v=><option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-2"><p className="text-blue-300 font-bold">干支</p>
                <select value={zdVal} onChange={(e)=>setZdVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none">
                  <option value="不明">選択</option>{["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"].map(v=><option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="flex bg-[#111] rounded-xl p-1 border border-white/10">
              <button onClick={() => setTargetDate('今日')} className={`flex-1 py-3 text-xs rounded-lg ${targetDate === '今日' ? 'bg-indigo-600' : 'text-gray-500'}`}>今日</button>
              <button onClick={() => setTargetDate('明日')} className={`flex-1 py-3 text-xs rounded-lg ${targetDate === '明日' ? 'bg-indigo-600' : 'text-gray-500'}`}>明日</button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {!isLocked ? <button onClick={()=>{localStorage.setItem('mike_premium_v13', JSON.stringify({y:yVal,m:mVal,d:dVal,bt:btVal,cs:csVal,zd:zdVal})); setIsLocked(true);}} className="bg-[#222] text-gray-400 text-[10px] py-2 px-6 rounded-lg border border-white/5">入力を固定</button> :
              <><button onClick={()=>{localStorage.removeItem('mike_premium_v13'); setIsLocked(false);}} className="bg-red-900/20 text-red-400 text-[10px] py-2 px-4 rounded-lg">解除</button>
              <button onClick={()=>{setYVal('不明');setMVal('不明');setDVal('不明');setBtVal('不明');setCsVal('不明');setZdVal('不明');setIsLocked(false);}} className="bg-[#222] text-gray-400 text-[10px] py-2 px-4 rounded-lg border border-white/5">他人を占う</button></>}
            </div>

            <button onClick={handleStartFortune} className="w-full py-5 rounded-2xl font-bold text-lg bg-gradient-to-r from-fuchsia-600 to-cyan-600 shadow-lg active:scale-95 transition-all">鑑定を開始する</button>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-10 pb-10 text-left">
            <div className="bg-[#111] border border-white/10 p-5 rounded-xl text-center"><p className="text-cyan-400 text-[10px] font-bold uppercase">鑑定日：{fortuneResult.dateStr}</p></div>
            <div className="bg-[#1e1e1e] p-7 rounded-3xl border border-gray-800 shadow-xl"><h3 className="text-lg font-bold mb-4 text-white text-center border-b border-gray-800 pb-3">今日の総合運</h3><div className="flex justify-center mb-5">{renderStars(fortuneResult.stars.total)}</div><p className="text-[15px] text-gray-300 leading-relaxed font-light">{fortuneResult.general}</p></div>
            
            {/* 【修正：ダイナミック波形曲線】 */}
            <div className="bg-[#111] p-6 rounded-2xl border border-white/10 relative overflow-hidden">
              <h3 className="text-sm font-bold text-white mb-2 text-center">精密バイオリズム曲線</h3>
              <p className="text-[10px] text-gray-500 mb-6 text-center">※あなたの固有周期から導き出した運命の波形</p>
              <div className="w-full h-32 relative">
                <svg className="w-full h-full" viewBox="0 0 600 100" preserveAspectRatio="none">
                  <path d={`M 0,${100 - fortuneResult.curvePoints[0]} 
                            C 100,${100 - fortuneResult.curvePoints[1]} 
                              200,${100 - fortuneResult.curvePoints[2]} 
                              300,${100 - fortuneResult.curvePoints[3]} 
                            S 500,${100 - fortuneResult.curvePoints[5]} 
                              600,${100 - fortuneResult.curvePoints[6]}`} 
                    fill="none" stroke="url(#mike-grad)" strokeWidth="4" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="mike-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ec4899" /><stop offset="50%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  {/* 今日のポイントを強調 */}
                  <circle cx="300" cy={100 - fortuneResult.curvePoints[3]} r="6" fill="#fff" className="animate-pulse" />
                </svg>
                <div className="absolute inset-0 flex justify-between items-end px-1 pointer-events-none pb-1">
                  {["3日前", "2日前", "昨日", "今日", "明日", "2日後", "3日後"].map((l, i) => (<span key={i} className={`text-[8px] ${i === 3 ? 'text-white font-bold' : 'text-gray-600'}`}>{l}</span>))}
                </div>
              </div>
            </div>

            {/* 今週のバイオリズム */}
            <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-yellow-900/20">
              <h3 className="text-lg font-bold text-yellow-500 mb-6 font-serif italic text-center underline underline-offset-8 decoration-yellow-900/30">今週のバイオリズム</h3>
              <div className="space-y-3">{fortuneResult.weekly.map((item: any, idx: number) => (<div key={idx} className="bg-black/40 p-4 rounded-xl flex justify-between items-center border border-white/5"><span className={`text-[11px] font-bold ${item.day === '日' ? 'text-red-400' : item.day === '土' ? 'text-blue-400' : 'text-gray-400'}`}>{item.date}（{item.day}）</span><div className="flex gap-0.5">{renderStars(item.star)}</div></div>))}</div>
            </div>

            {/* ラッキー指針（黄色強調） */}
            <div className="bg-[#111] p-6 rounded-2xl border border-white/10">
              <h3 className="text-sm font-bold text-white mb-6 text-center">本日のラッキー指針</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col items-center"><span className="text-[10px] text-emerald-400 font-bold mb-1">吉方位</span><span className="text-lg font-bold text-white">{fortuneResult.lucky.direction}</span></div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col items-center"><span className="text-[10px] text-fuchsia-400 font-bold mb-1">幸運数</span><span className="text-lg font-bold text-white">{fortuneResult.lucky.number}</span></div>
              </div>
              <div className="space-y-3 text-xs">
                <div className="bg-black/40 p-3 rounded-xl flex justify-between px-4"><span className="text-gray-400">ラッキーアイテム</span><span className="text-yellow-400 font-bold">{fortuneResult.lucky.item}</span></div>
                <div className="bg-black/40 p-3 rounded-xl flex justify-between px-4"><span className="text-gray-400">ラッキーカラー</span><span className="text-yellow-400 font-bold">{fortuneResult.lucky.color}</span></div>
              </div>
            </div>

            {/* 4大運勢（長文コメント） */}
            <div className="grid grid-cols-1 gap-4">
              {[{ label: '金運', star: fortuneResult.stars.money.s, color: 'text-yellow-500', comm: fortuneResult.stars.money.c }, { label: '健康運', star: fortuneResult.stars.health.s, color: 'text-emerald-500', comm: fortuneResult.stars.health.c }, { label: '恋愛運', star: fortuneResult.stars.love.s, color: 'text-pink-500', comm: fortuneResult.stars.love.c }, { label: '仕事運', star: fortuneResult.stars.work.s, color: 'text-cyan-500', comm: fortuneResult.stars.work.c }].map((u, i) => (
                <div key={i} className="bg-[#1e1e1e] p-5 rounded-2xl border border-gray-800">
                  <div className="flex justify-between items-center mb-3"><p className={`font-bold text-sm ${u.color}`}>{u.label}</p><div className="flex gap-0.5">{renderStars(u.star)}</div></div>
                  <p className="text-[12px] text-gray-300 leading-relaxed font-light">{u.comm}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setPage('INPUT')} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs tracking-widest mt-6">戻って入力をやり直す</button>
          </div>
        )}
      </div>

      {/* 取説ポップアップ */}
      {showManual && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6" onClick={() => setShowManual(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <div className="relative bg-[#111827] border border-slate-700 p-8 rounded-3xl max-w-sm w-full shadow-2xl text-left text-sm text-gray-300" onClick={e=>e.stopPropagation()}>
            <h3 className="text-xl font-bold text-cyan-400 mb-6 border-b border-slate-800 pb-2 text-center">鑑定マニュアル</h3>
            <ul className="space-y-4">
              <li>1. 情報を全て入力し「鑑定を開始」をタップ。</li>
              <li>2. 生年月日から精密な波形曲線が描かれます。</li>
              <li>3. 入力漏れがある場合は警告テロップが表示されます。</li>
            </ul>
            <button onClick={() => setShowManual(false)} className="mt-8 w-full py-3 bg-gradient-to-r from-fuchsia-600 to-cyan-600 rounded-xl font-bold text-white shadow-lg">閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
