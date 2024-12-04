import { Project } from "../types";

export const sampleProject: Project = {
  id: "sample-project",
  name: "Portfolio Website",
  description: "A modern portfolio website with dark theme",
  tasks: [
    {
      id: "task-1",
      title: "Setup Project Structure",
      status: "completed",
    },
    {
      id: "task-2",
      title: "Design Homepage Layout",
      status: "in-progress",
    },
    {
      id: "task-3",
      title: "Implement Dark Theme",
      status: "pending",
    },
    {
      id: "task-4",
      title: "Add Portfolio Section",
      status: "pending",
    },
    {
      id: "task-5",
      title: "Contact Form",
      status: "pending",
    },
  ],
  files: [
    {
      id: "file-1",
      name: "index.html",
      path: "/index.html",
      type: "html",
      content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Portfolio</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body class="dark">
    <header>
        <nav>
            <div class="logo">Portfolio</div>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="hero">
            <h1>Welcome to My Portfolio</h1>
            <p>Frontend Developer & UI/UX Designer</p>
        </section>
    </main>

    <script src="main.js"></script>
</body>
</html>`,
    },
    {
      id: "file-2",
      name: "styles.css",
      path: "/styles.css",
      type: "css",
      content: `:root {
  --bg-primary: #121318;
  --bg-secondary: #1f2028;
  --text-primary: #e5e6f3;
  --text-secondary: #a7a8b5;
  --accent: #6366f1;
}

body.dark {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

nav {
  background-color: var(--bg-secondary);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--accent);
}

nav ul {
  display: flex;
  gap: 2rem;
  list-style: none;
}

nav a {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.3s;
}

nav a:hover {
  color: var(--accent);
}

#hero {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.25rem;
  color: var(--text-secondary);
}`,
    },
    {
      id: "file-3",
      name: "main.js",
      path: "/main.js",
      type: "javascript",
      content: `// Theme switcher functionality
document.addEventListener('DOMContentLoaded', () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (prefersDark) {
    document.body.classList.add('dark');
  }
  
  // Add smooth scrolling for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      target.scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
});`,
    },
  ],
};
