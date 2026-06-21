// Desplazamiento suave para los enlaces del menú
document.querySelectorAll('.nav-links a, .btn-cta, .btn-main').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 70, // Ajuste por el header fijo
                behavior: 'smooth'
            });
        }
    });
});

// Cambio de transparencia del header al hacer scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.padding = '10px 5%';
        header.style.background = 'rgba(15, 23, 42, 0.98)';
    } else {
        header.style.padding = '15px 5%';
        header.style.background = 'rgba(15, 23, 42, 0.95)';
    }
});