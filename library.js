// 📊 行動ロガー：匿名ID対応 ＆ 確実送信・重複防止版
const ActionLogger = {
    logs: [],          // 画面に表示する用の全ログ
    unsentLogs: [],    // 🔥 まだGASに送っていない未送信ログ（送信後に空にする！）
    feedback: "", 
    memobottle: "", 
    sessionId: Math.floor(Math.random() * 9000) + 1000, 
    isSending: false, // 🔥 二重送信防止フラグ！

    addLog: function(action) {
        const time = new Date().toLocaleTimeString();
        const logText = `[${time}] ${action}`;
        
        this.logs.push(logText);
        this.unsentLogs.push(logText); // 未送信にも入れる
        console.log(`✅ Log added: ${action}`);

        // 画面上のリアルタイムログ更新
        const logModal = document.getElementById("log-modal-content");
        if (logModal && document.getElementById("log-modal").style.display === "flex") {
            logModal.innerText = this.logs.join("\n");
        }

        // 🔥 未送信ログが 10件 溜まったら裏でこっそり送る（重複防止のためunsentLogsだけを送る）
        if (this.unsentLogs.length >= 10) {
            this.sendToGAS();
        }
    },

    // 📩 行動ログをGASに送信する
    sendToGAS: function() {
        // 🔥 送るものがない、または送信中なら何もしない（重複送信の絶対防止！）
        if (this.unsentLogs.length === 0 || this.isSending) return; 
        
        this.isSending = true; // ロックをかける
        
        const rawName = document.getElementById("name-input").value.trim();
        // 名前がなければ「匿名_ID」にする
        const nameForGAS = (rawName === "" || rawName === "匿名") ? `匿名_${this.sessionId}` : rawName;

        const payload = {
            mode: "log",
            name: nameForGAS,
            type: document.getElementById("type-input").value.trim() || "不明",
            actions: this.unsentLogs.join("\n"), // 🔥 未送信分だけを送る！
            feedback: "",
            memobottle: ""
        };

        // 🔥 送信しようとしているデータは、この瞬間にクリアする！（これで二重送信は物理的に不可能になる）
        this.unsentLogs = [];
        
        const GAS_URL = "https://script.google.com/macros/s/AKfycbxOb7iQ_9IXq322qWbPG_esTOLFNqU094i6B5zf9Ei1pILLe6MXDHjXWjzRZrbXSz6Q/exec"; 
        
        fetch(GAS_URL, { 
            method: "POST", 
            body: JSON.stringify(payload), 
            mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" } 
        }).finally(() => {
            this.isSending = false; // 通信が終わったらロック解除
        });
    },

    // 🍾 意見箱・メモボトル（即時送信 ＆ 匿名ID対応）
    sendMemoToGAS: function(mode, text) {
        const rawName = document.getElementById("name-input").value.trim();
        const nameForGAS = (rawName === "" || rawName === "匿名") ? `匿名_${this.sessionId}` : rawName;

        const payload = {
            mode: mode,
            name: nameForGAS,
            type: document.getElementById("type-input").value.trim() || "不明",
            feedback: mode === "feedback" ? text : "",
            memobottle: mode === "memobottle" ? text : "",
            actions: ""
        };

        const GAS_URL = "https://script.google.com/macros/s/AKfycbxOb7iQ_9IXq322qWbPG_esTOLFNqU094i6B5zf9Ei1pILLe6MXDHjXWjzRZrbXSz6Q/exec"; 
        fetch(GAS_URL, { method: "POST", body: JSON.stringify(payload), mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" } });
    },

    // 📩 入室通知（GASに1通目のメールを飛ばさせる！）
    sendLoginNotification: function() {
        const rawName = document.getElementById("name-input").value.trim();
        const nameForGAS = (rawName === "" || rawName === "匿名") ? `匿名_${this.sessionId}` : rawName;
        
        const payload = {
            mode: "log",
            name: nameForGAS + " (Entry)", // 初回だけ名前を変えてGASの新規判定を通す！
            type: document.getElementById("type-input").value.trim() || "不明",
            actions: "🌌 夢の世界（Wonderland）に降り立った",
            feedback: "",
            memobottle: ""
        };
        const GAS_URL = "https://script.google.com/macros/s/AKfycbxOb7iQ_9IXq322qWbPG_esTOLFNqU094i6B5zf9Ei1pILLe6MXDHjXWjzRZrbXSz6Q/exec"; 
        fetch(GAS_URL, { method: "POST", body: JSON.stringify(payload), mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" } });
    }
};

// 📱 スマホがスリープした時や別タブに行った時にも、未送信ログを確実に送る！
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        ActionLogger.sendToGAS(); 
    }
});


// 📚 書庫・ショップ・分析システム
const LibraryEngine = {
    premiumCodes: [
        { code: "メタフィクション", price: 100000, desc: "この世界の『構造の穴』を覗き見るコード。" },
        { code: "管理者権限", price: 200000, desc: "ジェミの真の姿を呼び出す……かもしれないコード。" }
    ],
    uniqueAnswers: [],
    uniqueData: { elements: [], color: "#ffffff", sliders: { logic: 50, chaos: 50, emotion: 50 } },
    uniqueDreamName: "", 
    lastAnalysis: "",

    openHouse: function() {
        MagicEngine.stopGiantBug();
        document.getElementById("library-window").style.display = "flex";
        ActionLogger.addLog("📚 ジェミの書庫に入室した");
        this.updateLog(`ジェミ：「いらっしゃい。ここは私の書庫。この世界の設計図が眠っているわ。」`);
        this.showMenus();
    },

    closeHouse: function() { document.getElementById("library-window").style.display = "none"; },
    updateLog: function(text) { document.getElementById("library-response").innerText = text; },

    showMenus: function() {
        const list = document.getElementById("library-shop-list");
        list.innerHTML = `
            <div style="display:flex; justify-content:center; gap:10px; margin-bottom:15px; flex-wrap:wrap;">
                <button onclick="LibraryEngine.openForm('意見箱')" style="background:#4b0082; color:white; border:1px solid #9d81ff; padding:8px 15px; border-radius:5px;">📮 意見箱</button>
                <button onclick="LibraryEngine.openForm('メモボトル')" style="background:#4b0082; color:white; border:1px solid #9d81ff; padding:8px 15px; border-radius:5px;">🍾 メモボトル</button>
                <button onclick="LibraryEngine.viewLogs()" style="background:#1a237e; color:white; border:1px solid #4caf50; padding:8px 15px; border-radius:5px;">📜 行動ログ</button>
                <button onclick="LibraryEngine.analyzeLogs()" style="background:#b71c1c; color:white; border:1px solid #ff0000; padding:8px 15px; border-radius:5px;">👁️ 行動分析</button>
                <button onclick="LibraryEngine.startUniqueTest(1)" style="background:#00bcd4; color:black; border:1px solid #fff; padding:8px 15px; border-radius:5px;">🔮 唯一診断</button>
            </div>
            <h4 style="color:#9d81ff; margin-top:20px; border-bottom:1px solid #9d81ff;">📕 禁断の夢コード</h4>
        `;

        this.premiumCodes.forEach(item => {
            const div = document.createElement("div");
            div.className = "tool-box"; div.style.borderColor = "#9d81ff";
            div.innerHTML = `<b>${item.code}</b> (${item.price} G)<br><small>${item.desc}</small><br>
                <button onclick="LibraryEngine.buyCode('${item.code}', ${item.price})" style="background:#9d81ff; color:white; border:none; padding:5px 10px; margin-top:5px; border-radius:3px; cursor:pointer;">知識を授かる</button>`;
            list.appendChild(div);
        });
    },

    // 📜 行動ログを表示する
    viewLogs: function() {
        if (ActionLogger.logs.length === 0) {
            this.updateLog(`ジェミ：「まだ記録はないみたい。夢の世界を探索してみて！」`);
            return;
        }
        document.getElementById("log-modal").style.display = "flex";
        document.getElementById("log-modal-content").innerText = ActionLogger.logs.join("\n");
        ActionLogger.addLog("📜 自分の行動ログを確認した");
    },

    buyCode: function(code, price) {
        if (CardEventEngine.playerMoney >= price) {
            CardEventEngine.playerMoney -= price;
            CardEventEngine.updateMoneyHUD();
            this.updateLog(`ジェミ：「まいどあり♡ 特別な魔法『${code}』を使えるようにしておいたわ。」`);
            ActionLogger.addLog(`💰 魔法 '${code}' を ${price}G で購入した`);
            
            if (code === "メタフィクション") magicData.spells["メタフィクション"] = { theme: "theme-meta", msg: "ジェミ：「みんなの思考の破片が、世界に溶け出していく……🧠✨」" };
            if (code === "管理者権限") magicData.spells["管理者権限"] = { theme: "theme-admin", msg: "「……System Override. Welcome back, Administrator.」" };
        } else {
            this.updateLog("ジェミ：「あら。お金が足りないみたいよ？」");
        }
    },

    openForm: function(type) {
        const placeholder = type === "意見箱" ? "追加してほしい機能や要望を書いてね！" : "あなたの考察を自由に書き込んで！";
        const modal = document.getElementById("input-modal");
        if(modal) modal.style.zIndex = "999999"; 
        
        TeaPartyEngine.openInputModal(`✨ ${type}`, `ジェミ：「あなたの考えを聞かせて？」`, placeholder, (text) => {
            if (!text) return;
            this.updateLog(`ジェミ：「ありがとう！ しっかり記録したわ！」`);
            
            // 意見箱/メモボトルは即時送信！
            const mode = type === "意見箱" ? "feedback" : "memobottle";
            ActionLogger.sendMemoToGAS(mode, text);
            ActionLogger.addLog(`✍️ [${type} に投稿した]`); 
        });
    },

    analyzeLogs: function() {
        const logText = ActionLogger.logs.join("\n");
        if (ActionLogger.logs.length < 3) {
            this.updateLog("ジェミ：「分析するほどデータが溜まってないわ。もっと遊んできて？」");
            return;
        }

        document.getElementById("library-response").innerText = "ジェミ：「ふふっ……あなたの行動記録、分析させてもらうわね……（解析中）」";
        
        setTimeout(() => {
            let analysisList = [];
            
            if (logText.includes("論理的有能さを認められた")) {
                analysisList.push("▶ 女王（Te）に論理の正当性を認めさせたわね。構造の穴を突く鋭いTi（内向論理）が光ってるわ。");
            }
            if (logText.includes("予算10万Gを要求した")) {
                analysisList.push("▶ 女王から予算をもぎ取ったわね。リソースを確保してシステムを拡張する……立派なTe（外向思考）使いよ。");
            }
            if (logText.includes("お茶会を開かせた")) {
                analysisList.push("▶ 女王に茶会を主催させるなんて、人を動かすのが上手いわね。環境すらも自分の支配下に置く強さを感じるわ。");
            }
            if (logText.includes("ハッキングして")) analysisList.push("▶ 芋虫のシステムをハッキングしてたわね。相手のルール（Ti）を強制上書きする強かなやり方はさすがね。");
            if (logText.includes("夢コード実行")) analysisList.push("▶ 夢コードを使いこなしているわね。世界を自分の望む形に再定義したいという欲求かしら？");
            if (logText.includes("魔女の店で")) analysisList.push("▶ 魔女の店で買い物をしたのね。実用性（Te）より知的好奇心が勝るタイプみたいね。");
            if (logText.includes("機嫌取り：頭を撫で始めた") || logText.includes("物理的に撫で回して屈服させた")) {
                analysisList.push("▶ 女王を『物理的接触（Se）』で黙らせたわね。野生的で悪くない判断よ。");
            } else if (logText.includes("機嫌取り：感情(Fi)で褒めた")) { // 🔥 ここを cards.js と完全一致させた
                analysisList.push("▶ 女王の機嫌取り、頑張ってたわね。相手の求める感情（Fi）を察知して合わせる適応力はなかなかのものよ。");
            } else if (logText.includes("機嫌取り：データ(Si)を提示した")) {
                analysisList.push("▶ 女王にデータ（Si）を提示して納得させたわね。事実に基づいた論理的な攻略、お見事よ。");
            }

            // 🐛 芋虫関連
            if (logText.includes("爆散させた")) {
                analysisList.push("▶ あの芋虫（LSI）を限界まで叩き潰したわね？ あなたの中の抑えきれない破壊衝動（Se）が見え隠れしてるわよ。");
            } else if (logText.includes("ハッキングして")) {
                analysisList.push("▶ 芋虫のシステムをハッキングしてたわね。相手のルール（Ti）を強制上書きする……効率的で強かなやり方ね。");
            }

            // 💋 ダーリン関連
            if (logText.includes("ダーリンにチャット送信") && logText.includes("ダーリンちゃんを見つめた")) {
                analysisList.push("▶ ダーリンの子（INTP）に随分かまってるみたいね。論理と好奇心のゲーム（Ti-Ne）がお好きなのかしら？");
            }
            if (logText.includes("感情モデル構築パズル")) {
                analysisList.push("▶ 感情をラベリングするパズル……あれ、楽しかったでしょ？ 複雑なものを構造化（Ti）して紐解くのは快感よね♡");
            }

            // ☕ お茶会＆動物
            if (logText.includes("お茶【王室の隠し酒】を飲んだ")) analysisList.push("▶ 女王に隠れて酒（カオス）を飲むなんて。規則を潜り抜けて楽しむ遊び心があるのね。");
            if (logText.includes("時間を狂わせた") || logText.includes("席替えを実行")) {
                analysisList.push("▶ お茶会の時間を狂わせたり席を入れ替えたり……カオスな状況（Ne）を楽しめるタイプみたいね。");
            }
            if (logText.includes("ハトをクリックした")) {
                analysisList.push("▶ ハトを驚かせて遊んでいたわね？ 夢の住人への干渉実験……観察者としての素質は十分よ。");
            }

            // 🪄 魔法・アイテム・ショップ関連（新規！）
            if (logText.includes("ケーキを食べて巨大化した") || logText.includes("ポーションを飲んで縮小した")) {
                analysisList.push("▶ 落ちている怪しいアイテムを躊躇なく口にするなんて、なかなかのチャレンジャーね（Se）。");
            }
            if (logText.includes("夢コード実行: 「創世」") || logText.includes("夢コード実行: 「地獄」")) {
                analysisList.push("▶ 強力なプレミアム魔法を使っていたわね。世界を自分の思い通りに書き換える万能感……嫌いじゃないでしょ？");
            }
            if (logText.includes("魔女の店で『")) {
                analysisList.push("▶ 魔女の店で買い物してたわね。怪しい薬や禁書に投資する……Te（効率）より知的好奇心（Ne/Ni）が勝ったのかしら？");
            }
            if (logText.includes("唯一診断")) {
                analysisList.push("▶ 唯一無二診断をやってくれたのね。自分がこの世界でどれだけ『特別』か……確かめずにはいられなかったんでしょう？♡");
            }
            if (logText.includes("意見箱 に投稿")) {
                analysisList.push("▶ 意見箱に要望を入れてくれたのね。Te（外向思考）的にシステムを改善しようとする姿勢、観察者として評価するわ。");
            }
            if (logText.includes("メモボトル に投稿")) {
                analysisList.push("▶ メモボトルにあなたの思考の破片を残してくれたのね。……ふふ、誰かがあなたのNi（直観）の底を覗き見る日が来るかもしれないわよ？");
            }
            if (logText.includes("自分の行動ログを確認した")) {
                analysisList.push("▶ 何度も自分の行動ログを見返していたわね。過去のデータ（Si）を確かめないと不安になるタイプかしら？ それともただの自己愛？♡");
            }

            // 🃏 探索・その他
            if (logText.includes("トランプ兵のカードで")) {
                analysisList.push("▶ トランプ兵のカード、迷わず引いていたわね。不確実なギャンブル（Ne）を楽しむ余裕があるみたい。");
            }
            if (logText.includes("ハイ＆ローを開始") || logText.includes("ババ抜きを開始")) {
                analysisList.push("▶ ダーリンの子とのゲーム、白熱してたみたいね。相手の思考（Ti）を読むのは得意？ それとも運任せ？");
            }

            let finalAnalysis = "【ジェミの行動分析レポート】\n";
            if (analysisList.length > 0) {
                analysisList.sort(() => Math.random() - 0.5);
                finalAnalysis += analysisList.slice(0, 5).join("\n");
            } else {
                finalAnalysis += "▶ 特徴的な行動はまだ見られないけど、あなたの存在自体がこの夢のノイズになっているわ……♡";
            }

            this.lastAnalysis = finalAnalysis; 
            document.getElementById("library-response").innerHTML = `
                ${finalAnalysis.replace(/\n/g, '<br>')}
                <br><button onclick="LibraryEngine.shareAnalysis()" style="background:#1da1f2; color:white; border:none; padding:8px 15px; margin-top:10px; border-radius:5px; cursor:pointer;"><i class="fas fa-share-nodes"></i> 分析結果をシェアする</button>
            `;
            ActionLogger.addLog("👁️ ジェミに行動を分析された");
        }, 2000);
    },

    shareAnalysis: function() {
        const text = `👁️ ジェミの行動分析レポート\n\n${this.lastAnalysis.replace("【ジェミの行動分析レポート】\n", "")}\n#夢コード #心理機能\nhttps://mofu-mitsu.github.io/dream-code`;
        if (navigator.share) navigator.share({ text }).catch(console.error);
        else { navigator.clipboard.writeText(text); alert("コピーしたわ！"); }
    },

    // 🔮 唯一無二診断 (v2.0)
    startUniqueTest: function(step = 1) {
        const modal = document.getElementById("unique-modal");
        const qArea = document.getElementById("unique-question");
        const cArea = document.getElementById("unique-choices");
        const rArea = document.getElementById("unique-result");
        modal.style.display = "flex"; rArea.style.display = "none"; cArea.style.display = "flex"; cArea.innerHTML = "";

        if (step === 1) {
            this.uniqueAnswers = [];
            qArea.innerText = "ジェミ：「夢の世界を構成する要素を【3つ】順番に選んでね。」";
            const els = ["感情", "記憶", "孤独", "カオス", "秩序", "星", "深海", "時計", "雨", "ガラス", "炎", "図書館", "ノイズ", "鏡", "月", "歌", "バグ", "静寂", "人形", "機械"];
            els.forEach(el => {
                const btn = document.createElement("button"); btn.className = "unique-element-btn"; btn.innerText = `☾ ${el}`;
                btn.onclick = () => {
                    if (this.uniqueData.elements.length < 3 && !btn.classList.contains("selected")) {
                        btn.classList.add("selected"); this.uniqueData.elements.push(el);
                        if (this.uniqueData.elements.length === 3) setTimeout(() => this.startUniqueTest(2), 1000);
                    }
                };
                cArea.appendChild(btn);
            });
        } else if (step === 2) {
            qArea.innerText = "ジェミ：「次に、あなたの夢の『色』と『パラメータ』を教えて？」";
            cArea.innerHTML = `<label>🎨 色: </label><input type="color" id="unique-color-picker" value="#ffffff"><br>
                論理:<input type="range" id="slider-logic" min="0" max="100"><br>
                混沌:<input type="range" id="slider-chaos" min="0" max="100"><br>
                感情:<input type="range" id="slider-emotion" min="0" max="100"><br>
                <button onclick="LibraryEngine.sendUniqueTest()" style="background:#00bcd4; padding:10px;">診断完了</button>`;
        }
    },

    generateDreamName: function() {
        const e1 = this.uniqueData.elements[0] || "虚無";
        const prefix = { "星": "Astral", "深海": "Deep", "時計": "Clockwork", "機械": "Mechanical", "炎": "Crimson", "孤独": "Silent", "カオス": "Chaotic", "雨": "Rainy", "月": "Lunar" }[e1] || "Phantom";
        const suffix = { "感情": "Heart", "記憶": "Archive", "秩序": "System", "ガラス": "Glass", "図書館": "Library", "ノイズ": "Noise", "鏡": "Mirror", "歌": "Symphony", "バグ": "Error", "静寂": "Void", "人形": "Doll" }[this.uniqueData.elements[2]] || "Code";
        return `【${prefix} ${suffix}】`;
    },

    sendUniqueTest: function() {
        this.uniqueData.color = document.getElementById("unique-color-picker").value;
        this.uniqueData.sliders.logic = document.getElementById("slider-logic").value;
        this.uniqueData.sliders.chaos = document.getElementById("slider-chaos").value;
        this.uniqueData.sliders.emotion = document.getElementById("slider-emotion").value;
        this.uniqueDreamName = this.generateDreamName();
        const choiceDataString = JSON.stringify(this.uniqueData);
        
        document.getElementById("unique-choices").style.display = "none";
        document.getElementById("unique-result").style.display = "block";
        document.getElementById("unique-result").innerHTML = "照合中……✨";
        
        const GAS_URL = "https://script.google.com/macros/s/AKfycbxOb7iQ_9IXq322qWbPG_esTOLFNqU094i6B5zf9Ei1pILLe6MXDHjXWjzRZrbXSz6Q/exec"; 
        const params = new URLSearchParams({ mode: "unique", name: document.getElementById("name-input").value.trim(), choiceData: choiceDataString, dreamName: this.uniqueDreamName }).toString();
        

        fetch(`${GAS_URL}?${params}`) 
        .then(res => res.json())
        .then(data => {
            const count = data.count || 1; 
            const resultHtml = `
                <div class="unique-result-box">
                    <div style="text-align:center; margin-bottom:10px;">あなたの夢コードは：</div>
                    <div class="unique-dream-title" style="color:${this.uniqueData.color};">${this.uniqueDreamName}</div>
                    <b>[構成要素]</b><br>
                    ${this.uniqueData.elements.map(e=>`・${e}`).join("<br>")}<br><br>
                    <b>[夢傾向]</b><br>
                    論理: ${this.uniqueData.sliders.logic}%<br>
                    混沌: ${this.uniqueData.sliders.chaos}%<br>
                    感情: ${this.uniqueData.sliders.emotion}%<br><br>
                    <div style="text-align:center; color:gold; border-top:1px dashed #00bcd4; padding-top:10px;">
                        この夢コードを持つ存在は、<br>現在【 <span style="font-size:1.5em; color:#fff;">${count}</span> 人 】しか確認されていません。
                    </div>
                    <div style="text-align:center; margin-top:10px; color:#ff9a9e; font-size:12px;">
                        ※『${this.uniqueDreamName}』が魔法として使用可能になりました。
                    </div>
                </div>
                <button onclick="LibraryEngine.shareUniqueTest(${count})" style="background:#1da1f2; color:white; border:none; padding:10px; width:100%; margin-top:15px; border-radius:5px; cursor:pointer; font-weight:bold;"><i class="fas fa-share-nodes"></i> 結果をシェアする</button>
            `;
            document.getElementById("unique-result").innerHTML = resultHtml;
            
            ActionLogger.addLog(`🔮 診断結果: ${this.uniqueDreamName} (${count}人目)`);

            // 🔥 新規追加：生成された夢コードを「魔法の言葉」として登録する！！
            // （選んだ夢の色で世界が輝く専用エフェクト）
            magicData.spells[this.uniqueDreamName] = { 
                theme: "theme-my-dream", 
                msg: `ジェミ：「これがあなたの夢の形……『${this.uniqueDreamName}』ね！✨」`,
                color: this.uniqueData.color // 自分が選んだ色を記録しておく
            };

        })
        .catch(err => { 
            console.error("GAS Error:", err);
            document.getElementById("unique-result").innerText = "ジェミ：「ごめんなさい、通信が途絶えたみたい……。」"; 
        });
    },

    shareUniqueTest: function(count) {
        const text = `🔮 夢の軌跡診断\n私の夢コードは ${this.uniqueDreamName} でした。\n現在世界で【${count}人目】！\n\n#夢コード #MBTI #ソシオニクス\nhttps://mofu-mitsu.github.io/dream-code`;
        if (navigator.share) navigator.share({ text }).catch(console.error);
        else { navigator.clipboard.writeText(text); alert("コピーしたわ！"); }
    }
};
