const WitchEngine = {
    // 購入可能なアイテム（魔法コードの解禁）
    items: [
        { id: "reset_scale", name: "次元安定剤", price: 5000, desc: "巨大化や縮小をリセットして、元のサイズに戻るわよ。" },
        { id: "genesis", name: "秘文書：創世", price: 50000, desc: "プレミアム魔法『創世』が解禁されるわ。" },
        { id: "gravity", name: "秘文書：重力", price: 30000, desc: "プレミアム魔法『重力』が解禁されるわ。" }
    ],

    // 🐱 チェシャ猫（ENTP）のセリフ
    cheshireQuotes: [
        "🐱「どこへ行きたいかによるねぇ。道なんて、歩けば勝手にできるものさ。」",
        "🐱「君が正気かどうかなんて、僕にはわからない。だってお茶会の連中はみんな狂ってるんだから。」",
        "🐱「あのおばさん（魔女）の薬、たまに副作用でカエルになるから気をつけてねぇ。」"
    ],

    // 🐕 番犬（ISTJ）のセリフ
    dogQuotes: [
        "🐕「ウゥゥ……！（商品を触るなという警告）」",
        "🐕「ワンッ！（お前が怪しい動きをしたら噛み付くぞ）」",
        "🐕「……クゥン。（魔女に撫でられておとなしくなった）」"
    ],

    openShop: function() {
        MagicEngine.stopGiantBug();
        document.getElementById("witch-window").style.display = "flex";
        this.updateLog("🧙‍♀️魔女(INTJ):「ヒッヒッヒ……。良い魔法道具を揃えてるよ。」");
        this.showItems();
        CardEventEngine.updateMoneyHUD(); // 店を開いた時にお金を更新
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
                             <button onclick="WitchEngine.buyItem('${item.id}', ${item.price})" style="background:#7b1fa2; color:white; border:none; padding:5px 10px; border-radius:3px; cursor:pointer; margin-top:5px;">購入</button>`;
            list.appendChild(div);
        });
    },

    buyItem: function(id, price) {
        // 🔥 CardEventEngine.playerMoney を直接チェック
        if (CardEventEngine.playerMoney >= price) {
            CardEventEngine.playerMoney -= price;
            CardEventEngine.updateMoneyHUD(); // お金表示を更新
            this.updateLog("🧙‍♀️魔女:「毎度あり。……あんたの望む姿になれるといいねぇ、ヒッヒッヒ！」");
            
            // 🔥 買ったアイテムの効果！
            if (id === "reset_scale") {
                ItemEngine.userScale = 1;
                ItemEngine.applyScale(); // 🌟 これで体が元に戻る！
                MagicEngine.showToast("「次元が安定し、元の大きさに戻った！」");
            } else if (id === "genesis") {
                magicData.spells["創世"] = { theme: "theme-genesis", msg: "ジェミ：「世界が白く輝き、新しく生まれ変わったわ……！✨」" };
                MagicEngine.showToast("「魔法『創世』が解禁された！」");
            } else if (id === "gravity") {
                magicData.spells["重力"] = { theme: "theme-gravity", msg: "「重力の概念が歪み、世界が引き寄せられる……🙃🌀」" };
                MagicEngine.showToast("「魔法『重力』が解禁された！」");
            }
        } else {
            this.updateLog("🧙‍♀️魔女:「ケッ。金が足りないじゃないか。女王の城で荒稼ぎしておいで！」");
        }
    },

    // 🐱 チェシャ猫に話しかける
    talkToCheshire: function() {
        this.updateLog(this.cheshireQuotes[Math.floor(Math.random() * this.cheshireQuotes.length)]);
    },

    // 🐕 番犬に触る
    pokeDog: function() {
        if (Math.random() > 0.8) {
            this.updateLog("🐕「ガウッ！！（噛みつかれた！）」");
            MagicEngine.showToast("「痛ッ！ 番犬に噛まれた！」");
            document.body.className = "theme-blood-splatter"; // 噛まれて血が出るｗ
            setTimeout(() => document.body.className = "", 1000);
        } else {
            this.updateLog(this.dogQuotes[Math.floor(Math.random() * this.dogQuotes.length)]);
        }
    }
};
