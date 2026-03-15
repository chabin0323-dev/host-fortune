import React, { useState, useEffect } from 'react';

// --- 定数 ---
const DIRECTIONS = ["北", "北東", "東", "南東", "南", "南西", "西", "北西"];

const App: React.FC = () => {
  const [page, setPage] = useState<'INPUT' | 'RESULT'>('INPUT');
  const [loading, setLoading] = useState(false);
  const [targetDate, setTargetDate] = useState<'今日' | '明日'>('今日');
  const [isLocked, setIsLocked] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fortuneResult, setFortuneResult] = useState<any>(null);

  // フォームデータ管理（個別のStateに分離して確実性を向上）
  const [yVal, setYVal] = useState('不明');
  const [mVal, setMVal] = useState('不明');
  const [dVal, setDVal] = useState('不明');
  const [btVal, setBtVal] = useState('不明');
  const [csVal, setCsVal] = useState('不明');
  const [zdVal, setZdVal] = useState('不明');

  // 保存データの読み込み（キー名を新しくして過去のバグを回避）
  useEffect(() => {
    const saved = localStorage.getItem('mike_premium_final_v1');
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

  // 鑑定実行
  const generateFortune = () => {
    if (yVal === '不明' && btVal === '不明' && csVal === '不明') {
      setErrorMsg('全てのデータが不明では鑑定できません');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    setLoading(true);
    const baseDate = new Date();
    if (targetDate === '明日') baseDate.setDate(baseDate.getDate() + 1);
    
    // シード計算
    const seed = (yVal + btVal + csVal).length + baseDate.getDate();
    
    // バイオリズム計算
    const birthBase = (yVal === '不明') ? new Date(2000, 0, 1) : new Date(`${yVal}-01-01`);
    const calculateBio = (t: Date) => {
      const diff = Math.floor((t.getTime() - birthBase.getTime()) / (24 * 60 * 60 * 1000));
      return {
        p: Math.round(Math.sin((2 * Math.PI * diff) / 23) * 50 + 50),
        e: Math.round(Math.sin((2 * Math.PI * diff) / 28) * 50 + 50),
        i: Math.round(Math.sin((2 * Math.PI * diff) / 33) * 50 + 50)
      };
    };

    const mainBio = calculateBio(baseDate);
    const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];
    const weekly = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const b = calculateBio(d);
      return { date: `${d.getMonth() + 1}/${d.getDate()}`, day: dayLabels[d.getDay()], star: Math.floor(b.e / 20) + 1 };
    });

    setFortuneResult({
      dateStr: `${baseDate.getFullYear()}-${(baseDate.getMonth() + 1).toString().padStart(2, '0')}-${baseDate.getDate().toString().padStart(2, '0')}`,
      general: "宇宙の波動が整っています。今日はあなたの内なる声に従うことで、素晴らしいチャンスを掴めるでしょう。誠実な振る舞いが開運の鍵となります。",
      bio: mainBio,
      stars: { total: Math.floor(mainBio.e/20)+1, money: (seed%5)+1, health: (seed%3)+3, love: ((seed+2)%4)+2, work: Math.floor(mainBio.i/20)+1 },
      lucky: { direction: DIRECTIONS[seed % 8], number: (seed % 9) + 1, item: "天然石", color: "ゴールド" },
      weekly
    });

    setTimeout(() => { setLoading(false); setPage('RESULT'); window.scrollTo(0, 0); }, 2000);
  };

  const handleLock = () => {
    localStorage.setItem('mike_premium_final_v1', JSON.stringify({y:yVal, m:mVal, d:dVal, bt:btVal, cs:csVal, zd:zdVal}));
    setIsLocked(true);
  };

  const resetAll = () => {
    setYVal('不明'); setMVal('不明'); setDVal('不明');
    setBtVal('不明'); setCsVal('不明'); setZdVal('不明');
    setIsLocked(false);
    localStorage.removeItem('mike_premium_final_v1');
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
      
      {errorMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold text-sm whitespace-nowrap animate-bounce">
          {errorMsg}
        </div>
      )}

      {/* ヘッダー */}
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
            <p className="mt-8 text-cyan-400 tracking-widest animate-pulse">運命解析中...</p>
          </div>
        ) : page === 'INPUT' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">占いたい方の情報を入力して下さい</h2>
            
            {/* プルダウンエリア（確実に動作する独立State方式） */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2">
                <p className="text-blue-300 font-bold">生年月日</p><p>年</p>
                <select value={yVal} onChange={(e) => setYVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none outline-none">
                  <option value="不明">不明</option>
                  {years.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <p>月</p>
                <select value={mVal} onChange={(e) => setMVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none outline-none">
                  <option value="不明">不明</option>
                  {months.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <p>日</p>
                <select value={dVal} onChange={(e) => setDVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none outline-none">
                  <option value="不明">不明</option>
                  {days.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2"><p className="text-blue-300 font-bold">血液型</p>
                <select value={btVal} onChange={(e) => setBtVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none outline-none">
                  <option value="不明">不明</option>
                  {["A型", "B型", "O型", "AB型"].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-2"><p className="text-blue-300 font-bold">星座</p>
                <select value={csVal} onChange={(e) => setCsVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none outline-none">
                  <option value="不明">不明</option>
                  {["牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座", "天秤座", "蠍座", "射手座", "山羊座", "水瓶座", "魚座"].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div className="space-y-2"><p className="text-blue-300 font-bold">干支</p>
                <select value={zdVal} onChange={(e) => setZdVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none outline-none">
                  <option value="不明">不明</option>
                  {["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>

            <div className="flex bg-[#111] rounded-xl p-1 border border-white/10">
              <button onClick={() => setTargetDate('今日')} className={`flex-1 py-3 text-xs rounded-lg transition-all ${targetDate === '今日' ? 'bg-indigo-600' : 'text-gray-500'}`}>今日</button>
              <button onClick={() => setTargetDate('明日')} className={`flex-1 py-3 text-xs rounded-lg transition-all ${targetDate === '明日' ? 'bg-indigo-600' : 'text-gray-500'}`}>明日</button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {!isLocked ? (
                <button onClick={handleLock} className="bg-[#222] text-gray-400 text-[10px] py-2.5 px-6 rounded-lg border border-white/5">入力を固定</button>
              ) : (
                <>
                  <button onClick={() => { localStorage.removeItem('mike_premium_final_v1'); setIsLocked(false); }} className="bg-red-900/20 text-red-400 text-[10px] py-2.5 px-4 rounded-lg">解除</button>
                  <button onClick={resetAll} className="bg-[#222] text-gray-400 text-[10px] py-2.5 px-4 rounded-lg border border-white/5">他人を占う</button>
                </>
              )}
            </div>

            <button onClick={generateFortune} className="w-full py-5 rounded-2xl font-bold text-lg bg-gradient-to-r from-fuchsia-500 to-cyan-500 shadow-lg active:scale-95 transition-all">鑑定を開始する</button>
          </div>
        ) : (
          /* 結果画面 */
          <div className="space-y-6 animate-in slide-in-from-bottom-10 pb-10 text-left">
            <div className="bg-[#111] border border-white/10 p-5 rounded-xl text-center">
              <p className="text-cyan-400 text-[10px] mb-1 font-bold uppercase">鑑定日</p>
              <p className="text-xl font-bold text-white tracking-widest">{fortuneResult.dateStr}</p>
            </div>

            <div className="bg-[#111] p-7 rounded-3xl border border-white/10 shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-center">今日の総合運</h3>
              <div className="mb-5">{renderStars(fortuneResult.stars.total)}</div>
              <p className="text-[15px] text-gray-300 leading-relaxed font-light">{fortuneResult.general}</p>
            </div>

            {/* 精密バイオリズム */}
            <div className="bg-[#111] p-6 rounded-2xl border border-white/10">
              <h3 className="text-sm font-bold text-white mb-2 text-center">精密バイオリズム解析</h3>
              <div className="space-y-5 mt-4">
                {[{ label: '身体', val: fortuneResult.bio.p, color: 'bg-emerald-500' }, { label: '感情', val: fortuneResult.bio.e, color: 'bg-pink-500' }, { label: '知性', val: fortuneResult.bio.i, color: 'bg-cyan-500' }].map((item, idx) => (
                  <div key={idx} className="space-y-1.5 px-2">
                    <div className="flex justify-between text-[10px] text-gray-400"><span>{item.label}</span><span>{item.val}%</span></div>
                    <div className="h-1.5 w-full bg-black rounded-full overflow-hidden"><div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${item.val}%` }}></div></div>
                  </div>
                ))}
              </div>
            </div>

            {/* 今週のバイオリズム */}
            <div className="bg-[#111] p-6 rounded-2xl border border-yellow-900/20">
              <h3 className="text-lg font-bold text-yellow-500 mb-6 font-serif italic text-center underline underline-offset-8 decoration-yellow-900/30">今週のバイオリズム</h3>
              <div className="space-y-3">
                {fortuneResult.weekly.map((item: any, idx: number) => (
                  <div key={idx} className="bg-black/40 p-4 rounded-xl flex justify-between items-center border border-white/5">
                    <span className={`text-[11px] font-bold ${item.day === '日' ? 'text-red-400' : item.day === '土' ? 'text-blue-400' : 'text-gray-400'}`}>
                      {item.date}（{item.day}）
                    </span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < item.star ? "text-yellow-400 text-[10px]" : "text-gray-800 text-[10px]"}>★</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 四大運勢 */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: '金運', star: fortuneResult.stars.money, color: 'text-yellow-500', comm: "必要なものを見極めて。" },
                { label: '健康運', star: fortuneResult.stars.health, color: 'text-emerald-500', comm: "適度な休息が運を呼ぶ。" },
                { label: '恋愛運', star: fortuneResult.stars.love, color: 'text-pink-500', comm: "誠実な対話が鍵です。" },
                { label: '仕事運', star: fortuneResult.stars.work, color: 'text-cyan-500', comm: "努力が実を結ぶ日。" }
              ].map((u, i) => (
                <div key={i} className="bg-[#111] p-4 rounded-2xl border border-white/10">
                  <p className={`font-bold mb-2 text-xs ${u.color}`}>{u.label}</p>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < u.star ? "text-yellow-400 text-[10px]" : "text-gray-800 text-[10px]"}>★</span>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight">{u.comm}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setPage('INPUT')} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs tracking-widest mt-6">戻って入力をやり直す</button>
          </div>
        )}
      </div>

      {/* 取説ポップアップ */}
      {showManual && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowManual(false)}></div>
          <div className="relative bg-[#111827] border border-slate-700 p-8 rounded-3xl max-w-sm w-full shadow-2xl text-left text-sm text-gray-300">
            <h3 className="text-xl font-bold text-cyan-400 mb-6 border-b border-slate-800 pb-2 text-center font-serif">鑑定マニュアル</h3>
            <ul className="space-y-4">
              <li>1. 情報を入力し「鑑定を開始」をタップ。</li>
              <li>2. 生年月日などが不明な場合でも鑑定可能です。</li>
              <li>3. 「他人を占う」で一時的に入力をリセットできます。</li>
            </ul>
            <button onClick={() => setShowManual(false)} className="mt-8 w-full py-3 bg-gradient-to-r from-fuchsia-600 to-cyan-600 rounded-xl font-bold text-white shadow-lg">閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
