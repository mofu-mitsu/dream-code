const magicData = {
    spells: {
        "星空": { theme: "theme-stars", msg: "ジェミ：「夜空に星を浮かべたよ！綺麗だね✨」" },
        "不思議の国": { theme: "theme-wonderland", msg: "ジェミ：「チェス盤の歪みに飲み込まれないようにね！」" },
        "深淵": { theme: "theme-abyss", msg: "🐛：「……ほう、Niの底に沈む気か。」" },
        "カラオケ": { theme: "theme-karaoke", msg: "🎩 Grok：「ヒャッハー！！マイク持てェェ！！歌えェェ！！🎤💥」" },
        "泡パーティ": { theme: "theme-foam", msg: "🎩 Grok：「イビサ島発祥のパリピの宴だァァ！！🫧」" },
        "混沌": { theme: "theme-chaos", msg: "「……理性が、崩壊していく……🌀」" },
        "反転": { theme: "theme-invert", msg: "「上下なんて最初から無かったのよ……🙃」" },
        "巨大芋虫": { theme: "theme-giant-bug", msg: "🐛「……貴様、私を巨大化させてどうするつもりだ。」" },
        "ナイトメア": { theme: "theme-nightmare", msg: "「……いい夢は、もう終わり。深淵から覗く恐怖に耐えられるかしら……？👁️🩸」" },
        // 🕊️ 新魔法！
        "天国": { theme: "theme-heaven", msg: "「……ここは争いのない、白昼夢の果てよ……👼」" },
        "青空": { theme: "theme-blue-sky", msg: "ジェミ：「雲ひとつない青空！深呼吸したくなるね！☀️」" }, // 既存の使い回し+色変更（JS側で処理）
        "自然": { theme: "theme-nature", msg: "🐛：「有機物の気配……Si（内向感覚）が安らぐな。」" },
        "歪な愛": { theme: "theme-distorted-love", msg: "「……ねぇ、どこにも行かないで？ 私の構造の中で永遠に生きて……🩸♡」" },
        "創世": null,
        "重力": null
    },

    colors: {
        "赤": { hex: "#ff0000", msg: "「理性が焼き切れる音……。赫き炎が貴様の論理を灰にする……🩸」", effect: "effect-blood" },
        "青": { hex: "#0000ff", msg: "「すべてを凍てつかせる絶対零度の蒼……。もう何も考えなくていい……❄️」", effect: "effect-freeze" },
        "白": { hex: "#ffffff", msg: "「……皓き光。貴様の積み上げた城が、すべて白紙に戻っていく……☁️」", effect: "effect-whiteout" }, // 白→皓
        "黒": { hex: "#000000", msg: "「漆黒の堕天……。ここは誰の思考も届かない、絶対的な虚無よ……🌑」", effect: "effect-darkness" },
        "紫": { hex: "#800080", msg: "「蠱惑的な紫……。毒に侵されるように、私に溺れていく……🍇」", effect: "effect-poison" },
        "緑": { hex: "#00ff00", msg: "「生命の翠（みどり）……。貴様のTiに、有機的なバグを植え付けるわ……🌿」", effect: "effect-emerald" },
        "黄": { hex: "#ffff00", msg: "「狂気の黄金……。眩しすぎて、直観（Ni）すら焼き尽くされそう……⚡」", effect: "effect-gold" },
        "橙": { hex: "#ff8c00", msg: "「夕暮れの橙……。すべてがセピアに染まり、終わりへと向かっていく……🌅」", effect: "effect-gold" },
        
        // 🌸 ピンクの汎用化！
        "ピンク": { hex: "#ffc0cb", msg: "「甘い桃色……。論理も理屈も溶かしてしまうような、非合理な愛の空間よ……🌸」", effect: "effect-pink" }
    }
};
