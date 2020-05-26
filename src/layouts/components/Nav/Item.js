import React from "react";
import { Link } from "react-router-dom";
// import { classNames } from "../utils";
import Icon from "layouts/components/Icons";

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}


export default ({ active, to, icon, className, children, theme, type='side' }) => {
  

  let sideClasses = active ? theme.sidebarItemActive : theme.sidebarItem
  let topClasses = active ? theme.topnavItemActive : theme.topnavItem
  let linkClasses = type === 'side' ? sideClasses : topClasses 
  return (
    <Link to={to} className={linkClasses}>
      <Icon icon={icon} className={theme.menuIcon} />
      {children}
    </Link>
  );
  

};

