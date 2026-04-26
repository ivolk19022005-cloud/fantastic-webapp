// ============ СЛОТЫ ============
const Slots = {
    SYMBOLS: ['🍒', '🍊', '🍋', '🍉', '⭐', '7️⃣', '🔔', '💎'],
    spinning: false,

    render(el) {
        el.innerHTML = `
            <div class="slots-machine">
                <div class="slots-reels">
                    <div class="slot-reel" id="r0">🍒</div>
                    <div class="slot-reel" id="r1">🍊</div>
                    <div class="slot-reel" id="r2">🍋</div>
                </div>
                <div class="bet-input-group">
                    <label>💰 Ставка:</label>
                    <input type="number" id="slotsBet" value="100" min="10">
                </div>
                <button class="big-btn" id="spinBtn" onclick="Slots.spin()">🎰 КРУТИТЬ!</button>
                <div id="slotsResult"></div>
            </div>`;
    },

    spin() {
        if (this.spinning) return;

        const betInput = $('slotsBet');
        const bet = betInput ? (parseInt(betInput.value) || 100) : 100;

        if (bet < 10) { showAlert('Минимальная ставка: 10 🪙'); return; }
        if (bet > State.profile.coins) { showAlert('Недостаточно монет!'); return; }

        State.subtractCoins(bet);
        this.spinning = true;

        const btn = $('spinBtn');
        if (btn) btn.disabled = true;

        const resEl = $('slotsResult');
        if (resEl) resEl.innerHTML = '';

        const reels = ['r0', 'r1', 'r2'].map(id => $(id));
        reels.forEach(r => { if (r) r.classList.add('spinning'); });

        let spins = 0;
        const interval = setInterval(() => {
            reels.forEach(r => {
                if (r) r.textContent = this.SYMBOLS[Math.floor(Math.random() * this.SYMBOLS.length)];
            });
            spins++;

            if (spins >= 15) {
                clearInterval(interval);
                reels.forEach(r => { if (r) r.classList.remove('spinning'); });
                const symbols = reels.map(r => r ? r.textContent : '🍒');
                this.finish(symbols, bet);
            }
        }, 80);
    },

    finish(s, bet) {
        const el = $('slotsResult');
        if (!el) return;

        const [a, b, c] = s;
        let win = false;
        let reward = 0;

        if (a === b && b === c) {
            win = true;
            const multipliers = { '💎': 10, '7️⃣': 7, '⭐': 3, '🔔': 5 };
            const mult = multipliers[a] || 1.5;
            reward = Math.floor(bet * mult);
            State.addCoins(reward);
            if (el) {
                el.className = 'result win';
                el.innerHTML = `🎉 <b>ДЖЕКПОТ!</b> ${s.join('')}<br>+${formatNumber(reward)} 🪙`;
            }
        } else if (a === b || b === c || a === c) {
            win = true;
            reward = Math.floor(bet * 1.2);
            State.addCoins(reward);
            if (el) {
                el.className = 'result win';
                el.innerHTML = `👍 <b>Пара!</b> ${s.join('')}<br>+${formatNumber(reward)} 🪙`;
            }
        } else {
            if (el) {
                el.className = 'result lose';
                el.innerHTML = `😢 <b>Мимо!</b> ${s.join('')}<br>-${formatNumber(bet)} 🪙`;
            }
        }

        API.gameResult('slots', win, bet, reward);
        this.spinning = false;
        const btn = $('spinBtn');
        if (btn) btn.disabled = false;
    }
};

window.Slots = Slots;