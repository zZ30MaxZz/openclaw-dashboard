# OpenClaw Mission Control Dashboard

A cyberpunk-themed Mission Control dashboard for the OpenClaw AI agent orchestration platform. Built with Next.js 15, React Server Components, and a futuristic UI design.

![OpenClaw Dashboard](https://img.shields.io/badge/OpenClaw-Mission%20Control-00f3ff?style=for-the-badge&logo=react&logoColor=white)
![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)

## 🚀 Features

### 🎮 Mission Control Modules
- **Agents** - Real-time agent monitoring & management
- **Tasks** - Queue, running, completed, and failed tasks
- **Approvals** - Human-in-the-loop approval workflows
- **Memory** - Vector store collections & memory search
- **Content** - Content generation & management
- **Calendar** - Event scheduling & deadlines
- **Projects** - Project tracking & progress monitoring
- **System** - Hardware monitoring & logs
- **Team** - Team collaboration & communication
- **Docs** - Documentation & knowledge base
- **Office** - Virtual office & environment control
- **Feedback** - User feedback & improvement tracking

### 🎨 Cyberpunk Visual Theme
- Dark background with neon cyan, purple, and magenta accents
- Glowing borders & glass-like panels
- Futuristic grid background effects
- Responsive design for desktop, tablet, and mobile

### 🏗️ Tech Stack
- **Next.js 15** (App Router, React Server Components)
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Reusable UI components
- **Server Actions** - Data mutations without API routes
- **Responsive Design** - Fully responsive across all devices

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/openclaw-dashboard.git
cd openclaw-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## 🛠️ Architecture

### Project Structure
```
openclaw-dashboard/
├── app/                    # Next.js 15 App Router
│   ├── layout.tsx         # Root layout with sidebar
│   ├── page.tsx           # Dashboard homepage
│   └── globals.css        # Cyberpunk theme styles
├── components/
│   ├── sidebar.tsx        # Navigation sidebar
│   └── ui/               # Reusable UI components
│       ├── card.tsx      # Glass panel cards
│       └── button.tsx    # Neon buttons
├── lib/
│   ├── data.ts           # Mock data & types
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

### Key Design Decisions
1. **Server Components by Default** - All pages are RSC unless real-time updates are needed
2. **Server Actions for Mutations** - All data changes use Server Actions
3. **Modular Route Architecture** - Each module is an independent route
4. **Responsive-First Design** - Mobile, tablet, and desktop layouts
5. **Cyberpunk Aesthetics** - Immersive futuristic interface

## 🎯 Usage

### Managing AI Agents
1. Navigate to the **Agents** module
2. View agent status (idle, running, paused, error)
3. Start/stop/restart agents
4. Assign tasks to specific agents
5. Monitor CPU and memory usage

### Task Orchestration
1. Go to the **Tasks** module
2. View task queue and running tasks
3. Monitor progress in real-time
4. Handle failed tasks with retry options

### Human Approvals
1. Access the **Approvals** module
2. Review pending approval requests
3. Approve, reject, or edit requests
4. Set priority levels for urgent tasks

## 📱 Responsive Design

- **Desktop**: Full sidebar with mission control grid
- **Tablet**: Collapsible sidebar with stacked widgets
- **Mobile**: Bottom navigation with single-column layout
- **Widgets**: Automatically reorganize using CSS Grid
- **Tables**: Support horizontal scrolling on small screens

## 🔧 Development

### Adding New Modules
1. Create a new route in `app/(module-name)/page.tsx`
2. Add the module to the sidebar in `components/sidebar.tsx`
3. Define types in `lib/data.ts` if needed
4. Implement Server Actions for data mutations

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow the cyberpunk color palette:
  - Primary: `#00f3ff` (neon cyan)
  - Secondary: `#9d00ff` (neon purple)
  - Accent: `#ff00ff` (neon magenta)
- Apply glass panel effects with `glass-panel` class
- Add glow effects with `glow-primary`, `glow-secondary`, `glow-accent`

## 🚀 Deployment

### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/openclaw-dashboard)

### Self-Hosting
1. Build the application: `npm run build`
2. Start the production server: `npm start`
3. Configure reverse proxy (nginx, Apache, Caddy)
4. Set environment variables as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/openclaw-dashboard/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/openclaw-dashboard/discussions)
- **Email**: [your-email@example.com](mailto:your-email@example.com)

---

Built with ❤️ for the OpenClaw AI orchestration platform. Embrace the future of AI agent management.