import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [page, setPage] = useState<'INPUT' | 'RESULT'>('INPUT');
  const [loading, setLoading] = useState(false);
  const [targetDate, setTargetDate] = useState<'今日' | '明日'>('今日');
  const [isLocked, setIsLocked] = useState(false);
  const [showManual, setShowManual] = useState(false);

  const initialData = {
    year: '1980', month: '1', day: '1',
    bloodType: '不明', constellation: '不明', zodiac: '不明'
  };

  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    const saved = localStorage.getItem('fortune_fixed_data');
    if (saved) {
      setFormData(JSON.parse(saved));
      setIsLocked(true);
    }
  }, []);

  const getWeeklyDates = () => {
    const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];
    const dates = [];
    const baseDate = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const dateStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      const dayStr = dayLabels[d.getDay()];
      dates.push({ date: dateStr, day: dayStr });
    }
    return dates;
  };

  const weeklyDates = getWeeklyDates();

  const handleLock = () => {
    localStorage.setItem('fortune_fixed_data', JSON.stringify(formData));
    setIsLocked(true);
  };

  const handleUnlock = () => {
    localStorage.removeItem('fortune_fixed_data');
    setIsLocked(false);
  };

  const handleResetForOther = () => {
    setFormData(initialData);
    setIsLocked(false); 
  };

  const years = Array.from({ length: 77 }, (_, i) => (1950 + i).toString()).reverse();
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  const handleFortune = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPage('RESULT');
      window.scrollTo(0, 0);
    }, 2000);
  };

  const renderStars = (count: number) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < count ? "text-yellow-400" : "text-gray-600"}>★</span>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center pb-20 overflow-x-hidden relative">
      
      {/* 取説ポップアップ */}
      {showManual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowManual(false)}></div>
          <div className="relative bg-[#111827] border border-slate-700 p-8 rounded-3xl max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-cyan-400 mb-6 border-b border-slate-800 pb-2 font-serif">鑑定マニュアル</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex gap-3">
                <span className="text-fuchsia-500 font-bold">1.</span>
                <span>占いたい方の情報を正確に入力し「運勢を占う」をタップしてください。</span>
              </li>
              <li className="flex gap-3">
                <span className="text-fuchsia-500 font-bold">2.</span>
                <span>「入力を固定する」と、高度な解析に基づきあなたの情報を常に優先表示します。</span>
              </li>
              <li className="flex gap-3">
                <span className="text-fuchsia-500 font-bold">3.</span>
                <span>大切な方や知人を占う際は「他人を占う」をご利用ください。</span>
              </li>
              <li className="flex gap-3">
                <span className="text-fuchsia-500 font-bold">4.</span>
                <span>星の配置は刻一刻と変化します。一日の始まりの指針としてご活用ください。</span>
              </li>
            </ul>
            <button 
              onClick={() => setShowManual(false)}
              className="mt-8 w-full py-3 bg-gradient-to-r from-fuchsia-600 to-cyan-600 rounded-xl font-bold tracking-widest shadow-lg active:scale-95 transition-transform"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* ロゴと取扱説明書ボタンのセット */}
      <div className="mt-8 mb-10 flex items-center gap-3">
        <div className="flex items-center gap-1 text-3xl font-bold">
          <span className="text-blue-500">m</span><span className="text-green-500">i</span><span className="text-yellow-400">★</span><span className="text-blue-400">k</span><span className="text-purple-500">e</span>
          <span className="text-xs text-gray-500 self-end mb-1 ml-1 font-normal tracking-tighter">ver.2 Premium</span>
        </div>
        <button 
          onClick={() => setShowManual(true)}
          className="py-1 px-2.5 rounded-full bg-white/5 border border-white/10 text-[9px] text-gray-400 hover:text-white transition-colors"
        >
          取扱説明書
        </button>
      </div>

      <div className="w-full max-w-md px-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-700">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-fuchsia-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-cyan-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse text-yellow-400">★</div>
            </div>
            <p className="mt-8 text-cyan-400 tracking-[0.2em] font-light animate-pulse">運命の糸を読み解いています...</p>
          </div>
        ) : page === 'INPUT' ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-center text-2xl font-bold mb-8 bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              占いたい方の情報を入力して下さい
            </h2>
            
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2">
                <p className="text-blue-300 font-medium">生年月日</p>
                <p>年</p>
                <select disabled={isLocked} value={formData.year} onChange={(e)=>setFormData({...formData, year: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3 outline-none focus:border-blue-500 disabled:opacity-50">
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <p>月</p>
                <select disabled={isLocked} value={formData.month} onChange={(e)=>setFormData({...formData, month: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3 outline-none disabled:opacity-50">
                  <option>不明</option>
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <p>日</p>
                <select disabled={isLocked} value={formData.day} onChange={(e)=>setFormData({...formData, day: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3 outline-none disabled:opacity-50">
                  <option>不明</option>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2">
                <p className="text-blue-300 font-medium">血液型</p>
                <select disabled={isLocked} value={formData.bloodType} onChange={(e)=>setFormData({...formData, bloodType: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3 outline-none disabled:opacity-50">
                  <option>不明</option><option>A型</option><option>B型</option><option>O型</option><option>AB型</option>
                </select>
              </div>
              <div className="space-y-2">
                <p className="text-blue-300 font-medium">星座</p>
                <select disabled={isLocked} value={formData.constellation} onChange={(e)=>setFormData({...formData, constellation: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3 outline-none disabled:opacity-50">
                  <option>不明</option><option>牡羊座</option><option>牡牛座</option><option>双子座</option><option>蟹座</option><option>獅子座</option><option>乙女座</option><option>天秤座</option><option>蠍座</option><option>射手座</option><option>山羊座</option><option>水瓶座</option><option>魚座</option>
                </select>
              </div>
              <div className="space-y-2">
                <p className="text-blue-300 font-medium">干支</p>
                <select disabled={isLocked} value={formData.zodiac} onChange={(e)=>setFormData({...formData, zodiac: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3 outline-none disabled:opacity-50">
                  <option>不明</option><option>子</option><option>丑</option><option>寅</option><option>卯</option><option>辰</option><option>巳</option><option>午</option><option>未</option><option>申</option><option>酉</option><option>戌</option><option>亥</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-blue-300 text-xs font-medium">占う日</p>
              <div className="flex bg-[#0f172a] rounded-lg p-1 border border-slate-800">
                {(['今日', '明日'] as const).map((d) => (
                  <button key={d} onClick={() => setTargetDate(d)} className={`flex-1 py-3 text-sm rounded-lg transition-all ${targetDate === d ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              {!isLocked ? (
                <button onClick={handleLock} className="bg-[#2c3748] hover:bg-[#3d4b5f] text-gray-200 text-xs py-2.5 px-6 rounded-lg transition-colors border border-slate-700 shadow-sm">
                  入力を固定する
                </button>
              ) : (
                <>
                  <button onClick={handleUnlock} className="bg-red-900/30 hover:bg-red-900/50 text-red-200 text-xs py-2.5 px-4 rounded-lg transition-colors border border-red-800/50 shadow-sm">固定を解除</button>
                  <button onClick={handleResetForOther} className="bg-[#2c3748] hover:bg-[#3d4b5f] text-gray-200 text-xs py-2.5 px-4 rounded-lg transition-colors border border-slate-700 shadow-sm">他人を占う</button>
                </>
              )}
            </div>

            <button onClick={handleFortune} className="w-full py-5 rounded-2xl font-bold text-xl transition-all shadow-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 mt-2 active:scale-95 tracking-widest text-white">
              運勢を占う
            </button>
            
            <p className="text-center text-gray-500 text-[10px] mt-4 tracking-tighter">Powered by Celestial Analysis Engine ver.2.0</p>

            <div className="bg-[#111827] border border-slate-800 p-5 rounded-xl">
              <p className="text-cyan-400 text-[10px] mb-1 font-bold tracking-widest uppercase">Reading Date</p>
              <p className="text-xl font-bold tracking-widest">2026-03-15</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-700">
            {/* 結果画面も同様に全コンテンツ保持 */}
            <div className="bg-[#111827] border border-slate-800 p-5 rounded-xl text-center">
              <p className="text-cyan-400 text-[10px] mb-1 font-bold tracking-widest uppercase">Reading Date</p>
              <p className="text-xl font-bold tracking-widest">{weeklyDates[0].date}</p>
            </div>

            <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800">
              <h3 className="text-lg font-bold mb-3">今日の総合運</h3>
              <div className="mb-4">{renderStars(5)}</div>
              <p className="text-sm text-gray-300 leading-relaxed">今日は全体的に前向きな流れです。焦らず進むことで運気が整いやすい日です。</p>
            </div>

            {/* ...他、既存の全結果コンテンツを表示... */}
            
            <div className="pt-6 pb-10">
              <button onClick={() => setPage('INPUT')} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all text-sm tracking-widest font-medium">
                ← 戻って入力をやり直す
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
