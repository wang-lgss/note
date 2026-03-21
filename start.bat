@echo off
echo 启动笔记应用...
echo.

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 错误: 未找到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

echo 安装后端依赖...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo 后端依赖安装失败
    pause
    exit /b 1
)

echo 安装前端依赖...
cd ..\frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo 前端依赖安装失败
    pause
    exit /b 1
)

echo.
echo ✅ 依赖安装完成
echo.
echo 启动后端服务器...
cd ..\backend
start cmd /k npm start

timeout /t 2 /nobreak

echo 启动前端开发服务器...
cd ..\frontend
start cmd /k npm start

echo.
echo ✅ 应用已启动
echo 后端: http://localhost:5000
echo 前端: http://localhost:3000
echo.
pause
