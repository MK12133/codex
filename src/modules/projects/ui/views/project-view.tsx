"use client";
// import { useTRPC } from "@/trpc/client";
// import { useSuspenseQuery } from "@tanstack/react-query";
import React, { Suspense, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MessageContainer from "../components/message-container";
import { Fragment } from "@/generated/prisma";
import { ProjectHeader } from "../components/project-header";
import { FragmentWeb } from "../components/Fragment-web";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileExplorer } from "@/components/file-explorer";
import UserControl from "@/components/user-control";
import { useAuth } from "@clerk/nextjs";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  projectId: string;
}

const ProjectView = ({ projectId }: Props) => {
  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });

  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");

  // const trpc = useTRPC();
  // const { data: project } = useSuspenseQuery(trpc.projects.getOne.queryOptions({ id: projectId }));
  // const { data: messages } = useSuspenseQuery(trpc.messages.getMany.queryOptions({ projectId }));

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        {/* Left Panel */}
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0 border-r"
        >
          <ErrorBoundary fallback={<p>Project header error</p>}>
            <Suspense
              fallback={
                <p className="p-4 text-sm text-muted-foreground">
                  Loading Project...
                </p>
              }
            >
              <ProjectHeader projectId={projectId} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary fallback={<p>Message container Error</p>}>
            <Suspense
              fallback={
                <p className="p-4 text-sm text-muted-foreground">
                  Loading Messages...
                </p>
              }
            >
              <MessageContainer
                projectId={projectId}
                activeFragment={activeFragment}
                setActiveFragment={setActiveFragment}
              />
            </Suspense>
          </ErrorBoundary>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel */}
        <ResizablePanel defaultSize={65} minSize={50} className="flex flex-col">
          <Tabs
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}
            className="flex flex-col h-full"
          >
            {/* Header with Tabs and Upgrade Button */}
            <div className="w-full flex items-center border-b bg-muted/30 px-3 py-2 gap-x-2">
              <TabsList className="h-8 border rounded-md flex gap-1">
                <TabsTrigger
                  value="preview"
                  className="flex items-center gap-1 rounded-md px-2"
                >
                  <EyeIcon className="w-4 h-4" />
                  <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className="flex items-center gap-1 rounded-md px-2"
                >
                  <CodeIcon className="w-4 h-4" />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>

              <div className="ml-auto flex items-center gap-x-2">
                {!hasProAccess && (
                  <Button asChild size="sm" variant="default">
                    <Link href="/pricing" className="flex items-center gap-1">
                      <CrownIcon className="w-4 h-4" />
                      Upgrade
                    </Link>
                  </Button>
                )}
                <UserControl />
              </div>
            </div>
            <TabsContent value="preview" className="h-full">
              {activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>

            <TabsContent value="code" className="min-h-0">
              {!!activeFragment?.files && (
                <FileExplorer
                  files={activeFragment.files as { [path: string]: string }}
                />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectView;
