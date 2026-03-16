import React, { useState, useEffect } from 'react';

const DIRECTIONS = ["北", "北東", "東", "南東", "南", "南西", "西", "北西"];
const L_ITEMS = ["天然石のブレスレット", "銀のブックマーク", "シルクのハンカチ", "アンティークの鍵", "革のパスケース", "クリスタルの置物", "手書きのメッセージ", "お気に入りの万年筆"];
const L_COLORS = ["ミッドナイトネイビー", "シャンパンゴールド", "パールホワイト", "ローズマダー", "セージグリーン", "テラコッタ", "ライラック", "コバルトブルー"];

// ★視認性確保のためのスタイル定義（鑑定後画面用）
const textShadowResult = { textShadow: '0 2px 4px rgba(0,0,0,0.8)' };
// 神秘的な雰囲気を出すためのカードデザイン（深く透ける濃紺）
const cardBgResult = "bg-[#0a0518]/95 backdrop-blur-sm border border-[#1e1540] shadow-[0_0_15px_rgba(100,255,255,0.15)] rounded-3xl p-6 shadow-xl text-left";
const titleColorResult = "text-[#8deeee] font-bold"; // 鑑定タイトルの色（明るい水色）
const textColorResult = "text-[#e0e0f0]"; // 通常文字の色（薄いグレー）

// ★CSSで描く神秘的な銀河背景のスタイル定義（鑑定後画面用）
const galaxyBackground = {
  backgroundColor: '#050010',
  backgroundImage: `
    radial-gradient(circle at 20% 30%, rgba(255, 100, 200, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(100, 100, 255, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 50% 50%, rgba(50, 0, 100, 0.15) 0%, transparent 60%),
    repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.005) 0px, rgba(255, 255, 255, 0.005) 1px, transparent 1px, transparent 10px)
  `,
  backgroundAttachment: 'fixed'
};

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
    // データ保存用のキーを独自のものに変更（旧バージョンと混ざらないように）
    const saved = localStorage.getItem('mike_cosmic_v25');
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
        "今は少しだけ立ち止まり、自分自身の内面を深く見つめ直すべき充電の時期です。物事が思うように進まないと感じるかもしれませんが、それは宇宙があなたに「休息と確認」を促しているサイン。焦って無理に動くよりも、今は身の回りを整理整頓したりして、心に余裕を作刻大切です。無理をしない勇気が、明日の輝きへと繋がります。",
        "運気の流れが少し緩やかになっています。外部の喧騒に惑わされず、自分の土台を再確認するのに適した日です。今は派手な行動よりも、基礎を固め、周囲との調和を図ることに注力してください。内面を磨くことが、次に巡ってくる好機を最大限に活かすための準備となります。"
      ],
      1: [
        "浄化とリセットが必要な「冬の時期」の運気です。無理に結果を出そうとすると空回りしやすいため、今日は徹底的に自分を労わり、心身のデトックスに励んでください。古い価値観や不要になったものを手放すことで、新しい幸運が舞い込むための空白が生まれます。目に見える成果は少ないかもしれませんが、水面下では次なる幸運の種が芽吹き始めています。岚の後は必ず美しい虹がかかることを忘れずに。",
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
      love: ["今は自分を磨く準備期間。焦らず、心の静寂を大切に過ごしてください。","周囲との距離感を大切に。控えめな振る舞いがあなたの魅力を引き立てます。","安定した運気。素直な笑顔を心がけることで身近な人との絆が深まります。","愛の女神が微笑んでいます。一歩踏み出す勇気が運命を劇的に変えるでしょう。","魂が共鳴するような最高の恋愛運。奇跡的な展開が訪れる予感があります。"],
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
      
      const getStarByDate = (t: Date, offsetIdx: number = 0) => {
        const diff = Math.floor((t.getTime() - birthBase.getTime()) / (24 * 60 * 60 * 1000));
        const hash = (totalSeed + offsetIdx * 17 + diff) % 100;
        if (hash < 20) return 1;
        if (hash < 40) return 2;
        if (hash < 60) return 3;
        if (hash < 80) return 4;
        return 5;
      };
      
      const mainStar = getStarByDate(baseDate, 0);

      const s_money = getStarByDate(baseDate, 1);
      const s_health = getStarByDate(baseDate, 2);
      const s_love = getStarByDate(baseDate, 3);
      const s_work = getStarByDate(baseDate, 4);

      const dayLabels = ['日', '月', '火', '水', '木', '金', '土'];
      const weekly = Array.from({ length: 7 }, (_, idx) => {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() + idx);
        return { 
          date: `${d.getMonth() + 1}/${d.getDate()}`, 
          day: dayLabels[d.getDay()], 
          star: getStarByDate(d, idx) 
        };
      });

      setFortuneResult({
        dateStr: `${baseDate.getFullYear()}年${(baseDate.getMonth() + 1)}月${baseDate.getDate()}日`,
        general: getDailyGeneralComment(mainStar, totalSeed),
        advice: getAdvice(mainStar, totalSeed),
        stars: {
          total: mainStar,
          money: { s: s_money, c: getSynchronizedComment("money", s_money) },
          health: { s: s_health, c: getSynchronizedComment("health", s_health) },
          love: { s: s_love, c: getSynchronizedComment("love", s_love) },
          work: { s: s_work, c: getSynchronizedComment("work", s_work) }
        },
        lucky: { direction: DIRECTIONS[totalSeed % 8], number: (totalSeed % 9) + 1, item: L_ITEMS[totalSeed % L_ITEMS.length], color: L_COLORS[totalSeed % L_COLORS.length] },
        weekly
      });
      setLoading(false); setPage('RESULT'); window.scrollTo(0, 0);
    }, 2000);
  };

  const renderStars = (count: number, size: string = "text-lg", mode: 'INPUT' | 'RESULT' = 'INPUT') => (
    <div className="flex gap-0.5 justify-center">
      {[...Array(5)].map((_, i) => (
        <span 
          key={i} 
          className={i < count ? "text-yellow-400" : (mode === 'RESULT' ? "text-gray-600" : "text-gray-700")} 
          style={mode === 'RESULT' ? textShadowResult : {}}
        >★</span>
      ))}
    </div>
  );

  return (
    // ★鑑定後画面（RESULT）にのみ、CSSで描いた神秘的な銀河背景（galaxyBackground）を適用。入力画面は維持。
    <div className="min-h-screen text-[#e0e0f0] font-sans flex flex-col items-center pb-20 relative text-center relative overflow-x-hidden" style={page === 'RESULT' ? galaxyBackground : { backgroundColor: '#050212' }}>
      
      <div className="absolute top-0 left-0 w-full z-[100] px-6 pointer-events-none mt-20">
        {errorMsg && (
          <div className="bg-red-600 text-white px-4 py-3 rounded-xl shadow-2xl font-bold animate-bounce text-sm mx-auto max-w-xs pointer-events-auto leading-normal">
            ⚠️ {errorMsg}
          </div>
        )}
      </div>

      <div className="mt-8 mb-10 flex items-center justify-center gap-3 relative z-10 overflow-hidden">
        {/* ロゴのデザインを神秘的なネオン風に */}
        <div className="flex items-center gap-1 text-3xl font-bold" style={{ textShadow: '0 2px 10px rgba(100,255,255,0.7)' }}>
          <span className="text-blue-400">m</span><span className="text-green-400">i</span><span className="text-yellow-400">★</span><span className="text-blue-400">k</span><span className="text-purple-400">e</span>
        </div>
        <button onClick={() => setShowManual(true)} className="py-1 px-3 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400">取扱説明書</button>
      </div>

      <div className="w-full max-w-md px-6 relative z-10 space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]"><div className="w-20 h-20 border-4 border-t-cyan-400 border-white/10 rounded-full animate-spin"></div><p className="mt-8 text-cyan-400 tracking-widest animate-pulse font-serif" style={textShadowResult}>運命を解析中...</p></div>
        ) : page === 'INPUT' ? (
          <div className="space-y-8 animate-in fade-in duration-500 text-gray-100">
            <h2 className="text-2xl font-bold text-gray-100" style={textShadowResult}>情報を入力して下さい</h2>
            
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2"><p className="text-cyan-300 font-medium">生年月日</p><select value={yVal} onChange={(e)=>setYVal(e.target.value)} disabled={isLocked} className="w-full bg-[#0a0518] border border-[#1e1540] rounded-lg p-3 text-white appearance-none outline-none"><option value="不明">不明</option>{Array.from({ length: 80 }, (_, i) => (2026 - i).toString()).map(v => <option key={v} value={v}>{v}年</option>)}</select></div>
              <div className="space-y-2 flex flex-col justify-end"><select value={mVal} onChange={(e)=>setMVal(e.target.value)} disabled={isLocked} className="w-full bg-[#0a0518] border border-[#1e1540] rounded-lg p-3 text-white appearance-none outline-none"><option value="不明">不明</option>{Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map(v => <option key={v} value={v}>{v}月</option>)}</select></div>
              <div className="space-y-2 flex flex-col justify-end"><select value={dVal} onChange={(e)=>setDVal(e.target.value)} disabled={isLocked} className="w-full bg-[#0a0518] border border-[#1e1540] rounded-lg p-3 text-white appearance-none outline-none"><option value="不明">不明</option>{Array.from({ length: 31 }, (_, i) => (i + 1).toString()).map(v => <option key={v} value={v}>{v}日</option>)}</select></div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="space-y-2"><p className="text-cyan-300 font-medium">血液型</p><select value={btVal} onChange={(e)=>setBtVal(e.target.value)} disabled={isLocked} className="w-full bg-[#0a0518] border border-[#1e1540] rounded-lg p-3 text-white appearance-none"><option value="不明">不明</option>{["A型","B型","O型","AB型"].map(v=><option key={v} value={v}>{v}</option>)}</select></div>
              <div className="space-y-2 text-center"><p className="text-cyan-300 font-medium">星座</p><select value={csVal} onChange={(e)=>setCsVal(e.target.value)} disabled={isLocked} className="w-full bg-[#0a0518] border border-[#1e1540] rounded-lg p-3 text-white appearance-none"><option value="不明">不明</option>{["牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座", "天秤座", "蠍座", "射手座", "山羊座", "水瓶座", "魚座"].map(v=><option key={v} value={v}>{v}</option>)}</select></div>
              <div className="space-y-2 text-center"><p className="text-cyan-300 font-medium">干支</p><select value={zdVal} onChange={(e)=>setZdVal(e.target.value)} disabled={isLocked} className="w-full bg-[#0a0518] border border-[#1e1540] rounded-lg p-3 text-white appearance-none"><option value="不明">不明</option>{["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"].map(v=><option key={v} value={v}>{v}</option>)}</select></div>
            </div>
            
            <div className="flex bg-[#0a0518] rounded-full p-1 border border-[#1e1540]"><button onClick={() => setTargetDate('今日')} className={`flex-1 py-3 text-xs rounded-full transition-all ${targetDate === '今日' ? 'bg-[#1e1540] text-cyan-300 shadow-md' : 'text-gray-400'}`}>今日</button><button onClick={() => setTargetDate('明日')} className={`flex-1 py-3 text-xs rounded-full transition-all ${targetDate === '明日' ? 'bg-[#1e1540] text-cyan-300 shadow-md' : 'text-gray-400'}`}>明日</button></div>
            
            <div className="flex justify-end gap-2 pt-2 text-gray-400">{!isLocked ? <button onClick={()=>{localStorage.setItem('mike_cosmic_v25', JSON.stringify({y:yVal,m:mVal,d:dVal,bt:btVal,cs:csVal,zd:zdVal})); setIsLocked(true);}} className="bg-white/5 text-gray-400 text-[10px] py-2 px-6 rounded-lg border border-white/10 shadow-md active:bg-white/10">入力を固定</button> : <><button onClick={()=>{localStorage.removeItem('mike_cosmic_v25'); setIsLocked(false);}} className="bg-red-900/30 text-red-300 text-[10px] py-2 px-4 rounded-lg">解除</button><button onClick={()=>{setYVal('不明');setMVal('不明');setDVal('不明');setBtVal('不明');setCsVal('不明');setZdVal('不明');setIsLocked(false);}} className="bg-white/5 text-gray-400 text-[10px] py-2 px-4 rounded-lg border border-white/10 active:bg-white/10">他人を占う</button></>}</div>
            
            <button onClick={handleStartFortune} className="w-full py-5 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-[#6a11cb] to-[#2575fc] shadow-[0_4px_15px_rgba(37,117,252,0.4)] active:scale-95 transition-all">鑑定を開始する</button>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-10 pb-10">
            {/* ★鑑定結果画面（RESULT）コンテンツ全体にカードデザイン（cardBgResult）を適用し、可読性を確保 */}
            <div className={`text-center ${cardBgResult}`}><p className={`${textColorResult} text-[10px] font-bold uppercase tracking-widest`} style={textShadowResult}>鑑定日：{fortuneResult.dateStr}</p></div>
            
            <div className={cardBgResult}>
              <h3 className={`text-lg mb-4 ${titleColorResult} text-center border-b border-[#1e1540] pb-3`} style={textShadowResult}>今日の総合運</h3>
              <div className="flex justify-center mb-5">{renderStars(fortuneResult.stars.total, "text-xl", 'RESULT')}</div>
              <p className={`text-[14px] ${textColorResult} leading-relaxed font-light mb-4`} style={textShadowResult}>{fortuneResult.general}</p>
              
              <div className="bg-[#1e1540]/50 p-4 rounded-xl border border-cyan-900 shadow-inner">
                <p className="text-[10px] text-cyan-300 font-bold uppercase mb-1 tracking-wider" style={textShadowResult}>💡 行動指針</p>
                <p className={`text-[12px] ${textColorResult} leading-relaxed font-medium`} style={textShadowResult}>{fortuneResult.advice}</p>
              </div>
            </div>
            
            <div className={cardBgResult}>
              <h3 className={`text-sm mb-6 text-center border-b border-[#1e1540] pb-2 ${titleColorResult}`} style={textShadowResult}>週間バイオリズム</h3>
              <div className="space-y-3">
                {fortuneResult.weekly.map((w: any, i: number) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${i === 0 ? 'bg-cyan-950/50 border border-cyan-700 shadow-inner' : 'bg-[#0a0518]/50 border border-[#1e1540]'}`}>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold w-10 ${i === 0 ? 'text-cyan-300' : 'text-gray-500'}`} style={i === 0 ? textShadowResult : {}}>{w.date}</span>
                      <span className={`text-xs w-4 ${i === 0 ? 'text-gray-100' : 'text-gray-400'}`} style={i === 0 ? textShadowResult : {}}>{w.day}</span>
                    </div>
                    <div>{renderStars(w.star, "text-sm", 'RESULT')}</div>
                    <span className="text-[9px] text-gray-500 uppercase">{i === 0 ? 'Today' : ''}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {[ { label: '金運', star: fortuneResult.stars.money.s, color: 'text-yellow-400', comm: fortuneResult.stars.money.c }, { label: '健康運', star: fortuneResult.stars.health.s, color: 'text-emerald-400', comm: fortuneResult.stars.health.c }, { label: '恋愛運', star: fortuneResult.stars.love.s, color: 'text-pink-400', comm: fortuneResult.stars.love.c }, { label: '仕事運', star: fortuneResult.stars.work.s, color: 'text-cyan-400', comm: fortuneResult.stars.work.c } ].map((u, i) => (
                <div key={i} className={cardBgResult}>
                  <div className="flex justify-between items-center mb-3">
                    <p className={`font-bold text-sm ${u.color}`} style={textShadowResult}>{u.label}</p>
                    <div className="flex gap-0.5">{renderStars(u.star, "text-sm", 'RESULT')}</div>
                  </div>
                  <p className={`text-[12px] ${textColorResult} leading-relaxed font-light`} style={textShadowResult}>{u.comm}</p>
                </div>
              ))}
            </div>
            
            <div className={`${cardBgResult} text-left`}>
              <h3 className={`text-sm mb-4 text-center border-b border-[#1e1540] pb-2 ${titleColorResult}`} style={textShadowResult}>本日のラッキー指針</h3>
              <div className="grid grid-cols-2 gap-3 text-[10px]">
                <div className="bg-[#0a0518]/50 p-3 rounded-xl flex flex-col items-center gap-1 border border-[#1e1540] shadow-inner">
                  <span className="text-gray-500">ラッキーカラー</span>
                  <span className={`${textColorResult} font-bold text-center`} style={textShadowResult}>{fortuneResult.lucky.color}</span>
                </div>
                <div className="bg-[#0a0518]/50 p-3 rounded-xl flex flex-col items-center gap-1 border border-[#1e1540] shadow-inner">
                  <span className="text-gray-500">ラッキーアイテム</span>
                  <span className={`${textColorResult} font-bold text-center`} style={textShadowResult}>{fortuneResult.lucky.item}</span>
                </div>
              </div>
            </div>
            
            {/* 戻るボタンもネオン風に */}
            <button onClick={() => setPage('INPUT')} className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs tracking-widest mt-6 active:bg-white/10">戻る</button>
          </div>
        )}
      </div>

      {showManual && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6" onClick={() => setShowManual(false)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <div className="relative bg-[#0a0518] border border-[#1e1540] p-8 rounded-3xl max-w-sm w-full shadow-2xl text-left text-sm text-gray-300 space-y-4" onClick={e=>e.stopPropagation()}>
            <h3 className="text-xl font-bold text-cyan-300 mb-6 border-b border-[#1e1540] pb-2 text-center font-serif" style={textShadowResult}>鑑定マニュアル</h3>
            <p className={`${textColorResult} leading-relaxed`}>鑑定を開始するには、生年月日、血液型、星座、干支のうち、どれか一つでも情報を入力してください（全て不明でも鑑定可能です）。</p>
            <p className={`${textColorResult} leading-relaxed`}>「入力を固定」すると、次回からあなたの情報を自動で表示します。</p>
            <button onClick={() => setShowManual(false)} className="mt-8 w-full py-3 bg-gradient-to-r from-[#6a11cb] to-[#2575fc] rounded-xl font-bold text-white shadow-lg">閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
