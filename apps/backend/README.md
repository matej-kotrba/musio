# Backend

This is the backend for the Musio application, built with Hono.

## Setup and Running

### With Docker

The easiest way to run the backend is by using Docker.

1.  **Build the Docker image:**

    ```bash
    docker-compose build backend
    ```

2.  **Run the container:**

    ```bash
    docker-compose up backend
    ```

    The backend will be available at `http://localhost:5173`.

### Without Docker

You can also run the backend locally without Docker.

1.  **Install dependencies:**

    This project uses `pnpm` as a package manager. Install dependencies from the root of the monorepo:

    ```bash
    pnpm install
    ```

2.  **Build the application:**

    From the root of the monorepo, run the build command:

    ```bash
    pnpm build
    ```

    This will build both the backend and the UI.

3.  **Run the production server:**

    Navigate to the backend app directory and run the start script:

    ```bash
    cd apps/backend
    pnpm start
    ```

    The backend will be available at `http://localhost:5173`.

    _Note: The backend expects the `UI_URL` environment variable to be set. For local development, you can set it in the `.env.dev` file._

    > **Warning:** When specifying the `UI_URL`, ensure it does not have a trailing slash.
    >
    > -   Correct: `UI_URL=http://localhost:3000`
    > -   Incorrect: `UI_URL=http://localhost:3000/`

### Exposing with ngrok

If you want to expose your local backend to the internet, you can use `ngrok`. This is particularly useful for testing with devices or services that can't access your local machine directly.

This application is configured to work well with `ngrok` out of the box due to specific header configurations. Other tunneling services might not work as expected.

1.  **Install ngrok:**

    Follow the instructions on the [ngrok website](https://ngrok.com/download) to download and install it.

2.  **Start the tunnel:**

    Once your local backend is running, open a new terminal and run the following command:

    ```bash
    ngrok http http://localhost:5173
    ```

    `ngrok` will provide you with a public URL that forwards to your local backend.
