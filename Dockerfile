FROM node:20-bookworm-slim

WORKDIR /app

# UID/GID the container runs as. Default 1000 = the base image's `node` user (and
# home's ops user), so home builds are byte-for-byte unchanged. Override at build
# time when the host's ops/rsync user differs (e.g. Oracle's `ubuntu` is 1001) so
# /app is owned by the runtime user — otherwise PS's atomic config writes land a
# temp file (config/chatrooms.json.NEW) in an unwritable image-layer dir.
ARG SHOWDOWN_UID=1000
ARG SHOWDOWN_GID=1000

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ git ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN node build

RUN cp -r /app/databases/schemas /app/_schemas \
    && mkdir -p /app/config /app/databases /app/logs /tmp \
    && chown -R ${SHOWDOWN_UID}:${SHOWDOWN_GID} /app /tmp

USER ${SHOWDOWN_UID}:${SHOWDOWN_GID}

EXPOSE 8000
CMD cp -rn /app/_schemas /app/databases/schemas 2>/dev/null; exec node pokemon-showdown 8000
