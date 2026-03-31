import { createCard } from './Card.js';

export function createCarousel(category) {
    const section = document.createElement('div');
    section.className = 'slider-section';

    function createHtmlId(value) {
        return value
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-');
    }

    const sectionId = `slider-${createHtmlId(category.title)}`;
    section.id = sectionId;

    // Header for Title and Indicators
    const header = document.createElement('div');
    header.className = 'slider-header';

    const title = document.createElement('h2');
    title.className = 'slider-title';
    title.innerText = category.title;

    const indicators = document.createElement('div');
    indicators.className = 'slider-indicators';

    header.appendChild(title);
    header.appendChild(indicators);
    section.appendChild(header);

    const row = document.createElement('div');
    row.className = 'movie-row';
    row.id = `movie-row-${createHtmlId(category.title)}`;

    category.items.forEach(item => {
        const card = createCard(item);
        const itemId = `card-${createHtmlId(item.title)}`;
        card.id = itemId;
        card.dataset.category = createHtmlId(category.title);
        card.dataset.title = createHtmlId(item.title);
        row.appendChild(card);
    });

    const rowWrapper = document.createElement('div');
    rowWrapper.className = 'movie-row-wrapper';
    rowWrapper.id = `movie-row-wrapper-${createHtmlId(category.title)}`;

    const leftButton = document.createElement('button');
    leftButton.type = 'button';
    leftButton.className = 'slider-control left';
    leftButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    leftButton.addEventListener('click', () => {
        row.scrollBy({ left: -row.clientWidth * 0.8, behavior: 'smooth' });
    });

    const rightButton = document.createElement('button');
    rightButton.type = 'button';
    rightButton.className = 'slider-control right';
    rightButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    rightButton.addEventListener('click', () => {
        row.scrollBy({ left: row.clientWidth * 0.8, behavior: 'smooth' });
    });

    function hasScrollableContent(element, container) {
        const overflow = element.scrollWidth - container.clientWidth;
        return overflow > 10;
    }

    function updateControlVisibility() {
        const controlsEnabled = hasScrollableContent(row, rowWrapper);
        rowWrapper.classList.toggle('has-overflow', controlsEnabled);
        leftButton.hidden = false;
        rightButton.hidden = false;
    }

    // Keep control visibility in sync on resize and after content is rendered
    window.addEventListener('resize', updateControlVisibility);
    row.addEventListener('scroll', updateControlVisibility);
    row.querySelectorAll('img').forEach(img => img.addEventListener('load', updateControlVisibility));
    requestAnimationFrame(updateControlVisibility);

    row.addEventListener('wheel', (event) => {
        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            event.preventDefault();
            row.scrollLeft += event.deltaY;
        }
    }, { passive: false });

    rowWrapper.appendChild(row);
    rowWrapper.appendChild(leftButton);
    rowWrapper.appendChild(rightButton);
    section.appendChild(rowWrapper);
    return section;
}
