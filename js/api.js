// ============ КОММУНИКАЦИЯ С БОТОМ ============
const API = {
    // Отправка данных боту через sendData
    sendToBot(action, data = {}) {
        try {
            const message = JSON.stringify({ 
                action, 
                timestamp: Date.now(), 
                ...data 
            });
            Telegram.WebApp.sendData(message);
            console.log('📤 Отправлено в бот:', action, data);
            return true;
        } catch(e) {
            console.error('❌ Ошибка отправки в бот:', e);
            return false;
        }
    },

    // Запрос данных пользователя из бота
    requestUserData() {
        return this.sendToBot('get_user_data', {});
    },

    // Игровой результат
    gameResult(game, win, bet, reward = 0) {
        return this.sendToBot('game_result', { game, win, bet, reward });
    },

    // Завершение приключения
    adventureComplete(advType, coins, energy) {
        return this.sendToBot('adventure_complete', { adv_type: advType, coins, energy });
    },

    // Атака босса
    bossAttack(damage, coins, killed) {
        return this.sendToBot('boss_attack', { damage, coins, killed });
    },

    // Покупка предмета
    buyItem(category, itemId, price, currency, itemName) {
        return this.sendToBot('buy_item', { category, item_id: itemId, price, currency, item_name: itemName });
    },

    // Использование зелья
    usePotion(itemName) {
        return this.sendToBot('use_potion', { item_name: itemName });
    },

    // Экипировка предмета
    equipItem(slot, itemName) {
        return this.sendToBot('equip_item', { slot, item_name: itemName });
    },

    // Банковские операции
    bankDeposit(amount) {
        return this.sendToBot('bank_deposit', { amount });
    },

    bankWithdraw(amount) {
        return this.sendToBot('bank_withdraw', { amount });
    },

    // Бизнес
    buyBusiness(bizId) {
        return this.sendToBot('buy_business', { biz_id: bizId });
    },

    collectBusiness(income) {
        return this.sendToBot('biz_collect', { income });
    },

    sellBusiness(refund) {
        return this.sendToBot('sell_business', { refund });
    },

    // Продажа ресурсов
    sellResource(resource, amount, earned) {
        return this.sendToBot('sell_resource', { resource, amount, earned });
    },

    // Получение имени пользователя
    getUserName() {
        return Telegram.WebApp.initDataUnsafe?.user?.first_name || 'Игрок';
    },

    // Получение ID пользователя
    getUserId() {
        return Telegram.WebApp.initDataUnsafe?.user?.id || 0;
    }
};

window.API = API;