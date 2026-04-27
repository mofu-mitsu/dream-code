const MagicEngine = {
    castSpell: function() {
        const input = document.getElementById("magic-input").value.trim();
        if (!input) return;

        document.body.className = "";
        this.stopFoamParty();
        this.stopGiantBug(); // 巨大芋虫リセット

        const spell = magicData.spells[input];
        if (spell) {
            this.applyTheme(spell.theme);
            this.showToast(spell.msg);
            if (input === "泡パーティ") this.startFoamParty();
            if (input === "巨大芋虫") this.startGiantBug();
            return;
        }

        const colorSpell = magicData.colors[input];
        if (colorSpell) {
            this.applyTheme(colorSpell.effect);
            this.showToast(colorSpell.msg);
            document.body.style.background = `radial-gradient(circle, ${colorSpell.hex} 0%, #000 100%)`;
            return;
        }

        this.showToast("「そのコードはまだ夢の中で眠っているみたい……」");
    },

    castColor: function() {
        const color = document.getElementById("magic-color").value;
        document.body.style.background = `radial-gradient(circle, ${color} 0%, #000 100%)`;
        this.showToast(`「世界が ${color} に染まったわ……✨」`);
    },

    applyTheme: function(themeClass) { document.body.className = themeClass; },

    showToast: function(msg) {
        const toast = document.getElementById("toast");
        if (!toast) return; 
        toast.innerText = msg;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
    },

    // 📖 魔導書の開閉
    openGrimoire: function() {
        const modal = document.getElementById("grimoire-modal");
        const listArea = document.getElementById("grimoire-list");
        
        let html = `<div class="grimoire-category">【環境魔法】</div>`;
        Object.keys(magicData.spells).forEach(key => html += `・${key}<br>`);
        html += `<div class="grimoire-category">【色彩魔法】</div>`;
        Object.keys(magicData.colors).forEach(key => html += `・${key}<br>`);
        
        listArea.innerHTML = html;
        modal.style.display = "flex";
    },
    closeGrimoire: function() {
        document.getElementById("grimoire-modal").style.display = "none";
    },

    foamInterval: null,
    startFoamParty: function() {
        document.body.style.background = "#1a1a2e";
        this.foamInterval = setInterval(() => {
            const bubble = document.createElement("i");
            bubble.className = "fas fa-circle bubble-effect";
            bubble.style.left = Math.random() * 100 + "vw";
            bubble.style.width = bubble.style.height = (Math.random() * 50 + 20) + "px";
            bubble.style.opacity = Math.random() * 0.5 + 0.2;
            document.body.appendChild(bubble);
            setTimeout(() => bubble.remove(), 4000);
        }, 100);
    },
    stopFoamParty: function() {
        clearInterval(this.foamInterval);
        document.querySelectorAll(".bubble-effect").forEach(b => b.remove());
    },

    // 🐛 巨大芋虫魔法
    startGiantBug: function() {
        const bug = document.createElement("div");
        bug.innerText = "🐛";
        bug.id = "giant-bug-effect";
        bug.style.position = "absolute";
        bug.style.fontSize = "300px";
        bug.style.top = "50%"; bug.style.left = "50%";
        bug.style.transform = "translate(-50%, -50%)";
        bug.style.zIndex = "-1"; // 背景として置く
        bug.style.animation = "shake 0.5s infinite alternate";
        document.body.appendChild(bug);
    },
    stopGiantBug: function() {
        const bug = document.getElementById("giant-bug-effect");
        if(bug) bug.remove();
    }
};