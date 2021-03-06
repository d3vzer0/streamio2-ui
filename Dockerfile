# Dockerfile as described on
# https://vuejs.org/v2/cookbook/dockerize-vuejs-app.html

# Installs the reternal-ui project deps during initial dep-stage
FROM node:14.15 as dependency-stage
WORKDIR /app
COPY package*.json ./
RUN npm install -g @quasar/cli
RUN npm install

# Stage building the Vue app
FROM dependency-stage as build-stage

COPY . .
RUN quasar build
 
# Runs output of reternal build-stage and hosts content
# via nginx service
FROM nginx:1.13.12-alpine as production-stage

COPY --from=build-stage /app/dist/spa/ /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint
WORKDIR /opt/vulnstreetbets
COPY entrypoint.sh . 
RUN chmod +x entrypoint.sh 

EXPOSE 80

ENTRYPOINT [ "./entrypoint.sh" ]
CMD ["nginx", "-g", "daemon off;"]