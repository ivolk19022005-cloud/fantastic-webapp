// ============ ИНВЕНТАРЬ (ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ) ============
const Inventory = {
    // Показать инвентарь как отдельную вкладку
    renderFull(el) {
        let html = '<div class="section-title">🎒 Инвентарь</div>';
        
        const items = Object.entries(State.inventory).filter(([_, c]) => c > 0);
        
        if (!items.length) {
            html += '<div class="empty">📭 Инвентарь пуст</div>';
            el.innerHTML = html;
            return;
        }

        html += '<div class="adventure-list">';
        items.forEach(([name, count]) => {
            html += `
                <div class="adv-card">
                    <div class="adv-info">
                        <div class="adv-name">${name}</div>
                        <div class="adv-desc">Количество: ${count} шт.</div>
                    </div>
                    <button class="use-btn" onclick="Inventory.useItem('${name}')">Использовать</button>
                </div>`;
        });
        html += '</div>';
        
        el.innerHTML = html;
    },

    useItem(name) {
        // Проверяем, что предмет есть
        if (!State.inventory[name] || State.inventory[name] <= 0) {
            showAlert('❌ Предмет не найден!');
            return;
        }

        // Уменьшаем количество
        State.inventory[name]--;
        if (State.inventory[name] <= 0) {
            delete State.inventory[name];
        }

        // Применяем эффект
        let effectApplied = false;
        if (name.includes('здоровья') || name.includes('health')) {
            State.addHealth(30);
            effectApplied = true;
        } else if (name.includes('маны') || name.includes('mana')) {
            State.profile.mana = Math.min(State.profile.maxMana, State.profile.mana + 25);
            effectApplied = true;
        } else if (name.includes('энергии') || name.includes('energy')) {
            State.profile.energy = Math.min(State.profile.maxEnergy, State.profile.energy + 20);
            effectApplied = true;
        }

        if (effectApplied) {
            API.usePotion(name);
            State.save();
            showAlert(`✅ Использовано: ${name}!`);
            UI.updateCoinsDisplay();
        }
    }
};

window.Inventory = Inventory;