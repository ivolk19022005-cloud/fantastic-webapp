// ============ БОСС ============
const Boss = {
    render(el) {
        if (!State.boss.name) this.spawn();

        const boss = State.boss;
        const hpPercent = boss.maxHP > 0 ? (boss.hp / boss.maxHP * 100) : 0;

        let html = '<div class="section-title">👹 Босс</div>';
        html += `
            <div class="boss-card">
                <div class="boss-name">${boss.name}</div>
                <div class="boss-type">${boss.type}</div>
                <div class="hp-bar-container">
                    <div class="hp-bar" style="width:${hpPercent}%"></div>
                </div>
                <div style="margin:5px 0">❤️ ${formatNumber(boss.hp)}/${formatNumber(boss.maxHP)}</div>
                <div class="boss-actions">
                    <button class="attack-btn" onclick="Boss.attack()">⚔️ Атаковать (${State.profile.attack} урона)</button>
                </div>
                <div id="bossResult"></div>
            </div>`;
        el.innerHTML = html;
    },

    spawn() {
        // 5% шанс на легендарного босса
        const isLegendary = Math.random() <= 0.05;
        const bossList = isLegendary ? GAME_CONFIG.bosses.legendary : GAME_CONFIG.bosses.normal;
        const tpl = bossList[Math.floor(Math.random() * bossList.length)];
        
        State.boss.name = tpl.name;
        State.boss.type = tpl.type;
        State.boss.hp = rnd(tpl.hp[0], tpl.hp[1]);
        State.boss.maxHP = State.boss.hp;
    },

    attack() {
        if (State.boss.hp <= 0) {
            this.spawn();
            UI.switchTab('actions');
            return;
        }

        // Проверка кулдауна (10 минут)
        const cdKey = 'boss_hit';
        const cdLeft = State.getCooldown(cdKey);
        if (cdLeft > 0) {
            const resEl = $('bossResult');
            if (resEl) {
                resEl.innerHTML = `<div class="result info">⏳ КД: ${formatCooldown(cdLeft)}</div>`;
            }
            return;
        }

        State.setCooldown(cdKey, 600000); // 10 минут

        // Расчет урона (-20% отклонение)
        const minDmg = Math.floor(State.profile.attack * 0.8);
        const maxDmg = State.profile.attack;
        const dmg = rnd(minDmg, maxDmg);
        
        State.boss.hp -= dmg;
        if (State.boss.hp < 0) State.boss.hp = 0;

        // Награда за удар
        const baseReward = rnd(10, 100);
        const attackBonus = State.profile.attack;
        const earned = baseReward + attackBonus;
        
        State.addCoins(earned);

        const killed = State.boss.hp <= 0;
        const resEl = $('bossResult');

        if (killed) {
            const bonusCoins = rnd(3000, 8000);
            const bonusCrystals = rnd(5, 15);
            State.addCoins(bonusCoins);
            State.addCrystals(bonusCrystals);
            
            if (resEl) {
                resEl.className = 'result win';
                resEl.innerHTML = `🎉 <b>БОСС УБИТ!</b><br>⚔️ ${dmg} урона<br>💰 +${formatNumber(earned + bonusCoins)} 🪙<br>💎 +${bonusCrystals} кристаллов`;
            }
            API.bossAttack(dmg, earned + bonusCoins, true);
            
            // Спавним нового босса через 2 секунды
            setTimeout(() => {
                this.spawn();
                UI.switchTab('actions');
            }, 2000);
        } else {
            if (resEl) {
                resEl.className = 'result info';
                resEl.innerHTML = `⚔️ <b>-${formatNumber(dmg)}</b> HP! +${formatNumber(earned)} 🪙`;
            }
            API.bossAttack(dmg, earned, false);
        }

        State.save();
        this.render($('tabContent'));
    }
};

window.Boss = Boss;