pname="node urpg-battle-bot-app.js"

pid=`/bin/ps -fu $USER|grep "$pname" | grep -v "grep" | awk '{print $2}'`
if [[ $pid -gt 0 ]]; then
  kill $pid
  while kill -0 $pid; do
    sleep 1
  done
fi

yum install -y nodejs npm
cd /home/ec2-user/urpg-battle-bot-calc
npm install
npm run build

cd /home/ec2-user/urpg-battle-bot
npm install
nohup npm run start &