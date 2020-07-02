import React from "react"

import { Input, TextArea, ArrayInput, Select, ObjectInput } from "components/avl-components/components/Inputs"
import Editor from "../../components/editor"
import ImgInput from "../../components/img-input"
import DmsInput from "../../components/dms-input"

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

    this.canGoNext = false;
    this.next = () => {};

    this.canGoPrev = false;
    this.prev = () => {};

    this.sections = [];
    this.formatAttributes = []

    this.setValues = (key, value) => {
      setValues(prev => ({ ...prev, [key]: value }));
    }
    this.ininitialized = false;
    this.initValues = values => {
      this.formatAttributes.forEach(att => {
        att.setValue(values[att.key]);
      });
      setValues(prev => ({ ...prev, ...values }));
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
  constructor(att, setValues, dmsMsg, props) {
    Object.assign(this, att);
    this.name = this.name || prettyKey(this.key);
    this.verified = false;
    this.value = null;
    this.Input = getInput(this, props);

    this.onChange = value => {
      this.setValue(value);
      setValues(this.key, value);
    };

    this.msgIds = {};
    this.hasWarning = false;
    this.setWarning = (type, warning) => {
      if (warning && !(type in this.msgIds)) {
        const msgId = dmsMsg.newMsgId();
        this.msgIds[type] = msgId;
        dmsMsg.sendAttributeMessage({ msg: warning, id: msgId });
      }
      else if (type in this.msgIds) {
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
  }
  getWarnings = () => Object.values(this.msgIds);
  setValue(value) {
    this.value = value;
    this.verifyValue();
    if (!this.verified) {
      this.setWarning("bad-data", `Invalid value for attribute: ${ this.name }.`);
    }
    else {
      this.setWarning("bad-data", null);
    }
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
  onSave = () => {
    if (this.type === "richtext" && window.localStorage) {
      window.localStorage.removeItem("saved-editor-state-" + this.id);
    }
  }
}
class DmsAttribute {
  constructor(att, setValues, dmsMsg, props, formatName) {
    Object.assign(this, att);
    this.name = this.name || prettyKey(this.key);
    this.format = props.registeredFormats[formatName];

    this.onChange = (key, value) => {
      this.value = { ...this.value, [key]: value };
      this.verifyValue();
      setValues(this.key, this.value);
    }
    this.attributes = this.format.attributes.reduce((a, c) => {
      a[c.key] = makeNewAttribute(c, this.onChange, dmsMsg, props);
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

    this.getWarnings = () => Object.values(this.attributes)
      .reduce((a, c) => a.concat(c.getWarnings()), []);
  }
  cleanup = () => {
    Object.values(this.attributes).forEach(att => att.cleanup());
  }
  onSave = () => {
    Object.values(this.attributes).forEach(att => att.onSave());
  }
  setValue(value) {
    this.value = value;
    Object.values(this.attributes).forEach(att => att.setValue(get(value, att.key)));
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
export const makeNewAttribute = (att, setValues, dmsMsg, props) => {
  const match = /^dms-format:(.+)$/.exec(att.type);
  if (match) {
    const [, name] = match;
    return new DmsAttribute(att, setValues, dmsMsg, props, name);
  }
  return new Attribute(att, setValues, dmsMsg, props);
}
