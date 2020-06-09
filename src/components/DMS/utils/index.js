import get from "lodash.get"

export const capitalize = string =>
  string.toLowerCase().split("")
    .map((c, i) => i === 0 ? c.toUpperCase() : c).join("");
export const prettyKey = key =>
  key.replace(/[_-]/g, " ").split(" ").map(string => capitalize(string)).join(" ");

export const ITEM_REGEX = /^item:(.+)$/;
export const PROPS_REGEX = /^props:(.+)$/;

export const makeFilter = props => {
  const filter = get(props, "filter", false);

  if (!filter) return false;

  if (typeof filter === "function") return filter;

  let { args, comparator } = filter;

  args = args.map(arg => {
    if (typeof arg === "string") {
      if (ITEM_REGEX.test(arg)) {
        return {
          type: "item",
          path: arg.slice(5)
        }
      }
      if (PROPS_REGEX.test(arg)) {
        return {
          type: "value",
          value: get(props, arg.slice(6))
        }
      }
    }
    return { type: "value", value: arg };
  })

  return d =>
    comparator(
      ...args.map(({ type, path, value }) =>
        type === "item" ? get(d, path) : value
      )
    );
}
