# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app



FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/prod/node_modules node_modules
COPY . .
ENV NODE_ENV=production


FROM base AS release

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/server.ts .
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/config ./config
COPY --from=prerelease /usr/src/app/controllers ./controllers
COPY --from=prerelease /usr/src/app/middleware ./middleware
COPY --from=prerelease /usr/src/app/models ./models
COPY --from=prerelease /usr/src/app/routes ./routes
COPY --from=prerelease /usr/src/app/services ./services
COPY --from=prerelease /usr/src/app/share ./share
COPY --from=prerelease /usr/src/app/utils ./utils

# run the app
USER bun
EXPOSE 3000/tcp

ENTRYPOINT [ "bun", "run", "server.ts"]