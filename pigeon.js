const PigeonEngine = {
    interval: null,

    start: function() {
        this.interval = setInterval(() => {
            if (document.getElementById("world-map-wrapper").style.display === "block") {
                this.spawnPigeon();
            }
        }, 20000); 
    },

    spawnPigeon: function() {
        const pigeon = document.createElement("div");
        pigeon.className = "pigeon-actor";
        pigeon.innerText = "🕊️";
        
        // 🔥 右端からスタート（絵文字の向きに合わせて左へ飛ぶ）
        pigeon.style.left = "110vw";
        pigeon.style.top = Math.random() * 80 + "vh";
        document.getElementById("world-map").appendChild(pigeon);

        // 左端へ飛ぶ
        setTimeout(() => {
            pigeon.style.left = "-200px";
        }, 100);

        pigeon.onclick = () => {
            ActionLogger.addLog(`🕊️ ハトをクリックした`);
            const scale = ItemEngine.userScale;
            let msg = "🕊️「クルッポー！（のどかな昼下がりだね）」";
            
            if (scale < 0.8) {
                msg = "🕊️「ひえっ！ 巨大な人間だ！ 卵を奪いに来たのか！？」";
            } else if (scale > 1.2) {
                msg = "🕊️「お前、そんなに小さくなって……さては蛇（ヘビ）だな！？ 私の卵を狙ってるんだろ！」";
            }
            
            MagicEngine.showToast(msg);
            pigeon.style.transition = "all 0.5s ease-in";
            pigeon.style.top = "-200px"; // 驚いて上に逃げる
        };

        setTimeout(() => pigeon.remove(), 6000);
    }
};

PigeonEngine.start();
