import React from "react"

import { Button } from "components/avl-components/components/Button"
import { Input, Select } from "components/avl-components/components/Inputs"

import Header from "components/avl-components/components/Header/HeaderComponent"

import GroupComponent, { GroupHeader } from "./components/GroupComponent"

const verify = (groupName, authLevel, userAuthLevel) =>
  Boolean(groupName) && (authLevel >= 0) && (userAuthLevel >= authLevel)

const Base = ({ title, action, onClick, project, user, getUsers, groups = [], accessor = (d => d), ...props }) => {
  const [groupName, setGroupName] = React.useState(""),
    [authLevel, setAuthLevel] = React.useState(-1);

  React.useEffect(() => { getUsers(); }, [getUsers]);

  const onSubmit = React.useCallback(e => {
    e.preventDefault();
    onClick(accessor(groupName), project, authLevel)
      .then(() => {
        setGroupName("");
        setAuthLevel(-1);
      })
  }, [onClick, accessor, groupName, project, authLevel]);

  return (
    <div className="mb-5 max-w-xl m-auto">
      <div className="border-b-2 border-gray-500 mb-1">
        { title }
      </div>
      <form onSubmit={ onSubmit }>
        <div className="grid grid-cols-4 gap-1">
          <div className="col-span-2">
            { groups.length ?
              <Select domain={ groups } accessor={ accessor } multi={ false }
                value={ groupName } onChange={ setGroupName }
                placeholder="Select a group..."/>
              :
              <Input placeholder="Enter group name..." required
                value={ groupName } onChange={ setGroupName }/>
            }
          </div>
          <div className="col-span-1">
            <Input type="number" min="0" max="10"
              value={ authLevel } onChange={ setAuthLevel }/>
          </div>
          <div className="col-span-1 flex justify-center">
            <Button type="submit" disabled={ !verify(groupName, authLevel, user.authLevel) }>
              { action }
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

const AssignToProject = ({ assignToProject, ...props }) =>
  <Base title="Assign to Project" action="assign" { ...props }
    onClick={ assignToProject } accessor={ d => d.name }/>

const CreateAndAssign = ({ createAndAssign, ...props }) =>
  <Base title="Create Group" action="create" { ...props }
    onClick={ createAndAssign }/>

export default ({ getGroups, groups, project, ...props }) => {
  React.useEffect(() => {
    getGroups();
  }, [getGroups]);

  const [groupsInProject, otherGroups] = groups.reduce(([a1, a2], c) => {
    if (c.projects.reduce((a, c) => a || c.project_name === project, false)) {
      return [[...a1, c], a2]
    }
    return [a1, [...a2, c]];
  }, [[], []]);

  // const [opened, setOpened] = React.useState([]),
  //   toggleGroup = React.useCallback(group => {
  //     if (opened.includes(group)) {
  //       setOpened(opened.filter(group));
  //     }
  //     else {
  //       setOpened([...opened, group]);
  //     }
  //   }, [opened]);

  return (
    <div>
      <Header title="Project Management"/>
      <div className="my-20 max-w-5xl m-auto">

        <AssignToProject project={ project } { ...props }
          groups={ otherGroups.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0) }/>

        <CreateAndAssign project={ project } { ...props }/>

        <GroupHeader />
        { groupsInProject
            .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
            .map(group =>
              <GroupComponent key={ group.name } { ...props }
                group={ group } project={ project }/>
            )
        }
      </div>
    </div>
  )
}
