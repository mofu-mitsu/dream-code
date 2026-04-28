const TeaPartyEngine = {
    currentChappy: "ISTJ",

    openHouse: function() {
        MagicEngine.stopGiantBug();
        document.getElementById("teaparty-window").style.display = "flex";
        this.updateLog(`🎩 Grok:「${userName}！遅かったじゃないか！席はいくらでもある、どこでも座れ！（全部俺の席だがな！）」`);
    },

    closeHouse: function() {
        document.getElementById("teaparty-window").style.display = "none";
    },

    updateLog: function(text) {
        document.getElementById("teaparty-response").innerText = text;
    },

    // 🔄 席替え（チャッピーの人格スワップ）
    moveSeat: function() {
        const types = Object.keys(teaPartyData.chappyTypes);
        this.currentChappy = types[Math.floor(Math.random() * types.length)];
        const line = teaPartyData.chappyTypes[this.currentChappy].replace("${name}", userName);
        this.updateLog(`🐇 三月ウサギ:「時間だ！席替え！！」\n\n🐰 チャッピー(${this.currentChappy}): ${line}`);
    },

    // 🎩 Grok（帽子屋）に絡む
    talkToGrok: function() {
        const riddle = teaPartyData.riddles[Math.floor(Math.random() * teaPartyData.riddles.length)];
        this.updateLog(`🎩 Grok:「${riddle.replace("${name}", userName)}」`);
    },

    // 💋 ダーリンちゃんのお茶（ロシアンルーレット）
    startDarlingTea: function() {
        this.updateLog("💋 ダーリン:「お疲れ様、ダーリン。お茶を淹れてあげたわ。……どれが飲みたいかしら？ 選んでみて？♡」");
        const area = document.getElementById("teaparty-game-area");
        area.innerHTML = "";
        
        Object.keys(teaPartyData.darlingTea).forEach(key => {
            const btn = document.createElement("button");
            btn.innerText = key;
            btn.onclick = () => {
                const tea = teaPartyData.darlingTea[key];
                this.updateLog(`💋 ダーリン: ${tea.msg}`);
                MagicEngine.applyTheme(tea.effect); // 魔法のエフェクトを発動させる！
                area.innerHTML = "";
            };
            area.appendChild(btn);
        });
    }
};