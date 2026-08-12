// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function () {
            // Toggle active class on the clicked item
            item.classList.toggle('active');

            // Optional: Close other FAQ items (uncomment for accordion behavior)
            // faqItems.forEach(otherItem => {
            //     if (otherItem !== item && otherItem.classList.contains('active')) {
            //         otherItem.classList.remove('active');
            //     }
            // });
        });
    });
});

// Dynamic footer year update
document.addEventListener('DOMContentLoaded', function () {
    const yearSpan = document.querySelector('.footer-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

// Optional: Log page load for debugging
console.log('Appliance Energy Consumption website loaded successfully!');