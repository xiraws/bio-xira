document.addEventListener('DOMContentLoaded', () => {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    const copyUsernameBtn = document.getElementById('copy-username');
    const copyHandleHeader = document.getElementById('copy-handle-header');

    function showToast(message) {
        if (!toast || !toastText) return;
        toastText.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2200);
    }

    function copyToClipboard(text, successMsg) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(successMsg);
            }).catch(() => {
                fallbackCopy(text, successMsg);
            });
        } else {
            fallbackCopy(text, successMsg);
        }
    }

    function fallbackCopy(text, successMsg) {
        const input = document.createElement('input');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        try {
            document.execCommand('copy');
            showToast(successMsg);
        } catch (err) {
            showToast('Ошибка при копировании');
        }
        document.body.removeChild(input);
    }

    if (copyUsernameBtn) {
        copyUsernameBtn.addEventListener('click', () => {
            copyToClipboard('@xiraw', 'Имя пользователя скопировано!');
        });
    }

    if (copyHandleHeader) {
        copyHandleHeader.addEventListener('click', () => {
            copyToClipboard('@xiraw', 'Логин @xiraw скопирован!');
        });
    }

    initCanvas();
});

function initCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(35, Math.floor(window.innerWidth / 30));

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.6 + 0.6,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            alpha: Math.random() * 0.4 + 0.15
        });
    }

    const trail = [];
    const maxTrailPoints = 16;

    function addTrailPoint(x, y) {
        trail.push({
            x: x,
            y: y,
            size: 6,
            alpha: 0.7,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4
        });

        if (trail.length > maxTrailPoints) {
            trail.shift();
        }
    }

    window.addEventListener('mousemove', (e) => {
        addTrailPoint(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            for (let t = 0; t < e.touches.length; t++) {
                addTrailPoint(e.touches[t].clientX, e.touches[t].clientY);
            }
        }
    }, { passive: true });

    window.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            for (let t = 0; t < e.touches.length; t++) {
                addTrailPoint(e.touches[t].clientX, e.touches[t].clientY);
            }
        }
    }, { passive: true });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha})`;
            ctx.fill();
        });

        for (let i = 0; i < trail.length; i++) {
            const pt = trail[i];
            pt.x += pt.vx;
            pt.y += pt.vy;
            pt.size *= 0.94;
            pt.alpha *= 0.92;

            if (pt.alpha > 0.02) {
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, Math.max(0.5, pt.size), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 230, 118, ${pt.alpha})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(0, 230, 118, 0.8)';
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        while (trail.length > 0 && trail[0].alpha <= 0.02) {
            trail.shift();
        }

        requestAnimationFrame(animate);
    }

    animate();
}
