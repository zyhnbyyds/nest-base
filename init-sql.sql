-- 创建用户并允许从任意主机连接
CREATE USER 'nest-timer'@'%' IDENTIFIED BY 'yujiezhang187332';
GRANT ALL PRIVILEGES ON nestjs_db.* TO 'nest-timer'@'%';
FLUSH PRIVILEGES;
