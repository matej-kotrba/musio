FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /usr/src/app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --no-frozen-lockfile
RUN pnpm run -r build

# Backend stage
FROM base AS backend
WORKDIR /app

COPY --from=build /usr/src/app/package.json /app/
COPY --from=build /usr/src/app/pnpm-workspace.yaml /app/
COPY --from=build /usr/src/app/pnpm-lock.yaml /app/

COPY --from=build /usr/src/app/apps/backend/package.json /app/apps/backend/
COPY --from=build /usr/src/app/packages/shared /app/packages/shared
COPY --from=build /usr/src/app/apps/backend/src /app/apps/backend/

WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --no-frozen-lockfile

COPY --from=build /usr/src/app/apps/backend/dist /app/apps/backend/dist

WORKDIR /app/apps/backend

EXPOSE 5173
CMD ["pnpm", "start"]

# UI stage
# FROM base AS ui
# WORKDIR /app

# COPY --from=build /usr/src/app/package.json /app/
# COPY --from=build /usr/src/app/pnpm-workspace.yaml /app/
# COPY --from=build /usr/src/app/pnpm-lock.yaml /app/

# COPY --from=build /usr/src/app/apps/ui/package.json /app/apps/ui/
# COPY --from=build /usr/src/app/apps/ui/.output /app/apps/ui/.output
# COPY --from=build /usr/src/app/apps/ui/public /app/apps/ui/public
# COPY --from=build /usr/src/app/packages/shared /app/packages/shared

# WORKDIR /app
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --no-frozen-lockfile

# WORKDIR /app/apps/ui
# EXPOSE 3000
# CMD ["pnpm", "start"]