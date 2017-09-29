#!/home/ubuntu/.nodebrew/current/bin/node

var util = require('util')
var twitter = require('twitter')
var readline = require("readline").createInterface({
	input: process.stdin,
	output: process.stdout
});

//api-key
var key = new twitter({
	consumer_key: '',
	consumer_secret: '',
	access_token_key: '',
	access_token_secret: ''
});


//文字色
var black = '\u001b[30m';
var red = '\u001b[31m';
var green = '\u001b[32m';
var yellow = '\u001b[33m';
var blue = '\u001b[34m';
var magenta = '\u001b[35m';
var cyan = '\u001b[36m';
var white = '\u001b[37m';
var reset = '\u001b[0m';
//記憶域
let twinum = -1;
let twiid = [];
let twitxt = [];
let scname = [];
let replynum = "";
let mode = undefined;

var shell = [];
shell = process.argv;
switch (shell[2]) {
	case "h":
		//ヘルプ
		console.log("h:ヘルプ\r\ntl:TLを流す\r\n一致しない場合:第二引数をツイート後即終了");
		break;
	case "tl":
		//TLを流す
		console.log(green + " #    #  " + cyan + "######  " + yellow + "#       " + red + " ####   " + white + " ####   " + magenta + "#    #  " + blue + "######" + reset)
		console.log(green + " #    #  " + cyan + "#       " + yellow + "#       " + red + "#    #  " + white + "#    #  " + magenta + "##  ##  " + blue + "#     " + reset)
		console.log(green + " #    #  " + cyan + "#####   " + yellow + "#       " + red + "#       " + white + "#    #  " + magenta + "# ## #  " + blue + "##### " + reset)
		console.log(green + " # ## #  " + cyan + "#       " + yellow + "#       " + red + "#       " + white + "#    #  " + magenta + "#    #  " + blue + "#     " + reset)
		console.log(green + " ##  ##  " + cyan + "#       " + yellow + "#       " + red + "#    #  " + white + "#    #  " + magenta + "#    #  " + blue + "#     " + reset)
		console.log(green + " #    #  " + cyan + "######  " + yellow + "######  " + red + " ####   " + white + " ####   " + magenta + "#    #  " + blue + "######" + reset)
		console.log("\r\ntimeline mode\r\n");

		key.stream('user', function (stream) {
			stream.on("data", function (data) {

				var tmp = data.source;
				tmp = tmp.split('">');
				tmp = tmp[1].split('</a>');

				twinum = twinum + 1;
				twiid.push(data.id_str);
				twitxt.push(data.text);
				scname.push(data.user.screen_name);

				var temp = "No." + twinum + "\r\n"
				temp += magenta + data.user.name + " @" + data.user.screen_name + "\r\n"
				temp += white + data.text + "\r\n"
				temp += blue + "via " + tmp + "\r\n"
				temp += data.user.created_at + reset + "\r\n"

				console.log(temp);
			})
		});

		//↓TLモード内コマンド判定式------------------
		readline.on('line', function (line) {

			switch (mode) {
				case "replynum":
					mode = "replymsg"
					replynum = line;
					console.log("repry msg?");
					break;

				case "replymsg":
					mode = undefined
					console.log(cyan + "send...")
					key.post('statuses/update',
						{ status: "@" + scname[replynum] + " " + line, in_reply_to_status_id: twiid[replynum] },
						function (error, tweet, response) {
							if (!error) {
								//console.log(tweet)
								console.log(green + "tweet success\r\n" + reset)
							} else {
								console.log(red + "tweet error\r\n" + reset)
							};
							replyid = "";
						}
					);
					break;
				case "rt":
					//RT
					mode = undefined
					key.post('statuses/retweet/' + twiid[line] + '.json',
						function (error) {
							if (!error) {
								console.log(green + "\r\nRT success\r\n" + reset);
							} else {
								console.log(red + "\r\nRT error\r\n" + reset);
							};
						});
					break;
				case "fav":
					//ふぁぼ
					mode = undefined
					key.post('favorites/create.json?id=' + twiid[line] + "&include_entities=true",
						function (error) {
							if (!error) {
								console.log(green + "\r\nFav success\r\n" + reset);
							} else {
								console.log(red + "\r\nFav error\r\n" + reset);
							};
						});
					break;
				case "copy":
					//パクツイ
					mode = ""
					console.log(cyan + "send...")
					key.post('statuses/update',
						{ status: twitxt[line] },
						function (error, tweet, response) {
							if (!error) {
								//console.log(tweet)
								console.log(green + "tweet success\r\n" + reset)
							} else {
								console.log(red + "tweet error\r\n" + reset)
							};
						}
					);
					break;
				default:
					switch (line) {
						case "h":
							if (mode === undefined) {
								console.log(" r=retweet \r\n f=Favorite \r\n c=copy \r\n m=reply(message)")
							} else {
								console.log("Number=No,*");
							};
							break;
						case "r":
							mode = "rt";
							console.log("RT Number?");
							break;
						case "f":
							mode = "fav";
							console.log("Fav Number?");
							break;
						case "c":
							mode = "copy";
							console.log("Copy Number?");
							break;
						case "m":
							mode = "replynum";
							console.log("reply Number?");
							break;
						default:
							console.log(cyan + "send...");
							key.post('statuses/update',
								{ status: line },
								function (error, tweet, response) {
									if (!error) {
										//console.log(tweet)
										console.log(green + "tweet success\r\n" + reset);
									} else {
										console.log(red + "tweet error\r\n" + reset);
									};
								}
							);
							break;
					}//swich mode
					break;
			};//switch line
		});//入力
		//↑TLモード内コマンド判定式----------------------------
		break;
	default:
		//ツイート後即終了
		console.log(cyan + 'send...' + reset)
		key.post('statuses/update',
			{ status: shell[2] },
			function (error, tweet, response) {
				if (!error) {
					//console.log(tweet)
					console.log(green + "success" + reset)
				} else {
					console.log(red + "error" + reset)
					console.log(error)
				};
				process.exit();
			});
		break;

};//switch shell

/*
licenses

mitライセンスのnode-twitterを利用させていただきました。

MIT License Copyright (c) 2016 Desmond Morris

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/