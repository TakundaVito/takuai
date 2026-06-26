const history = [];
const btn = document.getElementById("send-btn");

async function sendMessage() {
    const input = document.getElementById("user-input");
    const text = input.value.trim();

    if (!text) return;

    // Show user message
    addBubble("user", text);

    history.push({
        role: "user",
        content: text
    });

    input.value = "";
    btn.disabled = true;

    // Thinking indicator
    const thinking = addBubble("thinking", "🤖 Taku is thinking...");

    try {

        const response = await fetch(
            "https://takuai-1.onrender.com/api/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages: history
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        thinking.remove();

        if (data.error) {

            addBubble(
                "assistant",
                "Sorry, I couldn't process your request."
            );

        } else {

            history.push({
                role: "assistant",
                content: data.reply
            });

            addBubble("assistant", data.reply);

        }

    } catch (error) {

        console.error(error);

        thinking.remove();

        addBubble(
            "assistant",
            "⚠️ I couldn't connect to my AI server. Please try again in a few moments."
        );

    }

    btn.disabled = false;
    input.focus();
}

function addBubble(role, text) {

    const msgs = document.getElementById("messages");

    const div = document.createElement("div");

    div.className = `bubble ${role}`;

    div.textContent = text;

    msgs.appendChild(div);

    msgs.scrollTop = msgs.scrollHeight;

    return div;

}

btn.addEventListener("click", sendMessage);

document
    .getElementById("user-input")
    .addEventListener("keydown", function (e) {

        if (e.key === "Enter" && !btn.disabled) {

            e.preventDefault();

            sendMessage();

        }

    });

// const history = [];
// const btn = document.getElementById('send-btn');

// async function sendMessage() {
//   const input = document.getElementById('user-input');
//   const text = input.value.trim();
//   if (!text) return;

//   addBubble('user', text);
//   history.push({ role: 'user', content: text });
//   input.value = '';
//   btn.disabled = true;

//   const thinking = addBubble('thinking', 'Thinking…');

//   try {
//     const res = await fetch('/api/chat', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ messages: history }),
//     });

//     const { reply, error } = await res.json();
//     thinking.remove();

//     if (error) {
//       addBubble('assistant', 'Sorry, something went wrong. Please try again.');
//     } else {
//       history.push({ role: 'assistant', content: reply });
//       addBubble('assistant', reply);
//     }
//   } catch (err) {
//     thinking.remove();
//     addBubble('assistant', 'Could not reach the server. Please try again.');
//   }

//   btn.disabled = false;
//   input.focus();
// }

// function addBubble(role, text) {
//   const msgs = document.getElementById('messages');
//   const div = document.createElement('div');
//   div.className = `bubble ${role}`;
//   div.textContent = text;
//   msgs.appendChild(div);
//   msgs.scrollTop = msgs.scrollHeight;
//   return div;
// }

// document.getElementById('user-input').addEventListener('keydown', e => {
//   if (e.key === 'Enter' && !btn.disabled) sendMessage();
// });
