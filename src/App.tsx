
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
    const saved = localStorage.getItem('mike_premium_v12');
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
    if (yVal === '不明' && btVal === '不明' && csVal === '不明') {
      setErrorMsg('データが不足しています');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }
    setLoading(true);
    
    setTimeout(() => {
      const baseDate = new Date();
      if (targetDate === '明日') baseDate.setDate(baseDate.getDate() + 1);
      const dSeed = baseDate.getFullYear() + baseDate.getMonth() + baseDate.getDate();
      const pSeed = (yVal + btVal + csVal + zdVal).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const totalSeed = pSeed + dSeed;
      const birthBase = (yVal === '不明') ? new Date(2000, 0, 1) : new Date(`${yVal}-${mVal === '不明' ? '01' : mVal.padStart(2,'0')}-${dVal === '不明' ? '01' : dVal.padStart(2,'0')}`);
      
      const getBioAtDate = (t: Date) => {
        const diff = Math.floor((t.getTime() - birthBase.getTime()) / (24 * 60 * 60 * 1000));
        const p = Math.sin((2 * Math.PI * diff) / 23) * 50 + 50;
        const e = Math.sin((2 * Math.PI * (diff + (pSeed % 7))) / 28) * 50 + 50;
        const i = Math.sin((2 * Math.PI * (diff + (pSeed % 11))) / 33) * 50 + 50;
        return { p, e, i, star: Math.max(1, Math.min(5, Math.floor(e / 20) + 1)), total: (p + e + i) / 3 };
      };

      const mainBio = getBioAtDate(baseDate);
      
      // 波形曲線データ（SVGパス用）
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
        general: mainBio.star >= 4 ? "宇宙の波動が最高潮に達しています。これまでの努力が黄金の結果を連れてくる日。迷わず最大の決断をしてください。" : "今日は静寂を友にしてください。外へ向かうよりも内面を磨くことで、次なる飛躍の種が芽生えます。",
        stars: {
          total: mainBio.star,
          money: { s: Math.max(1, Math.min(5, (totalSeed % 5) + 1)), c: "予期せぬ場所から豊かさが舞い込む予兆。直感を信じて少額の投資や宝くじにツキがあります。" },
          health: { s: Math.max(1, Math.min(5, Math.floor(mainBio.p / 20) + 1)), c: "細胞が活性化しています。自然の多い場所へ出向き、深呼吸を繰り返すことで邪気が払われます。" },
          love: { s: Math.max(1, Math.min(5, ((totalSeed + 5) % 4) + 2)), c: "あなたの魂の輝きに惹かれ、共鳴する者が現れます。誠実な言葉が運命を動かす鍵となるでしょう。" },
          work: { s: Math.max(1, Math.min(5, Math.floor(mainBio.i / 20) + 1)), c: "卓越した知性が冴え渡ります。難解な課題も今のあなたなら容易に解決の糸口を見つけ出せるはずです。" }
        },
        lucky: { direction: DIRECTIONS[totalSeed % 8], number: (totalSeed % 9) + 1, item: L_ITEMS[totalSeed % L_ITEMS.length], color: L_COLORS[totalSeed % L_COLORS.length] },
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
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
            <div className="w-20 h-20 border-4 border-t-fuchsia-500 border-white/10 rounded-full animate-spin"></div>
            <p className="mt-8 text-fuchsia-400 tracking-widest animate-pulse font-serif">天界の理を解析中...</p>
          </div>
        ) : page === 'INPUT' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">占いたい方の情報を入力</h2>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2"><p className="text-blue-300 font-bold">生年月日</p>
                <select value={yVal} onChange={(e)=>setYVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white outline-none appearance-none">
                  <option value="不明">不明</option>{years.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <select value={mVal} onChange={(e)=>setMVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white outline-none">
                  <option value="不明">不明</option>{months.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <select value={dVal} onChange={(e)=>setDVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white outline-none">
                  <option value="不明">不明</option>{days.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2"><p className="text-blue-300 font-bold">血液型</p>
                <select value={btVal} onChange={(e)=>setBtVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white outline-none">
                  <option value="不明">不明</option>{["A型","B型","O型","AB型"].map(v=><option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-2"><p className="text-blue-300 font-bold">星座</p>
                <select value={csVal} onChange={(e)=>setCsVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white outline-none">
                  <option value="不明">不明</option>{["牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座", "天秤座", "蠍座", "射手座", "山羊座", "水瓶座", "魚座"].map(v=><option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-2"><p className="text-blue-300 font-bold">干支</p>
                <select value={zdVal} onChange={(e)=>setZdVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white outline-none">
                  <option value="不明">不明</option>{["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"].map(v=><option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="flex bg-[#111] rounded-xl p-1 border border-white/10">
              <button onClick={() => setTargetDate('今日')} className={`flex-1 py-3 text-xs rounded-lg ${targetDate === '今日' ? 'bg-indigo-600' : 'text-gray-500'}`}>今日</button>
              <button onClick={() => setTargetDate('明日')} className={`flex-1 py-3 text-xs rounded-lg ${targetDate === '明日' ? 'bg-indigo-600' : 'text-gray-500'}`}>明日</button>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              {!isLocked ? <button onClick={()=>{localStorage.setItem('mike_premium_v12', JSON.stringify({y:yVal,m:mVal,d:dVal,bt:btVal,cs:csVal,zd:zdVal})); setIsLocked(true);}} className="bg-[#222] text-gray-400 text-[10px] py-2 px-6 rounded-lg border border-white/5 shadow-md">入力を固定</button> :
              <><button onClick={()=>{localStorage.removeItem('mike_premium_v12'); setIsLocked(false);}} className="bg-red-900/20 text-red-400 text-[10px] py-2 px-4 rounded-lg">解除</button>
              <button onClick={()=>{setYVal('不明');setMVal('不明');setDVal('不明');setBtVal('不明');setCsVal('不明');setZdVal('不明');setIsLocked(false);}} className="bg-[#222] text-gray-400 text-[10px] py-2 px-4 rounded-lg">他人を占う</button></>}
            </div>
            <button onClick={handleStartFortune} className="w-full py-5 rounded-2xl font-bold text-lg bg-gradient-to-r from-fuchsia-600 to-cyan-600 shadow-lg active:scale-95 transition-all">鑑定を開始する</button>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-10 pb-10 text-left">
            <div className="bg-[#111] border border-white/10 p-5 rounded-xl text-center"><p className="text-cyan-400 text-[10px] font-bold uppercase">鑑定日：{fortuneResult.dateStr}</p></div>
            <div className="bg-[#1e1e1e] p-7 rounded-3xl border border-gray-800 shadow-xl"><h3 className="text-lg font-bold mb-4 text-white text-center border-b border-gray-800 pb-3">今日の総合運</h3><div className="mb-5">{renderStars(fortuneResult.stars.total)}</div><p className="text-[15px] text-gray-300 leading-relaxed font-light">{fortuneResult.general}</p></div>
            
            {/* 精密バイオリズム曲線 (SVG曲線描画) */}
            <div className="bg-[#111] p-6 rounded-2xl border border-white/10 relative overflow-hidden">
              <h3 className="text-sm font-bold text-white mb-2 text-center">精密バイオリズム曲線</h3>
              <p className="text-[10px] text-gray-500 mb-6 text-center">※過去3日〜未来3日の運命のエネルギー波を解析</p>
              <div className="w-full h-32 relative">
                <svg className="w-full h-full" viewBox="0 0 600 100" preserveAspectRatio="none">
                  <path d={`M 0,${100 - fortuneResult.curvePoints[0]} C 100,${100 - fortuneResult.curvePoints[1]} 200,${100 - fortuneResult.curvePoints[2]} 300,${100 - fortuneResult.curvePoints[3]} S 500,${100 - fortuneResult.curvePoints[5]} 600,${100 - fortuneResult.curvePoints[6]}`} 
                    fill="none" stroke="url(#wave-grad)" strokeWidth="3" />
                  <defs><linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="50%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#8b5cf6" /></linearGradient></defs>
                  <circle cx="300" cy={100 - fortuneResult.curvePoints[3]} r="5" fill="#f0abfc" />
                </svg>
                <div className="absolute inset-0 flex justify-between items-end px-1 pointer-events-none">
                  {["-3d", "-2d", "-1d", "今日", "+1d", "+2d", "+3d"].map((l, i) => (<span key={i} className={`text-[8px] ${i === 3 ? 'text-cyan-400 font-bold' : 'text-gray-600'}`}>{l}</span>))}
                </div>
              </div>
            </div>

            <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-yellow-900/20">
              <h3 className="text-lg font-bold text-yellow-500 mb-6 font-serif italic text-center underline underline-offset-8 decoration-yellow-900/30">今週のバイオリズム</h3>
              <div className="space-y-3">{fortuneResult.weekly.map((item: any, idx: number) => (<div key={idx} className="bg-black/40 p-4 rounded-xl flex justify-between items-center border border-white/5"><span className={`text-[11px] font-bold ${item.day === '日' ? 'text-red-400' : item.day === '土' ? 'text-blue-400' : 'text-gray-400'}`}>{item.date}（{item.day}）</span><div className="flex gap-0.5">{renderStars(item.star)}</div></div>))}</div>
            </div>

            {/* 本日のラッキー指針（文字色を黄色に修正して視認性UP） */}
            <div className="bg-[#111] p-6 rounded-2xl border border-white/10 text-left">
              <h3 className="text-sm font-bold text-white mb-6 text-center">本日のラッキー指針</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col items-center"><span className="text-[10px] text-emerald-400 font-bold mb-1">吉方位</span><span className="text-lg font-bold text-white">{fortuneResult.lucky.direction}</span></div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col items-center"><span className="text-[10px] text-fuchsia-400 font-bold mb-1">ラッキー数</span><span className="text-lg font-bold text-white">{fortuneResult.lucky.number}</span></div>
              </div>
              <div className="space-y-3 text-xs">
                <div className="bg-black/40 p-3 rounded-xl flex justify-between border border-white/5">
                  <span className="text-gray-400">ラッキーアイテム</span>
                  <span className="text-yellow-400 font-bold text-right ml-4">{fortuneResult.lucky.item}</span>
                </div>
                <div className="bg-black/40 p-3 rounded-xl flex justify-between border border-white/5">
                  <span className="text-gray-400">ラッキーカラー</span>
                  <span className="text-yellow-400 font-bold text-right ml-4">{fortuneResult.lucky.color}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-left">
              {[{ label: '金運', star: fortuneResult.stars.money.s, color: 'text-yellow-500', comm: fortuneResult.stars.money.c }, { label: '健康運', star: fortuneResult.stars.health.s, color: 'text-emerald-500', comm: fortuneResult.stars.health.c }, { label: '恋愛運', star: fortuneResult.stars.love.s, color: 'text-pink-500', comm: fortuneResult.stars.love.c }, { label: '仕事運', star: fortuneResult.stars.work.s, color: 'text-cyan-500', comm: fortuneResult.stars.work.c }].map((u, i) => (
                <div key={i} className="bg-[#1e1e1e] p-5 rounded-2xl border border-gray-800">
                  <div className="flex justify-between items-center mb-3">
                    <p className={`font-bold text-sm ${u.color}`}>{u.label}</p>
                    <div className="flex gap-0.5">{renderStars(u.star)}</div>
                  </div>
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
              <li>1. 情報を入力し「鑑定を開始」をタップ。</li>
              <li>2. 生年月日などが不明な場合でも、現時刻の星位から鑑定可能です。</li>
              <li>3. 波形曲線で運勢の『勢い』を、長文コメントで『詳細』を読み解きます。</li>
            </ul>
            <button onClick={() => setShowManual(false)} className="mt-8 w-full py-3 bg-gradient-to-r from-fuchsia-600 to-cyan-600 rounded-xl font-bold text-white shadow-lg">閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
