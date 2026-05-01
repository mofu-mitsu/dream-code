const ItemEngine = {
    interval: null,
    userScale: 1,
    theftTimer: null,

    startSpawning: function() {
        this.interval = setInterval(() => {
            const wrapper = document.getElementById("world-map-wrapper");
            if (wrapper && wrapper.style.display === "block" && !this.isAnyModalOpen()) {
                if (Math.random() > 0.5) this.spawnItem();
            }
        }, 15000); 
    },

// items.js の中
    isAnyModalOpen: function() {
        const modals = [
            "darling-window", "caterpillar-window", "teaparty-window", 
            "castle-modal", "reward-modal", "share-modal", 
            "library-window", "witch-window" // 🔥 書庫と魔女の店を追加！
        ];
        return modals.some(id => { 
            const el = document.getElementById(id); 
            // null回避と、displayがnoneじゃないかをチェック
            return el && window.getComputedStyle(el).display !== "none"; 
        });
    },

    spawnItem: function() {
        const existing = document.getElementById("wonder-item");
        if (existing) existing.remove();

        const isCake = Math.random() > 0.5;
        const item = document.createElement("div");
        item.id = "wonder-item";
        item.className = "wonder-item";
        item.innerText = isCake ? "🍰" : "🧪";
        
        const posX = Math.random() * 60 + 20 + "vw";
        const posY = Math.random() * 60 + 20 + "vh";
        item.style.left = posX;
        item.style.top = posY;

        item.onclick = () => {
            if (isCake) this.eatCake();
            else this.drinkPotion();
            item.remove();
            if(this.theftTimer) { clearTimeout(this.theftTimer); this.theftTimer = null; }
        };

        document.getElementById("world-map").appendChild(item);
        setTimeout(() => { if (item && item.parentElement) this.sendSquirrel(item); }, 2000);
    },

    sendSquirrel: function(item) {
        const squirrel = document.createElement("div");
        squirrel.className = "squirrel-actor";
        squirrel.innerText = "🐿️";
        squirrel.style.left = "110vw";
        squirrel.style.top = item.style.top;
        document.getElementById("world-map").appendChild(squirrel);

        setTimeout(() => { squirrel.style.left = item.style.left; }, 100);

        let hasStolen = false; // 🔥 「もう盗んだ後か？」のフラグ

        // 🐿️ リスのクリック判定
        squirrel.onclick = () => {
            ActionLogger.addLog(`🐿️ リスをクリックした`);
            if (hasStolen) {
                // 🔥 盗んだ後なら手遅れ
                MagicEngine.showToast("🐿️「キッキッ！！（もうボクの獲物だもんね！）」");
                return;
            }

            // 盗む前なら阻止成功！
            if(this.theftTimer) { clearTimeout(this.theftTimer); this.theftTimer = null; }
            hasStolen = true; // 処理済みフラグ
            squirrel.classList.add("scared");
            MagicEngine.showToast("🐿️「キッ！？（驚いてアイテムを諦めた！）」");
            squirrel.style.left = "-200px"; 
            setTimeout(() => squirrel.remove(), 2000);
        };

        // 5秒間の強奪タイマー
        this.theftTimer = setTimeout(() => {
            if (item && item.parentElement) {
                item.remove(); // アイテム消去
                hasStolen = true; // 🔥 ここでフラグを立てる！
                squirrel.innerText = "🐿️✨"; 
                squirrel.style.left = "-200px"; 
                MagicEngine.showToast("🐿️「……（リスがアイテムをかじって逃げていった！）」");
                setTimeout(() => { if(squirrel) squirrel.remove(); }, 2000);
            }
        }, 5000);
    },

    // 🍰 巨大化：画面を縮小する (0.5刻みで相殺しやすく)
    eatCake: function() {
        ActionLogger.addLog(`🍰 ケーキを食べて巨大化した`);
        this.userScale -= 0.5;
        this.applyScale();
        if (this.userScale <= 0.5) {
            MagicEngine.showToast("「体が大きくなった！ 全部が小さく見える！」");
        }
    },

    // 🧪 縮小：画面を拡大する
    drinkPotion: function() {
        ActionLogger.addLog(`🧪 ポーションを飲んで縮小化した`);
        this.userScale += 0.5;
        this.applyScale();
        if (this.userScale >= 1.5) {
            MagicEngine.showToast("「体が縮んじゃった！ 世界がデカい！」");
        }
    },

    applyScale: function() {
        const map = document.getElementById("world-map");
        
        // 🔥 相殺リセットの吸着ロジック
        if (this.userScale > 0.9 && this.userScale < 1.1) {
            this.userScale = 1.0;
            MagicEngine.showToast("ジェミ：「あ！元の大きさに戻ったね！✨」");
        }

        // 限界値の設定
        if (this.userScale < 0.5) {
            this.userScale = 0.5;
            MagicEngine.showToast("🐛「貴様、デカくなりすぎだ。重力場が歪むぞッ！！」");
            document.body.className = "theme-invert";
        }
        if (this.userScale > 2.5) {
            this.userScale = 2.5;
            MagicEngine.showToast("💋「……あら、小さくなりすぎて見えないわ。踏み潰しちゃおうかしら♡」");
            MagicEngine.startAbyssEffect();
        }

        map.style.transform = `scale(${this.userScale})`;
        
        if (this.userScale > 1) {
            map.style.transformOrigin = "top left";
            map.style.width = (100 * this.userScale) + "vw";
            map.style.height = (100 * this.userScale) + "vh";
        } else {
            map.style.transformOrigin = "center center";
            map.style.width = "100vw";
            map.style.height = "100vh";
        }

        // 1の時は特殊エフェクト全解除
        if (this.userScale === 1.0) {
            document.body.className = "";
            const abyss = document.getElementById("abyss-overlay");
            if (abyss) abyss.remove();
        }
    }
};

ItemEngine.startSpawning();
