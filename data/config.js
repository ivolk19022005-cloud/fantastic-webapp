// ============ КОНФИГУРАЦИЯ ИГРЫ (ИЗ БОТА) ============
const GAME_CONFIG = {
    // Элементы (стихии)
    elements: {
        fire: { name: '🔥 Огонь', emoji: '🔥', bonus: 'атаке', stat_bonus: { attack: 15 } },
        water: { name: '💧 Вода', emoji: '💧', bonus: 'защите', stat_bonus: { defense: 10 } },
        earth: { name: '🌍 Земля', emoji: '🌍', bonus: 'здоровью', stat_bonus: { max_health: 20 } },
        air: { name: '💨 Воздух', emoji: '💨', bonus: 'мане', stat_bonus: { max_mana: 15 } },
        lightning: { name: '⚡ Молния', emoji: '⚡', bonus: 'скорости', stat_bonus: { attack: 10, max_energy: 10 } }
    },

    // Школы магии
    magic_schools: {
        evocation: { name: '🔥 Некромантия', bonus: '+5 к атаке', stat_bonus: { attack: 5 } },
        abjuration: { name: '🛡 Защита', bonus: '+5 к защите', stat_bonus: { defense: 5 } },
        transmutation: { name: '🔄 Трансмутация', bonus: '+10 к здоровью', stat_bonus: { max_health: 10 } },
        divination: { name: '🔮 Прорицание', bonus: '+10 к мане', stat_bonus: { max_mana: 10 } },
        enchantment: { name: '✨ Очарование', bonus: '+3 ко всем характеристикам', stat_bonus: { attack: 3, defense: 3, max_health: 3, max_mana: 3 } }
    },

    // Приключения
    adventures: {
        mountains: { name: '🏔️ Поход в горы', energy: 5, reward: [20, 50], min_level: 1, cd: 60, xp: 10 },
        forest: { name: '🌳 Исследование леса', energy: 3, reward: [15, 40], min_level: 1, cd: 120, xp: 8 },
        castle: { name: '🏰 Штурм замка', energy: 8, reward: [30, 70], min_level: 3, cd: 180, xp: 15 },
        dragon: { name: '🐉 Охота на дракона', energy: 15, reward: [50, 100], min_level: 5, cd: 240, xp: 25 },
        dungeon: { name: '🏴‍☠️ Подземелье', energy: 20, reward: [80, 150], min_level: 8, cd: 300, xp: 35 }
    },

    // Боссы
    bosses: {
        normal: [
            { name: 'Древний Дракон', hp: [800, 1500], type: '👹 Обычный', coins: [4000, 8000], crystals: [5, 15] },
            { name: 'Ледяной Гигант', hp: [700, 1300], type: '👹 Обычный', coins: [3500, 7000], crystals: [4, 12] },
            { name: 'Огненный Демон', hp: [900, 1600], type: '👹 Обычный', coins: [4500, 9000], crystals: [6, 18] },
            { name: 'Король Скелетов', hp: [600, 1200], type: '👹 Обычный', coins: [3000, 6000], crystals: [3, 10] },
            { name: 'Темный Маг', hp: [500, 1000], type: '👹 Обычный', coins: [2500, 5000], crystals: [2, 8] },
            { name: 'Громовой Зверь', hp: [750, 1400], type: '👹 Обычный', coins: [3800, 7500], crystals: [5, 14] }
        ],
        legendary: [
            { name: 'Пожиратель Богов', hp: [5000, 10000], type: '🌟 Легендарный', coins: [20000, 50000], crystals: [50, 150] },
            { name: 'Хранитель Бездны', hp: [4000, 8000], type: '🌟 Легендарный', coins: [15000, 40000], crystals: [40, 120] },
            { name: 'Первозданный Титан', hp: [6000, 12000], type: '🌟 Легендарный', coins: [25000, 60000], crystals: [60, 180] }
        ]
    },

    // Магазин
    shop: {
        weapons: {
            wooden_sword: { name: 'Деревянный меч', price: 15, attack: 5, currency: 'coins', rarity: 'common' },
            iron_sword: { name: 'Железный меч', price: 50, attack: 12, currency: 'coins', rarity: 'uncommon' },
            legendary_sword: { name: 'Легендарный меч', price: 150, attack: 25, currency: 'coins', rarity: 'legendary' },
            magic_staff: { name: 'Магический посох', price: 250, attack: 32, mana: 15, currency: 'coins', rarity: 'rare' }
        },
        armor: {
            leather_armor: { name: 'Кожаный доспех', price: 300, defense: 8, currency: 'coins', rarity: 'common' },
            chain_armor: { name: 'Кольчуга', price: 600, defense: 15, currency: 'coins', rarity: 'uncommon' },
            steel_armor: { name: 'Стальные латы', price: 1000, defense: 25, currency: 'coins', rarity: 'rare' },
            magic_robe: { name: 'Магическая мантия', price: 800, defense: 12, mana: 15, currency: 'coins', rarity: 'rare' }
        },
        potions: {
            health_potion: { name: 'Зелье здоровья', price: 50, health: 30, currency: 'coins' },
            mana_potion: { name: 'Зелье маны', price: 40, mana: 25, currency: 'coins' },
            energy_potion: { name: 'Зелье энергии', price: 80, energy: 20, currency: 'coins' }
        },
        amulets: {
            fire_amulet: { name: '🔥 Амулет огня', price: 100, attack: 10, currency: 'coins', type: 'amulet' },
            water_amulet: { name: '💧 Амулет воды', price: 100, defense: 10, currency: 'coins', type: 'amulet' },
            earth_amulet: { name: '🌍 Амулет земли', price: 100, max_health: 20, currency: 'coins', type: 'amulet' },
            air_amulet: { name: '💨 Амулет воздуха', price: 150, max_mana: 20, currency: 'coins', type: 'amulet' },
            lightning_amulet: { name: '⚡ Амулет молнии', price: 250, attack: 15, max_energy: 10, currency: 'coins', type: 'amulet' },
            dark_amulet: { name: '🌑 Амулет тьмы', price: 500, attack: 25, defense: -10, currency: 'coins', type: 'amulet' },
            holy_amulet: { name: '✨ Святой амулет', price: 500, max_health: 30, defense: 15, currency: 'coins', type: 'amulet' },
            dragon_amulet: { name: '🐲 Амулет дракона', price: 1000, attack: 20, defense: 20, max_health: 20, max_mana: 20, currency: 'coins', type: 'amulet' }
        },
        spells: {
            fireball: { name: '🔥 Огненный шар', price: 150, currency: 'coins' },
            heal: { name: '✨ Лечение', price: 200, currency: 'coins' },
            shield: { name: '🛡 Магический щит', price: 150, currency: 'coins' },
            lightning_bolt: { name: '⚡ Цепная молния', price: 350, currency: 'coins' },
            mana_drain: { name: '🔮 Поток маны', price: 250, currency: 'coins' }
        }
    },

    // Бизнесы
    businesses: {
        1: { name: '🏪 Магазин "Удача"', price: 5000, income: 100, currency: 'coins' },
        2: { name: '🏭 Фабрика "Прогресс"', price: 25000, income: 600, currency: 'coins' },
        3: { name: '🏢 Корпорация "Империя"', price: 100000, income: 3000, currency: 'coins' },
        4: { name: '💎 Ювелирная Лавка', price: 500000, income: 15000, currency: 'coins' },
        5: { name: '🚀 Техно-Холдинг', price: 2000000, income: 50000, currency: 'coins' },
        8: { name: '⚗️ Алхимическая Лаборатория', price: 5, income: 1, currency: 'crystals' },
        9: { name: '🔮 Магическая Академия', price: 10, income: 2, currency: 'crystals' },
        10: { name: '🐉 Драконий Питомник', price: 25, income: 5, currency: 'crystals' }
    },

    // Фермы
    farms: {
        1: { name: '🌾 Пшеничное поле', price: 2000, resource: 'wheat', res_name: 'Пшеница', income: 10 },
        2: { name: '🌽 Кукурузная плантация', price: 10000, resource: 'corn', res_name: 'Кукуруза', income: 5 },
        3: { name: '🍎 Яблоневый сад', price: 40000, resource: 'apple', res_name: 'Яблоко', income: 2 },
        4: { name: '💎 Кристальное поле', price: 10, resource: 'crystals', res_name: 'Кристаллы', income: 1, premium: true },
        5: { name: '🔮 Радужная ферма', price: 25, resource: 'crystals', res_name: 'Кристаллы', income: 2, premium: true }
    },

    // Шахты
    mines: {
        1: { name: '⛏️ Угольная шахта', price: 3000, resource: 'coal', res_name: 'Уголь', income: 5 },
        2: { name: '⚙️ Железный рудник', price: 15000, resource: 'iron', res_name: 'Железо', income: 2 },
        3: { name: '💰 Золотой прииск', price: 50000, resource: 'gold', res_name: 'Золото', income: 1 },
        4: { name: '💎 Алмазный карьер', price: 15, resource: 'crystals', res_name: 'Кристаллы', income: 1, premium: true },
        5: { name: '🔮 Мифриловый рудник', price: 30, resource: 'crystals', res_name: 'Кристаллы', income: 2, premium: true }
    },

    // Биржа
    exchange: {
        wheat: { name: '🌾 Пшеница', min_price: 5, max_price: 25, current_price: 15 },
        corn: { name: '🌽 Кукуруза', min_price: 8, max_price: 40, current_price: 24 },
        apple: { name: '🍎 Яблоко', min_price: 15, max_price: 75, current_price: 45 },
        coal: { name: '⛏️ Уголь', min_price: 20, max_price: 100, current_price: 60 },
        iron: { name: '⚙️ Железо', min_price: 50, max_price: 250, current_price: 150 },
        gold: { name: '💰 Золото', min_price: 200, max_price: 1000, current_price: 600 },
        diamond: { name: '💎 Алмаз', min_price: 500, max_price: 2500, current_price: 1500 },
        marble: { name: '🪨 Мрамор', min_price: 80, max_price: 400, current_price: 240 },
        update_interval: 1800,
        tax_rate: 0.05
    },

    // Улучшения
    upgrade: {
        business: { income_multiplier: 1.5, price_multiplier: 2.0, max_level: 10, sell_ratio: 0.7 },
        farm: { income_multiplier: 1.5, price_multiplier: 1.8, max_level: 10, sell_ratio: 0.7 },
        mine: { income_multiplier: 1.5, price_multiplier: 1.8, max_level: 10, sell_ratio: 0.7 }
    },

    // Игра
    game: {
        max_level: 100,
        energy_cap: 200,
        health_per_level: 10,
        mana_per_level: 5,
        energy_per_level: 3,
        base_xp_per_level: 100
    },

    // Банк
    bank: {
        interest_rate: 0.05,
        min_deposit: 10,
        max_deposit: 1000000000000
    },

    // Казино
    casino: {
        min_bet: 10,
        max_bet: 1000000000000000000000000000000000,
        slots: {
            lose_chance: 0.80,
            symbols: {
                '🍒': { name: 'вишня', multiplier: 1.3 },
                '🍊': { name: 'апельсин', multiplier: 1.4 },
                '🍋': { name: 'лимон', multiplier: 1.5 },
                '🍉': { name: 'арбуз', multiplier: 1.7 },
                '⭐': { name: 'звезда', multiplier: 3 },
                '7️⃣': { name: 'семерка', multiplier: 7 },
                '🔔': { name: 'колокол', multiplier: 5 },
                '💎': { name: 'бриллиант', multiplier: 10 }
            }
        },
        roulette: {
            total_win_chance: 0.30,
            win_multipliers: [1.5, 2.0, 3.0, 5.0, 10.0]
        },
        dice: {
            number_multiplier: 6.0,
            sum_multiplier: 12.0
        },
        coin: {
            multiplier: 2.0
        }
    }
};