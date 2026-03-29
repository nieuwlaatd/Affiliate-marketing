(function() {
  try {
    var theme = localStorage.getItem('theme');
    var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (theme === 'dark' || (!theme && darkQuery.matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch {}
})();
