const WitchEngine = {
    items: [
        { id: "reset_scale", name: "次元安定剤", price: 5000, desc: "巨大化や縮小をリセットして、元のサイズに戻るわよ。" },
        { id: "code_genesis", name: "秘文書：創世", price: 50000, desc: "プレミアム魔法『創世』が解禁されるわ。" },
        { id: "code_gravity", name: "秘文書：重力", price: 30000, desc: "プレミアム魔法『重力』が解禁されるわ。" }
    ],

    openShop: function() {
        MagicEngine.stopGiantBug();
        document.getElementById("witch-window").style.display = "flex";
        this.updateLog("🧙‍♀️魔女:「ヒッヒッヒ……。女王の金をくすねてきたのかい？ 良い魔法道具を揃えてるよ。」");
        this.showItems();
    },

    closeShop: function() { document.getElementById("witch-window").style.display = "none"; },
    updateLog: function(text) { document.getElementById("witch-response").innerText = text; },

    showItems: function() {
        const list = document.getElementById("witch-shop-list");
        list.innerHTML = "";
        this.items.forEach(item => {
            const div = document.createElement("div");
            div.className = "tool-box"; div.style.borderColor = "#9c27b0";
            div.innerHTML = `<b>${item.name}</b> (${item.price} G)<br><small>${item.desc}</small><br>
                             <button onclick="WitchEngine.buyItem('${item.id}', ${item.price})" style="background:#7b1fa2; font-size:12px; margin-top:5px;">購入する</button>`;
            list.appendChild(div);
        });
    },

    buyItem: function(id, price) {
        if (CardEventEngine.playerMoney >= price) {
            CardEventEngine.playerMoney -= price;
            CardEventEngine.updateMoneyHUD();
            this.updateLog("🧙‍♀️魔女:「毎度あり。……あんたの望む姿になれるといいねぇ、ヒッヒッヒ！」");
            
            // アイテム効果
            if (id === "reset_scale") {
                ItemEngine.userScale = 1;
                ItemEngine.applyScale();
                MagicEngine.showToast("「次元が安定し、元の大きさに戻った！」");
            }
            if (id.startsWith("code_")) {
                const codeName = id.replace("code_", "");
                MagicEngine.showToast(`「特別な魔法『${codeName}』が使えるようになったわ！」`);
            }
        } else {
            this.updateLog("🧙‍♀️魔女:「ケッ。金が足りないじゃないか。女王の城で荒稼ぎしておいで！」");
        }
    }
};