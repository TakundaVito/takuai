const history = [];
const btn = document.getElementById('send-btn');

async function sendMessage() {
  const input = document.getElementById('user-input');
  const text = input.value.trim();
  if (!text) return;

  addBubble('user', text);
  history.push({ role: 'user', content: text });
  input.value = '';
  btn.disabled = true;

  const thinking = addBubble('thinking', 'Thinking…');

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    });

    const { reply, error } = await res.json();
    thinking.remove();

    if (error) {
      addBubble('assistant', 'Sorry, something went wrong. Please try again.');
    } else {
      history.push({ role: 'assistant', content: reply });
      addBubble('assistant', reply);
    }
  } catch (err) {
    thinking.remove();
    addBubble('assistant', 'Could not reach the server. Please try again.');
  }

  btn.disabled = false;
  input.focus();
}

function addBubble(role, text) {
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = `bubble ${role}`;
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

document.getElementById('user-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !btn.disabled) sendMessage();
});
