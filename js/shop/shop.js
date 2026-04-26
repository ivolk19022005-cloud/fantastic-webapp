// ============ МАГАЗИН ============
const Shop = {
    currentCategory: 'weapons',

    render(el) {
        let html = '<div class="section-title">🛒 Категории</div>';
        html += '<div class="quick-actions">';
        html += '<button class="action-btn" onclick="Shop.showCategory(\'weapons\')"><span class="emoji">⚔️</span>Оружие</button>';
        html += '<button class="action-btn" onclick="Shop.showCategory(\'armor\')"><span class="emoji">🛡</span>Броня</button>';
        html += '<button class="action-btn" onclick="Shop.showCategory(\'potions\')"><span class="emoji">🧪</span>Зелья</button>';
        html += '<button class="action-btn" onclick="Shop.showCategory(\'amulets\')"><span class="emoji">✨</span>Амулеты</button>';
        html += '</div>';
        html += '<div id="shopItems"></div>';
        html += '<hr style="border-color:rgba(255,255,255,.1);margin:10px 0">';
        html += '<div class="section-title">🎒 Инвентарь</div>';
        html += '<div id="invItems"></div>';

        el.innerHTML = html;
        this.showCategory('weapons');
        this.renderInventory();
    },

    showCategory(cat) {
        this.currentCategory = cat;
        const items = GAME_CONFIG.shop[cat];
        if (!items) return;

        const el = $('shopItems');
        if (!el) return;

        el.innerHTML = Object.entries(items).map(([id, item]) => `
            <div class="shop-item">
                <div class="shop-info">
                    <div class="shop-name">${item.name}</div>
                    <div class="shop-stats">
                        ${item.attack ? '⚔️+' + item.attack + ' ' : ''}
                        ${item.defense ? '🛡+' + item.defense + ' ' : ''}
                        ${item.health ? '❤️+' + item.health + ' ' : ''}
                        ${item.mana ? '🔮+' + item.mana + ' ' : ''}
                        ${item.energy ? '⚡+' + item.energy + ' ' : ''}
                        ${item.max_health ? '❤️+' + item.max_health + ' ' : ''}
                        ${item.max_mana ? '🔮+' + item.max_mana + ' ' : ''}
                        ${item.max_energy ? '⚡+' + item.max_energy + ' ' : ''}
                        ${item.rarity ? '| ' + item.rarity : ''}
                    </div>
                    <div class="shop-price">${formatNumber(item.price)} ${item.currency === 'crystals' ? '💎' : '🪙'}</div>
                </div>
                <button class="buy-btn" onclick="Shop.buyItem('${cat}', '${id}', ${item.price}, '${item.currency}', '${item.name}')">Купить</button>
            </div>
        `).join('');
    },

    buyItem(cat, id, price, currency, name) {
        if (currency === 'crystals' && State.profile.crystals < price) {
            showAlert('❌ Недостаточно кристаллов!');
            return;
        }
        if (currency === 'coins' && State.profile.coins < price) {
            showAlert('❌ Недостаточно монет!');
            return;
        }

        if (currency === 'crystals') {
            State.profile.crystals -= price;
        } else {
            State.subtractCoins(price);
        }

        State.addItem(name);
        API.buyItem(cat, id, price, currency, name);
        showAlert(`✅ Куплено: ${name}!`);
        this.renderInventory();
    },

    renderInventory() {
        const el = $('invItems');
        if (!el) return;

        const items = Object.entries(State.inventory).filter(([_, c]) => c > 0);

        if (!items.length) {
            el.innerHTML = '<div class="empty">📭 Инвентарь пуст</div>';
            return;
        }

        el.innerHTML = items.map(([name, count]) => {
            let btn = '';
            if (name.includes('Зелье')) {
                btn = `<button class="use-btn" onclick="Shop.useItem('${name}')">🧪 Исп.</button>`;
            } else if (name.includes('меч') || name.includes('Меч') || name.includes('посох')) {
                btn = `<button class="equip-btn" onclick="Shop.equipItem('weapon', '${name}')">⚔️ Надеть</button>`;
            } else if (name.includes('доспех') || name.includes('Кольчуга') || name.includes('латы') || name.includes('мантия')) {
                btn = `<button class="equip-btn" onclick="Shop.equipItem('armor', '${name}')">🛡 Надеть</button>`;
            } else if (name.includes('Амулет')) {
                btn = `<button class="equip-btn" onclick="Shop.equipAmulet('${name}')">✨ Надеть</button>`;
            }

            return `
                <div class="inv-item">
                    <div>
                        <div class="inv-name">${name}</div>
                        <div class="inv-count">${count} шт.</div>
                    </div>
                    ${btn}
                </div>`;
        }).join('');
    },

    useItem(name) {
        if (!State.removeItem(name)) return;

        // Ищем предмет в конфиге для определения эффекта
        let found = false;
        for (const [id, item] of Object.entries(GAME_CONFIG.shop.potions)) {
            if (item.name === name) {
                found = true;
                if (item.health) State.addHealth(item.health);
                if (item.mana) State.profile.mana = Math.min(State.profile.maxMana, State.profile.mana + item.mana);
                if (item.energy) State.profile.energy = Math.min(State.profile.maxEnergy, State.profile.energy + item.energy);
                break;
            }
        }

        if (!found) {
            // Стандартные эффекты
            if (name.includes('здоровья')) State.addHealth(30);
            else if (name.includes('маны')) State.profile.mana = Math.min(State.profile.maxMana, State.profile.mana + 25);
            else if (name.includes('энергии')) State.profile.energy = Math.min(State.profile.maxEnergy, State.profile.energy + 20);
        }

        API.usePotion(name);
        State.save();
        showAlert(`✅ Использовано: ${name}!`);
        this.renderInventory();
    },

    equipItem(slot, name) {
        // Возвращаем старый предмет в инвентарь
        const oldItem = State.equipment[slot];
        if (oldItem) {
            State.addItem(oldItem);
        }

        // Надеваем новый
        State.equipment[slot] = name;
        State.removeItem(name);

        // Обновляем статы
        this.recalculateStats();

        API.equipItem(slot, name);
        State.save();
        showAlert(`✅ Надето: ${name}!`);
        this.renderInventory();
    },

    equipAmulet(name) {
        const equipped = State.equipment.amulets || [];
        if (equipped.length >= 3) {
            showAlert('❌ Максимум 3 амулета!');
            return;
        }

        equipped.push(name);
        State.equipment.amulets = equipped;
        State.removeItem(name);

        this.recalculateStats();
        API.equipItem('amulet', name);
        State.save();
        showAlert(`✅ Надет амулет: ${name}!`);
        this.renderInventory();
    },

    recalculateStats() {
        // Базовые статы
        let baseAttack = 10;
        let baseDefense = 5;
        let baseHealth = 100;
        let baseMana = 50;

        // Применяем экипировку
        for (const [slot, itemName] of Object.entries(State.equipment)) {
            if (slot === 'amulets') {
                // Амулеты обрабатываем отдельно
                if (Array.isArray(itemName)) {
                    for (const amuletName of itemName) {
                        const amuletData = this.findItemData('amulets', amuletName);
                        if (amuletData) {
                            baseAttack += amuletData.attack || 0;
                            baseDefense += amuletData.defense || 0;
                            baseHealth += amuletData.max_health || 0;
                            baseMana += amuletData.max_mana || 0;
                        }
                    }
                }
                continue;
            }

            const itemData = this.findItemData(slot === 'weapon' ? 'weapons' : 'armor', itemName);
            if (itemData) {
                baseAttack += itemData.attack || 0;
                baseDefense += itemData.defense || 0;
                baseHealth += itemData.max_health || itemData.health || 0;
                baseMana += itemData.max_mana || itemData.mana || 0;
            }
        }

        State.profile.attack = baseAttack;
        State.profile.defense = baseDefense;
        State.profile.maxHealth = baseHealth;
        State.profile.health = Math.min(State.profile.health, baseHealth);
        State.profile.maxMana = baseMana;
        State.profile.mana = Math.min(State.profile.mana, baseMana);
    },

    findItemData(category, itemName) {
        const items = GAME_CONFIG.shop[category];
        if (!items) return null;
        
        for (const [id, data] of Object.entries(items)) {
            if (data.name === itemName) return data;
        }
        return null;
    }
};

window.Shop = Shop;