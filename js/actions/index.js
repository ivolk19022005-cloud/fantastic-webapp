// ============ ДЕЙСТВИЯ (ОБЩИЙ МОДУЛЬ) ============
const Actions = {
    render(el) {
        // Очищаем контейнер
        el.innerHTML = '';
        
        // Создаем контейнер для приключений
        const advContainer = document.createElement('div');
        Adventures.render(advContainer);
        el.appendChild(advContainer);
        
        // Создаем контейнер для босса
        const bossContainer = document.createElement('div');
        Boss.render(bossContainer);
        el.appendChild(bossContainer);
    }
};

window.Actions = Actions;