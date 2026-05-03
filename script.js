// script.js 完全版

function startFall() {
    const nameModal = document.getElementById("name-modal");
    const rabbitScreen = document.getElementById("rabbit-hole-screen");
    const worldMapWrapper = document.getElementById("world-map-wrapper");
    const worldMap = document.getElementById("world-map"); 
    const magicBar = document.getElementById("dream-code-bar");
    
    // 🔥 ここ！ 穴に落ちる瞬間にホームボタンを消す！
    const homeBtn = document.getElementById("home-btn");
    if (homeBtn) homeBtn.style.display = "none";

    nameModal.style.display = "none";
    rabbitScreen.style.display = "flex"; 
    
    setTimeout(() => { document.body.classList.add("falling"); }, 50);

    setTimeout(() => {
        document.body.classList.remove("falling");
        rabbitScreen.style.display = "none";
        
        if (worldMapWrapper) worldMapWrapper.style.display = "block"; 
        if (worldMap) worldMap.style.display = "block"; 
        if (magicBar) magicBar.style.display = "flex";
    }, 3000);
}

// 💋 ダーリンの家を開く
function openDarlingHouse() {
    MagicEngine.stopGiantBug();
    document.getElementById("darling-window").style.display = "flex";
    if (typeof ActionLogger !== 'undefined') ActionLogger.addLog("💋 ダーリンの家に入室した");
    const type = document.getElementById("type-input").value.toUpperCase();
    
    const liiBtn1 = document.getElementById("lii-special-btn");
    const liiBtn2 = document.getElementById("lii-label-btn");
    const liiBtn3 = document.getElementById("lii-se-btn");

    if (type.includes("LII") || type.includes("INTJ")) {
        DarlingEngine.updateLog(`「……あら。${type}のダーリン？ どうやって崩してあげようかしら……♡」`);
        if (liiBtn1) liiBtn1.style.display = "inline-block";
        if (liiBtn2) liiBtn2.style.display = "inline-block";
        if (liiBtn3) liiBtn3.style.display = "inline-block";
    } else {
        DarlingEngine.updateLog(`「ねえダーリン♡ 待ってたわよ。」`);
        if (liiBtn1) liiBtn1.style.display = "none";
        if (liiBtn2) liiBtn2.style.display = "none";
        if (liiBtn3) liiBtn3.style.display = "none";
    }
    startDarlingParticles();
}

function closeDarlingHouse() { 
    document.getElementById("darling-window").style.display = "none"; 
    document.getElementById("card-display").innerHTML = "";
    stopDarlingParticles();
}

// 📂 メニューの折りたたみ
function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    if (menu.classList.contains("open")) {
        menu.classList.remove("open");
    } else {
        document.querySelectorAll(".menu-content").forEach(m => m.classList.remove("open"));
        menu.classList.add("open");
    }
}

// 🃏 豪華演出のパーティクル
let particleInterval;
function startDarlingParticles() {
    const container = document.getElementById("darling-window");
    const symbols = ['fa-heart', 'fa-diamond', 'fa-club', 'fa-spade'];
    particleInterval = setInterval(() => {
        const p = document.createElement("i");
        p.className = `fas ${symbols[Math.floor(Math.random() * symbols.length)]} darling-particle`;
        p.style.left = Math.random() * 100 + "vw";
        p.style.color = Math.random() > 0.5 ? "rgba(255, 0, 127, 0.5)" : "rgba(157, 129, 255, 0.5)"; 
        container.appendChild(p);
        setTimeout(() => { p.remove(); }, 4000);
    }, 600);
}
function stopDarlingParticles() {
    clearInterval(particleInterval);
    document.querySelectorAll(".darling-particle").forEach(p => p.remove());
}

// 🪄 夢コード実行用（環境変更）
function castDreamCode() {
    const code = document.getElementById("magic-input").value;
    const theme = dreamData.magics[code];
    if (theme) {
        document.body.className = theme;
        alert(`ふふ、「${code}」の魔法をかけてあげたわ♡`);
    } else {
        alert("そのコードはまだ夢の中で眠っているみたい。");
    }
    document.getElementById("magic-input").value = "";
}
