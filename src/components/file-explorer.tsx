import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { Fragment, useCallback, useMemo, useState } from "react";
import { Hint } from "./ui/hint";
import { Button } from "./ui/button";
import { CodeView } from "@/modules/projects/ui/components/code-view";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { convertFilesToTreeItems } from "@/lib/utils";
import { TreeView } from "./tree-view";

type FileCollection = Record<string, string>;

function getLanguageFromExtension(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();
  // Optionally map extensions to actual syntax highlighting names
  const map: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    jsx: "jsx",
    tsx: "tsx",
    html: "html",
    css: "css",
    json: "json",
    md: "markdown",
    py: "python",
    java: "java",
    cpp: "cpp",
  };
  return map[extension ?? ""] || "text";
}

interface FileBreadcrumbProps {
  filepath: string;
}

const FileBreadcrumb = ({ filepath }: FileBreadcrumbProps) => {
  const pathSegments = filepath.split("/");
  const MAX_SEGMENTS = 4;

  const renderBreadcrumbItem = () => {
    if (pathSegments.length <= MAX_SEGMENTS) {
      return pathSegments.map((seg, index) => {
        const isLast = index === pathSegments.length - 1;
        return (
          <Fragment key={index}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage className="font-medium">{seg}</BreadcrumbPage>
              ) : (
                <span className="text-muted-foreground">{seg}</span>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </Fragment>
        );
      });
    }

    // Handle long paths elegantly
    const firstSegment = pathSegments[0];
    const lastSegment = pathSegments[pathSegments.length - 1];
    return (
      <>
        <BreadcrumbItem>
          <span className="text-muted-foreground">{firstSegment}</span>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="font-medium">{lastSegment}</BreadcrumbPage>
        </BreadcrumbItem>
      </>
    );
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>{renderBreadcrumbItem()}</BreadcrumbList>
    </Breadcrumb>
  );
};

interface FileExplorerProps {
  files: FileCollection;
}

export const FileExplorer = ({ files }: FileExplorerProps) => {
  const [copied, setCopied] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });

  const treeData = useMemo(() => convertFilesToTreeItems(files), [files]);

  const handleFileSelect = useCallback(
    (filePath: string) => {
      if (files[filePath]) setSelectedFile(filePath);
    },
    [files]
  );

  const handleCopy = useCallback(() => {
    if (!selectedFile) return;

    navigator.clipboard.writeText(files[selectedFile]).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [selectedFile, files]);

  return (
    <ResizablePanelGroup direction="horizontal">
      {/* File Tree Panel */}
      <ResizablePanel defaultSize={30} minSize={20} className="bg-sidebar">
        <TreeView
          data={treeData}
          value={selectedFile}
          onSelect={handleFileSelect}
        />
      </ResizablePanel>

      <ResizableHandle withHandle className="hover:bg-primary transition-colors" />

      {/* Code View Panel */}
      <ResizablePanel defaultSize={70} minSize={50} className="bg-sidebar">
        {selectedFile && files[selectedFile] ? (
          <div className="h-full w-full flex flex-col">
            <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
              <FileBreadcrumb filepath={selectedFile} />
              <Hint text={copied ? "Copied!" : "Copy to Clipboard"} side="bottom">
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-auto cursor-pointer transition"
                  onClick={handleCopy}
                  disabled={copied}
                >
                  {copied ? <CopyCheckIcon /> : <CopyIcon />}
                </Button>
              </Hint>
            </div>
            <div className="flex-1 overflow-auto">
              <CodeView
                code={files[selectedFile]}
                lang={getLanguageFromExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Select a file to view its content
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};


// import { CopyCheckIcon, CopyIcon } from "lucide-react";
// import { Fragment, useCallback, useMemo, useState } from "react";
// import { Hint } from "./ui/hint";
// import { Button } from "./ui/button";
// import { CodeView } from "@/modules/projects/ui/components/code-view";
// import {
//   Breadcrumb,
//   BreadcrumbEllipsis,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@/components/ui/resizable";
// import { convertFilesToTreeItems } from "@/lib/utils";
// import { TreeView } from "./tree-view";

// type FileCollection = { [path: string]: string };

// function getLanguageFromExtension(filename: string): string {
//   const extension = filename.split(".").pop()?.toLowerCase();
//   return extension || "text";
// }
// interface FileBreadcrumb {
//   filepath: string;
// }

// const FileBreadcrumb = ({ filepath }: FileBreadcrumb) => {
//   const pathSegments = filepath.split("/");
//   const maxsegment = 4;
//   const renderBreadcrumbItem = () => {
//     if (pathSegments.length <= maxsegment) {
//       return pathSegments.map((seg, index) => {
//         const isLast = index === pathSegments.length - 1;
//         return (
//           <Fragment key={index}>
//             <BreadcrumbItem>
//               {isLast ? (
//                 <BreadcrumbPage className="font-medium">{seg}</BreadcrumbPage>
//               ) : (
//                 <span className="text-muted-foreground">{seg}</span>
//               )}
//             </BreadcrumbItem>
//             {!isLast && <BreadcrumbSeparator />}
//           </Fragment>
//         );
//       });
//     } else {
//       const firstSegment = pathSegments[0];
//       const lastSegment = pathSegments[pathSegments.length - 1];
//       return (
//         <>
//           <BreadcrumbItem>
//             <span className="text-muted-foreground">{firstSegment}</span>
//             <BreadcrumbSeparator />
//             <BreadcrumbItem>
//               <BreadcrumbEllipsis />
//             </BreadcrumbItem>
//             <BreadcrumbSeparator />
//             <BreadcrumbItem className="font-medium">
//               {lastSegment}
//             </BreadcrumbItem>
//           </BreadcrumbItem>
//         </>
//       );
//     }
//   };

//   return (
//     <Breadcrumb>
//       <BreadcrumbList>{renderBreadcrumbItem()}</BreadcrumbList>
//     </Breadcrumb>
//   );
// };

// interface FileExplorerProps {
//   files: FileCollection;
// }

// export const FileExplorer = ({ files }: FileExplorerProps) => {
//   const[copied,setCopied] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<string | null>(() => {
//     const fileKeys = Object.keys(files);
//     return fileKeys.length > 0 ? fileKeys[0] : null;
//   });

//   const treeData = useMemo(() => {
//     return convertFilesToTreeItems(files);
//   }, [files]);

//   const handleFileSelect = useCallback(
//     (filePath: string) => {
//       console.log({ filePath });

//       if (files[filePath]) {
//         setSelectedFile(filePath);
//       }
//     },
//     [files]
//   );

//   const handleCopy = useCallback(()=>{
//     if(selectedFile){
//       navigator.clipboard.writeText(files[selectedFile]);
//       setCopied(true);
//       setTimeout(() => {
//         setCopied(false);
//       }, 2000);
//     }
//   })

//   return (
//     <ResizablePanelGroup direction="horizontal">
//       <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
//         <TreeView
//           data={treeData}
//           value={selectedFile}
//           onSelect={handleFileSelect}
//         />
//       </ResizablePanel>
//       <ResizableHandle
//         withHandle
//         className="hover:bg-primary transition-colors"
//       />
//       <ResizablePanel defaultSize={70} minSize={50} className="bg-sidebar">
//         {selectedFile && files[selectedFile] ? (
//           <div className="h-full w-full flex flex-col">
//             <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
//               <FileBreadcrumb filepath={selectedFile} />
//               <Hint text="Copy to Clipboard" side="bottom">
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   className="ml-auto cursor-pointer"
//                   onClick={handleCopy}
//                   disabled={copied}
//                 >
//                   {copied ? <CopyCheckIcon/> : <CopyIcon />}
//                 </Button>
//               </Hint>
//             </div>
//             <div className="flex-1 overflow-auto">
//               <CodeView
//                 code={files[selectedFile]}
//                 lang={getLanguageFromExtension(selectedFile)}
//               />
//             </div>
//           </div>
//         ) : (
//           <div className="flex h-full items-center justify-center text-muted-foreground">
//             Select a file to view its content
//           </div>
//         )}
//       </ResizablePanel>
//     </ResizablePanelGroup>
//   );
// };
