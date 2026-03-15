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

  // フォームデータ管理（一番シンプルな書き方に修正）
  const [year, setYear] = useState('不明');
  const [month, setMonth] = useState('不明');
  const [day, setDay] = useState('不明');
  const [bloodType, setBloodType] = useState('不明');
  const [constellation, setConstellation] = useState('不明');
  const [zodiac, setZodiac] = useState('不明');

  // 固定データの読み込み
  useEffect(() => {
    const saved = localStorage.getItem('fortune_fixed_data_v2');
    if (saved) {
      const data = JSON.parse(saved);
      setYear(data.year); setMonth(data.month); setDay(data.day);
      setBloodType(data.bloodType); setConstellation(data.constellation); setZodiac(data.zodiac);
      setIsLocked(true);
    }
  }, []);

  // 選択肢用データ
  const years = Array.from({ length: 80 }, (_, i) => (2026 - i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const bloodTypes = ['A型', 'B型', 'O型', 'AB型'];
  const constellations = ['牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座', '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座'];
  const zodiacs = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  // 鑑定実行
  const generateFortune = () => {
    if (year === '不明' && month === '不明' && bloodType === '不明' && constellation === '不明') {
      setErrorMsg('全てのデータが不明では鑑定できません');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    setLoading(true);
    const baseDate = new Date();
    if (targetDate === '明日') baseDate.setDate(baseDate.getDate() + 1);
    
    // シード値生成
    const seedText = year + month + day + bloodType + constellation + zodiac + baseDate.getDate();
    let seed = 0;
    for (let i = 0; i < seedText.length; i++) seed += seedText.charCodeAt(i);

    // バイオリズム計算
    const birthBase = (year === '不明') ? new Date(2000, 0, 1) : new Date(`${year}-${month === '不明' ? '01' : month.padStart(2,'0')}-${day === '不明' ? '01' : day.padStart(2,'0')}`);
    const diff = Math.floor((baseDate.getTime() - birthBase.getTime()) / (24 * 60 * 60 * 1000));
    
    const bio = {
      physical: Math.round(Math.sin((2 * Math.PI * diff) / 23) * 50 + 50),
      emotional: Math.round(Math.sin((2 * Math.PI * diff) / 28) * 50 + 50),
      intellectual: Math.round(Math.sin((2 * Math.PI * diff) / 33) * 50 + 50)
    };

    setFortuneResult({
      general: constellation === '不明' ? "未知の可能性を秘めた時期です。直感を信じて進んでください。" : "宇宙の波動が整っています。あなたの本来の輝きが周囲に影響を与える一日となるでしょう。",
      bio,
      stars: { total: Math.floor(bio.emotional/20)+1, money: (seed%5)+1, health: (seed%3)+3, love: (seed%4)+2, work: Math.floor(bio.intellectual/20)+1 },
      lucky: { item: "銀の小物", color: "シャンパンゴールド", number: (seed%9)+1, direction: DIRECTIONS[seed % 8] },
      dateStr: `${baseDate.getFullYear()}-${(baseDate.getMonth() + 1).toString().padStart(2, '0')}-${baseDate.getDate().toString().padStart(2, '0')}`
    });

    setTimeout(() => { setLoading(false); setPage('RESULT'); window.scrollTo(0, 0); }, 2000);
  };

  const handleLock = () => {
    localStorage.setItem('fortune_fixed_data_v2', JSON.stringify({ year, month, day, bloodType, constellation, zodiac }));
    setIsLocked(true);
  };

  const handleUnlock = () => {
    localStorage.removeItem('fortune_fixed_data_v2');
    setIsLocked(false);
  };

  const renderStars = (count: number) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < count ? "text-yellow-400" : "text-gray-800"}>★</span>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center pb-20 relative overflow-x-hidden text-center">
      
      {errorMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold animate-bounce text-sm whitespace-nowrap">
          {errorMsg}
        </div>
      )}

      {/* ロゴエリア */}
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
            <div className="w-24 h-24 border-4 border-t-cyan-400 border-fuchsia-500/20 rounded-full animate-spin"></div>
            <p className="mt-8 text-cyan-400 tracking-widest animate-pulse text-sm">運命を解析中...</p>
          </div>
        ) : page === 'INPUT' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">占いたい方の情報を入力して下さい</h2>
            
            {/* 生年月日グループ */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2">
                <p className="text-blue-300 font-bold">生年月日</p><p>年</p>
                <select value={year} onChange={(e) => setYear(e.target.value)} disabled={isLocked} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3 outline-none text-white appearance-none">
                  <option value="不明">不明</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end"><p>月</p>
                <select value={month} onChange={(e) => setMonth(e.target.value)} disabled={isLocked} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3 outline-none text-white">
                  <option value="不明">不明</option>
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end"><p>日</p>
                <select value={day} onChange={(e) => setDay(e.target.value)} disabled={isLocked} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3 outline-none text-white">
                  <option value="不明">不明</option>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            {/* 属性グループ */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2"><p className="text-blue-300 font-bold">血液型</p>
                <select value={bloodType} onChange={(e) => setBloodType(e.target.value)} disabled={isLocked} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3 outline-none text-white">
                  <option value="不明">不明</option>
                  {bloodTypes.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="space-y-2"><p className="text-blue-300 font-bold">星座</p>
                <select value={constellation} onChange={(e) => setConstellation(e.target.value)} disabled={isLocked} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3 outline-none text-white">
                  <option value="不明">不明</option>
                  {constellations.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2"><p className="text-blue-300 font-bold">干支</p>
                <select value={zodiac} onChange={(e) => setZodiac(e.target.value)} disabled={isLocked} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3 outline-none text-white">
                  <option value="不明">不明</option>
                  {zodiacs.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
            </div>

            {/* 占う日選択 */}
            <div className="flex bg-[#0f172a] rounded-xl p-1 border border-slate-800">
              <button onClick={() => setTargetDate('今日')} className={`flex-1 py-3 text-xs rounded-lg transition-all ${targetDate === '今日' ? 'bg-indigo-600 text-white' : 'text-gray-500'}`}>今日の運勢</button>
              <button onClick={() => setTargetDate('明日')} className={`flex-1 py-3 text-xs rounded-lg transition-all ${targetDate === '明日' ? 'bg-indigo-600 text-white' : 'text-gray-500'}`}>明日の運勢</button>
            </div>

            {/* ロックボタン */}
            <div className="flex justify-end gap-2">
              {!isLocked ? (
                <button onClick={handleLock} className="bg-[#2c3748] text-gray-200 text-[10px] py-2.5 px-6 rounded-lg border border-slate-700">入力を固定する</button>
              ) : (
                <>
                  <button onClick={handleUnlock} className="bg-red-900/30 text-red-200 text-[10px] py-2 px-4 rounded-lg border border-red-800/50">解除</button>
                  <button onClick={() => { handleUnlock(); setYear('不明'); setMonth('不明'); setDay('不明'); setBloodType('不明'); setConstellation('不明'); setZodiac('不明'); }} className="bg-[#2c3748] text-gray-200 text-[10px] py-2 px-4 rounded-lg border border-slate-700">他人を占う</button>
                </>
              )}
            </div>

            <button onClick={generateFortune} className="w-full py-5 rounded-2xl font-bold text-lg bg-gradient-to-r from-fuchsia-500 to-cyan-500 shadow-lg active:scale-95 transition-all">鑑定を開始する</button>
          </div>
        ) : (
          /* 結果画面 */
          <div className="space-y-6 animate-in slide-in-from-bottom-10 pb-10">
            <div className="bg-[#111827] border border-slate-800 p-5 rounded-xl">
              <p className="text-cyan-400 text-[10px] mb-1 font-bold uppercase tracking-widest">鑑定日</p>
              <p className="text-xl font-bold text-white tracking-widest">{fortuneResult.dateStr}</p>
            </div>

            <div className="bg-[#1e1e1e] p-7 rounded-3xl border border-gray-800 shadow-xl text-left">
              <h3 className="text-lg font-bold mb-4 text-white text-center">今日の総合運</h3>
              <div className="flex justify-center mb-5">{renderStars(fortuneResult.stars.total)}</div>
              <p className="text-[15px] text-gray-300 leading-relaxed font-light">{fortuneResult.general}</p>
            </div>

            <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800 text-left">
              <h3 className="text-sm font-bold text-white mb-2 text-center">精密バイオリズム解析</h3>
              <p className="text-[10px] text-gray-500 mb-6 text-center px-4">※生年月日から算出される身体・感情・知性の周期的なリズムです。</p>
              <div className="space-y-5">
                {[
                  { label: '身体', val: fortuneResult.bio.physical, color: 'bg-emerald-500' },
                  { label: '感情', val: fortuneResult.bio.emotional, color: 'bg-pink-500' },
                  { label: '知性', val: fortuneResult.bio.intellectual, color: 'bg-cyan-500' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5 px-2">
                    <div className="flex justify-between text-[10px] text-gray-400"><span>{item.label}</span><span>{item.val}%</span></div>
                    <div className="h-1.5 w-full bg-black rounded-full overflow-hidden"><div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${item.val}%` }}></div></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800 text-left">
              <h3 className="text-sm font-bold text-white mb-6 text-center">本日のラッキー指針</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col items-center">
                  <span className="text-[10px] text-emerald-400 font-bold mb-1">吉方位</span>
                  <span className="text-lg font-bold text-white font-serif">{fortuneResult.lucky.direction}</span>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 flex flex-col items-center text-fuchsia-400">
                  <span className="text-[10px] font-bold mb-1">数</span>
                  <span className="text-lg font-bold text-white">{fortuneResult.lucky.number}</span>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-xs">
                <div className="bg-black/40 p-3 rounded-xl flex justify-between px-4"><span className="text-gray-500">アイテム:</span><span className="text-gray-200 font-bold">{fortuneResult.lucky.item}</span></div>
                <div className="bg-black/40 p-3 rounded-xl flex justify-between px-4"><span className="text-gray-500">カラー:</span><span className="text-gray-200 font-bold">{fortuneResult.lucky.color}</span></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              {[
                { label: '金運', star: fortuneResult.stars.money, color: 'text-yellow-500', comm: "好機を逃さないよう。"},
                { label: '健康運', star: fortuneResult.stars.health, color: 'text-emerald-500', comm: "休息が運気を上げます。"},
                { label: '恋愛運', star: fortuneResult.stars.love, color: 'text-pink-500', comm: "誠実な対話が鍵です。"},
                { label: '仕事運', star: fortuneResult.stars.work, color: 'text-cyan-500', comm: "地道な努力が実ります。"}
              ].map((u, i) => (
                <div key={i} className="bg-[#1e1e1e] p-4 rounded-2xl border border-gray-800">
                  <p className={`font-bold mb-2 text-xs ${u.color}`}>{u.label}</p>
                  <div className="mb-2">{renderStars(u.star)}</div>
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
            <h3 className="text-xl font-bold text-cyan-400 mb-6 border-b border-slate-800 pb-2 text-center">鑑定マニュアル</h3>
            <ul className="space-y-4">
              <li>1. 情報を入力し「鑑定を開始」をタップ。</li>
              <li>2. 全ての項目が不明な場合は鑑定できません。</li>
              <li>3. 星の周期を精密に解析し、今日の指針を導き出します。</li>
            </ul>
            <button onClick={() => setShowManual(false)} className="mt-8 w-full py-3 bg-gradient-to-r from-fuchsia-600 to-cyan-600 rounded-xl font-bold text-white">閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
