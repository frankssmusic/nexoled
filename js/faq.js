// faq.js
function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      const answer = item.querySelector('.faq-a');
      const icon = item.querySelector('.faq-icon');
      const isOpen = answer.classList.contains('open');

      document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
      document.querySelectorAll('.faq-icon').forEach(i => i.textContent = '+');

      if (!isOpen) {
        answer.classList.add('open');
        icon.textContent = '−';
      }
    });
  });
}
