let setTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark").matches ? 'dark' : 'light');

/*handle theme*/
document.addEventListener('DOMContentLoaded', () => {
  if (setTheme === 'dark') {
    document.body.classList.add('dark');
    document.querySelector('#logo-dark').classList.remove('hidden');
    document.querySelector('#logo-light').classList.add('hidden');
    document.querySelector('#theme-light').classList.add('hidden');
    document.querySelector('#theme-dark').classList.remove('hidden');
  }
});