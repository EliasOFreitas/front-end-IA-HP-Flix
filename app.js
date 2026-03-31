const themeToggle = document.querySelector('#theme-toggle');
const root = document.documentElement;

const ICONS = {
    dark: 'assets/lamp-off.svg',
    light: 'assets/lamp-on.svg',
};

const LABELS = {
    dark: 'Lâmpada desligada',
    light: 'Lâmpada ligada',
};

const STORAGE_KEY = 'imersao-front-theme';
const PROFILE_STORAGE_NAME = 'perfilAtivoNome';
const PROFILE_STORAGE_IMAGE = 'perfilAtivoImagem';

function updateTheme(theme) {
    if (theme === 'light') {
        root.dataset.theme = 'light';
    } else {
        root.removeAttribute('data-theme');
    }

    const img = themeToggle.querySelector('img');
    img.src = ICONS[theme];
    img.alt = LABELS[theme];

    themeToggle.title = theme === 'light'
        ? 'Modo claro ativado'
        : 'Modo escuro ativado';

    localStorage.setItem(STORAGE_KEY, theme);
}

function saveProfileSelection(link) {
    const profileName = link.dataset.profileName;
    const profileImg = link.dataset.profileImg;

    if (profileName) {
        localStorage.setItem(PROFILE_STORAGE_NAME, profileName);
    }
    if (profileImg) {
        localStorage.setItem(PROFILE_STORAGE_IMAGE, profileImg);
    }
}

function getInitialTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

themeToggle.addEventListener('click', () => {
    const current = root.dataset.theme === 'light' ? 'light' : 'dark';
    updateTheme(current === 'light' ? 'dark' : 'light');
});

const profileLinks = document.querySelectorAll('.profile-link');
profileLinks.forEach(link => {
    link.addEventListener('click', () => {
        saveProfileSelection(link);
    });
});

updateTheme(getInitialTheme());

function initializeIntroAudio() {
    const introAudio = document.getElementById('intro-audio');
    if (!introAudio) {
        return;
    }

    window.hpflixIntroAudio = introAudio;
    introAudio.muted = false;
    introAudio.play().catch(() => {
        // Autoplay pode ser bloqueado no primeiro acesso.
        // O elemento permanece disponível para retomar após interação.
    });
}

window.addEventListener('load', initializeIntroAudio);
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        initializeIntroAudio();
    }
});
