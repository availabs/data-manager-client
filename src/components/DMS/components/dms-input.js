import React from "react"

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

const makeInitialState = autoFocus => ({
  hasFocus: autoFocus,
  prev: autoFocus
})
const reducer = (state, action) => {
  switch (action.type) {
    case "onBlur":
      return ({ hasFocus: false, prev: state.hasFocus });
    case "onFocus":
      return ({ hasFocus: true, prev: state.hasFocus });
    case "updatePrev":
      return ({ hasFocus: state.hasFocus, prev: state.hasFocus });
    default:
      return state;
  }
}

export default ({ format, Attribute, onChange, id, autoFocus = false, onFocus, onBlur, value = {}, ...props }) => {
  const sections = useSetSections(format),
    Sections = useCreateSections(sections, Attribute.attributes);

  const [{ hasFocus, prev }, dispatch] = React.useReducer(reducer, makeInitialState(autoFocus));

  React.useEffect(() => {
    if (hasFocus !== prev) {
      onBlur && !hasFocus && onBlur();
      onFocus && hasFocus && onFocus();
      dispatch({ type: "updatePrev" });
    }
  }, [hasFocus, prev, onFocus, onBlur])

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
                  ${ att.required ? att.verified ? "border-green-400" : "border-red-400" : "border-current" }
                ` }>
                  <label htmlFor={ att.id }>{ att.name }</label>
                  <Input autoFocus={ autoFocus && i === 0 } value={ value[key] } { ...props }
                    onChange={ v => onChange({ ...value, [key]: v }) }
                    onFocus={ e => dispatch({ type: "onFocus" }) }
                    onBlur={ e => dispatch({ type: "onBlur" }) }/>
                </div>
              )
            }
          </div>
        )
      }
    </div>
  )
}
