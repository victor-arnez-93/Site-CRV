// ============================================
// NAVEGAÇÃO & MENU MOBILE
// ============================================

const menuToggle = document.getElementById('menuToggle');
const navMobile = document.getElementById('navMobile');
const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-link');

// Toggle Menu Mobile
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navMobile.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// Fechar menu ao clicar em link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMobile.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// Scroll suave para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// HEADER SCROLL EFFECT
// ============================================

const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.background = 'rgba(13, 27, 42, 0.98)';
        header.style.boxShadow = '0 4px 20px rgba(14, 165, 233, 0.3)';
    } else {
        header.style.background = 'rgba(13, 27, 42, 0.95)';
        header.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================

const sections = document.querySelectorAll('section[id]');

function setActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"], .nav-mobile-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', setActiveNav);

// ============================================
// MODAL GOOGLE FORMS
// ============================================

const modal = document.getElementById('modalServico');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.querySelector('.modal-overlay');
const btnServicos = document.querySelectorAll('.btn-servico');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');

// Configuração dos serviços com LINKS CORRETOS
const servicosConfig = {
    sites: {
        title: 'Solicitar Desenvolvimento de Site',
        desc: 'Preencha o formulário abaixo e entraremos em contato para entender melhor suas necessidades.',
        formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScVxF39BEje1NBU2yalgMrf0zCat1Sl2CcP2ym8MD33NeEX9A/viewform?embedded=true'
    },
    hardware: {
        title: 'Solicitar Serviço de Manutenção/Hardware',
        desc: 'Descreva o problema ou serviço desejado e nossa equipe técnica entrará em contato.',
        formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSe2O3IaADfGTmBCjgzOBxYDsRI8d8mWCi5dsr7xmY3lX-gc8A/viewform?embedded=true'
    },
    sistemas: {
        title: 'Solicitar Desenvolvimento de Sistema',
        desc: 'Conte-nos sobre seu projeto e desenvolveremos uma solução personalizada.',
        formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScKn8GEV_FVCq7et7Zxvoe-LI9pD31O6Jo8-hAOfTET83Cduw/viewform?embedded=true'
    }
};

// Abrir modal
btnServicos.forEach(btn => {
    btn.addEventListener('click', () => {
        const servico = btn.getAttribute('data-servico');
        const config = servicosConfig[servico];

        if (config) {
            modalTitle.textContent = config.title;
            modalDesc.textContent = config.desc;

            // Se tiver URL do form, carrega iframe
            const formContainer = document.querySelector('.google-form-container');
            if (config.formUrl) {
                formContainer.innerHTML = `<iframe src="${config.formUrl}" width="100%" height="600" frameborder="0" marginheight="0" marginwidth="0">Carregando…</iframe>`;
            } else {
                formContainer.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <i class="fas fa-exclamation-circle" style="font-size: 48px; color: var(--cor-primaria); margin-bottom: 20px;"></i>
                        <p style="font-size: 16px; color: var(--cor-texto-secundario);">
                            Formulário ainda não configurado.<br>
                            Por favor, entre em contato via WhatsApp ou pelo formulário de contato.
                        </p>
                        <a href="https://wa.me/5515997021387" target="_blank" class="btn-cta" style="margin-top: 20px; display: inline-flex;">
                            <i class="fab fa-whatsapp"></i> Falar no WhatsApp
                        </a>
                    </div>
                `;
            }

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Fechar modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Limpar iframe após fechar
    setTimeout(() => {
        document.querySelector('.google-form-container').innerHTML = '<p class="form-placeholder">Formulário será carregado aqui</p>';
    }, 300);
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// ============================================
// ANIMAÇÕES DE SCROLL
// ============================================

// Intersection Observer para animações
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Elementos para animar
const animateElements = document.querySelectorAll(`
    .servico-card,
    .projeto-card,
    .mvv-card-compact,
    .stat-item,
    .outro-item,
    .porque-item-inline,
    .info-item
`);

animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ============================================
// VALIDAÇÃO DE EMAIL
// ============================================

const emailInput = document.getElementById('email');

emailInput.addEventListener('blur', (e) => {
    const email = e.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
        e.target.style.borderColor = '#ff4444';
        e.target.style.boxShadow = '0 0 10px rgba(255, 68, 68, 0.5)';
    } else {
        e.target.style.borderColor = '';
        e.target.style.boxShadow = '';
    }
});

// ============================================
// COUNTER ANIMATION (Stats)
// ============================================

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Observar stats para animar quando visíveis
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const numberElement = entry.target.querySelector('h3');
            const targetValue = numberElement.textContent.replace(/\D/g, '');

            // Se for número
            if (!isNaN(targetValue) && targetValue !== '') {
                animateCounter(numberElement, parseInt(targetValue));
                entry.target.classList.add('counted');
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// ============================================
// PARALLAX EFFECT (Backgrounds)
// ============================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('section[style*="background-image"]');

    parallaxElements.forEach((el, index) => {
        const speed = index % 2 === 0 ? 0.5 : -0.3;
        el.style.backgroundPositionY = `${scrolled * speed}px`;
    });
});

// ============================================
// LAZY LOADING DE IMAGENS
// ============================================

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// ============================================
// COPIAR EMAIL AO CLICAR
// ============================================

const emailElements = document.querySelectorAll('.info-content p');

emailElements.forEach(el => {
    if (el.textContent.includes('@')) {
        el.style.cursor = 'pointer';
        el.title = 'Clique para copiar';

        el.addEventListener('click', () => {
            const email = el.textContent.trim();
            navigator.clipboard.writeText(email).then(() => {
                const originalText = el.textContent;
                el.textContent = '✓ Copiado!';
                el.style.color = 'var(--cor-primaria)';

                setTimeout(() => {
                    el.textContent = originalText;
                    el.style.color = '';
                }, 2000);
            }).catch(err => {
                console.error('Erro ao copiar:', err);
            });
        });
    }
});

// ============================================
// PRELOADER (Opcional)
// ============================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Fade in da página
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ============================================
// SCROLL TO TOP BUTTON
// ============================================

const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: transparent;
    border: 2px solid var(--cor-primaria);
    border-radius: 50%;
    color: var(--cor-primaria);
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 998;
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.background = 'var(--gradiente-azul)';
    scrollTopBtn.style.color = '#ffffff';
    scrollTopBtn.style.transform = 'translateY(-5px) scale(1.1)';
    scrollTopBtn.style.boxShadow = 'var(--neon-azul)';
});

scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.background = 'transparent';
    scrollTopBtn.style.color = 'var(--cor-primaria)';
    scrollTopBtn.style.transform = 'translateY(0) scale(1)';
    scrollTopBtn.style.boxShadow = 'none';
});

// ============================================
// ANIMAÇÃO DO LOGO NO HERO
// ============================================

const heroLogo = document.querySelector('.hero-logo');

if (heroLogo) {
    heroLogo.addEventListener('mouseenter', () => {
        heroLogo.style.animation = 'none';
        setTimeout(() => {
            heroLogo.style.animation = 'logoFloat 3s ease-in-out infinite';
        }, 10);
    });
}

// ============================================
// PERFORMANCE: DEBOUNCE SCROLL EVENTS
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplicar debounce em scroll events pesados
const debouncedParallax = debounce(() => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('section[style*="background-image"]');

    parallaxElements.forEach((el, index) => {
        const speed = index % 2 === 0 ? 0.5 : -0.3;
        el.style.backgroundPositionY = `${scrolled * speed}px`;
    });
}, 10);

// ============================================
// FORMULÁRIO CONTATO (Formspree sem redirecionar)
// ============================================

const contatoForm = document.getElementById("contatoForm");

if (contatoForm) {
    contatoForm.addEventListener("submit", async function (e) {
        e.preventDefault(); // impede redirecionamento

        const form = e.target;
        const data = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                alert("Mensagem enviada com sucesso! Em breve entraremos em contato.");
                form.reset();
                document.getElementById("contatoForm").scrollIntoView({ behavior: "smooth" });
            } else {
                alert("Erro ao enviar a mensagem. Tente novamente em instantes.");
            }
        } catch (error) {
            alert("Erro de conexão. Verifique sua internet e tente novamente.");
        }
    });
}

// ==============================
// MÁSCARA DE TELEFONE (DDD + 9xxxx-xxxx)
// ==============================
const telefoneInput = document.getElementById("telefone");

if (telefoneInput) {
  telefoneInput.addEventListener("input", function (e) {
    let v = e.target.value.replace(/\D/g, ""); // só números

    if (v.length > 11) v = v.slice(0, 11);

    if (v.length > 10) {
      v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (v.length > 6) {
      v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
    } else if (v.length > 0) {
      v = v.replace(/^(\d{0,2}).*/, "($1");
    }

    e.target.value = v;
  });

  // Impede letras
  telefoneInput.addEventListener("keypress", function (e) {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  });
}

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log('%c🚀 CRV - Soluções em TI', 'color: #0ea5e9; font-size: 24px; font-weight: bold;');
console.log('%cDesenvolvido pela equipe CRV', 'color: #00d4ff; font-size: 14px;');
console.log('%cWhatsApp: (15) 99702-1387', 'color: #25d366; font-size: 12px;');
console.log('%cEmail: crv.solucoesti@gmail.com', 'color: #c0c6d0; font-size: 12px;');

// ============================================
// FIM DO SCRIPT
// ============================================
