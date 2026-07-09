Remove-Item -Recurse -Force "d:\code\.git" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "d:\code\travel-h5\.git" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "d:\code\travel-server\.git" -ErrorAction SilentlyContinue

git init -b main "d:\code"

$env:GIT_DIR = "d:\code\.git"
$env:GIT_WORK_TREE = "d:\code"

git add -A
git status
git commit -m "feat: 旅游推荐全栈项目 - 包含前端和后端"

git remote add origin https://github.com/Jiangqingfa001/travel-project.git
git push -u origin main