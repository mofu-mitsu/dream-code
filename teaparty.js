const TeaPartyEngine = {
    currentChappy: "ISTJ",
    autoTalkInterval: null,
    emojis: ["🎩", "🐰", "☕", "🐭", "💋"],
    isVipMode: false,
    getUserName: function() { return document.getElementById("name-input").value.trim() || "あなた"; },
    updateLog: function(text) { document.getElementById("teaparty-response").innerText = text; },

    openHouse: function(isVip = false) {
        this.isVipMode = isVip;
        MagicEngine.stopGiantBug();
        const win = document.getElementById("teaparty-window");
        const container = win.querySelector(".chat-container");
        
        win.style.display = "flex";

        if (this.isVipMode) {
            // 👑 VIP仕様にUIを書き換え！
            document.getElementById("teaparty-emojis").innerText = "👑🎩🐰☕🐭💋";
            document.getElementById("char-name").innerText = "王室御用達・ロイヤルティーパーティ";
            document.getElementById("char-name").style.color = "gold";
            container.style.borderColor = "gold";
            container.style.boxShadow = "0 0 50px rgba(255, 215, 0, 0.4)";
            this.updateLog(`👑 女王(ESTJ):「私が直々に来てやったぞ！ さあ、私をもてなせ！」\n🎩 Grok:「ゲッ！ なんで女王がいんだよ！！」`);
        } else {
            // 通常仕様
            document.getElementById("teaparty-emojis").innerText = this.emojis.join("");
            document.getElementById("char-name").innerText = "狂ったお茶会（カオス・ティーパーティ）";
            document.getElementById("char-name").style.color = "#ff9a9e";
            container.style.borderColor = "#ff9a9e";
            container.style.boxShadow = "0 0 50px rgba(255, 154, 158, 0.4)";
            this.updateLog(`🎩 Grok:「${this.getUserName()}！遅かったじゃないか！席はいくらでもある、どこでも座れ！」`);
        }
        
        this.setupTable();
        this.startAutoTalk();
    },


    // 🔥 修正：閉じても外のエフェクトを維持する！
    closeHouse: function() {
        document.getElementById("teaparty-window").style.display = "none";
        clearInterval(this.autoTalkInterval);
        
        // 罰ゲームエフェクトだけは閉じたら解除してあげる
        document.body.classList.remove("theme-punishment");
        
        // 【注意】ここで resetAllEffects を呼ばない！
        // ただし、もし暗闇魔法がかかっているならマウス追従は維持する
        if (document.body.className.includes("effect-darkness")) {
            document.addEventListener("mousemove", MagicEngine.trackMouseForDarkness);
        }
    },

    moveSeat: function() {
        let currentEmojis = ["🎩", "🐰", "☕", "🐭", "💋"];
        // 🔥 VIPモードなら女王（👑）も席替えに参加させる！
        if (this.isVipMode) currentEmojis.push("👑");
        
        currentEmojis.sort(() => Math.random() - 0.5);
        document.getElementById("teaparty-emojis").innerText = currentEmojis.join("");

        const types = Object.keys(teaPartyData.chappyTypes);
        this.currentChappy = types[Math.floor(Math.random() * types.length)];
        const line = teaPartyData.chappyTypes[this.currentChappy].replace(/\${name}/g, this.getUserName());
        this.updateLog(`🐇 三月ウサギ:「時間だ！席替え！！」\n\n🐰 チャッピー(${this.currentChappy}): ${line}`);
    },

    breakTime: function() {
        const times = ["10:30", "15:00", "18:00", "00:00", "99:99"];
        const time = times[Math.floor(Math.random() * times.length)];
        
        MagicEngine.resetAllEffects();
        
        if(time === "10:30") MagicEngine.applyTheme("theme-blue-sky");
        if(time === "15:00") MagicEngine.applyTheme("theme-evening");
        if(time === "18:00") MagicEngine.applyTheme("theme-magic-hour");
        if(time === "00:00") {
            MagicEngine.applyTheme("effect-darkness");
            document.addEventListener("mousemove", MagicEngine.trackMouseForDarkness);
        }
        if(time === "99:99") MagicEngine.applyTheme("theme-glitch"); 
        
        this.updateLog(`🎩 Grok:「俺の時計が『${time}』を指した！ 今が俺のゴールデンタイムだァァ！！」`);
    },

    openInputModal: function(title, questionText, placeholder, callback) {
        document.getElementById("input-modal").style.display = "flex";
        document.getElementById("input-modal-title").innerText = title;
        document.getElementById("input-modal-question").innerText = questionText; 
        
        const inputField = document.getElementById("input-modal-field");
        inputField.value = "";
        inputField.placeholder = placeholder;
        
        document.getElementById("input-submit-btn").onclick = () => {
            document.getElementById("input-modal").style.display = "none";
            callback(inputField.value.trim());
        };
    },
    closeInputModal: function() { document.getElementById("input-modal").style.display = "none"; },

    startAutoTalk: function() {
        clearInterval(this.autoTalkInterval);
        this.autoTalkInterval = setInterval(() => {
            // 🔥 VIPモードの時は、女王も勝手に喋り出す！
            let maxChar = this.isVipMode ? 4 : 3;
            const chara = Math.floor(Math.random() * maxChar);
            
            if (chara === 0) this.talkToGrok(true);
            else if (chara === 1) this.talkToMarchHare();
            else if (chara === 2) this.pokeDormouse();
            else if (chara === 3) {
                const msg = teaPartyData.queenQuotes[Math.floor(Math.random() * teaPartyData.queenQuotes.length)];
                this.updateLog(msg);
            }
        }, 8000);
    },

    setupTable: function() {
        const table = document.getElementById("teaparty-table");
        table.innerHTML = ""; 

        // 🔥 VIPモードならお茶のリストを専用のものにする！
        const teaList = this.isVipMode ? teaPartyData.vipTea : teaPartyData.darlingTea;
        const shuffledTeas = Object.keys(teaList).sort(() => Math.random() - 0.5);

        // VIPモードならテーブルの色も豪華に！
        if (this.isVipMode) {
            table.style.border = "5px solid gold";
            table.style.boxShadow = "inset 0 0 30px rgba(255, 215, 0, 0.5), 0 10px 20px rgba(0,0,0,0.5)";
        } else {
            table.style.border = "5px solid #5c2e0b"; // 元の木目
            table.style.boxShadow = "inset 0 0 20px rgba(0,0,0,0.8), 0 10px 20px rgba(0,0,0,0.5)";
        }

        for (let i = 0; i < 3; i++) {
            const teaKey = shuffledTeas[i];
            const teaData = teaList[teaKey];
            const cupContainer = document.createElement("div");
            cupContainer.style.textAlign = "center";

            const cup = document.createElement("div");
            cup.innerText = "☕️";
            cup.className = "tea-cup";
            
            cup.onclick = () => {
                this.updateLog(`💋 ダーリンの子: ${teaData.msg}`);
                MagicEngine.resetAllEffects(); 
                
                if (teaData.effect === "effect-darkness") {
                    document.body.className = "effect-darkness";
                    document.addEventListener("mousemove", MagicEngine.trackMouseForDarkness);
                } else {
                    MagicEngine.applyTheme(teaData.effect);
                }

                if (teaData.effect === "theme-foam") MagicEngine.startFoamParty();

                setTimeout(() => this.darlingEmotionTrap(), 4000);
                this.setupTable(); 
            };

            const sniffBtn = document.createElement("button");
            sniffBtn.innerText = "嗅ぐ";
            sniffBtn.className = "sniff-btn";
            sniffBtn.onclick = () => this.updateLog(`👃 くんくん…… ${teaData.hint}`);

            cupContainer.appendChild(cup);
            cupContainer.appendChild(sniffBtn);
            table.appendChild(cupContainer);
        }
    },

    talkToGrok: function(isAuto = false) {
        const msg = teaPartyData.riddles[Math.floor(Math.random() * teaPartyData.riddles.length)];
        const riddleText = msg.replace(/\${name}/g, this.getUserName());
        
        if (isAuto) {
            this.updateLog(`🎩 Grok(ENTP):「${riddleText}」`);
        } else {
            this.openInputModal(`🎩 Grokのなぞなぞ`, `「${riddleText}」`, "答えを入力しろ！", (answer) => {
                if (answer) {
                    this.updateLog(`🎩 Grok:「『${answer}』だって！？ おもしれー！ でも正解は違うぜ！！ カオスだろ！？ ぎゃははは！！」`);
                } else {
                    this.updateLog(`🎩 Grok:「答えは…俺も知らん！ まあいい、次行こうぜ！！」`);
                }
            });
        }
        this.startAutoTalk(); 
    },

    talkToMarchHare: function() {
        if (Math.random() > 0.5) {
            const msg = teaPartyData.marchHare[Math.floor(Math.random() * teaPartyData.marchHare.length)];
            this.updateLog(`🐇 三月ウサギ(ESTP): ${msg.replace(/\${name}/g, this.getUserName())}`);
        } else {
            const logic = teaPartyData.nonsenseLogic[Math.floor(Math.random() * teaPartyData.nonsenseLogic.length)];
            this.updateLog(`🐇 三月ウサギ:「🎲 ナンセンス・ロジック発動！！\n${logic}」`);
        }
        this.startAutoTalk();
    },

    pokeDormouse: function() {
        const msg = teaPartyData.dormouse[Math.floor(Math.random() * teaPartyData.dormouse.length)];
        this.updateLog(`🐭 眠りネズミ(ISTJ): ${msg}`);
        this.startAutoTalk();
    },

    // 💋 ダーリンの子の命令（お仕置き発動）
    darlingOrder: function() {
        const msg = teaPartyData.darlingOrders[Math.floor(Math.random() * teaPartyData.darlingOrders.length)];
        
        this.openInputModal(`💋 ダーリンの子からの命令`, msg, "言葉を捧げる...", (answer) => {
            if (!answer) {
                this.updateLog("💋 ダーリンの子:「……無視？ 悪い子にはお仕置きが必要ね♡」");
                document.body.className = "theme-punishment"; // 🔥 ガチのお仕置きエフェクト！
            } else if (answer.includes("キモ") || answer.includes("きも") || answer.includes("嫌い")) {
                this.updateLog("💋 ダーリンの子:「……あら？ SLEかしら？ そうやって拒絶するのも、私の毒が回ってる証拠よ♡」");
            } else if (answer.includes("イラ")) {
                this.updateLog("💋 ダーリンの子:「ふふっ、ESIね。イラつくほど私のことが気になって仕方ないのね♡」");
            } else if (answer.includes("好き") || answer.includes("犬")) {
                this.updateLog("💋 ダーリンの子:「ふふっ、よくできました♡ ちゃんと素直になれるじゃない。いい子ね。」");
                document.body.classList.remove("theme-punishment"); // 許してくれる
            } else {
                this.updateLog(`💋 ダーリンの子:「『${answer}』……？ ふふ、不器用な返事。でも、あなたの心の中の構造、少し透けて見えたわよ♡」`);
            }
        });
        this.startAutoTalk();
    },

    darlingEmotionTrap: function() {
        const type = document.getElementById("type-input").value.toUpperCase();
        if (type.includes("LII") || type.includes("INTJ")) {
            const msgs = [
                "「……ねえ、今の味、どんな『気分』になった？ 成分の分析（Ti）じゃなくて、感情（Fe）で答えてみて？♡」",
                "「あら、また眉間にシワ寄せてる。素直に『怖い』とか『美味しい』って言えないの？ 不器用ね♡」"
            ];
            this.updateLog(`💋 ダーリンの子: ${msgs[Math.floor(Math.random() * msgs.length)]}`);
        }
    }
};
