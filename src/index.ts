/*import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 8080;

interface Link {
    title: string;
    url: string;
}

const myLinks: Link[] = [
    { title: "GitHub", url: "https://github.com/zap4ick" },
    { title: "LinkedIn", url: "https://linkedin.com/in/andrei-lazuk/" },
    { title: "Email", url: "mailto:andrei@lazuk.me"}
];

app.get('/', (req: Request, res: Response) => {
    res.send(`<h1>Some of my links:</h1><ul>${myLinks.map(l => `<li><a href="${l.url}">${l.title}</a></li>`).join('')}</ul>`);
});

app.listen(port, () => {
    console.log(`TS Server is running on port ${port}`);
});*/


import express, { Request, Response } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';

const app = express();
const port = process.env.PORT || 8080;

interface Link {
    title: string;
    url: string;
    icon: string; // Lucide icon
}

app.use(express.static('public'));

const getLinksData = () => {
    const filePath = join(process.cwd(), 'links.json');
    const rawData = readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
};

/*const myLinks: Link[] = [
    { title: "GitHub", url: "https://github.com/zap4ick", icon: "github" },
    { title: "LinkedIn", url: "https://linkedin.com/in/andrei-lazuk", icon: "linkedin" },
    //{ title: "Telegram", url: "https://t.me/your-profile", icon: "send" },
    { title: "Email", url: "mailto:andrei@lazuk.me", icon: "mail" },
];*/

app.get('/', (req: Request, res: Response) => {
    const data = getLinksData();

    const avatarHtml = data.profile.avatar 
        ? `<img src="${data.profile.avatar}" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-blue-500 shadow-lg" alt="Avatar">`
        : `<div class="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">${data.profile.initials}</div>`;

    const linksHtml = data.links.map((link: any) => `
        <a href="${link.url}"  
           class="flex items-center justify-between w-full p-4 mb-4 bg-gray-800 border border-gray-700 rounded-xl hover:scale-[1.02] transition-transform duration-200 group">
            <div class="flex items-center">
                <i data-lucide="${link.icon}" class="w-6 h-6 mr-3 text-blue-400"></i>
                <span class="text-lg font-medium text-gray-200">${link.title}</span>
            </div>
            <i data-lucide="external-link" class="w-5 h-5 text-gray-500 group-hover:text-gray-300"></i>
        </a>
    `).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="en" class="dark">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Lazuk | Links</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <script src="https://unpkg.com/lucide@latest"></script>
            <style>
                body { background-color: #0f172a; }
            </style>
        </head>
        <body class="flex flex-col items-center justify-center min-h-screen p-6 text-gray-100">
            <div class="w-full max-w-md">
                <div class="text-center mb-8">
                   ${avatarHtml}
                    <h1 class="text-2xl font-bold">@lazuk</h1>
                    <p class="text-gray-400 mt-2">QA Automation Engineer | Java | Kotlin</p>
                </div>

                <nav>
                    ${linksHtml}
                </nav>

                <footer class="mt-12 text-center text-gray-500 text-sm">
                    &copy; 2026 lazuk.me
                </footer>
            </div>

            <script>
                lucide.createIcons();
            </script>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Stylish TS Server is running on port ${port}`);
});