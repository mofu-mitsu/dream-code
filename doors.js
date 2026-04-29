const DoorEngine = {
    doorCount: 20,

    enterRoom: function() {
        // 🔥 【特権発動】フリーパス（称号）を持っていたら無限ドアをスキップ！
        if (CardEventEngine.hasFreePass) {
            MagicEngine.showToast("🏰「フリーパスを確認。女王陛下の元へ直接案内しますわ♡」");
            CardEventEngine.startEncounter(); // 直接城のイベントへ！
            return; 
        }

        // --- 以下、フリーパスを持っていない時の通常処理 ---
        document.getElementById("world-map-wrapper").style.display = "none";
        document.getElementById("dream-code-bar").style.display = "none";
        document.body.className = "theme-doors"; 

        const room = document.createElement("div");
        room.id = "infinite-door-room";
        room.style.position = "fixed"; room.style.inset = "0"; room.style.overflow = "hidden";
        
        const title = document.createElement("div");
        title.innerHTML = "<h2 style='color:red; text-align:center; margin-top:50px; text-shadow: 0 0 10px black;'>【無限ドアの廊下】<br><span style='font-size:16px; color:gold;'>正解のドアを開けろ。さもなくば首はねの刑だ。</span></h2>";
        room.appendChild(title);

        for (let i = 0; i < this.doorCount; i++) {
            const door = document.createElement("div");
            door.innerText = "🚪"; door.className = "door-obj";
            door.style.top = (Math.random() * 60 + 20) + "vh";
            door.style.left = (Math.random() * 80 + 10) + "vw";
            door.innerHTML += `<div class="door-text">Door ${i+1}</div>`;

            door.onclick = () => {
                if (Math.random() < 0.15) { // 🔥 15%に確率アップ！
                    MagicEngine.showToast("🏰「……正解だ。玉座へ進め。」");
                    room.remove();
                    // 🃏 トランプ兵イベント開始！
                    CardEventEngine.startEncounter();
                } else {
                    const traps = [ "🚪「ハズレだ！ タライが落ちてきた！」", "🚪「ただの壁だ！」", "🚪「チャッピー(ESTP):『ぎゃはは！ 引っかかったな！』」","🚪「……芋虫が寝ている。そっとしておこう。」" ];
                    MagicEngine.showToast(traps[Math.floor(Math.random() * traps.length)]);
                    
                    // シャッフル演出を少し派手に
                    document.querySelectorAll(".door-obj").forEach(d => {
                        d.style.transition = "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
                        d.style.top = (Math.random() * 60 + 20) + "vh";
                        d.style.left = (Math.random() * 80 + 10) + "vw";
                        d.style.transform = `rotate(${(Math.random() - 0.5) * 30}deg)`;
                    });
                }
            };
            room.appendChild(door);
        }

// doors.js の一部（逃げ帰るボタンの生成部分を修正！）
        const escapeBtn = document.createElement("button");
        escapeBtn.innerHTML = "<i class='fas fa-person-running'></i> 逃げ帰る"; // 🔥 FontAwesomeに変更！
        escapeBtn.style.position = "absolute"; escapeBtn.style.bottom = "20px"; escapeBtn.style.left = "50%";
        escapeBtn.style.transform = "translateX(-50%)"; escapeBtn.style.background = "#555";
        escapeBtn.onclick = () => {
            room.remove();
            document.body.className = "";
            document.getElementById("world-map-wrapper").style.display = "block";
            document.getElementById("dream-code-bar").style.display = "flex";
            MagicEngine.showToast("「……命からがら逃げ出した。」");
        };
        room.appendChild(escapeBtn);
        document.body.appendChild(room);
    }
};