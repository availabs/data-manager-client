import React, { useState, useEffect } from "react"

import get from "lodash.get"

import { hasValue } from "components/avl-components/components/Inputs/utils"
import { hasBeenUpdated, getValue } from "../utils"
import { DmsCreateStateClass, makeNewAttribute } from "./utils/dms-create-utils"

import { useMessenger } from "../contexts/messenger-context"

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

const useProcessValues = (sections, props) => {

  const dmsMsg = useMessenger(),
    { attributeMessages } = dmsMsg;

  const [section, setSection] = useState(0);
  const [values, setValues] = useState({});

  const [DmsCreateState] = useState(new DmsCreateStateClass(setValues, dmsMsg)),
    [Sections, setSections] = useState([]);

  useEffect(() => {
    return DmsCreateState.cleanup;
  }, [DmsCreateState])

  useEffect(() => {
    if (!Sections.length && sections.length) {
      const Sections = sections.map(({ title, attributes }, index) => ({
        index,
        title,
        isActive: false,
        verified: false,
        attributes: attributes.map(att => makeNewAttribute(att, DmsCreateState.setValues, dmsMsg, props))
      }))
      setSections(Sections);
      DmsCreateState.sections = Sections;
      DmsCreateState.numSections = Sections.length;
      DmsCreateState.formatAttributes = Sections.reduce((a, c) => a.concat(c.attributes), []);
    }
  }, [DmsCreateState, Sections.length, sections, props, dmsMsg]);

  DmsCreateState.values = {};
  for (const key in values) {
    if (hasValue(values[key])) {
      DmsCreateState.values[key] = values[key];
    }
  }

  if (Sections.length) {
    Sections.forEach((sect, index) => {
      sect.isActive = section === index;
      sect.verified = sect.attributes.reduce((a, c) => a && c.verified, true);
      const msgIds = sect.attributes.reduce((a, c) => a.concat(c.getWarnings()), []);
      sect.warnings = attributeMessages.filter(({ id }) => msgIds.includes(id));
      sect.hasWarning = Boolean(sect.warnings.length);
    })
    DmsCreateState.verified = Sections.reduce((a, c) => a && c.verified, true);
    DmsCreateState.warnings = Sections.reduce((a, c) => a.concat(c.warnings), []);

    DmsCreateState.activeSection = Sections[section];
    DmsCreateState.activeIndex = section;

    DmsCreateState.hasWarning = Sections[section].hasWarning;

    DmsCreateState.canGoNext = !DmsCreateState.hasWarning &&
      Sections[section].verified && ((section + 1) < Sections.length);
    DmsCreateState.next = () => {
      if (DmsCreateState.hasWarning) return;
      if (!Sections[section].verified) return;
      if ((section + 1) === Sections.length) return;
      setSection(section + 1);
    };
    DmsCreateState.canGoPrev = !DmsCreateState.hasWarning && (section > 0);
    DmsCreateState.prev = () => {
      if (DmsCreateState.hasWarning) return;
      if (section === 0) return;
      setSection(section - 1);
    };
  }

  const attributeMap = DmsCreateState.formatAttributes
    .reduce((a, c) => { a[c.key] = c; return a; }, {});
  DmsCreateState.badAttributes = [];
  for (const att in values) {
    if (!(att in attributeMap) && hasValue(values[att])) {
      DmsCreateState.badAttributes.push({
        key: att,
        value: JSON.stringify(values[att])
      });
    }
  }

  return DmsCreateState;
}

export const dmsCreate = Component => {
  return ({ ...props }) => {
    const sections = useSetSections(props.format),
      DmsCreateState = useProcessValues(sections, props);

    useEffect(() => {
      if (DmsCreateState.verified && Object.values(DmsCreateState.values).length) {
        DmsCreateState.setWarning("unsaved", "You have unsaved data!!!");
      }
      else {
        DmsCreateState.setWarning("unsaved", null);
      }
    }, [DmsCreateState.verified, DmsCreateState]);

    DmsCreateState.dmsAction = {
      action: "api:create",
      seedProps: () => DmsCreateState.values,
      isDisabled: DmsCreateState.hasWarning || !DmsCreateState.verified,
      then: DmsCreateState.onSave
    }

    useEffect(() => {
      const values = {};

      DmsCreateState.formatAttributes.forEach(att => {
        if (att.default && !(att.key in DmsCreateState.values)) {
          const value = getValue(att.default, { props });
          hasValue(value) && (values[att.key] = value);
        }
      })
      if (Object.keys(values).length) {
        DmsCreateState.initValues(values);
      }
    });

    if (!DmsCreateState.activeSection) return null;
    return (
      <Component { ...props } createState={ DmsCreateState } values={ DmsCreateState.values }/>
    )
  }
}


export const dmsEdit = Component => {
  return ({ item, ...props }) => {

    const [data, setData] = useState(null);
    useEffect(() => {
      setData(get(item, "data", null));
    }, [item]);

    const sections = useSetSections(props.format),
      DmsCreateState = useProcessValues(sections, props),
      updated = hasBeenUpdated(data, DmsCreateState.values);

    useEffect(() => {
      if (updated && DmsCreateState.verified) {
        DmsCreateState.setWarning("unsaved", "You have unsaved edits!!!");
      }
      else {
        DmsCreateState.setWarning("unsaved", null);
      }
    }, [DmsCreateState, updated]);

    DmsCreateState.dmsAction = {
      action: "api:edit",
      seedProps: () => DmsCreateState.values,
      isDisabled:  DmsCreateState.hasWarning || !DmsCreateState.verified || !updated,
      then: DmsCreateState.onSave
    }

    useEffect(() => {
      if (!DmsCreateState.initialized && Boolean(data)) {
        DmsCreateState.initValues(data);
        DmsCreateState.initialized = true;
      }
    }, [data, DmsCreateState]);

    if (!DmsCreateState.activeSection) return null;
    return (
      <Component { ...props } item={ item }
        createState={ DmsCreateState } values={ DmsCreateState.values }/>
    )
  }
}
