const RabbitEngine = {
    interval: null,

    startSpawning: function() {
        // 15秒ごとに白ウサギをチェック
        this.interval = setInterval(() => {
            if (document.getElementById("world-map").style.display === "block") {
                this.spawnRabbit();
            }
        }, 15000);
    },

    spawnRabbit: function() {
        const existing = document.getElementById("istj-rabbit");
        if (existing) existing.remove();

        const rabbit = document.createElement("div");
        rabbit.id = "istj-rabbit";
        rabbit.innerText = "🐇";
        rabbit.style.position = "absolute";
        rabbit.style.fontSize = "40px";
        rabbit.style.left = Math.random() * 80 + "vw";
        rabbit.style.top = Math.random() * 80 + "vh";
        rabbit.style.cursor = "pointer";
        rabbit.style.zIndex = "5";
        rabbit.style.transition = "0.2s";

        // 逃走機能
        rabbit.onmouseenter = () => {
            this.escape(rabbit);
        };

        // 捕獲機能
        rabbit.onclick = () => {
            ActionLogger.addLog(`🐇 白ウサギを捕獲しようとした`);
            MagicEngine.showToast("🐇「……私のスケジュールに『貴様に捕まる』というタスクは入っていません。離しなさい。」");
            rabbit.remove();
        };

        document.getElementById("world-map").appendChild(rabbit);

        // 5秒後に勝手に消える
        setTimeout(() => { if(rabbit) rabbit.remove(); }, 5000);
    },

    escape: function(el) {
        el.style.left = Math.random() * 80 + "vw";
        el.style.top = Math.random() * 80 + "vh";
        MagicEngine.showToast("🐇「遅刻だ！論理的に考えて時間が足りない！！」");
    }
};

// 実行開始
RabbitEngine.startSpawning();
