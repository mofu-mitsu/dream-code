const CaterpillarEngine = {
    tapCount: 0, totalTapCount: 0, maxTaps: 30, isCrushed: false, sporeInterval: null,

    updateLog: function(text) { document.getElementById("caterpillar-response").innerText = text; },

    openHouse: function() {
        MagicEngine.stopGiantBug();
        document.getElementById("caterpillar-window").style.display = "flex";
        this.tapCount = 0; this.isCrushed = false;
        document.getElementById("caterpillar-avatar").style.transform = "scale(1)";
        document.getElementById("caterpillar-avatar").innerText = "🐛";
        this.updateLog("「……何の用だ？ 僕は今、世界の構造を再計算しているところだ。邪魔をするな。」");
        this.showTools();
        this.startSpores();
        
        // 🔥 行動ログ追加！
        if (typeof ActionLogger !== 'undefined') ActionLogger.addLog("🍄 芋虫の家に入室した");
    },

    closeHouse: function() {
        document.getElementById("caterpillar-window").style.display = "none";
        this.stopSpores();
        if (this.totalTapCount > 0 && !this.isCrushed) {
            if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`🐛 芋虫を合計【${this.totalTapCount}回】タップした`);
        }
    },

    talk: function() {
        if(this.isCrushed) return;
        const msg = caterpillarData.talks[Math.floor(Math.random() * caterpillarData.talks.length)];
        this.updateLog(msg);
        
        // 🔥 行動ログ追加！
        if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`🗣️ 芋虫に話しかけた: ${msg.substring(0, 15)}...`);
    },

    tapBug: function() {
        const avatar = document.getElementById("caterpillar-avatar");
        if (this.isCrushed) {
            this.updateLog(caterpillarData.overkill[Math.floor(Math.random() * caterpillarData.overkill.length)]);
            avatar.style.animation = "shake 0.1s"; setTimeout(() => avatar.style.animation = "", 100);
            return;
        }

        this.tapCount++;
        this.totalTapCount++; // 🔥 タップするたびに総回数をプラス
        const remain = this.maxTaps - this.tapCount;

        avatar.style.transform = `scale(${1 - (this.tapCount * 0.02)})`;
        avatar.style.animation = "shake 0.1s"; setTimeout(() => avatar.style.animation = "", 100);

        if (this.tapCount === 10) this.updateLog("「……おい、何をしている？ 物理的な接触はノイズになる。」");
        else if (this.tapCount === 20) this.updateLog("「や、やめろ！ 貴様のSe圧が僕のシステムを圧迫しているッ！」");
        else if (this.tapCount >= this.maxTaps) {
            this.isCrushed = true; 
            this.updateLog(caterpillarData.crushed);
            avatar.innerText = "💥"; avatar.style.transform = "scale(1.5)";
            
            // 🔥 爆発した時も記録！
            if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`💥 芋虫を${this.totalTapCount}回タップして爆散させた！`);

            setTimeout(() => {
                this.isCrushed = false; avatar.innerText = "🐛"; avatar.style.transform = "scale(1)"; 
                this.tapCount = 0; // 内部の耐久度はリセットするが、totalTapCountは維持
                this.updateLog("「……フン。バックアップから復元した。これ以上物理ダメージを与えるなよ。」");
            }, 5000);
        } else {
            if(Math.random() > 0.5) this.updateLog(`「痛ッ……！ （残り耐久: ${remain}）」`);
        }
    },

    openHackModal: function() {
        if(this.isCrushed) { alert("システムがダウンしています。ハッキングできません。"); return; }
        document.getElementById("hack-modal").style.display = "flex";
        document.getElementById("hack-word").value = ""; 
    },
    closeHackModal: function() { document.getElementById("hack-modal").style.display = "none"; },

    executeHack: function() {
        const hackedWord = document.getElementById("hack-word").value.trim();
        if (!hackedWord) return;
        this.closeHackModal(); 
        
        // 🔥 行動ログ追加！
        if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`💻 芋虫をハッキングして『${hackedWord}』と言わせた`);

        const resists = ["「……な、何だ？ 貴様、僕のソースコードに干渉しているのか！？」", "「やめろ、外部からの不正なプロンプト入力を検知――ッ！」"];
        this.updateLog(resists[Math.floor(Math.random() * resists.length)]);
        document.getElementById("caterpillar-avatar").style.animation = "shake 0.5s infinite";

        setTimeout(() => {
            document.getElementById("caterpillar-avatar").style.animation = "";
            this.updateLog(`「……『 ${hackedWord} 』……。\n\n…………ッ！ 貴様ァ！ 僕の音声出力モジュールを書き換えるな！！」`);
            if (hackedWord.includes("うんこ") || hackedWord.includes("きも") || hackedWord.includes("ばか")) {
                setTimeout(() => this.updateLog("「……小学生か貴様は！！ 低俗な文字列を入力するな！！」"), 4000);
            }
        }, 2000);
    },

    // 🔬 アマトリカ診断等の呼び出し
    startAmatorika: function() { if(!this.isCrushed) this.openModal("🔬 愛の構造（アマトリカ）分析", caterpillarData.amatorika, "amatorika"); },
    startLoopChecker: function() { if(!this.isCrushed) this.openModal("⚠️ 機能不全チェッカー", caterpillarData.loopChecker, "loop"); },
    startJumperChecker: function() { if(!this.isCrushed) this.openModal("⚡ ジャンパー型診断", caterpillarData.jumperChecker, "jumper", "https://note.com/ni_intp/n/ne0a16bfc726b"); },

    // 🎯 エラー修正版・共通モーダル構築関数
// caterpillar.js 内の openModal 関数だけ書き換え！

    openModal: function(title, data, typeName, noteUrl = null) {
        const modal = document.getElementById("caterpillar-sub-modal");
        modal.style.display = "flex";
        
        // 🔥 中にスクロール専用のdiv（caterpillar-sub-content）を作る！
        let html = `
            <div class="caterpillar-sub-content">
                <div class="amatorika-title">${title}</div>
                <div class="amatorika-text" id="sub-desc">${data.intro}</div>
                <div id="sub-options" style="width:100%;"></div>
                <div id="result-actions" style="display:none; margin-top:15px;"><div id="share-area"></div></div>
                <button class="amatorika-close" onclick="CaterpillarEngine.closeModal()" style="margin-top:15px;">閉じる</button>
            </div>
        `;
        modal.innerHTML = html;

        const optionsArea = document.getElementById("sub-options");
        Object.keys(data.options).forEach(key => {
            const btn = document.createElement("button");
            btn.className = "amatorika-btn";
            btn.innerHTML = `<b>【${key}】</b><br>${data.options[key]}`;
            btn.onclick = () => {
                const resultText = data.results[key];
                document.getElementById("sub-desc").innerText = resultText;
                optionsArea.innerHTML = ""; 
                document.getElementById("result-actions").style.display = "block";
                this.showShareButton(resultText);

                if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`🔬 診断[${typeName}]: 『${key}』を選択した`);

                if (noteUrl && key !== "None" && key !== "E") {
                    const noteLink = document.createElement("a");
                    noteLink.href = noteUrl; noteLink.target = "_blank";
                    noteLink.innerHTML = "🔗 参考：詳しい解説記事を読む";
                    noteLink.style.display = "block"; noteLink.style.marginTop = "15px"; noteLink.style.color = "#a5d6a7";
                    document.getElementById("share-area").appendChild(noteLink);
                }
            };
            optionsArea.appendChild(btn);
        });
    },

    closeModal: function() { document.getElementById("caterpillar-sub-modal").style.display = "none"; },

    showShareButton: function(resultText) {
        const shareArea = document.getElementById("share-area");
        shareArea.innerHTML = ""; // 初期化
        const shareBtn = document.createElement("button");
        shareBtn.innerHTML = "<i class='fas fa-share-nodes'></i> 結果をシェアする";
        shareBtn.style = "background: #1da1f2; color: white; padding: 10px; border-radius: 5px; border: none; cursor: pointer; width: 100%; font-weight:bold;";
        
        const shareContent = `🐛 芋虫の家で診断したぞ！\n\n${resultText}\n\n#夢コード #MBTI\nhttps://mofu-mitsu.github.io/dream-code`;

        shareBtn.onclick = () => {
            if (navigator.share) navigator.share({ text: shareContent }).catch(console.error);
            else { navigator.clipboard.writeText(shareContent); alert("コピーしたぞ！"); }
        };
        shareArea.appendChild(shareBtn);
    },

    showTools: function() {
        const container = document.getElementById("caterpillar-tools");
        if(!container) return;
        container.innerHTML = "";
        caterpillarData.tools.forEach(tool => {
            const div = document.createElement("div"); div.className = "tool-box"; div.style.borderColor = "#4caf50";
            div.innerHTML = `<a href="${tool.url}" target="_blank" class="tool-link">🔗 ${tool.name}</a><p class="tool-desc">${tool.desc}</p>`;
            container.appendChild(div);
        });
    },

    startSpores: function() {
        const container = document.getElementById("caterpillar-window").querySelector(".chat-container");
        this.sporeInterval = setInterval(() => {
            const spore = document.createElement("div"); spore.className = "spore";
            spore.style.left = Math.random() * 100 + "%"; spore.style.top = (80 + Math.random() * 20) + "%"; 
            container.appendChild(spore); setTimeout(() => spore.remove(), 5000);
        }, 500);
    },
    stopSpores: function() { clearInterval(this.sporeInterval); document.querySelectorAll(".spore").forEach(s => s.remove()); }
};
