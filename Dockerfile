FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ git ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN node build

RUN cp -r /app/databases/schemas /app/_schemas \
    && mkdir -p /app/config /app/databases /app/logs /tmp \
    && chown -R node:node /app /tmp

USER node

EXPOSE 8000
CMD cp -rn /app/_schemas /app/databases/schemas 2>/dev/null; exec node pokemon-showdown 8000
