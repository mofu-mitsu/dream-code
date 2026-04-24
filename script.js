function startFall() {
    const nameInput = document.getElementById("name-input").value.trim();
    const typeInput = document.getElementById("type-input").value.trim();
    
    document.getElementById("name-modal").style.display = "none";
    document.body.classList.add("falling");

    setTimeout(() => {
        document.body.classList.remove("falling");
        document.getElementById("rabbit-hole-screen").style.display = "none";
        document.getElementById("world-map").style.display = "block";
    }, 3000);
}

function openDarlingHouse() {
    document.getElementById("darling-window").style.display = "flex";
    const type = document.getElementById("type-input").value.toUpperCase();
    if (type.includes("LII") || type.includes("INTJ")) {
        DarlingEngine.updateLog(`「……あら。${type}のダーリン？ 論理の城からわざわざ降りてきたの？ ふふ、どうやって崩してあげようかしら……♡」`);
    } else {
        DarlingEngine.updateLog(`「ねえダーリン♡ 待ってたわよ。」`);
    }
}

function closeDarlingHouse() { 
    document.getElementById("darling-window").style.display = "none"; 
    document.getElementById("card-display").innerHTML = ""; // トランプも消す
}
