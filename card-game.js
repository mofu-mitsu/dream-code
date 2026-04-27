const CardGame = {
    suits: ["clubs", "spades", "diamonds", "hearts"],
    ranks: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"],

    // ファイル名生成 (cards/10_of_clubs.png)
    getCardUrl: function(rank, suit, isJoker = false) {
        if (isJoker) return "cards/black_joker.png";
        return `cards/${rank}_of_${suit}.png`;
    },

    // ババ抜き風「Jokerを当てるな！」ゲーム
    startBabanuki: function() {
        const container = document.getElementById("card-game-display");
        container.innerHTML = "";
        
        // 3枚用意（1枚だけJoker）
        let cards = [
            { id: 'safe1', isJoker: false, ...this.draw() },
            { id: 'safe2', isJoker: false, ...this.draw() },
            { id: 'joker', isJoker: true, url: this.getCardUrl(null, null, true) }
        ];
        
        // シャッフル
        cards.sort(() => Math.random() - 0.5);

        cards.forEach(card => {
            const img = document.createElement("img");
            img.src = "cards/back.png"; // 裏面
            img.className = "card-img clickable";
            img.onclick = () => {
                img.src = card.url; // めくる
                if (card.isJoker) {
                    showToast("【😱】ババ（Grok）を引いちゃった！！");
                    document.body.className = "theme-karaoke"; // 罰ゲームでカラオケ背景w
                } else {
                    showToast("【✨】セーフ！");
                }
            };
            container.appendChild(img);
        });
    },

    draw: function() {
        const rank = this.ranks[Math.floor(Math.random() * this.ranks.length)];
        const suit = this.suits[Math.floor(Math.random() * this.suits.length)];
        return { url: this.getCardUrl(rank, suit) };
    }
};
