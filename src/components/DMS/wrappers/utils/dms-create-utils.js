import React from "react"

import { Input, TextArea, ArrayInput, Select, ObjectInput } from "components/avl-components/components/Inputs"
import Editor from "../../components/editor"
import ImgInput from "../../components/img-input"
import DmsInput from "../../components/dms-input"

import get from "lodash.get"

import { verifyValue, hasValue } from "components/avl-components/components/Inputs/utils"
import { getValue, prettyKey } from "../../utils"

export class DmsCreateStateClass {
  constructor(_setValues, dmsMsg) {
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
  constructor(att, DmsCreateState, dmsMsg, props) {
    Object.assign(this, att);
    this.name = this.name || prettyKey(this.key);
    this.verified = false;
    this.value = null;
    this.Input = getInput(this, props);

    this.onChange = value => DmsCreateState.setValues(this.key, value);

    this.msgIds = {};
    this.setWarning = (type, warning) => {
      if (warning) {
        const msgId = dmsMsg.newMsgId();
        this.msgIds[type] = msgId;
        dmsMsg.sendAttributeMessage({ msg: warning, id: msgId });
      }
      else if (type in this.msgIds) {
        const msgId = this.msgIds[type];
        dmsMsg.removeAttributeMessage([msgId]);
      }
    }
    this.getWarnings = () => Object.values(this.msgIds);
    this.cleanup = () => {
      if (this.type === "richtext" && window.localStorage) {
        window.localStorage.removeItem("saved-editor-state-" + this.id);
      }
      const msgIds = Object.values(this.msgIds);
      if (msgIds.length) {
        dmsMsg.removeAttributeMessage(msgIds);
      }
    }
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
  constructor(att, DmsCreateState, dmsMsg, props, formatName) {
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

    this.getWarnings = () => Object.values(this.attributes)
      .reduce((a, c) => a.concat(c.getWarnings()), []);
  }
  cleanup = () => {
    Object.values(this.attributes).forEach(att => att.cleanup());
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
export const makeNewAttribute = (att, props, DmsCreateState, dmsMsg) => {
  const match = /^dms-format:(.+)$/.exec(att.type);
  if (match) {
    const [, name] = match;
    return new DmsAttribute(att, DmsCreateState, dmsMsg, props, name);
  }
  return new Attribute(att, DmsCreateState, dmsMsg, props);
}
