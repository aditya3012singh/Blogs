import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
import { cors } from 'hono/cors'
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET:string,
  }
}>()
app.use('/*',cors())

// middleware
// app.use('/api/v1/blog/*',async (c,next)=>{
//   const header=c.req.header("Authorization") || "";
//   // bearer token
//   const token=header.split(" ")[1]
//   const response=await verify(token,c.env.JWT_SECRET)
//   if(response.id){
//     next()
//   }
//   else{
//     c.status(403)
//     return c.json({error:"unauthorized"})
//   }
// })



app.route("/api/v1/user",userRouter);
app.route("/api/v1/blog",blogRouter);






export default app
