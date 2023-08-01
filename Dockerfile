FROM 10.10.20.104/intest/docker/nginx:latest
ADD  dist /usr/share/nginx/html/
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
