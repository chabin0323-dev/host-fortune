import React, { useState, useEffect } from 'react';

const DIRECTIONS = ["北", "北東", "東", "南東", "南", "南西", "西", "北西"];
const L_ITEMS = ["天然石のブレスレット", "銀のブックマーク", "シルクのハンカチ", "アンティークの鍵", "革のパスケース", "クリスタルの置物", "手書きのメッセージ", "お気に入りの万年筆"];
const L_COLORS = ["ミッドナイトネイビー", "シャンパンゴールド", "パールホワイト", "ローズマダー", "セージグリーン", "テラコッタ", "ライラック", "コバルトブルー"];

const App: React.FC = () => {
  const [page, setPage] = useState<'INPUT' | 'RESULT'>('INPUT');
  const [loading, setLoading] = useState(false);
  const [targetDate, setTargetDate] = useState<'今日' | '明日'>('今日');
  const [isLocked, setIsLocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fortuneResult, setFortuneResult] = useState<any>(null);

  // ステート初期値を確実に「不明」に設定
  const [yVal, setYVal] = useState('不明');
  const [mVal, setMVal] = useState('不明');
  const [dVal, setDVal] = useState('不明');
  const [btVal, setBtVal] = useState('不明');
  const [csVal, setCsVal] = useState('不明');
  const [zdVal, setZdVal] = useState('不明');

  useEffect(() => {
    const saved = localStorage.getItem('mike_premium_v20');
    if (saved) {
      const d = JSON.parse(saved);
      setYVal(d.y); setMVal(d.m); setDVal(d.d);
      setBtVal(d.bt); setCsVal(d.cs); setZdVal(d.zd);
      setIsLocked(true);
    }
  }, []);

  const getLongGeneralComment = (stars: number) => {
    const comments: any = {
      5: "宇宙の全エネルギーがあなたの元へ集結し、魂が黄金色に輝く最高の運気です。これまでの努力が報われ、不可能と思っていたことが現実化する奇跡的な瞬間が訪れます。直感力が極限まで高まっているため、迷わず自分の信じる道を選んでください。あなたの放つポジティブなオーラが周囲を惹きつけ、素晴らしい協力者やチャンスを次々と引き寄せるでしょう。今日は自分を甘やかすのではなく、大きな目標に向かって力強く一歩を踏み出すことで、未来の繁栄が約束されます。",
      4: "運気の波は非常に高い位置で安定しており、知性と感性が完璧に調和しています。周囲からの信頼が厚くなり、あなたの発言や行動が大きな影響力を持つ一日となるでしょう。滞っていた計画や悩み事があれば、今日向き合うことで驚くほどスムーズに解決へと向かいます。新しい情報の波に飛び込むことや、少し高い目標に挑戦するのにも最適な時期です。誠実な対話を心がけ、感謝の気持ちを言葉にすることで、さらに運気の流れを強固なものにできるでしょう。",
      3: "穏やかで調和の取れた一日です。大きな変化を求めるよりも、今ある日常の小さな幸せに目を向け、心を整えることに適した運気です。足元を固めることで、次に訪れる飛躍のチャンスに備えることができます。周囲との協調を大切にし、聞き手に回ることで、有益なヒントを得られる可能性が高いでしょう。夜は自分だけの静かな時間を持ち、好きな香りに包まれたり、温かい飲み物を楽しんだりしてエネルギーを充電してください。日常の丁寧な積み重ねが開運の鍵となります。",
      2: "今は少しだけ立ち止まり、自分自身の内面を深く見つめ直すべき充電の時期です。物事が思うように進まないと感じるかもしれませんが、それは宇宙があなたに「休息と確認」を促しているサイン。焦って無理に動くよりも、今は知識を蓄えたり、身の回りを整理整頓したりして、心に余裕を作ることが大切です。他人のペースに惑わされず、自分の本来のリズムを取り戻すことで、徐々に運気の曇り空が晴れていきます。無理をしない勇気が、明日の輝きへと繋がります。",
      1: "浄化とリセットが必要な「冬の時期」の運気です。無理に結果を出そうとすると空回りしやすいため、今日は徹底的に自分を労わり、心身のデトックスに励んでください。古い価値観や不要になったものを手放すことで、新しい幸運が舞い込むための空白が生まれます。目に見える成果は少ないかもしれませんが、水面下では次なる幸運の種が芽吹き始めています。今は忍耐強く、自分を信じて静かに過ごしてください。嵐の後は必ず美しい虹がかかることを忘れずに。"
    };
    return comments[stars];
  };

  const getSynchronizedComment = (type: string, stars: number) => {
    const database: any = {
      money: ["今は守りに徹する時。無駄な支出を抑えることが将来の豊かさの種になります。","収支のバランスを意識して。節約を楽しむ心の余裕が運気を好転させます。","金運は安定。自分への投資や知識を深めるための出費にツキがあります。","豊かさの波が接近中。直感を信じることでお得な情報を掴み取れるでしょう。","最強の財運が到来！大きな利益を手にする好機です。迷わず行動を。"],
      health: ["心身ともに疲れが出やすい時期。無理をせず、今日は早めに休息をとって。","少し気力が減退。栄養のある食事と深い呼吸でエネルギーを回復させて。","健康状態は良好。軽い散歩を日常に取り入れることでさらに整います。","エネルギー満タン！活動的に動けますが、睡眠時間は削らずに。","生命力が最高潮！研ぎ澄まされた感覚で、何事にも全力で取り組めます。"],
      love: ["今は自分を磨く準備期間。焦らず、心の静寂を大切に過ごしてください。","周囲との距離感を大切に。控えめな振る舞いがあなたの魅力を引き立てます。","安定した運気。素直な笑顔を心がけることで身近な人との絆が深まります。","愛の女神が微笑んでいます。一歩踏み出す勇気が運命を劇的に変えるでしょう。","魂が共鳴するような最高の恋愛運。奇跡的な展開が訪れる予感があります。"],
      work: ["集中力が途切れがち。今あるタスクを丁寧に片付けることで信頼を維持して。","足元を固める時期。ルーチンワークに楽しみを見出すことで次への土台が完成。","着実な進歩が見込める日。周囲との協調性を大切にすると円滑に進みます。","独創的なアイデアが認められる兆し。自信を持って提案を発信しましょう。","仕事運は絶好調！卓越した手腕で周囲を圧倒し、新たなステージへ進めます。"]
    };
    return database[type][stars - 1];
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
      
      const getBioAtDate = (t: Date) => {
        const diff = Math.floor((t.getTime() - birthBase.getTime()) / (24 * 60 * 60 * 1000));
        const e = Math.sin((2 * Math.PI * (diff + 5)) / 28) * 45 + 50;
        return Math.max(1, Math.min(5, Math.floor(e / 20) + 1));
      };
      const mainStar = getBioAtDate(baseDate);
      const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];
      const weekly = Array.from({ length: 7 }, (_, idx) => {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() + idx);
        return { date: `${d.getMonth() + 1}/${d.getDate()}`, day: dayLabels[d.getDay()], star: getBioAtDate(d) };
      });

      setFortuneResult({
        dateStr: `${baseDate.getFullYear()}年${(baseDate.getMonth() + 1)}月${baseDate.getDate()}日`,
        general: getLongGeneralComment(mainStar),
        stars: {
          total: mainStar,
          money: { s: Math.max(1, Math.min(5, (pSeed % 5) + 1)), c: getSynchronizedComment("money", Math.max(1, Math.min(5, (pSeed % 5) + 1))) },
          health: { s: Math.max(1, Math.min(5, ((pSeed + baseDate.getDate()) % 5) + 1)), c: getSynchronizedComment("health", Math.max(1, Math.min(5, ((pSeed + baseDate.getDate()) % 5) + 1))) },
          love: { s: Math.max(1, Math.min(5, ((pSeed + 3) % 4) + 2)), c: getSynchronizedComment("love", Math.max(1, Math.min(5, ((pSeed + 3) % 4) + 2))) },
          work: { s: Math.max(1, Math.min(5, ((pSeed + 7) % 5) + 1)), c: getSynchronizedComment("work", Math.max(1, Math.min(5, ((pSeed + 7) % 5) + 1))) }
        },
        lucky: { direction: DIRECTIONS[pSeed % 8], number: (pSeed % 9) + 1, item: L_ITEMS[pSeed % L_ITEMS.length], color: L_COLORS[pSeed % L_COLORS.length] },
        weekly
      });
      setLoading(false); setPage('RESULT'); window.scrollTo(0, 0);
    }, 2000);
  };

  const renderStars = (count: number, size: string = "text-lg") => (
    <div className="flex gap-0.5 justify-center">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < count ? `text-yellow-400 ${size}` : `text-gray-800 ${size}`}>★</span>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col items-center pb-20 relative text-center">
      {errorMsg && <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold animate-bounce text-sm whitespace-nowrap">⚠️ {errorMsg}</div>}

      <div className="mt-8 mb-10 flex items-center justify-center gap-3 font-bold text-3xl">
        <span className="text-blue-500">m</span><span className="text-green-500">i</span><span className="text-yellow-400">★</span><span className="text-blue-400">k</span><span className="text-purple-500">e</span>
        <span className="text-[10px] text-gray-500 self-end mb-1 ml-1 font-mono uppercase">Premium</span>
      </div>

      <div className="w-full max-w-md px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]"><div className="w-20 h-20 border-4 border-t-cyan-400 border-white/10 rounded-full animate-spin"></div><p className="mt-8 text-cyan-400 tracking-widest animate-pulse font-serif">運命を解析中...</p></div>
        ) : page === 'INPUT' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">情報を入力して下さい</h2>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2"><p className="text-blue-300 font-bold">生年月日</p>
                <select value={yVal} onChange={(e)=>setYVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none outline-none">
                  <option value="不明">不明</option>{Array.from({ length: 80 }, (_, i) => (2026 - i).toString()).map(v => <option key={v} value={v}>{v}年</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <select value={mVal} onChange={(e)=>setMVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none outline-none">
                  <option value="不明">不明</option>{Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map(v => <option key={v} value={v}>{v}月</option>)}
                </select>
              </div>
              <div className="space-y-2 flex flex-col justify-end">
                <select value={dVal} onChange={(e)=>setDVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none outline-none">
                  <option value="不明">不明</option>{Array.from({ length: 31 }, (_, i) => (i + 1).toString()).map(v => <option key={v} value={v}>{v}日</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2"><p className="text-blue-300 font-bold">血液型</p><select value={btVal} onChange={(e)=>setBtVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none"><option value="不明">不明</option>{["A型","B型","O型","AB型"].map(v=><option key={v} value={v}>{v}</option>)}</select></div>
              <div className="space-y-2 text-center"><p className="text-blue-300 font-bold">星座</p><select value={csVal} onChange={(e)=>setCsVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none"><option value="不明">不明</option>{["牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座", "天秤座", "蠍座", "射手座", "山羊座", "水瓶座", "魚座"].map(v=><option key={v} value={v}>{v}</option>)}</select></div>
              <div className="space-y-2 text-center"><p className="text-blue-300 font-bold">干支</p><select value={zdVal} onChange={(e)=>setZdVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none"><option value="不明">不明</option>{["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"].map(v=><option key={v} value={v}>{v}</option>)}</select></div>
            </div>
            <div className="flex bg-[#111] rounded-xl p-1 border border-white/10"><button onClick={() => setTargetDate('今日')} className={`flex-1 py-3 text-xs rounded-lg transition-all ${targetDate === '今日' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}>今日</button><button onClick={() => setTargetDate('明日')} className={`flex-1 py-3 text-xs rounded-lg transition-all ${targetDate === '明日' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}>明日</button></div>
            <div className="flex justify-end gap-2 pt-2">{!isLocked ? <button onClick={()=>{localStorage.setItem('mike_premium_v20', JSON.stringify({y:yVal,m:mVal,d:dVal,bt:btVal,cs:csVal,zd:zdVal})); setIsLocked(true);}} className="bg-[#222] text-gray-400 text-[10px] py-2 px-6 rounded-lg border border-white/5 shadow-md">入力を固定</button> : <><button onClick={()=>{localStorage.removeItem('mike_premium_v20'); setIsLocked(false);}} className="bg-red-900/20 text-red-400 text-[10px] py-2 px-4 rounded-lg">解除</button><button onClick={()=>{setYVal('不明');setMVal('不明');setDVal('不明');setBtVal('不明');setCsVal('不明');setZdVal('不明');setIsLocked(false);}} className="bg-[#222] text-gray-400 text-[10px] py-2 px-4 rounded-lg border border-white/5">他人を占う</button></>}</div>
            <button onClick={handleStartFortune} className="w-full py-5 rounded-2xl font-bold text-lg bg-gradient-to-r from-fuchsia-600 to-cyan-600 shadow-lg active:scale-95 transition-all">鑑定を開始する</button>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-10 pb-10 text-left">
            <div className="bg-[#111] border border-white/10 p-5 rounded-xl text-center shadow-inner"><p className="text-cyan-400 text-[10px] font-bold uppercase">鑑定日：{fortuneResult.dateStr}</p></div>
            <div className="bg-[#1e1e1e] p-7 rounded-3xl border border-gray-800 shadow-xl"><h3 className="text-lg font-bold mb-4 text-white text-center border-b border-gray-800 pb-3">今日の総合運</h3><div className="flex justify-center mb-5">{renderStars(fortuneResult.stars.total)}</div><p className="text-[14px] text-gray-300 leading-relaxed font-light">{fortuneResult.general}</p></div>
            <div className="bg-[#111] p-6 rounded-2xl border border-white/10"><h3 className="text-sm font-bold text-white mb-6 text-center border-b border-white/5 pb-2">週間バイオリズム</h3>
              <div className="space-y-3">{fortuneResult.weekly.map((w: any, i: number) => (<div key={i} className={`flex items-center justify-between p-3 rounded-xl ${i === 0 ? 'bg-indigo-900/30 border border-indigo-500/30' : 'bg-white/5'}`}><div className="flex items-center gap-3"><span className={`text-[10px] font-bold w-10 ${i === 0 ? 'text-indigo-400' : 'text-gray-500'}`}>{w.date}</span><span className={`text-xs w-4 ${i === 0 ? 'text-white' : 'text-gray-400'}`}>{w.day}</span></div><div>{renderStars(w.star, "text-sm")}</div><span className="text-[9px] text-gray-500 uppercase">{i === 0 ? 'Today' : ''}</span></div>))}</div>
            </div>
            <div className="grid grid-cols-1 gap-4">{[ { label: '金運', star: fortuneResult.stars.money.s, color: 'text-yellow-500', comm: fortuneResult.stars.money.c }, { label: '健康運', star: fortuneResult.stars.health.s, color: 'text-emerald-500', comm: fortuneResult.stars.health.c }, { label: '恋愛運', star: fortuneResult.stars.love.s, color: 'text-pink-500', comm: fortuneResult.stars.love.c }, { label: '仕事運', star: fortuneResult.stars.work.s, color: 'text-cyan-500', comm: fortuneResult.stars.work.c } ].map((u, i) => (
                <div key={i} className="bg-[#1e1e1e] p-5 rounded-2xl border border-gray-800 shadow-lg"><div className="flex justify-between items-center mb-3"><p className={`font-bold text-sm ${u.color}`}>{u.label}</p><div className="flex gap-0.5">{renderStars(u.star, "text-sm")}</div></div><p className="text-[12px] text-gray-300 leading-relaxed font-light">{u.comm}</p></div>
              ))}
            </div>
            <div className="bg-[#111] p-6 rounded-2xl border border-white/10 text-left"><h3 className="text-sm font-bold text-white mb-4 text-center">本日のラッキー指針</h3><div className="grid grid-cols-2 gap-3 text-[10px]"><div className="bg-black/40 p-3 rounded-xl flex flex-col items-center gap-1 border border-white/5"><span className="text-gray-500">ラッキーカラー</span><span className="text-yellow-400 font-bold">{fortuneResult.lucky.color}</span></div><div className="bg-black/40 p-3 rounded-xl flex flex-col items-center gap-1 border border-white/5"><span className="text-gray-500">ラッキーアイテム</span><span className="text-yellow-400 font-bold text-center">{fortuneResult.lucky.item}</span></div></div></div>
            <button onClick={() => setPage('INPUT')} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs tracking-widest mt-6">戻る</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
