export const getIcon = (icon, title) => {
  if (icon) {
    return String.fromCodePoint(parseInt(icon, 16));
  }

  return title.charAt(0).toUpperCase();
};
