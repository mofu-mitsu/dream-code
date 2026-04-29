const ItemEngine = {
    interval: null,
    userScale: 1, // ユーザーの視点サイズ（1が標準）

    startSpawning: function() {
        this.interval = setInterval(() => {
            // 🔥 マップが表示されている時だけアイテムを出す！
            if (document.getElementById("world-map-wrapper").style.display === "block") {
                if (Math.random() > 0.5) this.spawnItem();
            }
        }, 12000); 
    },

    spawnItem: function() {
        // 古いアイテムがあれば消す
        const existing = document.getElementById("wonder-item");
        if (existing) existing.remove();

        const isCake = Math.random() > 0.5;
        const item = document.createElement("div");
        item.id = "wonder-item";
        item.className = "wonder-item";
        
        // Eat Me（ケーキ）か Drink Me（ポーション）
        item.innerText = isCake ? "🍰" : "🧪";
        item.title = isCake ? "Eat Me" : "Drink Me";
        
        item.style.left = Math.random() * 80 + 10 + "vw";
        item.style.top = Math.random() * 80 + 10 + "vh";

        item.onclick = () => {
            if (isCake) this.eatCake();
            else this.drinkPotion();
            item.remove(); // 食べたら消える
        };

        document.getElementById("world-map").appendChild(item);

        // 8秒後に誰かに食べられて消える
        setTimeout(() => {
            if(item && item.parentElement) {
                MagicEngine.showToast("🐁「……（ネズミがアイテムをかじって逃げていった）」");
                item.remove();
            }
        }, 8000);
    },

    // 🍰 ケーキを食べる（自分が巨大化 ＝ 画面が縮小）
    eatCake: function() {
        this.userScale -= 0.3; // 画面を小さくする
        this.applyScale();
        
        if (this.userScale === 1) {
            MagicEngine.showToast("ジェミ：「元の大きさに戻ったね！よかった！」");
        } else if (this.userScale < 0.4) {
            this.userScale = 0.4; // 限界値
            MagicEngine.showToast("🐛「貴様、デカくなりすぎだ。重力場が歪むぞッ！！」");
            document.body.className = "theme-invert"; // 逆さまになる罰ゲーム！
        } else {
            MagicEngine.showToast("「体が大きくなった！ 全部が小さく見える！」");
        }
    },

    // 🧪 ポーションを飲む（自分が縮小 ＝ 画面が巨大化）
    drinkPotion: function() {
        this.userScale += 0.5; // 画面を大きくする
        this.applyScale();
        
        if (this.userScale === 1) {
            MagicEngine.showToast("ジェミ：「元の大きさに戻ったね！よかった！」");
        } else if (this.userScale > 2.5) {
            this.userScale = 2.5; // 限界値
            MagicEngine.showToast("💋「……あら、小さくなりすぎて見えないわ。踏み潰しちゃおうかしら♡」");
            MagicEngine.startAbyssEffect(); // ミクロの深淵に落ちる！
        } else {
            MagicEngine.showToast("「体が縮んじゃった！ キノコが見上げるほどデカい！」");
        }
    },

    // 画面サイズを適用する
// items.js の applyScale 関数だけを以下のように書き換えてね！

    // 画面サイズを適用する
    applyScale: function() {
        const map = document.getElementById("world-map");
        
        // ズームイン（自分が縮む）時は、マップを2倍、3倍とデカくする
        map.style.transform = `scale(${this.userScale})`;
        
        // ズームアウト（自分がデカい）時は真ん中固定。
        // ズームイン（自分が小さい）時は、左上を起点にしてスクロール可能にする！
        if (this.userScale > 1) {
            map.style.transformOrigin = "top left";
            map.style.width = (100 * this.userScale) + "vw";
            map.style.height = (100 * this.userScale) + "vh";
        } else {
            map.style.transformOrigin = "center center";
            map.style.width = "100vw";
            map.style.height = "100vh";
        }
        
        // 元に戻ったらエフェクト解除
        if (this.userScale === 1) {
            document.body.className = "";
            const abyss = document.getElementById("abyss-overlay");
            if (abyss) abyss.remove();
        }
    }
};

// 実行開始
ItemEngine.startSpawning();