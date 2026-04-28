const MagicEngine = {
    particleInterval: null,
    madHatterInterval: null,
    bugScale: 1, 
    karaokeIntensity: 1,

    // 🧹 全てを消し去る
    resetAllEffects: function() {
        document.body.className = "";
        document.body.style.background = "";
        document.body.removeAttribute("style"); 
        clearInterval(this.particleInterval);
        clearInterval(this.madHatterInterval);
        document.removeEventListener("mousemove", this.trackMouseForDarkness);
        document.querySelectorAll(".magic-particle, #giant-bug-effect, #abyss-overlay").forEach(e => e.remove());
        this.enableWonderlandEscape(false);
        this.bugScale = 1;
        this.karaokeIntensity = 1;
    },
    // 🐛 巨大芋虫を消すだけの関数（お家に入る用）
    stopGiantBug: function() {
        const bug = document.getElementById("giant-bug-effect");
        if(bug) bug.remove();
        this.bugScale = 1;
    },
    castSpell: function() {
        const input = document.getElementById("magic-input").value.trim();
        if (!input) return;

        this.resetAllEffects();

        const spell = magicData.spells[input];
        if (spell) {
            document.body.removeAttribute("style"); 
            this.applyTheme(spell.theme);
            this.showToast(spell.msg);
            
            if (input === "泡パーティ") this.startParticles(['🫧'], "riseUp", "bubble-effect");
            
            // 🐛 巨大芋虫（確実な召喚）
            if (input === "巨大芋虫") {
                setTimeout(() => this.startGiantBug(), 100); // 描画タイミングを少しずらして確実に
            }
            
            // 🎩 進化するカラオケ
            if (input === "カラオケ") {
                this.karaokeIntensity = 1; // 盛り上がりリセット
                this.startKaraokeLevelUp();
            }

            if (input === "自然") this.startParticles(['🌸', '🍄', '🌿', '🍀', '🍃'], "scatter", "nature-effect");
            if (input === "天国") this.startParticles(['🌹', '🪐', '✨', '☁️'], "scatter", "heaven-effect");
            if (input === "歪な愛") this.startParticles(['❤️', '愛', '愛', '💕', '💔', '🌹'], "scatter", "love-effect");
            if (input === "深淵") this.startAbyssEffect();
            if (input === "不思議の国") this.enableWonderlandEscape(true);
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

    // 🎩 加速するカラオケ演出
    startKaraokeLevelUp: function() {
        const updateParticles = () => {
            clearInterval(this.particleInterval);
            const intervalTime = Math.max(50, 400 - (this.karaokeIntensity * 35)); // 段々速くなる
            const speedTime = Math.max(0.5, 4 - (this.karaokeIntensity * 0.35)); // アニメ速度アップ

            this.particleInterval = setInterval(() => {
                const chars = ['🎤', '🎵', '🎶', '🔥', '✨', '🥳', '🎉', '💥', '😎', '🕺', 'イェイ！', 'Foooo!!'];
                const p = document.createElement("div");
                p.innerText = chars[Math.floor(Math.random() * chars.length)];
                p.className = "magic-particle flowRight karaoke-effect";
                p.style.top = Math.random() * 90 + "vh";
                p.style.setProperty('--speed', speedTime + "s"); // CSSに速度を送る
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
            if (this.karaokeIntensity < 10) {
                this.karaokeIntensity += 1; // 叫ぶたびにボルテージアップ！
                updateParticles(); // 演出を更新
            }
            this.showToast("🎩「" + madLines[Math.floor(Math.random() * madLines.length)] + "」");
        }, 4000);
    },

    // 🌸 演出システム
    startParticles: function(charArray, type, className) {
        clearInterval(this.particleInterval);
        this.particleInterval = setInterval(() => {
            const p = document.createElement("div");
            p.innerText = charArray[Math.floor(Math.random() * charArray.length)];
            p.className = `magic-particle ${type} ${className}`;

            if (type === "riseUp") {
                p.style.left = Math.random() * 100 + "vw";
                p.style.bottom = "-50px";
            } else if (type === "scatter") {
                p.style.top = Math.random() * 90 + "vh";
                p.style.left = Math.random() * 90 + "vw";
            }

            p.style.fontSize = (Math.random() * 30 + 20) + "px";
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 4000);
        }, 300);
    },

    // 他の関数はそのまま（showToast, enableWonderlandEscape, castColor, etc.）
    showToast: function(msg) {
        let toast = document.getElementById("toast");
        if (!toast) { toast = document.createElement("div"); toast.id = "toast"; document.body.appendChild(toast); }
        toast.style.zIndex = "99999"; toast.innerText = msg; toast.className = "show";
        setTimeout(() => { if(toast.innerText === msg) toast.className = ""; }, 3000);
    },
    trackMouseForDarkness: function(e) { document.body.style.setProperty('--mouse-x', e.clientX + 'px'); document.body.style.setProperty('--mouse-y', e.clientY + 'px'); },
    castColor: function() { this.resetAllEffects(); const color = document.getElementById("magic-color").value; document.body.style.background = `radial-gradient(circle, ${color} 0%, #000 100%)`; this.showToast(`「世界が ${color} に染まったわ……✨」`); },
    applyTheme: function(themeClass) { document.body.className = themeClass; },
    openGrimoire: function() { const modal = document.getElementById("grimoire-modal"); const listArea = document.getElementById("grimoire-list"); let html = `<div class="grimoire-category">【環境魔法】</div>`; Object.keys(magicData.spells).forEach(key => html += `・${key}<br>`); html += `<div class="grimoire-category">【色彩魔法】</div>`; Object.keys(magicData.colors).forEach(key => html += `・${key}<br>`); listArea.innerHTML = html; modal.style.display = "flex"; },
    closeGrimoire: function() { document.getElementById("grimoire-modal").style.display = "none"; },
    enableWonderlandEscape: function(enable) { const objects = document.querySelectorAll(".wonder-object"); objects.forEach(obj => { if (enable) { obj.classList.add("wonder-escape"); obj.onmouseenter = () => { const jumpX = (Math.random() - 0.5) * 300; const jumpY = (Math.random() - 0.5) * 300; obj.style.transform = `translate(${jumpX}px, ${jumpY}px)`; }; } else { obj.classList.remove("wonder-escape"); obj.onmouseenter = null; obj.style.transform = ""; } }); },
    startAbyssEffect: function() { document.body.style.background = "#050010"; const overlay = document.createElement("div"); overlay.id = "abyss-overlay"; overlay.style.position = "fixed"; overlay.style.inset = "0"; overlay.style.background = "repeating-radial-gradient(circle, transparent, #000 100px)"; overlay.style.opacity = "0.5"; overlay.style.animation = "pulse 5s infinite"; overlay.style.pointerEvents = "none"; document.body.appendChild(overlay); }
};
