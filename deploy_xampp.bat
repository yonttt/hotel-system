@echo off
echo ==============================================
echo Deploying Hotel System to XAMPP
echo ==============================================

set XAMPP_HTDOCS=c:\xampp\htdocs

if not exist "%XAMPP_HTDOCS%" (
    echo Error: XAMPP htdocs folder not found at %XAMPP_HTDOCS%
    echo Please make sure XAMPP is installed on your C: drive.
    exit /b
)

echo.
echo [1/3] Building Admin Frontend (hotel-react-frontend)...
cd hotel-react-frontend
call npm install
call npm run build
if exist "%XAMPP_HTDOCS%\admin" rmdir /S /Q "%XAMPP_HTDOCS%\admin"
mkdir "%XAMPP_HTDOCS%\admin"
xcopy /E /I /Y dist "%XAMPP_HTDOCS%\admin"
cd ..

echo.
echo [2/3] Building Website Frontend (WEBSITE-Hotel)...
cd WEBSITE-Hotel
call npm install
call npm run build
if exist "%XAMPP_HTDOCS%\website" rmdir /S /Q "%XAMPP_HTDOCS%\website"
mkdir "%XAMPP_HTDOCS%\website"
xcopy /E /I /Y dist "%XAMPP_HTDOCS%\website"
cd ..

echo.
echo [3/3] Deployment complete!
echo.
echo ----------------------------------------------
echo IMPORTANT: XAMPP Proxy Configuration Required
echo ----------------------------------------------
echo To make the API work, add the following at the bottom
echo of your XAMPP Apache config: c:\xampp\apache\conf\httpd.conf
echo.
echo ProxyPass /api http://127.0.0.1:8000/api
echo ProxyPassReverse /api http://127.0.0.1:8000/api
echo.
echo And don't forget to run your Python backend:
echo python hotel-python-backend/run.py
echo.
