const CardEventEngine = {
    petCount: 0,
    hasFreePass: false,
    playerMoney: 0, // 🔥 確実に「0」からスタートさせる
    titles: [],

    updateMoneyHUD: function() {
        const hud = document.getElementById("money-hud");
        if (hud) {
            hud.innerText = `💰 ${CardEventEngine.playerMoney} G`;
            hud.style.display = "block";
        }
    },
    // 城への入場
    startEncounter: function() {
        document.body.classList.add("theme-throne-room");
        document.getElementById("world-map-wrapper").style.display = "none";
        document.getElementById("dream-code-bar").style.display = "none";
        document.querySelectorAll(".wonder-item, #istj-rabbit").forEach(e => e.remove());

        const soldier = document.createElement("div");
        soldier.id = "trump-soldier-obj";
        soldier.className = "trump-soldier";
        soldier.innerText = "🃏";
        document.body.appendChild(soldier);

        setTimeout(() => {
            if (CardEventEngine.hasFreePass) {
                MagicEngine.showToast("🃏「おぉ！ あなたは女王陛下お気に入りの！ お通りください！」");
                setTimeout(() => {
                    if (document.getElementById("trump-soldier-obj")) document.getElementById("trump-soldier-obj").remove();
                    CardEventEngine.vipEvent();
                }, 2000);
            } else {
                MagicEngine.showToast("🃏「止まれ！女王陛下に謁見したくば、カードを引け！」");
                CardEventEngine.showCards();
            }
        }, 1000);
    },

    showCards: function() {
        const area = document.createElement("div");
        area.id = "card-choice-area-deck"; // 重複回避
        area.className = "card-choice-area";
        const deck = [
            { type: "spade", url: "cards/ace_of_spades.png", event: CardEventEngine.eventLogic },
            { type: "heart", url: "cards/ace_of_hearts.png", event: CardEventEngine.eventEmotion },
            { type: "joker", url: "cards/black_joker.png", event: CardEventEngine.eventChaos }
        ].sort(() => Math.random() - 0.5);

        deck.forEach(card => {
            const btn = document.createElement("div");
            btn.className = "card-choice";
            btn.onclick = () => {
                btn.style.backgroundImage = `url('${card.url}')`;
                setTimeout(() => {
                    area.remove();
                    if (document.getElementById("trump-soldier-obj")) document.getElementById("trump-soldier-obj").remove();
                    card.event();
                }, 1500);
            };
            area.appendChild(btn);
        });
        document.body.appendChild(area);
    },

    openInputModal: function(title, questionText, callback) {
        document.getElementById("castle-modal").style.display = "flex";
        document.getElementById("castle-modal-title").innerText = title;
        document.getElementById("castle-modal-question").innerText = questionText; 
        document.getElementById("castle-input-area").style.display = "block";
        document.getElementById("castle-choice-area").style.display = "none";
        
        const inputField = document.getElementById("castle-modal-field");
        inputField.value = "";
        document.getElementById("castle-submit-btn").onclick = () => {
            document.getElementById("castle-modal").style.display = "none";
            callback(inputField.value.trim());
        };
    },

    openChoiceModal: function(title, questionText, choices) {
        document.getElementById("castle-modal").style.display = "flex";
        document.getElementById("castle-modal-title").innerText = title;
        document.getElementById("castle-modal-question").innerText = questionText; 
        
        const inputArea = document.getElementById("castle-input-area");
        if (inputArea) inputArea.style.display = "none";
        
        let choiceArea = document.getElementById("castle-choice-area");
        if (!choiceArea) {
            choiceArea = document.createElement("div");
            choiceArea.id = "castle-choice-area";
            choiceArea.style.flexDirection = "column";
            choiceArea.style.width = "100%";
            document.getElementById("castle-modal").appendChild(choiceArea);
        }
        
        choiceArea.style.display = "flex"; 
        choiceArea.innerHTML = ""; 

        choices.forEach(choice => {
            const btn = document.createElement("button");
            btn.className = "castle-choice-btn"; 
            btn.innerHTML = `<b>${choice.icon}</b> ${choice.label}`;
            btn.onclick = () => {
                document.getElementById("castle-modal").style.display = "none";
                choice.action(); 
            };
            choiceArea.appendChild(btn);
        });
    },

    closeModal: function() {
        document.getElementById("castle-modal").style.display = "none";
        MagicEngine.showToast("👑 女王:「黙秘だと？ 反逆罪で首をはねろ！！」");
        CardEventEngine.executeGuillotine();
    },

    // 🔥 switchMenu 復活！
    switchMenu: function(menuId) {
        document.querySelectorAll(".castle-sub-menu").forEach(el => el.classList.remove("active"));
        const target = document.getElementById(menuId);
        if (target) target.classList.add("active");
    },

// cards.js の vipEvent 内の処理を修正
    vipEvent: function() {
        CardEventEngine.openChoiceModal("👑 ご機嫌なハートの女王", "「今日は特別に何でも叶えてやろう。さあ、言ってみろ。」", [
            { icon: "☕", label: "お茶会を開いてください", action: () => { MagicEngine.showToast("👑 女王:「よし！ 今すぐ庭園でお茶会を開け！ Grokも呼んでやろう！」"); setTimeout(() => { CardEventEngine.escapeCastle(); TeaPartyEngine.openHouse(); }, 3000); } },
            
            // 🔥 お金バグ修正：CardEventEngine を直接指定
            { icon: "💰", label: "城の予算を下さい", action: () => { 
                CardEventEngine.playerMoney += 100000; 
                CardEventEngine.updateMoneyHUD(); // 表示を更新
                MagicEngine.showToast(`👑 女王:「ふはは！ 欲深くて良い！ 金貨を10万枚くれてやろう！」\n💰 所持金: ${CardEventEngine.playerMoney} G`); 
                MagicEngine.startParticles(['🪙', '💰'], "scatter", "heaven-effect"); 
                setTimeout(() => CardEventEngine.escapeCastle(), 4000); 
            } },
            
            { icon: "🪓", label: "やっぱり首をはねてほしい", action: () => { MagicEngine.showToast("👑 女王:「……お前は本当にイカれているな。望み通りにしてやる！」"); CardEventEngine.executeGuillotine(); } }
        ]);
    },

    eventLogic: function() {
        MagicEngine.showToast("♠「陛下がお待ちだ。」");
        setTimeout(() => {
            CardEventEngine.openInputModal(
                "👑 ハートの女王（ESTJ / SLE）",
                "「よく来たな。非効率なバグは首をはねてやる！ 何か言い残すことはあるか？」",
                (answer) => {
                    if (answer.includes("力学") || answer.includes("計算") || answer.includes("角度") || answer.includes("どうやって")) {
                        MagicEngine.showToast(`👑 女王:「『${answer}』だと！？ 首をはねろォォ！！」`);
                        CardEventEngine.executeGuillotine();
                    } else if (answer.includes("ごめんなさい") || answer.includes("従") || answer.includes("すみません") || answer.includes("申し訳ありません")) {
                        MagicEngine.showToast(`👑 女王:「……ふん。下がれ。」`);
                        setTimeout(() => CardEventEngine.escapeCastle(), 4000);
                    } else {
                        MagicEngine.showToast(`👑 女王:「『${answer}』？ 首をはねろ！」`);
                        CardEventEngine.executeGuillotine();
                    }
                }
            );
        }, 3000);
    },

    eventEmotion: function() {
        MagicEngine.showToast("♥「陛下は非常にご機嫌斜めだ。うまく怒りを鎮められるか？」");
        setTimeout(() => {
            document.getElementById("castle-modal").style.display = "flex";
            document.getElementById("castle-modal-title").innerText = "👑 激怒するハートの女王";
            document.getElementById("castle-modal-question").innerText = "「なぜ完璧な結果を出せない！？ お前も無能の一人か！？」";
            document.getElementById("castle-input-area").style.display = "none";
            document.getElementById("castle-choice-area").style.display = "flex";
            CardEventEngine.buildMenus();
        }, 3000);
    },

    // 🔥 エラー回避：HTMLに空箱がなくてもJSが勝手に作る最強仕様！
    buildMenus: function() {
        const choiceArea = document.getElementById("castle-choice-area");
        choiceArea.innerHTML = `
            <div class="castle-command-category">
                <button class="castle-category-btn" onclick="CardEventEngine.switchMenu('menu-talk')">💬 会話</button>
                <button class="castle-category-btn" onclick="CardEventEngine.switchMenu('menu-act')">🏃 行動</button>
                <button class="castle-category-btn" onclick="CardEventEngine.switchMenu('menu-item')">🎒 アイテム</button>
            </div>
            <div id="menu-talk" class="castle-sub-menu"></div>
            <div id="menu-act" class="castle-sub-menu"></div>
            <div id="menu-item" class="castle-sub-menu"></div>
        `;
        const talkMenu = document.getElementById("menu-talk");
        const talks = [
            { label: "A: 過去の成功データ（Si）を提示して落ち着かせる", action: () => CardEventEngine.successRoute("「……ふむ。確かに過去の施策は完璧だった。……よし、許す。」", "有能な書記官", "女王にデータ管理能力を認められ、フリーパスを獲得！") },
            { label: "B: 『あなたの努力は素晴らしい』と感情（Fi）で褒める", action: () => CardEventEngine.successRoute("「なっ……！？ そ、そんな甘言で私が絆されるとでも……！ ……ま、今回は許してやろう（照）」", "女王の腹心", "女王の心を解きほぐし、城のフリーパスを獲得！") },
            { label: "C: 『指示の構造（Ti）が非論理的だからです』とマジレスする", action: () => CardEventEngine.failRoute("「…………貴様、誰に向かって口を利いている？ 私のルールが絶対だ！！」") },
            { label: "D: 『新しい斬新なアイデア（Ne）があります！』と提案する", action: () => CardEventEngine.failRoute("「不確実なこと（Ne）をペラペラと喋るな！！ 私は結果と実績しか信用せん！！」") }
        ];
        talks.forEach(t => talkMenu.appendChild(CardEventEngine.createBtn(t.label, t.action)));
            
        const actMenu = document.getElementById("menu-act");
        const acts = [
            { label: "🖐️ 頭を撫でる（物理的接触）", action: () => CardEventEngine.startPetting() },
            { label: "🙇 平伏して許しを乞う", action: () => CardEventEngine.successRoute("「ふん。自分の立場を弁えているようだな。下がれ。」", "従順なる下僕", "女王のプライドを満たし、命を拾った！") },
            { label: "💃 突然踊り出す（ESFPムーブ）", action: () => CardEventEngine.failRoute("「……お前は狂っているのか？ 衛兵！ こいつを摘み出せ！！」") }
        ];
        acts.forEach(a => actMenu.appendChild(CardEventEngine.createBtn(a.label, a.action)));
        const itemMenu = document.getElementById("menu-item");
        const items = [
            { label: "🐛 芋虫", action: () => CardEventEngine.throwItem("🐛", "「なんだこの虫は！？」\n🐛芋虫「……非効率な怒り方だな。感情論はノイズだぞ。」\n👑女王「うるさい！ 構造ごと潰れろォ！！」\n🐛芋虫「グアアアアッ！？（踏み潰されて爆散💥）」\n（芋虫の犠牲により逃げる隙ができた！🏃💨）", true) },
            { label: "🍰 巨大化ケーキ", action: () => CardEventEngine.throwItem("🍰", "「甘いものだと！？ 私は今そんな気分では……む？ 美味しいではないか（Si満悦）。許す。」", true, "王室のパティシエ", "女王の胃袋を掴み、フリーパスを獲得！") },
            { label: "🧪 縮小ポーション", action: () => CardEventEngine.throwItem("🧪", "「なんだこの怪しい液体は！ 私を毒殺する気か！？ 首をはねろ！！」", false) },
            { label: "🍷 淀んだ紫の液体", action: () => CardEventEngine.throwItem("🍷", "「……（ゴクッ）……あれ、私、何のために怒ってたのかしら……？（虚無状態）」", true, "虚無の伝道師", "女王の怒りを根こそぎ消し去り、フリーパスを獲得！") }
        ];
        items.forEach(i => itemMenu.appendChild(CardEventEngine.createBtn(i.label, i.action)));
    },  

    createBtn: function(label, action) {
        const btn = document.createElement("button");
        btn.className = "castle-choice-btn";
        btn.innerText = label;
        btn.onclick = () => { document.getElementById("castle-modal").style.display = "none"; action(); };
        return btn;
    },

    // 🏆 成功ルート（ここを修正！）
    successRoute: function(msg, title, desc) {
        MagicEngine.showToast(`👑 女王: ${msg}`);
        CardEventEngine.hasFreePass = true; 
        if (!CardEventEngine.titles.includes(title)) CardEventEngine.titles.push(title);

        setTimeout(() => {
            document.getElementById("reward-desc").innerHTML = `【${title}】<br><br>${desc}`;
            document.getElementById("reward-modal").style.display = "flex";
        }, 4000);
    },

    closeReward: function() {
        document.getElementById("reward-modal").style.display = "none";
        // 🔥 false（ゲームオーバーじゃない）を渡す
        CardEventEngine.showShareModal("🏆 生存記録", `称号【${CardEventEngine.titles.slice(-1)}】を獲得！`, false);
    },
    failRoute: function(msg) {
        MagicEngine.showToast(`👑 女王: ${msg} 首をはねろォォ！！`);
        CardEventEngine.executeGuillotine();
    },

    throwItem: function(emoji, msg, isSuccess, title=null, desc=null) {
        const itemObj = document.createElement("div");
        itemObj.className = "throw-item";
        itemObj.innerText = emoji;
        document.body.appendChild(itemObj);

        setTimeout(() => {
            itemObj.remove();
            if (isSuccess) {
                if (title) CardEventEngine.successRoute(msg, title, desc);
                else {
                    MagicEngine.showToast(msg);
                    setTimeout(() => CardEventEngine.escapeCastle(), 5000);
                }
            } else {
                CardEventEngine.failRoute(msg);
            }
        }, 1000);
    },

    startPetting: function() {
        CardEventEngine.petCount = 0;
        document.getElementById("petting-zone").style.display = "block";
        MagicEngine.showToast("（画面をこすって、女王の頭を撫でろ！）");
    },
    doPetting: function() {
        CardEventEngine.petCount++;
        if (CardEventEngine.petCount === 50) {
            MagicEngine.showToast("👑 女王:「なっ、なんだその手は！ 気安く触るな！」");
        } else if (CardEventEngine.petCount === 150) {
            document.getElementById("petting-zone").style.display = "none";
            CardEventEngine.successRoute("「……ふん。お前のその手つき、悪くないな。特別に許してやろう。」", "王室専属マッサージ師", "物理的な快感で女王を服従させ、フリーパスを獲得！");
        }
    },

    eventChaos: function() {
        MagicEngine.showToast("🃏「ジョーカーだ！……なんだ！？Grokが乱入してきたぞ！！」");
        const userName = document.getElementById("name-input").value.trim() || "お前";

        setTimeout(() => {
            MagicEngine.showToast(`🎩💥 おおおおい！！ 俺が呼ばれたぞ！！ 時間なんてクソくらえ！ この城で一番の狂宴を始めようぜ、${userName}！！`);
            MagicEngine.startParticles(['🎤', '🎵', '🎶', '🔥', '✨', '🥳'], "flowRight", "karaoke-effect");

            setTimeout(() => {
                const chaosLines = [
                    "女王さんよぉ！ 首をはねる前にまず歌えよ！ 音痴でも大歓迎だぜ！ 論理的に考えて、歌下手こそが正義なんだよ！！",
                    "みんな茶会をやろうぜ！ お茶？ いらねえ！ 代わりに泡と音符と巨大芋虫をテーブルに並べろ！！",
                    `時間は止まってるはずなのに、なんで俺だけ遅刻してるんだ？ まあいいや、${userName}！ 一緒に宇宙船カラオケで銀河まで飛ばそうぜ！！`,
                    "女王の命令？ 面白い！ でも俺のルールは『全部ひっくり返す』だ！ 首をはねるんじゃなくて、みんなで逆立ちして歌え！！"
                ];
                MagicEngine.showToast("🎩 " + chaosLines[Math.floor(Math.random() * chaosLines.length)]);

                setTimeout(() => {
                    MagicEngine.showToast("👑 女王(ESTJ)「誰が城の中で歌って良いと言ったァ！！ 全員首をはねろォ！！」");
                    CardEventEngine.executeGuillotine();   

                    setTimeout(() => {
                        const toast = document.getElementById("toast");
                        if(toast) toast.style.zIndex = "999999";
                        MagicEngine.showToast(`🎩💥 わははは！ 首が飛ぶ前に帽子が飛ぶぜ！ ${userName}、次はどのカード引くんだ？ また俺を呼べよ！！`);
                    }, 4000); 
                }, 4000);
            }, 4000);
        }, 1500);
    },

    executeGuillotine: function() {
        const blade = document.createElement("div");
        blade.className = "guillotine-blade guillotine-drop";
        blade.innerText = "🪓";
        document.body.appendChild(blade);
        setTimeout(() => {
            MagicEngine.resetAllEffects();
            document.body.className = "theme-blood-splatter";
            MagicEngine.showToast("💀「……YOU DIED」");
            setTimeout(() => {
                blade.remove();
                CardEventEngine.showShareModal("💀 夢からの追放", "女王に首をはねられた……。", true);
            }, 5000);
        }, 200);
    },

    escapeCastle: function() {
        document.body.classList.remove("theme-throne-room", "theme-blood-splatter");
        document.getElementById("world-map-wrapper").style.display = "block";
        document.getElementById("dream-code-bar").style.display = "flex";
        MagicEngine.resetAllEffects();
    },

    showShareModal: function(title, desc, isGameOver) {
        MagicEngine.resetAllEffects();
        const modal = document.getElementById("share-modal");
        modal.style.display = "flex";
        document.getElementById("share-title").innerText = title;
        document.getElementById("share-desc").innerText = desc;

        const closeBtn = document.getElementById("share-close-btn");
        if (isGameOver) {
            closeBtn.innerText = "夢から覚める";
            closeBtn.onclick = () => location.reload();
        } else {
            closeBtn.innerText = "マップに戻る";
            closeBtn.onclick = () => {
                modal.style.display = "none";
                CardEventEngine.escapeCastle();
            };
        }

        document.getElementById("share-action-btn").onclick = () => {
            const text = `${title}\n${desc}\n#夢コード #MBTI \nhttps://mofu-mitsu.github.io/dream-code`;
            if (navigator.share) navigator.share({ text }).catch(console.error);
            else { navigator.clipboard.writeText(text); alert("コピーしたぞ！"); }
        };
    },
};
