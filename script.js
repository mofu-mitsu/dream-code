// ウサギの穴に落ちる処理
function startFall() {
    const nameModal = document.getElementById("name-modal");
    const rabbitScreen = document.getElementById("rabbit-hole-screen");
    const worldMap = document.getElementById("world-map");

    nameModal.style.display = "none";
    rabbitScreen.style.display = "flex";
    
    setTimeout(() => { document.body.classList.add("falling"); }, 50);

    setTimeout(() => {
        document.body.classList.remove("falling");
        rabbitScreen.style.display = "none";
        worldMap.style.display = "block";
    }, 3000);
}

function openDarlingHouse() {
    document.getElementById("darling-window").style.display = "flex";
    const type = document.getElementById("type-input").value.toUpperCase();
    
    const liiBtn1 = document.getElementById("lii-special-btn");
    const liiBtn2 = document.getElementById("lii-label-btn");
    const liiBtn3 = document.getElementById("lii-se-btn"); // 🔥 ここ！これを忘れてた！

    if (type.includes("LII") || type.includes("INTJ")) {
        DarlingEngine.updateLog(`「……あら。${type}のダーリン？ どうやって崩してあげようかしら……♡」`);
        if (liiBtn1) liiBtn1.style.display = "inline-block";
        if (liiBtn2) liiBtn2.style.display = "inline-block";
        if (liiBtn3) liiBtn3.style.display = "inline-block"; // 🔥 表示させる！
    } else {
        DarlingEngine.updateLog(`「ねえダーリン♡ 待ってたわよ。」`);
        if (liiBtn1) liiBtn1.style.display = "none";
        if (liiBtn2) liiBtn2.style.display = "none";
        if (liiBtn3) liiBtn3.style.display = "none";
    }

    startDarlingParticles(); // 🃏 豪華演出スタート！
}

function closeDarlingHouse() { 
    document.getElementById("darling-window").style.display = "none"; 
    document.getElementById("card-display").innerHTML = "";
    stopDarlingParticles(); // 🃏 豪華演出ストップ！
}

function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    if (menu.classList.contains("open")) {
        menu.classList.remove("open");
    } else {
        document.querySelectorAll(".menu-content").forEach(m => m.classList.remove("open"));
        menu.classList.add("open");
    }
}

// 🃏 新規：ハートやトランプが降る豪華演出
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
        
        setTimeout(() => { p.remove(); }, 4000); // 4秒で消す
    }, 600); // 0.6秒に1個降らす
}

function stopDarlingParticles() {
    clearInterval(particleInterval);
    document.querySelectorAll(".darling-particle").forEach(p => p.remove());
}
