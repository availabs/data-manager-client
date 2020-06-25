import React from "react"

import {
  useSetSections
} from "../wrappers/dms-create"

import { prettyKey } from "../utils"

const useProcessValuesNew = (sections, Attributes, props) => {
  const Sections = sections.map(({ title, attributes }, index) => ({
    index,
    title,
    isActive: false,
    verified: false,
    attributes: attributes.map(att => Attributes[att.key])
  }))
  return Sections;
}

export default ({ format, att, onChange, value, ...props }) => {
  const sections = useSetSections(format),
    Sections = useProcessValuesNew(sections, att.attributes, props);

  return (
    <div>
      { Sections.map(section =>
          <div key={ section.index } className="border-2 rounded p-3">
            <div className="text-lg font-semibold">{ section.title }</div>
            { section.attributes.map(({ Input, key, name, value: Value, ...att }) =>
                <div key={ key } className={`border-l-4 pl-2 pb-2 mb-2 last:mb-0
                  ${ att.required ? att.verified ? "border-green-400" : "border-red-400" : "border-current" }
                `}>
                  <label>{ name || prettyKey(key) }</label>
                  <Input onChange={ v => onChange({ ...value, [key]: v }) } value={ Value }/>
                </div>
              )
            }
          </div>
        )
      }
    </div>
  )
}
