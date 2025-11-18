# 🎵 Musio

Musio is a music trivia game designed to turn gatherings into unforgettable experiences. Players take turns picking songs, guessing their titles, and earning points. The player with the most points at the end becomes the ultimate Musio champion! 🎉

## 🛠️ Used Technologies

### UI

- **SolidStart**: Reactive UI framework.
- **TailwindCSS**: Utility-first CSS framework.

### Backend

- **Hono**: Lightweight web framework.
- **Zod**: Schema validation library.

## 📂 Project Structure

The project is a monorepo managed with `pnpm` workspaces and consists of the following packages:

- **apps/backend**: The backend server built with Hono.
- **apps/ui**: The frontend application built with SolidJS.
- **packages/shared**: Shared utilities and types used across the project.

## 🚀 Prerequisites

- Node.js 20 or later
- pnpm (Package Manager)
- Docker (for backend containerization)

## 🛠️ Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd musio
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development servers:

   - For the backend:
     ```bash
     pnpm dev:hono
     ```
   - For the frontend:
     ```bash
     pnpm dev:solid
     ```
   - Or start both:
     ```bash
     pnpm dev
     ```

4. Open the application in your browser:
   ```
   http://localhost:3000
   ```

## 🐳 Running Backend with Docker

The backend is dockerized for easy deployment. Follow these steps (or use Docker Desktop) to run it with Docker:

1. Build the Docker image:

   ```bash
   docker build -t musio-backend -f .\Dockerfile .
   ```

2. Run the container:

   ```bash
   docker run -p 5173:5173 musio-backend
   ```

3. Access the backend at:
   ```
   http://localhost:5173
   ```

## 📦 Building and Deployment

To build the project for production:

```bash
pnpm build
```

To start the production server:

```bash
pnpm start
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes and push the branch.
4. Open a pull request.

## 📜 License

This project is licensed under the ISC License.

## Legal / Attribution

This project streams 30-second audio previews directly from Apple's iTunes Search API (no audio files are stored). Previews and metadata are provided by iTunes Search API.  
Links to the store use Apple's `trackViewUrl`. This project is not affiliated with or endorsed by Apple Inc.  
See: https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/ and https://www.apple.com/legal/internet-services/itunes/ for more information.
