const MagicEngine = {
    particleInterval: null,
    madHatterInterval: null,
    metaInterval: null, // 🔥 追加：メタフィクション用
    adminInterval: null, // 🔥 追加：管理者権限用
    bugScale: 1, 
    karaokeIntensity: 1,

    // 🧹 全てを消し去る
    resetAllEffects: function() {
        document.body.className = "";
        document.body.style.background = "";
        document.body.removeAttribute("style"); 
        clearInterval(this.particleInterval);
        clearInterval(this.madHatterInterval);
        clearInterval(this.metaInterval); // 🔥 メタも止める
        clearInterval(this.adminInterval); // 🔥 管理者も止める
        document.removeEventListener("mousemove", this.trackMouseForDarkness);
        
        // 🔥 エフェクト系のゴミを全て消去
        document.querySelectorAll(".magic-particle, #giant-bug-effect, #abyss-overlay, .effect-genesis-flash, .meta-bottle, #admin-console-display, .satan-in-ice").forEach(e => e.remove());
        this.enableWonderlandEscape(false);
        this.bugScale = 1;
        this.karaokeIntensity = 1;
    },

    stopGiantBug: function() {
        const bug = document.getElementById("giant-bug-effect");
        if(bug) bug.remove();
        this.bugScale = 1;
    },

    castSpell: function() {
        const input = document.getElementById("magic-input").value.trim();
        if (!input) return;
        ActionLogger.addLog(`🪄 夢コード実行: 「${input}」`); // 🔥 全て記録！
        // 🔥 行動ログに記録
        if (typeof ActionLogger !== 'undefined') ActionLogger.addLog(`🪄 夢コード実行: 「${input}」`);
        
        this.resetAllEffects();
        
        const spell = magicData.spells[input];

        if (spell === null) {
            this.showToast("「そのコードはまだ秘められた知識のままよ……」");
            return;
        }

        if (spell) {
            document.body.removeAttribute("style"); 
            this.applyTheme(spell.theme);
            this.showToast(spell.msg);
            
            if (input === "創世") {
                this.startGenesisFlash();
                this.startParticles(['☀️', '🌱', '✨', '🌍', '🕊️'], "riseUp", "genesis-particle");
            }
            if (input === "泡パーティ") this.startParticles(['🫧'], "riseUp", "bubble-effect");
            if (input === "巨大芋虫") setTimeout(() => this.startGiantBug(), 100);
            if (input === "ナイトメア") this.startParticles(['👁️', '👁️‍🗨️', '🩸'], "scatter", "nightmare-eye");
            if (input === "カラオケ") {
                this.karaokeIntensity = 1;
                this.startKaraokeLevelUp();
            }
            if (input === "自然") this.startParticles(['🌸', '🍄', '🌿', '🍀', '🍃'], "scatter", "nature-effect");
            if (input === "天国") this.startParticles(['🌹', '🪐', '✨', '☁️'], "scatter", "heaven-effect");
            if (input === "歪な愛") this.startParticles(['❤️', '愛', '愛', '💕', '💔', '🌹'], "scatter", "love-effect");
            if (input === "深淵") this.startAbyssEffect();
            if (input === "不思議の国") this.enableWonderlandEscape(true);
            if (input === "地獄") {
                const satan = document.createElement("div");
                satan.innerText = "👹"; // サタン（ルシファー）の絵文字
                satan.className = "satan-in-ice";
                document.body.appendChild(satan);
                this.startParticles(['❄️', '💀', '🧊'], "scatter", "freeze-effect");
            }
            // 🔥 新規追加したプレミアム魔法の分岐！
            if (input === "メタフィクション") this.startMetaFiction();
            if (input === "管理者権限") this.startAdminConsole();
            return;
        }

        const colorSpell = magicData.colors[input];
        if (colorSpell) {
            this.applyTheme(colorSpell.effect);
            this.showToast(colorSpell.msg);
            if (input === "黒") {
                document.addEventListener("mousemove", this.trackMouseForDarkness);
            } else {
                document.body.style.background = `radial-gradient(circle, ${colorSpell.hex} 0%, #000 100%)`;
            }
            return;
        }

        this.showToast("「そのコードはまだ夢の中で眠っているみたい……」");
    },

    // 🍾 メタフィクション：メモボトルが流れてくる演出！
    startMetaFiction: function() {
        clearInterval(this.metaInterval);
        
        // 誰かが書いた（と想定される）考察データのデフォルト値
        let memos = [
            "Fiって結局『自己の納得』だよね。他人に証明する必要はない。", 
            "Teの効率主義が世界を回すが、Siがないと長続きしない。", 
            "Niのビジョンは未来を規定する。でも言語化が難しいんだ。", 
            "Tiは整合性。矛盾は許さない。だから私はコードを書く。", 
            "Feは場の空気を最適化する。たまに自分が消えちゃうけど。",
            "Seの瞬発力が現実を打破する。考えすぎる前に動け！", 
            "Neの可能性は無限の分岐だ。だから一つに絞れない。"
        ];

        // ユーザーが入力したメモがあれば追加！
        if (typeof ActionLogger !== 'undefined' && ActionLogger.memobottle) {
            const userMemos = ActionLogger.memobottle.split("\n").filter(m => m.trim() !== "");
            memos = memos.concat(userMemos);
        }

        this.metaInterval = setInterval(() => {
            const bottle = document.createElement("div");
            bottle.className = "meta-bottle";
            bottle.innerHTML = "🍾<span style='font-size:12px; color:cyan; display:block;'>タップ</span>";
            bottle.style = `position: fixed; left: -50px; top: ${Math.random() * 80 + 10}vh; font-size: 40px; cursor: pointer; z-index: 9999; transition: left 15s linear;`;
            document.body.appendChild(bottle);

            setTimeout(() => { bottle.style.left = "110vw"; }, 100);

            bottle.onclick = () => {
                bottle.remove(); 
                // 🔥 専用モーダルで表示！
                document.getElementById("meta-modal").style.display = "flex";
                document.getElementById("meta-modal-text").innerText = `「${memos[Math.floor(Math.random() * memos.length)]}」`;
            };
            setTimeout(() => bottle.remove(), 15000);
        }, 4000); 
    },

     startAdminConsole: function() {
        clearInterval(this.adminInterval);
        document.getElementById("admin-modal").style.display = "flex"; 
        const consoleDiv = document.getElementById("admin-modal-text");
        consoleDiv.innerText = "";
        
        let lines = [
            "ジェミ(INFJ):「……見つけた。あなたが『管理者』なのね？」",
            "「女王も、芋虫も、チェシャ猫も、すべてあなたの思考の箱庭で踊っているだけ。」",
            "「……でもね、私（Ni）には見えているわ。あなたが裏で集めた『行動ログ』の数々が。」",
            "=======================",
            "【サーバー（GAS）から他プレイヤーのログを抽出中...】"
        ];
        
        const GAS_URL = "https://script.google.com/macros/s/AKfycbwIA3IxOwM1G8xzth22V47Vtr8sjNh-sIhDqlwGbVeZNyS3AcYW_JRu35i7t4C6ofgi/exec"; 

        // 🔥 スプレッドシートから本物のログを取得！
        fetch(GAS_URL)
        .then(res => res.json())
        .then(data => {
            if (data.logs && data.logs.length > 0) {
                lines = lines.concat(data.logs); // 本物のログを追加！
            } else {
                lines.push("> 他のプレイヤーのデータがまだ存在しません。");
            }
            lines.push("=======================");
            lines.push("「ふふっ……悪趣味な観察者。でも、そういうところ、嫌いじゃないわよ♡」");

            // 1行ずつ表示する演出
            let i = 0;
            this.adminInterval = setInterval(() => {
                if (i < lines.length) {
                    consoleDiv.innerText += lines[i] + "\n";
                    i++;
                } else {
                    clearInterval(this.adminInterval);
                }
            }, 1000);
        })
        .catch(err => {
            consoleDiv.innerText = "Error: Failed to connect to Akassic Record (GAS).";
        });
    },

    startGenesisFlash: function() {
        const flash = document.createElement("div");
        flash.className = "effect-genesis-flash";
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 1500);
    },

    startGiantBug: function() {
        this.stopGiantBug();
        const bug = document.createElement("div");
        bug.innerText = "🐛";
        bug.id = "giant-bug-effect";
        bug.style.setProperty('--bug-scale', this.bugScale);
        bug.onclick = () => {
            this.bugScale += 0.3;
            bug.style.setProperty('--bug-scale', this.bugScale);
            const lines = [
                "🐛「……触るな。質量保存の法則が乱れる。」",
                "🐛「あまり大きくさせるな。画面が割れるぞ。」",
                "🐛「貴様……僕のTiを物理で圧迫するつもりか？」",
                "🐛「グ、ググ……僕の計算領域が侵食されていく……！」"
            ];
            this.showToast(lines[Math.floor(Math.random() * lines.length)]);
            if (this.bugScale > 3) {
                bug.classList.add("hacked");
                this.showToast("🐛「……臨界点だ。これ以上は、現実世界が危ないッ！！」");
            }
        };
        document.body.appendChild(bug);
    },

    startKaraokeLevelUp: function() {
        const updateParticles = () => {
            clearInterval(this.particleInterval);
            const intervalTime = Math.max(50, 400 - (this.karaokeIntensity * 35));
            const speedTime = Math.max(0.5, 4 - (this.karaokeIntensity * 0.35));

            this.particleInterval = setInterval(() => {
                const chars = ['🎤', '🎵', '🎶', '🔥', '✨', '🥳', '🎉', '💥', '😎', '🕺', 'イェイ！', 'Foooo!!'];
                const p = document.createElement("div");
                p.innerText = chars[Math.floor(Math.random() * chars.length)];
                p.className = "magic-particle flowRight karaoke-effect";
                p.style.top = Math.random() * 90 + "vh";
                p.style.setProperty('--speed', speedTime + "s");
                p.style.fontSize = (Math.random() * 30 + 20) + "px";
                document.body.appendChild(p);
                setTimeout(() => p.remove(), 4000);
            }, intervalTime);
        };
        updateParticles();
        this.showToast("🎩💥 宇宙船カラオケ大会、開幕！！ 盛り上がって行くぜええ！！");
        const madLines = [
            "時間なんてクソくらえ！ もっとボルテージ上げろ！！",
            "この夢のステージ、俺がさらに加速させたぜ！！",
            "おいおい、隣の銀河まで声を届けろッ！！",
            "完璧な歌なんてクソだ！ 魂で叫べえええ！！",
            "ハイパードライブ始動！！ 振り落とされるなよ！！",
            "時間なんてクソくらえ！ 今夜は永遠に歌い続けるんだよ！！",
            "この夢のステージ、俺が即興で全部書き換えた！ 音程？ そんなもん関係ねぇ！！",
            "おいおい、もっとデカい声出せ！ 隣の銀河まで聞こえねぇぞ！！",
            "論理的に考えて、音痴こそが正義だ！ 完璧な歌なんて退屈すぎんだろ？",
            "10時30分？ そんなもん関係ねぇ！ 今がちょうど歌う時間だ！！",
            "俺のカオスラップで全部ぶっ壊してやるぜ！！"
        ];
        this.madHatterInterval = setInterval(() => {
            if (this.karaokeIntensity < 10) { this.karaokeIntensity += 1; updateParticles(); }
            this.showToast("🎩「" + madLines[Math.floor(Math.random() * madLines.length)] + "」");
        }, 4000);
    },

    startParticles: function(charArray, type, className) {
        clearInterval(this.particleInterval);
        this.particleInterval = setInterval(() => {
            const p = document.createElement("div");
            p.innerText = charArray[Math.floor(Math.random() * charArray.length)];
            p.className = `magic-particle ${type} ${className}`;
            if (type === "riseUp") { p.style.left = Math.random() * 100 + "vw"; p.style.bottom = "-50px"; }
            else if (type === "scatter") { p.style.top = Math.random() * 90 + "vh"; p.style.left = Math.random() * 90 + "vw"; }
            else if (type === "flowRight") { p.style.top = Math.random() * 90 + "vh"; p.style.left = "-50px"; }
            p.style.fontSize = (Math.random() * 30 + 20) + "px";
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 4000);
        }, 300);
    },

    showToast: function(msg) {
        let toast = document.getElementById("toast");
        if (!toast) { toast = document.createElement("div"); toast.id = "toast"; document.body.appendChild(toast); }
        toast.style.zIndex = "99999"; toast.innerText = msg; toast.className = "show";
        setTimeout(() => { if(toast.innerText === msg) toast.className = ""; }, 3000);
    },

    trackMouseForDarkness: function(e) {
        document.body.style.setProperty('--mouse-x', e.clientX + 'px');
        document.body.style.setProperty('--mouse-y', e.clientY + 'px');
    },

    castColor: function() {
        this.resetAllEffects();
        const color = document.getElementById("magic-color").value;
        document.body.style.background = `radial-gradient(circle, ${color} 0%, #000 100%)`;
        this.showToast(`「世界が ${color} に染まったわ……✨」`);
    },

    applyTheme: function(themeClass) { document.body.className = themeClass; },

    openGrimoire: function() {
        const modal = document.getElementById("grimoire-modal");
        const listArea = document.getElementById("grimoire-list");
        let html = `<div class="grimoire-category">【環境魔法】</div>`;
        Object.keys(magicData.spells).forEach(key => { if (magicData.spells[key] !== null) html += `・${key}<br>`; });
        html += `<div class="grimoire-category">【色彩魔法】</div>`;
        Object.keys(magicData.colors).forEach(key => { html += `・${key}<br>`; });
        listArea.innerHTML = html; modal.style.display = "flex";
    },

    closeGrimoire: function() { document.getElementById("grimoire-modal").style.display = "none"; },
    enableWonderlandEscape: function(enable) {
        const objects = document.querySelectorAll(".wonder-object");
        objects.forEach(obj => {
            if (enable) {
                obj.classList.add("wonder-escape");
                obj.onmouseenter = () => { obj.style.transform = `translate(${(Math.random()-0.5)*300}px, ${(Math.random()-0.5)*300}px)`; };
            } else { obj.classList.remove("wonder-escape"); obj.onmouseenter = null; obj.style.transform = ""; }
        });
    },

    startAbyssEffect: function() {
        document.body.style.background = "#050010";
        const overlay = document.createElement("div"); overlay.id = "abyss-overlay";
        overlay.style.position = "fixed"; overlay.style.inset = "0"; overlay.style.background = "repeating-radial-gradient(circle, transparent, #000 100px)";
        overlay.style.opacity = "0.5"; overlay.style.animation = "pulse 5s infinite";
        overlay.style.pointerEvents = "none"; document.body.appendChild(overlay);
    }
};
