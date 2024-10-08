import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";
import { verify } from "crypto";
import { string } from "zod";

export default async function sendEmailVerification(
    email: string, username: string, verifyCode: string): Promise<ApiResponse>{
    try{
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message | Verification Code',
            react: VerificationEmail({username, otp: verifyCode})
        });
        return{ success: true, message: "Email send Successfully"}
    }catch(emailError){
        console.log("Error sending Email Verification", emailError)
        return {success: false, message: "Fail to send verification email"}
        };
    }
