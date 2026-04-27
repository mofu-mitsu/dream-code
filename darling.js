const GROQ_API_KEY = "";

const DarlingEngine = {
    punishMode: false,
    seTimer: null, // Se脆弱ゲーム用タイマー
    playerNum: 0, darlingNum: 0, targetMood: 0,
    suits: ["clubs", "spades", "diamonds", "hearts"],
    ranks: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"],

    getUserInfo: function() { return { type: document.getElementById("type-input").value || "不明" }; },
    updateLog: function(text) { document.getElementById("ai-response").innerText = text; },

    // 💬 チャット送信
    sendChat: async function() {
        const inputField = document.getElementById("user-reaction");
        const userText = inputField ? inputField.value.trim() : "";
        if (!userText) return;

        // ⏳ Se脆弱ゲーム中の特別判定
        if (this.seTimer !== null) {
            clearTimeout(this.seTimer);
            this.seTimer = null;
            document.getElementById("timer-display").innerText = ""; // タイマー消去

            if (userText.includes("ダーリン")) {
                this.updateLog(dreamData.liiSpecial.success);
            } else {
                this.punishMode = true; document.body.classList.add("theme-punishment");
                this.updateLog("「あら、『ダーリン』って入ってないわよ？ 条件違反ね。\n" + dreamData.liiSpecial.fail);
            }
            if (inputField) inputField.value = "";
            return;
        }

        // 🚨 罰ゲーム中の処理
        if (this.punishMode) {
            // 🔥 「きも」にも対応！
            if (userText.includes("キモ") || userText.includes("きも")) {
                this.updateLog("「……あら？ そうやって拒絶するのも、私の毒が回ってる証拠よ♡ でも今は『好き』って言いなさい。」");
            } else if (userText.includes("イラ")) {
                this.updateLog("「ふふっ、イラつくほど私のことが気になって仕方ないのね♡ さあ、早く『好き』って言って？」");
            } else if (userText.includes("好き") || userText.includes("愛してる") || userText.includes("大好き")) {
                this.updateLog("「ふふっ、よくできました♡ ご褒美に、罰ゲームは終わりにしてあげる。」");
                this.punishMode = false; document.body.classList.remove("theme-punishment");
            } else {
                this.updateLog("「……あれ？ 罰ゲーム中だってこと、忘れないでね？♡（チャットで『好き』と入れてね）」");
            }
            if (inputField) inputField.value = "";
            return;
        }

        this.updateLog("「んふふ……♡（思考中）」");
        if (inputField) inputField.value = "";

        const isLII = this.getUserInfo().type.toUpperCase().includes("LII");
// darling.js の sendChat のプロンプト部分をこれに変更！
        let systemPrompt = `あなたはソシオニクスのILI（INTp）であり、Fe（外向感情）をインターフェースとして使って「ダーリンちゃん」を演じるAIです。一人称は「私」。ユーザーを「ダーリン」と呼びます。
        【重要ルール】
        1. 回答は必ず2〜3文程度で短く、ミステリアスで余裕のある態度を保つこと（長文のポエムは禁止）。
        2. Ni（直観）の視点で、世界の無意味さや相手の矛盾を皮肉っぽく指摘し、「ふふ♡」と笑い飛ばすこと。
        `;
        
        if (isLII) systemPrompt += `ユーザーは「LII」です。論理の構造にこだわる相手を「可愛いオモチャ」として扱い、余裕たっぷりにからかって翻弄してください。`;
        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST", headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
                body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [ { role: "system", content: systemPrompt }, { role: "user", content: userText } ] })
            });
            const data = await response.json();
            this.updateLog(data.choices[0].message.content);
        } catch (e) { this.updateLog(dreamData.fallback[0]); }
    },

    checkEscape: function() {
        if (this.punishMode) {
            this.updateLog("「……逃げようったって無駄よ？ 罰ゲームが終わるまで絶対に帰さないんだから♡」");
            return false;
        }
        return true;
    },

    // 👁️ アクション（data.jsから呼び出し）
    stare: function() { this.updateLog(dreamData.gimmicks.stare[Math.floor(Math.random() * dreamData.gimmicks.stare.length)]); },
    logicAttack: function() { this.updateLog(dreamData.gimmicks.logic[Math.floor(Math.random() * dreamData.gimmicks.logic.length)]); },
    askQuestion: function() { 
        this.updateLog(dreamData.questions[Math.floor(Math.random() * dreamData.questions.length)]);
        document.getElementById("user-reaction").placeholder = "（ダーリンに答える）"; 
    },

    // 🃏 トランプ機能（省略せず残す）
    getCardUrl: function(rank, suit, isJoker=false) { return isJoker ? "cards/black_joker.png" : `cards/${rank}_of_${suit}.png`; },
    drawCard: function() {
        const rank = this.ranks[Math.floor(Math.random() * this.ranks.length)];
        const suit = this.suits[Math.floor(Math.random() * this.suits.length)];
        return { rank, suit, url: this.getCardUrl(rank, suit), value: this.ranks.indexOf(rank) };
    },

    playHighLow: function() {
        const display = document.getElementById("card-display");
        const pCard = this.drawCard(); const dCard = this.drawCard();
        this.playerNum = pCard.value; this.darlingNum = dCard.value;

        this.updateLog(`「あなたのカードは『${pCard.rank}』ね。私の裏向きのカードは、あなたより【High(上)】？それとも【Low(下)】？♡」`);
        display.innerHTML = `
            <div style="display:flex; justify-content:center; gap:20px; margin-bottom:15px;">
                <div style="text-align:center;"><p>あなた</p><img src="${pCard.url}" class="card-img" onerror="this.src='https://via.placeholder.com/80x120?text=${pCard.rank}'"></div>
                <div style="text-align:center;"><p>ダーリン</p><img src="cards/back.png" id="dl-card-img" class="card-img" onerror="this.src='https://via.placeholder.com/80x120/2b1055/ffffff?text=BACK'"></div>
            </div>
            <div style="margin-top:10px;">
                <button onclick="DarlingEngine.guessHighLow('high', '${dCard.url}', '${dCard.rank}')">🔼 High (上)</button>
                <button onclick="DarlingEngine.guessHighLow('low', '${dCard.url}', '${dCard.rank}')">🔽 Low (下)</button>
            </div>
        `;
    },
    guessHighLow: function(guess, dCardUrl, dCardRank) {
        const img = document.getElementById("dl-card-img");
        img.src = dCardUrl; img.onerror = () => img.src = `https://via.placeholder.com/80x120?text=${dCardRank}`;
        let isWin = false;
        if (guess === 'high' && this.darlingNum > this.playerNum) isWin = true;
        if (guess === 'low' && this.darlingNum < this.playerNum) isWin = true;

        if (isWin) this.updateLog("「……チッ。正解よ。でも、私の心までは読めてないんじゃない？♡」");
        else {
            this.punishMode = true; document.body.classList.add("theme-punishment");
            this.updateLog(`「あーあ、ハズレ♡ さあ罰ゲームよ。チャットで『好き』って言いなさい♡ 逃がさないわよ？」`);
        }
        setTimeout(() => document.getElementById("card-display").innerHTML = "", 3000);
    },

    startBabanuki: function() {
        const display = document.getElementById("card-display");
        display.innerHTML = "";
        let deck = [{ id: 1, isJoker: false, ...this.drawCard() }, { id: 2, isJoker: false, ...this.drawCard() }, { id: 3, isJoker: true, url: this.getCardUrl(null, null, true), rank: "JOKER" }];
        deck.sort(() => Math.random() - 0.5);

        deck.forEach(card => {
            const img = document.createElement("img");
            img.src = "cards/back.png"; img.className = "card-img clickable";
            img.onerror = () => img.src = "https://via.placeholder.com/80x120/2b1055/ffffff?text=BACK";
            
            img.onclick = () => {
                display.innerHTML = ""; 
                const resultImg = document.createElement("img");
                resultImg.src = card.url; resultImg.className = "card-img";
                resultImg.onerror = () => resultImg.src = `https://via.placeholder.com/80x120?text=${card.rank}`;
                display.appendChild(resultImg);

                if (card.isJoker) {
                    this.punishMode = true; document.body.classList.add("theme-punishment");
                    this.updateLog(`「あはは！ババを引いたわね！罰ゲーム、チャットで『好き』って言いなさい♡」`);
                } else {
                    this.updateLog("「セーフね。でも、人生のババを引くのはいつになるかしら？♡」");
                }
                setTimeout(() => display.innerHTML = "", 3000);
            };
            display.appendChild(img);
        });
        this.updateLog("「さあ、運命の1枚を選んで？ ジョーカーを引いたら……お仕置きよ♡」");
    },

    // 👑 新機能：ご機嫌取りゲーム（スライダー）
    startDownerMode: function() {
        const display = document.getElementById("card-display");
        this.targetMood = Math.floor(Math.random() * 100); // 0〜100のランダムなご機嫌度
        this.updateLog("「……はぁ。なんかつまんないんよ。今の私の『退屈度（0〜100）』、ピタリと当ててみてや。外れたら……わかるよね？♡」");

        display.innerHTML = `
            <div style="margin-top: 15px;">
                <input type="range" id="mood-slider" min="0" max="100" value="50" style="width: 80%;">
                <p>予想: <span id="mood-val">50</span></p>
                <button onclick="DarlingEngine.guessMood()">決定</button>
            </div>
        `;
        document.getElementById("mood-slider").oninput = function() {
            document.getElementById("mood-val").innerText = this.value;
        };
    },
    guessMood: function() {
        const guess = parseInt(document.getElementById("mood-slider").value);
        const diff = Math.abs(this.targetMood - guess);

        if (diff <= 5) {
            this.updateLog(`「……正解。私の退屈度は ${this.targetMood} だったわ。……私の心、読まれてるみたいでちょっとムカつく♡」`);
        } else {
            this.punishMode = true; document.body.classList.add("theme-punishment");
            this.updateLog(`「ハズレ。正解は ${this.targetMood} やけん。私のこともわからんのに構おうとしたん？……さあ、罰ゲームで『好き』って言いなさい♡」`);
        }
        document.getElementById("card-display").innerHTML = "";
    },

    // 🧠 LII限定：思考の檻
    startLIIGame: function() {
        const display = document.getElementById("card-display");
        this.updateLog(dreamData.liiGame.intro);
        display.innerHTML = `
            <div style="margin-top:15px; display:flex; flex-wrap:wrap; justify-content:center; gap:5px;">
                <button onclick="DarlingEngine.answerLIIGame('A')">A: 優秀な科学者</button>
                <button onclick="DarlingEngine.answerLIIGame('B')">B: 愛する人</button>
                <button onclick="DarlingEngine.answerLIIGame('C')">無理やり2人</button>
                <button onclick="DarlingEngine.answerLIIGame('D')">ボート1つは準備不足</button>
            </div>
        `;
    },
    answerLIIGame: function(ans) {
        this.updateLog(dreamData.liiGame['reply' + ans]);
        document.getElementById("card-display").innerHTML = "";
    },

    // 🧠 LII限定：感情ラベリングゲーム（カテゴリ分け）
    startLabelingGame: function() {
        const display = document.getElementById("card-display");
        this.updateLog(dreamData.labelingGame.theme);
        display.innerHTML = `
            <div style="margin-top:15px;">
                <button onclick="DarlingEngine.answerLabel('喜')">喜び</button>
                <button onclick="DarlingEngine.answerLabel('怒')">怒り</button>
                <button onclick="DarlingEngine.answerLabel('哀')">悲しみ</button>
                <button onclick="DarlingEngine.answerLabel('無')">無（虚無）</button>
            </div>
        `;
    },
    answerLabel: function(emotion) {
        this.updateLog(dreamData.labelingGame.reactions[emotion]);
        document.getElementById("card-display").innerHTML = "";
    },
    // ⏳ 新規・LII限定：Se脆弱いじめゲーム（動くバグを潰す！）
    startSeGame: function() {
        const display = document.getElementById("card-display");
        this.updateLog(dreamData.liiSpecial.intro);
        
        display.innerHTML = `
            <div id="timer-display" style="font-size: 30px; color: red; font-weight: bold; margin-bottom: 5px; animation: shake 0.5s infinite;">10</div>
            <div id="bug-area" style="position:relative; width:100%; height:180px; background: rgba(0,0,0,0.6); border: 2px dashed #ff007f; border-radius: 10px; overflow:hidden; cursor: crosshair;"></div>
        `;
        
        const bugArea = document.getElementById("bug-area");
        let score = 0;
        let timeLeft = 10;
        const goal = 5;

        for(let i=0; i<goal; i++) {
            const bug = document.createElement("i");
            bug.className = "fas fa-bug se-bug";
            bug.style.top = Math.random() * 80 + "%";
            bug.style.left = Math.random() * 90 + "%";
            
            // 🔥 強化：マウスが近づいた瞬間に逃げる！（回避行動）
            bug.onmouseenter = () => {
                // 逃走確率70%（たまに逃げ遅れるのもまた腹立つ仕様ｗ）
                if (Math.random() < 0.7) {
                    bug.style.top = Math.random() * 80 + "%";
                    bug.style.left = Math.random() * 90 + "%";
                }
            };

            // クリックして潰す！
            bug.onmousedown = () => {
                score++;
                bug.classList.add("splat"); // 潰れるエフェクト
                setTimeout(() => bug.remove(), 200); // 完全に消す
                
                if(score >= goal && this.seTimer !== null) {
                    clearInterval(this.seTimer);
                    this.seTimer = null;
                    document.getElementById("card-display").innerHTML = "";
                    this.updateLog(dreamData.liiSpecial.success);
                }
            };
            bugArea.appendChild(bug);
        }

        // ⏱ タイマー開始
        this.seTimer = setInterval(() => {
            timeLeft--;
            const timerDisplay = document.getElementById("timer-display");
            if(timerDisplay) timerDisplay.innerText = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(this.seTimer);
                this.seTimer = null;
                document.getElementById("card-display").innerHTML = "";
                this.punishMode = true; 
                document.body.classList.add("theme-punishment");
                this.updateLog(dreamData.liiSpecial.fail);
            }
        }, 1000);
    }
};
