document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const typingIndicator = document.getElementById('typing-indicator');

  if (!chatForm || !chatInput || !chatMessages) return;

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const question = chatInput.value.trim();
    if (!question) return;

    // Append User Message
    appendUserMessage(question);
    chatInput.value = '';
    chatInput.focus();

    // Show Typing Indicator
    if (typingIndicator) typingIndicator.classList.remove('hidden');
    scrollToBottom();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question })
      });

      const result = await response.json();

      if (typingIndicator) typingIndicator.classList.add('hidden');

      if (response.ok && result.status === 'success') {
        appendBotMessage(result.data.reply);
      } else {
        appendBotMessage(result.message || 'Maaf, terjadi kendala koneksi ke server AI.');
      }
    } catch (err) {
      if (typingIndicator) typingIndicator.classList.add('hidden');
      appendBotMessage('Gagal terhubung ke server backend Express. Silakan periksa koneksi internet atau server.');
      console.error(err);
    }
  });

  // Quick suggestion click handlers
  document.querySelectorAll('.suggestion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      chatInput.value = btn.innerText.replace(/^["']|["']$/g, '').trim();
      chatForm.dispatchEvent(new Event('submit'));
    });
  });

  function appendUserMessage(text) {
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const msgHtml = `
      <div class="flex justify-end gap-3 fade-in">
        <div class="max-w-[80%] bg-emerald-600 text-white p-3.5 rounded-2xl rounded-tr-none shadow-md">
          <p class="text-sm leading-relaxed whitespace-pre-line">${escapeHtml(text)}</p>
          <span class="block text-[10px] text-emerald-100 text-right mt-1">${timeStr}</span>
        </div>
        <div class="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow">
          Anda
        </div>
      </div>
    `;
    chatMessages.insertAdjacentHTML('beforeend', msgHtml);
    scrollToBottom();
  }

  function appendBotMessage(text) {
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const msgHtml = `
      <div class="flex gap-3 fade-in">
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow">
          AI
        </div>
        <div class="max-w-[80%] bg-slate-800 border border-slate-700 text-slate-100 p-3.5 rounded-2xl rounded-tl-none shadow-md">
          <p class="text-sm leading-relaxed whitespace-pre-line">${escapeHtml(text)}</p>
          <span class="block text-[10px] text-slate-400 mt-1">${timeStr} • Toko Ariesta Bot</span>
        </div>
      </div>
    `;
    chatMessages.insertAdjacentHTML('beforeend', msgHtml);
    scrollToBottom();
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
});
