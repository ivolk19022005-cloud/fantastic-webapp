// ============ МОНЕТКА ============
const Coin = {
    render(el) {
        el.innerHTML = `
            <div class="slots-machine">
                <h2>🪙 Орёл или Решка</h2>
                <div class="bet-input-group">
                    <label>💰 Ставка:</label>
                    <input type="number" id="coinBet" value="100" min="10">
                </div>
                <div style="display:flex;gap:10px;margin:10px 0">
                    <button class="big-btn" style="background:#8b5cf6" onclick="Coin.play('orel')">🦅 Орёл</button>
                    <button class="big-btn" style="background:#6366f1" onclick="Coin.play('reshka')">👑 Решка</button>
                </div>
                <div id="coinResult"></div>
            </div>`;
    },

    play(choice) {
        const betInput = $('coinBet');
        const bet = betInput ? (parseInt(betInput.value) || 100) : 100;

        if (bet > State.profile.coins) { showAlert('Недостаточно монет!'); return; }

        State.subtractCoins(bet);

        const sides = ['orel', 'reshka'];
        const result = sides[rnd(0, 1)];
        const el = $('coinResult');
        let win = false;
        let reward = 0;

        if (choice === result) {
            win = true;
            reward = bet * 2;
            State.addCoins(reward);
            if (el) {
                el.className = 'result win';
                el.innerHTML = `🎉 <b>${result === 'orel' ? '🦅 Орёл' : '👑 Решка'}!</b><br>+${formatNumber(reward)} 🪙`;
            }
        } else {
            if (el) {
                el.className = 'result lose';
                el.innerHTML = `😢 <b>${result === 'orel' ? '🦅 Орёл' : '👑 Решка'}</b><br>-${formatNumber(bet)} 🪙`;
            }
        }

        API.gameResult('coin', win, bet, reward);
    }
};

window.Coin = Coin;