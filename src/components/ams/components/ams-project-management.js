import React from "react"

import Header from "components/avl-components/components/Header/HeaderComponent"

import GroupComponent, { GroupHeader } from "./components/GroupComponent"
import GroupBase from "./components/GroupBase"
import Requests from "./components/Requests"

import amsProjectManagementWrapper from "../wrappers/ams-project-management"

import matchSorter from 'match-sorter'

const AssignToProject = ({ assignToProject, ...props }) =>
  <GroupBase title="Assign to Project" { ...props } action="assign"
    onClick={ assignToProject } accessor={ d => d.name }/>

const CreateGroup = ({ createAndAssign, ...props }) =>
  <GroupBase title="Create Group" { ...props } action="create"
    onClick={ createAndAssign }/>

export default amsProjectManagementWrapper(({ groups, project, requests, ...props }) => {

  const [groupsInProject, otherGroups] = groups.reduce(([a1, a2], c) => {
    if (c.projects.reduce((a, c) => a || c.project_name === project, false)) {
      return [[...a1, c], a2]
    }
    return [a1, [...a2, c]];
  }, [[], []]);

  const nameSorter = (a, b) =>
    a.name.toLowerCase() < b.name.toLowerCase() ? -1 :
    a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0;

  groupsInProject.sort(nameSorter);
  otherGroups.sort(nameSorter);

  const [groupSearch, setGroupSearch] = React.useState("");

  return (
    <div>
      <Header title="Project Management"/>
      <div className="my-20">

        <Requests requests={ requests } groups={ groupsInProject } { ...props }/>

        <AssignToProject { ...props }
          groups={ otherGroups }/>

        <CreateGroup { ...props }/>

        <GroupHeader value={ groupSearch } onChange={ setGroupSearch}/>
        { matchSorter(groupsInProject, groupSearch, { keys: ["name"] })
            .map(group =>
              <GroupComponent key={ group.name } { ...props }
                group={ group }/>
            )
        }
      </div>
    </div>
  )
})
