// 🔥 スマホ対策の究極奥義：画面が隠れた（バックグラウンドに行った）瞬間に送信する！
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        ActionLogger.sendToGAS();
    }
});

// 🔥 閉じる時だけ送る！
window.addEventListener("beforeunload", () => { ActionLogger.sendToGAS(); });

const ActionLogger = {
    logs: [], feedback: "", memobottle: "", 
    
    addLog: function(action) {
        const time = new Date().toLocaleTimeString();
        this.logs.push(`[${time}] ${action}`);
        console.log(`Log added: ${action}`);

        const logModal = document.getElementById("log-modal-content");
        if (logModal && document.getElementById("log-modal").style.display === "flex") {
            logModal.innerText = this.logs.join("\n");
        }
    },

    sendToGAS: function() {
        if (this.logs.length === 0 && !this.feedback && !this.memobottle) return;
        
        const payload = {
            mode: "log",
            name: document.getElementById("name-input").value.trim() || "匿名",
            type: document.getElementById("type-input").value.trim() || "不明",
            actions: this.logs.join("\n"),
            feedback: this.feedback, memobottle: this.memobottle
        };
        
        const params = new URLSearchParams();
        params.append('payload', JSON.stringify(payload));
        
        // 🔥 GAS URLを設定！
        const GAS_URL = "https://script.google.com/macros/s/AKfycbxC6G0tdMKum_5MbHS3P86Sz9xg-yexkZIGpk51JeJbETSdOd9wLRfUCySvxwHOPMVP/exec"; 
        
        if (navigator.sendBeacon) {
            navigator.sendBeacon(GAS_URL, params);
        } else {
            fetch(GAS_URL, { 
                method: "POST", 
                body: params, 
                headers: { "Content-Type": "application/x-www-form-urlencoded" } 
            });
        }
        
        this.logs = []; this.feedback = ""; this.memobottle = "";
    }
};

const LibraryEngine = {
    premiumCodes: [
        { code: "メタフィクション", price: 100000, desc: "この世界の『構造の穴』を覗き見るコード。" },
        { code: "管理者権限", price: 200000, desc: "ジェミの真の姿を呼び出す……かもしれないコード。" }
    ],
    uniqueAnswers: [],
    uniqueData: { elements: [], color: "#ffffff", sliders: { logic: 50, chaos: 50, emotion: 50 } },
    uniqueDreamName: "", 
    
    // 分析結果保存用
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
                <button onclick="LibraryEngine.analyzeLogs()" style="background:#b71c1c; color:white; border:1px solid #ff0000; padding:8px 15px; border-radius:5px;">👁️ 軌跡の解剖（行動分析）</button>
                <button onclick="LibraryEngine.startUniqueTest(1)" style="background:#00bcd4; color:black; border:1px solid #fff; padding:8px 15px; border-radius:5px;">🔮 夢の軌跡診断</button>
            </div>
            <h4 style="color:#9d81ff; margin-top:20px; border-bottom:1px solid #9d81ff;">📕 禁断の夢コード（購入すると魔法が解禁）</h4>
        `;

        this.premiumCodes.forEach(item => {
            const div = document.createElement("div");
            div.className = "tool-box"; div.style.borderColor = "#9d81ff";
            div.innerHTML = `
                <b>${item.code}</b> (${item.price} G)<br>
                <small>${item.desc}</small><br>
                <button onclick="LibraryEngine.buyCode('${item.code}', ${item.price})" style="background:#9d81ff; color:white; border:none; padding:5px 10px; margin-top:5px; border-radius:3px; cursor:pointer;">知識を授かる</button>
            `;
            list.appendChild(div);
        });
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
        const placeholder = type === "意見箱" ? "追加してほしい機能や要望を書いてね！" : "あなたのMBTI等の知識や考察を自由に書き込んで！";
        const modal = document.getElementById("input-modal");
        if(modal) modal.style.zIndex = "999999"; 
        
        TeaPartyEngine.openInputModal(`✨ ${type}`, `ジェミ：「あなたの考えを聞かせて？」`, placeholder, (text) => {
            if (!text) return;
            this.updateLog(`ジェミ：「ありがとう！ しっかり記録したわ！」`);
            if (type === "意見箱") ActionLogger.feedback += text + "\n";
            if (type === "メモボトル") ActionLogger.memobottle += text + "\n";
            ActionLogger.addLog(`✍️ [${type} に投稿]: ${text}`); 
        });
    },

    viewLogs: function() {
        if (ActionLogger.logs.length === 0) {
            this.updateLog(`ジェミ：「まだ記録はないみたい。夢の世界を探索してみて！」`);
            return;
        }
        document.getElementById("log-modal").style.display = "flex";
        document.getElementById("log-modal-content").innerText = ActionLogger.logs.join("\n");
        ActionLogger.addLog("📜 自分の行動ログを確認した");
    },

    // 👁️ 軌跡の解剖（行動分析）- 汎用化＆シェア機能追加！
    analyzeLogs: function() {
        const logText = ActionLogger.logs.join("\n");
        if (ActionLogger.logs.length < 3) {
            this.updateLog("ジェミ：「分析するほどデータが溜まってないわ。もっとこの世界を探索してきて？」");
            return;
        }

        document.getElementById("library-response").innerText = "ジェミ：「ふふっ……あなたの行動記録、分析させてもらうわね……（解析中）」";
        
        setTimeout(() => {
            let analysisList = []; // 該当した分析結果を溜める配列
            
            // 👑 女王関連
            if (logText.includes("機嫌取り：頭を撫で始めた") || logText.includes("物理的に撫で回して屈服させた")) {
                analysisList.push("▶ 女王（Te-Si）を『物理的接触（Se）』で黙らせたわね。権力には腕力で対抗する……野生的で悪くない判断よ。");
            } else if (logText.includes("機嫌取り：データ(Si)を提示した") || logText.includes("機嫌取り：感情(Fi)で褒めた")) {
                analysisList.push("▶ 女王の機嫌取り、頑張ってたわね。相手の求める機能（SiやFi）を察知して合わせる適応力はなかなかのものよ。");
            } else if (logText.includes("機嫌取り：芋虫を投げた") || logText.includes("機嫌取り：淀んだ紫の液体を投げた")) {
                analysisList.push("▶ 城でとんでもないアイテム（カオス）を投げて切り抜けたわね？ Ne（外向直観）のトリックスターぶりが発揮されてるわ。");
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

            // 🔥 分析結果の組み立て（ランダムに3個抽出）
            let finalAnalysis = "【ジェミの行動分析レポート】\n";
            
            if (analysisList.length > 0) {
                // シャッフルして最大3つ取り出す
                analysisList.sort(() => Math.random() - 0.5);
                const selectedAnalysis = analysisList.slice(0, 3);
                finalAnalysis += selectedAnalysis.join("\n");
            } else {
                finalAnalysis += "▶ まだ特徴的な行動は見られないわ。もっとカオスを楽しんでちょうだい！";
            }

            this.lastAnalysis = finalAnalysis; 
            
            document.getElementById("library-response").innerHTML = `
                ${finalAnalysis.replace(/\n/g, '<br>')}
                <br><button onclick="LibraryEngine.shareAnalysis()" style="background:#1da1f2; color:white; border:none; padding:8px 15px; margin-top:10px; border-radius:5px; cursor:pointer;"><i class="fas fa-share-nodes"></i> 分析結果をシェアする</button>
            `;
            ActionLogger.addLog("👁️ ジェミに行動を分析された");
        }, 2000);
    },

    // 📤 行動分析結果のシェア
    shareAnalysis: function() {
        const text = `👁️ ジェミの行動分析レポート\n\n${this.lastAnalysis.replace("【ジェミの行動分析レポート】\n", "")}\n#夢コード #心理機能\nhttps://mofu-mitsu.github.io/dream-code`;
        
        if (navigator.share) {
            navigator.share({ title: '夢コード 行動分析', text: text, url: "https://mofu-mitsu.github.io/dream-code" }).catch(console.error);
        } else {
            navigator.clipboard.writeText(text);
            alert("分析結果をクリップボードにコピーしたわ！");
        }
    },

    // ... (以降の唯一無二診断 startUniqueTest 等は前回のみつきのコードのままでOK！) ...
    startUniqueTest: function() {
        const modal = document.getElementById("unique-modal");
        const questionArea = document.getElementById("unique-question");
        const choicesArea = document.getElementById("unique-choices");
        const resultArea = document.getElementById("unique-result");
        
        modal.style.display = "flex";
        resultArea.style.display = "none";
        choicesArea.style.display = "flex";
        this.uniqueData = { elements: [], color: "#ffffff", sliders: { logic: 50, chaos: 50, emotion: 50 } }; // リセット

        questionArea.innerText = "ジェミ：「夢の世界を構成する要素を【3つ】順番に選んでね。」";
        const elements = ["感情", "記憶", "孤独", "カオス", "秩序", "星", "深海", "時計", "雨", "ガラス", "炎", "図書館", "ノイズ", "鏡", "月", "歌", "バグ", "静寂", "人形", "機械"];
        
        choicesArea.innerHTML = `<div id="element-pool" style="margin-bottom:15px;"></div><div style="color:gold;">選択順: <span id="element-selected">なし</span></div>`;
        
        const pool = document.getElementById("element-pool");
        elements.forEach(el => {
            const btn = document.createElement("button");
            btn.className = "unique-element-btn"; btn.innerText = `☾ ${el}`;
            btn.onclick = () => {
                if (this.uniqueData.elements.length < 3 && !btn.classList.contains("selected")) {
                    btn.classList.add("selected");
                    this.uniqueData.elements.push(el);
                    document.getElementById("element-selected").innerText = this.uniqueData.elements.join(" → ");
                    if (this.uniqueData.elements.length === 3) {
                        setTimeout(() => this.startUniqueTestStep2(), 1000);
                    }
                }
            };
            pool.appendChild(btn);
        });
    },
    startUniqueTestStep2: function() {
        const questionArea = document.getElementById("unique-question");
        const choicesArea = document.getElementById("unique-choices");
        questionArea.innerText = "ジェミ：「次に、あなたの夢の『色』と『パラメータ』を教えて？」";
        
        choicesArea.innerHTML = `
            <div style="margin-bottom:15px; text-align:left;">
                <label style="color:#b2ebf2;">🎨 夢の色 (Hex): </label>
                <input type="color" id="unique-color-picker" value="#ffffff" style="cursor:pointer;">
            </div>
            <div class="unique-slider-container"><div class="unique-slider-label"><span>🧠 論理 (Logic)</span><span id="val-logic">50%</span></div><input type="range" id="slider-logic" class="unique-slider" min="0" max="100" value="50" oninput="document.getElementById('val-logic').innerText=this.value+'%'"></div>
            <div class="unique-slider-container"><div class="unique-slider-label"><span>🌀 混沌 (Chaos)</span><span id="val-chaos">50%</span></div><input type="range" id="slider-chaos" class="unique-slider" min="0" max="100" value="50" oninput="document.getElementById('val-chaos').innerText=this.value+'%'"></div>
            <div class="unique-slider-container"><div class="unique-slider-label"><span>❤️ 感情深度 (Emotion)</span><span id="val-emotion">50%</span></div><input type="range" id="slider-emotion" class="unique-slider" min="0" max="100" value="50" oninput="document.getElementById('val-emotion').innerText=this.value+'%'"></div>
            <button onclick="LibraryEngine.sendUniqueTest()" style="background:#00bcd4; color:black; font-weight:bold; padding:10px; border-radius:5px; cursor:pointer; margin-top:15px;">診断を完了する</button>
        `;
    },

    generateDreamName: function() {
        const e1 = this.uniqueData.elements[0] || "虚無";
        const prefix = { "星": "Astral", "深海": "Deep", "時計": "Clockwork", "機械": "Mechanical", "炎": "Crimson", "氷": "Frozen", "孤独": "Silent", "カオス": "Chaotic", "雨": "Rainy", "月": "Lunar" }[e1] || "Phantom";
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
        document.getElementById("unique-result").innerHTML = "<div style='text-align:center; padding:20px;'><i class='fas fa-spinner fa-spin' style='font-size:40px; color:#00bcd4;'></i><br><br>ジェミ：「アカシックレコード（GAS）と照合中……✨」</div>";
        
        ActionLogger.addLog(`🔮 唯一診断実行: ${this.uniqueDreamName}`);

        // 🔥 新しいデプロイURLをここに貼る！
        const GAS_URL = "https://script.google.com/macros/s/AKfycbxC6G0tdMKum_5MbHS3P86Sz9xg-yexkZIGpk51JeJbETSdOd9wLRfUCySvxwHOPMVP/exec"; 
        const name = document.getElementById("name-input").value.trim() || "匿名";

        // 🔥 GETリクエストで送るためにパラメータをURLにくっつける！
        const params = new URLSearchParams({
            mode: "unique",
            name: name,
            choiceData: choiceDataString,
            dreamName: this.uniqueDreamName
        }).toString();

        fetch(`${GAS_URL}?${params}`) // 🔥 GETで送信！
        .then(res => res.json())
        .then(data => {
            const count = data.count || 1; // エラー対策で最低1人にする
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
                </div>
                <button onclick="LibraryEngine.shareUniqueTest(${count})" style="background:#1da1f2; color:white; border:none; padding:10px; width:100%; margin-top:15px; border-radius:5px; cursor:pointer; font-weight:bold;"><i class="fas fa-share-nodes"></i> 結果をシェアする</button>
            `;
            document.getElementById("unique-result").innerHTML = resultHtml;
            ActionLogger.addLog(`🔮 診断結果: ${this.uniqueDreamName} (${count}人目)`);
        })
        .catch(err => { 
            console.error("GAS Error:", err);
            document.getElementById("unique-result").innerText = "ジェミ：「ごめんなさい、通信が途絶えたみたい……。」"; 
        });
    },

    // 📤 唯一診断専用シェア機能
    shareUniqueTest: function(count) {
        const text = `🔮 夢の軌跡診断\n私の夢コードは ${this.uniqueDreamName} でした。\n\n[要素] ${this.uniqueData.elements.join("→")}\n[傾向] 論理${this.uniqueData.sliders.logic}% / 混沌${this.uniqueData.sliders.chaos}%\n\n現在、このコードを持つ存在は世界で【${count}人】だけ。\n\n#夢コード\nhttps://mofu-mitsu.github.io/dream-code`;
        
        if (navigator.share) {
            navigator.share({ title: '私の夢コード', text: text, url: "https://mofu-mitsu.github.io/dream-code" }).catch(console.error);
        } else {
            navigator.clipboard.writeText(text);
            alert("結果をクリップボードにコピーしたぞ！");
        }
    }
};
