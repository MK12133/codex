"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

import React from "react";

const ProjectList = () => {
  const trpc = useTRPC();
  const {user} = useUser();
  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());
  if(!user){
    return null;
  }

  return (
    <div className="dark:bg-sidebar w-full bg-white rounded-xl p-8 border flex flex-col gap-y-6 sm:gap-y-4">
      <h2 className="text-2xl font-medium">{user?.firstName}&apos;s Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {projects?.length === 0 && (
          <div className=" cols-span-full text-center">
            <p className="text-sm text-muted-foreground">No Projects Found</p>
          </div>
        )}
        {projects?.map((project) => (
          <Button
            key={project.id}
            variant="outline"
            className="font-normal h-auto  justify-start w-full text-start p-4"
            asChild
          >
            <Link href={`/projects/${project.id}`}>
              <div className="flex items-center gap-x-4" >
                <Image src="/logo.svg" alt="Codex" width={32} height={32} className="object-contain" />
                <div className="flex flex-col" >
                    <h3 className="font-medium truncate" >
                        {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground" >
                        {formatDistanceToNow(project.updatedAt,{
                            addSuffix:true,
                        })}
                    </p>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
