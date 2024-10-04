import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import sendEmailVerification from "@/helper/sendEmailVerification"


export async function POST(request: Request){
    await dbConnect();
    try{
        //  to see if the user exist or not
        const { username, email, password} = await request.json();
        const existingUserVerifiedByUserName = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUserName) {
            return new Response(
              JSON.stringify({
                success: false,
                message: "Username already exists",
              }),
              { status: 400 }
            );
          }
            

        const existingUserByEmail = await UserModel.findOne({
            email,
        })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail){
            if(existingUserByEmail.isVerify){
                return Response.json({
                    success: false,
                    message: "Email already exist",
                }, {status: 400})
            }else{
                const hashPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save();
            }
        }else{
            const hasedPassword = await bcrypt.hash(password, 10); // for security. It save password in hash formate in database
            const expiryDate = new Date(); // This creates a new Date object representing the current date and time
            expiryDate.setHours(expiryDate.getHours()+1); // This method sets the hour of the Date object to the specified value, which is the current hour plus one. As a result, expiryDate now represents a time exactly one hour in the future from the original time.
        
        const newUser = new UserModel({
            username,
            email,
            password: hasedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerify: false,
            isAcceptingMsg: true,
            messages: []
        })
        await newUser.save();

        }
            
        // sending verification email
        const emailResponse = await sendEmailVerification(
            email, 
            username,
            verifyCode
        )

        if (!emailResponse.success){
            return Response.json({
                success: false,
                message: emailResponse.message,
            }, {status: 500})

        }
        return Response.json({
            success: true,
            message: "User Registered Successfully. Please verify your email"
        }, { status: 201})
        
    }
    catch(error){
        console.error('Error registering User', error)
        return Response.json({
            success: false,
            message: "Error registering user"
        },
    {
        status : 500
    })
    }
}