FROM node:22-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends git jq python3 && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate
WORKDIR /work
CMD ["bash"]
