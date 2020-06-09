export const capitalize = string =>
  string.toLowerCase().split("")
    .map((c, i) => i === 0 ? c.toUpperCase() : c).join("");
export const prettyKey = key =>
  key.replace(/[_-]/g, " ").split(" ").map(string => capitalize(string)).join(" ");
