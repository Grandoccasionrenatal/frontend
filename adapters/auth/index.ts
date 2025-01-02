import { signUpInterface } from '@/components/SignUp/signUp.model';
import { BASE_URL, COMMON_HEADER } from '..';
import { loginInterface } from '@/components/Login/login.model';
import { toast } from 'react-hot-toast';
import { resetPasswordApiScehmaInterface } from '@/app/(checkout)/reset-password/reset-password.model';



const createAccount = async(body: signUpInterface)=>{
    try{
        const res= await fetch(`${BASE_URL}/api/auth/local/register`, {
            headers: {
                ...COMMON_HEADER.headers,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(body)
        })
        if(res.status === 400){
            throw new Error(`Email or Username already registered`)
        }else if (!res.ok) {
            throw new Error(`Pls try again, your request wasn't succesful`);
        }else{
            return res.json()
        }
    }catch(err){
        toast.error(`${err}`)
    }
}

const login = async(body: loginInterface)=>{
    try{
        const res = await fetch(`${BASE_URL}/api/auth/local`, {
            headers: {
                ...COMMON_HEADER.headers,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                identifier: body?.email,
                password: body?.password
            })
        })
        if(res.status === 400){
             throw new Error(`Wrong credentials, pls try again`)
        }else if (!res.ok) {
            throw new Error(`Pls try again, your request wasn't succesful`);
        }else{
            return res.json()
        }
    }catch(err){
        toast.error(`${err}`)
    }
}

const resendEmailConfirmation = async (email: string) =>{
    try{
        const res = await fetch(`${BASE_URL}/api/auth/send-email-confirmation`, {
            headers: {
                ...COMMON_HEADER.headers,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                email: email
            })
        })
        if(res.status === 200 || res.status === 201 ){
            return res.json()
        }else{
             throw new Error(`Pls try again, your request was not successful`)
        }
    }catch(err){
        toast.error(`${err}`)
    }
}

const forgotPassword = async (email: string) =>{
    try{
        const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
            headers: {
                ...COMMON_HEADER.headers,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                email: email
            })
        })
        if(res.status === 200 || res.status === 201 ){
            return res.json()
        }else{
             throw new Error(`Pls try again, your request was not successful`)
        }
    }catch(err){
        toast.error(`${err}`)
    }
}

const resetPassword = async (params: resetPasswordApiScehmaInterface) =>{
    try{
        const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
            headers: {
                ...COMMON_HEADER.headers,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                ...params
            })
        })
        if(res.status === 200 || res.status === 201 ){
            toast.success(`Your password has been reset, you can now login`);
            return res.json()
        }else{
             throw new Error(`Pls try again, your request was not successful`)
        }
    }catch(err){
        toast.error(`${err}`)
    }
}



const authService = {
    createAccount,
    login,
    forgotPassword,
    resetPassword,
    resendEmailConfirmation
}

export default authService