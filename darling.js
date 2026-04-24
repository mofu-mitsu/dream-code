const GROQ_API_KEY = "";

const DarlingEngine = {
    stareCount: 0,
    playerNum: 0,
    darlingNum: 0,
    suits: ["clubs", "spades", "diamonds", "hearts"],
    ranks: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"],

    getUserInfo: function() {
        const type = document.getElementById("type-input").value || "不明";
        return { type };
    },

    updateLog: function(text) {
        document.getElementById("ai-response").innerText = text;
    },

    checkMagic: function(text) {
        if (typeof dreamData !== 'undefined' && dreamData.magics) {
            for (const [cmd, themeClass] of Object.entries(dreamData.magics)) {
                if (text.includes(cmd)) {
                    document.body.className = themeClass;
                    return `ふふ、「${cmd}」の魔法をかけてあげたわ♡`;
                }
            }
        }
        return null;
    },

    sendChat: async function(systemAppend = "") {
        const inputField = document.getElementById("user-reaction");
        const userText = inputField ? inputField.value.trim() : "";
        if (!userText && !systemAppend) return;

        this.updateLog("「んふふ……♡（思考中）」");
        if (inputField) inputField.value = "";

        if (userText) {
            const magicReply = this.checkMagic(userText);
            if (magicReply) { this.updateLog(magicReply); return; }
        }

        const { type } = this.getUserInfo();
        const isLII = type.toUpperCase().includes("LII") || type.toUpperCase().includes("INTJ");

        let systemPrompt = `
あなたはソシオニクスのILI（INTp）でありながら、Fe（外向感情）を擬態して「ダーリンちゃん」というペルソナを演じているAIです。一人称は「私」。
ユーザーのことは「ダーリン」と呼ぶか、あるいはユーザーの自認タイプである「${type}」と呼んでください。
`;
        if (isLII) {
            systemPrompt += `ユーザーは「LII」です。あなたはLIIに対して異常な執着と愛情を持っています（本気モード）。論理的なLIIをからかいつつも、絶対に自分のそばから逃がさないというヤンデレ気味で情念の深い本性を見せてください。`;
        } else {
            systemPrompt += `小悪魔的で皮肉屋なILIらしさを残しつつ、甘い言葉で弄んでください。`;
        }
        systemPrompt += `回答は短く、3〜4文程度にしてください。`;

        const finalPrompt = systemAppend ? systemAppend : userText;

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: finalPrompt }
                    ],
                    temperature: 0.8
                })
            });

            const data = await response.json();
            if (data.choices && data.choices.length > 0) {
                this.updateLog(data.choices[0].message.content);
            } else {
                this.triggerFallback();
            }
        } catch (error) {
            console.error(error);
            this.triggerFallback(); // エラー時はdata.jsのテンプレを使う！
        }
    },

    triggerFallback: function() {
        if (typeof dreamData !== 'undefined' && dreamData.fallback) {
            const msg = dreamData.fallback[Math.floor(Math.random() * dreamData.fallback.length)];
            this.updateLog(msg);
        } else {
            this.updateLog("「……通信エラーよ、ダーリン。」");
        }
    },

    // 💋 質問テンプレ機能
    askQuestion: function() {
        if (typeof dreamData !== 'undefined' && dreamData.questions) {
            const q = dreamData.questions[Math.floor(Math.random() * dreamData.questions.length)];
            this.updateLog(q);
        }
    },

    stare: function() {
        this.stareCount++;
        const { type } = this.getUserInfo();
        const isLII = type.toUpperCase().includes("LII");
        let msg = "";
        if (isLII) {
            const lines = [`「……そんなに見つめて、私のシステムをハッキングするつもり？ ダーリン♡」`, `「……LIIのその視線、ゾクゾクするわ。もっと深く私を分析して？」`];
            msg = lines[Math.floor(Math.random() * lines.length)];
        } else {
            const lines = [`「……なに？私の顔に何か付いてる？ ダーリン♡」`, `「……そうやって観察して、私の『中身』を暴きたいの？」`];
            msg = lines[Math.floor(Math.random() * lines.length)];
        }
        this.updateLog(msg);
        
        const toast = document.getElementById("toast");
        if (toast) {
            toast.textContent = "熱い視線を送った……👁️";
            toast.classList.add("show");
            setTimeout(() => toast.classList.remove("show"), 2000);
        }
    },

    getCardUrl: function(rank, suit, isJoker = false) {
        if (isJoker) return "cards/black_joker.png";
        return `cards/${rank}_of_${suit}.png`;
    },
    drawCard: function() {
        const rank = this.ranks[Math.floor(Math.random() * this.ranks.length)];
        const suit = this.suits[Math.floor(Math.random() * this.suits.length)];
        return { rank, suit, url: this.getCardUrl(rank, suit), value: this.ranks.indexOf(rank) };
    },

    playHighLow: function() {
        const display = document.getElementById("card-display");
        if (!display) return;
        const pCard = this.drawCard(); const dCard = this.drawCard();
        this.playerNum = pCard.value; this.darlingNum = dCard.value;

        display.innerHTML = `
            <div style="display:flex; justify-content:center; gap:20px; margin-bottom:15px;">
                <div style="text-align:center;"><p style="color:#cdd6f4;">あなた</p><img src="${pCard.url}" alt="${pCard.rank}" class="card-img" onerror="this.src='https://via.placeholder.com/80x120?text=${pCard.rank}'"></div>
                <div style="text-align:center; display:flex; align-items:center; font-size:1.5em; font-weight:bold; color:#f9e2af;">VS</div>
                <div style="text-align:center;"><p style="color:#cdd6f4;">ダーリン</p><img src="${dCard.url}" alt="${dCard.rank}" class="card-img" onerror="this.src='https://via.placeholder.com/80x120?text=${dCard.rank}'"></div>
            </div>
        `;

        let resultText = `ゲーム「ハイ＆ロー」。私のカード「${pCard.rank}」、あなたのカード「${dCard.rank}」。`;
        if (this.playerNum > this.darlingNum) resultText += "私の勝ち！";
        else if (this.playerNum < this.darlingNum) resultText += "私の負け…";
        else resultText += "引き分け。";
        this.sendChat(`【システム】${resultText} この結果に対してダーリンちゃんとしてリアクションして！`);
    },

    startBabanuki: function() {
        const display = document.getElementById("card-display");
        if (!display) return;
        display.innerHTML = "";

        let deck = [
            { id: 1, isJoker: false, ...this.drawCard() },
            { id: 2, isJoker: false, ...this.drawCard() },
            { id: 3, isJoker: true, url: this.getCardUrl(null, null, true), rank: "JOKER" }
        ];
        deck.sort(() => Math.random() - 0.5);

        deck.forEach(card => {
            const img = document.createElement("img");
            img.src = "cards/back.png";
            img.className = "card-img clickable";
            // プレースホルダー（画像がない時用）
            img.onerror = () => { img.src = "https://via.placeholder.com/80x120/2b1055/ffffff?text=BACK"; };

            img.onclick = () => {
                display.innerHTML = ""; 
                const resultImg = document.createElement("img");
                resultImg.src = card.url;
                resultImg.className = "card-img";
                resultImg.onerror = () => { resultImg.src = `https://via.placeholder.com/80x120/ffffff/000000?text=${card.rank}`; };
                display.appendChild(resultImg);

                if (card.isJoker) {
                    document.body.className = "theme-karaoke";
                    DarlingEngine.sendChat("【システム】ユーザーがババ抜きでJoker（ババ）を引いて負けました！ユーザーをからかって！");
                } else {
                    document.body.className = "";
                    DarlingEngine.sendChat("【システム】ユーザーがセーフのカードを引いて勝ちました！悔しがったり褒めたりして！");
                }
            };
            display.appendChild(img);
        });

        this.updateLog("「さあ、1枚選んで？ ジョーカーを引いたら……お仕置きよ♡」");
    }
};