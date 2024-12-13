import { Step, StepType } from "./types";

/**
 * Parse the llm response and convert it into steps
 * * Eg: Input -
 * <boltArtifact id=\"project-import\" title=\"Project Files\">
 *  <boltAction type=\"file\" filePath=\"eslint.config.js\">
 *      import js from '@eslint/js';\nimport globals from 'globals';\n
 *  </boltAction>
 * <boltAction type="shell">
 *      node index.js
 * </boltAction>
 * </boltArtifact>
 *
 * * Output -
 * [{
 *      title: "Project Files",
 *      status: "Pending"
 * }, {
 *      title: "Create eslint.config.js",
 *      type: StepType.CreateFile,
 *      code: "import js from '@eslint/js';\nimport globals from 'globals';\n"
 * }, {
 *      title: "Run command",
 *      code: "node index.js",
 *      type: StepType.RunScript
 * }]
 */
export function parseXml(response: string): Step[] {
  // extract the xml content between <boltArtifact> tag
  const xmlMatch = response.match(
    /<boltArtifact[^>]*>([\s\S]*?)<\/boltArtifact>/
  );

  if (!xmlMatch) return [];
  const xmlContent = xmlMatch[1];
  const steps: Step[] = [];
  let stepsId = 1;

  // extract artifacts title
  const titleMatch = xmlContent.match(/title="([^"]*)"/);
  const artifactsTitle = titleMatch ? titleMatch[1] : "Project Files";

  // add initial artifact step
  steps.push({
    id: stepsId++,
    title: artifactsTitle,
    description: "",
    status: "pending",
    type: StepType.CreateFolder,
  });

  // regular expression to find boltAction tags
  const actionRegex =
    /<boltAction\s+type="([^"]*)"(?:\s+filePath="([^"]*)")?>([\s\S]*?)<\/boltAction>/g;

  let match;

  while ((match = actionRegex.exec(xmlContent)) !== null) {
    const [, type, filePath, content] = match;

    if (type === "file") {
      // file creation step
      steps.push({
        id: stepsId++,
        title: filePath,
        description: "",
        status: "pending",
        type: StepType.CreateFile,
        code: content.trim(),
        path: filePath,
      });
    } else if (type === "shell") {
      // shell command step
      steps.push({
        id: stepsId++,
        title: filePath,
        description: "",
        status: "pending",
        type: StepType.RunScript,
        code: content.trim(),
      });
    }
  }
  return steps;
}
