import React from "react";
import { Link } from "react-router-dom";
// import { classNames } from "../utils";
import Icon from "layouts/components/Icons";

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}


export default ({ active, to, icon, className, children, theme }) => {
  let linkClasses = classNames(
    className,
    "group flex items-center px-2 py-1  text-sm leading-6 font-medium transition ease-in-out duration-150",
    active && theme.sidebarItemActive,
    !active && theme.sidebarItem
  );
   

  let iconClasses = classNames(
    "mr-4 h-6 w-6 transition ease-in-out duration-150",
    active && theme.sidebarItemActive,
    !active && theme.sidebarItem
  );
 
    return (
      <Link to={to} className={linkClasses}>
        <Icon icon={icon} className={iconClasses} />
        {children}
      </Link>
    );
  

};