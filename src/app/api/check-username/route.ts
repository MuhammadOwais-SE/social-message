import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import {z} from "zod";
import {usernameValid} from "@/schema/signUpSchema";

const UsernameQuerySchema = z.object({
    username : usernameValid
});

export async function GET(request: Request){
    await dbConnect();

    try {
        // to need to extract the value from the query parameter(A URL WITH key and value)
        const {searchParams} = new URL(request.url)
        // making object which extract the username
        const queryParam = {
            username: searchParams.get('username')
        }
        // validation with zod
        const result = UsernameQuerySchema.safeParse(queryParam);  
        console.log(result);

        if(!result.success){
           const usernameErrors = result.error.format().username?._errors || []
           return Response.json({
            success: false,
            message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Invalid query parameters"
           }, {status: 400})

        }
    //   start 19:49 video
    const {username} = result.data;
    const existingVerifyUser = await userModel.findOne({username, isVerify: true}) 

    if(existingVerifyUser){
        return Response.json({
            success: false,
            message: "Username name already taken"
        },{status: 400})
    }else{
        return Response.json({
            success: true,
            message: "Username is unique"
        }, {status: 100})
    }

    } catch (error) {
        console.log("Error checking username: ", error);
        return Response.json(
            {
                success: false,
                message: "Error checking username",
            },
            {status: 500}
        )
        
    }
}