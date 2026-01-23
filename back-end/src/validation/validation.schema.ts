import z from "zod";

export const EmailSchema = z.string().email({message: "Invalid email"})
export const PasswordSchema = z.string().min(8, "Password should be atleast 8 character").max(16, "Password should be less than 16 characters")

export const LoginValidationSchema = z.object({
email: EmailSchema,
password: PasswordSchema
})

