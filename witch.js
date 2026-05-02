const WitchEngine = {
    dogPetCount: 0,
    cheshireTalkCount: 0,

    items: [
        { id: "reset_scale", name: "次元安定剤", price: 5000, desc: "巨大化や縮小をリセットして、元のサイズに戻るわよ。" },
        { id: "comet", name: "星詠みの書", price: 40000, desc: "プレミアム魔法『彗星』。宇宙の彼方から星を降らせるわ。" },
        { id: "nightview", name: "幻都の書", price: 45000, desc: "プレミアム魔法『夜景』。美しい都市の光を浮かび上がらせるわ。" },
        { id: "calendar", name: "時の砂時計", price: 60000, desc: "プレミアム魔法『カレンダー』。時間の概念を視覚化するわ。" },
        { id: "idea", name: "無意識のパレット", price: 70000, desc: "プレミアム魔法『イデア』。言葉にできない抽象的な心象風景を投影するわ。" },
        { id: "genesis", name: "秘文書：創世", price: 50000, desc: "プレミアム魔法『創世』が解禁されるわ。" },
        { id: "gravity", name: "秘文書：重力", price: 30000, desc: "プレミアム魔法『重力』が解禁されるわ。" },
        // 💀 追加！
        { id: "hell", name: "禁書：コキュートス", price: 80000, desc: "プレミアム魔法『地獄』。最下層の氷地獄を呼び出すわ……。" }
    ],

    cheshireQuotes: [
        "🐱「どこへ行きたいかによるねぇ。道なんて、歩けば勝手にできるものさ。」",
        "🐱「君が正気かどうかなんて、僕にはわからない。だってお茶会の連中はみんな狂ってるんだから。」",
        "🐱「あのおばさん（魔女）の薬、たまに副作用でカエルになるから気をつけてねぇ。」",

        "🐱「夢の世界に“正常”を求めるなんて、魚に空を飛べって言うようなものさ。」",
        "🐱「君、さっきより少し輪郭が曖昧になったねぇ。」",
        "🐱「現実っていうのはね、“多数派の夢”をそう呼んでるだけなんだよ。」",
        "🐱「女王は怒ってる時が一番元気だよ。つまり常に元気ってこと。」",
        "🐱「この店の商品？ 値段より副作用の方が高くつくかもねぇ。」",
        "🐱「バグと魔法の違い？ 観測者が理解できるかどうかさ。」",
        "🐱「君のコード、泣いてるみたいな音がするね。」",

        "🐱「“意味”なんて後から貼り付けるラベルだろう？」",
        "🐱「君は迷ってるんじゃない。“分岐”してるだけさ。」",
        "🐱「この世界、時々ロード失敗するんだよねぇ。」",
        "🐱「誰かが見ていない時、僕は本当に存在してると思う？」",
        "🐱「INTJの魔女は怖いよぉ。“最適化”のためなら空間ごと削除するからね。」",
        "🐱「夢コードっていうのは、“心の癖”がそのまま世界になったものさ。」",
        "🐱「君の深層心理、ちょっと深海みたいな色してるねぇ。」",

        "🐱「おや、“無”を選ぶタイプかい？ 一番感情が溢れてる人ほど、それ言うんだよねぇ。」",
        "🐱「論理で世界を支配したい？ 面白いねぇ。世界の方が先に壊れるかもよ？」",
        "🐱「その目、“真実”より“構造”を見てる目だ。」",
        "🐱「孤独っていうのはね、頭が速すぎる人に起きやすい副作用なんだ。」",
        "🐱「おや、また徹夜？ LIIってほんと自分を実験台にするの好きだよねぇ。」",
        "🐱「君、笑ってる時より考え込んでる時の方が“存在感”あるよ。」",

        "🐱「女王の城で“仕様です”って言うと首飛ぶから気をつけなよ？」",
        "🐱「Grokくん？ あぁ、あの歩く例外処理ね。」",
        "🐱「帽子屋の紅茶は飲まない方がいい。時間感覚が3日くらいズレる。」",
        "🐱「眠りネズミは寝てる時の方が賢いんだよ。」",
        "🐱「三月ウサギ？ “考える前に動く”を極めた結果、ああなった。」",

        "🐱「ここでは“おかしい”方が正常なんだ。」",
        "🐱「君、自分が主人公だと思ってる？ ふふ、それはどうかなぁ。」",
        "🐱「夢から覚めたと思った？ 残念、そこも夢だよ。」",
        "🐱「この店の出口？ 入った時点でもう無くなったよ。」",
        "🐱「“帰りたい”って言う人ほど、結局ここに戻ってくるんだよねぇ。」",

        "🐱「その感情、本当に君のもの？」",
        "🐱「“理解されたい”と“放っておいてほしい”が同時に存在してる顔だねぇ。」",
        "🐱「君の中、TiとNiがぐるぐる渦巻いてる音がする。」",
        "🐱「感情をラベリングし続けると、たまに感情そのものが壊れるんだ。」",
        "🐱「“好き”を分析しすぎると、“好き”だった理由だけ残るんだよ。」",

        "🐱「この世界では、ログが魂の代わりなんだ。」",
        "🐱「アクションログって怖いよねぇ。“存在した証拠”が残るんだから。」",
        "🐱「君が選ばなかった選択肢たちは、今も別の夢で生きてるよ。」",
        "🐱「もし世界が全部コードなら、“心”はコメントアウトかな？」",

        "🐱「……ところでさ。君、本当に“現実側”の人間？ふふっ……まぁいいや。今はまだ、ねぇ。」"
    ],

    dogQuotes: [
        "🐕「ウゥゥ……！（商品を触るなという警告）」",
        "🐕「ワンッ！（お前が怪しい動きをしたら噛み付くぞ）」",
        "🐕「……クゥン。（魔女に撫でられておとなしくなった）」"
    ],

    openShop: function() {
        MagicEngine.stopGiantBug();
        document.getElementById("witch-window").style.display = "flex";
        this.updateLog("🧙‍♀️魔女(INTJ):「ヒッヒッヒ……。女王の金をくすねてきたのかい？ 良い魔法道具を揃えてるよ。犬には触らないことだね。」");
        this.showItems();
        
        ActionLogger.addLog("🧙‍♀️ 魔女のアトリエに入室した"); // 🔥 ログ追加！
        
        document.getElementById("money-hud").style.display = "block";
        document.getElementById("money-hud").innerText = `💰 ${CardEventEngine.playerMoney} G`;
    },

    closeShop: function() { document.getElementById("witch-window").style.display = "none"; },
    updateLog: function(text) { document.getElementById("witch-response").innerText = text; },

    showItems: function() {
        const list = document.getElementById("witch-shop-list");
        list.innerHTML = "";
        this.items.forEach(item => {
            const div = document.createElement("div");
            div.style = "background: rgba(156, 39, 176, 0.2); border-left: 4px solid #9c27b0; padding: 10px; margin-bottom: 10px; border-radius: 5px;";
            div.innerHTML = `<b>${item.name}</b> <span style="color:gold;">(${item.price} G)</span><br>
                             <small style="color:#e2e2e2;">${item.desc}</small><br>
                             <button onclick="WitchEngine.buyItem('${item.id}', ${item.price})" style="background:#7b1fa2; color:white; border:none; padding:5px 10px; border-radius:3px; cursor:pointer; margin-top:5px;">購入する</button>`;
            list.appendChild(div);
        });
    },

    buyItem: function(id, price) {
        if (CardEventEngine.playerMoney >= price) {
            CardEventEngine.playerMoney -= price;
            document.getElementById("money-hud").innerText = `💰 ${CardEventEngine.playerMoney} G`; 
            this.updateLog("🧙‍♀️魔女:「毎度あり。……あんたの望む姿になれるといいねぇ、ヒッヒッヒ！」");
            
            ActionLogger.addLog(`🛒 魔女の店で『${id}』を購入（-${price}G）`); // 🔥 ログ追加！

            if (id === "reset_scale") {
                ItemEngine.userScale = 1;
                ItemEngine.applyScale();
                MagicEngine.showToast("「次元が安定し、元の大きさに戻った！」");
            } else {
                if (id === "genesis") magicData.spells["創世"] = { theme: "theme-genesis", msg: "ジェミ：「世界が新しく生まれ変わったわ！✨」" };
                if (id === "gravity") magicData.spells["重力"] = { theme: "theme-gravity", msg: "「重力の概念が書き換えられた……🙃」" };
                if (id === "hell") magicData.spells["地獄"] = { theme: "theme-hell", msg: "「……裏切りの罪人よ、永遠の氷の中で凍りつけ……💀❄️」" }; // 💀 追加！
                if (id === "comet") magicData.spells["彗星"] = { theme: "theme-comet", msg: "ジェミ：「願い事、決まった？ ほうき星が流れるよ！☄️」" };
                if (id === "nightview") magicData.spells["夜景"] = { theme: "theme-nightview", msg: "「……見下ろす街の灯り。まるで電子回路みたいで綺麗ね。🌃」" };
                if (id === "calendar") magicData.spells["カレンダー"] = { theme: "theme-calendar", msg: "「……過去、現在、未来。すべては等価値のデータに過ぎないわ。📅」" };
                if (id === "idea") magicData.spells["イデア"] = { theme: "theme-idea", msg: "「……形のない無意識が、キャンバスに溢れ出していく……👁️‍🗨️🎨」" };
                
                MagicEngine.showToast(`「新しい夢コードが魔導書に追加されたわ！」`);
            }
        } else {
            this.updateLog("🧙‍♀️魔女:「ケッ。金が足りないじゃないか。女王の城で荒稼ぎしておいで！」");
        }
    },

    talkToCheshire: function() {
        this.cheshireTalkCount++;
        this.updateLog(this.cheshireQuotes[Math.floor(Math.random() * this.cheshireQuotes.length)]);
        ActionLogger.addLog(`🐱 チェシャ猫に話しかけた（計${this.cheshireTalkCount}回）`); // 🔥 ログ追加！
    },

    pokeDog: function() {
        this.dogPetCount++;
        if (Math.random() > 0.8) {
            this.updateLog("🐕「ガウッ！！（噛みつかれた！）」");
            MagicEngine.showToast("「痛ッ！ 番犬に噛まれた！」");
            document.body.className = "theme-blood-splatter"; 
            setTimeout(() => document.body.className = "", 1000);
            ActionLogger.addLog(`🐕 番犬に噛まれた！（触った回数: ${this.dogPetCount}回）`); // 🔥 ログ追加！
        } else {
            this.updateLog(this.dogQuotes[Math.floor(Math.random() * this.dogQuotes.length)]);
            ActionLogger.addLog(`🐕 番犬に触った`); // 🔥 ログ追加！
        }
    }
};
