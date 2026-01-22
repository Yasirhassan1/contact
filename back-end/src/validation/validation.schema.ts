import z from "zod";
export const email = z.string().email({message: "Invalid email"})
export const password = z.string().min(8, "Password should be atleast 8 character").max(16, "Password should be less than 16 characters")

  


export const LoginValidationSchema = z.object({
email: email,
password: password
})