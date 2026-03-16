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
    const saved = localStorage.getItem('mike_final_v24');
    if (saved) {
      const d = JSON.parse(saved);
      setYVal(d.y); setMVal(d.m); setDVal(d.d);
      setBtVal(d.bt); setCsVal(d.cs); setZdVal(d.zd);
      setIsLocked(true);
    }
  }, []);

  const getDailyGeneralComment = (stars: number, dateSeed: number) => {
    const comments: any = {
      5: [
        "宇宙の全エネルギーがあなたの元へ集結し、魂が黄金色に輝く最高の運気です。これまでの努力が報われ、不可能と思っていたことが現実化する奇跡的な瞬間が訪れます。直感力が極限まで高まっているため、迷わず自分の信じる道を選んでください。今日は大きな目標に向かって力強く一歩を踏み出すことで、未来の繁栄が約束されます。",
        "天の加護を一身に受ける特別な一日です。あなたの内なる才能が完全に覚醒し、周囲に鮮やかな影響を与えるでしょう。滞っていた運命の歯車が音を立てて回り始め、望んでいた以上の成果を手にする暗示があります。自分を信じて、心のままに行動することが、さらなる幸運を引き寄せる鍵となります。"
      ],
      4: [
        "運気の波は非常に高い位置で安定しており、知性と感性が完璧に調和しています。周囲からの信頼が厚くなり、あなたの発言や行動が大きな影響力を持つ一日となるでしょう。滞っていた計画や悩み事があれば、今日向き合うことで驚くほどスムーズに解決へと向かいます。感謝の気持ちを言葉にすることで、さらに運気の流れを強固なものにできるでしょう。",
        "精神的な余裕が生まれ、物事を高い視点から見渡せる一日です。新しいアイデアや情報の波を乗りこなし、自分のペースで状況をコントロールできるでしょう。人との交流に幸運が眠っているため、積極的なコミュニケーションを心がけてください。あなたの明るいエネルギーが周囲に伝播し、幸福な循環が生まれます。"
      ],
      3: [
        "穏やかで調和の取れた一日です。大きな変化を求めるよりも、今ある日常の小さな幸せに目を向け、心を整えることに適した運気です。足元を固めることで、次に訪れる飛躍のチャンスに備えることができます。夜は自分だけの静かな時間を持ち、温かい飲み物を楽しんだりしてエネルギーを充電してください。",
        "凪のような安定した運気です。焦らず丁寧に進むことで、着実な成果を積み上げることができます。日常の些細な出来事の中に、将来の成功に繋がるヒントが隠されているかもしれません。バランス感覚を大切にし、自分と他人の双方を尊重する姿勢が、運気のさらなる安定を呼び込みます。"
      ],
      2: [
        "今は少しだけ立ち止まり、自分自身の内面を深く見つめ直すべき充電の時期です。物事が思うように進まないと感じるかもしれませんが、それは宇宙があなたに「休息と確認」を促しているサイン。焦って無理に動くよりも、今は身の回りを整理整頓したりして、心に余裕を作ることが大切です。無理をしない勇気が、明日の輝きへと繋がります。",
        "運気の流れが少し緩やかになっています。外部の喧騒に惑わされず、自分の土台を再確認するのに適した日です。今は派手な行動よりも、基礎を固め、周囲との調和を図ることに注力してください。内面を磨くことが、次に巡ってくる好機を最大限に活かすための準備となります。"
      ],
      1: [
        "浄化とリセットが必要な「冬の時期」の運気です。無理に結果を出そうとすると空回りしやすいため、今日は徹底的に自分を労わり、心身のデトックスに励んでください。水面下では次なる幸運の種が芽吹き始めています。今は忍耐強く、自分を信じて静かに過ごしてください。嵐の後は必ず美しい虹がかかることを忘れずに。",
        "今日は自分への「癒やし」を最優先すべき日です。蓄積された疲れやストレスをクリアにすることで、淀んでいた運気の流れが再び整い始めます。過度なプレッシャーを自分にかけず、「今できること」だけに集中しましょう。この静寂こそが、明日からの爆発的なエネルギーの源泉となります。"
      ]
    };
    const list = comments[stars] || [comments[3][0]];
    return list[dateSeed % list.length];
  };

  const getSynchronizedComment = (type: string, stars: number) => {
    const database: any = {
      money: ["今は守りに徹する時。無駄な支出を抑えることが将来の豊かさの種になります。","収支のバランスを意識して。節約を楽しむ心の余裕が運気を好転させます。","金運は安定。自分への投資や知識を深めるための出費にツキがあります。","豊かさの波が接近中。直感を信じることでお得な情報を掴み取れるでしょう。","最強の財運が到来！大きな利益を手にする好機です。迷わず行動を。"],
      health: ["心身ともに疲れが出やすい時期。無理をせず、今日は早めに休息をとって。","少し気力が減退。栄養のある食事と深い呼吸でエネルギーを回復させて。","健康状態は良好。軽い散歩を日常に取り入れることでさらに整います。","エネルギー満タン！活動的に動けますが、睡眠時間は削らずに。","生命力が最高潮！研ぎ澄まされた感覚で、何事にも全力で取り組めます。"],
      love: ["今は自分を磨く準備期間。焦らず、心の静寂を大切に過ごしてください。","周囲との距離感を大切に。控えめな振る舞いがあなたの魅力を引き立てます。","安定した運気. 素直な笑顔を心がけることで身近な人との絆が深まります。","愛の女神が微笑んでいます。一歩踏み出す勇気が運命を劇的に変えるでしょう。","魂が共鳴するような最高の恋愛運。奇跡的な展開が訪れる予感があります。"],
      work: ["集中力が途切れがち。今あるタスクを丁寧に片付けることで信頼を維持して。","足元を固める時期。ルーチンワークに楽しみを見出すことで次への土台が完成。","着実な進歩が見込める日。周囲との協調性を大切にすると円滑に進みます。","独創的なアイデアが認められる兆し。自信を持って提案を発信しましょう。","仕事運は絶好調！卓越した手腕で周囲を圧倒し、新たなステージへ進めます。"]
    };
    return database[type][stars - 1];
  };

  const getAdvice = (stars: number, seed: number) => {
    const advices = [
      "今日はデスク周りの整理を。環境を整えることで思考がクリアになります。",
      "連絡をためらっていた人にメッセージを送ってみて。幸運の扉が開きます。",
      "深呼吸を3回。焦りを感じたときほど、立ち止まる勇気が道を拓きます。",
      "靴を磨いてから外出を。足元を整えることで、良い運気の場所へ導かれます。",
      "旬の食材を食卓に取り入れて。大地のエネルギーがあなたを活性化させます。"
    ];
    return advices[seed % advices.length];
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
      
      const dSeed = baseDate.getFullYear() + (baseDate.getMonth() + 1) * 31 + baseDate.getDate();
      const pSeed = (yVal + btVal + csVal + zdVal).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const totalSeed = pSeed + dSeed;

      const birthBase = (yVal === '不明') ? new Date(2000, 0, 1) : new Date(`${yVal}-${mVal === '不明' ? '01' : mVal.padStart(2,'0')}-${dVal === '不明' ? '01' : dVal.padStart(2,'0')}`);
      
      const getWeeklyStar = (idx: number) => {
        const hash = (totalSeed + idx * 13) % 100;
        if (hash < 20) return 1;
        if (hash < 40) return 2;
        if (hash < 60) return 3;
        if (hash < 80) return 4;
        return 5;
      };

      const getBioAtDate = (t: Date) => {
        const diff = Math.floor((t.getTime() - birthBase.getTime()) / (24 * 60 * 60 * 1000));
        const e = Math.sin((2 * Math.PI * (diff + 5 + (totalSeed % 7))) / 28) * 45 + 50;
        return Math.max(1, Math.min(5, Math.floor(e / 20) + 1));
      };
      
      const mainStar = getBioAtDate(baseDate);
      const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];
      
      const weekly = Array.from({ length: 7 }, (_, idx) => {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() + idx);
        return { date: `${d.getMonth() + 1}/${d.getDate()}`, day: dayLabels[d.getDay()], star: getWeeklyStar(idx) };
      });

      setFortuneResult({
        dateStr: `${baseDate.getFullYear()}年${(baseDate.getMonth() + 1)}月${baseDate.getDate()}日`,
        general: getDailyGeneralComment(mainStar, totalSeed),
        advice: getAdvice(mainStar, totalSeed),
        stars: {
          total: mainStar,
          money: { s: Math.max(1, Math.min(5, (totalSeed % 5) + 1)), c: getSynchronizedComment("money", Math.max(1, Math.min(5, (totalSeed % 5) + 1))) },
          health: { s: Math.max(1, Math.min(5, ((totalSeed + 13) % 5) + 1)), c: getSynchronizedComment("health", Math.max(1, Math.min(5, ((totalSeed + 13) % 5) + 1))) },
          love: { s: Math.max(1, Math.min(5, ((totalSeed + 7) % 4) + 2)), c: getSynchronizedComment("love", Math.max(1, Math.min(5, ((totalSeed + 7) % 4) + 2))) },
          work: { s: Math.max(1, Math.min(5, ((totalSeed + 11) % 5) + 1)), c: getSynchronizedComment("work", Math.max(1, Math.min(5, ((totalSeed + 11) % 5) + 1))) }
        },
        lucky: { direction: DIRECTIONS[totalSeed % 8], number: (totalSeed % 9) + 1, item: L_ITEMS[totalSeed % L_ITEMS.length], color: L_COLORS[totalSeed % L_COLORS.length] },
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
      
      {/* ★【修正】エラーテロップの中央配置と折り返し設定 */}
      {errorMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold animate-bounce text-sm flex items-center justify-center text-center leading-relaxed">
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="mt-8 mb-10 flex items-center justify-center gap-3">
        <div className="flex items-center gap-1 text-3xl font-bold">
          <span className="text-blue-500">m</span><span className="text-green-500">i</span><span className="text-yellow-400">★</span><span className="text-blue-400">k</span><span className="text-purple-500">e</span>
        </div>
        <button onClick={() => setShowManual(true)} className="py-1 px-3 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400">取扱説明書</button>
      </div>

      <div className="w-full max-w-md px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]"><div className="w-20 h-20 border-4 border-t-cyan-400 border-white/10 rounded-full animate-spin"></div><p className="mt-8 text-cyan-400 tracking-widest animate-pulse font-serif">運命を解析中...</p></div>
        ) : page === 'INPUT' ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">情報を入力して下さい</h2>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2"><p className="text-blue-300 font-bold">生年月日</p><select value={yVal} onChange={(e)=>setYVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none outline-none"><option value="不明">不明</option>{Array.from({ length: 80 }, (_, i) => (2026 - i).toString()).map(v => <option key={v} value={v}>{v}年</option>)}</select></div>
              <div className="space-y-2 flex flex-col justify-end"><select value={mVal} onChange={(e)=>setMVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none outline-none"><option value="不明">不明</option>{Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map(v => <option key={v} value={v}>{v}月</option>)}</select></div>
              <div className="space-y-2 flex flex-col justify-end"><select value={dVal} onChange={(e)=>setDVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none outline-none"><option value="不明">不明</option>{Array.from({ length: 31 }, (_, i) => (i + 1).toString()).map(v => <option key={v} value={v}>{v}日</option>)}</select></div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2"><p className="text-blue-300 font-bold">血液型</p><select value={btVal} onChange={(e)=>setBtVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none"><option value="不明">不明</option>{["A型","B型","O型","AB型"].map(v=><option key={v} value={v}>{v}</option>)}</select></div>
              <div className="space-y-2 text-center"><p className="text-blue-300 font-bold">星座</p><select value={csVal} onChange={(e)=>setCsVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none"><option value="不明">不明</option>{["牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座", "天秤座", "蠍座", "射手座", "山羊座", "水瓶座", "魚座"].map(v=><option key={v} value={v}>{v}</option>)}</select></div>
              <div className="space-y-2 text-center"><p className="text-blue-300 font-bold">干支</p><select value={zdVal} onChange={(e)=>setZdVal(e.target.value)} disabled={isLocked} className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white appearance-none"><option value="不明">不明</option>{["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"].map(v=><option key={v} value={v}>{v}</option>)}</select></div>
            </div>
            <div className="flex bg-[#111] rounded-xl p-1 border border-white/10"><button onClick={() => setTargetDate('今日')} className={`flex-1 py-3 text-xs rounded-lg transition-all ${targetDate === '今日' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}>今日</button><button onClick={() => setTargetDate('明日')} className={`flex-1 py-3 text-xs rounded-lg transition-all ${targetDate === '明日' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500'}`}>明日</button></div>
            <div className="flex justify-end gap-2 pt-2">{!isLocked ? <button onClick={()=>{localStorage.setItem('mike_final_v24', JSON.stringify({y:yVal,m:mVal,d:dVal,bt:btVal,cs:csVal,zd:zdVal})); setIsLocked(true);}} className="bg-[#222] text-gray-400 text-[10px] py-2 px-6 rounded-lg border border-white/5 shadow-md">入力を固定</button> : <><button onClick={()=>{localStorage.removeItem('mike_final_v24'); setIsLocked(false);}} className="bg-red-900/20 text-red-400 text-[10px] py-2 px-4 rounded-lg">解除</button><button onClick={()=>{setYVal('不明');setMVal('不明');setDVal('不明');setBtVal('不明');setCsVal('不明');setZdVal('不明');setIsLocked(false);}} className="bg-[#222] text-gray-400 text-[10px] py-2 px-4 rounded-lg border border-white/5">他人を占う</button></>}</div>
            <button onClick={handleStartFortune} className="w-full py-5 rounded-2xl font-bold text-lg bg-gradient-to-r from-fuchsia-600 to-cyan-600 shadow-lg active:scale-95 transition-all">鑑定を開始する</button>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-10 pb-10 text-left">
            <div className="bg-[#111] border border-white/10 p-5 rounded-xl text-center shadow-inner"><p className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest">鑑定日：{fortuneResult.dateStr}</p></div>
            <div className="bg-[#1e1e1e] p-7 rounded-3xl border border-gray-800 shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-white text-center border-b border-gray-800 pb-3">今日の総合運</h3>
              <div className="flex justify-center mb-5">{renderStars(fortuneResult.stars.total)}</div>
              <p className="text-[14px] text-gray-300 leading-relaxed font-light mb-4">{fortuneResult.general}</p>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-[10px] text-indigo-400 font-bold uppercase mb-1">💡 行動指針</p>
                <p className="text-[12px] text-white leading-relaxed">{fortuneResult.advice}</p>
              </div>
            </div>
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

      {showManual && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6" onClick={() => setShowManual(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <div className="relative bg-[#111827] border border-slate-700 p-8 rounded-3xl max-w-sm w-full shadow-2xl text-left text-sm text-gray-300" onClick={e=>e.stopPropagation()}>
            <h3 className="text-xl font-bold text-cyan-400 mb-6 border-b border-slate-800 pb-2 text-center font-serif">鑑定マニュアル</h3>
            <ul className="space-y-4"><li>1. 日付ごとの星位を精密に解析し、星1つから5つまで均等に変化する助言をお届けします。</li><li>2. 総合運の下に、今日すぐできる「行動指針」を新たに追加しました。</li><li>3. プルダウンの「不明」を含む全ての機能はそのまま維持されています。</li></ul>
            <button onClick={() => setShowManual(false)} className="mt-8 w-full py-3 bg-gradient-to-r from-fuchsia-600 to-cyan-600 rounded-xl font-bold text-white shadow-lg">閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
