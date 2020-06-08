import React from "react"

import get from "lodash.get"

export const checkAuth = (rules, action, props, item) => {
  action = action.replace(/^(dms|api):(.+)$/, (m, c1, c2) => c2);
  const rule = rules[action];

  if (!rule) return true;

  let { args, comparator } = rule;

  args = args.map(a => {
    if (typeof a === "string") {
      if (a.includes("props:")) {
        return get(props, a.slice(6));
      }
      if (a.includes("item:")) {
        return get(item, a.slice(5));
      }
    }
    return a;
  })
  return comparator(...args);
}

export const AuthContext = React.createContext({
  authRules: null, user: null, interact: null,
  useRouter: false, basePath: null
});
