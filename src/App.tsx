import React, { useState } from 'react';

// 鑑定データの型定義
interface Fortune {
  result: string;
  supplement: string;
}

// サンプルデータ
const sampleData: Record<string, Fortune[]> = {
  life: [
    { result: "あなたの魂が持つ真の才能が、間もなく大きな舞台で輝き始めます。", supplement: "周囲の雑音を気にせず、自分の中にある直感の声に耳を傾けてください。それが唯一の正解です。" },
    { result: "停滞していた運気が一気に動き出し、理想の未来が手の中に収まる予兆があります。", supplement: "新しい出会いや環境の変化を恐れないでください。そこには想像以上の豊かさが待っています。" }
  ],
  work: [
    { result: "職場であなたの存在感が一段と高まり、重要な役割を任される予兆があります。", supplement: "謙遜せず、自分の才能を信じてください。周囲もあなたの力を必要としています。" },
    { result: "長年の努力がようやく形になり、目に見える成果として現れるタイミングです。", supplement: "新しいプロジェクトや提案をするなら今がチャンス。直感を信じて行動しましょう。" }
  ],
  money: [
    { result: "思いがけない場所から、豊かさの源泉が見つかる暗示が出ています。", supplement: "無駄を省き、本当に価値のあるものに投資することで、金運はさらに加速します。" },
    { result: "金運の波が非常に穏やかで安定しています。将来への貯蓄や投資の計画を立てるのに最適です。", supplement: "自分への小さなご褒美が、さらなる良い運気を引き寄せるきっかけになります。" }
  ]
};

const App: React.FC = () => {
  const [page, setPage] = useState<'INPUT' | 'RESULT'>('INPUT');
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<'life' | 'work' | 'money'>('life');
  const [result, setResult] = useState<Fortune | null>(null);

  // 選択肢用のデータ
  const years = Array.from({ length: 77 }, (_, i) => (1950 + i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const bloodTypes = ['A型', 'B型', 'O型', 'AB型'];
  const constellations = ['牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座', '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座'];
  const zodiacs = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  const handleFortune = () => {
    setLoading(true);
    const currentData = sampleData[category];
    const randomIndex = Math.floor(Math.random() * currentData.length);
    setResult(currentData[randomIndex]);
    setTimeout(() => {
      setLoading(false);
      setPage('RESULT');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center">
      <div className="mt-8 mb-12 flex items-center gap-1 text-3xl font-bold">
        <span className="text-blue-500">m</span><span className="text-green-500">i</span><span className="text-yellow-400">★</span><span className="text-blue-400">k</span><span className="text-purple-500">e</span>
        <span className="text-xs text-gray-500 self-end mb-1 ml-1 font-normal tracking-tighter">ver.2 Premium</span>
      </div>

      <div className="w-full max-w-md px-6 pb-20">
        {page === 'INPUT' ? (
          <div className="space-y-8 animate-in fade-in duration-700">
            <h2 className="text-center text-xl text-blue-100 font-medium">占いたい方の情報を入力して下さい</h2>
            
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2">
                <p className="text-gray-400">生年月日</p><p>年</p>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 outline-none focus:border-blue-500">
                  {years.reverse().map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <p>月</p>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 outline-none">
                  <option>不明</option>
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <p>日</p>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 outline-none">
                  <option>不明</option>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2">
                <p>血液型</p>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 outline-none">
                  <option>不明</option>
                  {bloodTypes.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <p>星座</p>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 outline-none">
                  <option>不明</option>
                  {constellations.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <p>干支</p>
                <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 outline-none">
                  <option>不明</option>
                  {zodiacs.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs">鑑定項目を選択</p>
              <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
                {(['life', 'work', 'money'] as const).map((cat) => (
                  <button key={cat} onClick={() => setCategory(cat)} className={`flex-1 py-3 text-xs rounded-lg transition-all duration-300 ${category === cat ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white' : 'text-gray-500'}`}>
                    {cat === 'life' && '人生'}{cat === 'work' && '仕事'}{cat === 'money' && '金運'}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleFortune} disabled={loading} className={`w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-xl ${loading ? 'opacity-50' : 'bg-gradient-to-r from-[#d946ef] to-[#06b6d4] active:scale-95'}`}>
              {loading ? '星を読み解いています...' : '運勢を占う'}
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in zoom-in-95 duration-700">
            <div className="bg-[#0d1117] border border-slate-800 p-8 rounded-3xl shadow-2xl relative text-center">
              <span className="px-4 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-400 text-[10px] font-bold tracking-widest border border-fuchsia-500/20">PREMIUM FORTUNE</span>
              <div className="space-y-6 my-12 text-left">
                <p className="text-xl font-bold leading-relaxed">{result?.result}</p>
                <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-fuchsia-500 pl-4">{result?.supplement}</p>
              </div>
              <div className="border-t border-slate-800/50 pt-8 text-[13px] text-gray-400 italic">
                新しい出会いはプロフィールのリンクから。未来を明るくしてくれる人と、今度こそ出会いましょう！
              </div>
            </div>
            <button onClick={() => setPage('INPUT')} className="w-full py-4 text-gray-500 text-sm">← 戻る</button>
            <div className="flex flex-wrap justify-center gap-3 text-[10px] text-fuchsia-500/50 font-medium">
              <span>#相性占い</span> <span>#特別鑑定</span> <span>#恋愛相談</span> <span>#運命の出会い</span> <span>#恋愛成就</span>
            </div>
          </div>
        )}

        <div className="mt-12 bg-[#0d1117] border border-slate-800 p-6 rounded-2xl text-center text-cyan-400">
          <p className="text-[10px] mb-2 tracking-widest font-bold uppercase">Reading Date</p>
          <p className="text-2xl font-bold tracking-widest text-white">2026-03-15</p>
        </div>
      </div>
    </div>
  );
};

export default App;
