FROM node:16.18

ENV PORT=3000

COPY . /frontend-react-js
COPY frontend.sh /usr/bin/
RUN chmod +x /usr/bin/frontend.sh
WORKDIR /frontend-react-js
RUN npm install
EXPOSE ${PORT}
ENTRYPOINT [ "/usr/bin/frontend.sh" ]