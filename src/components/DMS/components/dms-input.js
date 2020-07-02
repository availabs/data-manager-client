import React from "react"

import { hasValue } from "components/avl-components/components/Inputs/utils"
import { useTheme } from "components/avl-components/wrappers/with-theme"

import {
  useSetSections
} from "../wrappers/dms-create"

const useCreateSections = (sections, Attributes) => {
  const [Sections, setSections] = React.useState([]);
  React.useEffect(() => {
    if (!Sections.length) {
      setSections(
        sections.map(({ title, attributes }, index) => ({
          index,
          title,
          isActive: false,
          verified: false,
          attributes: attributes.map(att => Attributes[att.key])
        }))
      )
    }
  }, [sections, Attributes, Sections.length])
  return Sections;
}

export default ({ format, Attribute, id, autoFocus = false, onFocus, onBlur, value = {}, ...props }) => {
  const sections = useSetSections(format),
    Sections = useCreateSections(sections, Attribute.attributes);

  const [[hasFocus, prev], setFocus] = React.useState([autoFocus, autoFocus]),
    [[_onFocus, _onBlur]] = React.useState([
                            () => setFocus([true, hasFocus]),
                            () => setFocus([false, hasFocus])
                          ])
  React.useEffect(() => {
    if (hasFocus !== prev) {
      onBlur && !hasFocus && onBlur();
      onFocus && hasFocus && onFocus();
    }
  }, [hasFocus, prev, onFocus, onBlur]);

  const theme = useTheme();

  return (
    <div id={ id }>
      { Sections.map(section =>
          <div key={ section.index } className={ `
              border-2 border-transparent rounded p-3 ${ theme.transition }
              ${ hasFocus ?
                theme.inputBorderFocus:
                theme.inputBorder
              }
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
