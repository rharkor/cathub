echo "🚀 Configuring ZSH ..."
# Make sure zsh is already installed
if ! [ -x "$(command -v zsh)" ]; then
    echo "❌ ZSH is not installed. Please install ZSH and run this script again."
    echo "https://github.com/ohmyzsh/ohmyzsh/wiki/Installing-ZSH"
    exit 1
fi

# Make a backup of the current .zshrc file
if [ -f "${ZDOTDIR:-$HOME}/.zshrc" ]; then
    cp ${ZDOTDIR:-$HOME}/.zshrc ${ZDOTDIR:-$HOME}/.zshrc.bak
fi

# Copy the configuration file to the home directory
cp .devcontainer/.zshrc ${ZDOTDIR:-$HOME}/.zshrc

# Install zsh syntax highlighting
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
echo "" >>~/.zshrc
echo "source ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >>${ZDOTDIR:-$HOME}/.zshrc

# Install zsh autosuggestions
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
