import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createUser } from './sdk/index';

function App() {
  const {watch, register, setFocus, formState, handleSubmit } = useForm({ mode: "all", shouldFocusError: 'true' });
  useEffect(() => {setFocus("fullname", "age", "email");}, [setFocus]);

  const { isValid, errors } = formState;
  const [step, setStep] = useState(0);
  const MAX_STEPS = "2"

  const stepByStep = () => { setStep(current => current + 1) }
  const prevstepByPrevstep = () => { setStep(current => current - 1) }
  
  const stepButton = () => {
    if(step >= 2) { return undefined }
    else if (step === 1) {
      return (
        <button
          disabled={!isValid}
          type="submit"
          className="
            mt-6 bg-blue-500 text-white rounded px-6 py-4 w-full
            hover:bg-blue-600
            disabled:opacity-50 disabled:cursor-default
          "
        >Submit</button>
      )
    }
    else {
      return (
        <button
          type="submit"
          disabled={!isValid}
          className="
            mt-6 bg-blue-500 text-white rounded px-6 py-4 w-full
            hover:bg-blue-600
            disabled:opacity-50 disabled:cursor-default
          "
          onClick={stepByStep}
        >Next Part</button>
      )
    }
  }

  const formSubmit = async (details) => {
    await createUser(details)
      .then((respone) => {
          console.log('respone: ', respone)
      })
    await stepByStep()
  }

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col justify-center align-center items-start text-gray-900 antialiased relative">
      <div className="max-w-xl w-full mt-24 mb-24 rounded-lg shadow-2xl bg-white mx-auto overflow-hidden z-10">
        <div className="px-16 py-10 min-h-full">
          <form onSubmit={handleSubmit(formSubmit)}>
            
            {step < MAX_STEPS && (
              <div className="flex align-center justify-start mb-2">
              {step > 0 && (
                <button className="rounded text-md mr-2 px-2 bg-blue-100 text-blue-800" type="button" onClick={prevstepByPrevstep}>
                  Back
                </button>
              )}
              <h5 className="font-semibold text-1xl text-blue-300">
                Part {step + 1} from {MAX_STEPS}
              </h5>
            </div>
            )}  
            

            
            {step >= 0 && (
            <section className={step === 0 ? "flex flex-col block" : "flex flex-col hidden"}>
              <h2 className="font-semibold text-3xl mb-7 text-blue-500">Personal Information</h2>
              <label htmlFor="fullname" className="mb-1 mt-4 font-bold text-gray-600"><span className="text-red-600 text-sm">*</span> Full Name</label>
              <input
                type="text" id="fullname" name="fullname" placeholder="Please enter your name"
                className="outline-none text-input border-gray-200 border-2 rounded-md px-2 py-1 focus:border-blue-400"
                {...register("fullname", { required: 'Please fill input', errors: true })}
              />
              {errors.fullname && <p className="mb-2 text-red-500 font-normal text-sm">{errors.fullname.message}</p>}

              <label htmlFor="age" className="mb-1 mt-4 font-bold text-gray-600"><span className="text-red-600 text-sm">*</span> Age</label>
              <input
                required type="text" required={true} id="age" name="age" placeholder="Please enter your age"
                className="outline-none text-input border-gray-200 border-2 rounded-md px-2 py-1 focus:border-blue-400"
                {...register("age", {
                  required: 'Please fill input',
                  errors: true,
                  maxLength : {
                    value: 2,
                    message: 'Fill with valid number (under 99)' // JS only: <p>error message</p> TS only support string
                  }
              })}
              />
              {errors.age && <p className="mb-2 text-red-500 font-normal text-sm">{errors.age.message}</p>}

            </section>
            )}


            {step >= 1 && (
            <section className={step === 1 ? "flex flex-col block" : "flex flex-col hidden"}>
              <h2 className="font-semibold text-3xl mb-7 text-blue-500">Contact Information</h2>
              <label htmlFor="address" className="mt-4 font-bold text-gray-600"><span className="text-red-600 text-sm">*</span> Email:</label>
              <input
                type="email" id="email" name="email" placeholder="please enter your email"
                className="outline-none text-input border-gray-200 border-2 rounded-md px-2 py-1 focus:border-blue-400"
                {...register("email", {
                  required: "Please fill your email",
                  errors: true,
                  pattern: {
                    value: /^[^@]+@[^@]+\.[^@]+$/,
                    message: 'Please enter a valid email' // JS only: <p>error message</p> TS only support string
                  }
                })}
              />
              {errors.email && <p className="mb-2 text-red-500 font-normal text-sm">{errors.email.message}</p>}
              
              <label htmlFor="newsletter" className="mt-4 font-bold text-gray-600"><span className="text-red-600 text-sm">*</span> Newsletter</label>
              <select
                id="newsletter" name="newsletter"
                className="outline-none text-input border-gray-200 border-2 rounded-md px-2 py-1 mb-2 focus:border-blue-400"
                {...register("newsletter", { required: true })}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </section>
            )}
            

            {step >= 2 && (
              <section className={step === 2 ? "flex flex-col block" : "flex flex-col hidden"}>
                <h1
                  className="font-semibold text-center text-3xl text-gray-600"
                >
                  Congratulations <span className="uppercase text-blue-600">{watch('fullname')}</span>!
                </h1>
                <p className="text-gray-800 text-xl text-center mt-5">
                  You are subscribed 
                    <span className="bg-yellow-100 mx-2 inline-block px-2 rounded">{watch('newsletter')}</span>
                  plan.
                </p>
                <p className="text-center text-gray-300 text-xs mt-6 uppercase">
                  And you can see full details at Console.log
                </p>
                <button onClick={(e) => window.location.reload(false)} className="px-5 py-2 bg-yellow-200 inline-block rounded mt-8 w-2/5 mx-auto">One Again</button>
              </section>
            )}
            {stepButton()}
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
