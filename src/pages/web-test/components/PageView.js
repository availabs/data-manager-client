import React from "react"

import {
  NavItem,
  useTheme,
  UserMenu,
  UserMenuItem,
  UserMenuSeparator
} from "@availabs/avl-components"
import ReadOnlyEditor from "components/dms/components/editor/editor.read-only"
// import { DmsButton } from "components/dms/components/dms-button"
import { useAuth } from "components/ams/src"

import { useMakeInteraction } from "components/dms/wrappers/dms-provider"

import get from "lodash.get"

const PageHeaderNavItem = ({ item }) => {
  const { to } = useMakeInteraction("view", item);
  return (
    <NavItem type="top" to={ to }>
      { item.data.page }
    </NavItem>
  )
}

const PageHeader = ({ dataItems }) => {
  const theme = useTheme(),
    user = useAuth();
console.log("USER:", user)
  return (
    <div className={ `fixed top-0 left-0 right-0 ${ theme.headerBg }` }>
      <div className="h-16 flex container mx-auto">
        { dataItems.sort((a, b) => a.data.index - b.data.index)
            .map(di =>
              <PageHeaderNavItem key={ di.id } item={ di }/>
            )
        }
{ /* this is an example to show you can add arbitrary links here */ }
        <NavItem to="/fake" type="top">
          Fake
        </NavItem>
        <div className="flex-1 flex items-center justify-end">
          <UserMenu>
            { get(user, "authLevel", -1) < 5 ? null :
              <UserMenuItem to="/web-test-dev">
                Admin
              </UserMenuItem>
            }
            <UserMenuSeparator />
            <UserMenuItem to="/auth/logout">
              Logout
            </UserMenuItem>
          </UserMenu>
        </div>
      </div>
    </div>
  )
}
const PageView = ({ item, dataItems, ...props }) => {
// all data for the current page is stored in item.data
// dataItems is an array of all pages, including the current page (item)
  return (
    <div style={ { transform: "translate(0, 0)" } }>
      <PageHeader dataItems={ dataItems }/>
      <div className="w-full mx-auto max-w-7xl pt-20">
        { get(item, ["data", "sections"], []).map(({ section, content }) =>
            <div className="border rounded p-2 my-2" key={ section }>
              { section }
              <ReadOnlyEditor value={ content }/>
            </div>
          )
        }
      </div>
    </div>
  )
}
export default PageView;
