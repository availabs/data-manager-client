import React from "react"

import { Input } from "./parts"
import { hasValue } from "../utils"

// import { useTheme } from "components/avl-components/wrappers/with-theme"

export const ValueItem = ({ isPlaceholder, children, remove }) => {
  // const theme = useTheme();
  return (
    <div className={ `
        ${ isPlaceholder ? "text-gray-400" : "bg-gray-200 mr-1 pl-2 pr-1" }
        rounded whitespace-no-wrap my-0.5 relative flex items-center
      ` }>
      { children }
      { isPlaceholder ? null :
        <div className="bg-gray-400 hover:bg-gray-500 ml-2 p-1 text-white flex justify-center items-center rounded cursor-pointer"
          onClick={ remove }>
          <svg width="8" height="8">
            <line x2="8" y2="8" style={ { stroke: "#fff", strokeWidth: 2 } }/>
            <line y1="8" x2="8" style={ { stroke: "#fff", strokeWidth: 2 } }/>
          </svg>
        </div>
      }
    </div>
  )
}
export const ValueContainer = ({ children, large, small, className, ...props }) =>
  <div { ...props }
    className={ `
      w-full flex flex-row flex-wrap bg-white border-2 border-transparent
      ${ large ? "py-1 px-4" : small ? "py-0 px-1" : "py-0 px-2" }
      ${ large ? "text-lg" : small ? "text-sm" : "" }
      ${ large ? "rounded-lg" : "rounded" }
      ${ className }
    ` }>
    { children }
  </div>

const Dropdown = ({ children }) =>
  <div className="absolute left-0 z-40 overflow-hidden w-full rounded-b-lg"
    style={ { top: "calc(100%)", minWidth: "50%" } }>
    { children }
  </div>
const DropdownItem = ({ children, ...props }) =>
  <div { ...props } className="cursor-pointer hover:bg-gray-300 px-2">
    { children }
  </div>

class Select extends React.Component {
  static defaultProps = {
    multi: true,
    searchable: true,
    domain: [],
    value: null,
    placeholder: "Select a value..."
  }
  constructor(...args) {
    super(...args);
    this.state = {
      opened: false,
      search: ""
    }
  }
  getValues() {
    if (!hasValue(this.props.value)) return [this.props.placeholder];
    if (!Array.isArray(this.props.value)) {
      return [this.props.value];
    }
    return this.props.value;
  }
  openDropdown(e) {
    e.stopPropagation();
    this.setState({ opened: true });
  }
  closeDropdown() {
    this.setState({ opened: false, search: "" });
  }
  addItem(e, v) {
    e.stopPropagation();
    this.closeDropdown();

    if (this.props.multi) {
      if (!hasValue(this.props.value)) {
        this.props.onChange([v]);
      }
      else if (!this.props.value.includes(v)) {
        this.props.onChange([...this.props.value, v]);
      }
    }
    else {
      this.props.onChange(v);
    }
  }
  removeItem(e, v) {
    e.stopPropagation();

    if (this.props.multi) {
      const newValue = this.props.value.filter(d => d !== v);
      this.props.onChange(newValue.length ? newValue : null);
    }
    else {
      this.props.onChange(null);
    }
  }
  setSearch(e, search) {
    e.stopPropagation();
    this.setState({ search })
  }
  render() {
    const values = this.getValues(),
      domain = this.props.domain
        .filter(d => !values.includes(d))
        .filter(d => d.toString().includes(this.state.search));
    return (
      <div className="relative" onMouseLeave={ e => this.closeDropdown() }>
        <div className="cursor-pointer">
          <ValueContainer id={ this.props.id } tabIndex="0"
            onClick={ e => this.openDropdown(e) }
            style={ { borderColor: this.state.opened ? "black" : "transparent" } }>
            { values.map((v, i) =>
                <ValueItem key={ i } isPlaceholder={ v === this.props.placeholder }
                  remove={ e => this.removeItem(e, v) }>
                  { v }
                </ValueItem>
              )
            }
          </ValueContainer>
        </div>
        { !this.state.opened ? null :
          <Dropdown>
            <div className="bg-gray-200 mt-1 pt-1">
              <div className="m-2 mt-1">
                <Input id={ `${ this.props.id }-search` } type="text"
                  value={ this.state.search } onChange={ e => this.setSearch(e, e.target.value) }
                  autoFocus placeholder="search..."/>
              </div>
              { !domain.length ? null :
                <div className="scrollbar overflow-y-auto"
                  style={ { maxHeight: "300px" } }>
                  { domain.map(d =>
                      <DropdownItem key={ d } onClick={ e => this.addItem(e, d) }>
                        { d }
                      </DropdownItem>
                    )
                  }
                </div>
              }
            </div>
          </Dropdown>
        }
      </div>
    )
  }
}
export default Select
