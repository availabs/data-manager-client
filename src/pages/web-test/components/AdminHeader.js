import React from "react"

import { HeaderComponent, Input, LinkButton } from "@availabs/avl-components"
import { DmsButton } from "components/dms/components/dms-button"
import { useMakeOnClick } from "components/dms/wrappers/dms-provider"

const AdminHeader = ({ dataItems, top }) => {
  const [page, setPage] = React.useState("");
  return (
    <div className="fixed ml-56 top-0 left-0 right-0">
      <HeaderComponent title="Website Dev">
        { top.dmsAction === "list" ?
          <>
            <Input type="text" value={ page } onChange={ setPage }/>
            <DmsButton label="Add New Page"
              className="whitespace-nowrap ml-2"
              action={ {
                disabled: !page,
                action: "api:create",
                seedProps: {
                  page,
                  index: dataItems.reduce((a, c) => Math.max(a, +c.data.index), -1) + 1
                }
              } }/>
          </> :
          <>
            <DmsButton action="dms:back"/>
            <DmsButton className="ml-1" action="dms:home"/>
          </>
        }
      </HeaderComponent>
    </div>
  )
}
export default AdminHeader;
