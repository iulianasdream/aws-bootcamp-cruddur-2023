FROM python:3.10-slim-buster

# Inside Container
# make a new folder inside container
WORKDIR /backend-flask

# Outside container -> Inside container
COPY requirements.txt requirements.txt
# Inside container
# install python libraries needed for the app
RUN pip3 install -r requirements.txt

# Outside container  -> Inside container
# . means everything in the current directory
# first . /backend-flask outside container
# second . /backend-flast inside container
COPY . .
COPY backend.sh /usr/bin/
RUN chmod +x /usr/bin/backend.sh

# Inside container
ENV FLASK_ENV=development

EXPOSE ${PORT}
ENTRYPOINT [ "/usr/bin/backend.sh" ]