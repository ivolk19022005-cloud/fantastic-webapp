// ============ ПРИКЛЮЧЕНИЯ ============
const Adventures = {
    render(el) {
        const adventures = GAME_CONFIG.adventures;
        
        let html = '<div class="section-title">⚔️ Приключения</div><div class="adventure-list">';
        
        Object.entries(adventures).forEach(([key, adv]) => {
            const cdLeft = State.getCooldown('adv_' + key);
            const onCD = cdLeft > 0;
            const canDo = State.profile.energy >= adv.energy && 
                         State.profile.level >= adv.min_level && 
                         !onCD;
            
            html += `
                <div class="adv-card">
                    <div class="adv-info">
                        <div class="adv-name">${adv.name}</div>
                        <div class="adv-desc">⚡${adv.energy} энергии | 🎯Ур.${adv.min_level}+ | ⏳КД ${adv.cd}с | ⭐${adv.xp} XP</div>
                        <div class="adv-reward">💰${adv.reward[0]}-${adv.reward[1]} 🪙</div>
                        ${onCD ? `<div style="color:#f87171;font-size:11px">⏳ КД: ${formatCooldown(cdLeft)}</div>` : ''}
                    </div>
                    <button class="go-btn" ${canDo ? '' : 'disabled'} 
                        onclick="Adventures.doAdventure('${key}', ${adv.energy}, ${adv.reward[0]}, ${adv.reward[1]}, ${adv.cd}, ${adv.xp})">
                        ▶ Идти
                    </button>
                </div>`;
        });
        
        html += '</div>';
        el.innerHTML = html;
    },

    doAdventure(key, cost, minRew, maxRew, cd, xp) {
        if (State.profile.energy < cost) { 
            showAlert('❌ Недостаточно энергии!'); 
            return; 
        }

        // Тратим энергию
        State.subtractEnergy(cost);
        State.profile.energy = Math.max(0, State.profile.energy - cost);

        // Случайная награда
        const earned = rnd(minRew, maxRew);
        const levelBonus = State.profile.level * 2;
        const totalEarned = earned + levelBonus;
        
        // Добавляем монеты и опыт
        State.addCoins(totalEarned);
        State.profile.xp = (State.profile.xp || 0) + xp;

        // Устанавливаем кулдаун
        State.setCooldown('adv_' + key, cd * 1000);

        // Отправляем данные боту
        API.adventureComplete(key, totalEarned, cost);

        // Шанс найти предмет (40%)
        let foundItem = null;
        if (Math.random() < 0.4) {
            const items = ['health_potion', 'mana_potion', 'energy_potion'];
            const itemId = items[Math.floor(Math.random() * items.length)];
            const itemName = GAME_CONFIG.shop.potions[itemId]?.name || 'Зелье';
            foundItem = itemName;
            State.addItem(itemName);
        }

        let message = `✅ Приключение завершено!\n💰 +${formatNumber(totalEarned)} 🪙\n⭐ +${xp} XP`;
        if (foundItem) message += `\n🎁 Найдено: ${foundItem}`;
        
        showAlert(message);
        State.save();

        // Перерисовываем вкладку
        UI.switchTab('actions');
    }
};

window.Adventures = Adventures;