// ============ РУЛЕТКА ============
const Roulette = {
    render(el) {
        el.innerHTML = `
            <div class="slots-machine">
                <h2>🎡 Рулетка</h2>
                <div class="bet-input-group">
                    <label>💰 Ставка:</label>
                    <input type="number" id="roulBet" value="100" min="10">
                </div>
                <button class="big-btn" onclick="Roulette.play()">🎡 КРУТИТЬ!</button>
                <div id="roulResult"></div>
            </div>`;
    },

    play() {
        const betInput = $('roulBet');
        const bet = betInput ? (parseInt(betInput.value) || 100) : 100;

        if (bet > State.profile.coins) { showAlert('Недостаточно монет!'); return; }

        State.subtractCoins(bet);

        const roll = Math.random();
        const el = $('roulResult');
        let win = false;
        let reward = 0;

        if (roll < 0.3) {
            win = true;
            const mult = roll < 0.15 ? 1.5 : roll < 0.225 ? 2 : roll < 0.27 ? 3 : roll < 0.295 ? 5 : 10;
            reward = Math.floor(bet * mult);
            State.addCoins(reward);
            if (el) {
                el.className = 'result win';
                el.innerHTML = `🎉 <b>×${mult}!</b><br>+${formatNumber(reward)} 🪙`;
            }
        } else {
            if (el) {
                el.className = 'result lose';
                el.innerHTML = `😢 <b>Не повезло!</b><br>-${formatNumber(bet)} 🪙`;
            }
        }

        API.gameResult('roulette', win, bet, reward);
    }
};

window.Roulette = Roulette;