#!/bin/bash
set -e

ENV=$1

# Cur dir relative to root
CUR_DIR=".devcontainer"


#* NODE_MODULES *#
if [ "$ENV" == "devcontainer" ]; then
    echo "🔓 Changing node_modules permissions"
    sudo chown node node_modules
fi

#* ZSH *#
# If the env is not equal to devcontainer then ask the use for the zsh installation
if [ "$ENV" != "devcontainer" ]; then
    echo "🚀 Do you want to configure ZSH? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        $CUR_DIR/configure-zsh.sh 1>/dev/null 2>&1
    fi
else
    $CUR_DIR/configure-zsh.sh 1>/dev/null 2>&1
fi

#* GIT HOOKS *#
echo "🔨 Installing git hooks..."
npm install --global git-conventional-commits 1>/dev/null 2>&1
git config core.hooksPath .git-hooks 1>/dev/null 2>&1

echo "🎉 Installing done!"
