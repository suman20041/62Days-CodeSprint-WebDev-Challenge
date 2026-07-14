/**
 * Password Strength Analyzer Pro
 * Real-time password analysis, entropy estimation, and secure generation.
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Common passwords (subset of top breached passwords)
  // ---------------------------------------------------------------------------
  const COMMON_PASSWORDS = new Set([
    'password', '123456', '123456789', '12345678', '12345', '1234567',
    'password1', '1234567890', 'qwerty', 'abc123', '111111', '123123',
    'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master', 'login',
    'princess', 'football', 'shadow', 'sunshine', 'iloveyou', 'trustno1',
    'passw0rd', 'password123', 'qwerty123', 'admin123', 'root', 'toor',
    'guest', 'test', 'demo', 'changeme', 'secret', 'pass', 'access',
    'superman', 'batman', 'starwars', 'baseball', 'soccer', 'hockey',
    'mustang', 'mercedes', 'corvette', 'porsche', 'ferrari', 'jordan',
    'michael', 'jennifer', 'jessica', 'ashley', 'matthew', 'daniel',
    'computer', 'internet', 'samsung', 'apple', 'google', 'microsoft',
    'hello', 'world', 'freedom', 'whatever', 'nothing', 'qazwsx',
    '1q2w3e4r', '1qaz2wsx', 'zaq12wsx', 'asdfgh', 'zxcvbn', 'asdfghjkl',
    'password!', 'Password1', 'Password123', 'Qwerty123', 'Admin123',
    'welcome1', 'welcome123', 'letmein1', 'pass1234', 'test1234',
    '000000', '654321', '666666', '888888', '999999', '121212', '696969',
    'killer', 'pepper', 'cookie', 'cheese', 'coffee', 'summer', 'winter',
    'spring', 'autumn', 'thunder', 'lightning', 'rainbow', 'flower',
    'purple', 'yellow', 'orange', 'silver', 'golden', 'diamond', 'platinum'
  ]);

  const SEQUENCES = [
    '0123456789', '9876543210', 'abcdefghijklmnopqrstuvwxyz',
    'zyxwvutsrqponmlkjihgfedcba', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'
  ];

  const STRENGTH_LEVELS = [
    { min: 0, label: 'Very Weak', class: 'very-weak', color: '#ef4444' },
    { min: 20, label: 'Weak', class: 'weak', color: '#f97316' },
    { min: 40, label: 'Fair', class: 'fair', color: '#eab308' },
    { min: 60, label: 'Good', class: 'good', color: '#22c55e' },
    { min: 80, label: 'Strong', class: 'strong', color: '#10b981' },
    { min: 95, label: 'Excellent', class: 'excellent', color: '#06b6d4' }
  ];

  const ENTROPY_LEVELS = [
    { min: 0, label: '—', class: 'none' },
    { min: 1, label: 'Very Low', class: 'very-low' },
    { min: 28, label: 'Low', class: 'low' },
    { min: 45, label: 'Moderate', class: 'moderate' },
    { min: 60, label: 'High', class: 'high' },
    { min: 80, label: 'Very High', class: 'very-high' }
  ];

  const SUGGESTION_ICONS = {
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
  };

  const REQUIREMENT_KEYS = [
    'length', 'length12', 'uppercase', 'lowercase', 'number',
    'special', 'noCommon', 'noSequence', 'noRepeat'
  ];

  // Guesses per second (approximate offline hash crack rate)
  const GUESSES_PER_SECOND = 1e10;

  function getEntropyLevel(entropy, hasPassword) {
    if (!hasPassword) return ENTROPY_LEVELS[0];
    let level = ENTROPY_LEVELS[1];
    for (const l of ENTROPY_LEVELS) {
      if (entropy >= l.min) level = l;
    }
    return level;
  }
  const els = {
    html: document.documentElement,
    passwordInput: document.getElementById('passwordInput'),
    toggleVisibility: document.getElementById('toggleVisibility'),
    copyPassword: document.getElementById('copyPassword'),
    themeToggle: document.getElementById('themeToggle'),
    strengthLabel: document.getElementById('strengthLabel'),
    strengthScore: document.getElementById('strengthScore'),
    strengthMeter: document.getElementById('strengthMeter'),
    strengthBar: document.getElementById('strengthBar'),
    entropyValue: document.getElementById('entropyValue'),
    entropyBadge: document.getElementById('entropyBadge'),
    crackTime: document.getElementById('crackTime'),
    passwordLength: document.getElementById('passwordLength'),
    charCount: document.getElementById('charCount'),
    clearPassword: document.getElementById('clearPassword'),
    requirementsProgress: document.getElementById('requirementsProgress'),
    requirementsBar: document.getElementById('requirementsBar'),
    requirementsBarFill: document.getElementById('requirementsBarFill'),
    commonPasswordAlert: document.getElementById('commonPasswordAlert'),
    commonPasswordMessage: document.getElementById('commonPasswordMessage'),
    requirementsList: document.getElementById('requirementsList'),
    suggestionsList: document.getElementById('suggestionsList'),
    genLength: document.getElementById('genLength'),
    genLengthValue: document.getElementById('genLengthValue'),
    genUppercase: document.getElementById('genUppercase'),
    genLowercase: document.getElementById('genLowercase'),
    genNumbers: document.getElementById('genNumbers'),
    genSymbols: document.getElementById('genSymbols'),
    generatePassword: document.getElementById('generatePassword'),
    toast: document.getElementById('toast')
  };

  // ---------------------------------------------------------------------------
  // Theme
  // ---------------------------------------------------------------------------
  function initTheme() {
    const saved = localStorage.getItem('psa-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    els.html.setAttribute('data-theme', theme);
  }

  function toggleTheme() {
    const current = els.html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    els.html.setAttribute('data-theme', next);
    localStorage.setItem('psa-theme', next);
  }

  // ---------------------------------------------------------------------------
  // Password Analysis
  // ---------------------------------------------------------------------------
  function hasUppercase(str) {
    return /[A-Z]/.test(str);
  }

  function hasLowercase(str) {
    return /[a-z]/.test(str);
  }

  function hasNumber(str) {
    return /[0-9]/.test(str);
  }

  function hasSpecial(str) {
    return /[^A-Za-z0-9]/.test(str);
  }

  function hasRepeatedChars(str) {
    return /(.)\1{2,}/.test(str);
  }

  function hasSequence(str) {
    const lower = str.toLowerCase();
    for (let i = 0; i <= lower.length - 3; i++) {
      const chunk = lower.slice(i, i + 3);
      for (const seq of SEQUENCES) {
        if (seq.includes(chunk)) return true;
      }
    }
    return false;
  }

  function isCommonPassword(str) {
    if (!str) return false;
    const normalized = str.toLowerCase().trim();
    if (COMMON_PASSWORDS.has(normalized)) return true;
    if (COMMON_PASSWORDS.has(str)) return true;
    // Check without common substitutions reversed
    const simplified = normalized
      .replace(/[@]/g, 'a')
      .replace(/[0]/g, 'o')
      .replace(/[1!|]/g, 'i')
      .replace(/[3]/g, 'e')
      .replace(/[4]/g, 'a')
      .replace(/[5]/g, 's')
      .replace(/[$]/g, 's');
    return COMMON_PASSWORDS.has(simplified);
  }

  function calculatePoolSize(password) {
    let pool = 0;
    if (/[a-z]/.test(password)) pool += 26;
    if (/[A-Z]/.test(password)) pool += 26;
    if (/[0-9]/.test(password)) pool += 10;
    if (/[^A-Za-z0-9]/.test(password)) pool += 32;
    return pool || 1;
  }

  function calculateEntropy(password) {
    if (!password.length) return 0;
    const poolSize = calculatePoolSize(password);
    return Math.round(password.length * Math.log2(poolSize) * 10) / 10;
  }

  function formatCrackTime(seconds) {
    if (seconds < 1) return 'Instant';
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
    if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;
    if (seconds < 3153600000000) return `${Math.round(seconds / 3153600000)} millennia`;
    return 'Centuries+';
  }

  function estimateCrackTime(entropy) {
    if (entropy <= 0) return 'Instant';
    const combinations = Math.pow(2, entropy);
    const seconds = combinations / (2 * GUESSES_PER_SECOND);
    return formatCrackTime(seconds);
  }

  function calculateScore(password) {
    if (!password.length) return 0;

    let score = 0;

    // Length scoring (up to 30 points)
    score += Math.min(password.length * 2, 30);

    // Character variety (up to 30 points)
    if (hasLowercase(password)) score += 5;
    if (hasUppercase(password)) score += 5;
    if (hasNumber(password)) score += 5;
    if (hasSpecial(password)) score += 10;
    const types = [hasLowercase, hasUppercase, hasNumber, hasSpecial]
      .filter(fn => fn(password)).length;
    if (types >= 4) score += 5;

    // Entropy bonus (up to 25 points)
    const entropy = calculateEntropy(password);
    score += Math.min(entropy / 2, 25);

    // Penalties
    if (isCommonPassword(password)) score -= 40;
    if (hasRepeatedChars(password)) score -= 10;
    if (hasSequence(password)) score -= 15;
    if (/^[a-zA-Z]+$/.test(password)) score -= 5;
    if (/^[0-9]+$/.test(password)) score -= 15;

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  function getStrengthLevel(score) {
    let level = STRENGTH_LEVELS[0];
    for (const l of STRENGTH_LEVELS) {
      if (score >= l.min) level = l;
    }
    return level;
  }

  function getRequirements(password) {
    return {
      length: password.length >= 8,
      length12: password.length >= 12,
      uppercase: hasUppercase(password),
      lowercase: hasLowercase(password),
      number: hasNumber(password),
      special: hasSpecial(password),
      noCommon: password.length > 0 && !isCommonPassword(password),
      noSequence: password.length > 0 && !hasSequence(password),
      noRepeat: password.length > 0 && !hasRepeatedChars(password)
    };
  }

  function getSuggestions(password, requirements) {
    const suggestions = [];

    if (!password.length) {
      return [{ text: 'Start typing to receive personalized suggestions.', type: 'neutral' }];
    }

    if (isCommonPassword(password)) {
      suggestions.push({
        text: 'Avoid commonly used passwords — they are the first ones attackers try.',
        type: 'warning'
      });
    }

    if (!requirements.length) {
      suggestions.push({ text: 'Use at least 8 characters for basic security.', type: 'default' });
    } else if (!requirements.length12) {
      suggestions.push({ text: 'Increase length to 12+ characters for significantly better protection.', type: 'default' });
    }

    if (!requirements.uppercase) {
      suggestions.push({ text: 'Add uppercase letters to expand the character pool.', type: 'default' });
    }

    if (!requirements.lowercase) {
      suggestions.push({ text: 'Include lowercase letters for mixed-case passwords.', type: 'default' });
    }

    if (!requirements.number) {
      suggestions.push({ text: 'Add numbers to increase complexity.', type: 'default' });
    }

    if (!requirements.special) {
      suggestions.push({ text: 'Include special characters like !@#$%^&* for stronger entropy.', type: 'default' });
    }

    if (!requirements.noSequence) {
      suggestions.push({ text: 'Avoid keyboard patterns and sequential characters (123, abc).', type: 'default' });
    }

    if (!requirements.noRepeat) {
      suggestions.push({ text: 'Avoid repeating the same character multiple times.', type: 'default' });
    }

    const score = calculateScore(password);
    if (score >= 80 && suggestions.length === 0) {
      suggestions.push({ text: 'Great password! Consider using a password manager to store it securely.', type: 'positive' });
    } else if (score >= 60 && suggestions.length <= 1) {
      suggestions.push({ text: 'Good progress — a few more improvements will make this excellent.', type: 'positive' });
    }

    if (suggestions.length === 0) {
      suggestions.push({ text: 'Your password meets all recommended criteria.', type: 'positive' });
    }

    return suggestions.slice(0, 5);
  }

  // ---------------------------------------------------------------------------
  // UI Updates
  // ---------------------------------------------------------------------------
  function updateRequirements(requirements, hasPassword) {
    const items = els.requirementsList.querySelectorAll('.checklist__item');
    let passed = 0;

    items.forEach(item => {
      const key = item.dataset.requirement;
      const met = requirements[key];

      item.classList.remove('is-pass', 'is-fail');

      if (!hasPassword) return;

      item.classList.add(met ? 'is-pass' : 'is-fail');
      if (met) passed++;
    });

    const total = REQUIREMENT_KEYS.length;
    els.requirementsProgress.textContent = hasPassword ? `${passed} / ${total}` : `0 / ${total}`;
    els.requirementsBar.setAttribute('aria-valuenow', hasPassword ? passed : 0);
    els.requirementsBarFill.style.width = hasPassword ? `${(passed / total) * 100}%` : '0%';
  }

  function renderSuggestionMarker(suggestion, index, tipNumber) {
    if (suggestion.type === 'neutral') {
      return `<span class="suggestions__marker suggestions__marker--info" aria-hidden="true">${SUGGESTION_ICONS.info}</span>`;
    }
    if (suggestion.type === 'positive') {
      return `<span class="suggestions__marker suggestions__marker--success" aria-hidden="true">${SUGGESTION_ICONS.success}</span>`;
    }
    if (suggestion.type === 'warning') {
      return `<span class="suggestions__marker suggestions__marker--warning" aria-hidden="true">${SUGGESTION_ICONS.warning}</span>`;
    }
    return `<span class="suggestions__number" aria-hidden="true">${tipNumber}</span>`;
  }

  function updateSuggestions(suggestions) {
    let tipNumber = 0;

    els.suggestionsList.innerHTML = suggestions
      .map((s, index) => {
        if (s.type === 'default') tipNumber++;
        const marker = renderSuggestionMarker(s, index, tipNumber);
        const delay = index * 60;

        return `<li class="suggestions__item suggestions__item--${s.type}" style="animation-delay: ${delay}ms">
          ${marker}
          <span class="suggestions__text">${escapeHtml(s.text)}</span>
        </li>`;
      })
      .join('');
  }

  function updateStrengthUI(password) {
    const score = calculateScore(password);
    const level = getStrengthLevel(score);
    const entropy = calculateEntropy(password);
    const crackTimeStr = estimateCrackTime(entropy);
    const requirements = getRequirements(password);
    const hasPassword = password.length > 0;
    const isCommon = isCommonPassword(password);

    // Strength label & score
    if (!hasPassword) {
      els.strengthLabel.textContent = 'Enter a password';
      els.strengthLabel.className = 'strength-label';
      els.strengthScore.textContent = '—';
    } else {
      els.strengthLabel.textContent = level.label;
      els.strengthLabel.className = `strength-label strength-label--${level.class}`;
      els.strengthScore.textContent = `${score}/100`;
    }

    // Animated meter
    els.strengthBar.style.width = `${score}%`;
    els.strengthBar.style.background = level.color;
    els.strengthBar.classList.toggle('is-animating', hasPassword && score > 0);
    els.strengthMeter.setAttribute('aria-valuenow', score);

    // Metrics
    els.entropyValue.textContent = hasPassword ? `${entropy} bits` : '0 bits';
    els.crackTime.textContent = hasPassword ? crackTimeStr : 'Instant';
    els.passwordLength.textContent = password.length;

    const entropyLevel = getEntropyLevel(entropy, hasPassword);
    els.entropyBadge.textContent = entropyLevel.label;
    els.entropyBadge.className = `entropy-badge entropy-badge--${entropyLevel.class}`;

    // Character count
    els.charCount.textContent = password.length === 1 ? '1 char' : `${password.length} chars`;
    els.charCount.classList.toggle('is-active', hasPassword);

    // Common password alert (only for exact/common matches, not strong passwords)
    const showCommonAlert = hasPassword && isCommon;
    els.commonPasswordAlert.toggleAttribute('hidden', !showCommonAlert);
    if (showCommonAlert) {
      els.commonPasswordMessage.textContent =
        'This password appears in common password lists and is easily guessable.';
    }

    // Requirements & suggestions
    updateRequirements(requirements, hasPassword);
    updateSuggestions(getSuggestions(password, requirements));
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ---------------------------------------------------------------------------
  // Password Generator
  // ---------------------------------------------------------------------------
  const CHARSETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?'
  };

  function generateSecurePassword() {
    const length = parseInt(els.genLength.value, 10);
    let charset = '';
    const required = [];

    if (els.genUppercase.checked) {
      charset += CHARSETS.uppercase;
      required.push(getRandomChar(CHARSETS.uppercase));
    }
    if (els.genLowercase.checked) {
      charset += CHARSETS.lowercase;
      required.push(getRandomChar(CHARSETS.lowercase));
    }
    if (els.genNumbers.checked) {
      charset += CHARSETS.numbers;
      required.push(getRandomChar(CHARSETS.numbers));
    }
    if (els.genSymbols.checked) {
      charset += CHARSETS.symbols;
      required.push(getRandomChar(CHARSETS.symbols));
    }

    if (!charset.length) {
      showToast('Select at least one character type.');
      return null;
    }

    const password = [...required];
    const randomValues = new Uint32Array(length - required.length);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length - required.length; i++) {
      password.push(charset[randomValues[i] % charset.length]);
    }

    // Fisher-Yates shuffle
    for (let i = password.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [password[i], password[j]] = [password[j], password[i]];
    }

    return password.join('');
  }

  function getRandomChar(charset) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return charset[array[0] % charset.length];
  }

  // ---------------------------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------------------------
  let toastTimeout;

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add('is-visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      els.toast.classList.remove('is-visible');
    }, 2500);
  }

  async function copyToClipboard(text) {
    if (!text) {
      showToast('Nothing to copy.');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      showToast('Password copied to clipboard!');
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('Password copied to clipboard!');
    }
  }

  function togglePasswordVisibility() {
    const isPassword = els.passwordInput.type === 'password';
    els.passwordInput.type = isPassword ? 'text' : 'password';
    els.toggleVisibility.classList.toggle('is-visible', isPassword);
    els.toggleVisibility.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    els.toggleVisibility.title = isPassword ? 'Hide password' : 'Show password';
  }

  // ---------------------------------------------------------------------------
  // Event Listeners
  // ---------------------------------------------------------------------------
  function bindEvents() {
    els.passwordInput.addEventListener('input', () => {
      updateStrengthUI(els.passwordInput.value);
    });

    els.clearPassword.addEventListener('click', () => {
      els.passwordInput.value = '';
      els.passwordInput.type = 'password';
      els.toggleVisibility.classList.remove('is-visible');
      els.toggleVisibility.setAttribute('aria-label', 'Show password');
      els.passwordInput.focus();
      updateStrengthUI('');
    });

    els.toggleVisibility.addEventListener('click', togglePasswordVisibility);

    els.copyPassword.addEventListener('click', () => {
      copyToClipboard(els.passwordInput.value);
    });

    els.themeToggle.addEventListener('click', toggleTheme);

    els.genLength.addEventListener('input', () => {
      els.genLengthValue.textContent = els.genLength.value;
    });

    els.generatePassword.addEventListener('click', () => {
      const password = generateSecurePassword();
      if (password) {
        els.passwordInput.value = password;
        els.passwordInput.type = 'text';
        els.toggleVisibility.classList.add('is-visible');
        updateStrengthUI(password);
        showToast('Secure password generated!');
      }
    });

    // Keyboard shortcut: Ctrl/Cmd + G to generate
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        els.generatePassword.click();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------------
  function init() {
    initTheme();
    bindEvents();
    updateStrengthUI('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
