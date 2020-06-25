import React, { useState, useEffect } from "react"

import { Input, TextArea, ArrayInput, Select } from "components/avl-components/components/Inputs"
import Editor from "../components/editor"
import ImgInput from "../components/img-input"
import DmsInput from "../components/dms-input"

import get from "lodash.get"

import { verifyValue, hasValue } from "components/avl-components/components/Inputs/utils"
import { hasBeenUpdated, getValue, prettyKey } from "../utils"

export const useSetSections = format => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    let section = null;
    setSections(
      format.attributes
        .reduce((a, c) => {
          if (c.title !== section) {
            section = c.title;
            a.push({ title: c.title, attributes: [] });
          }
          a[a.length - 1].attributes.push(c);
          return a;
        }, [])
    );
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

class Attribute {
  constructor(att, props) {
    Object.assign(this, att);
    this.name = this.name || prettyKey(this.key);
    this.verified = false;
    this.value = null;
    this.Input = getInput(this, props);
  }
  setValue(v) {
    this.value = v;
    this.verifyValue();
  }
  verifyValue() {
    if (hasValue(this.value)) {
      this.verified = verifyValue(this.value, this.type, this.verify);
    }
    else if (this.required) {
      this.verified = false;
    }
    else {
      this.verified = true;
    }
  }
}
class DmsAttribute {
  constructor(att, formatName, props) {
    Object.assign(this, att);
    this.name = this.name || prettyKey(this.key);
    this.format = props.registeredFormats[formatName];
    this.attributes = this.format.attributes.reduce((a, c) => {
      a[c.key] = makeNewAttribute(c, props);
      return a;
    }, {});
    if (this.required !== false) {
      this.required = Object.values(this.attributes).reduce((a, c) => a || c.required, false);
    }
    this.verified = false;
    this.value = null;
    this.Input = props => (
      <DmsInput { ...props } Attribute={ this } format={ this.format }/>
    )
  }
  setValue(value) {
    this.value = value;
    Object.values(this.attributes).forEach(att => att.setValue(get(value, att.key, null)));
    this.verifyValue();
  }
  verifyValue() {
    if (hasValue(this.value)) {
      this.verified = Object.values(this.attributes)
        .reduce((a, c) => a && c.verified, true);
    }
    else if (this.required) {
      this.verified = false;
    }
    else {
      this.verified = true;
    }
  }
}
const makeNewAttribute = (att, props) => {
  const match = /^dms-format:(.+)$/.exec(att.type);
  if (match) {
    const [, name] = match;
    return new DmsAttribute(att, name, props);
  }
  return new Attribute(att, props);
}

const getDomain = (att, props) => {
  if (att.domain) {
    if (typeof att.domain === "string") {
      return getValue(att.domain, { props }, null, []);
    }
    return att.domain;
  }
  return null;
}
const getInput = (att, props, disabled) => {
  const [type, array] = att.type.split("-"),
    domain = getDomain(att, props);

  switch (type) {
    case "textarea":
      return props => (
        <TextArea { ...props } id={ att.id }
          disabled={ disabled || att.editable === false }/>
      );
    case "img":
      return props => (
        <ImgInput { ...props } id={ att.id }
          disabled={ disabled || (att.editable === false) }/>
      );
    case "richtext":
      return props => (
        <Editor { ...props } id={ att.id }
          disabled={ disabled || (att.editable === false) }/>
      );
    default:
      if (array && domain) {
        return props => (
          <Select { ...props } multi={ true } domain={ domain } id={ att.id }
            disabled={ disabled || (att.editable === false) }/>
        );
      }
      if (domain) {
        return props => (
          <Select { ...props } multi={ false } domain={ domain } id={ att.id }
            disabled={ disabled || (att.editable === false) }/>
        );
      }
      if (array) {
        return props => (
          <ArrayInput { ...props } type={ type } id={ att.id }
            disabled={disabled || ( att.editable === false) }/>
        );
      }
      return props => (
        <Input { ...props } type={ type } id={ att.id }
          disabled={ disabled || (att.editable === false) }/>
        );
  }
}

export const useProcessValues = (sections, props) => {
  const Processed = newProcessed(),
    [Sections, setSections] = useState([]);

  const [section, setSection] = useState(0);
  const [values, _setValues] = useState({});

  useEffect(() => {
    if (!Sections.length) {
      const Sections = sections.map(({ title, attributes }, index) => ({
        index,
        title,
        isActive: false,
        verified: false,
        attributes: attributes.map(att => makeNewAttribute(att, props))
      }))
      setSections(Sections);
    }
  }, [Sections.length, sections, values, props]);

  const setValues = (key, value, callback) => {
    if (typeof key === "object") {
      _setValues(prev => ({ ...prev, ...key }));
    }
    else {
      _setValues(prev => ({ ...prev, [key]: value }));
    }
  }
  Processed.setValues = setValues;
  Processed.values = values;
  Processed.sections = Sections;

  if (Sections.length) {
    Sections.forEach((sect, index) => {
      sect.isActive = section === index;
      sect.verified = false;
      sect.attributes.forEach(att => {
        att.setValue(values[att.key]);
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
  const attributes = get(props, ["format", "attributes"], [])
    .reduce((a, c) => { a[c.key] = c; return a; }, {});
  Processed.badAttributes = [];
  for (const att in values) {
    if (!(att in attributes) && hasValue(values[att])) {
      Processed.badAttributes.push({
        key: att,
        value: JSON.stringify(values[att])
      });
    }
  }
  Processed.formatAttributes = get(props, ["format", "attributes"], []);
  Processed.mapOldToNew = (oldKey, newKey) => {
    setValues(newKey, values[oldKey]);
    setValues(oldKey, null);
  };
  Processed.deleteOld = oldKey => setValues(oldKey, null);

  return Processed;
}

export const dmsCreate = Component => {
  return ({ ...props }) => {
    const sections = useSetSections(props.format);

    const Processed = useProcessValues(sections, props);
    Processed.dmsAction = {
      action: "api:create",
      seedProps: () => Processed.values,
      isDisabled: !Processed.verified
    }

    const [init, setInit] = useState(false);
    useEffect(() => {
      if (!init) {
        const values = {},
          attributes = get(props.format, "attributes", []);

        let hasDefaults = 0;

        attributes.forEach(att => {
          if (att.default) {
            ++hasDefaults;
            const value = getValue(att.default, { props });
            hasValue(value) && (values[att.key] = value);
          }
        })
        if (Object.keys(values).length === hasDefaults) {
          Processed.setValues(values);
          setInit(true);
        }
      }
    }, [init, props, Processed]);
    return (
      <Component { ...props } createState={ Processed }
        values={ Processed.values } setValues={ Processed.setValues }/>
    )
  }
}


export const dmsEdit = Component => {
  return props => {
    const sections = useSetSections(props.format);

    const data = get(props, [props.type, "data"], null);

    const Processed = useProcessValues(sections, props);
    Processed.dmsAction = {
      action: "api:edit",
      seedProps: () => Processed.values,
      isDisabled: !Processed.verified || !hasBeenUpdated(data, Processed.values)
    }

    const [init, setInit] = useState(false);
    useEffect(() => {
      if (!init) {
        if (data) {
          Processed.setValues(data);
          setInit(true);
        }
      }
    }, [init, data, Processed])
    return (
      <Component { ...props } createState={ Processed }
        values={ Processed.values } setValues={ Processed.setValues }/>
    )
  }
}
