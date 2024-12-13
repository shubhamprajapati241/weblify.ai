import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt } from "./prompts";
import {
  DESIGN_PROMPT,
  REACT_BASE_PROMPT,
  NODE_BASE_PROMPT,
} from "./basePrompts";
import { TextBlock } from "@anthropic-ai/sdk/resources";
import cors from "cors";

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());
const anthropic = new Anthropic();

app.post("/template", async (req, res) => {
  const prompt = req.body.prompt;

  const response = await anthropic.messages.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 200,
    system:
      "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
  });

  const answer = (response.content[0] as TextBlock).text; // react or node
  if (answer == "react") {
    res.json({
      prompts: [
        DESIGN_PROMPT,
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${REACT_BASE_PROMPT}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [REACT_BASE_PROMPT],
    });
    return;
  }

  if (answer === "node") {
    res.json({
      prompts: [
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${NODE_BASE_PROMPT}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [NODE_BASE_PROMPT],
    });
    return;
  }

  res.status(403).json({ message: "You cant access this" });
  return;
});

app.post("/chat", async (req, res) => {
  const messages = req.body.messages;
  const response = await anthropic.messages.create({
    messages: messages,
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 8000,
    system: getSystemPrompt(),
  });
  console.log(response);
  res.json({
    response: (response.content[0] as TextBlock)?.text,
  });
});

app.listen(3000);
