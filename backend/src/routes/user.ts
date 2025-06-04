import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
// import { signupInput, signinInput } from "@aditya3012singh/medium-common";
import  {signinInput, signupInput}  from "@aditya3012singh/medium-common123"


export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: String,
    JWT_SECRET:String,
  }
}>()





userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    // @ts-ignore
    datasourceUrl:c.env.DATABASE_URL, // correct use
  }).$extends(withAccelerate())        // enables Accelerate support

  const body = await c.req.json()
  const {success}=signupInput.safeParse(body)
  if(!success){
    c.status(411)
    return c.json("input not correct")
  }
  try {
    const user = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password,
      name:body.name
    },
  })
  
  const token = await sign({ id: user.id }, c.env.JWT_SECRET)

  return c.json({ jwt: token })
  } catch (error) {
    c.status(403);
    return c.json({message:"Invalid"})
  }
})






userRouter.post('/signin',async (c)=>{
  const prisma=new PrismaClient({
    // @ts-ignore
    datasourceUrl:c.env?.DATABASE_URL
  }).$extends(withAccelerate())

  const body=await c.req.json()
  const {success}=signinInput.safeParse(body)
  if(!success){
    c.status(411)
    return c.json({message:"input not correct"})
  }
  const user= await prisma.user.findUnique({
    where:{
      email: body.email,
      password:body.password
    }
  })
  if(!user){
    c.status(403)
    return c.json({error:"user not found"})
  }
  const token=await sign({id:user.id},c.env.JWT_SECRET)
  return c.json({message:"login succefull!!",jwt:token})
})