#!/home/ubuntu/.nodebrew/current/bin/node
const fs = require("fs");
const util = require("util");
const twitter = require("twitter");
let path = require("path");
const readline = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout
});

let pathdata = process.argv[1];
pathdata = path.dirname(pathdata);
let key = fs.readFileSync(__dirname + "/key.txt", "utf8");
if (key === "") {
	console.log("https://apps.twitter.com/ からapi-keyを取得し,keyset.jsを使用してキーを登録してください。");
	process.exit();
} else {
	key = key.split(",");
	key = new twitter({
		consumer_key: key[0],
		consumer_secret: key[1],
		access_token_key: key[2],
		access_token_secret: key[3]
	});
};

//文字色
const black = '\u001b[30m';
const red = '\u001b[31m';
const green = '\u001b[32m';
const yellow = '\u001b[33m';
const blue = '\u001b[34m';
const magenta = '\u001b[35m';
const cyan = '\u001b[36m';
const white = '\u001b[37m';
const reset = '\u001b[0m';



let listgettemp
listget(undefined, "followers")

function listget(num, what) {
	console.log(what + "get")
	key.get(what + '/list',
		{ count: 200, cursor: num },
		function (error, data, log) {
			console.log(error)
			/*
			if (error.message === "Rate limit exceeded"){
				console.log("API制限")
				process.exit()
			}
			*/
			if (listgettemp === undefined) {
				listgettemp = data
			} else {
				for (i = 0; i < data.users.length; i++) {
					listgettemp.users.push(data.users[i])
				}
			}
			console.log(data.users[0].name)
			if (data.next_cursor_str != "0") {
				listget(data.next_cursor_str, what)
			} else {
				console.log(what + " " + listgettemp.users.length)
				listgettemp = JSON.stringify(listgettemp, undefined, 4);
				fs.writeFile(what + ".json", listgettemp)
				if (what === "followers") {
					listgettemp = undefined
					listget(undefined, "friends")
				} else {

				}
			}
		})
};







///////////////////////////////////////




/*
licenses

mitライセンスのnode-twitterを利用させていただきました。

MIT License Copyright (c) 2016 Desmond Morris

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/