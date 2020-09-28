import React from "react"

import { Button } from "components/avl-components/components/Button"
import { Input/*, Select*/ } from "components/avl-components/components/Inputs"

// import get from "lodash.get"

import matchSorter from 'match-sorter'

const UserHeader = ({ ...props }) =>
  <div className="grid grid-cols-9 font-bold gap-3 text-center">
    <div className="col-span-4 border-b-2 border-gray-600 text-left">
      User Email
    </div>
    <div className="col-span-3 border-b-2 border-gray-600">
      Remove from Group
    </div>
    <div className="col-span-2 border-b-2 border-gray-600">
      Delete User
    </div>
  </div>

const UserInGroup = ({ group, user, removeFromGroup, deleteUser, ...props }) => {
  return (
    <div className="grid grid-cols-9 my-1">
      <div className="col-span-4">
        { user.email }
      </div>
      <div className="col-span-3 flex justify-center">
        <Button showConfirm
          onClick={ e => removeFromGroup(user.email, group.name) }>
          remove
        </Button>
      </div>
      <div className="col-span-2 flex justify-center">
        <Button showConfirm buttonTheme="buttonDanger"
          onClick={ e => deleteUser(user.email) }>
          delete
        </Button>
      </div>
    </div>
  )
}
const UserNotInGroup = ({ group, user, assignToGroup, ...props }) => {
  return (
    <div className="grid grid-cols-12 my-1 flex items-center">
      <div className="col-span-8">
        { user.email }
      </div>
      <div className="col-span-4">
        <Button onClick={ e => assignToGroup(user.email, group.name) }>
          add to group
        </Button>
      </div>
    </div>
  )
}

export default ({ group, usersForGroup, users, user, ...props }) => {
  // React.useEffect(() => {
  //   usersForGroup(group.name);
  // }, [usersForGroup, group.name]);
  const [num, setNum] = React.useState(5),
    [userSearch, setUserSearch] = React.useState(""),
    [usersInGroup, otherUsers] = users.reduce(([a1, a2], c) => {
      if (c.groups.includes(group.name)) {
        a1.push(c);
      }
      else {
        a2.push(c);
      }
      return [a1, a2];
    }, [[], []]);

  const otherSearch = matchSorter(otherUsers, userSearch, { keys: ["email"] });
    // .filter(u => (u.email.toLowerCase().includes(userSearch.toLowerCase())));

  return (
    <div>
      <div className="mb-10 grid grid-cols-2 gap-2">
        <div className="col-span-1 relative">
          <Input value={ userSearch } onChange={ setUserSearch }
            placeholder="Search for another user..."/>
          { userSearch && otherSearch.length ?
              <div className="absolute left-0 bottom-0 right-0">
                { otherSearch.length <= 5 ? null :
                  <div className="flex justify-center">
                    <Button onClick={ e => setNum(num - 5) }
                      disabled={ num === 5 }
                      className="mx-1">
                      Show Less
                    </Button>
                    <Button onClick={ e => setNum(num + 5) }
                      disabled={ num > otherSearch.length }
                      className="mx-1">
                      Show More
                    </Button>
                  </div>
                }
              </div> : null
          }
        </div>
        <div className="col-span-1">
          { !userSearch ? null :
            <div>
              { otherSearch.length ? null :
                <div className="pt-1">No users found...</div>
              }
              { otherSearch.slice(0, num)
                  .map(u =>
                    <UserNotInGroup key={ u.email } group={ group } user={ u } { ...props }/>
                  )
              }
              { otherSearch.length < num ? null :
                <div>Plus { otherSearch.length - num } others...</div>
              }
            </div>
          }
        </div>
      </div>
      <UserHeader />
      { usersInGroup
          .sort((a, b) => a.email < b.email ? -1 : a.email > b.email ? 1 : 0)
          .map(user =>
            <UserInGroup key={ user.email } user={ user }
              group={ group } { ...props }>
              { user.email }
            </UserInGroup>
          )
      }
    </div>
  )
}
