FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bullseye

# Install additional OS packages.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends git zsh nano vim gnupg software-properties-common

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# Install more global node modules
RUN su node -c "npm install -g npm@latest"
RUN su node -c "npm install -g turbo"

# https://pnpm.io/fr/installation#in-a-docker-container
# RUN su node -c "wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -"

# Install git lfs
RUN curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash
RUN apt-get install -y git-lfs