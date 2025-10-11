// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/svgs/logo.svg" />
          <title>Musio - The Ultimate Music Trivia Party Game</title>
          <meta
            name="description"
            content="Musio is a music trivia game designed to turn gatherings into unforgettable experiences. Players take turns picking songs, guessing their titles, and earning points to become the ultimate Musio champion!"
          />
          <meta name="theme-color" content="#1a1b1e" />
          <meta property="og:title" content="Musio - The Ultimate Music Trivia Party Game" />
          <meta
            property="og:description"
            content="Challenge your friends and see who knows the most about music! Create a lobby, pick your favorite songs, and let the guessing begin."
          />
          <meta property="og:image" content="https://musio-ui.vercel.app/meta_bg.png" />
          <meta property="og:url" content="https://musio-ui.vercel.app" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Musio - The Ultimate Music Trivia Party Game" />
          <meta
            name="twitter:description"
            content="Who's the music expert in your group? Find out with Musio, the ultimate music trivia party game."
          />
          <meta name="twitter:image" content="https://musio-ui.vercel.app/meta_bg.png" />
          <link rel="canonical" href="https://musio-ui.vercel.app" />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
