// cards.js の forceExit 関数
    forceExit: function() {
        document.getElementById("share-modal").style.display = "none";
        MagicEngine.showToast("通信中……現実へ帰還しています……");
        
        // 🔥 最後に溜まっているログを投げつける
        if (typeof ActionLogger !== 'undefined') ActionLogger.sendToGAS();

        // 余裕を持って2.5秒待ってからリロード
        setTimeout(() => {
            location.reload();
        }, 2500);
    }
