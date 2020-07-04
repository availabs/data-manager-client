import React from "react"

import { hasValue } from "components/avl-components/components/Inputs/utils"
import { useTheme } from "components/avl-components/wrappers/with-theme"

const useSetSections = (format, Attributes) => {
  const [Sections, setSections] = React.useState([]);

  React.useEffect(() => {
    let section = null;
    const sections = format.attributes
      .reduce((a, c) => {
        if (c.title !== section) {
          section = c.title;
          a.push({ title: c.title, attributes: [] });
        }
        a[a.length - 1].attributes.push(c);
        return a;
      }, []);
    setSections(
      sections.map(({ title, attributes }, index) => ({
        index,
        title,
        attributes: attributes.map(att => Attributes[att.key])
      }))
    )
  }, [format, Attributes])

  return Sections;
}

export default ({ format, Attribute, id, autoFocus = false, onFocus, onBlur, value = {}, ...props }) => {
  const Sections = useSetSections(format, Attribute.attributes);

  const [hasFocus, setFocus] = React.useState(autoFocus),
    [prev, setPrev] = React.useState(hasFocus),
    _onFocus = React.useCallback(() => setFocus(true), [setFocus]),
    _onBlur = React.useCallback(() => setFocus(false), [setFocus]);
  React.useEffect(() => {
    if (hasFocus !== prev) {
      (typeof onBlur === "function") && !hasFocus && onBlur();
      (typeof onFocus === "function") && hasFocus && onFocus();
      setPrev(hasFocus);
    }
  }, [hasFocus, prev, onFocus, onBlur]);

  const theme = useTheme();

  return (
    <div id={ id }>
      { Sections.map(section =>
          <div key={ section.index } className={ `
              border-2 border-transparent rounded p-3 ${ theme.transition }
              ${ hasFocus ? theme.inputBorderFocus: theme.inputBorder }
            `}>
            <div className="text-lg font-semibold">{ section.title }</div>
            { section.attributes.map(({ Input, key, ...att }, i) =>
                <div key={ key } className={ `border-l-4 pl-2 pb-2 mb-2 last:mb-0
                ${ !att.verified ? theme.borderDanger : att.required && att.verified ? theme.borderSuccess :
                    hasValue(att.value) ? theme.borderInfo : "border-current" }
                ` }>
                  <label htmlFor={ att.id }>{ att.name }</label>
                  <Input autoFocus={ autoFocus && i === 0 } { ...props }
                    onChange={ att.onChange } value={ att.value }
                    onFocus={ _onFocus }
                    onBlur={ _onBlur }/>
                </div>
              )
            }
          </div>
        )
      }
    </div>
  )
}
