window.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('[data-competition-form]');
  if (!form) return;

  const panels = [...form.querySelectorAll('[data-step-panel]')];
  const pills = [...form.querySelectorAll('[data-step-pill]')];
  let currentStep = 0;

  const render = () => {
    panels.forEach((panel, index) => panel.classList.toggle('active', index === currentStep));
    pills.forEach((pill, index) => pill.classList.toggle('active', index === currentStep));
  };

  form.addEventListener('click', (event) => {
    const nextButton = event.target.closest('[data-next-step]');
    const backButton = event.target.closest('[data-back-step]');
    if (nextButton) {
      currentStep = Math.min(panels.length - 1, currentStep + 1);
      render();
    }
    if (backButton) {
      currentStep = Math.max(0, currentStep - 1);
      render();
    }
  });

  render();
});
