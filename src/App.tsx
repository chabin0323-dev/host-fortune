import React, { useState, useEffect } from 'react';

// --- 精密鑑定用定数 ---
const ELEMENTS = {
  FIRE: ['牡羊座', '獅子座', '射手座'],
  EARTH: ['牡牛座', '乙女座', '山羊座'],
  AIR: ['双子座', '天秤座', '水瓶座'],
  WATER: ['蟹座', '蠍座', '魚座']
};

const DIRECTIONS = ["北", "北東", "東", "南東", "南", "南西", "西", "北西"];

const App: React.FC = () => {
  const [page, setPage] = useState<'INPUT' | 'RESULT'>('INPUT');
  const [loading, setLoading] = useState(false);
  const [targetDate, setTargetDate] = useState<'今日' | '明日'>('今日');
  const [isLocked, setIsLocked] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fortuneResult, setFortuneResult] = useState<any>(null);

  // フォームデータ管理
  const [year, setYear] = useState('不明');
  const [month, setMonth] = useState('不明');
  const [day, setDay] = useState('不明');
  const [bloodType, setBloodType] = useState('不明');
  const [constellation, setConstellation] = useState('不明');
  const [zodiac, setZodiac] = useState('不明');

  // 固定データの読み込み
  useEffect(() => {
    const saved = localStorage.getItem('fortune_fixed_data_v3');
    if (saved) {
      const data = JSON.parse(saved);
      setYear(data.year); setMonth(data.month); setDay(data.day);
      setBloodType(data.bloodType); setConstellation(data.constellation); setZodiac(data.zodiac);
      setIsLocked(true);
    }
  }, []);

  const years = Array.from({ length: 80 }, (_, i) => (2026 - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const bloodTypes = ['A型', 'B型', 'O型', 'AB型'];
  const constellations = ['牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座', '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座'];
  const zodiacs = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  // 日付リスト生成
  const getWeeklyDates = (base: Date) => {
    const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return {
        dateStr: `${(d.getMonth() + 1)}/${d.getDate()}`,
        day: dayLabels[d.getDay()],
        raw: d
      };
    });
  };

  const generateFortune = () => {
    if (year === '不明' && month === '不明' && bloodType === '不明' && constellation === '不明') {
      setErrorMsg('データが不足しています');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    setLoading(true);
    const baseDate = new Date();
    if (targetDate === '明日') baseDate.setDate(baseDate.getDate() + 1);
    
    const weeklyData = getWeeklyDates(baseDate);
    const seedBase = year + bloodType + constellation;
    
    // メインの計算
    const birthBase = (year === '不明') ? new Date(2000, 0, 1) : new Date(`${year}-${month === '不明' ? '01' : month.padStart(2,'0')}-${day === '不明' ? '01' : day.padStart(2,'0')}`);
    
    const calculateBio = (target: Date) => {
      const diff = Math.floor((target.getTime() - birthBase.getTime()) / (24 * 60 * 60 * 1000));
      return {
        p: Math.round(Math.sin((2 * Math.PI * diff) / 23) * 50 + 50),
        e: Math.round(Math.sin((2 * Math.PI * diff) / 28) * 50 + 50),
        i: Math.round(Math.sin((2 * Math.PI * diff) / 33) * 50 + 50)
      };
    };

    const mainBio = calculateBio(baseDate);

    setFortuneResult({
      dateStr: `${baseDate.getFullYear()}年${(baseDate.getMonth() + 1)}月${baseDate.getDate()}日`,
      general: constellation === '不明' ? "新たな可能性が芽生える日。直感を信じて。" : "運気の流れが非常にスムーズです。あなたの誠実な姿勢が周囲に安心感を与え、良い協力者を引き寄せるでしょう。",
      bio: mainBio,
      stars: { 
        total: Math.floor(mainBio.e/20)+1, 
        money: (seedBase.length % 5) + 1, 
        health: Math.floor(mainBio.p/20)+1, 
        love: (seedBase.charCodeAt(0) % 4) + 2, 
        work: Math.floor(mainBio.i/20)+1 
      },
      lucky: { item: "革の小物", color: "ミッドナイトブルー", number: (seedBase.length % 9) + 1, direction: DIRECTIONS[baseDate.getDate() % 8] },
      weekly: weeklyData.map(d => {
        const b = calculateBio(d.raw);
        return { ...d, star: Math.floor(b.e/20)+1 };
      })
    });

    setTimeout(() => { setLoading(false); setPage('RESULT'); window.scrollTo(0, 0); }, 2000);
  };

  const handleLock = () => {
    localStorage.setItem('fortune_fixed_data_v3', JSON.stringify({ year, month, day, bloodType, constellation, zodiac }));
    setIsLocked(true);
  };

  const renderStars = (count: number) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < count ? "text-yellow-400" : "text-gray-800"}>★</span>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center pb-20 text-center">
      
      {errorMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold animate-bounce text-sm">
          {errorMsg}
        </div>
      )}

      <div className="mt-8 mb-10 flex items-center justify-center gap-3">
        <div className="flex items-center gap-1 text-3xl font-bold">
          <span className="text-blue-500">m</span><span className="text-green-500">i</span><span className="text-yellow-400">★</span><span className="text-blue-400">k</span><span className="text-purple-500">e</span>
          <span className="text-[10px] text-gray-500 self-end mb-1 ml-1 font-mono uppercase">Premium</span>
        </div>
      </div>

      <div className="w-full max-w-md px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-20 h-20 border-4 border-t-cyan-400 border-white/10 rounded-full animate-spin"></div>
            <p className="mt-8 text-cyan-400 tracking-widest animate-pulse">運命を解析中...</p>
          </div>
        ) : page === 'INPUT' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">情報を入力して下さい</h2>
            
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2"><p className="text-blue-300 font-bold">生年月日</p><p>年</p>
                <select value={year} onChange={(e) => setYear(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white">
                  <option value="不明">不明</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end"><p>月</p>
                <select value={month} onChange={(e) => setMonth(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white">
                  <option value="不明">不明</option>
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end"><p>日</p>
                <select value={day} onChange={(e) => setDay(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white">
                  <option value="不明">不明</option>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2"><p className="text-blue-300 font-bold">血液型</p>
                <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white">
                  <option value="不明">不明</option>
                  {bloodTypes.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="space-y-2"><p className="text-blue-300 font-bold">星座</p>
                <select value={constellation} onChange={(e) => setConstellation(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white">
                  <option value="不明">不明</option>
                  {constellations.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2"><p className="text-blue-300 font-bold">干支</p>
                <select value={zodiac} onChange={(e) => setZodiac(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white">
                  <option value="不明">不明</option>
                  {zodiacs.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
            </div>

            <div className="flex bg-[#111] rounded-xl p-1 border border-white/10">
              <button onClick={() => setTargetDate('今日')} className={`flex-1 py-3 text-xs rounded-lg transition-all ${targetDate === '今日' ? 'bg-indigo-600' : 'text-gray-500'}`}>今日</button>
              <button onClick={() => setTargetDate('明日')} className={`flex-1 py-3 text-xs rounded-lg transition-all ${targetDate === '明日' ? 'bg-indigo-600' : 'text-gray-500'}`}>明日</button>
            </div>

            <div className="flex justify-end gap-2">
              {!isLocked ? <button onClick={handleLock} className="bg-[#222] text-gray-400 text-[10px] py-2 px-6 rounded-lg">入力を固定</button> :
              <button onClick={() => setIsLocked(false)} className="bg-red-900/20 text-red-400 text-[10px] py-2 px-6 rounded-lg">解除</button>}
            </div>

            <button onClick={generateFortune} className="w-full py-5 rounded-2xl font-bold text-lg bg-gradient-to-r from-fuchsia-500 to-cyan-500 shadow-lg active:scale-95">鑑定を開始する</button>
          </div>
        ) : (
          /* 結果画面 */
          <div className="space-y-6 animate-in slide-in-from-bottom-10 pb-10">
            <div className="bg-[#111] border border-white/10 p-5 rounded-xl">
              <p className="text-cyan-400 text-[10px] font-bold tracking-widest">鑑定日：{fortuneResult.dateStr}</p>
            </div>

            <div className="bg-[#111] p-7 rounded-3xl border border-white/10 text-left">
              <h3 className="text-lg font-bold mb-4 text-center">総合運</h3>
              <div className="flex justify-center mb-5">{renderStars(fortuneResult.stars.total)}</div>
              <p className="text-[15px] text-gray-300 leading-relaxed">{fortuneResult.general}</p>
            </div>

            {/* 精密バイオリズム */}
            <div className="bg-[#111] p-6 rounded-2xl border border-white/10 text-left">
              <h3 className="text-sm font-bold mb-6 text-center">精密バイオリズム</h3>
              <div className="space-y-5">
                {[
                  { label: '身体', val: fortuneResult.bio.p, color: 'bg-emerald-500' },
                  { label: '感情', val: fortuneResult.bio.e, color: 'bg-pink-500' },
                  { label: '知性', val: fortuneResult.bio.i, color: 'bg-cyan-500' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5 px-2">
                    <div className="flex justify-between text-[10px] text-gray-400"><span>{item.label}</span><span>{item.val}%</span></div>
                    <div className="h-1.5 w-full bg-black rounded-full overflow-hidden"><div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${item.val}%` }}></div></div>
                  </div>
                ))}
              </div>
            </div>

            {/* 1週間のバイオリズム復活！ */}
            <div className="bg-[#111] p-6 rounded-2xl border border-white/10 text-left">
              <h3 className="text-lg font-bold text-yellow-500 mb-6 italic text-center underline decoration-yellow-900/30 underline-offset-8">1週間のバイオリズム</h3>
              <div className="space-y-3">
                {fortuneResult.weekly.map((item: any, idx: number) => (
                  <div key={idx} className="bg-black/40 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className={`text-[11px] font-bold ${item.day === '日' ? 'text-red-400' : item.day === '土' ? 'text-blue-400' : 'text-gray-400'}`}>
                        {item.dateStr}（{item.day}）
                      </span>
                    </div>
                    {renderStars(item.star)}
                  </div>
                ))}
              </div>
            </div>

            {/* ラッキー情報 */}
            <div className="bg-[#111] p-6 rounded-2xl border border-white/10">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-4 rounded-xl border border-white/5"><span className="text-[10px] text-emerald-400 font-bold block mb-1">吉方位</span><span className="text-lg font-bold">{fortuneResult.lucky.direction}</span></div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5"><span className="text-[10px] text-fuchsia-400 font-bold block mb-1">ラッキー数</span><span className="text-lg font-bold">{fortuneResult.lucky.number}</span></div>
              </div>
              <div className="mt-4 space-y-3 text-xs text-left">
                <div className="bg-black/40 p-3 rounded-xl flex justify-between"><span className="text-gray-500">アイテム:</span><span className="font-bold">{fortuneResult.lucky.item}</span></div>
                <div className="bg-black/40 p-3 rounded-xl flex justify-between"><span className="text-gray-500">カラー:</span><span className="font-bold">{fortuneResult.lucky.color}</span></div>
              </div>
            </div>

            <button onClick={() => setPage('INPUT')} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs">戻る</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
