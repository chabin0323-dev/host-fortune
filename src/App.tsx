import React, { useState } from 'react';

const App: React.FC = () => {
  const [page, setPage] = useState<'INPUT' | 'RESULT'>('INPUT');
  const [loading, setLoading] = useState(false);
  const [targetDate, setTargetDate] = useState<'今日' | '明日'>('今日');

  // 入力データ保持
  const [formData, setFormData] = useState({
    year: '1980', month: '1', day: '1',
    bloodType: '不明', constellation: '不明', zodiac: '不明'
  });

  // 選択肢データ
  const years = Array.from({ length: 77 }, (_, i) => (1950 + i).toString()).reverse();
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  const handleFortune = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPage('RESULT');
      window.scrollTo(0, 0);
    }, 1200);
  };

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < count ? "text-yellow-400" : "text-gray-600"}>★</span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center pb-20">
      {/* ロゴ */}
      <div className="mt-8 mb-10 flex items-center gap-1 text-3xl font-bold">
        <span className="text-blue-500">m</span><span className="text-green-500">i</span><span className="text-yellow-400">★</span><span className="text-blue-400">k</span><span className="text-purple-500">e</span>
        <span className="text-xs text-gray-500 self-end mb-1 ml-1 font-normal tracking-tighter">ver.2 Premium</span>
      </div>

      <div className="w-full max-w-md px-5">
        {page === 'INPUT' ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-center text-xl text-blue-100 font-medium mb-8">占いたい方の情報を入力して下さい</h2>
            
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2">
                <p className="text-blue-300">生年月日</p>
                <p>年</p>
                <select value={formData.year} onChange={(e)=>setFormData({...formData, year: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3 outline-none focus:border-blue-500">
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <p>月</p>
                <select value={formData.month} onChange={(e)=>setFormData({...formData, month: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3 outline-none">
                  <option>不明</option>
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <p>日</p>
                <select value={formData.day} onChange={(e)=>setFormData({...formData, day: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3 outline-none">
                  <option>不明</option>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2">
                <p className="text-blue-300">血液型</p>
                <select value={formData.bloodType} onChange={(e)=>setFormData({...formData, bloodType: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3 outline-none">
                  <option>不明</option><option>A型</option><option>B型</option><option>O型</option><option>AB型</option>
                </select>
              </div>
              <div className="space-y-2">
                <p className="text-blue-300">星座</p>
                <select value={formData.constellation} onChange={(e)=>setFormData({...formData, constellation: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3 outline-none">
                  <option>不明</option><option>牡羊座</option><option>牡牛座</option><option>双子座</option><option>蟹座</option><option>獅子座</option><option>乙女座</option><option>天秤座</option><option>蠍座</option><option>射手座</option><option>山羊座</option><option>水瓶座</option><option>魚座</option>
                </select>
              </div>
              <div className="space-y-2">
                <p className="text-blue-300">干支</p>
                <select value={formData.zodiac} onChange={(e)=>setFormData({...formData, zodiac: e.target.value})} className="w-full bg-[#0f172a] border border-slate-800 rounded-lg p-3 outline-none">
                  <option>不明</option><option>子</option><option>丑</option><option>寅</option><option>卯</option><option>辰</option><option>巳</option><option>午</option><option>未</option><option>申</option><option>酉</option><option>戌</option><option>亥</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-blue-300 text-xs">占う日</p>
              <div className="flex bg-[#0f172a] rounded-lg p-1 border border-slate-800">
                {(['今日', '明日'] as const).map((d) => (
                  <button key={d} onClick={() => setTargetDate(d)} className={`flex-1 py-3 text-sm rounded-lg transition-all ${targetDate === d ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* 入力を固定するボタンの追加 */}
            <div className="flex justify-end pt-2">
              <button className="bg-[#2c3748] hover:bg-[#3d4b5f] text-gray-200 text-xs py-2.5 px-6 rounded-lg transition-colors border border-slate-700">
                入力を固定する
              </button>
            </div>

            <button onClick={handleFortune} disabled={loading} className={`w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-xl bg-gradient-to-r from-fuchsia-500 to-cyan-500 mt-2 active:scale-95 tracking-widest`}>
              {loading ? '星を読み解いています...' : '運勢を占う'}
            </button>

            <p className="text-center text-gray-500 text-xs mt-4">2026/3/15 (今日)</p>

            <div className="bg-[#111827] border border-slate-800 p-5 rounded-xl">
              <p className="text-cyan-400 text-[10px] mb-1 font-bold tracking-widest uppercase">Reading Date</p>
              <p className="text-xl font-bold tracking-widest">2026-03-15</p>
            </div>
          </div>
        ) : (
          /* 結果表示画面 */
          <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-700">
            <div className="bg-[#111827] border border-slate-800 p-5 rounded-xl text-center">
              <p className="text-cyan-400 text-[10px] mb-1 font-bold tracking-widest uppercase">Reading Date</p>
              <p className="text-xl font-bold tracking-widest">2026-03-15</p>
            </div>

            {/* 各運勢コンテンツ（省略せず以前のまま保持） */}
            <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800">
              <h3 className="text-lg font-bold mb-3">今日の総合運</h3>
              <div className="mb-4">{renderStars(5)}</div>
              <p className="text-sm text-gray-300 leading-relaxed">今日は全体的に前向きな流れです。焦らず進むことで運気が整いやすい日です。</p>
            </div>

            <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-emerald-900/30">
              <h3 className="text-lg font-bold text-emerald-400 mb-3">今日の開運アクション</h3>
              <p className="text-sm text-gray-300">今日中に小さな目標を1つ達成する。</p>
            </div>

            <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-gray-800">
              <h3 className="text-lg font-bold mb-3">今日のアドバイス</h3>
              <p className="text-sm text-gray-300">今日は一つだけでも前向きな行動を選んでみてください。</p>
            </div>

            {/* バイオリズム */}
            <div className="bg-[#1e1e1e] p-6 rounded-2xl border border-yellow-900/20">
              <h3 className="text-lg font-bold text-yellow-500 mb-6 font-serif italic tracking-tighter">今週のバイオリズム</h3>
              <div className="space-y-4">
                {[
                  { d: '2026-03-15', s: 5, t: '前向きな流れが強い日です。人との交流が幸運につながります。' },
                  { d: '2026-03-16', s: 2, t: '少し運気が低調です。休息を意識しましょう。' },
                  { d: '2026-03-17', s: 3, t: '穏やかな流れです。焦らず丁寧に進めましょう。' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-black/40 p-4 rounded-xl border border-gray-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400 font-mono">{item.d}</span>
                      {renderStars(item.s)}
                    </div>
                    <p className="text-[13px] text-gray-300 leading-relaxed">{item.t}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ラッキー情報等...（コードの長さ節約のため一部中略しますが、お手元のファイルでは全項目維持してください） */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1e1e1e] p-4 rounded-2xl border border-gray-800">
                <p className="font-bold mb-2">金運</p>
                <div className="mb-2 text-xs">{renderStars(1)}</div>
                <p className="text-[11px] text-gray-400">必要なものを見極めると金運が安定します。</p>
              </div>
              <div className="bg-[#1e1e1e] p-4 rounded-2xl border border-gray-800">
                <p className="font-bold mb-2">健康運</p>
                <div className="mb-2 text-xs">{renderStars(2)}</div>
                <p className="text-[11px] text-gray-400">軽い運動が心身のバランスを整えてくれます。</p>
              </div>
            </div>

            {/* お洒落な戻るボタンへの変更 */}
            <div className="pt-6 pb-4">
              <button 
                onClick={() => setPage('INPUT')} 
                className="w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all text-sm tracking-widest font-medium"
              >
                ← 戻って入力をやり直す
              </button>
            </div>

            <div className="border-t border-slate-800/50 pt-8 text-center text-[13px] text-gray-400 italic px-4 leading-relaxed">
              新しい出会いはプロフィールのリンクから。未来を明るくしてくれる人と、今度こそ出会いましょう！
            </div>
            <div className="flex flex-wrap justify-center gap-3 text-[10px] text-fuchsia-500/50 font-medium pb-10">
              <span>#相性占い</span> <span>#特別鑑定</span> <span>#恋愛相談</span> <span>#運命の出会い</span> <span>#恋愛成就</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
