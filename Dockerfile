FROM nginx:alpine

# Copia os arquivos estáticos da aplicação para o diretório servido pelo Nginx
COPY index.html funcionario.js app.js /usr/share/nginx/html/

EXPOSE 80
