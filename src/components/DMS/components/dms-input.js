import React, { useState, useEffect } from "react"

import { hasValue, verifyValue } from "components/avl-components/components/Inputs/utils"
import { useTheme } from "components/avl-components/wrappers/with-theme"

import { Input, TextArea, Select, ObjectInput } from "components/avl-components/components/Inputs"
import Editor from "../components/editor"
import ImgInput from "../components/img-input"
import ArrayInput from "../components/array-input"

import { useDms } from "../contexts/dms-context"
import { useSetSections } from "../wrappers/dms-create"
import { isRequired, getAttributes } from "../wrappers/utils/dms-create-utils"
import { getValue, prettyKey } from "../utils"

import get from "lodash.get"

const getDomain = (att, props) => {
  if (att.domain) {
    if (typeof att.domain === "string") {
      return getValue(att.domain, { props }) || [];
    }
    return att.domain;
  }
  return null;
}

const getInput = (att, props, disabled) => {
  let { type, isArray } = att,
    domain = getDomain(att, props);

  if (domain) {
    return props => (
      <Select { ...props } multi={ isArray } domain={ domain } id={ att.id }
        disabled={ disabled || (att.editable === false) }/>
    );
  }
  let InputComp = null, inputProps = {};

  switch (type) {
    case "textarea":
      InputComp = TextArea;
      break;
    case "img":
      InputComp = ImgInput;
      break;
    case "richtext":
      InputComp = Editor;
      inputProps = { itemId: get(props, ["item", "id"], "") };
      break;
    case "object":
      InputComp = ObjectInput;
      break;
    case "dms-format":
      InputComp = DmsInput;
      inputProps = { Attribute: att };
      break;
    default:
      InputComp = Input;
      inputProps = { type };
      break;
  }
  if (isArray) {
    return props => (
      <ArrayInput Input={ InputComp } id={ att.id }
        { ...props } inputProps={ inputProps }
        disabled={ disabled || (att.editable === false) }/>
    )
  }
  return props => (
    <InputComp id={ att.id } { ...inputProps } { ...props }
      disabled={ disabled || (att.editable === false) }/>
  )
}

class Attribute {
  constructor(att, props) {
    Object.assign(this, att);

    this.name = this.name || prettyKey(this.key);

    this.Input = getInput(this, props);
  }

  verifyValue = value => {
    if (hasValue(value)) {
      if (Array.isArray(value)) {
        return value.reduce((a, c) =>
          a && verifyValue(c, this.type, this.verify)
        , true)
      }
      else {
        return verifyValue(value, this.type, this.verify);
      }
    }
    return !this.required;
  }
}
class DmsAttribute {
  constructor(att, formats, props) {
    Object.assign(this, att);

  // console.log("registeredFormats",registeredFormats)
    this.Format = JSON.parse(JSON.stringify(formats[this.format]));

    this.attributes = getAttributes(this.Format, props.registeredFormats);

    this.name = this.name || prettyKey(this.key);
    this.required = this.isArray ? this.required : isRequired(this.attributes);

    this.Input = getInput(this, props);
  }
  verifyValue = (value, attributes = this.attributes) => {
    if (!hasValue(value)) return !this.required;

    if (Array.isArray(value)) {
      return value.reduce((a, c) => a && this.verifyValue(c, attributes), true);
    }
    return attributes.reduce((a, c) => {
      if (c.type === "dms-format") {
        return a && this.verifyValue(value[c.key], c.attributes);
      }
      return a && (hasValue(value[c.key]) ?
        verifyValue(value[c.key], c.type, c.verify) : !c.required);
    }, true)
  }
}

const makeNewAttribute = (att, formats, props) => {
  if (att.type === "dms-format") {
    return new DmsAttribute(att, formats, props);
  }
  return new Attribute(att, props);
}

export const useDmsInputState = (sections, value, onChange, props) => {

  const { registeredFormats } = useDms();

  const setValues = React.useCallback((k, v) => {
    onChange({ ...value, [k]: v });
  }, [value, onChange]);

  const [Sections, setSections] = useState([]);

  useEffect(() => {
    if (sections.length && !Sections.length) {
      const Sections = sections.map(({ title, attributes }, index) => {
        const section = {
          index,
          title,
          isActive: false,
          verified: false,
          attributes: attributes.map(att => makeNewAttribute(att, registeredFormats, props))
        }
        return section;
      })
      setSections(Sections);
    }
  }, [sections, Sections.length, registeredFormats, props]);

  return React.useMemo(() => {
    Sections.forEach(section => {
      section.attributes.forEach(att => {
        att.onChange = v => {
          setValues(att.key, v);
        }
      })
    })
    return Sections;
  }, [Sections, setValues]);
}

const DmsInput = React.forwardRef(({ Attribute, id, autoFocus = false, onFocus, onBlur, onChange, value, ...props }, ref) => {
    value = value || {};

// console.log("FORMAT:", Attribute.Format)
    const sections = useSetSections(Attribute.Format),
      Sections = useDmsInputState(sections, value, onChange, props);

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
      <div id={ id } tabIndex="0" ref={ ref } className={ `
          w-full border-2 border-transparent rounded p-3 ${ theme.transition }
          ${ hasFocus ? theme.inputBorderFocus: theme.inputBorder }
        `}>
        { Sections.map(section =>
            <div key={ section.index }>
              <div className="text-lg font-semibold">{ section.title }</div>
              { section.attributes.map(({ Input, key, ...att }, i) =>
                  <div key={ key } className={ `border-l-4 pl-2 pb-2 mb-2 last:mb-0
                    ${ !att.verifyValue(value[key]) ? theme.borderDanger : att.required ? theme.borderSuccess :
                      hasValue(value[key]) ? theme.borderInfo : "border-current" }
                  ` }>
                    <label htmlFor={ att.id }>{ att.name }</label>
                    <Input autoFocus={ autoFocus && i === 0 } { ...props }
                      onChange={ att.onChange } value={ value[key] }
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
)
export default DmsInput;
