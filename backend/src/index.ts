import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt } from "./prompts";
import { DESIGN_PROMPT, reactBasePrompt, nodeBasePrompt } from "./basePrompts";
import { TextBlock } from "@anthropic-ai/sdk/resources";
import cors from "cors";

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());
const anthropic = new Anthropic();

app.post("/api/template", async (req, res) => {
  const userPrompt = req.body.prompt;
  console.log("userPrompt :", userPrompt);
  const response = await anthropic.messages.create({
    messages: [{ role: "user", content: userPrompt }],
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 100,
    system:
      "Determine if the following message is for React or Node.js. Respond with ONLY one word: 'React', 'Node'. Return NOTHING else",
  });

  const answer = (response.content[0] as TextBlock).text; // react or node
  console.log("response :", answer);
  if (answer == "React") {
    res.json({
      prompts: [
        DESIGN_PROMPT,
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [reactBasePrompt],
    });
    return;
  }

  if (answer == "Node") {
    res.json({
      prompts: [
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [nodeBasePrompt],
    });

    return;
  }

  res.status(403).json({ message: "You cant access this" });
  return;
});

app.post("/api/chat", async (req, res) => {
  const messages = req.body.messages;
  const response = await anthropic.messages.create({
    messages: messages,
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1000,
    system: getSystemPrompt(),
  });
  console.log(response);
  res.json({
    response: (response.content[0] as TextBlock).text,
  });
});

// app.post("/chat", async (req, res) => {
//   const messages = req.body.messages;
//   await anthropic.messages
//     .stream({
//       messages: [
//         {
//           role: "user",
//           content: messages,
//         },
//       ],
//       model: "claude-3-5-sonnet-20241022",
//       max_tokens: 200,
//       system: getSystemPrompt(),
//     })
//     .on("text", (text) => {
//       res.json({
//         response: text,
//       });

//       res.json({
//         response: (response.content[0] as TextBlock)?.text,
//       });
//       console.log(text);
//     });
// });

app.listen(3000);
