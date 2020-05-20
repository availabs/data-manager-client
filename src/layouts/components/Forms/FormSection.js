import React, { Component } from "react"
import * as Inputs from 'layouts/components/Forms/Inputs'
import 'styles/tailwind.css';

const InputContainer = Inputs.InputContainer

export default  ({title, info, inputs, state, onChange}) => (
  <div className="max-w-7xl mx-auto pt-6">
    <div className="bg-white shadow-md px-4 pt-3 pb-5 sm:rounded-sm sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="leading-6 text-gray-900">{title}</h3>
          <p className="mt-1 text-sm leading-5 text-gray-500">
            {info}
          </p>
        </div>
        <div className="md:mt-0 md:col-span-2">
          <form action="#" method="POST">
            <div className="grid grid-cols-6 gap-6">
              {inputs.map((input,i) => {
                const Input = Inputs[input.type] || Inputs['Text']
                return(
                  <InputContainer {...input} key={i}>
                    <Input 
                      onChange={onChange}
                      state={state}
                      {...input} 
                    />
                  </InputContainer>
                )
              })}
            </div>
          </form>
        </div>
      </div>
    </div> 
  </div>
)