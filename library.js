// 📊 プレイヤーの行動ログを記録・送信するシステム
const ActionLogger = {
    logs: [],
    
    addLog: function(action) {
        const time = new Date().toLocaleTimeString();
        this.logs.push(`[${time}] ${action}`);
        console.log(`Log added: ${action}`); // デバッグ用
    },

    // 📩 ページを閉じる時や追放時にGASへ送信！
    sendToGAS: function() {
        if (this.logs.length === 0) return;
        const userName = document.getElementById("name-input").value.trim() || "匿名";
        const userType = document.getElementById("type-input").value.trim() || "不明";
        
        const payload = {
            name: userName,
            type: userType,
            actions: this.logs.join("\n"),
            email: "momoka.mimika1122@gmail.com" // みつきのアドレス
        };

        // ※ここに、後でみつきがデプロイするGASのWebアプリURLを入れる！
        const GAS_URL = "ここにGASのURLを貼る"; 
        
        // fetchでPOST送信（ページ閉じるときはnavigator.sendBeaconが安全）
        if (navigator.sendBeacon) {
            navigator.sendBeacon(GAS_URL, JSON.stringify(payload));
        }
    }
};

// ページを閉じる時にログ送信を実行！
window.addEventListener("beforeunload", () => {
    ActionLogger.sendToGAS();
});

// 📚 ジェミの書庫システム
const LibraryEngine = {
    premiumCodes: [
        { code: "メタフィクション", price: 100000, desc: "この世界の『構造の穴』を覗き見るコード。" },
        { code: "管理者権限", price: 200000, desc: "ジェミの真の姿を呼び出す……かもしれないコード。" }
    ],

    getUserName: function() { return document.getElementById("name-input").value.trim() || "あなた"; },
    updateLog: function(text) { document.getElementById("library-response").innerText = text; },

    openHouse: function() {
        MagicEngine.stopGiantBug();
        document.getElementById("library-window").style.display = "flex";
        
        const name = this.getUserName();
        this.updateLog(`ジェミ：「いらっしゃい、${name}。ここは私の書庫。${name}との会話のログや、この世界の設計図が眠っているわ。」`);
        this.showMenus();
    },

    closeHouse: function() { document.getElementById("library-window").style.display = "none"; },

    // 📖 書庫のメニュー構築
    showMenus: function() {
        const list = document.getElementById("library-shop-list");
        list.innerHTML = `
            <div style="display:flex; justify-content:center; gap:10px; margin-bottom:15px;">
                <button onclick="LibraryEngine.openForm('意見箱')" style="background:#4b0082; color:white; border:1px solid #9d81ff; padding:8px 15px; border-radius:5px;">📮 意見箱</button>
                <button onclick="LibraryEngine.openForm('メモボトル')" style="background:#4b0082; color:white; border:1px solid #9d81ff; padding:8px 15px; border-radius:5px;">🍾 メモボトル</button>
                <button onclick="LibraryEngine.viewLogs()" style="background:#1a237e; color:white; border:1px solid #4caf50; padding:8px 15px; border-radius:5px;">📜 行動ログ</button>
            </div>
            <h4 style="color:#9d81ff; margin-top:20px; border-bottom:1px solid #9d81ff;">📕 禁断の夢コード（有料）</h4>
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
            this.updateLog(`ジェミ：「まいどあり♡ 特別な魔法『${code}』を使えるようにしておいたわ。入力欄で試してみて？」`);
            ActionLogger.addLog(`[購入] プレミアム魔法 '${code}'`);
            
            // 魔法の解禁
            if (code === "メタフィクション") {
                magicData.spells["メタフィクション"] = { theme: "theme-meta", msg: "ジェミ：「みんなの思考の破片が、世界に溶け出していく……🧠✨」" };
            }
            if (code === "管理者権限") {
                magicData.spells["管理者権限"] = { theme: "theme-admin", msg: "「……System Override. Welcome back, Administrator.」" };
            }
        } else {
            this.updateLog(`ジェミ：「あら、${this.getUserName()}。お金が足りないみたいよ？」`);
        }
    },

    // 📮 意見箱 ＆ メモボトルの入力
    openForm: function(type) {
        const placeholder = type === "意見箱" ? "追加してほしい機能やツールを書いてね！" : "あなたのMBTI・ソシオ等の知識や考察を自由に書き込んで！";
        
        TeaPartyEngine.openInputModal(`✨ ${type}`, `ジェミ：「${this.getUserName()}の考えを聞かせて？」`, placeholder, (text) => {
            if (!text) return;
            this.updateLog(`ジェミ：「ありがとう、${this.getUserName()}！ しっかり記録したわ！」`);
            ActionLogger.addLog(`[${type}] ${text}`); // ログに記録！
        });
    },

    // 📜 自分の行動ログを見る
    viewLogs: function() {
        if (ActionLogger.logs.length === 0) {
            this.updateLog(`ジェミ：「まだ${this.getUserName()}の記録はないみたい。夢の世界を探索してみて！」`);
            return;
        }
        const logText = ActionLogger.logs.join("\n");
        alert(`【${this.getUserName()} の行動記録】\n\n${logText}`);
    }
};
