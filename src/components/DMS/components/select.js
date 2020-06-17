import React from "react"

import { Input } from "./parts"

const SelectItem = ({ isPlaceholder, children, remove }) =>
  <div className={ `
      ${ isPlaceholder ? "" : "bg-gray-200 mx-1 px-2" }
      rounded whitespace-no-wrap my-0.5 relative flex items-center
    ` }>
    { children }
    { isPlaceholder ? null :
      <div className="bg-gray-400 hover:bg-gray-500 ml-2 p-1 text-white flex justify-center items-center rounded"
        style={ { marginRight: "-.25rem" } }
        onClick={ remove }>
        <svg width="8" height="8">
          <line x2="8" y2="8" style={ { stroke: "#fff", strokeWidth: 2 } }/>
          <line y1="8" x2="8" style={ { stroke: "#fff", strokeWidth: 2 } }/>
        </svg>
      </div>
    }
  </div>
const SelectValue = ({ children, large, small, className, disabled, ...props }) =>
  <div { ...props } disabled={ disabled }
    className={ `
      w-full flex flex-row flex-wrap bg-white border-2 border-transparent
      ${ large ? "py-2 px-4" : small ? "py-0 px-1" : "py-1 px-2" }
      ${ large ? "text-lg" : small ? "text-sm" : "" }
      ${ large ? "rounded-lg" : "rounded" }
      ${ disabled ? "cursor-not-allowed" : `cursor-pointer` }
      ${ className }
    ` }>
    { children }
  </div>

const Dropdown = ({ children }) =>
  <div className="absolute left-0 bg-gray-200 z-40 overflow-hidden w-full"
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
  hasValue() {
    const { value } = this.props;
    if (value === null || value === undefined) return false;
    if (typeof value === "string" && !value.length) return false;
    if (Array.isArray(value) && !value.length) return false;
    return true;
  }
  getValues() {
    if (!this.hasValue()) return [this.props.placeholder];
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
      if (!this.hasValue()) {
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
      this.props.onChange(this.props.value.filter(d => d !== v));
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
        <SelectValue id={ this.props.id } tabIndex="0"
          onClick={ e => this.openDropdown(e) }
          style={ { borderColor: this.state.opened ? "black" : "transparent" } }>
          { values.map((v, i) =>
              <SelectItem key={ i } isPlaceholder={ v === this.props.placeholder }
                remove={ e => this.removeItem(e, v) }>
                { v }
              </SelectItem>
            )
          }
        </SelectValue>
        { !this.state.opened ? null :
          <Dropdown>
            <div className="m-2">
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
          </Dropdown>
        }
      </div>
    )
  }
}
export default Select
