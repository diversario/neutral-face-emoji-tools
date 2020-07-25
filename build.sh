#!/bin/zsh
env
if [[ -z ${SRCROOT} ]]; then
  SRCROOT="Thinking Face Emoji Tools"
else
  pushd ${SRCROOT}/..
fi

eval "$(nodenv init -)"

nodenv shell 12.0.0

npm run build

cat <<EOF > ${SRCROOT}/Thinking\ Face\ Emoji\ Tools\ Extension/script.js
document.addEventListener("DOMContentLoaded", function(event) {
$(cat dist/content.js)
});
EOF
