/**
 * Nusa Antara — Bar Hala Ai Bot Character Controller
 * Manages blinking, gaze tracking, lip-sync, expressions, and animations.
 */

class BarongCharacter {
  constructor(containerId = 'barong-character-stage') {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.warn(`Container #${containerId} not found, will bind when DOM is ready.`);
    }

    // State
    this.isBlinking = false;
    this.isSpeaking = false;
    this.currentExpression = 'idle';
    this.gaze = {
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
      maxRadius: 12, // Maximum displacement in pixels
      lastMoveTime: Date.now(),
      autoCenterDelay: 4500
    };

    // Timing
    this.blinkTimer = null;
    this.rafId = null;
    this.expressionTimeout = null;

    // DOM references
    this.dom = {
      character: null,
      aura: null,
      leftEye: null,
      rightEye: null,
      leftEyeball: null,
      rightEyeball: null,
      jaw: null
    };

    // Bind event handlers
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.animateGazeLoop = this.animateGazeLoop.bind(this);
  }

  /**
   * Initialize character markup and events
   */
  init() {
    if (!this.container) {
      this.container = document.querySelector('.barong-stage');
      if (!this.container) return;
    }

    this.render();
    this.cacheDom();
    this.bindEvents();
    this.startBlinkLoop();
    this.startGazeTracking();

    console.log('👹 Bar Hala Ai Character initialized successfully.');
  }

  /**
   * Render internal character DOM structure if not pre-rendered
   */
  render() {
    if (this.container.querySelector('.barong-character')) {
      return; // Already rendered in HTML
    }

    this.container.innerHTML = `
      <!-- 2 Lapisan Shading Bergelombang Warna-Warni di Belakang Masker Barong -->
      <div class="barong-wave-layer-1" aria-hidden="true"></div>
      <div class="barong-wave-layer-2" aria-hidden="true"></div>
      <div class="barong-shadow"></div>
      <div class="barong-character">
        <!-- 1 Gambar Tunggal Barong (Tanpa Lapisan Gambar Ganda) -->
        <img class="barong-art-base" src="assets/bot-base-transparent.png" alt="Bar Hala Ai Mask" />
        
        <!-- Efek Resonansi Suara Mulut Saat Bicara (Glow Soundwave) -->
        <div class="barong-speech-pulse" aria-hidden="true"></div>

        <!-- Left Eye Socket -->
        <div class="barong-eye-socket left" data-eye="left">
          <div class="barong-sclera"></div>
          <div class="barong-eyeball">
            <div class="barong-iris">
              <div class="barong-pupil">
                <div class="barong-catchlight"></div>
                <div class="barong-catchlight-sub"></div>
              </div>
            </div>
          </div>
          <div class="barong-eyelid-top"></div>
          <div class="barong-eyelid-bottom"></div>
        </div>

        <!-- Right Eye Socket -->
        <div class="barong-eye-socket right" data-eye="right">
          <div class="barong-sclera"></div>
          <div class="barong-eyeball">
            <div class="barong-iris">
              <div class="barong-pupil">
                <div class="barong-catchlight"></div>
                <div class="barong-catchlight-sub"></div>
              </div>
            </div>
          </div>
          <div class="barong-eyelid-top"></div>
          <div class="barong-eyelid-bottom"></div>
        </div>
      </div>
    `;
  }

  /**
   * Cache DOM element references
   */
  cacheDom() {
    this.dom.character = this.container.querySelector('.barong-character');
    this.dom.aura = this.container.querySelector('.barong-aura');
    this.dom.leftEye = this.container.querySelector('.barong-eye-socket.left');
    this.dom.rightEye = this.container.querySelector('.barong-eye-socket.right');
    this.dom.leftEyeball = this.dom.leftEye ? this.dom.leftEye.querySelector('.barong-eyeball') : null;
    this.dom.rightEyeball = this.dom.rightEye ? this.dom.rightEye.querySelector('.barong-eyeball') : null;
    this.dom.speechPulse = this.container.querySelector('.barong-speech-pulse');
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    window.addEventListener('touchmove', this.handleTouchMove, { passive: true });
    this.container.addEventListener('click', this.handleClick);
  }

  /* ==========================================================================
     BLINK ENGINE
     ========================================================================== */

  /**
   * Start natural blinking timer loop
   */
  startBlinkLoop() {
    this.stopBlinkLoop();
    // Random natural blink interval: between 2.6s and 5.2s
    const nextInterval = Math.floor(Math.random() * (5200 - 2600 + 1)) + 2600;
    this.blinkTimer = setTimeout(() => {
      this.triggerBlink();
      this.startBlinkLoop();
    }, nextInterval);
  }

  /**
   * Stop blinking loop
   */
  stopBlinkLoop() {
    if (this.blinkTimer) {
      clearTimeout(this.blinkTimer);
      this.blinkTimer = null;
    }
  }

  /**
   * Trigger a natural eyelid blink
   * @param {boolean} allowDoubleBlink - Whether a double-blink can occur
   */
  triggerBlink(allowDoubleBlink = true) {
    if (!this.dom.leftEye || !this.dom.rightEye || this.isBlinking) return;

    this.isBlinking = true;
    this.dom.leftEye.classList.add('blinking');
    this.dom.rightEye.classList.add('blinking');

    // Natural human eyelid closure duration: 90ms
    setTimeout(() => {
      this.dom.leftEye.classList.remove('blinking');
      this.dom.rightEye.classList.remove('blinking');
      this.isBlinking = false;

      // 22% probability of a playful double-blink
      if (allowDoubleBlink && Math.random() < 0.22) {
        setTimeout(() => {
          this.triggerBlink(false);
        }, 120);
      }
    }, 90);
  }

  /* ==========================================================================
     GAZE TRACKING ENGINE
     ========================================================================== */

  /**
   * Handle mouse movement across the viewport
   */
  handleMouseMove(e) {
    this.updateGazeTarget(e.clientX, e.clientY);
  }

  /**
   * Handle touch movement
   */
  handleTouchMove(e) {
    if (e.touches && e.touches[0]) {
      this.updateGazeTarget(e.touches[0].clientX, e.touches[0].clientY);
    }
  }

  /**
   * Calculate target pupil displacement relative to eye center
   */
  updateGazeTarget(pointerX, pointerY) {
    if (!this.dom.character) return;
    this.gaze.lastMoveTime = Date.now();

    const rect = this.container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height * 0.43; // Eye height baseline

    const deltaX = pointerX - centerX;
    const deltaY = pointerY - centerY;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance === 0) {
      this.gaze.targetX = 0;
      this.gaze.targetY = 0;
      return;
    }

    // Dynamic scale based on container width
    const scaleFactor = rect.width / 440;
    const maxRadius = this.gaze.maxRadius * scaleFactor;

    // Normalize and scale with gentle curve
    const clampDist = Math.min(distance / 20, maxRadius);
    this.gaze.targetX = (deltaX / distance) * clampDist;
    this.gaze.targetY = (deltaY / distance) * clampDist;
  }

  /**
   * Silky smooth interpolation loop for pupil positions
   */
  startGazeTracking() {
    this.rafId = requestAnimationFrame(this.animateGazeLoop);
  }

  animateGazeLoop() {
    // Auto-center gaze if mouse has been idle for several seconds
    const now = Date.now();
    if (now - this.gaze.lastMoveTime > this.gaze.autoCenterDelay) {
      this.gaze.targetX = 0;
      this.gaze.targetY = 0;
    }

    // Don't track if thinking expression is overriding gaze
    if (this.currentExpression !== 'thinking') {
      // Lerp interpolation (0.12 factor)
      this.gaze.currentX += (this.gaze.targetX - this.gaze.currentX) * 0.12;
      this.gaze.currentY += (this.gaze.targetY - this.gaze.currentY) * 0.12;

      const tx = this.gaze.currentX.toFixed(2);
      const ty = this.gaze.currentY.toFixed(2);

      if (this.dom.leftEyeball && this.dom.rightEyeball) {
        this.dom.leftEyeball.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
        this.dom.rightEyeball.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
      }
    }

    this.rafId = requestAnimationFrame(this.animateGazeLoop);
  }

  /* ==========================================================================
     LIP-SYNC & SPEECH ENGINE
     ========================================================================== */

  /**
   * Set speaking animation state
   * @param {boolean} speaking
   */
  setSpeaking(speaking) {
    this.isSpeaking = Boolean(speaking);

    if (!this.dom.character) return;

    if (this.isSpeaking) {
      this.dom.character.classList.add('speaking');
      if (this.dom.aura) this.dom.aura.classList.add('speaking');
    } else {
      this.dom.character.classList.remove('speaking');
      if (this.dom.aura) this.dom.aura.classList.remove('speaking');
    }
  }

  /* ==========================================================================
     EMOTION & EXPRESSION ENGINE
     ========================================================================== */

  /**
   * Set emotional expression
   * @param {'idle'|'speaking'|'thinking'|'happy'|'surprised'} expression
   * @param {number} autoRevertMs - Delay to revert back to idle
   */
  setExpression(expression, autoRevertMs = 0) {
    if (!this.dom.character) return;

    // Clear existing expression timeout
    if (this.expressionTimeout) {
      clearTimeout(this.expressionTimeout);
      this.expressionTimeout = null;
    }

    // Remove previous expression classes
    const validExpressions = ['idle', 'thinking', 'happy', 'surprised'];
    validExpressions.forEach(exp => {
      this.dom.character.classList.remove(exp);
      if (this.dom.aura) this.dom.aura.classList.remove(exp);
    });

    this.currentExpression = expression;

    if (expression !== 'idle') {
      this.dom.character.classList.add(expression);
      if (this.dom.aura) this.dom.aura.classList.add(expression);
    }

    // Auto-revert if requested
    if (autoRevertMs > 0 && expression !== 'idle') {
      this.expressionTimeout = setTimeout(() => {
        this.setExpression('idle');
      }, autoRevertMs);
    }
  }

  /* ==========================================================================
     INTERACTIONS & PARTICLES
     ========================================================================== */

  /**
   * Handle user click on character
   */
  handleClick(e) {
    // Mata tetap normal, hanya memicu kedip alami sekali
    this.triggerBlink();
    this.createSparkles(e.clientX, e.clientY);

    // Dispatch custom event for external listeners
    const event = new CustomEvent('barong:click', {
      detail: { x: e.clientX, y: e.clientY }
    });
    this.container.dispatchEvent(event);
  }

  /**
   * Create golden aura sparkles on click
   */
  createSparkles(clientX, clientY) {
    const rect = this.container.getBoundingClientRect();
    const x = clientX ? clientX - rect.left : rect.width / 2;
    const y = clientY ? clientY - rect.top : rect.height / 2;

    const count = 7;
    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'barong-sparkle';
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;

      const angle = (Math.PI * 2 * i) / count;
      const dist = 35 + Math.random() * 45;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;

      sparkle.style.setProperty('--tx', `${tx}px`);
      sparkle.style.setProperty('--ty', `${ty}px`);

      this.container.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 800);
    }
  }

  /**
   * Cleanup resources
   */
  destroy() {
    this.stopBlinkLoop();
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.expressionTimeout) clearTimeout(this.expressionTimeout);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('touchmove', this.handleTouchMove);
  }
}

// Export for module or global use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BarongCharacter;
} else {
  window.BarongCharacter = BarongCharacter;
}

