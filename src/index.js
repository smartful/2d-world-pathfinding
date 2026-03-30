const currentPath = window.location.pathname;

document.querySelectorAll("nav a").forEach((link) => {
  const linkPath = new URL(link.href).pathname;

  if (linkPath === currentPath) {
    link.classList.add("active");
  }
});
