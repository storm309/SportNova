// Skip .gitignore files while pushing

git add . ':!backend/.gitignore' ':!frontend/.gitignore'
git commit -m "Push without gitignore files"
git push

// Agar .gitignore files pehle se repo me push ho chuki ho

git rm --cached backend/.gitignore
git rm --cached frontend/.gitignore
git commit -m "Remove gitignore files from repo"
git push
