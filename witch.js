const WitchEngine = {
    dogPetCount: 0,
    cheshireTalkCount: 0,

    items: [
        { id: "reset_scale", name: "次元安定剤", price: 5000, desc: "巨大化や縮小をリセットして、元のサイズに戻るわよ。" },
        { id: "genesis", name: "秘文書：創世", price: 50000, desc: "プレミアム魔法『創世』が解禁されるわ。" },
        { id: "gravity", name: "秘文書：重力", price: 30000, desc: "プレミアム魔法『重力』が解禁されるわ。" },
        // 💀 追加！
        { id: "hell", name: "禁書：コキュートス", price: 80000, desc: "プレミアム魔法『地獄』。最下層の氷地獄を呼び出すわ……。" }
    ],

    cheshireQuotes: [
        "🐱「どこへ行きたいかによるねぇ。道なんて、歩けば勝手にできるものさ。」",
        "🐱「君が正気かどうかなんて、僕にはわからない。だってお茶会の連中はみんな狂ってるんだから。」",
        "🐱「あのおばさん（魔女）の薬、たまに副作用でカエルになるから気をつけてねぇ。」"
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
