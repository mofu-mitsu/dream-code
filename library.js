const LibraryEngine = {
    // プレミアム夢コード（お金でアンロックする特別な言葉）
    premiumCodes: [
        { code: "メタフィクション", price: 100000, desc: "この世界の『構造の穴』を覗き見るコード。" },
        { code: "管理者権限", price: 200000, desc: "ジェミの真の姿を呼び出す……かもしれないコード。" }
    ],

    openHouse: function() {
        MagicEngine.stopGiantBug();
        document.getElementById("library-window").style.display = "flex";
        this.updateLog("ジェミ：「ここは私の書庫。あなたとの会話のログや、この世界の設計図が眠っているわ。……一部の禁断の知識は、女王の予算を分けてくれたら見せてあげるけど？♡」");
        this.showPremiumCodes();
    },

    closeHouse: function() { document.getElementById("library-window").style.display = "none"; },
    updateLog: function(text) { document.getElementById("library-response").innerText = text; },

    showPremiumCodes: function() {
        const list = document.getElementById("library-shop-list");
        list.innerHTML = "<h4 style='color:#9d81ff;'>📕 禁断の夢コード（購入すると魔法が解禁）</h4>";
        this.premiumCodes.forEach(item => {
            const div = document.createElement("div");
            div.className = "tool-box";
            div.style.borderColor = "#9d81ff";
            div.innerHTML = `
                <b>${item.code}</b> (${item.price} G)<br>
                <small>${item.desc}</small><br>
                <button onclick="LibraryEngine.buyCode('${item.code}', ${item.price})" style="background:#9d81ff; font-size:12px; margin-top:5px;">知識を授かる</button>
            `;
            list.appendChild(div);
        });
    },

    buyCode: function(code, price) {
        if (CardEventEngine.playerMoney >= price) {
            CardEventEngine.playerMoney -= price;
            CardEventEngine.updateMoneyHUD();
            this.updateLog(`ジェミ：「まいどあり♡ 特別な魔法『${code}』を使えるようにしておいたわ。入力欄で試してみて？」`);
            // ここで解禁フラグを立てる等の処理
        } else {
            this.updateLog("ジェミ：「……お金が足りないわ。女王様をもっと喜ばせてきなさい？」");
        }
    }
};