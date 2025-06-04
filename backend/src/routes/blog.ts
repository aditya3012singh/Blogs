import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {  verify } from 'hono/jwt'
import { createBlogInput, updateBlogInput } from "@aditya3012singh/medium-common123";

export const blogRouter= new Hono<{
  Bindings: {
    DATABASE_URL: String,
    JWT_SECRET:String,
  },
  Variables:{
    userId:string
  }
}>()

blogRouter.use("/*", async(c,next)=>{
  // middleware
  // extract the user id
  // pass it down to the route handler

  try {
    const authHeader=c.req.header("authorization") || "";
    const user=await verify(authHeader,c.env.JWT_SECRET) as { id: string };
    if(user){
      c.set("userId",user.id)
      await next()
    }else{
      c.status(403)
      return c.json({
        message:"you are not logged in"
      })
    }
  } catch (error) {
    c.status(403)
    return c.json({
      message:"you are not logged in"
    })
  }
  
})

blogRouter.post('/',async (c)=>{
  const body=await c.req.json()
  const {success}= createBlogInput.safeParse(body)
  if (!success) {
      c.status(411);
      return c.json({
          message: "Inputs not correct"
      })
  }

  const authorId=c.get("userId")
  const prisma = new PrismaClient({
    // @ts-ignore
    datasourceUrl:c.env.DATABASE_URL, // correct use
  }).$extends(withAccelerate()) 

  const blog=await  prisma.blog.create({
    data:{
      title: body.content,
      content:body.content,
      authorId: authorId
    }
  })
  return c.json({
    id: blog.id
  })
})

blogRouter.put('/',async(c)=>{
  const body=await c.req.json()
  const {success}=updateBlogInput.safeParse(body)
  if(!success){
    c.status(411)
    return  c.json({
            message: "Inputs not correct"
        })
  }
  const prisma = new PrismaClient({
    // @ts-ignore
    datasourceUrl:c.env.DATABASE_URL, // correct use
  }).$extends(withAccelerate()) 

  const blog= await prisma.blog.update({
    where:{
      id: body.id
    },
    data:{
      title:body.title,
      content:body.content
    }
  })
  return c.json({
    id: blog.id
  })
})



// add pagination by my self
blogRouter.get('/bulk',async(c)=>{
  const prisma = new PrismaClient({
    // @ts-ignore
    datasourceUrl:c.env.DATABASE_URL, // correct use
  }).$extends(withAccelerate()) 
  const blogs=await prisma.blog.findMany({
    select:{
      content:true,
      title:true,
      id:true,
      author:{
        select:{
          name:true
        }
      }
    }
  })
  return c.json({
    blogs
  })
})



blogRouter.get('/:id',async(c)=>{
  const id=c.req.param("id")
  // const body= c.req.param("id")
  const prisma = new PrismaClient({
    // @ts-ignore
    datasourceUrl:c.env.DATABASE_URL, // correct use
  }).$extends(withAccelerate()) 

  try {
    const blog= await prisma.blog.findFirst({
    where:{
      id: id
    },
    select:{
      id:true,
      title:true,
      content:true,
      author:{
        select:{
          name:true
        }
      }
    }
  })
  return c.json({
    blog
  })
  } catch (error) {
    c.status(411)
    return c.json({
    message:"error while fetching blog post"
  })
  }
})

