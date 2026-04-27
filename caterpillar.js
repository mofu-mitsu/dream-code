const CaterpillarEngine = {
    tapCount: 0,
    maxTaps: 30, // 30回タップで潰れる

    updateLog: function(text) { 
        document.getElementById("caterpillar-response").innerText = text; 
    },

    openHouse: function() {
        document.getElementById("caterpillar-window").style.display = "flex";
        this.tapCount = 0; // 開くたびにリセット
        document.getElementById("caterpillar-avatar").style.transform = "scale(1)";
        this.updateLog("「……何の用だ？ 私は今、世界の構造を再計算しているところだ。邪魔をするな。」");
        this.showTools();
    },

    closeHouse: function() {
        document.getElementById("caterpillar-window").style.display = "none";
    },

    // 🗣 話しかける
    talk: function() {
        const msg = caterpillarData.talks[Math.floor(Math.random() * caterpillarData.talks.length)];
        this.updateLog(msg);
    },

    // 💥 SLE向け：芋虫をタップして潰す機能
    tapBug: function() {
        this.tapCount++;
        const avatar = document.getElementById("caterpillar-avatar");
        const remain = this.maxTaps - this.tapCount;

        // タップするたびに少しずつ潰れて（小さくなって）ブルブル震える
        avatar.style.transform = `scale(${1 - (this.tapCount * 0.03)})`;
        avatar.style.animation = "shake 0.1s";
        setTimeout(() => avatar.style.animation = "", 100);

        if (this.tapCount === 10) {
            this.updateLog("「……おい、何をしている？ 私に触れるな。物理的な接触はノイズになる。」");
        } else if (this.tapCount === 20) {
            this.updateLog("「や、やめろ！ 貴様のSe圧が私のシステムを圧迫しているッ！」");
        } else if (this.tapCount >= this.maxTaps) {
            this.updateLog(caterpillarData.crushed);
            avatar.innerText = "💥"; // 爆発！
            avatar.style.transform = "scale(1.5)";
            
            // 3秒後に怒って復活する
            setTimeout(() => {
                avatar.innerText = "🐛";
                avatar.style.transform = "scale(1)";
                this.tapCount = 0;
                this.updateLog("「……フン。バックアップから復元した。次やったら貴様のブラウザをクラッシュさせるぞ。」");
            }, 3000);
        } else {
            // ダメージ音的なちょっとした反応
            if(Math.random() > 0.5) this.updateLog(`「痛ッ……！ （残り耐久: ${remain}）」`);
        }
    },

    // 🔗 ツールのリンクを生成して表示
    showTools: function() {
        const container = document.getElementById("caterpillar-tools");
        container.innerHTML = ""; // 初期化

        caterpillarData.tools.forEach(tool => {
            const div = document.createElement("div");
            div.className = "tool-box";
            div.innerHTML = `
                <a href="${tool.url}" target="_blank" class="tool-link">🔗 ${tool.name}</a>
                <p class="tool-desc">${tool.desc}</p>
            `;
            container.appendChild(div);
        });
    }
};