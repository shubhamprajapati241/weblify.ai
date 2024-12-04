"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const prompts_1 = require("./prompts");
const basePrompts_1 = require("./basePrompts");
const cors_1 = __importDefault(require("cors"));
require("dotenv").config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const anthropic = new sdk_1.default();
app.post("/api/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userPrompt = req.body.prompt;
    console.log("userPrompt :", userPrompt);
    const response = yield anthropic.messages.create({
        messages: [{ role: "user", content: userPrompt }],
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 100,
        system: "Determine if the following message is for React or Node.js. Respond with ONLY one word: 'React', 'Node'. Return NOTHING else",
    });
    const answer = response.content[0].text; // react or node
    console.log("response :", answer);
    if (answer == "React") {
        res.json({
            prompts: [
                basePrompts_1.DESIGN_PROMPT,
                `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${basePrompts_1.reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
            ],
            uiPrompts: [basePrompts_1.reactBasePrompt],
        });
        return;
    }
    if (answer == "Node") {
        res.json({
            prompts: [
                `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${basePrompts_1.reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
            ],
            uiPrompts: [basePrompts_1.nodeBasePrompt],
        });
        return;
    }
    res.status(403).json({ message: "You cant access this" });
    return;
}));
app.post("/api/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = req.body.messages;
    const response = yield anthropic.messages.create({
        messages: messages,
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        system: (0, prompts_1.getSystemPrompt)(),
    });
    console.log(response);
    res.json({
        response: response.content[0].text,
    });
}));
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
