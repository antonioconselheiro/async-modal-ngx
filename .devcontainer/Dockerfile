FROM node:20

RUN npm install eslint typescript @angular/cli -g

WORKDIR /async-modal-ngx

COPY ./.gitconfig /root/.gitconfig
COPY ./.ssh /root/.ssh

ENV LANG C.UTF-8
ENV TZ America/Sao_Paulo

EXPOSE 9229
EXPOSE 4200

# The run the start script
CMD [ "/bin/bash" ]
