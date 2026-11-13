/**
 * Nusa Antara — Bar Hala Ai Chatbot Engine
 * Connects conversation logic with character animation and audio.
 */

class BarongChatbot {
  constructor(characterInstance, audioInstance, options = {}) {
    this.character = characterInstance;
    this.audio = audioInstance;
    this.knowledge = window.NUSA_ANTARA_KNOWLEDGE || {};

    this.options = Object.assign({
      containerId: 'barong-chat-container',
      messagesId: 'barong-chat-messages',
      inputId: 'barong-chat-input',
      formId: 'barong-chat-form',
      speechBubbleId: 'barong-speech-bubble',
      quickChipsId: 'barong-quick-chips',
      typeSpeed: 24 // ms per character
    }, options);

    this.isResponding = false;
    this.messages = [];

    this.dom = {
      container: null,
      messagesList: null,
      input: null,
      form: null,
      speechBubble: null,
      quickChips: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Initialize chatbot elements & handlers
   */
  init() {
    this.dom.container = document.getElementById(this.options.containerId);
    this.dom.messagesList = document.getElementById(this.options.messagesId);
    this.dom.input = document.getElementById(this.options.inputId);
    this.dom.form = document.getElementById(this.options.formId);
    this.dom.speechBubble = document.getElementById(this.options.speechBubbleId);
    this.dom.quickChips = document.getElementById(this.options.quickChipsId);

    if (this.dom.form) {
      this.dom.form.addEventListener('submit', this.handleSubmit);
    }

    this.renderQuickChips();

    // Initial greeting after 600ms
    setTimeout(() => {
      this.sendInitialGreeting();
    }, 600);

    console.log('💬 Bar Hala Ai Chatbot Engine initialized.');
  }

  /**
   * Render quick suggestion chips
   */
  renderQuickChips() {
    if (!this.dom.quickChips || !this.knowledge.quickSuggestions) return;

    this.dom.quickChips.innerHTML = '';
    this.knowledge.quickSuggestions.forEach(item => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chat-quick-chip';
      chip.textContent = item.label;
      chip.addEventListener('click', () => {
        this.processUserInput(item.query);
      });
      this.dom.quickChips.appendChild(chip);
    });
  }

  /**
   * Send the initial welcome message
   */
  sendInitialGreeting() {
    const greetings = this.knowledge.profile?.greetings || [
      "Rahajeng! Saya Bar Hala Ai, siap memandu perjalanan budayamu!"
    ];
    const welcome = greetings[Math.floor(Math.random() * greetings.length)];
    this.deliverBotResponse(welcome, 'happy');
  }

  /**
   * Handle user form submission
   */
  handleSubmit(e) {
    e.preventDefault();
    if (!this.dom.input) return;

    const query = this.dom.input.value.trim();
    if (!query || this.isResponding) return;

    this.dom.input.value = '';
    this.processUserInput(query);
  }

  /**
   * Process a message from user
   */
  processUserInput(text) {
    if (this.isResponding) return;

    // 1. Append user message to chat UI
    this.appendMessage('user', text);

    // 2. Play subtle UI sound
    if (this.audio) this.audio.playSendSound();

    // 3. Put character in thinking state
    this.isResponding = true;
    if (this.character) {
      this.character.setExpression('thinking');
    }

    // 4. Simulate natural AI deliberation delay (450ms - 850ms)
    const thinkingDelay = Math.floor(Math.random() * (850 - 450 + 1)) + 450;
    setTimeout(() => {
      const responseData = this.generateResponse(text);
      this.deliverBotResponse(responseData.text, responseData.expression);
    }, thinkingDelay);
  }

  /**
   * Match query against knowledge base
   */
  generateResponse(query) {
    const cleanQuery = query.toLowerCase().trim();

    // Check topics in knowledge base
    const topics = this.knowledge.topics || [];
    let bestMatch = null;
    let highestScore = 0;

    for (const topic of topics) {
      let score = 0;
      for (const keyword of topic.keywords) {
        if (cleanQuery.includes(keyword.toLowerCase())) {
          score += 1;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = topic;
      }
    }

    if (bestMatch && highestScore > 0) {
      return {
        text: bestMatch.response,
        expression: bestMatch.expression || 'speaking'
      };
    }

    // Fallback response
    const fallbacks = this.knowledge.fallbackResponses || [
      "Menarik sekali! Mau saya carikan rekomendasi destinasi budaya, festival adat, atau tips BMKG?"
    ];
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return {
      text: randomFallback,
      expression: 'speaking'
    };
  }

  /**
   * Deliver bot response with typewriter effect and lip-sync
   */
  deliverBotResponse(fullText, expression = 'speaking') {
    // Play gamelan bell chime
    if (this.audio) this.audio.playReceiveSound();

    // Update speech bubble above character
    this.updateSpeechBubble(fullText);

    // Set character expression
    if (this.character) {
      this.character.setExpression(expression);
      this.character.setSpeaking(true);
      this.character.triggerBlink();
    }

    // Create bot message element in chat list
    const messageEl = this.createMessageElement('bot');
    const textContainer = messageEl.querySelector('.chat-message-text');
    this.dom.messagesList.appendChild(messageEl);
    this.scrollToBottom();

    // Typewriter state
    let charIndex = 0;
    const speed = this.options.typeSpeed;

    const typeInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        charIndex += 2; // Type 2 chars per tick for responsive reading speed
        const currentSlice = fullText.slice(0, charIndex);
        textContainer.innerHTML = this.formatMarkdown(currentSlice);

        // Micro speech blip sound every few characters
        if (this.audio && charIndex % 6 === 0) {
          this.audio.playSpeechBlip();
        }

        this.scrollToBottom();
      } else {
        clearInterval(typeInterval);
        textContainer.innerHTML = this.formatMarkdown(fullText);
        this.scrollToBottom();

        // Finish speaking animation
        if (this.character) {
          this.character.setSpeaking(false);
          // Return to idle after a while
          setTimeout(() => {
            this.character.setExpression('idle');
          }, 1800);
        }

        this.isResponding = false;
      }
    }, speed);
  }

  /**
   * Update floating speech bubble near character
   */
  updateSpeechBubble(text) {
    if (!this.dom.speechBubble) return;

    // Truncate for bubble if too long
    const bubbleText = text.length > 120 ? text.slice(0, 115) + '...' : text;
    this.dom.speechBubble.innerHTML = this.formatMarkdown(bubbleText);
    this.dom.speechBubble.classList.add('visible');

    // Auto-hide bubble after reading duration
    clearTimeout(this.bubbleTimer);
    const readDuration = Math.max(3500, bubbleText.length * 70);
    this.bubbleTimer = setTimeout(() => {
      this.dom.speechBubble.classList.remove('visible');
    }, readDuration);
  }

  /**
   * Append a chat message to DOM
   */
  appendMessage(sender, text) {
    const el = this.createMessageElement(sender);
    const textContainer = el.querySelector('.chat-message-text');
    textContainer.innerHTML = this.formatMarkdown(text);
    this.dom.messagesList.appendChild(el);
    this.scrollToBottom();
  }

  /**
   * Create message element markup
   */
  createMessageElement(sender) {
    const item = document.createElement('div');
    item.className = `chat-message ${sender}`;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (sender === 'bot') {
      item.innerHTML = `
        <div class="chat-bubble">
          <div class="chat-sender-name">Bar Hala Ai</div>
          <div class="chat-message-text"></div>
          <div class="chat-time">${timeStr}</div>
        </div>
      `;
    } else {
      item.innerHTML = `
        <div class="chat-bubble">
          <div class="chat-message-text"></div>
          <div class="chat-time">${timeStr}</div>
        </div>
      `;
    }

    return item;
  }

  /**
   * Simple safe Markdown parser for bold, italics, bullets, and line breaks
   */
  formatMarkdown(text) {
    if (!text) return '';
    let parsed = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');

    return parsed;
  }

  /**
   * Auto scroll chat to bottom
   */
  scrollToBottom() {
    if (this.dom.messagesList) {
      this.dom.messagesList.scrollTop = this.dom.messagesList.scrollHeight;
    }
  }

  /**
   * Clear message history
   */
  clear() {
    if (this.dom.messagesList) {
      this.dom.messagesList.innerHTML = '';
      this.sendInitialGreeting();
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BarongChatbot;
} else {
  window.BarongChatbot = BarongChatbot;
}

