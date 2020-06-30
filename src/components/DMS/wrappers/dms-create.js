import React, { useState, useEffect } from "react"

import { Input, TextArea, ArrayInput, Select, ObjectInput } from "components/avl-components/components/Inputs"
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

class DmsCreateStateClass {
  constructor(_setValues) {
    this.numSections = 0;
    this.activeSection = null;
    this.activeIndex = -1;

    this.verified = false;
    this.hasWarning = false;
    this.warnings = [];

    this.values = {};

    this.canGoNext = false;
    this.next = () => {};

    this.canGoPrev = false;
    this.prev = () => {};

    this.sections = [];

    this.setValues = (key, value) => {
      if (typeof key === "object") {
        _setValues(prev => ({ ...prev, ...key }));
      }
      else {
        _setValues(prev => ({ ...prev, [key]: value }));
      }
    }
  }
  mapOldToNew = (oldKey, newKey) => {
    this.setValues(newKey, this.values[oldKey]);
    this.setValues(oldKey, null);
  };
  deleteOld = oldKey => this.setValues(oldKey, null);
}

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
  const { type, isArray } = att,
    domain = getDomain(att, props);

  switch (type) {
    case "textarea":
      return props => (
        <TextArea { ...props } id={ att.id }
          disabled={ disabled || att.editable === false }/>
      );
    case "img":
      return props => (
        <ImgInput { ...props } id={ att.id } Attribute={ att }
          disabled={ disabled || (att.editable === false) }/>
      );
    case "richtext":
      return props => (
        <Editor { ...props } id={ att.id }
          disabled={ disabled || (att.editable === false) }/>
      );
    case "object":
      return props => (
        <ObjectInput { ...props } id={ att.id }
          disabled={ disabled || (att.editable === false) }/>
      )
    default:
      if (isArray && domain) {
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
      if (isArray) {
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

class Attribute {
  constructor(att, DmsCreateState, props) {
    Object.assign(this, att);
    this.name = this.name || prettyKey(this.key);
    this.verified = false;
    this.value = null;
    this.Input = getInput(this, props);
    this.warning = null;

    this.onChange = value => DmsCreateState.setValues(this.key, value);
  }
  cleanup = () => {
    if (this.type === "richtext" && window.localStorage) {
      window.localStorage.removeItem("saved-editor-state-" + this.id);
    }
  }
  setWarning(warning) {
    this.warning = warning;
  }
  getWarning() {
    return this.warning;
  }
  setValue(v) {
    this.value = v;
    this.verifyValue();
  }
  verifyValue() {
    if (hasValue(this.value)) {
      this.verified = !this.warning && verifyValue(this.value, this.type, this.verify);
    }
    else if (this.required) {
      this.verified = false;
    }
    else {
      this.verified = !this.warning;
    }
  }
}
class DmsAttribute {
  constructor(att, DmsCreateState, formatName, props) {
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
      <DmsInput { ...props } Attribute={ this } id={ this.id } format={ this.format }/>
    )

    this.onChange = value => DmsCreateState.setValues(this.key, value);
  }
  cleanup = () => {
    Object.values(this.attributes).forEach(att => att.cleanup());
  }
  getWarning() {
    return Object.values(this.attributes).reduce((a, c) => {
      const warning = c.getWarning();
      return Boolean(warning) ? a.concat(warning) : a;
    }, []);
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
const makeNewAttribute = (att, props, DmsCreateState) => {
  const match = /^dms-format:(.+)$/.exec(att.type);
  if (match) {
    const [, name] = match;
    return new DmsAttribute(att, DmsCreateState, name, props);
  }
  return new Attribute(att, DmsCreateState, props);
}

export const useProcessValues = (sections, props) => {

  const [section, setSection] = useState(0);
  const [values, _setValues] = useState({});

  const [DmsCreateState] = useState(new DmsCreateStateClass(_setValues)),
    [Sections, setSections] = useState([]);

  useEffect(() => {
    if (!Sections.length) {
      const Sections = sections.map(({ title, attributes }, index) => ({
        index,
        title,
        isActive: false,
        verified: false,
        hasWarning: false,
        wanrings: [],
        attributes: attributes.map(att => makeNewAttribute(att, props, DmsCreateState))
      }))
      setSections(Sections);
      DmsCreateState.sections = Sections;
    }
  }, [Sections.length, sections, values, props]);

  DmsCreateState.values = {};
  for (const key in values) {
    if (hasValue(values[key])) {
      DmsCreateState.values[key] = values[key];
    }
  }

  if (Sections.length) {
    Sections.forEach((sect, index) => {
      sect.isActive = section === index;
      sect.verified = false;
      sect.attributes.forEach(att => {
        att.setValue(values[att.key]);
      })
      sect.verified = sect.attributes.reduce((a, c) => a && c.verified, true);
      sect.warnings = sect.attributes.reduce((a, c) => {
        const warning = c.getWarning();
        return Boolean(warning) ? a.concat(warning) : a;
      }, [])
      sect.hasWarning = Boolean(sect.warnings.length);
    })
    DmsCreateState.verified = Sections.reduce((a, c) => a && c.verified, true);
    DmsCreateState.warnings = Sections.reduce((a, c) => [...a, ...c.warnings], []);
    DmsCreateState.hasWarning = Boolean(DmsCreateState.warnings.length);

    DmsCreateState.activeSection = Sections[section];
    DmsCreateState.activeIndex = section;
    DmsCreateState.numSections = Sections.length;
    DmsCreateState.canGoNext = !DmsCreateState.hasWarning && ((section + 1) < Sections.length) && Sections[section].verified;
    DmsCreateState.next = () => {
      if (!Sections[section].verified) return;
      if ((section + 1) === Sections.length) return;
      setSection(section + 1);
    };
    DmsCreateState.canGoPrev = !DmsCreateState.hasWarning && section > 0;
    DmsCreateState.prev = () => {
      if (section === 0) return;
      setSection(section - 1);
    };
  }
  const attributes = get(props, ["format", "attributes"], [])
    .reduce((a, c) => { a[c.key] = c; return a; }, {});
  DmsCreateState.badAttributes = [];
  for (const att in values) {
    if (!(att in attributes) && hasValue(values[att])) {
      DmsCreateState.badAttributes.push({
        key: att,
        value: JSON.stringify(values[att])
      });
    }
  }
  DmsCreateState.formatAttributes = get(props, ["format", "attributes"], []);

  return DmsCreateState;
}

export const dmsCreate = Component => {
  return ({ ...props }) => {
    const sections = useSetSections(props.format);

    const DmsCreateState = useProcessValues(sections, props);
    DmsCreateState.dmsAction = {
      action: "api:create",
      seedProps: () => DmsCreateState.values,
      isDisabled: !DmsCreateState.verified,
      then: () => {
        DmsCreateState.sections.forEach(section => {
          section.attributes.forEach(att => att.cleanup());
        })
      }
    }

    useEffect(() => {
      const values = {},
        attributes = get(props.format, "attributes", []);

      attributes.forEach(att => {
        if (att.default && !(att.key in DmsCreateState.values)) {
          const value = getValue(att.default, { props });
          hasValue(value) && (values[att.key] = value);
        }
      })
      if (Object.keys(values).length) {
        DmsCreateState.setValues(values);
      }
    });

    if (!DmsCreateState.activeSection) return null;
    return (
      <Component { ...props } createState={ DmsCreateState }
        values={ DmsCreateState.values } setValues={ DmsCreateState.setValues }/>
    )
  }
}


export const dmsEdit = Component => {
  return props => {
    const sections = useSetSections(props.format);

    const data = get(props, [props.type, "data"], null);

    const DmsCreateState = useProcessValues(sections, props);
    DmsCreateState.dmsAction = {
      action: "api:edit",
      seedProps: () => DmsCreateState.values,
      isDisabled: !DmsCreateState.verified || !hasBeenUpdated(data, DmsCreateState.values),
      then: () => {
        DmsCreateState.sections.forEach(section => {
          section.attributes.forEach(att => att.cleanup());
        })
      }
    }

    const [init, setInit] = useState(false);
    useEffect(() => {
      if (!init) {
        if (data) {
          DmsCreateState.setValues(data);
          setInit(true);
        }
      }
    }, [init, data, DmsCreateState]);

    if (!DmsCreateState.activeSection) return null;
    return (
      <Component { ...props } createState={ DmsCreateState }
        values={ DmsCreateState.values } setValues={ DmsCreateState.setValues }/>
    )
  }
}
