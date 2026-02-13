// aHR0cHM6Ly9naXRodWIuY29tL2x1b3N0MjYvYWNhZGVtaWMtaG9tZXBhZ2U=
$(function () {
    lazyLoadOptions = {
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        effectTime: 300,
        placeholder: "",
        onError: function(element) {
            console.log('[lazyload] Error loading ' + element.data('src'));
        },
        afterLoad: function(element) {
            if (element.is('img')) {
                // remove background-image style
                element.css('background-image', 'none');
                element.css('min-height', '0');
            } else if (element.is('div')) {
                // set the style to background-size: cover; 
                element.css('background-size', 'cover');
                element.css('background-position', 'center');
            }
        }
    }

    $('img.lazy, div.lazy:not(.always-load)').Lazy({visibleOnly: true, ...lazyLoadOptions});
    $('div.lazy.always-load').Lazy({visibleOnly: false, ...lazyLoadOptions});

    $('[data-toggle="tooltip"]').tooltip()

    var $grid = $('.grid').masonry({
        "percentPosition": true,
        "itemSelector": ".grid-item",
        "columnWidth": ".grid-sizer"
    });
    // layout Masonry after each image loads
    $grid.imagesLoaded().progress(function () {
        $grid.masonry('layout');
    });

    $(".lazy").on("load", function () {
        $grid.masonry('layout');
    });
});

(() => {
    const storageKey = "theme-preference";
    const root = document.documentElement;

    const getSystemTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    const applyTheme = (theme) => {
        root.setAttribute("data-theme", theme);
        const toggle = document.getElementById("theme-toggle");
        if (toggle) {
            const isDark = theme === "dark";
            toggle.setAttribute("aria-pressed", String(isDark));
            toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
        }
    };

    const savedTheme = localStorage.getItem(storageKey);
    const initialTheme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : getSystemTheme();
    applyTheme(initialTheme);

    document.addEventListener("DOMContentLoaded", () => {
        requestAnimationFrame(() => root.classList.add("theme-ready"));

        const toggle = document.getElementById("theme-toggle");
        if (!toggle) return;

        toggle.addEventListener("click", () => {
            const current = root.getAttribute("data-theme") || "light";
            const next = current === "dark" ? "light" : "dark";
            localStorage.setItem(storageKey, next);
            applyTheme(next);
        });
    });

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    if (media && typeof media.addEventListener === "function") {
        media.addEventListener("change", (event) => {
            if (!localStorage.getItem(storageKey)) {
                applyTheme(event.matches ? "dark" : "light");
            }
        });
    }
})();
