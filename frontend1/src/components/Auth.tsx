import type { SignupInput } from "@aditya3012singh/medium-common123";
import axios from "axios";
import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config";

// trpc
 export const Auth=({type}:{type: "signup" | "signin"})=>{
    const navigate=useNavigate()
    const [postInput, setPostInput]=useState<SignupInput>({
        email:"",
        password:"",
        name:""
    })

    async function sendRequest(){
        try {
            const response= await axios.post(`${BACKEND_URL}/api/v1/user/${type=="signup"?"signup":"signin"}`,postInput)
            const token=response.data.jwt;
            console.log("Response data:", response.data);
            if (token) {
                localStorage.setItem("token", token);
                navigate("/blogs");
            } else {
                alert("No token received");
        }
        } catch (error) {
            // alert the user that request failed
            alert("Error while signing up")
        }
        
    }

    return <div className="h-screen flex justify-center flex-col">
        {/* {JSON.stringify(postInput)} */}
        <div className="flex justify-center">
            <div >
            <div className="px-10">
                <div className="text-3xl font-bold ">
                    {type=="signup"?"Create an account":"Login to Your account"}
                </div>
                <div className="text-slate-400">
                    {type=="signin"?"Dont have an account?":"Already have an account?"}
                    <Link to={type=="signin"?"/signup":"/signin"} className="pl-2 underline">
                        {type=="signin"?"Sign up":"Sign in"}
                    </Link>
                </div>
            </div>
            <div className="pt-1">
                <LabelledInput label="email" placeholder="John@gmail.com" onChange={(e)=>{
                    setPostInput({
                        ...postInput,
                        email: e.target.value
                    })
                }}/>
                {type=="signup"?<LabelledInput label="Name" placeholder="John Doe" onChange={(e)=>{
                    setPostInput ({
                         ...postInput,
                        name: e.target.value
                    })
                }}/>:null}
                <LabelledInput label="password" type={"password"} placeholder="123456" onChange={(e)=>{
                    setPostInput({
                        ...postInput,
                        password: e.target.value
                    })
                }}/>
                <button onClick={sendRequest} type="button" className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type=="signup"?"signup":"signin"}</button>
            </div>
        </div>
    </div>
    </div>
}
interface LabelledInputType{
    label: string;
    placeholder: string;
    onChange:(e: ChangeEvent<HTMLInputElement>) => void;
    type?:  string
}

function LabelledInput({label, placeholder, onChange,type}:LabelledInputType){
    return <div>
        <div>
            <label className="block mb-2 text-sm  font-bold text-gray-900 pt-2">{label}</label>
            <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
             focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200
             dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500
             dark:focus:border-blue-500" placeholder={placeholder} required />
        </div>
    </div>
}