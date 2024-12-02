import Anthropic from "@anthropic-ai/sdk";
require("dotenv").config();

const anthropic = new Anthropic();

async function main() {
  await anthropic.messages
    .stream({
      messages: [{ role: "user", content: "Create a simple to-do app" }],
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 100,
    })
    .on("text", (text) => {
      console.log(text);
    });
}

main();
