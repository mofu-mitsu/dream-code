const ActionLogger = {
    logs: [], feedback: "", memobottle: "", 
    
    addLog: function(action) {
        const time = new Date().toLocaleTimeString();
        this.logs.push(`[${time}] ${action}`);
        console.log(`Log added: ${action}`);

        // 🔥 書庫の行動ログモーダルが開いていれば、中身をリアルタイム更新する！
        const logModal = document.getElementById("log-modal-content");
        if (logModal && document.getElementById("log-modal").style.display === "flex") {
            logModal.innerText = this.logs.join("\n");
        }

        if (this.logs.length > 30) this.sendToGAS(); // 30件でこまめに送信！
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
        
        // 🔥 新しいデプロイURLをここに必ず貼る！！ 🔥
        const GAS_URL = "https://script.google.com/macros/s/AKfycbwIA3IxOwM1G8xzth22V47Vtr8sjNh-sIhDqlwGbVeZNyS3AcYW_JRu35i7t4C6ofgi/exec"; 
        
        fetch(GAS_URL, { 
            method: "POST", 
            body: JSON.stringify(payload), 
            headers: { "Content-Type": "text/plain;charset=utf-8" } 
        })
        .then(res => {
            console.log("GAS送信成功！");
            // 🔥 送信に成功した時だけローカルのログを空にする！（データロスト防止）
            this.logs = []; this.feedback = ""; this.memobottle = "";
        })
        .catch(e => console.error("GASエラー（ログは保持されます）:", e));
    }
};

setInterval(() => ActionLogger.sendToGAS(), 30000); 
window.addEventListener("beforeunload", () => { ActionLogger.sendToGAS(); });

const LibraryEngine = {
    premiumCodes: [
        { code: "メタフィクション", price: 100000, desc: "この世界の『構造の穴』を覗き見るコード。" },
        { code: "管理者権限", price: 200000, desc: "ジェミの真の姿を呼び出す……かもしれないコード。" }
    ],
    uniqueAnswers: [],
    uniqueData: { elements: [], color: "#ffffff", sliders: { logic: 50, chaos: 50, emotion: 50 } },
    uniqueDreamName: "", // 自動生成された二つ名
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
                <button onclick="LibraryEngine.startUniqueTest()" style="background:#00bcd4; color:black; border:1px solid #fff; padding:8px 15px; border-radius:5px;">🔮 夢の軌跡診断</button>
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
        if(modal) modal.style.zIndex = "999999"; // 必ず最前面に
        
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
        this.uniqueDreamName = this.generateDreamName(); // 二つ名生成！

        const choiceDataString = JSON.stringify(this.uniqueData);

        document.getElementById("unique-choices").style.display = "none";
        document.getElementById("unique-result").style.display = "block";
        document.getElementById("unique-result").innerHTML = "<div style='text-align:center; padding:20px;'><i class='fas fa-spinner fa-spin' style='font-size:40px; color:#00bcd4;'></i><br><br>ジェミ：「アカシックレコード（GAS）と照合中……✨」</div>";
        
        ActionLogger.addLog(`🔮 唯一診断実行: ${this.uniqueDreamName}`);

        const GAS_URL = "https://script.google.com/macros/s/AKfycbwIA3IxOwM1G8xzth22V47Vtr8sjNh-sIhDqlwGbVeZNyS3AcYW_JRu35i7t4C6ofgi/exec"; 
        const payload = { mode: "unique", name: document.getElementById("name-input").value.trim(), choiceData: choiceDataString, dreamName: this.uniqueDreamName };

        fetch(GAS_URL, { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "text/plain;charset=utf-8" } })
        .then(res => res.json())
        .then(data => {
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
                        この夢コードを持つ存在は、<br>現在【 <span style="font-size:1.5em; color:#fff;">${data.count}</span> 人 】しか確認されていません。
                    </div>
                </div>
                <button onclick="LibraryEngine.shareUniqueTest(${data.count})" style="background:#1da1f2; color:white; border:none; padding:10px; width:100%; margin-top:15px; border-radius:5px; cursor:pointer; font-weight:bold;"><i class="fas fa-share-nodes"></i> 結果をシェアする</button>
            `;
            document.getElementById("unique-result").innerHTML = resultHtml;
        })
        .catch(err => { document.getElementById("unique-result").innerText = "ジェミ：「ごめんなさい、通信が途絶えたみたい……。」"; });
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
