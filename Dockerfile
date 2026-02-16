FROM nginx:alpine

# Eliminamos la config y archivos por defecto
RUN rm -rf /usr/share/nginx/html/*

# Copiamos el build de Vite
COPY dist/ /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
