// ============ КУБИК ============
const Dice = {
    render(el) {
        el.innerHTML = `
            <div class="slots-machine">
                <h2>🎲 Угадай число</h2>
                <div class="bet-input-group">
                    <label>💰 Ставка:</label>
                    <input type="number" id="diceBet" value="100" min="10">
                </div>
                <div class="bet-input-group">
                    <label>🎯 Число (1-6):</label>
                    <select id="diceGuess">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </select>
                </div>
                <button class="big-btn" onclick="Dice.play()">🎲 БРОСИТЬ!</button>
                <div id="diceResult"></div>
            </div>`;
    },

    play() {
        const betInput = $('diceBet');
        const guessInput = $('diceGuess');
        const bet = betInput ? (parseInt(betInput.value) || 100) : 100;
        const guess = guessInput ? parseInt(guessInput.value) : 1;

        if (bet > State.profile.coins) { showAlert('Недостаточно монет!'); return; }

        State.subtractCoins(bet);

        const roll = rnd(1, 6);
        const el = $('diceResult');
        let win = false;
        let reward = 0;

        if (roll === guess) {
            win = true;
            reward = bet * 6;
            State.addCoins(reward);
            if (el) {
                el.className = 'result win';
                el.innerHTML = `🎉 Выпало: <b>${roll}</b><br>+${formatNumber(reward)} 🪙`;
            }
        } else {
            if (el) {
                el.className = 'result lose';
                el.innerHTML = `😢 Выпало: <b>${roll}</b> (ваше: ${guess})<br>-${formatNumber(bet)} 🪙`;
            }
        }

        API.gameResult('dice', win, bet, reward);
    }
};

window.Dice = Dice;