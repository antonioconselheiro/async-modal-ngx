FROM node:22

RUN npm install eslint typescript @angular/cli -g
RUN npm config set legacy-peer-deps true
WORKDIR /async-modal-ngx

# Keyboard & Timezone
ENV LANG=C.UTF-8
ENV LANGUAGE=C.UTF-8
ENV LC_ALL=C.UTF-8
ENV TZ=America/Sao_Paulo
ENV DEBUG_COLORS=true
ENV FORCE_COLOR=true

EXPOSE 9229
EXPOSE 4200

# The run the start script
CMD [ "/bin/bash" ]
