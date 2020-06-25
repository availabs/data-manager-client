import React from "react"

import { Button } from "components/avl-components/components/Button"
import Select from "components/avl-components/components/Inputs/select"

import { DmsButton } from "./dms-button"

import { dmsCreate, dmsEdit } from "../wrappers/dms-create"
import DmsWizard from "./dms-wizard"

const BadAttributeRow = ({ oldKey, value, formatAttributes, deleteOld, mapOldToNew, ...props }) => {
  const [newAtt, setNewAtt] = React.useState(null);
  return (
    <div className="max-w-xl border-2 p-3 rounded-md mt-2">
      <div className="rounded border p-3">
        <div className="w-full flex">
          <div className="flex-1 mb-2">
            <div className="font-bold">
              Attribute
            </div>
            <div>
              { oldKey }
            </div>
          </div>
          <div className="flex-1">
            <div className="font-bold">
              Value
            </div>
            <div>
              { value }
            </div>
          </div>
        </div>
        <Button onClick={ e => deleteOld(oldKey) } className="w-full">
          Remove Old Attribute
        </Button>
      </div>
      <div className="rounded border p-3 mt-3">
        <Select domain={ formatAttributes }
          multi={ false }
          searchable={ false }
          onChange={ setNewAtt }
          accessor={ d => d.key }
          placeholder="Select an attribute..."
          value={ newAtt }/>
        <Button disabled={ !newAtt } className="w-full mt-2"
          onClick={ e => mapOldToNew(oldKey, newAtt.key) }>
          Map Old Attribute { newAtt ? `to ${ newAtt.key }` : "to..." }
        </Button>
      </div>
    </div>
  )
}
export const DmsCreateBase = ({ createState, setValues, item, ...props }) => {
  if (!createState.activeSection) return null;
  return (
    <div>
      <DmsWizard { ...createState }>
        <form onSubmit={ e => e.preventDefault() }>
          <div className="mt-2 mb-4">
            <DmsButton className="w-full max-w-xs" large  type="submit"
              action={ createState.dmsAction } item={ item } props={ props }/>
          </div>
          <div className="w-full flex flex-col justify-center">
            { createState.activeSection.attributes
              .map(({ Input, key, ...att }, i) => (
                  <div key={ key }
                    className={ `
                      border-l-4 pl-2 mb-2 ${ att.type === "richtext" ? "" : "max-w-2xl" } pb-2
                      ${ att.required ? att.verified ? "border-green-400" : "border-red-400" : "border-current" }
                    ` }>
                    <label htmlFor={ att.id }>{ att.name }</label>
                    <Input autoFocus={ i === 0 } value={ att.value }
                      onChange={ v => setValues(key, v) }/>
                  </div>
                )
              )
            }
          </div>
        </form>
      </DmsWizard>
      <div>
        { createState.badAttributes.map(att =>
          <BadAttributeRow { ...att } oldKey={ att.key }
            { ...createState }/>
        ) }
      </div>
    </div>
  );
}
export const DmsCreate = dmsCreate(DmsCreateBase);
export const DmsEdit = dmsEdit(DmsCreateBase);
