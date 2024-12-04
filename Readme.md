# Weblify

**Weblify** is a cutting-edge platform that **leverages AI** and **WebContainers technology** to revolutionize how developers create **full-stack applications**. With Weblify, you can **build, run, and deploy** even the most complex applications directly within your **browser**, eliminating the hassle of traditional development environments. It’s fast, efficient, and designed to streamline your entire development process—empowering you to focus on what really matters: **creating**.

### To create react-app

1. Command `npm create vite@latest`
2. Choose project-name,
   - Frontwork - React,
   - Varient - Typescript

### To create express-app

1. `npm init -y`
2. `npm install typescript`
3. `npx tsc --init`
4. In tsconfig.json
   - Set : "rootDir": "./src"
   - And "outDir": "./dist",
5. Create src folder with `index.ts` file
6. Add below into package.json scripts
   - "dev": "tsc -b && node dist/index.js",
7. Install some more packages
   - npm i --save-dev @types/node
   - npm install dotenv
8. Install express
   - npm install @types/express express

### Antropic Resources

- https://docs.anthropic.com/en/api/getting-started
- https://docs.anthropic.com/en/api/messages-streaming
- https://console.anthropic.com/settings/billing

## To run backend

1. `npm install`
2. `npm run dev`
