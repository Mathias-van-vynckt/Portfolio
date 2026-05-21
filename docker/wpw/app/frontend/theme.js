const themeStorageKey = "site-theme";

function applyTheme(theme) {
  const darkModeEnabled = theme === "dark";
  document.documentElement.setAttribute("data-bs-theme", darkModeEnabled ? "dark" : "light");

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.textContent = darkModeEnabled ? "Light mode" : "Dark mode";
    button.setAttribute("aria-pressed", String(darkModeEnabled));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem(themeStorageKey) || "light";
  applyTheme(savedTheme);

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextTheme = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
      localStorage.setItem(themeStorageKey, nextTheme);
      applyTheme(nextTheme);
    });
  });
});
