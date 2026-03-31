import { getYouTubeId, getRandomMatchScore, getRandomDuration } from '../utils.js';

export function createCard(item) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    if (item.progress) {
        card.classList.add('has-progress');
    }

    const img = document.createElement('img');
    img.src = item.img;
    img.alt = `Movie cover`;

    const iframe = document.createElement('iframe');
    iframe.frameBorder = "0";
    iframe.allow = "autoplay; encrypted-media";

    const overlay = document.createElement('div');
    overlay.className = 'video-click-overlay';
    overlay.addEventListener('click', (event) => {
        event.stopPropagation();
        openCardModal();
    });

    const videoId = getYouTubeId(item.youtube);

    card.appendChild(iframe);
    card.appendChild(overlay);
    card.appendChild(img);

    const title = document.createElement('div');
    title.className = 'movie-card-title';
    title.textContent = item.title || 'Sem título';
    card.appendChild(title);

    const details = document.createElement('div');
    details.className = 'card-details';
    details.innerHTML = `
        <div class="details-buttons">
            <div class="left-buttons">
                <button class="btn-icon btn-play-icon"><i class="fas fa-play" style="margin-left:2px;"></i></button>
                ${item.progress ? '<button class="btn-icon"><i class="fas fa-check"></i></button>' : '<button class="btn-icon"><i class="fas fa-plus"></i></button>'}
                <button class="btn-icon"><i class="fas fa-thumbs-up"></i></button>
            </div>
            <div class="right-buttons">
                <button class="btn-icon"><i class="fas fa-chevron-down"></i></button>
            </div>
        </div>
        <div class="details-info">
            <span class="match-score">${getRandomMatchScore()}% relevante</span>
            <span class="age-badge">Livre</span>
            <span class="duration details-duration">${getRandomDuration(item.progress)}</span>
            <span class="resolution details-resolution">HD</span>
        </div>
        <div class="details-tags">
            <span>Empolgante</span>
            <span>Animação</span>
            <span>Ficção</span>
        </div>
        <div class="details-description">Carregando informações do vídeo...</div>
    `;
    card.appendChild(details);

    async function getYoutubeDetails(url) {
        const detailsResult = {
            duration: item.progress ? '10 temporadas' : getRandomDuration(item.progress),
            resolution: 'HD',
            description: 'Descrição não disponível para este vídeo.',
        };

        if (!url) {
            return detailsResult;
        }

        try {
            const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
            if (!response.ok) {
                return detailsResult;
            }

            const data = await response.json();
            return {
                duration: item.progress ? '10 temporadas' : detailsResult.duration,
                resolution: 'HD',
                description: data.title ? `Descrição: ${data.title}` : detailsResult.description,
            };
        } catch (error) {
            return detailsResult;
        }
    }

    getYoutubeDetails(item.youtube).then(videoInfo => {
        const descriptionEl = details.querySelector('.details-description');
        const durationEl = details.querySelector('.details-duration');
        const resolutionEl = details.querySelector('.details-resolution');

        if (descriptionEl) {
            descriptionEl.textContent = videoInfo.description;
        }
        if (durationEl) {
            durationEl.textContent = videoInfo.duration;
        }
        if (resolutionEl) {
            resolutionEl.textContent = videoInfo.resolution;
        }
    });


    let hoverAutoplayTimeout = null;
    let hoverVideoPlaying = false;
    let suppressAudioResume = false;

    if (item.progress) {
        const pbContainer = document.createElement('div');
        pbContainer.className = 'progress-bar-container';
        const pbValue = document.createElement('div');
        pbValue.className = 'progress-value';
        pbValue.style.width = `${item.progress}%`;
        pbContainer.appendChild(pbValue);
        card.appendChild(pbContainer);
    }

    function pauseIntroAudio() {
        const introAudio = window.hpflixIntroAudio;
        if (introAudio && !introAudio.paused) {
            introAudio.pause();
        }
    }

    function resumeIntroAudio() {
        const introAudio = window.hpflixIntroAudio;
        if (introAudio && introAudio.paused && !introAudio.ended) {
            introAudio.play().catch(() => {
                // Se autoplay estiver bloqueado, mantém a reprodução pausada
            });
        }
    }

    function startHoverPreview() {
        if (hoverVideoPlaying) {
            return;
        }
        pauseIntroAudio();
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${videoId}`;
        iframe.classList.add('playing');
        img.classList.add('playing-video');
        overlay.classList.add('active');
        hoverVideoPlaying = true;
    }

    function stopHoverPreview() {
        if (!hoverVideoPlaying) {
            return;
        }
        iframe.classList.remove('playing');
        img.classList.remove('playing-video');
        iframe.src = '';
        overlay.classList.remove('active');
        hoverVideoPlaying = false;
        if (!suppressAudioResume) {
            resumeIntroAudio();
        }
    }

    card.addEventListener('mouseenter', () => {
        const rect = card.getBoundingClientRect();
        const windowWidth = window.innerWidth;

        if (rect.left < 100) {
            card.classList.add('origin-left');
        } else if (rect.right > windowWidth - 100) {
            card.classList.add('origin-right');
        }

        clearTimeout(hoverAutoplayTimeout);
        hoverAutoplayTimeout = setTimeout(startHoverPreview, 300);
    });

    card.addEventListener('mouseleave', () => {
        clearTimeout(hoverAutoplayTimeout);
        stopHoverPreview();
        card.classList.remove('origin-left');
        card.classList.remove('origin-right');
    });

    card.addEventListener('click', (event) => {
        const playButtonClicked = event.target.closest('.btn-play-icon');
        if (event.target.closest('button') && !playButtonClicked) {
            return;
        }
        clearTimeout(hoverAutoplayTimeout);
        suppressAudioResume = true;
        stopHoverPreview();
        suppressAudioResume = false;
        openCardModal();
    });

    function openCardModal() {
        pauseIntroAudio();

        const backdrop = document.createElement('div');
        backdrop.className = 'movie-card-modal-backdrop';

        const modal = document.createElement('div');
        modal.className = 'movie-card-modal';

        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.addEventListener('click', closeModal);

        const modalTitle = document.createElement('div');
        modalTitle.className = 'modal-title';
        modalTitle.textContent = item.title || 'Sem título';

        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'modal-image-wrapper';
        const modalImage = document.createElement('img');
        modalImage.src = item.img;
        modalImage.alt = `Capa de ${item.title || 'vídeo'}`;
        imageWrapper.appendChild(modalImage);

        const modalIframe = document.createElement('iframe');
        modalIframe.frameBorder = '0';
        modalIframe.allow = 'autoplay; encrypted-media; fullscreen';
        modalIframe.style.display = 'none';
        modalIframe.className = 'modal-video-iframe';
        imageWrapper.appendChild(modalIframe);

        const detailsClone = details.cloneNode(true);
        detailsClone.classList.add('modal-card-details');

        const modalPlayButton = detailsClone.querySelector('.btn-play-icon');
        let modalVideoPlaying = false;
        let modalAutoplayTimeout;

        function updateModalPlayButtonIcon(playing) {
            if (!modalPlayButton) {
                return;
            }
            modalPlayButton.innerHTML = playing ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play" style="margin-left:2px;"></i>';
        }

        function toggleModalVideo(playing) {
            if (playing) {
                pauseIntroAudio();
                modalImage.style.display = 'none';
                modalIframe.style.display = 'block';
                modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0`;
                modalVideoPlaying = true;
                updateModalPlayButtonIcon(true);
                clearTimeout(modalAutoplayTimeout);
            } else {
                modalIframe.src = '';
                modalIframe.style.display = 'none';
                modalImage.style.display = '';
                modalVideoPlaying = false;
                updateModalPlayButtonIcon(false);
                clearTimeout(modalAutoplayTimeout);
                resumeIntroAudio();
            }
        }

        if (modalPlayButton) {
            modalPlayButton.addEventListener('click', (event) => {
                event.stopPropagation();
                toggleModalVideo(!modalVideoPlaying);
            });
        }

        modalAutoplayTimeout = setTimeout(() => {
            toggleModalVideo(true);
        }, 1000);

        modal.appendChild(closeButton);
        modal.appendChild(modalTitle);
        modal.appendChild(imageWrapper);
        modal.appendChild(detailsClone);
        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);
        document.body.style.overflow = 'hidden';

        function handleEscape(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        }

        function closeModal() {
            if (document.body.contains(backdrop)) {
                clearTimeout(modalAutoplayTimeout);
                modalIframe.src = '';
                document.body.removeChild(backdrop);
                document.body.style.overflow = 'auto';
                document.removeEventListener('keydown', handleEscape);                resumeIntroAudio();            }
        }

        backdrop.addEventListener('click', (event) => {
            if (event.target === backdrop) {
                closeModal();
            }
        });

        document.addEventListener('keydown', handleEscape);
    }

    return card;
}
