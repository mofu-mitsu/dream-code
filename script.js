// GitHub Secretsなどを使う場合は環境変数から。ローカルなら直接。
const GROQ_API_KEY = "ここを書き換えるか、Secretから取得"; 
let userName = "あなた";

function startDream() {
    userName = document.getElementById("name-input").value || "あなた";
    document.getElementById("name-modal").style.display = "none";
    document.getElementById("world-map").style.display = "flex";
}

function openDarlingHouse() { document.getElementById("darling-window").style.display = "flex"; }
function closeDarlingHouse() { document.getElementById("darling-window").style.display = "none"; }

async function talkToDarling() {
    const input = document.getElementById("user-reaction").value;
    if (!input) return;

    // 1. キーワードチェック
    let reply = "";
    for (let item of dreamData.darlingResponses) {
        if (item.keywords.some(k => input.includes(k))) {
            reply = item.reply;
            break;
        }
    }

    if (reply) {
        updateDisplay(reply.replace("${name}", userName));
        return;
    }

    // 2. Groq APIに挑戦
    try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "system", content: "あなたはILIのダーリンの子です..." }, { role: "user", content: input }]
            })
        });
        const data = await res.json();
        updateDisplay(data.choices[0].message.content);
    } catch (e) {
        // 3. Groqがダメならテンプレ
        updateDisplay("「ふふ、ダーリン。今はちょっとお話したくない気分なの♡」");
    }
}

function triggerGimmick(type) {
    const lines = dreamData.gimmicks[type];
    const pick = lines[Math.floor(Math.random() * lines.length)];
    updateDisplay(pick.replace("${name}", userName));
}

function updateDisplay(text) {
    document.getElementById("ai-response").innerText = text;
    document.getElementById("user-reaction").value = "";
    document.getElementById("portal-area").style.display = "block";
}