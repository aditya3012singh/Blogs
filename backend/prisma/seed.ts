import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Check if user already exists to avoid unique constraint error
  const existingUser = await prisma.user.findUnique({
    where: { email: 'demo@example.com' },
  });

  const user = existingUser || await prisma.user.create({
    data: {
      email: 'demo@example.com',
      name: 'Aditya',
      password: 'hashed-password', // Use hashed password in real cases
    },
  });

  const blogs = [
    {
      title: "How to Start with React",
      content: "React is a powerful library for building UIs. In this blog, we'll cover the basics...",
    },
    {
      title: "Understanding Async/Await in JavaScript",
      content: "Async/await makes asynchronous code look synchronous. This post explores how it works...",
    },
    {
      title: "A Beginner's Guide to Prisma",
      content: "Prisma simplifies database access in Node.js apps. Here’s how to use it in your next project...",
    },
    {
      title: "Deploying with Vercel",
      content: "Learn how to deploy your full-stack apps using Vercel's seamless platform...",
    },
    {
      title: "Optimizing React Performance",
      content: "In this blog, we'll look at how to optimize performance in large React applications...",
    },
  ];

  for (const blog of blogs) {
    await prisma.blog.create({
      data: {
        ...blog,
        authorId: user.id,
        published: true,
      },
    });
  }

  console.log("✅ Seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
