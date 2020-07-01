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

  const dmsMsg = useMessenger();

  const [section, setSection] = useState(0);
  const [values, _setValues] = useState({});

  const [DmsCreateState] = useState(new DmsCreateStateClass(_setValues, dmsMsg)),
    [Sections, setSections] = useState([]);

  const { attributeMessages } = dmsMsg;

  useEffect(() => {
    if (!Sections.length) {
      const Sections = sections.map(({ title, attributes }, index) => ({
        index,
        title,
        isActive: false,
        verified: false,
        attributes: attributes.map(att => makeNewAttribute(att, props, DmsCreateState, dmsMsg))
      }))
      setSections(Sections);
      DmsCreateState.sections = Sections;
      DmsCreateState.numSections = Sections.length;
    }
  }, [DmsCreateState, Sections.length, sections, values, props, dmsMsg]);

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
      const msgIds = sect.attributes.reduce((a, c) => a.concat(c.getWarnings()), []);
      sect.warnings = attributeMessages.filter(({ id }) => msgIds.includes(id));
      sect.hasWarning = Boolean(sect.warnings.length);
    })
    DmsCreateState.verified = Sections.reduce((a, c) => a && c.verified, true);
    DmsCreateState.warnings = Sections.reduce((a, c) => a.concat(c.warnings), []);
    DmsCreateState.hasWarning = Boolean(DmsCreateState.warnings.length);

    DmsCreateState.activeSection = Sections[section];
    DmsCreateState.activeIndex = section;

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

  DmsCreateState.formatAttributes = get(props, ["format", "attributes"], []);
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
    const sections = useSetSections(props.format);

    const DmsCreateState = useProcessValues(sections, props);
    DmsCreateState.dmsAction = {
      action: "api:create",
      seedProps: () => DmsCreateState.values,
      isDisabled: DmsCreateState.hasWarning || !DmsCreateState.verified,
      then: () => {
        DmsCreateState.sections.forEach(section => {
          section.attributes.forEach(att => att.cleanup());
        })
      }
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

    const DmsCreateState = useProcessValues(sections, props),
      updated = hasBeenUpdated(data, DmsCreateState.values);

    useEffect(() => {
      if (updated) {
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
