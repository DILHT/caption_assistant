function applyTheme() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("theme");
  const html = document.documentElement;
  const isDark = savedTheme ? savedTheme === "dark" : prefersDark;
  html.classList.toggle("dark", isDark);
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) themeToggle.textContent = isDark ? "☀️" : "🌙";
}
window.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const html = document.documentElement;
      const nowDark = !html.classList.contains("dark");
      html.classList.toggle("dark", nowDark);
      localStorage.setItem("theme", nowDark ? "dark" : "light");
      themeToggle.textContent = nowDark ? "☀️" : "🌙";
    });
  }
});