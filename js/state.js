// ============ ГЛОБАЛЬНОЕ СОСТОЯНИЕ ПРИЛОЖЕНИЯ ============
const State = {
    // Профиль
    profile: {
        coins: 0,
        crystals: 0,
        level: 1,
        xp: 0,
        energy: 100,
        maxEnergy: 100,
        health: 100,
        maxHealth: 100,
        mana: 50,
        maxMana: 50,
        attack: 10,
        defense: 5,
        bankDeposit: 0,
        username: 'Игрок',
        element: null,
        magic_school: null
    },

    // Инвентарь и экипировка
    inventory: {},
    equipment: {},

    // Бизнес
    business: null,

    // Ферма
    farm: null,

    // Шахта
    mine: null,

    // Ресурсы
    resources: {
        wheat: 0, corn: 0, apple: 0, grape: 0, carrot: 0,
        coal: 0, iron: 0, gold: 0, diamond: 0, marble: 0
    },

    // Босс
    boss: {
        name: '',
        type: '',
        hp: 0,
        maxHP: 0
    },

    // Кулдауны
    cooldowns: {},

    // Текущая вкладка
    currentTab: 'games',

    // Сапёр
    minesweeper: {
        board: [],
        size: 8,
        mines: 10,
        bet: 100,
        flags: 0,
        revealed: 0,
        gameOver: false
    },

    // Слоты
    slots: {
        spinning: false
    },

    // Загружены ли данные
    dataLoaded: false,

    // ============ МЕТОДЫ ============

    // Добавление монет
    addCoins(amount) {
        this.profile.coins += amount;
        this.save();
        App.updateDisplay();
    },

    // Вычитание монет
    subtractCoins(amount) {
        this.profile.coins = Math.max(0, this.profile.coins - amount);
        this.save();
        App.updateDisplay();
    },

    // Добавление кристаллов
    addCrystals(amount) {
        this.profile.crystals += amount;
        this.save();
        App.updateDisplay();
    },

    // Вычитание энергии
    subtractEnergy(amount) {
        this.profile.energy = Math.max(0, this.profile.energy - amount);
        this.save();
        App.updateDisplay();
    },

    // Добавление здоровья
    addHealth(amount) {
        this.profile.health = Math.min(this.profile.maxHealth, this.profile.health + amount);
        this.save();
    },

    // Установка кулдауна
    setCooldown(key, durationMs) {
        this.cooldowns[key] = Date.now() + durationMs;
    },

    // Получение оставшегося времени кулдауна
    getCooldown(key) {
        if (!this.cooldowns[key]) return 0;
        const remaining = this.cooldowns[key] - Date.now();
        return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
    },

    // Добавление предмета в инвентарь
    addItem(name) {
        this.inventory[name] = (this.inventory[name] || 0) + 1;
        this.save();
    },

    // Удаление предмета из инвентаря
    removeItem(name) {
        if (!this.inventory[name] || this.inventory[name] <= 0) return false;
        this.inventory[name]--;
        if (this.inventory[name] <= 0) delete this.inventory[name];
        this.save();
        return true;
    },

    // Получение общего количества предметов
    getTotalItems() {
        return Object.values(this.inventory).reduce((a, b) => a + b, 0);
    },

    // Получение ресурса
    getResource(id) {
        return this.resources[id] || 0;
    },

    // Добавление ресурса
    addResource(id, amount) {
        this.resources[id] = (this.resources[id] || 0) + amount;
        this.save();
    },

    // Установка бизнеса
    setBusiness(data) {
        this.business = data;
        this.save();
    },

    // Очистка бизнеса
    clearBusiness() {
        this.business = null;
        this.save();
    },

    // Установка фермы
    setFarm(data) {
        this.farm = data;
        this.save();
    },

    // Очистка фермы
    clearFarm() {
        this.farm = null;
        this.save();
    },

    // Установка шахты
    setMine(data) {
        this.mine = data;
        this.save();
    },

    // Очистка шахты
    clearMine() {
        this.mine = null;
        this.save();
    },

    // Применение данных из бота
    applyBotData(data) {
        if (data.coins !== undefined) this.profile.coins = data.coins;
        if (data.crystals !== undefined) this.profile.crystals = data.crystals;
        if (data.level !== undefined) this.profile.level = data.level;
        if (data.xp !== undefined) this.profile.xp = data.xp;
        if (data.energy !== undefined) this.profile.energy = data.energy;
        if (data.max_energy !== undefined) this.profile.maxEnergy = data.max_energy;
        if (data.health !== undefined) this.profile.health = data.health;
        if (data.max_health !== undefined) this.profile.maxHealth = data.max_health;
        if (data.mana !== undefined) this.profile.mana = data.mana;
        if (data.max_mana !== undefined) this.profile.maxMana = data.max_mana;
        if (data.attack !== undefined) this.profile.attack = data.attack;
        if (data.defense !== undefined) this.profile.defense = data.defense;
        if (data.bank_deposit !== undefined) this.profile.bankDeposit = data.bank_deposit;
        if (data.username !== undefined) this.profile.username = data.username;
        if (data.inventory) {
            if (typeof data.inventory === 'string') {
                try { this.inventory = JSON.parse(data.inventory); } catch(e) { this.inventory = {}; }
            } else {
                this.inventory = data.inventory;
            }
        }
        if (data.equipment) {
            if (typeof data.equipment === 'string') {
                try { this.equipment = JSON.parse(data.equipment); } catch(e) { this.equipment = {}; }
            } else {
                this.equipment = data.equipment;
            }
        }
        if (data.resources) this.resources = data.resources;
        if (data.business) this.business = data.business;
        if (data.farm) this.farm = data.farm;
        if (data.mine) this.mine = data.mine;

        this.dataLoaded = true;
        this.save();
        App.updateDisplay();
    },

    // Сохранение в CloudStorage
    async save() {
        try {
            const data = {
                coins: this.profile.coins,
                crystals: this.profile.crystals,
                level: this.profile.level,
                xp: this.profile.xp,
                energy: this.profile.energy,
                maxEnergy: this.profile.maxEnergy,
                health: this.profile.health,
                maxHealth: this.profile.maxHealth,
                mana: this.profile.mana,
                maxMana: this.profile.maxMana,
                attack: this.profile.attack,
                defense: this.profile.defense,
                bankDeposit: this.profile.bankDeposit,
                inventory: this.inventory,
                equipment: this.equipment,
                resources: this.resources,
                business: this.business,
                farm: this.farm,
                mine: this.mine,
                lastSaved: Date.now()
            };
            await Telegram.WebApp.CloudStorage.setItem('user_data', JSON.stringify(data));
            console.log('💾 Сохранено в CloudStorage');
        } catch(e) {
            console.error('❌ Ошибка сохранения:', e);
        }
    },

    // Загрузка из CloudStorage
    async load() {
        try {
            const data = await Telegram.WebApp.CloudStorage.getItem('user_data');
            if (data) {
                const parsed = JSON.parse(data);
                this.profile.coins = parsed.coins || 0;
                this.profile.crystals = parsed.crystals || 0;
                this.profile.level = parsed.level || 1;
                this.profile.xp = parsed.xp || 0;
                this.profile.energy = parsed.energy || 100;
                this.profile.maxEnergy = parsed.maxEnergy || 100;
                this.profile.health = parsed.health || 100;
                this.profile.maxHealth = parsed.maxHealth || 100;
                this.profile.mana = parsed.mana || 50;
                this.profile.maxMana = parsed.maxMana || 50;
                this.profile.attack = parsed.attack || 10;
                this.profile.defense = parsed.defense || 5;
                this.profile.bankDeposit = parsed.bankDeposit || 0;
                this.inventory = parsed.inventory || {};
                this.equipment = parsed.equipment || {};
                this.resources = parsed.resources || this.resources;
                this.business = parsed.business || null;
                this.farm = parsed.farm || null;
                this.mine = parsed.mine || null;
                console.log('📦 Загружено из CloudStorage');
                return true;
            }
        } catch(e) {
            console.log('ℹ️ CloudStorage пуст');
        }
        return false;
    }
};

// Глобальная ссылка для удобства
window.State = State;