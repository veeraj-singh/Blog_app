import { z } from 'zod'

export const SignUpInput = z.object({
    email : z.string().email() ,
    password : z.string() ,
    name : z.string().optional()
})
export type SignUpType = z.infer<typeof SignUpInput>

export const SignInInput = z.object({
    email : z.string().email() ,
    password : z.string() 
})
export type SignInType = z.infer<typeof SignInInput>

export const CreatePostInput = z.object({
    title : z.string() ,
    content : z.string()
})
export type CreatePostType = z.infer<typeof CreatePostInput>

export const UpdatePostInput = z.object({
    title : z.string().optional() ,
    content : z.string().optional()
})
export type UpdatePostType = z.infer<typeof UpdatePostInput>