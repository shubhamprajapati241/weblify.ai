import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { FileExplorer } from "../components/FileExplorer";
import { FilePreview } from "../components/FilePreview";
import { useInitializeProject } from "../hooks/useInitializeProject";
import { useLocation } from "react-router-dom";
import { parseXml } from "../utils";
import { FileItem, Step, StepType } from "../types";
import { StepsList } from "../components/StepList";
import { TabView } from "../components/TabView";
import { useWebContainer } from "../hooks/useWebContainer";
import { PreviewFrame } from "../components/PreviewFrame";

export function BuilderPage() {
  useInitializeProject();

  const location = useLocation();
  const webContainer = useWebContainer();
  const { task } = location.state as { task: string };

  // const [loading, setLoading] = useState(false);
  // const [template, setTemplate] = useState(false);

  const [steps, setSteps] = useState<Step[]>([]);
  const [followUpPrompt, setFollowUpPrompt] = useState("");

  const [llmMessages, setLlmMessages] = useState<
    {
      role: "user" | "assistant";
      content: string;
    }[]
  >([]);

  console.log(llmMessages);

  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};

      const processFile = (file: FileItem, isRootFolder: boolean) => {
        if (file.type === "folder") {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children
              ? Object.fromEntries(
                  file.children.map((child) => [
                    child.name,
                    processFile(child, false),
                  ])
                )
              : {},
          };
        } else if (file.type === "file") {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || "",
              },
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || "",
              },
            };
          }
        }

        return mountStructure[file.name];
      };

      // Process each top-level file/folder
      files.forEach((file) => processFile(file, true));
      return mountStructure;
    };

    const mountStructure = createMountStructure(files);
    // Mount the structure if WebContainer is available
    console.log(mountStructure);
    webContainer?.mount(mountStructure);
    console.log("Web container is");
    console.log(webContainer);
  }, [files, webContainer]);

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps
      .filter(({ status }) => status === "pending")
      .map((step) => {
        updateHappened = true;
        if (step?.type === StepType.CreateFile) {
          let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]

          let currentFileStructure = [...originalFiles]; // {}
          const finalAnswerRef = currentFileStructure;

          let currentFolder = "";
          while (parsedPath.length) {
            currentFolder = `${currentFolder}/${parsedPath[0]}`;
            const currentFolderName = parsedPath[0];
            console.log(currentFolderName);
            parsedPath = parsedPath.slice(1);

            if (!parsedPath.length) {
              // final file
              const file = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!file) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "file",
                  path: currentFolder,
                  content: step.code,
                });
              } else {
                file.content = step.code;
              }
            } else {
              /// in a folder
              const folder = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!folder) {
                // create the folder
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "folder",
                  path: currentFolder,
                  children: [],
                });
              }

              currentFileStructure = currentFileStructure.find(
                (x) => x.path === currentFolder
              )!.children!;
            }
          }
          originalFiles = finalAnswerRef;
        }
      });

    if (updateHappened) {
      setFiles(originalFiles);
      setSteps((steps) =>
        steps.map((s: Step) => {
          return {
            ...s,
            status: "completed",
          };
        })
      );
    }
    console.log(files);
  }, [steps, files]);

  async function init() {
    const response = await axios.post(`${BACKEND_URL}/api/template`, {
      prompt: task,
    });
    console.log(response.data);
    const { prompts, uiPrompts } = response.data;

    setSteps(
      parseXml(uiPrompts[0]).map((x) => ({
        ...x,
        status: "pending",
      }))
    );
    // setLoading(true);

    const stepsResponse = await axios.post(`${BACKEND_URL}/api/chat`, {
      messages: [...task, prompts].map((content) => ({
        role: "user",
        content,
      })),
    });
    // setLoading(false);

    setSteps((s) => [
      ...s,
      ...parseXml(stepsResponse.data.response).map((x) => ({
        ...x,
        status: "pending" as "pending",
      })),
    ]);

    setLlmMessages(
      [...prompts, prompt].map((content) => ({
        role: "user",
        content,
      }))
    );

    setLlmMessages((x) => [
      ...x,
      { role: "assistant", content: stepsResponse.data.response },
    ]);
  }

  useEffect(() => {
    init();
  }, []);

  async function followUp() {
    const newMessage = {
      role: "user" as "user",
      content: followUpPrompt,
    };

    const stepsResponse = await axios.post(`${BACKEND_URL}/api/chat`, {
      messages: [...llmMessages, newMessage].map((content) => ({
        role: "user",
        content,
      })),
    });

    setLlmMessages((x) => [...x, newMessage]);

    setLlmMessages((x) => [
      ...x,
      {
        role: "assistant",
        content: stepsResponse.data.resonse,
      },
    ]);

    setSteps((s) => [
      ...s,
      ...parseXml(stepsResponse.data.response).map((x) => ({
        ...x,
        status: "pending" as "pending",
      })),
    ]);
  }

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full grid grid-cols-4 gap-6 p-6">
        <div className="col-span-1 space-y-6 overflow-auto">
          <div>
            <div className="max-h-[75vh] overflow-scroll">
              <StepsList steps={steps} currentStep={1} onStepClick={() => {}} />
            </div>
            <div className="flex">
              <textarea
                className="p-2 w-full"
                onChange={(e) => {
                  setFollowUpPrompt(e.target.value);
                }}
              ></textarea>
              <button
                className="bg-purple-200 text-black"
                onClick={() => followUp()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <FileExplorer files={files} onFileSelect={setSelectedFile} />
        </div>
        <div className="col-span-2 bg-gray-900 rounded-lg shadow-lg h-[calc(100vh-8rem)]">
          <TabView activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="h-[calc(100%-4rem)]">
            {activeTab === "code" ? (
              <FilePreview selectedFile={selectedFile} />
            ) : (
              <PreviewFrame webContainer={webContainer} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
