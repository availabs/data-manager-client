import React, { useState, useEffect } from "react"

import { Input, TextArea, ArrayInput, Select } from "components/avl-components/components/Inputs"
import Editor from "../components/editor"
import ImgInput from "../components/img-input"

import get from "lodash.get"

import { verifyValue, hasValue } from "components/avl-components/components/Inputs/utils"
import { prettyKey, hasBeenUpdated, getValue } from "../utils"

const useSetSections = format => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    setSections(format.attributes.reduce((a, c) => {
      a[a.length - 1].push(c);
      if (c.wizardBreak) {
        a.push([]);
      }
      return a;
    }, [[]]));
  }, [format])

  return sections;
}

const newProcessed = () => ({
  numSections: 0,
  activeSection: null,
  activeIndex: -1,
  verified: false,
  setValues: () => {},
  values: {},
  canGoNext: false,
  next: () => {},
  canGoPrev: false,
  prev: () => {},
  sections: []
})

const getDomain = (att, props) => {
  if (att.domain) {
    if (typeof att.domain === "string") {
      return getValue(att.domain, { props }) || [];
    }
    return att.domain;
  }
  return null;
}

const useProcessValues = (sections, props) => {
  const Processed = newProcessed(),
    [Sections, setSections] = useState([]);

  const [section, setSection] = useState(0);
  const [values, setValues] = useState({});

  Processed.setValues = (key, value) => {
    if (typeof key === "object") {
      setValues(prev => ({ ...prev, ...key }));
    }
    else {
      setValues(prev => ({ ...prev, [key]: value }));
    }
  }
  Processed.values = { ...values };

  useEffect(() => {
    if (!Sections.length) {
      const Sections = sections.reduce((accum, attributes, index) => {
        const Section = {
          index,
          isActive: false,
          verified: false,
          attributes: attributes.map(att => ({
            verified: false,
            ...att,
            value: undefined,
            Input: (() => {
              const [type, array] = att.type.split("-"),
                domain = getDomain(att, props);
              switch (type) {
                case "textarea":
                  return props => <TextArea { ...props } disabled={ att.editable === false }/>;
                case "img":
                  return ImgInput;
                case "richtext":
                  return Editor;
                default:
                  if (array && domain) {
                    return props => <Select { ...props } multi={ true } domain={ domain } disabled={ att.editable === false }/>;
                  }
                  if (domain) {
                    return props => <Select { ...props } multi={ false } domain={ domain } disabled={ att.editable === false }/>;
                  }
                  if (array) {
                    return props => <ArrayInput { ...props } type={ type } disabled={ att.editable === false }/>;
                  }
                  return ({ value, ...props }) => <Input value={ value || "" } { ...props } type={ type } disabled={ att.editable === false }/>;
              }
            })()
          }))
        }
        accum.push(Section);
        return accum;
      }, [])
      setSections(Sections);
    }
  }, [Sections, sections]);
  Processed.sections = Sections;

  if (Sections.length) {
    Sections.forEach((sect, index) => {
      sect.isActive = section === index;
      sect.verified = false;
      sect.attributes.forEach(att => {
        const value = values[att.key];
        att.value = value;
        att.verified = att.required ? hasValue(value) && verifyValue(value, att.type, att.verify) : true;
      })
      sect.verified = sect.attributes.reduce((a, c) => a && c.verified, true)
    })
    Processed.verified = Sections.reduce((a, c) => a && c.verified, true);

    Processed.activeSection = Sections[section];
    Processed.activeIndex = section;
    Processed.numSections = Sections.length;
    Processed.canGoNext = ((section + 1) < Sections.length) && Sections[section].verified;
    Processed.next = () => {
      if (!Sections[section].verified) return;
      if ((section + 1) === Sections.length) return;
      setSection(section + 1);
    };
    Processed.canGoPrev = section > 0;
    Processed.prev = () => {
      if (section === 0) return;
      setSection(section - 1);
    };
  }
      // for (const att in this.state.values) {
      //   if (!attributes.some(d => d.key === att) && hasValue(this.state.values[att])) {
      //     badAttributes.push(att);
      //   }
      // }

  return Processed;
}

export const dmsCreate = Component => {
  return ({ format, ...props }) => {
    const sections = useSetSections(format);

    const Processed = useProcessValues(sections, props);
    Processed.dmsAction = {
      action: "api:create",
      seedProps: () => Processed.values,
      isDisabled: !Processed.verified
    }

    const [init, setInit] = useState(false);
    if (!init) {
      const values = {},
        attributes = get(format, "attributes", []);

      let hasDefaults = false;

      attributes.forEach(att => {
        if (att.default) {
          hasDefaults = true;
          const value = getValue(att.default, { props });
          hasValue(value) && (values[att.key] = value);
        }
      })
      const hasData = Object.keys(values).length;
      hasData && Processed.setValues(values);
      setInit(hasDefaults ? hasData : true);
    }
    return (
      <Component format={ format } { ...props }
        values={ Processed.values } setValues={ Processed.setValues }
        sections={ Processed }/>
    )
  }
}


export const dmsEdit = Component => {
  return ({ format, ...props }) => {
    const sections = useSetSections(format);

    const data = get(props, [props.type, "data"], null);

    const Processed = useProcessValues(sections, props);
    Processed.dmsAction = {
      action: "api:edit",
      seedProps: () => Processed.values,
      isDisabled: !Processed.verified || !hasBeenUpdated(data, Processed.values)
    }
console.log("DATA:", data, Processed.values, hasBeenUpdated(data, Processed.values))

    const [init, setInit] = useState(false);
    useEffect(() => {
      if (!init) {
        if (data) {
          Processed.setValues(data);
          setInit(true);
        }
      }
    })
    return (
      <Component format={ format } { ...props }
        values={ Processed.values } setValues={ Processed.setValues }
        sections={ Processed }/>
    )
  }
}
