import { categories } from './data.js';
import { createCarousel } from './components/Carousel.js';

document.addEventListener('DOMContentLoaded', () => {
    const nomePerfil = localStorage.getItem('perfilAtivoNome');
    const imagemPerfil = localStorage.getItem('perfilAtivoImagem');

    if (nomePerfil && imagemPerfil) {
        const kidsLink = document.querySelector('.kids-link');
        const profileIcon = document.querySelector('.profile-icon');
        
        if (kidsLink) {
            kidsLink.textContent = nomePerfil;
            kidsLink.href = '../index.html';
        }

        if (profileIcon) {
            const profileSrc = imagemPerfil.startsWith('/')
                ? imagemPerfil
                : `../${imagemPerfil}`;
            profileIcon.src = profileSrc;
            profileIcon.alt = `${nomePerfil} profile`;
        }
    }

    const introAudio = document.getElementById('intro-audio');
    if (introAudio) {
        window.hpflixIntroAudio = introAudio;
        introAudio.play().catch(() => {
            // Autoplay pode ser bloqueado pelo navegador
        });
    }

    const container = document.getElementById('main-content');
    
    if (container) {
        categories.forEach(category => {
            const carousel = createCarousel(category);
            container.appendChild(carousel);
        });
    }
});
