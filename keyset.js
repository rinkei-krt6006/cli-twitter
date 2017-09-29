const fs = require("fs");
let readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});
console.log("apikey登録プログラム\r\n既にキーが登録されていた場合削除されますのでご注意ください。\r\nconsumer_key を入力してください。");
mode = "consumer_key";

let keytemp = []
readline.on('line', function (line) {
  if (line === "clear") {
    fs.writeFileSync("key.txt", "", 'utf8');
    console.log("apikeyデータを削除しました");
  } else {
    switch (mode) {
      case "lock":
        console.log("apikeyのデータがあります。書き換えたい場合、clear と入力してください。");
        console.log("consumer_key を入力してください。");
        mode = "consumer_key";
        break;
      case "consumer_key":
        keytemp.push(line);
        mode = "consumer_secret";
        console.log("consumer_secretを入力してください");
        break;
      case "consumer_secret":
        keytemp.push(line);
        mode = "access_token_key";
        console.log("access_token_key を入力してください");
        break;
      case "access_token_key":
        keytemp.push(line);
        mode = "access_token_secret";
        console.log("access_token_secret を入力してください");
        break;
      case "access_token_secret":
        keytemp.push(line);
        fs.writeFileSync("key.txt", keytemp[0] + "," + keytemp[1] + "," + keytemp[2] + "," + keytemp[3], 'utf8');
        console.log("登録完了しました");
        process.exit();
    };
  };
});
