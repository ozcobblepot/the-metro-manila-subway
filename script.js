document.addEventListener('DOMContentLoaded', function() {
    const learnMoreBtn = document.querySelector('a[href="#about"]');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('#about').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
});
