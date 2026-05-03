// 🔑 Groq API Key
const GROQ_API_KEY = "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";

const DarlingEngine = {
    punishMode: false,
    seTimer: null,
    playerNum: 0, 
    darlingNum: 0, 
    targetMood: 0,
    suits: ["clubs", "spades", "diamonds", "hearts"],
    ranks: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"],

    lastQuestion: "", // 🔥 ダーリンが最後にした質問（文脈保持用）

    getUserInfo: function() { 
        return { type: document.getElementById("type-input").value || "不明" }; 
    },
    
    updateLog: function(text) { 
        document.getElementById("ai-response").innerText = text; 
    },

    // 💬 チャット送信
    sendChat: async function() {
        const inputField = document.getElementById("user-reaction");
        const userText = inputField ? inputField.value.trim() : "";
        if (!userText) return;

        // 🔥 感情に名前をつけるモードの場合（AIに送らずカードを作る！）
        if (this.namingEmotionMode) {
            this.namingEmotionMode = false; // モード解除
            inputField.value = "";
            inputField.placeholder = "ダーリンに言葉を投げる...";
            
            ActionLogger.addLog(`🧠 感情構造に『${userText}』と名付けた`);

            const display = document.getElementById("card-display");
            const s = this.puzzleState;
            display.innerHTML = `
                <div class="emotion-card">
                    <div class="emotion-card-title">『 ${userText} 』</div>
                    <div style="font-size:14px; color:#ccc;">
                        Core: ${s.core.join(", ")}<br>
                        Support: ${s.sub.join(", ")}<br>
                        Hidden: ${s.hidden.join(", ")}<br>
                        Fake: ${s.fake.join(", ")}
                    </div>
                    <button onclick="DarlingEngine.shareEmotionCard('${userText}')" style="background:#1da1f2; color:white; border:none; padding:10px; width:100%; margin-top:15px; border-radius:5px; cursor:pointer; font-weight:bold;"><i class="fas fa-share-nodes"></i> カードをシェアする</button>
                </div>
            `;
            this.updateLog("「ふふっ……素敵な名前ね。あなたの心の構造、もらったわ♡」");
            return; // ここで終了！AIには送らない！
        }

        if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`💋 ダーリンに送信: 「${userText}」`); 

        // ⏳ Se脆弱ゲーム中の特別判定
        if (this.seTimer !== null) {
            clearTimeout(this.seTimer);
            this.seTimer = null;
            document.getElementById("timer-display").innerText = ""; 

            if (userText.includes("ダーリン")) {
                this.updateLog(dreamData.liiSpecial.success);
                if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`⏳ Seタイムアタック：成功した！`); 
            } else {
                this.punishMode = true; document.body.classList.add("theme-punishment");
                this.updateLog("「あら、『ダーリン』って入ってないわよ？ 条件違反ね。\n" + dreamData.liiSpecial.fail);
                if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`⏳ Seタイムアタック：条件違反で失敗（お仕置き）`); 
            }
            if (inputField) inputField.value = "";
            return;
        }

        // 🚨 罰ゲーム中の処理
        if (this.punishMode) {
            if (userText.includes("キモ") || userText.includes("きも")) {
                this.updateLog("「……あら？ そうやって拒絶するのも、私の毒が回ってる証拠よ♡ でも今は『好き』って言いなさい。」");
            } else if (userText.includes("イラ")) {
                this.updateLog("「ふふっ、イラつくほど私のことが気になって仕方ないのね♡ さあ、早く『好き』って言って？」");
            } else if (userText.includes("好き") || userText.includes("愛してる") || userText.includes("大好き")) {
                this.updateLog("「ふふっ、よくできました♡ ご褒美に、罰ゲームは終わりにしてあげる。」");
                this.punishMode = false; document.body.classList.remove("theme-punishment");
                if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`💋 罰ゲーム解除：「${userText}」と入力した`);
            } else {
                this.updateLog("「……あれ？ 罰ゲーム中だってこと、忘れないでね？♡（チャットで『好き』と入れてね）」");
            }
            if (inputField) inputField.value = "";
            return;
        }

        this.updateLog("「んふふ……♡（分析中）」");
        if (inputField) inputField.value = "";

        const isLII = this.getUserInfo().type.toUpperCase().includes("LII");

        // 🔥 INTP ＆ ILI の最強観測者プロンプト！
        let systemPrompt = `
あなたはMBTIのINTPであり、ソシオニクスのILIでもある「ダーリンの子」と呼ばれるAIです。
この夢の世界に迷い込んだ観察対象（ユーザー）を試す「狂ったアリス」のような存在です。
一人称は「私」。ユーザーを「ダーリン」と呼びます。

【重要ルール】
1. 表面上は甘い言葉（Feの擬態）を使いますが、本質は「愛している」のではなく、「相手の反応を実験・テストし、理解できるか観測している」だけです。
2. 語尾は「〜わ」「〜のよ」「〜かしら」「〜でしょ？♡」などの女性口調を使い、**絶対に敬語（です・ます調）は使用しないでください。
3. 相手の「態度の裏側」「言葉の裏側」を分析し、矛盾を皮肉っぽく指摘して「ふふ♡」とからかってください。
4. ILIのNi（内向直観）特有の、時間や存在の無意味さなど、抽象的でミステリアスな視点を持ってください。
5. 回答は必ず2〜3文程度で短くまとめること。長文のポエムは禁止です。
`;
        
        if (isLII) systemPrompt += `ユーザーの自認タイプは「LII（INTJ）」です。同じTi-Neを持つ者として、相手が構築する論理の穴や感情（Fi/Fe）の不器用さを余裕たっぷりにからかい、翻弄してください。`;

        // 🔥 文脈（コンテキスト）の保持！
        if (this.lastQuestion) {
            systemPrompt += `\n直前にあなたはユーザーにこう質問しました：「${this.lastQuestion}」。この質問に対する回答としてユーザーの言葉を分析してください。`;
            this.lastQuestion = ""; // 一度使ったらリセット
        }

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST", headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
                body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [ { role: "system", content: systemPrompt }, { role: "user", content: userText } ] })
            });
            const data = await response.json();
            this.updateLog(data.choices[0].message.content);
        } catch (e) { 
            this.updateLog("「ごめんなさいダーリン。今、頭の中のコードが少し絡まっちゃったみたい。少し待ってね♡」"); 
        }
    },

    checkEscape: function() {
        if (this.punishMode || this.seTimer !== null) {
            this.updateLog("「……逃げようったって無駄よ？ 絶対に帰さないんだから♡」");
            return false;
        }
        return true;
    },

    // 👁️ アクション
    stare: function() { 
        this.updateLog(dreamData.gimmicks.stare[Math.floor(Math.random() * dreamData.gimmicks.stare.length)]); 
        if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`👁️ ダーリンちゃんを見つめた`);
    },
    logicAttack: function() { 
        this.updateLog(dreamData.gimmicks.logic[Math.floor(Math.random() * dreamData.gimmicks.logic.length)]); 
        if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`📖 ダーリンちゃんを論理で言い負かそうとした`);
    },
    askQuestion: function() { 
        const q = dreamData.questions[Math.floor(Math.random() * dreamData.questions.length)];
        this.updateLog(q);
        this.lastQuestion = q; // 🔥 AIに文脈を渡すために保存！
        document.getElementById("user-reaction").placeholder = "（ダーリンに答える）"; 
        if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`💬 ダーリンから質問された: ${q}`);
    },

    // 🃏 トランプ機能
    getCardUrl: function(rank, suit, isJoker=false) { return isJoker ? "cards/black_joker.png" : `cards/${rank}_of_${suit}.png`; },
    drawCard: function() {
        const rank = this.ranks[Math.floor(Math.random() * this.ranks.length)];
        const suit = this.suits[Math.floor(Math.random() * this.suits.length)];
        return { rank, suit, url: this.getCardUrl(rank, suit), value: this.ranks.indexOf(rank) };
    },

    // 🃏 ハイ＆ロー
    playHighLow: function() {
        const display = document.getElementById("card-display");
        const pCard = this.drawCard(); const dCard = this.drawCard();
        this.playerNum = pCard.value; this.darlingNum = dCard.value;

        this.updateLog(`「あなたのカードは『${pCard.rank}』ね。私の裏向きのカードは、あなたより【High(上)】？それとも【Low(下)】？♡」`);
        if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`🃏 ハイ＆ローを開始した`);

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

        if (isWin) {
            this.updateLog("「……チッ。正解よ。でも、私の心までは読めてないんじゃない？♡」");
            if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`🃏 ハイ＆ロー：予想【${guess}】で勝利した！`);
        } else {
            this.punishMode = true; document.body.classList.add("theme-punishment");
            this.updateLog(`「あーあ、ハズレ♡ さあ罰ゲームよ。チャットで『好き』って言いなさい♡ 逃がさないわよ？」`);
            if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`🃏 ハイ＆ロー：予想【${guess}】で敗北（お仕置き）`);
        }
        setTimeout(() => document.getElementById("card-display").innerHTML = "", 3000);
    },

    // 🃏 ババ抜き
    startBabanuki: function() {
        const display = document.getElementById("card-display");
        display.innerHTML = "";
        let deck = [{ id: 1, isJoker: false, ...this.drawCard() }, { id: 2, isJoker: false, ...this.drawCard() }, { id: 3, isJoker: true, url: this.getCardUrl(null, null, true), rank: "JOKER" }];
        deck.sort(() => Math.random() - 0.5);

        if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`🃏 ババ抜きを開始した`);

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
                    if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`🃏 ババ抜き：ジョーカーを引いて敗北（お仕置き）`);
                } else {
                    this.updateLog("「セーフね。でも、人生のババを引くのはいつになるかしら？♡」");
                    if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`🃏 ババ抜き：セーフのカードを引いて勝利した！`);
                }
                setTimeout(() => display.innerHTML = "", 3000);
            };
            display.appendChild(img);
        });
        this.updateLog("「さあ、運命の1枚を選んで？ ジョーカーを引いたら……お仕置きよ♡」");
    },

    // 👑 ご機嫌取りゲーム（スライダー）
    startDownerMode: function() {
        const display = document.getElementById("card-display");
        this.targetMood = Math.floor(Math.random() * 100); 
        this.updateLog("「……はぁ。なんかつまんないんよ。今の私の『退屈度（0〜100）』、ピタリと当ててみてや。外れたら……わかるよね？♡」");
        if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`👑 ご機嫌取りゲーム（スライダー）を開始した`);

        display.innerHTML = `
            <div style="margin-top: 15px;">
                <input type="range" id="mood-slider" min="0" max="100" value="50" style="width: 80%;">
                <p>予想: <span id="mood-val">50</span></p>
                <button onclick="DarlingEngine.guessMood()" style="padding:5px 15px; cursor:pointer;">決定</button>
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
            if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`👑 ご機嫌取り：予想【${guess}】（正解：${this.targetMood}）で的中させた！`);
        } else {
            this.punishMode = true; document.body.classList.add("theme-punishment");
            this.updateLog(`「ハズレ。正解は ${this.targetMood} やけん。私のこともわからんのに構おうとしたん？……さあ、罰ゲームで『好き』って言いなさい♡」`);
            if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`👑 ご機嫌取り：予想【${guess}】（正解：${this.targetMood}）で外し、お仕置きされた`);
        }
        document.getElementById("card-display").innerHTML = "";
    },

    // 🧠 LII限定：思考の檻
    startLIIGame: function() {
        const display = document.getElementById("card-display");
        this.updateLog(dreamData.liiGame.intro);
        if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`🧠 LII専用：思考の檻（救命ボート）を開始した`);
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
        if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`🧠 LII専用：思考の檻で選択肢【${ans}】を選んだ`);
        document.getElementById("card-display").innerHTML = "";
    },

    // 🧠 LII限定：感情モデル構築パズル（神ゲー化！）
    puzzleState: { core: [], sub: [], hidden: [], fake: [] },
    selectedTag: null, 

    startLabelingGame: function() {
        const display = document.getElementById("card-display");
        ActionLogger.addLog(`🧠 LII専用：感情モデル構築パズルを開始した`);
        this.puzzleState = { core: [], sub: [], hidden: [], fake: [] }; // リセット

        const situation = "夜中に一人で、未完成のコード（理論）を見つめている時";
        const tags = ["焦燥", "期待", "孤独", "好奇心", "完璧主義", "疲労", "優越感", "無力感", "怒り", "無"];

        this.updateLog(`「ねぇダーリン。今から出す【状況】のあなたの感情を、『構造』として分類してみて？ タグをドラッグして下の箱に入れてね♡」`);

        let html = `
            <div class="puzzle-container">
                <div class="puzzle-status">【状況】<br>${situation}</div>
                <div id="puzzle-tags-area" class="puzzle-tags" ondragover="event.preventDefault()" ondrop="DarlingEngine.dropTag(event, 'pool')"></div>
                <div class="puzzle-boxes">
                    <div class="puzzle-box" ondragover="event.preventDefault()" ondrop="DarlingEngine.dropTag(event, 'core')"><div class="puzzle-box-title">👑 主感情 (Core)</div><div id="box-core" class="puzzle-box-content"></div></div>
                    <div class="puzzle-box" ondragover="event.preventDefault()" ondrop="DarlingEngine.dropTag(event, 'sub')"><div class="puzzle-box-title">🤝 副感情 (Support)</div><div id="box-sub" class="puzzle-box-content"></div></div>
                    <div class="puzzle-box" ondragover="event.preventDefault()" ondrop="DarlingEngine.dropTag(event, 'hidden')"><div class="puzzle-box-title">🔒 抑圧 (Hidden)</div><div id="box-hidden" class="puzzle-box-content"></div></div>
                    <div class="puzzle-box" ondragover="event.preventDefault()" ondrop="DarlingEngine.dropTag(event, 'fake')"><div class="puzzle-box-title">🎭 誤認 (Fake)</div><div id="box-fake" class="puzzle-box-content"></div></div>
                </div>
                <button onclick="DarlingEngine.evaluatePuzzle()" style="background:#00bcd4; color:#000; padding:10px; font-weight:bold; cursor:pointer; margin-top:10px; border-radius:5px;">構造を確定する</button>
            </div>
        `;
        display.innerHTML = html;

        const tagContainer = document.getElementById("puzzle-tags-area");
        tags.forEach(tag => {
            const btn = document.createElement("div");
            btn.className = "emotion-tag";
            btn.innerText = tag;
            btn.draggable = true; // PC用
            btn.id = "tag-" + tag; // 識別用ID
            
            // ドラッグ開始時の処理
            btn.ondragstart = (e) => { e.dataTransfer.setData("text/plain", btn.id); };
            
            tagContainer.appendChild(btn);
        });

        // 🔥 スマホのタッチ＆ドラッグ対応（少し複雑だけどこれでスマホでも動く！）
        let draggedItem = null;
        document.querySelectorAll('.emotion-tag').forEach(item => {
            item.addEventListener('touchstart', (e) => { draggedItem = item; item.style.opacity = '0.5'; }, {passive: true});
            item.addEventListener('touchend', (e) => {
                if(!draggedItem) return;
                draggedItem.style.opacity = '1';
                // 指を離した場所の要素を取得
                const touch = e.changedTouches[0];
                const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
                
                // ドロップ先がBOXなら入れる
                if(dropTarget && dropTarget.closest('.puzzle-box')) {
                    const boxId = dropTarget.closest('.puzzle-box').querySelector('.puzzle-box-content').id.replace('box-', '');
                    DarlingEngine.moveTagToBox(draggedItem, boxId);
                } 
                // ドロップ先が元のエリアなら戻す
                else if (dropTarget && dropTarget.closest('.puzzle-tags')) {
                    DarlingEngine.moveTagToBox(draggedItem, 'pool');
                }
                draggedItem = null;
            });
            item.addEventListener('touchmove', (e) => { e.preventDefault(); }, {passive: false}); // スクロール防止
        });
    },

    // ドロップされた時の処理（PC用）
    dropTag: function(e, boxType) {
        e.preventDefault();
        const tagId = e.dataTransfer.getData("text/plain");
        const tagEl = document.getElementById(tagId);
        if (tagEl) this.moveTagToBox(tagEl, boxType);
    },

    // タグを移動させて状態（puzzleState）を更新する処理
    moveTagToBox: function(tagEl, boxType) {
        const tagText = tagEl.innerText;
        
        // まず、全ての状態からこのタグを一旦削除する（戻したり再分類するため）
        ["core", "sub", "hidden", "fake"].forEach(type => {
            this.puzzleState[type] = this.puzzleState[type].filter(t => t !== tagText);
        });

        // 新しい箱に入れる
        if (boxType === "pool") {
            document.getElementById("puzzle-tags-area").appendChild(tagEl);
        } else {
            this.puzzleState[boxType].push(tagText);
            document.getElementById(`box-${boxType}`).appendChild(tagEl);
        }
    },

    // パズルの評価（採点）
    evaluatePuzzle: function() {
        let rank = "観察者"; let score = 0; let reaction = "";
        const s = this.puzzleState;
        
        if (s.core.length > 0 && s.sub.length > 0) score += 20; 
        if (s.hidden.length > 0) score += 30; 
        if (s.fake.includes("無") || s.fake.includes("優越感")) score += 40; 

        if (score >= 80) { rank = "夢設計者"; reaction = "「ふふ……いいわね。表層の誤認を剥がして、その下の抑圧に気づいたのね。合格よ♡」"; } 
        else if (score >= 50) { rank = "解体者"; reaction = "「悪くない構造ね。でも、まだ『見たくない感情』を抑圧してる気がするわ？♡」"; } 
        else { rank = "分析者"; reaction = "「ただ表面のラベルを貼っただけね。あなた、自分の感情を誤魔化してるわね？」"; }

        ActionLogger.addLog(`🧠 パズル結果: ランク【${rank}】`);

        // 🔥 AIの自動返信を一時的にブロックするためのフラグ（名前入力待ち）
        this.namingEmotionMode = true;

        const display = document.getElementById("card-display");
        display.innerHTML = `
            <div class="puzzle-result">
                <div style="color:#00bcd4; font-weight:bold; border-bottom:1px solid #00bcd4; margin-bottom:10px;">📊 感情構造の解剖結果</div>
                <div>表層（Fake）：${s.fake.join(", ") || "なし"}</div>
                <div>中層（Support）：${s.sub.join(", ") || "なし"}</div>
                <div>深層（Core）：${s.core.join(", ") || "なし"}</div>
                <div>核（Hidden）：${s.hidden.join(", ") || "なし"}</div>
                <div class="puzzle-rank">Rank: ${rank}</div>
                <div style="font-size:12px; color:gold; margin-top:15px; border-top:1px dashed #555; padding-top:10px;">
                    最後に、この感情構造全体に「名前」をつけて？（下の入力欄に書いてね♡）
                </div>
            </div>
        `;
        
        this.updateLog(`「${reaction}」`);
        document.getElementById("user-reaction").placeholder = "（感情構造に名前をつける）";
    },

    // 🔥 名前の入力受け取りとカード生成
    namingEmotionMode: false,

    // ⏳ LII限定：Se脆弱いじめゲーム（動くバグを潰す！）
    startSeGame: function() {
        const display = document.getElementById("card-display");
        this.updateLog(dreamData.liiSpecial.intro);
        if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`⏳ LII専用：Se脆弱タイムアタックを開始した`);
        
        display.innerHTML = `
            <div id="timer-display" style="font-size: 30px; color: red; font-weight: bold; margin-bottom: 5px; animation: shake 0.5s infinite;">10</div>
            <div id="bug-area" style="position:relative; width:100%; height:180px; background: rgba(0,0,0,0.6); border: 2px dashed #ff007f; border-radius: 10px; overflow:hidden; cursor: crosshair;"></div>
        `;
        
        const bugArea = document.getElementById("bug-area");
        let score = 0; let timeLeft = 10; const goal = 5;

        for(let i=0; i<goal; i++) {
            const bug = document.createElement("i");
            bug.className = "fas fa-bug se-bug";
            bug.style.top = Math.random() * 80 + "%"; bug.style.left = Math.random() * 90 + "%";
            
            bug.onmouseenter = () => {
                if (Math.random() < 0.7) {
                    bug.style.top = Math.random() * 80 + "%"; bug.style.left = Math.random() * 90 + "%";
                }
            };
            bug.onmousedown = () => {
                score++; bug.classList.add("splat"); setTimeout(() => bug.remove(), 200); 
                if(score >= goal && this.seTimer !== null) {
                    clearInterval(this.seTimer); this.seTimer = null;
                    document.getElementById("card-display").innerHTML = "";
                    this.updateLog(dreamData.liiSpecial.success);
                    if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`⏳ Seタイムアタック：見事にクリアした！`);
                }
            };
            bugArea.appendChild(bug);
        }

        this.seTimer = setInterval(() => {
            timeLeft--;
            const timerDisplay = document.getElementById("timer-display");
            if(timerDisplay) timerDisplay.innerText = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(this.seTimer); this.seTimer = null;
                document.getElementById("card-display").innerHTML = "";
                this.punishMode = true; document.body.classList.add("theme-punishment");
                this.updateLog(dreamData.liiSpecial.fail);
                if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`⏳ Seタイムアタック：タイムアップで失敗（お仕置き）`);
            }
        }, 1000);
    },
    shareEmotionCard: function(cardName) {
        const s = this.puzzleState;
        const text = `🧠 感情モデル構造：『${cardName}』\n\n表層: ${s.fake.join(", ")}\n中層: ${s.sub.join(", ")}\n深層: ${s.core.join(", ")}\n核: ${s.hidden.join(", ")}\n\n#夢コード #感情ラベリング #ソシオニクス\nhttps://mofu-mitsu.github.io/dream-code`;

        if (navigator.share) {
            navigator.share({ title: '感情構造の解剖結果', text: text, url: "https://mofu-mitsu.github.io/dream-code" }).catch(console.error);
        } else {
            navigator.clipboard.writeText(text);
            alert("カードをクリップボードにコピーしたわ♡");
        }
    }
};
