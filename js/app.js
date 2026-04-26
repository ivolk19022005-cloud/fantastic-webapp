// ============ ГЛАВНЫЙ ФАЙЛ ПРИЛОЖЕНИЯ ============
const App = {
    // Инициализация приложения
    async init() {
        console.log('🚀 Фэнтези Арена запускается...');
        
        // Настройка Telegram WebApp
        const tg = Telegram.WebApp;
        tg.expand();
        tg.ready();
        
        // Установка имени пользователя
        State.profile.username = API.getUserName();
        
        // Загружаем данные из CloudStorage
        const loaded = await State.load();
        if (loaded) {
            console.log('✅ Данные загружены из кэша');
        }
        
        // Запрашиваем актуальные данные из бота
        this.syncData();
        
        // Настройка главной кнопки
        tg.MainButton.setText('🔄 Синхронизировать');
        tg.MainButton.onClick(() => this.syncData());
        tg.MainButton.show();
        
        // Подписываемся на получение данных от бота
        tg.onEvent('viewData', (data) => {
            console.log('📥 Получены данные от бота:', data);
            try {
                const parsed = JSON.parse(data);
                if (parsed.action === 'user_data') {
                    State.applyBotData(parsed);
                }
            } catch(e) {
                console.error('Ошибка парсинга данных:', e);
            }
        });
        
        // Начальная отрисовка
        UI.updateCoinsDisplay();
        UI.switchTab('games');
        
        console.log('✅ Приложение готово!');
    },

    // Синхронизация данных с ботом
    async syncData() {
        console.log('🔄 Синхронизация данных...');
        
        tg.MainButton.setText('⏳ Синхронизация...');
        tg.MainButton.showProgress();
        
        // Отправляем запрос боту
        API.requestUserData();
        
        // Ждем ответ через CloudStorage (бот сохранит туда данные)
        setTimeout(async () => {
            try {
                const loaded = await State.load();
                if (loaded) {
                    console.log('✅ Данные синхронизированы');
                }
            } catch(e) {
                console.error('❌ Ошибка синхронизации:', e);
            }
            
            tg.MainButton.setText('🔄 Синхронизировать');
            tg.MainButton.hideProgress();
            UI.updateCoinsDisplay();
            
            // Обновляем текущую вкладку
            if (State.dataLoaded) {
                UI.switchTab(State.currentTab);
            }
        }, 3000);
    },

    // Переключение вкладок
    switchTab(tab) {
        UI.switchTab(tab);
    },

    // Открытие игры
    openGame(game) {
        const area = $('gameArea');
        if (!area) return;
        
        area.innerHTML = '<button class="back-btn" onclick="App.closeGame()">← Назад к играм</button>';
        
        const content = document.createElement('div');
        
        switch(game) {
            case 'minesweeper':
                Minesweeper.render(content);
                break;
            case 'slots':
                Slots.render(content);
                break;
            case 'dice':
                Dice.render(content);
                break;
            case 'coin':
                Coin.render(content);
                break;
            case 'roulette':
                Roulette.render(content);
                break;
            case 'va_bank':
                VaBank.render(content);
                break;
        }
        
        area.appendChild(content);
    },

    // Закрытие игры
    closeGame() {
        const area = $('gameArea');
        if (area) area.innerHTML = '';
    },

    // Обновление отображения
    updateDisplay() {
        UI.updateCoinsDisplay();
    }
};

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Глобальные ссылки для onclick из HTML
window.App = App;
window.State = State;
window.API = API;
window.fmt = fmt;
window.formatNumber = formatNumber;
window.rnd = rnd;
window.showAlert = showAlert;