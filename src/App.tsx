import React, { useState, useEffect } from 'react';

// --- 定数 ---
const DIRECTIONS = ["北", "北東", "東", "南東", "南", "南西", "西", "北西"];
const L_ITEMS = ["天然石のブレスレット", "銀のブックマーク", "シルクのハンカチ", "アンティークの鍵", "革のパスケース", "ガラスの文鎮", "手書きのメモ", "お気に入りのペン"];
const L_COLORS = ["ミッドナイトブルー", "シャンパンゴールド", "パールホワイト", "ローズマダー", "セージグリーン", "テラコッタ", "ライラック", "コバルトブルー"];

const App: React.FC = () => {
  const [page, setPage] = useState<'INPUT' | 'RESULT'>('INPUT');
  const [loading, setLoading] = useState(false);
  const [targetDate, setTargetDate] = useState<'今日' | '明日'>('今日');
  const [isLocked, setIsLocked] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fortuneResult, setFortuneResult] = useState<any>(null);

  // フォームデータ
  const [yVal, setYVal] = useState('不明');
  const [mVal, setMVal] = useState('不明');
  const [dVal, setDVal] = useState('不明');
  const [btVal, setBtVal] = useState('不明');
  const [csVal, setCsVal] = useState('不明');
  const [zdVal, setZdVal] = useState('不明');

  useEffect(() => {
    const saved = localStorage.getItem('mike_final_fix_v11');
    if (saved) {
      const d = JSON.parse(saved);
      setYVal(d.y); setMVal(d.m); setDVal(d.d);
      setBtVal(d.bt); setCsVal(d.cs); setZdVal(d.zd);
      setIsLocked(true);
    }
  }, []);

  const years = Array.from({ length: 80 }, (_, i) => (2026 - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  // 鑑定メッセージを星の数×日付要素で動的に生成
  const getDynamicComment = (stars: number, dateSeed: number) => {
    const comments = {
      5: ["宇宙の波動が最高潮に達しています。これまでの努力が黄金の結果を連れてくる日。迷わず最大の決断を。", "魂の輝きが周囲を圧倒します。あなたが主役となり、運命の歯車を大きく動かすチャンスが到来しました。"],
      4: ["運気は高水準で安定。誠実な対話が信頼を深め、滞っていた計画が音を立てて動き始めます。自信を持って。", "知性と直感のバランスが完璧です。新しい情報の波に飛び込むことで、人生のパラダイムシフトが起こります。"],
      3: ["穏やかで心地よい一日です。無理に攻めるよりも、足元を固め、周囲との調和を楽しむことで開運します。", "充電に適した運気。日常の小さな幸せを大切に。夜、自分へのご褒美を用意すると運気がさらに向上します。"],
      default: ["今日は静寂を友にしてください。外へ向かうよりも内面を磨くことで、次なる飛躍の種が芽生えます。", "浄化の時。不要なものを手放し、心に空白を作ることで、新しい運気の風が吹き込んできます。"]
    };
    const list = stars >= 5 ? comments[5] : stars === 4 ? comments[4] : stars === 3 ? comments[3] : comments.default;
    return list[dateSeed % list.length];
  };

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
      
      const dSeed = baseDate.getFullYear() + (baseDate.getMonth() + 1) * 31 + baseDate.getDate();
      const pSeed = (yVal + bloodType + constellation + zodiac).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const totalSeed = pSeed + dSeed;

      const birthBase = (yVal === '不明') ? new Date(2000, 0, 1) : new Date(`${yVal}-${mVal === '不明' ? '01' : mVal.padStart(2,'0')}-${dVal === '不明' ? '01' : dVal.padStart(2,'0')}`);
      
      const getBioAtDate = (t: Date) => {
        const diff = Math.floor((t.getTime() - birthBase.getTime()) / (24 * 60 * 60 * 1000));
        const p = Math.round(Math.sin((2 * Math.PI * diff) / 23) * 50 + 50);
        const e = Math.round(Math.sin((2 * Math.PI * (diff + (pSeed % 7))) / 28) * 50 + 50);
        const i = Math.round(Math.sin((2 * Math.PI * (diff + (pSeed % 11))) / 33) * 50 + 50);
        const tStar = Math.max(1, Math.min(5, Math.floor(e / 20) + 1));
        return { p, e, i, star: tStar, total: (p + e + i) / 3 };
      };

      const mainBio = getBioAtDate(baseDate);
      const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];

      // ★折れ線グラフ用：過去3日〜未来3日のデータを生成
      const curveData = Array.from({ length: 7 }, (_, idx) => {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() - 3 + idx);
        const b = getBioAtDate(d);
        return { 
          label: idx === 3 ? "今日" : `${d.getMonth() + 1}/${d.getDate()}`,
          val: b.total // 総合値を波形の高さにする
        };
      });

      const weekly = Array.from({ length: 7 }, (_, idx) => {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() + idx);
        const b = getBioAtDate(d);
        return { date: `${d.getMonth() + 1}/${d.getDate()}`, day: dayLabels[d.getDay()], star: b.star };
      });

      setFortuneResult({
        dateStr: `${baseDate.getFullYear()}年${(baseDate.getMonth() + 1)}月${baseDate.getDate()}日`,
        general: getDynamicComment(mainBio.star, totalSeed),
        bio: mainBio,
        curveData, // 波形データ
        stars: { 
          total: mainBio.star, 
          money: Math.max(1, Math.min(5, ((totalSeed + 3) % 5) + 1)), 
          health: Math.max(1, Math.min(5, Math.floor(mainBio.p / 20) + 1)), 
          love: Math.max(1, Math.min(5, ((totalSeed + 7) % 4) + 2)), 
          work: Math.max(1, Math.min(5, Math.floor(mainBio.i / 20) + 1)) 
        },
        lucky: { 
          direction: DIRECTIONS[totalSeed % 8], 
          number: (totalSeed % 9) + 1, 
          item: L_ITEMS[totalSeed % L_ITEMS.length], 
          color: L_COLORS[totalSeed % L_COLORS.length] 
        },
        weekly
      });

      setLoading(false);
      setPage('RESULT');
      window.scrollTo(0, 0);
    }, 2000);
  };

  const handleLock = () => {
    localStorage.setItem('mike_final_fix_v11', JSON.stringify({y:yVal, m:mVal, d:dVal, bt:btVal, cs:csVal, zd:zdVal}));
    setIsLocked(true);
  };

  const resetAll = () => {
    setYVal('不明'); setMVal('不明'); setDVal('不明');
    setBtVal('不明'); setCsVal('不明'); setZdVal('不明');
    setIsLocked(false);
    localStorage.removeItem('mike_final_fix_v11');
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
      {errorMsg && <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold animate-bounce text-sm">{errorMsg}</div>}

      <div className="mt-8 mb-10 flex items-center justify-center gap-3">
        <div className="flex items-center gap-1 text-3xl font-bold">
          <span className="text-blue-500">m</span><span className="text-green-500">i</span><span className="text-yellow-400">★</span><span className="text-blue-400">k</span><span className="text-purple-500">e</span>
          <span className="text-[10px] text-gray-500 self-end mb-1 ml-1 font-mono uppercase">ver.2 Premium</span>
        </div>
        <button onClick={() => setShowManual(true)} className="py-1 px-3 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400">取扱説明書</button>
      </div>

      <div className="w-full max-w-md px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-20 h-20 border-4 border-t-cyan-400 border-white/10 rounded-full animate-spin"></div>
            <p className="mt-8 text-cyan-400 tracking-widest animate-pulse">宿命を解析中...</p>
          </div>
        ) : page === 'INPUT' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">占いたい方の情報を入力して下さい</h2>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2"><p className="text-blue-300 font-bold">生年月日</p><p>年</p>
                <select value={yVal} onChange={(e)=>setYVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none outline-none">
                  <option value="不明">不明</option>
                  {years.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end text-center"><p>月</p>
                <select value={mVal} onChange={(e)=>setMVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white outline-none">
                  <option value="不明">不明</option>
                  {months.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end text-center"><p>日</p>
                <select value={dVal} onChange={(e)=>setDVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white outline-none">
                  <option value="不明">不明</option>
                  {days.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs text-center">
              <div className="space-y-2"><p className="text-blue-300 font-bold">血液型</p>
                <select value={btVal} onChange={(e)=>setBtVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white outline-none">
                  <option value="不明">不明</option><option value="A型">A型</option><option value="B型">B型</option><option value="O型">O型</option><option value="AB型">AB型</option>
                </select>
              </div>
              <div className="space-y-2"><p className="text-blue-300 font-bold">星座</p>
                <select value={csVal} onChange={(e)=>setCsVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white outline-none">
                  <option value="不明">不明</option>
                  {["牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座", "天秤座", "蠍座", "射手座", "山羊座", "水瓶座", "魚座"].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-2"><p className="text-blue-300 font-bold">干支</p>
                <select value={zdVal} onChange={(e)=>setZdVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white outline-none">
                  <option value="不明">不明</option>
                  {["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="flex bg-[#111] rounded-xl p-1 border border-white/10">
              <button onClick={() => setTargetDate('今日')} className={`flex-1 py-3 text-xs rounded-lg transition-all ${targetDate === '今日' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}>今日</button>
              <button onClick={() => setTargetDate('明日')} className={`flex-1 py-3 text-xs rounded-lg transition-all ${targetDate === '明日' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}>明日</button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {!isLocked ? <button onClick={handleLock} className="bg-[#222] text-gray-400 text-[10px] py-2.5 px-6 rounded-lg border border-white/5 active:scale-95 transition-all">入力を固定する</button> :
              <><button onClick={() => { localStorage.removeItem('mike_final_fix_v11'); setIsLocked(false); }} className="bg-red-900/20 text-red-400 text-[10px] py-2.5 px-4 rounded-lg">解除</button><button onClick={resetAll} className="bg-[#222] text-gray-400 text-[10px] py-2.5 px-4 rounded-lg border border-white/5 active:scale-95 transition-all">他人を占う</button></>}
            </div>

            <button onClick={handleStartFortune} className="w-full py-5 rounded-2xl font-bold text-lg bg-gradient-to-r from-fuchsia-500 to-cyan-500 shadow-xl active:scale-95 transition-all">鑑定を開始する</button>
          </div>
        ) : (
          /* 結果画面 */
          <div className="space-y-6 animate-in slide-in-from-bottom-10 pb-10 text-left">
            <div className="bg-[#111] border border-white/10 p-5 rounded-xl text-center shadow-inner"><p className="text-cyan-400 text-[10px] mb-1 font-bold uppercase tracking-widest">鑑定日</p><p className="text-xl font-bold text-white tracking-widest">{fortuneResult.dateStr}</p></div>
            <div className="bg-[#1e1e1e] p-7 rounded-3xl border border-gray-800 shadow-xl Text-left"><h3 className="text-lg font-bold mb-4 text-white text-center border-b border-gray-800 pb-3">今日の総合運</h3><div className="flex justify-center mb-5">{renderStars(fortuneResult.stars.total)}</div><p className="text-[15px] text-gray-300 leading-relaxed font-light">{fortuneResult.general}</p></div>
            
            {/* 折れ線グラフ（運命の波形グラフ）への全面刷新 */}
            <div className="bg-[#111] p-6 rounded-2xl border border-white/10">
              <h3 className="text-sm font-bold text-white mb-2 text-center">精密バイオリズム曲線</h3>
              <p className="text-[10px] text-gray-500 mb-6 text-center leading-relaxed">※過去3日〜未来3日の「運命のエネルギー波」を視覚化しています。</p>
              
              {/* 折れ線グラフの描画エリア */}
              <div className="w-full h-32 flex items-end justify-between px-2 gap-1 relative border-b border-gray-800">
                <div className="absolute top-0 left-0 right-0 h-px bg-gray-900"></div> {/* 100%ライン */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-900"></div> {/* 50%ライン */}
                
                {fortuneResult.curveData.map((d:any, i:number) => (
                  <div key={i} className="flex-1 flex flex-col items-center group">
                    <div className={`w-2.5 bg-gradient-to-t ${i === 3 ? 'from-cyan-500 to-fuchsia-500' : 'from-gray-800 to-gray-600'} rounded-t-sm relative transition-all duration-1000 shadow-md group-hover:from-fuchsia-400`} style={{ height: `${d.val}%` }}>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black px-1.5 py-0.5 rounded shadow-xl whitespace-nowrap">{Math.round(d.val)}%</div>
                    </div>
                    <p className={`mt-3 text-[9px] ${i === 3 ? 'text-white font-bold' : 'text-gray-600'} font-mono uppercase tracking-tighter`}>{d.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-yellow-900/20"><h3 className="text-lg font-bold text-yellow-500 mb-6 font-serif italic text-center underline underline-offset-8 decoration-yellow-900/30">今週のバイオリズム</h3>
              <div className="space-y-3">{fortuneResult.weekly.map((item: any, idx: number) => (<div key={idx} className="bg-black/40 p-4 rounded-xl flex justify-between items-center border border-white/5 shadow-sm"><span className={`text-[11px] font-bold ${item.day === '日' ? 'text-red-400' : item.day === '土' ? 'text-blue-400' : 'text-gray-400'}`}>{item.date}（{item.day}）</span><div className="flex gap-0.5">{renderStars(item.star)}</div></div>))}</div>
            </div>

            {/* 本日のラッキー指針 */}
            <div className="bg-[#111] p-6 rounded-2xl border border-white/10 Text-left">
              <h3 className="text-sm font-bold text-white mb-6 text-center">本日のラッキー指針</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col items-center"><span className="text-[10px] text-emerald-400 font-bold mb-1">吉方位</span><span className="text-lg font-bold text-white font-serif">{fortuneResult.lucky.direction}</span></div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col items-center text-fuchsia-400"><span className="text-[10px] font-bold mb-1">数</span><span className="text-lg font-bold text-white">{fortuneResult.lucky.number}</span></div>
              </div>
              <div className="mt-4 space-y-3 text-xs">
                {/* 文字が暗い問題を修正：文字色を text-white に変更 */}
                <div className="bg-black/40 p-3 rounded-xl flex justify-between px-4 border border-white/5 transition-colors hover:border-fuchsia-900/50"><span className="text-gray-500">アイテム:</span><span className="text-white font-bold">{fortuneResult.lucky.item}</span></div>
                <div className="bg-black/40 p-3 rounded-xl flex justify-between px-4 border border-white/5 transition-colors hover:border-cyan-900/50"><span className="text-gray-500">カラー:</span><span className="text-white font-bold">{fortuneResult.lucky.color}</span></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              {[
                { label: '金運', star: fortuneResult.stars.money, color: 'text-yellow-500', comm: "必要なものを見極めて。" },
                { label: '健康運', star: fortuneResult.stars.health, color: 'text-emerald-500', comm: "適度な休息が運を呼ぶ。" },
                { label: '恋愛運', star: fortuneResult.stars.love, color: 'text-pink-500', comm: "誠実な対話が鍵です。" },
                { label: '仕事運', star: fortuneResult.stars.work, color: 'text-cyan-500', comm: "努力が実を結ぶ日。" }
              ].map((u, i) => (
                <div key={i} className="bg-[#1e1e1e] p-4 rounded-2xl border border-gray-800 shadow-sm"><p className={`font-bold mb-2 text-xs ${u.color}`}>{u.label}</p><div className="mb-2">{renderStars(u.star)}</div><p className="text-[10px] text-gray-500 leading-tight">{u.comm}</p></div>
              ))}
            </div>

            <button onClick={() => setPage('INPUT')} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs tracking-widest mt-6 hover:text-white transition-all">戻って入力をやり直す</button>
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
              <li>3. 「入力を固定」すると、次回からあなたの情報を自動表示します。</li>
            </ul>
            <button onClick={() => setShowManual(false)} className="mt-8 w-full py-3 bg-gradient-to-r from-fuchsia-600 to-cyan-600 rounded-xl font-bold text-white shadow-lg">閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
