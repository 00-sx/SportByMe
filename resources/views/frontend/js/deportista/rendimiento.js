document.querySelectorAll('.accordion-item').forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });