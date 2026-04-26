// ============ ВА-БАНК ============
const VaBank = {
    render(el) {
        el.innerHTML = `
            <div class="slots-machine">
                <h2>💎 Ва-Банк</h2>
                <p style="color:#aaa">Ставка: весь баланс (${formatNumber(State.profile.coins)} 🪙)</p>
                <p style="color:#ffd700;margin:10px 0">50% — удвоить, 50% — потерять всё!</p>
                <button class="big-btn" style="background:linear-gradient(135deg,#ef4444,#dc2626)" onclick="VaBank.play()">💎 ВА-БАНК!</button>
                <div id="vaResult"></div>
            </div>`;
    },

    play() {
        const bet = State.profile.coins;
        if (bet <= 0) { showAlert('Нечего ставить!'); return; }

        State.profile.coins = 0;

        const won = Math.random() < 0.5;
        const el = $('vaResult');
        let reward = 0;

        if (won) {
            reward = bet * 2;
            State.addCoins(reward);
            if (el) {
                el.className = 'result win';
                el.innerHTML = `🎉 <b>УДВОЕНИЕ!</b><br>+${formatNumber(reward)} 🪙`;
            }
        } else {
            if (el) {
                el.className = 'result lose';
                el.innerHTML = `💀 <b>ПОТЕРЯНО ВСЁ!</b><br>-${formatNumber(bet)} 🪙`;
            }
        }

        API.gameResult('va_bank', won, bet, reward);
        State.save();
    }
};

window.VaBank = VaBank;