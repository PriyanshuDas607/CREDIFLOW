// Crediflow TrustBot Integration
document.addEventListener('DOMContentLoaded', () => {
    injectChatWidget();
});

function injectChatWidget() {
    const chatContainer = document.createElement('div');
    chatContainer.id = 'crediflow-chat-widget';
    chatContainer.innerHTML = `
        <div id="chat-bubble" style="
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 60px;
            height: 60px;
            background: var(--gradient-primary);
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 9999;
            transition: transform 0.2s;
        ">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
        </div>

        <div id="chat-window" style="
            position: fixed;
            bottom: 6rem;
            right: 2rem;
            width: 350px;
            height: 500px;
            background: white;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 9999;
            border: 1px solid var(--border-color);
        ">
            <!-- Header -->
            <div style="background: var(--bg-slate); padding: 1rem; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 8px; height: 8px; background: var(--primary-green); border-radius: 50%;"></div>
                    <span style="font-weight: 600;">TrustBot AI</span>
                </div>
                <button id="close-chat" style="background: none; border: none; cursor: pointer; font-size: 1.2rem;">&times;</button>
            </div>

            <!-- Messages Area -->
            <div id="chat-messages" style="flex: 1; padding: 1rem; overflow-y: auto; background: #fff;">
                <div class="message system" style="margin-bottom: 1rem; display: flex; justify-content: flex-start;">
                    <div style="background: var(--bg-slate); padding: 0.75rem; border-radius: 0.75rem 0.75rem 0.75rem 0; max-width: 80%; font-size: 0.9rem;">
                        Hello! I'm TrustBot. Ask me about your credit score or how to improve it.
                    </div>
                </div>
            </div>

            <!-- Input Area -->
            <div style="padding: 1rem; border-top: 1px solid var(--border-color);">
                <form id="chat-form" style="display: flex; gap: 0.5rem;">
                    <input type="text" id="chat-input" placeholder="Type your query..." style="flex: 1; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 0.5rem; outline: none;">
                    <button type="submit" style="background: var(--secondary-blue); color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer;">Send</button>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(chatContainer);

    // Event Listeners
    const bubble = document.getElementById('chat-bubble');
    const windowEl = document.getElementById('chat-window');
    const closeBtn = document.getElementById('close-chat');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');

    bubble.addEventListener('click', () => {
        windowEl.style.display = 'flex';
        bubble.style.display = 'none';
        input.focus();
    });

    closeBtn.addEventListener('click', () => {
        windowEl.style.display = 'none';
        bubble.style.display = 'flex';
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = input.value.trim();
        if (!query) return;

        // User Message
        appendMessage(query, 'user');
        input.value = '';

        // Simulate AI Typing
        appendMessage('Thinking...', 'system', true); // true = temp loading

        // Placeholder for Gemini API Call
        // In real impl, fetch from backend or API
        setTimeout(() => {
            // Remove loading
            const loadingMsg = document.querySelector('.loading-msg');
            if (loadingMsg) loadingMsg.remove();

            const response = mockGeminiResponse(query);
            appendMessage(response, 'system');
        }, 1500);
    });

    function appendMessage(text, sender, isLoading = false) {
        const div = document.createElement('div');
        div.className = `message ${sender} ${isLoading ? 'loading-msg' : ''}`;
        div.style.display = 'flex';
        div.style.justifyContent = sender === 'user' ? 'flex-end' : 'flex-start';
        div.style.marginBottom = '1rem';

        const bubble = document.createElement('div');
        bubble.style.padding = '0.75rem';
        bubble.style.borderRadius = sender === 'user' ? '0.75rem 0.75rem 0 0.75rem' : '0.75rem 0.75rem 0.75rem 0';
        bubble.style.backgroundColor = sender === 'user' ? 'var(--secondary-blue)' : 'var(--bg-slate)';
        bubble.style.color = sender === 'user' ? 'white' : 'var(--text-dark)';
        bubble.style.maxWidth = '80%';
        bubble.style.fontSize = '0.9rem';
        bubble.innerText = text;

        div.appendChild(bubble);
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function mockGeminiResponse(query) {
        const q = query.toLowerCase();
        if (q.includes('score') || q.includes('why')) {
            return "Your Trust Score is 785, which is excellent! It's calculated based on your timely loan repayments and consistent income.";
        } else if (q.includes('improve')) {
            return "To improve further, consider diversifying your credit mix or maintaining a low credit utilization ratio.";
        } else if (q.includes('issue') || q.includes('problem')) {
            return "I can help with that. Please verify your internet connection or try refreshing the page. For ID upload issues, ensure the file is under 5MB.";
        } else {
            return "I'm focusing on your financial trust queries. Can you ask about your score or account services?";
        }
    }
}
