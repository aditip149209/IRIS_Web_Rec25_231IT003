import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { TEInput, TERipple } from "tw-elements-react";

function App() {
  return (
    <>
      <div className="max-h-screen max-w-screen flex items-center justify-center">
        <div className="h-screen w-screen flex items-center justify-center">
          <div className="h-screen w-screen flex items-center justify-center">
            <div className="h-screen w-screen flex items-center justify-center">
              <div className="h-screen w-screen flex items-center justify-center bg-white shadow-lg dark:bg-neutral-800">
                <div className="h-screen w-screen flex flex-col lg:flex-row">
                  
                  {/* Left column container */}
                  <div className="h-screen w-screen flex items-center justify-center p-6">
                    <div className="text-center w-full max-w-md">
                      <img className="mx-auto w-48" src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp" alt="logo" />
                      <h4 className="mb-12 mt-1 pb-1 text-xl font-semibold">
                        We are The Lotus Team
                      </h4>

                      <form className="w-full">
                        <p className="mb-4">Please register an account</p>
                        <TEInput type="text" label="Username" className="mb-4"></TEInput>
                        <TEInput type="password" label="Password" className="mb-4"></TEInput>

                        <div className="mb-12 pb-1 pt-1 text-center">
                          <TERipple rippleColor="light" className="w-full">
                            <button
                              className="mb-3 w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out"
                              type="button"
                              style={{
                                background: "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                              }}
                            >
                              Sign up
                            </button>
                          </TERipple>
                          <a href="#!">Terms and conditions</a>
                        </div>

                        <div className="flex items-center justify-between pb-6">
                          <p className="mb-0 mr-2">Have an account?</p>
                          <TERipple rippleColor="light">
                            <button
                              type="button"
                              className="inline-block rounded border-2 border-danger px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-danger transition duration-150 ease-in-out hover:border-danger-600 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-danger-600"
                            >
                              Login
                            </button>
                          </TERipple>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Right column container */}
                  <div className="h-screen w-screen flex items-center justify-center text-white p-6"
                    style={{
                      background: "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                    }}>
                    <div className="text-center">
                      <h4 className="mb-6 text-xl font-semibold">
                        We are more than just a company
                      </h4>
                      <p className="text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna
                        aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                        ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
