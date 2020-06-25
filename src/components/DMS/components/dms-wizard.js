import React from "react"

import { Button } from "components/avl-components/components/Button"

import { useTheme } from "components/avl-components/wrappers/with-theme"

import styled from "styled-components"

export default ({ sections, activeIndex, canGoPrev, prev, canGoNext, next, children, ...props }) => {
  return (
    <div className="w-full">
      { sections.length < 2 ? null :
        <>
          <div className="text-2xl flex mb-2">
            { sections.map((sect, i) =>
                <StyledBorderDiv key={ i } className="flex-1 font-bold"
                  active={ i <= activeIndex }
                  current={ i === activeIndex }>
                  <div className="pr-6 pl-2">
                    { sect.title || `Page ${ i + 1 }` }
                  </div>
                </StyledBorderDiv>
              )
            }
          </div>
          <div className="flex">
            { sections.length < 2 ? null :
              <Button className="flex-0" disabled={ !canGoPrev }
                onClick={ prev } buttonTheme="buttonInfo">
                prev
              </Button>
            }
            <div className="flex-1 flex justify-end">
              { sections.length < 2 ? null :
                <Button className="flex-0" disabled={ !canGoNext }
                  onClick={ next } buttonTheme="buttonInfo">
                  next
                </Button>
              }
            </div>
          </div>
        </>
      }
      <div>
        { children }
      </div>
    </div>
  )
}

const BorderDiv = ({ active, current, className, children }) => {
  const theme = useTheme();
  return (
    <div className={ `
      ${ theme.borderInfo } ${ theme.transition } ${ className }
      ${ current ? theme.textInfo : active ? theme.text : theme.textLight }
    ` }>
      { children }
    </div>
  )
}

const StyledBorderDiv = styled(BorderDiv)`
  &::after {
    content: "";
    display: block;
    width: ${ props => props.active ? 100 : 0 }%;
    border-bottom: 4px;
    border-style: solid;
    border-color: inherit;
    transition: 0.25s;
  }
`
