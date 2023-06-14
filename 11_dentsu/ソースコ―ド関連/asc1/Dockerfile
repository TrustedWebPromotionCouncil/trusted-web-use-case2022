ARG VARIANT="3.10-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/python:0-${VARIANT}

USER vscode

RUN echo "export PROMPT_DIRTRIM=2" >> ~/.bashrc
RUN echo 'export PS1="\w$ "' >> ~/.bashrc

RUN echo "set editing-mode emacs" >> ~/.inputrc
RUN echo "set completion-ignore-case off" >> ~/.inputrc
RUN echo "set show-all-if-unmodified on" >> ~/.inputrc
RUN echo '"\\C-p": history-search-backward' >> ~/.inputrc
RUN echo '"\\C-n": history-search-forward' >> ~/.inputrc
RUN echo '"\\e[A": history-search-backward' >> ~/.inputrc
RUN echo '"\\e[B": history-search-forward' >> ~/.inputrc
