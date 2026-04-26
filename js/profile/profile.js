// ============ ПРОФИЛЬ ============
const Profile = {
    render(el) {
        const p = State.profile;
        const totalItems = State.getTotalItems();
        
        let html = '<div class="profile-card">';
        
        // Заголовок
        html += `
            <div class="profile-header">
                <h2>👤 ${p.username}</h2>
                <div class="profile-badges">
                    <span class="badge">🎯 Уровень ${p.level}</span>
                    ${p.element ? `<span class="badge">${p.element}</span>` : ''}
                </div>
            </div>`;
        
        // Финансы
        html += `
            <div class="profile-section">
                <h3>💰 Финансы</h3>
                <div class="stat-row"><span>Монеты:</span><strong>${formatNumber(p.coins)} 🪙</strong></div>
                <div class="stat-row"><span>Кристаллы:</span><strong>${p.crystals} 💎</strong></div>
                <div class="stat-row"><span>Банк:</span><strong>${formatNumber(p.bankDeposit)} 🪙</strong></div>
            </div>`;
        
        // Характеристики
        html += `
            <div class="profile-section">
                <h3>⚔️ Характеристики</h3>
                <div class="stat-row"><span>Атака:</span><strong>${p.attack}</strong></div>
                <div class="stat-row"><span>Защита:</span><strong>${p.defense}</strong></div>
                
                <div class="stat-bar">
                    <span>❤️ HP:</span>
                    <div class="bar">
                        <div class="bar-fill" style="width:${(p.health / p.maxHealth * 100)}%; background:#ef4444"></div>
                    </div>
                    <span>${p.health}/${p.maxHealth}</span>
                </div>
                
                <div class="stat-bar">
                    <span>🔮 Мана:</span>
                    <div class="bar">
                        <div class="bar-fill" style="width:${(p.mana / p.maxMana * 100)}%; background:#8b5cf6"></div>
                    </div>
                    <span>${p.mana}/${p.maxMana}</span>
                </div>
                
                <div class="stat-bar">
                    <span>⚡ Энергия:</span>
                    <div class="bar">
                        <div class="bar-fill" style="width:${(p.energy / p.maxEnergy * 100)}%; background:#22c55e"></div>
                    </div>
                    <span>${p.energy}/${p.maxEnergy}</span>
                </div>
            </div>`;
        
        // Экипировка
        html += `
            <div class="profile-section">
                <h3>🛡 Экипировка</h3>
                <div class="equip-slot"><span>⚔️ Оружие:</span><strong>${State.equipment.weapon || '—'}</strong></div>
                <div class="equip-slot"><span>🛡 Броня:</span><strong>${State.equipment.armor || '—'}</strong></div>
                <div class="equip-slot"><span>✨ Амулеты:</span><strong>${(State.equipment.amulets || []).join(', ') || '—'}</strong></div>
            </div>`;
        
        // Инвентарь
        html += `
            <div class="profile-section">
                <h3>🎒 Инвентарь</h3>
                <div class="stat-row"><span>Предметов:</span><strong>${totalItems} шт.</strong></div>
            </div>`;
        
        // Статистика
        html += `
            <div class="profile-section">
                <h3>📊 Статистика</h3>
                <div class="stat-row"><span>Опыт:</span><strong>${formatNumber(p.xp || 0)} XP</strong></div>
            </div>`;
        
        // Кнопка синхронизации
        html += `
            <div style="text-align:center; margin-top:20px;">
                <button class="big-btn" onclick="App.syncData()" style="background:linear-gradient(135deg,#8b5cf6,#6366f1)">
                    🔄 Синхронизировать с ботом
                </button>
            </div>`;
        
        html += '</div>';
        el.innerHTML = html;
    }
};

window.Profile = Profile;