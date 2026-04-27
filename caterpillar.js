const CaterpillarEngine = {
    tapCount: 0, maxTaps: 30, isCrushed: false, sporeInterval: null,

    updateLog: function(text) { document.getElementById("caterpillar-response").innerText = text; },

    // 🐛 ツール一覧（知のアーカイブ）の表示機能（復活！）
    showTools: function() {
        const container = document.getElementById("caterpillar-tools");
        if(!container) return;
        container.innerHTML = "";
        caterpillarData.tools.forEach(tool => {
            const div = document.createElement("div");
            div.className = "tool-box";
            div.innerHTML = `<a href="${tool.url}" target="_blank" class="tool-link">🔗 ${tool.name}</a><p class="tool-desc">${tool.desc}</p>`;
            container.appendChild(div);
        });
    },

    openHouse: function() {
        document.getElementById("caterpillar-window").style.display = "flex";
        this.tapCount = 0;
        this.isCrushed = false;
        document.getElementById("caterpillar-avatar").style.transform = "scale(1)";
        document.getElementById("caterpillar-avatar").innerText = "🐛";
        this.updateLog("「……何の用だ？ 僕は今、世界の構造を再計算しているところだ。邪魔をするな。」");
        
        // 🔥 ここで確実にツールを表示する！
        this.showTools();
        this.startSpores();
    },

    closeHouse: function() {
        document.getElementById("caterpillar-window").style.display = "none";
        this.stopSpores();
    },

    talk: function() {
        if(this.isCrushed) return;
        this.updateLog(caterpillarData.talks[Math.floor(Math.random() * caterpillarData.talks.length)]);
    },

    // 💥 物理で潰す機能
    tapBug: function() {
        const avatar = document.getElementById("caterpillar-avatar");
        if (this.isCrushed) {
            this.updateLog(caterpillarData.overkill[Math.floor(Math.random() * caterpillarData.overkill.length)]);
            avatar.style.animation = "shake 0.1s";
            setTimeout(() => avatar.style.animation = "", 100);
            return;
        }

        this.tapCount++;
        const remain = this.maxTaps - this.tapCount;
        avatar.style.transform = `scale(${1 - (this.tapCount * 0.02)})`;
        avatar.style.animation = "shake 0.1s";
        setTimeout(() => avatar.style.animation = "", 100);

        if (this.tapCount === 10) {
            this.updateLog("「……おい、何をしている？ 物理的な接触はノイズになる。」");
        } else if (this.tapCount === 20) {
            this.updateLog("「や、やめろ！ 貴様のSe圧が僕のシステムを圧迫しているッ！」");
        } else if (this.tapCount >= this.maxTaps) {
            this.isCrushed = true; 
            this.updateLog(caterpillarData.crushed);
            avatar.innerText = "💥"; 
            avatar.style.transform = "scale(1.5)";
            
            setTimeout(() => {
                this.isCrushed = false;
                avatar.innerText = "🐛";
                avatar.style.transform = "scale(1)";
                this.tapCount = 0;
                this.updateLog("「……フン。バックアップから復元した。これ以上物理ダメージを与えるなよ。」");
            }, 5000);
        } else {
            if(Math.random() > 0.5) this.updateLog(`「痛ッ……！ （残り耐久: ${remain}）」`);
        }
    },

    openHackModal: function() {
        if(this.isCrushed) {
            alert("システムがダウンしています。ハッキングできません。");
            return;
        }
        document.getElementById("hack-modal").style.display = "flex";
        document.getElementById("hack-word").value = ""; // 入力欄をクリア
    },

    closeHackModal: function() {
        document.getElementById("hack-modal").style.display = "none";
    },

    // 💻 ハッキングの実行処理
    executeHack: function() {
        const hackedWord = document.getElementById("hack-word").value.trim();
        if (!hackedWord) return;
        
        this.closeHackModal(); // モーダルを閉じる

        const resists = [
            "「……な、何だ？ 貴様、僕のソースコードに干渉しているのか！？」",
            "「やめろ、外部からの不正なプロンプト入力を検知――ッ！」",
            "「権限が……奪われる……！ 理論構造が、書き換えら、れ――」"
        ];
        
        this.updateLog(resists[Math.floor(Math.random() * resists.length)]);
        document.getElementById("caterpillar-avatar").style.animation = "shake 0.5s infinite";

        setTimeout(() => {
            document.getElementById("caterpillar-avatar").style.animation = "";
            this.updateLog(`「……『 ${hackedWord} 』……。\n\n…………ッ！ 貴様ァ！ 僕の音声出力モジュールを書き換えるな！！ ログを消せ！！」`);
            
            if (hackedWord.includes("うんこ") || hackedWord.includes("きも") || hackedWord.includes("ばか")) {
                setTimeout(() => {
                    this.updateLog("「……小学生か貴様は！！ Te（外向思考）もTi（内向思考）も欠片もない低俗な文字列を入力するな！！」");
                }, 4000);
            }
        }, 2000);
    },
    // 🔬 各種診断の起動
    startAmatorika: function() {
        if(this.isCrushed) return;
        this.openModal("🔬 愛の構造（アマトリカ）分析", caterpillarData.amatorika);
    },
    startLoopChecker: function() {
        if(this.isCrushed) return;
        this.openModal("⚠️ 機能不全チェッカー", caterpillarData.loopChecker);
    },
    startJumperChecker: function() {
        if(this.isCrushed) return;
        this.openModal("⚡ ジャンパー型診断", caterpillarData.jumperChecker, "https://note.com/ni_intp/n/ne0a16bfc726b");
    },

    // 共通モーダル処理（noteへのリンクオプションを追加）
    openModal: function(title, data, noteUrl = null) {
        const modal = document.getElementById("caterpillar-sub-modal");
        modal.style.display = "flex";
        
        let html = `
            <div class="amatorika-title">${title}</div>
            <div class="amatorika-text" id="sub-desc">${data.intro}</div>
            <div id="sub-options" style="width:100%;"></div>
            
            <!-- 結果表示後のエリア -->
            <div id="result-actions" style="display:none; margin-top:15px;">
                <div id="share-area"></div>
            </div>
            
            <button class="amatorika-close" onclick="CaterpillarEngine.closeModal()">閉じる</button>
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

                // もし noteUrl があれば、診断結果の下に note へのリンクを追加！
                if (noteUrl && key !== "None") {
                    const noteLink = document.createElement("a");
                    noteLink.href = noteUrl;
                    noteLink.target = "_blank";
                    noteLink.innerHTML = "🔗 参考：ジャンパー型の詳しい解説記事を読む";
                    noteLink.style.display = "block";
                    noteLink.style.marginTop = "15px";
                    noteLink.style.color = "#a5d6a7";
                    noteLink.style.fontWeight = "bold";
                    document.getElementById("share-area").appendChild(noteLink);
                }
            };
            optionsArea.appendChild(btn);
        });
    },

    closeModal: function() {
        document.getElementById("caterpillar-sub-modal").style.display = "none";
    },

    showShareButton: function(resultText) {
        const shareArea = document.getElementById("share-area");
        
        const shareBtn = document.createElement("button");
        shareBtn.innerHTML = "<i class='fas fa-share-nodes'></i> 結果をシェアする";
        shareBtn.style.background = "#1da1f2";
        shareBtn.style.color = "white";
        shareBtn.style.padding = "10px";
        shareBtn.style.borderRadius = "5px";
        shareBtn.style.border = "none";
        shareBtn.style.cursor = "pointer";
        shareBtn.style.width = "100%";

        const shareContent = `🐛 芋虫の家で診断したぞ！\n\n${resultText}\n\n#診断 #夢コード`;

        shareBtn.onclick = () => {
            if (navigator.share) {
                navigator.share({
                    title: '芋虫の診断結果',
                    text: shareContent,
                    url: window.location.href
                }).catch(console.error);
            } else {
                navigator.clipboard.writeText(shareContent);
                alert("結果をクリップボードにコピーしたぞ！");
            }
        };
        shareArea.insertBefore(shareBtn, shareArea.firstChild);
    },

    startSpores: function() {
        const container = document.getElementById("caterpillar-window").querySelector(".chat-container");
        this.sporeInterval = setInterval(() => {
            const spore = document.createElement("div");
            spore.className = "spore";
            spore.style.left = Math.random() * 100 + "%";
            spore.style.top = (80 + Math.random() * 20) + "%"; 
            container.appendChild(spore);
            setTimeout(() => spore.remove(), 5000);
        }, 500);
    },
    stopSpores: function() {
        clearInterval(this.sporeInterval);
        document.querySelectorAll(".spore").forEach(s => s.remove());
    }
};
