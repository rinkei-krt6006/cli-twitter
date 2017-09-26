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

var black = '\u001b[30m';
var red = '\u001b[31m';
var green = '\u001b[32m';
var yellow = '\u001b[33m';
var blue = '\u001b[34m';
var magenta = '\u001b[35m';
var cyan = '\u001b[36m';
var white = '\u001b[37m';

var reset = '\u001b[0m';

var shell = []
shell = process.argv

var twinum = -1;
var twiid = [];
var twitxt = [];
var mode = undefined
var reply = ""

let todolist = ["tweet", "RT", "Fav", "copy"];//,"reply"];
let doing = ["t", "r", "f"];

function rt() {

}

if (shell[2] === "h") {
	//ヘルプ
	console.log("h:ヘルプ\r\ntl:TLを流す\r\n一致しない場合:第二引数をツイート後即終了");
} else {
	if (shell[2] === "tl") {
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
				twitxt.push(data.text)

				var temp = "No." + twinum + "\r\n"
				temp += magenta + data.user.name + " @" + data.user.screen_name + "\r\n"
				temp += white + data.text + "\r\n"
				temp += blue + "via " + tmp + "\r\n"
				temp += data.user.created_at + reset + "\r\n"

				console.log(temp);
			})
		});

		//TL上でコマンド入力
		readline.on('line', function (line) {
			if (line === "h") {
				if (mode === undefined) {
					console.log("r=retweet \r\n f=Favorite \r\n c=copy")
				} else {
					console.log("Number=No,*")
				}


			} else {
				//モード判定
				if (mode === "replynum") {
					mode = "replymsg"
					reply = twiid[line]
					console.log("repry msg?")
				} else {
					if (mode === "replymsg") {
						mode = undefined
						console.log(cyan + "send...")
						key.post('statuses/update',
							{ status: line, in_reply_to_status_id: reply },
							function (error, tweet, response) {
								if (!error) {
									//console.log(tweet)
									console.log(green + "tweet success\r\n" + reset)
								} else {
									console.log(red + "tweet error\r\n" + reset)
								};
								reply=""
							}
						);
					} else {
						if (mode === "rt") {
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

						} else {
							if (mode === "fav") {
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

							} else {
								if (mode === "copy") {
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

								} else {
									//コマンド解析
									if (line === "r") {
										mode = "rt";
										console.log("RT Number?")

									} else {
										if (line === "f") {
											mode = "fav";
											console.log("Fav Number?")

										} else {
											if (line === "c") {
												mode = "copy"
												console.log("Copy Number?")

											} else {
												if (line === "m") {
													mode = "replynum"
													console.log("reply Number?")
												} else {
													//TL上ツイート
													console.log(cyan + "send...")
													key.post('statuses/update',
														{ status: line },
														function (error, tweet, response) {
															if (!error) {
																//console.log(tweet)
																console.log(green + "tweet success\r\n" + reset)
															} else {
																console.log(red + "tweet error\r\n" + reset)
															};
														}
													);
												};//TL上ツイート
											};//↓入力判定
										};
									};//↑入力判定
								};//↓モード判定
							};
						};
					};
				};
			};//↑モード判定
		});//入力

	} else {
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
	};

};


/*
licenses

mitライセンスのnode-twitterを利用させていただきました。

MIT License Copyright (c) 2016 Desmond Morris

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/