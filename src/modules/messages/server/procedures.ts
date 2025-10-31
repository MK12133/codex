import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { ConsumeCredits } from "@/lib/usage";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const messageRouter = createTRPCRouter({
    getMany : protectedProcedure.input(z.object({projectId : z.string().min(1,{message : "ProjectID is required"})})).query(
        async({input,ctx})=>{
        const message = await prisma.message.findMany({
            where : {
                projectId : input.projectId,
                project : {
                    userId : ctx.auth.userId
                }
            },
            include : {
                fragment:true,
            },
            orderBy:{
                updatedAt:"asc"
            }
        });
        return message
    }),
    create: protectedProcedure.input(
        z.object({
            value : z.string().min(1,{message : "Value is required"}).max(10000,{message : "Value is too long"}),
            projectId : z.string().min(1,{message : "ProjectID is required"})
        })
    ).mutation(async({input,ctx}) =>{
        const exisitionProject = await prisma.project.findUnique({
            where : {
                id : input.projectId,
                userId : ctx.auth.userId,
            }
        });

        if(!exisitionProject){
            throw new TRPCError({code : "NOT_FOUND",message : "Project Not Found"})
        }
        try {
            await ConsumeCredits();
        } catch (error) {
            if(error instanceof Error){
                throw new TRPCError({code:"BAD_REQUEST",message : "Something went wrong"})
            }else{
                throw new TRPCError({code:"TOO_MANY_REQUESTS",message : "You have run out of credits"})
            }
        }
        const createMessage = await prisma.message.create({
            data : {
                projectId : exisitionProject.id,
                content : input.value,
                role : "USER",
                type : "RESULT"
            },
        });
        await inngest.send({
            name : "code-agent/run",
            data : {
                value : input.value,
                projectId : input.projectId
            }
        });
        return createMessage;
    })
})