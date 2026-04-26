// ============ БИЗНЕС, ФЕРМА, ШАХТА, БИРЖА ============
const Business = {
    render(el) {
        let html = '';
        
        // СЕКЦИЯ БИЗНЕСА
        html += this.renderBusinessSection();
        
        // СЕКЦИЯ ФЕРМЫ
        html += this.renderFarmSection();
        
        // СЕКЦИЯ ШАХТЫ
        html += this.renderMineSection();
        
        // СЕКЦИЯ БАНКА
        html += this.renderBankSection();
        
        // СЕКЦИЯ БИРЖИ
        html += this.renderExchangeSection();
        
        el.innerHTML = html;
    },

    // ============ БИЗНЕС ============
    renderBusinessSection() {
        let html = '<div class="section-title">💼 Бизнес</div>';
        
        if (State.business) {
            html += `
                <div class="entity-card">
                    <div class="entity-name">${State.business.name}</div>
                    <div class="entity-stats">⭐ Ур. ${State.business.level || 1} | 📈 Доход: ${formatNumber(State.business.income || 0)}/ч</div>
                    <div class="entity-income">📦 Накоплено: ${State.business.accumulated || 0} ${State.business.currency === 'crystals' ? '💎' : '🪙'}</div>
                    <div class="btn-row">
                        <button class="collect-btn" onclick="Business.collectBusiness()">💰 Собрать</button>
                        <button class="sell-btn" onclick="Business.sellBusiness()">💸 Продать</button>
                    </div>
                </div>`;
        } else {
            html += `
                <div class="shop-item">
                    <div class="shop-info">
                        <div class="shop-name">🏪 Магазин "Удача"</div>
                        <div class="shop-price">💰 ${formatNumber(5000)} 🪙 | 📈 100/ч</div>
                    </div>
                    <button class="buy-btn" onclick="Business.buyBusiness(1)">Купить</button>
                </div>`;
        }
        
        return html;
    },

    buyBusiness(bizId) {
        const config = GAME_CONFIG.businesses[bizId];
        if (!config) {
            showAlert('❌ Бизнес не найден!');
            return;
        }

        if (State.business) {
            showAlert('❌ У вас уже есть бизнес! Продайте текущий.');
            return;
        }

        if (config.currency === 'crystals') {
            if (State.profile.crystals < config.price) {
                showAlert(`❌ Недостаточно кристаллов! Нужно ${config.price} 💎`);
                return;
            }
            State.profile.crystals -= config.price;
        } else {
            if (State.profile.coins < config.price) {
                showAlert(`❌ Недостаточно монет! Нужно ${formatNumber(config.price)} 🪙`);
                return;
            }
            State.subtractCoins(config.price);
        }

        State.setBusiness({
            name: config.name,
            level: 1,
            income: config.income,
            accumulated: 0,
            currency: config.currency
        });

        API.buyBusiness(bizId);
        showAlert(`✅ Куплен бизнес: ${config.name}!`);
        UI.switchTab('business');
    },

    collectBusiness() {
        if (!State.business) return;

        const earned = rnd(80, 120);
        if (State.business.currency === 'crystals') {
            State.addCrystals(earned);
        } else {
            State.addCoins(earned);
        }

        API.collectBusiness(earned);
        showAlert(`✅ Собрано: ${formatNumber(earned)} ${State.business.currency === 'crystals' ? '💎' : '🪙'}!`);
        UI.switchTab('business');
    },

    sellBusiness() {
        if (!State.business) return;

        const config = Object.values(GAME_CONFIG.businesses).find(b => b.name === State.business.name);
        const refund = config ? Math.floor(config.price * 0.7) : 3500;

        if (State.business.currency === 'crystals') {
            State.addCrystals(refund);
        } else {
            State.addCoins(refund);
        }

        API.sellBusiness(refund);
        State.clearBusiness();
        showAlert(`💸 Бизнес продан за ${formatNumber(refund)} ${State.business.currency === 'crystals' ? '💎' : '🪙'}!`);
        UI.switchTab('business');
    },

    // ============ ФЕРМА ============
    renderFarmSection() {
        let html = '<div class="section-title">🚜 Ферма</div>';
        
        if (State.farm) {
            html += `
                <div class="entity-card">
                    <div class="entity-name">${State.farm.name}</div>
                    <div class="entity-stats">⭐ Ур. ${State.farm.level || 1} | 📈 Доход: ${State.farm.income || 0} /ч</div>
                    <div class="entity-income">📦 Накоплено: ${State.farm.accumulated || 0} ${State.farm.resource || ''}</div>
                    <div class="btn-row">
                        <button class="collect-btn" onclick="Business.collectFarm()">📦 Собрать</button>
                        <button class="sell-btn" onclick="Business.sellFarm()">💸 Продать</button>
                    </div>
                </div>`;
        } else {
            html += `
                <div class="shop-item">
                    <div class="shop-info">
                        <div class="shop-name">🌾 Пшеничное поле</div>
                        <div class="shop-price">💰 ${formatNumber(2000)} 🪙 | 📈 10 пшеницы/ч</div>
                    </div>
                    <button class="buy-btn" onclick="Business.buyFarm(1)">Купить</button>
                </div>`;
        }
        
        return html;
    },

    buyFarm(farmId) {
        const config = GAME_CONFIG.farms[farmId];
        if (!config) {
            showAlert('❌ Ферма не найдена!');
            return;
        }

        if (State.farm) {
            showAlert('❌ У вас уже есть ферма! Продайте текущую.');
            return;
        }

        if (State.profile.coins < config.price) {
            showAlert(`❌ Недостаточно монет! Нужно ${formatNumber(config.price)} 🪙`);
            return;
        }

        State.subtractCoins(config.price);
        State.setFarm({
            name: config.name,
            level: 1,
            resource: config.resource,
            income: config.income,
            accumulated: 0
        });

        showAlert(`✅ Куплена ферма: ${config.name}!`);
        UI.switchTab('business');
    },

    collectFarm() {
        if (!State.farm) return;

        const earned = rnd(8, 12);
        State.addResource(State.farm.resource, earned);
        State.addCoins(earned * 15);

        showAlert(`✅ Собрано: +${earned} ${State.farm.resource}`);
        UI.switchTab('business');
    },

    sellFarm() {
        if (!State.farm) return;

        const config = Object.values(GAME_CONFIG.farms).find(f => f.name === State.farm.name);
        const refund = config ? Math.floor(config.price * 0.7) : 1400;

        State.addCoins(refund);
        State.clearFarm();
        showAlert(`💸 Ферма продана за ${formatNumber(refund)} 🪙!`);
        UI.switchTab('business');
    },

    // ============ ШАХТА ============
    renderMineSection() {
        let html = '<div class="section-title">⛏️ Шахта</div>';
        
        if (State.mine) {
            html += `
                <div class="entity-card">
                    <div class="entity-name">${State.mine.name}</div>
                    <div class="entity-stats">⭐ Ур. ${State.mine.level || 1} | 📈 Добыча: ${State.mine.income || 0} /ч</div>
                    <div class="entity-income">📦 Накоплено: ${State.mine.accumulated || 0} ${State.mine.resource || ''}</div>
                    <div class="btn-row">
                        <button class="collect-btn" onclick="Business.collectMine()">📦 Собрать</button>
                        <button class="sell-btn" onclick="Business.sellMine()">💸 Продать</button>
                    </div>
                </div>`;
        } else {
            html += `
                <div class="shop-item">
                    <div class="shop-info">
                        <div class="shop-name">⛏️ Угольная шахта</div>
                        <div class="shop-price">💰 ${formatNumber(3000)} 🪙 | 📈 5 угля/ч</div>
                    </div>
                    <button class="buy-btn" onclick="Business.buyMine(1)">Купить</button>
                </div>`;
        }
        
        return html;
    },

    buyMine(mineId) {
        const config = GAME_CONFIG.mines[mineId];
        if (!config) {
            showAlert('❌ Шахта не найдена!');
            return;
        }

        if (State.mine) {
            showAlert('❌ У вас уже есть шахта! Продайте текущую.');
            return;
        }

        if (State.profile.coins < config.price) {
            showAlert(`❌ Недостаточно монет! Нужно ${formatNumber(config.price)} 🪙`);
            return;
        }

        State.subtractCoins(config.price);
        State.setMine({
            name: config.name,
            level: 1,
            resource: config.resource,
            income: config.income,
            accumulated: 0
        });

        showAlert(`✅ Куплена шахта: ${config.name}!`);
        UI.switchTab('business');
    },

    collectMine() {
        if (!State.mine) return;

        const earned = rnd(4, 6);
        State.addResource(State.mine.resource, earned);
        State.addCoins(earned * 60);

        showAlert(`✅ Собрано: +${earned} ${State.mine.resource}`);
        UI.switchTab('business');
    },

    sellMine() {
        if (!State.mine) return;

        const config = Object.values(GAME_CONFIG.mines).find(m => m.name === State.mine.name);
        const refund = config ? Math.floor(config.price * 0.7) : 2100;

        State.addCoins(refund);
        State.clearMine();
        showAlert(`💸 Шахта продана за ${formatNumber(refund)} 🪙!`);
        UI.switchTab('business');
    },

    // ============ БАНК ============
    renderBankSection() {
        let html = '<div class="section-title">🏦 Банк (депозит: ' + formatNumber(State.profile.bankDeposit) + ' 🪙)</div>';
        html += `
            <div class="btn-row" style="margin-bottom:10px">
                <button class="collect-btn" onclick="Business.bankDeposit()">💰 Пополнить</button>
                <button class="upgrade-btn" onclick="Business.bankWithdraw()">💸 Снять</button>
            </div>`;
        return html;
    },

    bankDeposit() {
        const amt = parseInt(prompt('Сумма пополнения:', '100'));
        if (!amt || amt <= 0 || amt > State.profile.coins) {
            showAlert('❌ Неверная сумма!');
            return;
        }

        State.subtractCoins(amt);
        State.profile.bankDeposit += amt;
        API.bankDeposit(amt);
        State.save();
        showAlert(`✅ Пополнено: +${formatNumber(amt)} 🪙`);
        UI.switchTab('business');
    },

    bankWithdraw() {
        const amt = parseInt(prompt('Сумма снятия:', '100'));
        if (!amt || amt <= 0 || amt > State.profile.bankDeposit) {
            showAlert('❌ Неверная сумма!');
            return;
        }

        State.addCoins(amt);
        State.profile.bankDeposit -= amt;
        API.bankWithdraw(amt);
        State.save();
        showAlert(`✅ Снято: ${formatNumber(amt)} 🪙`);
        UI.switchTab('business');
    },

    // ============ БИРЖА ============
    renderExchangeSection() {
        let html = '<div class="section-title">📈 Биржа</div>';
        
        const exchange = GAME_CONFIG.exchange;
        html += '<div class="exchange-header"><p>Цены обновляются каждые 30 мин | Комиссия 5%</p></div>';
        html += '<div class="adventure-list">';
        
        // Фермерские ресурсы
        const farmResources = ['wheat', 'corn', 'apple'];
        for (const resId of farmResources) {
            const res = exchange[resId];
            if (res) {
                const userAmount = State.resources[resId] || 0;
                html += `
                    <div class="adv-card">
                        <div class="adv-info">
                            <div class="adv-name">${res.name}</div>
                            <div class="adv-desc">Цена: ${res.current_price} 🪙/шт | У вас: ${userAmount}</div>
                        </div>
                        <button class="go-btn" onclick="Business.sellResource('${resId}')" ${userAmount > 0 ? '' : 'disabled'}>
                            Продать
                        </button>
                    </div>`;
            }
        }

        // Шахтные ресурсы
        const mineResources = ['coal', 'iron', 'gold', 'diamond', 'marble'];
        for (const resId of mineResources) {
            const res = exchange[resId];
            if (res) {
                const userAmount = State.resources[resId] || 0;
                html += `
                    <div class="adv-card">
                        <div class="adv-info">
                            <div class="adv-name">${res.name}</div>
                            <div class="adv-desc">Цена: ${res.current_price} 🪙/шт | У вас: ${userAmount}</div>
                        </div>
                        <button class="go-btn" onclick="Business.sellResource('${resId}')" ${userAmount > 0 ? '' : 'disabled'}>
                            Продать
                        </button>
                    </div>`;
            }
        }
        
        html += '</div>';
        return html;
    },

    sellResource(resId) {
        const exchange = GAME_CONFIG.exchange[resId];
        if (!exchange) {
            showAlert('❌ Ресурс не найден!');
            return;
        }

        const userAmount = State.resources[resId] || 0;
        if (userAmount <= 0) {
            showAlert('❌ У вас нет этого ресурса!');
            return;
        }

        const amt = parseInt(prompt(`Сколько продать? (цена: ${exchange.current_price} 🪙/шт, у вас: ${userAmount})`, '1'));
        if (!amt || amt <= 0 || amt > userAmount) {
            showAlert('❌ Неверное количество!');
            return;
        }

        const total = exchange.current_price * amt;
        const tax = Math.floor(total * 0.05);
        const finalAmount = total - tax;

        State.resources[resId] -= amt;
        State.addCoins(finalAmount);
        API.sellResource(resId, amt, finalAmount);
        State.save();
        
        showAlert(`✅ Продано ${amt} шт. за ${formatNumber(finalAmount)} 🪙 (комиссия: ${formatNumber(tax)} 🪙)`);
        UI.switchTab('business');
    }
};

window.Business = Business;