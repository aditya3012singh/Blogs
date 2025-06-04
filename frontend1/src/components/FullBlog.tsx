import type { Blog } from "../hooks"
import { Appbar } from "./Appbar"
import { Avatar } from "./BlogCard"


export const FullBlog=({blog}: {blog:Blog })=>{
    return <div>
        <Appbar/>
        <div className="flex justify-center">
            <div className="grid grid-cols-12 px-10 pt-200 w-full max-w-screen-2xl">
                <div className=" col-span-8">
                    <div className="text-5xl font-extrabold pb-1 pt-12">{blog.title}</div>
                    <div className="text-slate-500">Posted on 4th July 2025</div>
                    <div className="text-xl pt-2 text-slate-600 font-bold">{blog.content}</div>
                </div>
                <div className="  col-span-4 pt-12">
                    <div className="text-slate-500">Author</div>
                    <div className="flex pt-2">
                        <div className="pr-4 flex flex-col justify-center"><Avatar size="big" name={blog.author.name||"Anonymous" }/></div>
                        <div className="text-xl font-bold flex flex-col justify-center">{blog.author.name || "Anonymous"}</div>
                                         
                    </div>
                    <div className="pt-2 text-slate-800">Random cache phrase about the author's ability to grab the users attention</div>   
                </div>
            </div>
        </div>
    </div>
}