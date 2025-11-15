document.addEventListener('DOMContentLoaded', function() {
    var savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon('☀️');
    } else {
        updateThemeIcon('🌙');
    }
    var themeButtons = document.querySelectorAll('.theme-toggle');
    themeButtons.forEach(function(button) {
        button.addEventListener('click', toggleTheme);
    });
});

function toggleTheme() {
    var isDarkMode = document.body.classList.contains('dark-mode');
    if (isDarkMode) {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        updateThemeIcon('🌙');
    } else {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        updateThemeIcon('☀️');
    }
}

function updateThemeIcon(icon) {
    var icons = document.querySelectorAll('.theme-icon');
    icons.forEach(function(elem) {
        elem.textContent = icon;
    });
}