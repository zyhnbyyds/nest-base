-- 确保用户允许从任意主机连接
CREATE USER IF NOT EXISTS 'nest-timer'@'%' IDENTIFIED BY 'yujiezhang187332';
GRANT ALL PRIVILEGES ON nestjs_db.* TO 'nest-timer'@'%';
FLUSH PRIVILEGES;
