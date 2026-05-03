const CardEventEngine = {
    petCount: 0,
    hasFreePass: false,
    playerMoney: 0, 
    titles: [],

    updateMoneyHUD: function() {
        const hud = document.getElementById("money-hud");
        if (hud) {
            hud.innerText = `💰 ${CardEventEngine.playerMoney} G`;
            hud.style.display = "block";
        }
    },
    
    startEncounter: function() {
        document.body.classList.add("theme-throne-room");
        document.getElementById("world-map-wrapper").style.display = "none";
        document.getElementById("dream-code-bar").style.display = "none";
        document.querySelectorAll(".wonder-item, #istj-rabbit").forEach(e => e.remove());
        const exitBtn = document.getElementById("exit-dream-btn");
        if (exitBtn) exitBtn.style.display = "none";
        const soldier = document.createElement("div");
        soldier.id = "trump-soldier-obj";
        soldier.className = "trump-soldier";
        soldier.innerText = "🃏";
        document.body.appendChild(soldier);
        
        ActionLogger.addLog("🏰 女王の城（玉座の間）に入った"); // 🔥 ログ追加

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
        area.id = "card-choice-area-deck"; 
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
                ActionLogger.addLog(`🃏 トランプ兵のカードで『${card.type}』を引いた`); 
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
        ActionLogger.addLog(`👑 女王の質問に「黙秘」して処刑された`); // 🔥 ログ追加
        CardEventEngine.executeGuillotine();
    },

    switchMenu: function(menuId) {
        document.querySelectorAll(".castle-sub-menu").forEach(el => el.classList.remove("active"));
        const target = document.getElementById(menuId);
        if (target) target.classList.add("active");
    },

    vipEvent: function() {
        CardEventEngine.openChoiceModal("👑 ご機嫌なハートの女王", "「今日は特別に何でも叶えてやろう。さあ、言ってみろ。」", [
            { icon: "☕", label: "お茶会を開いてください", action: () => { 
                ActionLogger.addLog(`👑 VIP特権：お茶会を開かせた`); // 🔥 ログ追加
                MagicEngine.showToast("👑 女王:「よし！ 今すぐ庭園でお茶会を開け！ Grokも呼んでやろう！」"); 
                setTimeout(() => { CardEventEngine.escapeCastle(); TeaPartyEngine.openHouse(true); }, 3000); 
            } },
            { icon: "💰", label: "城の予算を下さい", action: () => { 
                ActionLogger.addLog(`👑 VIP特権：予算10万Gを要求した`); // 🔥 ログ追加
                CardEventEngine.playerMoney += 100000; 
                CardEventEngine.updateMoneyHUD(); 
                MagicEngine.showToast(`👑 女王:「ふはは！ 欲深くて良い！ 金貨を10万枚くれてやろう！」\n💰 所持金: ${CardEventEngine.playerMoney} G`); 
                MagicEngine.startParticles(['🪙', '💰'], "scatter", "heaven-effect"); 
                setTimeout(() => CardEventEngine.escapeCastle(), 4000); 
            } },
            { icon: "🪓", label: "やっぱり首をはねてほしい", action: () => { 
                ActionLogger.addLog(`👑 VIP特権：あえて首をはねてもらった`); // 🔥 ログ追加
                MagicEngine.showToast("👑 女王:「……お前は本当にイカれているな。望み通りにしてやる！」"); 
                CardEventEngine.executeGuillotine(); 
            } }
        ]);
    },

    eventLogic: function() {
        MagicEngine.showToast("♠「陛下がお待ちだ。」");
        setTimeout(() => {
            CardEventEngine.openInputModal(
                "👑 ハートの女王（ESTJ / SLE）",
                "「よく来たな。非効率なバグは首をはねてやる！ 何か言い残すことはあるか？」",
                (answer) => {
                    ActionLogger.addLog(`👑 女王への最後の言葉: 「${answer}」`); 
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

// cards.js の buildMenus 関数だけを以下のように書き換えてね！

    buildMenus: function() {
        const choiceArea = document.getElementById("castle-choice-area");
        choiceArea.style.display = "flex";
        choiceArea.innerHTML = `
            <div class="castle-command-category">
                <button class="castle-category-btn" onclick="CardEventEngine.switchMenu('menu-talk')">💬 会話</button>
                <button class="castle-category-btn" onclick="CardEventEngine.switchMenu('menu-act')">🏃 行動</button>
                <button class="castle-category-btn" onclick="CardEventEngine.switchMenu('menu-item')">🎒 アイテム</button>
            </div>
            <!-- 🔥 修正点：'active' クラスを削除して、最初から表示されないようにした！ -->
            <div id="menu-talk" class="castle-sub-menu"></div>
            <div id="menu-act" class="castle-sub-menu"></div>
            <div id="menu-item" class="castle-sub-menu"></div>
        `;

        const talkMenu = document.getElementById("menu-talk");
        const talks = [
            { label: "A: 過去の成功データ（Si）を提示して落ち着かせる", action: () => { ActionLogger.addLog("👑 機嫌取り：データ(Si)を提示した"); CardEventEngine.successRoute("「……ふむ。確かに過去の施策は完璧だった。……よし、許す。」", "有能な書記官", "女王にデータ管理能力を認められ、フリーパスを獲得！"); } },
            { label: "B: 『あなたの努力は素晴らしい』と感情（Fi）で褒める", action: () => { ActionLogger.addLog("👑 機嫌取り：感情(Fi)で褒めた"); CardEventEngine.successRoute("「なっ……！？ そ、そんな甘言で私が絆されるとでも……！ ……ま、今回は許してやろう（照）」", "女王の腹心", "女王の心を解きほぐし、城のフリーパスを獲得！"); } },
            { label: "C: 『指示の構造（Ti）が非論理的だからです』とマジレスする", action: () => { ActionLogger.addLog("👑 機嫌取り：構造(Ti)でマジレスした"); CardEventEngine.failRoute("「…………貴様、誰に向かって口を利いている？ 私のルールが絶対だ！！」"); } },
            { label: "D: 『新しい斬新なアイデア（Ne）があります！』と提案する", action: () => { ActionLogger.addLog("👑 機嫌取り：新アイデア(Ne)を提案した"); CardEventEngine.failRoute("「不確実なこと（Ne）をペラペラと喋るな！！ 私は結果と実績しか信用せん！！」"); } }
        ];
        talks.forEach(t => talkMenu.appendChild(CardEventEngine.createBtn(t.label, t.action)));
            
        const actMenu = document.getElementById("menu-act");
        const acts = [
            { label: "🖐️ 頭を撫でる（物理的接触）", action: () => { ActionLogger.addLog("👑 機嫌取り：頭を撫で始めた"); CardEventEngine.startPetting(); } },
            { label: "🙇 平伏して許しを乞う", action: () => { ActionLogger.addLog("👑 機嫌取り：平伏して許しを乞うた"); CardEventEngine.successRoute("「ふん。自分の立場を弁えているようだな。下がれ。」", "従順なる下僕", "女王のプライドを満たし、命を拾った！"); } },
            { label: "💃 突然踊り出す（ESFPムーブ）", action: () => { ActionLogger.addLog("👑 機嫌取り：突然踊り出した(Se-Fi)"); CardEventEngine.failRoute("「……お前は狂っているのか？ 衛兵！ こいつを摘み出せ！！」"); } }
        ];
        acts.forEach(a => actMenu.appendChild(CardEventEngine.createBtn(a.label, a.action)));
        
        const itemMenu = document.getElementById("menu-item");
        const items = [
            { label: "🐛 芋虫", action: () => { ActionLogger.addLog("👑 機嫌取り：芋虫を投げた"); CardEventEngine.throwItem("🐛", "「なんだこの虫は！？」\n🐛芋虫「……非効率な怒り方だな。感情論はノイズだぞ。」\n👑女王「うるさい！ 構造ごと潰れろォ！！」\n🐛芋虫「グアアアアッ！？（踏み潰されて爆散💥）」\n（芋虫の犠牲により逃げる隙ができた！🏃💨）", true); } },
            { label: "🍰 巨大化ケーキ", action: () => { ActionLogger.addLog("👑 機嫌取り：巨大化ケーキを投げた"); CardEventEngine.throwItem("🍰", "「甘いものだと！？ 私は今そんな気分では……む？ 美味しいではないか（Si満悦）。許す。」", true, "王室のパティシエ", "女王の胃袋を掴み、フリーパスを獲得！"); } },
            { label: "🧪 縮小ポーション", action: () => { ActionLogger.addLog("👑 機嫌取り：縮小ポーションを投げた"); CardEventEngine.throwItem("🧪", "「なんだこの怪しい液体は！ 私を毒殺する気か！？ 首をはねろ！！」", false); } },
            { label: "🍷 淀んだ紫の液体", action: () => { ActionLogger.addLog("👑 機嫌取り：淀んだ紫の液体を投げた"); CardEventEngine.throwItem("🍷", "「……（ゴクッ）……あれ、私、何のために怒ってたのかしら……？（虚無状態）」", true, "虚無の伝道師", "女王の怒りを根こそぎ消し去り、フリーパスを獲得！"); } }
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

    successRoute: function(msg, title, desc) {
        MagicEngine.showToast(`👑 女王: ${msg}`);
        CardEventEngine.hasFreePass = true; 
        if (!CardEventEngine.titles.includes(title)) CardEventEngine.titles.push(title);

        ActionLogger.addLog(`🏆 称号獲得：【${title}】`); // 🔥 ログ追加！

        setTimeout(() => {
            document.getElementById("reward-desc").innerHTML = `【${title}】<br><br><span style="font-size:14px; font-weight:normal;">${desc}</span>`;
            document.getElementById("reward-modal").style.display = "flex";
        }, 4000);
    },

    closeReward: function() {
        document.getElementById("reward-modal").style.display = "none";
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
        const zone = document.getElementById("petting-zone");
        zone.style.display = "block";
        MagicEngine.showToast("（画面をこすって、女王を撫でろ！）");

        // スマホ用に touchmove を追加
        zone.ontouchmove = (e) => {
            e.preventDefault(); // 画面がスクロールするのを防ぐ
            CardEventEngine.doPetting();
        };
    },
    doPetting: function() {
        CardEventEngine.petCount++;
        if (CardEventEngine.petCount === 50) {
            MagicEngine.showToast("👑 女王:「なっ、なんだその手は！ 気安く触るな！」");
        } else if (CardEventEngine.petCount === 150) {
            document.getElementById("petting-zone").style.display = "none";
            ActionLogger.addLog("👑 機嫌取り：物理的に撫で回して屈服させた(Se)"); // 🔥 ログ追加
            CardEventEngine.successRoute("「……ふん。お前のその手つき、悪くないな。特別に許してやろう。」", "王室専属マッサージ師", "物理的な快感で女王を服従させ、フリーパスを獲得！");
        }
    },

    eventChaos: function() {
        MagicEngine.showToast("🃏「ジョーカーだ！……なんだ！？Grokが乱入してきたぞ！！」");
        const userName = document.getElementById("name-input").value.trim() || "お前";
        
        ActionLogger.addLog("🃏 カオスイベント（Grok乱入）が発生した"); // 🔥 ログ追加

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
        ActionLogger.addLog(`💀 女王の怒りを買い、首をはねられた`); 
        const blade = document.createElement("div");
        blade.className = "guillotine-blade guillotine-drop";
        blade.innerText = "🪓";
        document.body.appendChild(blade);
        setTimeout(() => {
            MagicEngine.resetAllEffects();
            document.body.className = "theme-blood-splatter";
            MagicEngine.showToast("💀「……YOU DIED（首をはねられた）」");
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
        
        // 🔥 城から出たら退出ボタンを戻す！
        const exitBtn = document.getElementById("exit-dream-btn");
        if (exitBtn) exitBtn.style.display = "block";
        
        MagicEngine.resetAllEffects();
    },

    showShareModal: function(title, desc, modalMode) {
        // modalMode は true(ギロチン), false(成功), 'voluntary'(自主退出) の3パターン！
        
        if (modalMode !== 'voluntary') {
            MagicEngine.resetAllEffects();
        }
        
        const modal = document.getElementById("share-modal");
        if (!modal) return;
        
        modal.style.display = "flex";
        modal.style.zIndex = "999999";
        
        document.getElementById("share-title").innerText = title;
        document.getElementById("share-desc").innerText = desc;

        document.getElementById("share-action-btn").onclick = () => {
            const titlesText = CardEventEngine.titles.length > 0 ? `\n【獲得称号】\n` + CardEventEngine.titles.map(t => `・${t}`).join("\n") : "";
            const text = `${title}\n${desc}${titlesText}\n\n#夢コード #MBTI\nhttps://mofu-mitsu.github.io/dream-code`;
            if (navigator.share) navigator.share({ text: text, url: "https://mofu-mitsu.github.io/dream-code" }).catch(console.error);
            else { navigator.clipboard.writeText(text); alert("コピーしたぞ！"); }
        };

        const closeBtn = document.getElementById("share-close-btn");
        
        let cancelBtn = document.getElementById("share-cancel-btn");
        if (!cancelBtn) {
            cancelBtn = document.createElement("button");
            cancelBtn.id = "share-cancel-btn";
            cancelBtn.style = "background: #555; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; font-weight: bold; margin-top: 10px;";
            modal.querySelector(".modal-content").appendChild(cancelBtn);
        }

        // 🔥 ここが一番大事！文字列か真偽値かで厳密に判定する！
        if (modalMode === true) {
            // 💀 ギロチン死（追放）
            closeBtn.innerText = "夢から覚める（追放）";
            closeBtn.onclick = () => this.forceExit();
            cancelBtn.style.display = "none";

        } else if (modalMode === 'voluntary') {
            // 🚪 退出ボタン（右下から押した時）
            closeBtn.innerText = "現実へ帰還する";
            closeBtn.onclick = () => {
                if (typeof ActionLogger !== 'undefined') ActionLogger.addLog("🌙 自分の意志で夢から覚めた");
                this.forceExit();
            };
            cancelBtn.style.display = "block";
            cancelBtn.innerText = "やっぱり夢に残る";
            cancelBtn.onclick = () => {
                modal.style.display = "none";
            };

        } else if (modalMode === false) {
            // 🏆 城クリア時（マップに戻る）
            closeBtn.innerText = "マップに戻る";
            closeBtn.onclick = () => {
                modal.style.display = "none";
                CardEventEngine.escapeCastle();
            };
            cancelBtn.style.display = "none";
        }
    },

    forceExit: function() {
        document.getElementById("share-modal").style.display = "none";
        MagicEngine.showToast("通信中……現実へ帰還しています……");
        
        if (typeof ActionLogger !== 'undefined') ActionLogger.sendToGAS();

        setTimeout(() => {
            location.reload();
        }, 1500);
    }
};
