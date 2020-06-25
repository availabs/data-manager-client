import React from "react"

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

export default ({ format, Attribute, onChange, id, value = {}, ...props }) => {
  const sections = useSetSections(format),
    Sections = useCreateSections(sections, Attribute.attributes);

  return (
    <div>
      { Sections.map(section =>
          <div key={ section.index } className="border-2 rounded p-3">
            <div className="text-lg font-semibold">{ section.title }</div>
            { section.attributes.map(({ Input, key, ...att }) =>
                <div key={ key } className={`border-l-4 pl-2 pb-2 mb-2 last:mb-0
                  ${ att.required ? att.verified ? "border-green-400" : "border-red-400" : "border-current" }
                `}>
                  <label htmlFor={ att.id }>{ att.name }</label>
                  <Input onChange={ v => onChange({ ...value, [key]: v }) } value={ value[key] }/>
                </div>
              )
            }
          </div>
        )
      }
    </div>
  )
}
