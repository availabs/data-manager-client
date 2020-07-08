import React from "react"

import { Input, TextArea, Select, ObjectInput } from "components/avl-components/components/Inputs"
import Editor from "../../components/editor"
import ImgInput from "../../components/img-input"
import DmsInput from "../../components/dms-input"
import ArrayInput from "../../components/array-input"

import get from "lodash.get"

import { verifyValue, hasValue } from "components/avl-components/components/Inputs/utils"
import { getValue, prettyKey } from "../../utils"

export class DmsCreateStateClass {
  constructor(setValues, dmsMsg) {
    this.numSections = 0;
    this.activeSection = null;
    this.activeIndex = -1;

    this.verified = false;
    this.hasWarning = false;
    this.warnings = [];

    this.values = {};
    this.hasValues = false;

    this.canGoNext = false;
    this.next = () => {};

    this.canGoPrev = false;
    this.prev = () => {};

    this.sections = [];
    this.formatAttributes = []

    this.setValues = (key, value) => {
      setValues(prev => {
        const newValues = { ...prev, [key]: value };
        if (!hasValue(value)) {
          delete newValues[key];
        }
        return newValues;
      });
    }
    this.ininitialized = false;
    this.initValues = values => {
      this.formatAttributes.forEach(att => att.onChange(values[att.key]));
    }

    this.msgIds = {};
    this.setWarning = (type, warning) => {
      if (warning) {
        const msgId = dmsMsg.newMsgId();
        this.msgIds[type] = msgId;
        dmsMsg.sendPageMessage({ msg: warning, id: msgId });
      }
      else if (type in this.msgIds) {
        const msgId = this.msgIds[type];
        dmsMsg.removePageMessage([msgId]);
      }
    }
    this.cleanup = () => {
      const msgIds = Object.values(this.msgIds);
      if (msgIds.length) {
        dmsMsg.removePageMessage(msgIds);
      }
      this.sections.forEach(section =>
        section.attributes.forEach(att => att.cleanup())
      );
    }
  }
  onSave = () => {
    this.sections.forEach(section =>
      section.attributes.forEach(att => att.onSave())
    );
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
    default:
      InputComp = Input;
      inputProps = { type };
      break;
  }
  if (isArray) {
    return props => (
      <ArrayInput Input={ InputComp } id={ att.id }
        { ...props } inputProps={ inputProps } verifyValue={ att.verifyValue }
        disabled={ disabled || (att.editable === false) }/>
    )
  }
  return props => (
    <InputComp id={ att.id } { ...inputProps } { ...props }
      disabled={ disabled || (att.editable === false) }/>
  )
}

class Attribute {
  constructor(att, setValues, dmsMsg, props) {
    Object.assign(this, att);
    this.name = this.name || prettyKey(this.key);
    this.Input = getInput(this, props);

    this.value = this.isArray ? [] : null;
    this.hasValue = false;
    this.verified = !this.required;

    this.onChange = value => {
      this.value = value;
      this.hasValue = hasValue(value);
      this.verified = this.verifyValue(value);
      if (!this.verified) {
        if (!this.hasValue && this.required) {
          this.setWarning("missing-data", `Missing value for required attribute: ${ this.name }.`);
          this.setWarning("invalid-data", null);
        }
        else {
          this.setWarning("invalid-data", `Invalid value for attribute: ${ this.name }.`);
          this.setWarning("missing-data", null);
        }
      }
      else {
        this.setWarning("invalid-data", null);
        this.setWarning("missing-data", null);
      }
      setValues(this.key, value);
    }

    this.msgIds = {};
    this.hasWarning = false;
    this.setWarning = (type, warning) => {
      if (warning && !(type in this.msgIds)) {
        const msgId = dmsMsg.newMsgId();
        this.msgIds[type] = msgId;
        if (typeof warning === "string") {
          warning = { msg: warning };
        }
        dmsMsg.sendAttributeMessage({ ...warning, id: msgId });
      }
      else if (!warning && (type in this.msgIds)) {
        const msgId = this.msgIds[type];
        dmsMsg.removeAttributeMessage([msgId]);
        delete this.msgIds[type];
      }
      this.hasWarning = Boolean(this.getWarnings().length);
    }
    this.cleanup = () => {
      const msgIds = Object.values(this.msgIds);
      if (msgIds.length) {
        dmsMsg.removeAttributeMessage(msgIds);
      }
    }
    this.onSave = () => {
      if (this.type === "richtext" && window.localStorage) {
        const itemId = get(props, ["item", "id"], "");
        window.localStorage.removeItem(`saved-editor-state-${ this.id }-${ itemId }`);
      }
    }
  }
  getWarnings = () => Object.values(this.msgIds);

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

export const isRequired = attributes => {
  return attributes.reduce((a, c) => {
    if (c.type === "dms-format") {
      return a || isRequired(c.attributes);
    }
    return a || c.required;
  }, false)
}

export const getAttributes = (format, formats) => {
  const attributes = [];
  format.attributes.forEach(att => {
    const Att = Object.assign({}, att);
    Att.name = att.name || prettyKey(att.key);
    if (Att.type === "dms-format") {
      Att.attributes = getAttributes(formats[Att.format], formats);
    }
    attributes.push(Att);
  })
  return attributes;
}

class DmsAttribute {
  constructor(att, setValues, dmsMsg, props) {
    Object.assign(this, att);
    this.name = this.name || prettyKey(this.key);
    this.Format = JSON.parse(JSON.stringify(props.registeredFormats[att.format]));

    this.attributes = getAttributes(this.Format, props.registeredFormats);

    this.value = this.isArray ? [] : null;
    this.hasValue = false;
    this.required = this.isArray ? this.required : isRequired(this.attributes);
    this.verified = !this.required;

    this.onChange = value => {
      this.value = value;
      this.hasValue = hasValue(value);
      this.verified = this.verifyValue(value);
      this.sendWarnings(value);
      setValues(this.key, value);
    }

    this.msgIds = {};
    this.hasWarning = false;
    this.setWarning = (type, warning) => {
      if (warning && !(type in this.msgIds)) {
        const msgId = dmsMsg.newMsgId();
        this.msgIds[type] = msgId;
        if (typeof warning === "string") {
          warning = { msg: warning };
        }
        dmsMsg.sendAttributeMessage({ ...warning, id: msgId });
      }
      else if (!warning && (type in this.msgIds)) {
        const msgId = this.msgIds[type];
        dmsMsg.removeAttributeMessage([msgId]);
        delete this.msgIds[type];
      }
      this.hasWarning = Boolean(this.getWarnings().length);
    }
    this.cleanup = () => {
      const msgIds = Object.values(this.msgIds);
      if (msgIds.length) {
        dmsMsg.removeAttributeMessage(msgIds);
      }
    }

    if (this.isArray) {
      this.Input = others => (
        <ArrayInput { ...others } verifyValue={ this.verifyValue } id={ this.id }
          Input={ DmsInput } inputProps={ { Attribute: this } }/>
      )
    }
    else {
      this.Input = others => (
        <DmsInput { ...others } Attribute={ this } id={ this.id }/>
      )
    }
  }
  getWarnings = () => Object.values(this.msgIds);
  cleanup = () => {

  }
  onSave = () => {

  }
  sendWarnings = (value, attributes = this.attributes) => {
    if (this.isArray) {
      if (this.required && !hasValue(value)) {
        this.setWarning(`missing-data-${ this.key }`, `Missing value for required attribute: ${ this.name }.`);
      }
      else {
        this.setWarning(`missing-data-${ this.key }`, null);
      }
      return;
    }
    attributes.forEach(att => {
      const Value = get(value, att.key),
        _hasValue = hasValue(Value);

      if (att.type === "dms-format") {
        this.sendWarnings(Value, att.attributes);
        return;
      }
      if (!_hasValue && att.required) {
        this.setWarning(`missing-data-${ att.key }`, `Missing value for required attribute: ${ att.name }.`);
      }
      else if (_hasValue) {
        this.setWarning(`missing-data-${ att.key }`, null);
        if (!verifyValue(Value, att.type, att.verify)) {
          this.setWarning(`invalid-data-${ att.key }`, `Invalid value for attribute: ${ att.name }.`);
        }
        else {
          this.setWarning(`invalid-data-${ att.key }`, null);
        }
      }
    })
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
export const makeNewAttribute = (att, setValues, dmsMsg, props) => {
  if (att.type === "dms-format") {
    return new DmsAttribute(att, setValues, dmsMsg, props);
  }
  return new Attribute(att, setValues, dmsMsg, props);
}
