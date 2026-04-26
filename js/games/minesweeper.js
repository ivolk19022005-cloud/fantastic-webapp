// ============ САПЁР ============
const Minesweeper = {
    SLOTS_SYMBOLS: ['🍒', '🍊', '🍋', '🍉', '⭐', '7️⃣', '🔔', '💎'],
    
    render(el) {
        const ms = State.minesweeper;
        ms.gameOver = false;
        ms.flags = 0;
        ms.revealed = 0;
        ms.board = [];
        
        el.innerHTML = `
            <div class="ms-controls">
                <div class="ms-info">🚩 <span id="msFlags">0</span> 💣 <span id="msMines">${ms.mines}</span></div>
                <div class="ms-bet-group">
                    <input type="number" id="msBet" value="${ms.bet}" min="10">
                    <button class="buy-btn" onclick="Minesweeper.setBet()">Ставка</button>
                </div>
                <div class="ms-difficulty">
                    <button class="${ms.size === 8 ? 'active' : ''}" data-s="8" data-m="10" onclick="Minesweeper.changeDifficulty(this)">8×8</button>
                    <button class="${ms.size === 10 ? 'active' : ''}" data-s="10" data-m="15" onclick="Minesweeper.changeDifficulty(this)">10×10</button>
                    <button class="${ms.size === 12 ? 'active' : ''}" data-s="12" data-m="20" onclick="Minesweeper.changeDifficulty(this)">12×12</button>
                </div>
            </div>
            <div class="ms-board" id="msBoard"></div>
            <div id="msResult"></div>
            <button class="big-btn" id="msNewGame" onclick="Minesweeper.start()" style="display:none;background:linear-gradient(135deg,#22c55e,#16a34a)">🔄 Новая игра</button>`;
        
        this.start();
    },

    changeDifficulty(btn) {
        document.querySelectorAll('.ms-difficulty button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        State.minesweeper.size = +btn.dataset.s;
        State.minesweeper.mines = +btn.dataset.m;
        const minesEl = $('msMines');
        if (minesEl) minesEl.textContent = State.minesweeper.mines;
        this.start();
    },

    start() {
        const ms = State.minesweeper;
        ms.gameOver = false;
        ms.flags = 0;
        ms.revealed = 0;
        ms.board = [];

        const resEl = $('msResult');
        const newBtn = $('msNewGame');
        if (resEl) resEl.innerHTML = '';
        if (newBtn) newBtn.style.display = 'none';
        
        const flagsEl = $('msFlags');
        const minesEl = $('msMines');
        if (flagsEl) flagsEl.textContent = '0';
        if (minesEl) minesEl.textContent = ms.mines;

        const betInput = $('msBet');
        ms.bet = betInput ? (parseInt(betInput.value) || 100) : 100;

        // Генерация доски
        const total = ms.size * ms.size;
        const mineSet = new Set();
        while (mineSet.size < ms.mines) {
            mineSet.add(Math.floor(Math.random() * total));
        }

        for (let i = 0; i < total; i++) {
            ms.board.push({
                mine: mineSet.has(i),
                revealed: false,
                flagged: false,
                adj: 0
            });
        }

        // Подсчет соседей
        for (let i = 0; i < total; i++) {
            if (!ms.board[i].mine) {
                ms.board[i].adj = this.getNeighbors(i).filter(n => ms.board[n].mine).length;
            }
        }

        this.renderBoard();
    },

    getNeighbors(i) {
        const ms = State.minesweeper;
        const r = Math.floor(i / ms.size);
        const c = i % ms.size;
        const res = [];
        
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (!dr && !dc) continue;
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < ms.size && nc >= 0 && nc < ms.size) {
                    res.push(nr * ms.size + nc);
                }
            }
        }
        return res;
    },

    renderBoard() {
        const ms = State.minesweeper;
        const el = $('msBoard');
        if (!el) return;

        el.style.gridTemplateColumns = `repeat(${ms.size}, 34px)`;
        el.innerHTML = '';

        ms.board.forEach((cell, i) => {
            const btn = document.createElement('button');
            btn.className = 'ms-cell';

            if (cell.revealed) {
                btn.classList.add('revealed');
                if (cell.mine) {
                    btn.classList.add('mine');
                    btn.textContent = '💣';
                } else if (cell.adj) {
                    btn.textContent = cell.adj;
                    const colors = ['', '#4ade80', '#facc15', '#f97316', '#ef4444', '#ec4899', '#a855f7', '#6366f1', '#14b8a6'];
                    btn.style.color = colors[cell.adj] || '#fff';
                }
            } else if (cell.flagged) {
                btn.classList.add('flag');
                btn.textContent = '🚩';
            }

            btn.addEventListener('click', () => this.click(i));
            btn.addEventListener('contextmenu', e => {
                e.preventDefault();
                this.flag(i);
            });

            el.appendChild(btn);
        });
    },

    click(i) {
        const ms = State.minesweeper;
        if (ms.gameOver || ms.board[i].flagged || ms.board[i].revealed) return;

        this.reveal(i);

        if (ms.board[i].mine) {
            this.end(false);
            return;
        }

        if (!ms.board[i].adj) {
            // Flood fill для пустых клеток
            const q = [i];
            const v = new Set([i]);
            while (q.length) {
                for (const n of this.getNeighbors(q.shift())) {
                    if (v.has(n)) continue;
                    v.add(n);
                    if (!ms.board[n].revealed && !ms.board[n].flagged && !ms.board[n].mine) {
                        this.reveal(n);
                        if (!ms.board[n].adj) q.push(n);
                    }
                }
            }
        }

        if (ms.revealed === ms.size * ms.size - ms.mines) {
            this.end(true);
        }
        this.renderBoard();
    },

    reveal(i) {
        const ms = State.minesweeper;
        if (!ms.board[i].revealed) {
            ms.board[i].revealed = true;
            ms.revealed++;
        }
    },

    flag(i) {
        const ms = State.minesweeper;
        if (ms.gameOver || ms.board[i].revealed) return;
        
        ms.board[i].flagged = !ms.board[i].flagged;
        ms.flags += ms.board[i].flagged ? 1 : -1;
        
        const el = $('msFlags');
        if (el) el.textContent = ms.flags;
        this.renderBoard();
    },

    end(won) {
        const ms = State.minesweeper;
        ms.gameOver = true;
        ms.board.forEach(cell => {
            if (cell.mine) cell.revealed = true;
        });
        this.renderBoard();

        const resEl = $('msResult');
        const newBtn = $('msNewGame');

        if (won) {
            const reward = ms.bet * 2;
            State.addCoins(reward);
            if (resEl) {
                resEl.className = 'result win';
                resEl.innerHTML = `🎉 <b>ПОБЕДА!</b> +${formatNumber(reward)} 🪙`;
            }
            API.gameResult('minesweeper', true, ms.bet, reward);
        } else {
            State.subtractCoins(ms.bet);
            if (resEl) {
                resEl.className = 'result lose';
                resEl.innerHTML = `💥 <b>МИНА!</b> -${formatNumber(ms.bet)} 🪙`;
            }
            API.gameResult('minesweeper', false, ms.bet);
        }

        if (newBtn) newBtn.style.display = 'block';
    },

    setBet() {
        const input = $('msBet');
        if (!input) return;
        let v = parseInt(input.value);
        if (isNaN(v) || v < 10) v = 10;
        State.minesweeper.bet = v;
        input.value = v;
        this.start();
    }
};

window.Minesweeper = Minesweeper;