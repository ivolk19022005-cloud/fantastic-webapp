// ============ ОТРИСОВКА ИНТЕРФЕЙСА ============
const UI = {
    // Обновление отображения монет и статов в шапке
    updateCoinsDisplay() {
        const el = $('coinsDisplay');
        if (!el) return;
        const p = State.profile;
        el.innerHTML = `💰 ${formatNumber(p.coins)} 🪙 | 💎 ${p.crystals} | 🎯 Ур. ${p.level} | ⚡ ${p.energy}/${p.maxEnergy}`;
    },

    // Переключение вкладок
    switchTab(tab) {
        State.currentTab = tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        const btn = document.querySelector(`.tab-btn[onclick="App.switchTab('${tab}')"]`);
        if (btn) btn.classList.add('active');
        
        const el = $('tabContent');
        if (!el) return;
        el.innerHTML = '';
        
        switch(tab) {
            case 'games': this.renderGames(el); break;
            case 'actions': this.renderActions(el); break;
            case 'shop': this.renderShop(el); break;
            case 'business': this.renderBusiness(el); break;
            case 'profile': this.renderProfile(el); break;
        }
    },

    // Отрисовка раздела игр
    renderGames(el) {
        el.innerHTML = `
            <div class="card-grid">
                <div class="card" onclick="App.openGame('minesweeper')">
                    <div class="emoji">💣</div>
                    <div class="title">Сапёр</div>
                    <div class="sub">Ставка ×2</div>
                </div>
                <div class="card" onclick="App.openGame('slots')">
                    <div class="emoji">🎰</div>
                    <div class="title">Слоты</div>
                    <div class="sub">До ×10</div>
                </div>
                <div class="card" onclick="App.openGame('dice')">
                    <div class="emoji">🎲</div>
                    <div class="title">Кубик</div>
                    <div class="sub">Угадай 1-6</div>
                </div>
                <div class="card" onclick="App.openGame('coin')">
                    <div class="emoji">🪙</div>
                    <div class="title">Монетка</div>
                    <div class="sub">Орёл/Решка</div>
                </div>
                <div class="card" onclick="App.openGame('roulette')">
                    <div class="emoji">🎡</div>
                    <div class="title">Рулетка</div>
                    <div class="sub">×1.5 – ×10</div>
                </div>
                <div class="card" onclick="App.openGame('va_bank')">
                    <div class="emoji">💎</div>
                    <div class="title">Ва-Банк</div>
                    <div class="sub">Всё или ×2</div>
                </div>
            </div>
            <div id="gameArea"></div>`;
    },

    // Отрисовка раздела действий
    renderActions(el) {
        Actions.render(el);
    },

    // Отрисовка магазина
    renderShop(el) {
        Shop.render(el);
    },

    // Отрисовка бизнеса
    renderBusiness(el) {
        Business.render(el);
    },

    // Отрисовка профиля
    renderProfile(el) {
        Profile.render(el);
    },

    // Отрисовка результата
    renderResult(el, type, message) {
        if (!el) return;
        el.className = 'result ' + type;
        el.innerHTML = message;
    }
};

window.UI = UI;