// ============ УТИЛИТЫ И ФОРМАТИРОВАНИЕ ============

// Форматирование чисел
function fmt(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'М';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'К';
    return String(Math.floor(n));
}

// Форматирование с разделителями тысяч (как в боте)
function formatNumber(n) {
    if (typeof n !== 'number') n = parseInt(n) || 0;
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'М';
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'К';
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Случайное число в диапазоне
function rnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Текущее время в миллисекундах
function now() {
    return Date.now();
}

// Форматирование времени кулдауна
function formatCooldown(seconds) {
    if (seconds <= 0) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}м ${secs}с` : `${secs}с`;
}

// Показать уведомление
function showAlert(msg) {
    Telegram.WebApp.showAlert(msg);
}

// Показать подтверждение
function showConfirm(msg, callback) {
    Telegram.WebApp.showConfirm(msg, callback);
}

// Безопасное получение элемента
function $(id) {
    return document.getElementById(id);
}

// Создание HTML из шаблона
function html(strings, ...values) {
    return strings.reduce((result, str, i) => result + str + (values[i] || ''), '');
}

// Дебаунс
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Генерация уникального ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Проверка, является ли строка JSON
function isJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch(e) {
        return false;
    }
}

// Безопасный парсинг JSON
function safeJSONParse(str, fallback = {}) {
    try {
        return JSON.parse(str);
    } catch(e) {
        return fallback;
    }
}