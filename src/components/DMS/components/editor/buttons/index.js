import React from "react"

import makeBlockStyleButton from "./makeBlockStyleButton"
import makeInlineStyleButton from "./makeInlineStyleButton"

const BlockQuote =
  <svg
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
export const BlockQuoteButton = makeBlockStyleButton("blockquote", BlockQuote);

const CodeBlock =
  <svg
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h24v24H0V0z" fill="none"/>
    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
  </svg>
export const CodeBlockButton = makeBlockStyleButton("code-block", CodeBlock);

const Header = ({ children }) =>
  <div className="px-1 font-semibold">
    { children }
  </div>
export const HeaderOneButton = makeBlockStyleButton("header-one", <Header>H1</Header>);
export const HeaderTwoButton = makeBlockStyleButton("header-two", <Header>H2</Header>);
export const HeaderThreeButton = makeBlockStyleButton("header-three", <Header>H3</Header>);

const OrderedList =
  <svg
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </svg>
export const OrderedListButton = makeBlockStyleButton("ordered-list-item", OrderedList);

const UnorderedList =
  <svg
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
    <path d="M0 0h24v24H0V0z" fill="none"/>
  </svg>
export const UnorderedListButton = makeBlockStyleButton("unordered-list-item", UnorderedList);

const BoldOld =
  <svg
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </svg>
const Bold =
  <div className="px-1 font-semibold">
    B
  </div>
export const BoldButton = makeInlineStyleButton("BOLD", Bold);

const Code =
  <svg
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h24v24H0V0z" fill="none"/>
    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
  </svg>
export const CodeButton = makeInlineStyleButton("CODE", Code);

const Italic =
  <svg
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/>
  </svg>
export const ItalicButton = makeInlineStyleButton("ITALIC", Italic);

const StrikeThrough =
  <div className="px-1 font-semibold line-through">
    &nbsp;S&nbsp;
  </div>
export const StrikeThroughButton = makeInlineStyleButton("STRIKETHROUGH", StrikeThrough);

const SubScript =
  <div className="px-1">
    x<sub>2</sub>
  </div>
export const SubScriptButton = makeInlineStyleButton("SUBSCRIPT", SubScript);

const SuperScript =
  <div className="px-1">
    x<sup>2</sup>
  </div>
export const SuperScriptButton = makeInlineStyleButton("SUPERSCRIPT", SuperScript);

const UnderlineOld =
  <svg
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"/>
  </svg>
const Underline =
  <div className="px-1 underline font-semibold">
    U
  </div>
export const UnderlineButton = makeInlineStyleButton("UNDERLINE", Underline);
