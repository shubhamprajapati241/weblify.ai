import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt } from "./prompts";
import { DESIGN_PROMPT, reactBasePrompt, nodeBasePrompt } from "./basePrompts";
import { TextBlock } from "@anthropic-ai/sdk/resources";

require("dotenv").config();
const app = express();
app.use(express.json());
const anthropic = new Anthropic();

app.post("/template", async (req, res) => {
  const userPrompt = req.body.prompt;
  const response = await anthropic.messages.create({
    messages: [{ role: "user", content: userPrompt }],
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 100,
    system:
      "Determine if the following message is for React or Node.js. Respond with ONLY one word: 'React', 'Node'. Return NOTHING else",
  });

  const answer = (response.content[0] as TextBlock).text; // react or node
  if (answer == "React") {
    res.json({
      prompts: [
        DESIGN_PROMPT +
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [reactBasePrompt],
    });
    return;
  }

  if (answer == "Node") {
    res.json({
      prompts: [
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [nodeBasePrompt],
    });
    return;
  }

  res.status(403).json({ message: "You cant access this" });
  return;
});

app.listen(3000);

// async function main() {
//   await anthropic.messages
//     .stream({
//       messages: [{ role: "user", content: "Create a simple to-do app" }],
//       model: "claude-3-5-sonnet-20241022",
//       max_tokens: 100,
//       system: getSystemPrompt(),
//     })
//     .on("text", (text) => {
//       console.log(text);
//     });
// }

// main();
