/*
    Bronnen:
    - Functionele referentie: https://www.headspace.com/
    - JavaScript-opfrisser: https://www.youtube.com/watch?v=W6NZfCO5SIk
    - Bijles / uitleg over JS-concepten: neef (software engineer)
    - Hulp bij logica/uitleg en commentaarstructuur: https://gemini.google.com/app
*/

// Voorkom dat oude scrollpositie herstelt bij het herladen
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// --- Mobiel hoofdmenu (<dialog>) ---
const openMenuBtn = document.querySelector('.hamburger-btn');
const closeMenuBtn = document.querySelector('.menu-close-btn');
const mobileMenu = document.getElementById('mobile-menu') || document.querySelector('dialog.mobile-menu-overlay');

if (openMenuBtn && mobileMenu) {
    openMenuBtn.addEventListener('click', () => {
        mobileMenu.showModal();
    });
}

if (closeMenuBtn && mobileMenu) {
    closeMenuBtn.addEventListener('click', () => {
        mobileMenu.close();
    });
}

// Submenu openen, teruggaan en sluiten per categorie-rij
const menuRows = document.querySelectorAll('.mobile-menu-items > li');

menuRows.forEach((row) => {
    const openSubBtn = row.querySelector('.menu-row-btn');
    const backBtn = row.querySelector('.submenu-back-btn');
    const subCloseBtn = row.querySelector('.submenu-close-btn');

    if (openSubBtn) {
        openSubBtn.addEventListener('click', () => {
            row.classList.add('is-open');
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            row.classList.remove('is-open');
        });
    }

    if (subCloseBtn) {
        subCloseBtn.addEventListener('click', () => {
            row.classList.remove('is-open');
        });
    }
});

// Houd binnen een submenu steeds maximaal één <details>-lijst open
const allSubmenuPanels = document.querySelectorAll('.submenu-panel');

allSubmenuPanels.forEach((panel) => {
    const detailsList = panel.querySelectorAll('details');

    detailsList.forEach((targetDetail) => {
        targetDetail.addEventListener('toggle', () => {
            if (targetDetail.open) {
                detailsList.forEach((detail) => {
                    if (detail !== targetDetail) {
                        detail.removeAttribute('open');
                    }
                });
            }
        });
    });
});

// --- Roterende koptekst in de hero ---
const tickerItems = document.querySelectorAll('.ticker-item');

if (tickerItems.length > 0) {
    let currentIndex = 0;

    setInterval(() => {
        const currentItem = tickerItems[currentIndex];

        currentIndex = (currentIndex + 1) % tickerItems.length;
        const nextItem = tickerItems[currentIndex];

        currentItem.classList.remove('is-visible');
        currentItem.classList.add('exit-up');

        nextItem.classList.remove('exit-up');
        nextItem.classList.add('is-visible');

        setTimeout(() => {
            currentItem.classList.remove('exit-up');
        }, 500);
    }, 2500);
}

// --- Stress-modal ---
const openStressBtn = document.getElementById('open-stress-modal');
const stressDialog = document.getElementById('stress-dialog');

if (openStressBtn && stressDialog) {
    openStressBtn.addEventListener('click', () => {
        stressDialog.showModal();
    });

    // Sluit bij klikken op de backdrop buiten de modal
    stressDialog.addEventListener('click', (event) => {
        if (event.target === stressDialog) {
            stressDialog.close();
        }
    });
}

// --- Overige modals via data-dialog ---
const modalButtons = document.querySelectorAll('button[data-dialog]');
const allModals = document.querySelectorAll('dialog.need-state-modal');

modalButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const dialogId = button.getAttribute('data-dialog');
        const targetModal = document.getElementById(dialogId);

        if (targetModal) {
            targetModal.showModal();
            document.body.style.overflow = 'hidden';
        }
    });
});

allModals.forEach((modal) => {
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.close();
        }
    });

    // Scroll weer vrijgeven zodra de modal sluit (ook via Esc of sluitknop)
    modal.addEventListener('close', () => {
        document.body.style.overflow = '';
    });
});

// --- Tabs & carrousel ---
document.querySelectorAll('nav.deeper-dive-tabs, nav.library-tabs').forEach((nav) => {
    const buttons = nav.querySelectorAll('button.tab-button');

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            buttons.forEach((b) => b.classList.remove('is-active'));
            btn.classList.add('is-active');

            // Zorg dat de gekozen tab op kleinere schermen in beeld schuift
            btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
    });
});

// Update aria-pressed voor de library-tabs
const libraryTabs = document.querySelectorAll('main.hero-cards > aside + section > nav button');

libraryTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        libraryTabs.forEach((btn) => btn.setAttribute('aria-pressed', 'false'));
        tab.setAttribute('aria-pressed', 'true');
    });
});

// --- Back-to-top & footer accordions ---
const backToTopBtn = document.querySelector('footer > section:nth-of-type(4) > button');

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Op desktop staan footer-details open, op kleinere schermen inklapbaar
function syncFooterDetails() {
    const isDesktop = window.innerWidth >= 1024;
    document.querySelectorAll('.site-footer details').forEach((detail) => {
        detail.open = isDesktop;
    });
}

syncFooterDetails();
window.addEventListener('resize', syncFooterDetails);

// --- Sleep-pagina: audio-tabs (sectie 4) ---
const sleepTabButtons = document.querySelectorAll('.sleep-page section:nth-of-type(4) ul button');
const sleepTabPanels = document.querySelectorAll('.sleep-page section:nth-of-type(4) article');

if (sleepTabButtons.length > 0 && sleepTabPanels.length > 0) {
    sleepTabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            sleepTabButtons.forEach((btn) => btn.classList.remove('active'));
            sleepTabPanels.forEach((panel) => panel.classList.remove('active'));

            button.classList.add('active');
            if (sleepTabPanels[index]) {
                sleepTabPanels[index].classList.add('active');
            }
        });
    });
}

// --- Sleep-pagina: paginering & kaarten (sectie 5) ---
const tipArticles = document.querySelectorAll('.sleep-page section:nth-of-type(5) article');
const tipNavButtons = document.querySelectorAll('.sleep-page section:nth-of-type(5) > ul:last-of-type button');

if (tipArticles.length > 0 && tipNavButtons.length > 0) {
    let currentTipIndex = 0;

    function showTipCard(index) {
        currentTipIndex = (index + tipArticles.length) % tipArticles.length;

        tipArticles.forEach((article, i) => {
            article.classList.toggle('active', i === currentTipIndex);
        });

        tipNavButtons.forEach((btn, i) => {
            if (i >= 1 && i <= tipArticles.length) {
                btn.classList.toggle('active', i - 1 === currentTipIndex);
            }
        });
    }

    tipNavButtons.forEach((btn, i) => {
        btn.addEventListener('click', () => {
            if (i === 0) {
                showTipCard(currentTipIndex - 1);
            } else if (i === tipNavButtons.length - 1) {
                showTipCard(currentTipIndex + 1);
            } else {
                showTipCard(i - 1);
            }
        });
    });

    showTipCard(0);
    window.addEventListener('load', () => {
        showTipCard(0);
    });
}

const sleepTipsSection = document.querySelector('.sleep-page section:nth-of-type(5)');

if (sleepTipsSection) {
    const cardsList = sleepTipsSection.querySelector('ul:first-of-type');
    const paginationBtns = sleepTipsSection.querySelectorAll('ul:last-of-type button');

    paginationBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            if (window.innerWidth >= 768 && cardsList) {
                const goToPage2 = index === paginationBtns.length - 1 || btn.textContent.trim() === '2';
                cardsList.classList.toggle('page-2', goToPage2);

                paginationBtns.forEach((b) => b.classList.remove('active'));
                if (paginationBtns[goToPage2 ? 2 : 1]) {
                    paginationBtns[goToPage2 ? 2 : 1].classList.add('active');
                }
            }
        });
    });
}

// --- Startpositie carrousel bij laden ---
window.addEventListener('load', () => {
    const slidesContainer = document.querySelector('ul.deeper-dive-slides');
    if (slidesContainer) {
        const prevBehavior = slidesContainer.style.scrollBehavior;
        slidesContainer.style.scrollBehavior = 'auto';
        slidesContainer.scrollLeft = 0;
        slidesContainer.style.scrollBehavior = prevBehavior;
    }
});

// --- Testimonial-carrousel pijltjes ---
function initTestimonialCarousel() {
    const controlsNav = document.querySelector('nav.testimonials-controls');
    const prevBtn = controlsNav?.querySelector('.btn-prev');
    const nextBtn = controlsNav?.querySelector('.btn-next');
    const track = controlsNav?.previousElementSibling?.matches('ul')
        ? controlsNav.previousElementSibling
        : document.querySelector('ul:has(> li.testimonial-card)');

    if (!track || !prevBtn || !nextBtn) return;

    // Scroll steeds één kaartbreedte inclusief eventuele ruimte ertussen
    const getScrollAmount = () => {
        const firstCard = track.firstElementChild;
        if (!firstCard) return 320;
        const gap = parseFloat(getComputedStyle(track).gap) || 16;
        return firstCard.getBoundingClientRect().width + gap;
    };
}

initTestimonialCarousel();



