const {VK} = require('vk-io'); 
const {Keyboard} = require('vk-io');
const vk = new VK(); 
const {updates, api, snippets} = vk; 
const fs = require('fs');
const { upload } = vk;
const request = require('request-promise');
const chalk = require('chalk');
const mobs = require('./mobs.json')
const base = require('./base.json')
const beseda = require('./beseda.json')
const duel = require('./duel.json')

vk.setOptions({ 
	token: "токен", 
	apiMode: "parallel", 
	pollingGroupId: айди группы
});

const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(800, 800)
const Canvas = require('canvas');
const ctx = canvas.getContext('2d')
const path = require('path')

function updateWidget() {
	var tops = []
	for(let i in base.p){
		if(base.p[i].rank < 20){
			tops.push({
				id: i,
				idvk: base.p[i].id,
				lvl: base.p[i].lvl
			});
		}
	}
	tops.sort(function(a, b) {
		if (b.lvl > a.lvl) return 1
		if (b.lvl < a.lvl) return -1
		return 0
	})

	var script = {
		title: `Лучшие игроки`,
		head: [
			{
				text: 'Ник игрока'
			},
			{
				text: 'Коины',
				align: 'right'
			},
			{
				text: 'Уровень',
				align: 'right'
			}
		],
		body: []
	}

	for (var g = 0; g < 5; g++) {
		if (tops.length > g) {
			let ups = g;
			ups += 1;
			if (g <= 8) ups = `${ups}`
			if (g == 9) ups = `10`
			script.body.push([
				{
					icon_id: `id${tops[g].idvk}`,
					text: `${base.p[tops[g].id].nick}`,
					url: `vk.com/id${tops[g].idvk}`
				},
				{
					text: `${utils.sp(base.p[tops[g].id].balance)}💰`
				},
				{
					text: `${utils.sp(tops[g].lvl)}лвл.`
				}
			])
		}
	}
	request.post({ 
		url: 'https://api.vk.com/method/appWidgets.update', 
		form: { 
			v: '5.103', 
			type: 'table', 
			code: `return ${JSON.stringify(script)};`, 
			access_token: '' // Специальный токен с уровнем доступа app_widgets 
	}},
	function(err, resp, body) {
	});
}

function nearhard(x, y, objectx, objecty, xobj, yobj, xobj1, yobj1) {
	let near = false
	x -= Number(objectx)
	y -= Number(objecty)
	if(x < xobj && x > xobj1) {
		if(y < yobj && y > yobj1) near = true
	}
	return near
}

function near(x, y, objectx, objecty) {
	let near = false
	x -= Number(objectx)
	y -= Number(objecty)
	if(x < 0) x = -x
	if(y < 0) y = -y
	if(x < 30 && y < 50) near = true
	return near
}

function rand(text) {
	let tts = Math.floor(text.length * Math.random())
	return text[tts]
}

setInterval(function(){ 
        fs.writeFileSync("./mobs.json", JSON.stringify(mobs, null, "\t")) 
}, 10000); // обновление базы данных

setInterval(function(){ 
        fs.writeFileSync("./beseda.json", JSON.stringify(beseda, null, "\t")) 
}, 10000); // обновление базы данных

setInterval(function(){ 
        fs.writeFileSync("./base.json", JSON.stringify(base, null, "\t")) 
}, 10000); // обновление базы данных

const rotateText = {
	0: "0⃣",
	1: "1⃣",
	2: "2⃣",
	3: "3⃣",
	4: "4⃣",
	5: "5⃣",
	6: "6⃣",
	7: "7⃣",
	8: "8⃣",
	9: "9⃣"
}

function nols(num) {
    if(num < 10) return('0' + num)
    if(num > 9) return(num)
}

function zapret(text) {
 	let text1 = text.toLowerCase();
 	let texts = 0;
 	let stat = false;
	var zaprets = /(пизда|ебут в жопу|соска|соски|сосёт|мамка|мамки|брат с сестрой|сперма|ебалка|вк бо т |сова не спит|сова никогда не спит|с о в а н е с п и т|сованикогданеспит|сова не спит никогда|вкботру|vkvot ru|vkbotru|vkbot|v k b o t . r u|в к бот|порно|botvk|ботвк|vkbot|кбот|bot vk|хентай|секс|пидр|трах|насилие|зоофил|бдсм|сирия|hentai|hentay|синий кит|самоубийство|террористы|слив|цп|cp|маленькие|малолетки|сучки|трах|ебля|изнасилование|блять|хуй|пошел нах|тварь|мразь|сучка|гандон|уебок|шлюх|паскуда|оргазм|девственницы|целки|рассовое|мелкие|малолетки|несовершеннолетние|ебля|хентай|sex|bdsm|ebl|trax|syka|shlux|инцест|iznas|мать|долбаеб|долбаёб|хуесос|сучка|сука|тварь|пездюк|хуй|шлюх|бог|сатана|мразь)/
	if (zaprets.test(text1) == true) { 
		texts = `📗 ➾ Некорректный запрос.` 
		stat = true;
	}
	var filter1 = /(http(s)?:\/\/.)?(www\.)?[-a-z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}/
	var filter2 = /(?!http(s)?:\/\/)?(www\.)?[а-я0-9-_.]{1,256}\.(рф|срб|блог|бг|укр|рус|қаз|امارات.|مصر.|السعودية.)/ 
	if (filter1.test(text1) == true || filter2.test(text1) == true) { 
		texts = `📗 ➾ Некорректный запрос.` 
		stat = true; 
	}
	return texts
 } 

function splitString(stringToSplit, separator) {
	var arrayOfStrings = stringToSplit.split(separator);
	return arrayOfStrings
}

const utils = { 
sp: (int) => { 
int = int.toString(); 
return int.split('').reverse().join('').match(/[0-9]{1,3}/g).join(',').split('').reverse().join(''); 
},
	random: (x, y) => {
		return y ? Math.round(Math.random() * (y - x)) + x : Math.round(Math.random() * x);
	},
pick: (array) => {
	return array[getRandomInRange(array.length - 1)];
}}

function getRandomInRange(min, max) { 
return Math.floor(Math.random() * (max - min + 1)) + min; 
}; //Функция выбора рандомного числа

setInterval(function(){
	for(let i in base.p){
		base.p[i].online = 0
	}
}, 120000)

setInterval(function(){
	if(base.c.pig > 9) return
	base.c.mobid += 1
	base.c.pig += 1
	mobs.mob[base.c.mobid] = {
		pig: 'pig.png',
		pig1: 'pig1.png',
		type: 1,
		hp: 15,
		world: 0,
		x: getRandomInRange(756, 1950),
		y: getRandomInRange(832, 1164),
		cent: 0
	}
}, 20000)

setInterval(function(){
	if(base.c.pig === 0) return
	for(let i in mobs.mob){
		let random = getRandomInRange(1, 4)
		if(random == 1){
			let proverka = Number(mobs.mob[i].y-30)
			if(proverka > 390){
				mobs.mob[i].y = Number(proverka)
			}
		}
		if(random == 2){
			let proverka = Number(mobs.mob[i].y+30)
			if(proverka < 1900){
				mobs.mob[i].y = Number(proverka)
			}
		}
		if(random == 3){
			let proverka = Number(mobs.mob[i].x+30)
			if(proverka < 2035){
				mobs.mob[i].cent = 0
				mobs.mob[i].x = Number(proverka)
			}
		}
		if(random == 4){
			let proverka = Number(mobs.mob[i].x-30)
			if(proverka > 721){
				mobs.mob[i].cent = 1
				mobs.mob[i].x = Number(proverka)
			}
		}
	}
}, 21000)

setInterval(function(){
	if(base.c.trees < 10){
		let kordsx = [Number(getRandomInRange(1600, 2000)), Number(getRandomInRange(830, 1170))]
		let kordsy = [Number(getRandomInRange(550, 1070)), Number(getRandomInRange(550, 800))]
		let random = getRandomInRange(1, 2)
		base.c.treesid += Number(1)
		base.c.trees += 1
		if(random == 1){
			mobs.objects.tree[base.c.treesid] = {
				coordsx: Number(kordsx[0]),
				coordsy: Number(kordsy[0]),
				hp: 10,
				dead: 0,
				hpp: 0
			}
		}
		if(random == 2){
			mobs.objects.tree[base.c.treesid] = {
				coordsx: Number(kordsx[1]),
				coordsy: Number(kordsy[1]),
				hp: 10,
				dead: 0,
				hpp: 0
			}
		}
	}
}, 20000)

vk.updates.use(async (context, next) => {
	if(context.isOutbox) return
	if(context.isGroup) return
	if(context.senderId === undefined) return
	if(!base.i[context.senderId]){
		var ctxs 
		base.c.id += 1
		base.i[context.senderId] = {
			id: base.c.id
		}
		let users = await vk.api.users.get({
			user_id: context.senderId,
			fields: 'photo_50'
		})
		base.p[base.c.id] = {
			exp: 0,
			offr: 0,
			lvl: 1,
			worlds: 0,
			caseopen: 0,
			online: 1,
			balance: 0,
			rank: 0,
			gun: 0,
			duel: 0,
			duelhp: 12,
			rassilka: 0,
			photo_50: `${users[0].photo_50}`,
			lvl: 1,
			swordhp: 2,
			pickaxehp: 1,
			axehp: 2,
			inventory: {
				wood: 0,
				sword: 1,
				pickaxe: 1,
				axe: 1,
				pig: 0
			},
			world: {
				x: 1352,
				y: 687,
				xd: 0,
				yd: 0
			},
			id: context.senderId,
			cent: 0,
			nick: `${users[0].last_name}`
		}
		context.send({
		message: `Спасибо за регистрацию в боте, для обучения подойдите к "NPC Лаура".\nhttps://vk.me/join/AJQ1d1CIKBYM72aC2iYOO708`,
		keyboard: Keyboard.keyboard([
			[
				Keyboard.textButton({
					label: `⠀`,
					color: Keyboard.NEGATIVE_COLOR
				}),
				Keyboard.textButton({
					label: `⬆⬆⬆`,
					color: Keyboard.POSITIVE_COLOR
				}),
				Keyboard.textButton({
					label: `⠀`,
					color: Keyboard.NEGATIVE_COLOR
				})
			],
			[
				Keyboard.textButton({
					label: `🔨`,
					color: Keyboard.NEGATIVE_COLOR
				}),
				Keyboard.textButton({
					label: `⬆`,
					color: Keyboard.POSITIVE_COLOR
				}),
				Keyboard.textButton({
					label: `Инвентарь`,
					color: Keyboard.NEGATIVE_COLOR
				})
			],
			[
				Keyboard.textButton({
					label: `⬅⬅⬅`,
					color: Keyboard.POSITIVE_COLOR
				}),
				Keyboard.textButton({
					label: `⬅`,
					color: Keyboard.POSITIVE_COLOR
				}),
				Keyboard.textButton({
					label: `⚔`
				}),
				Keyboard.textButton({
					label: `➡`,
					color: Keyboard.POSITIVE_COLOR
				}),
				Keyboard.textButton({
					label: `➡➡➡`,
					color: Keyboard.POSITIVE_COLOR
				})
			],
			[
				Keyboard.textButton({
					label: `Использовать`,
					color: Keyboard.NEGATIVE_COLOR
				}),
				Keyboard.textButton({
					label: `⬇`,
					color: Keyboard.POSITIVE_COLOR
				}),
				Keyboard.textButton({
					label: `⠀`,
					color: Keyboard.NEGATIVE_COLOR
				})
			],
			[
				Keyboard.textButton({
					label: `⠀`,
					color: Keyboard.NEGATIVE_COLOR
				}),
				Keyboard.textButton({
					label: `⬇⬇⬇`,
					color: Keyboard.POSITIVE_COLOR
				}),
				Keyboard.textButton({
					label: `⠀`,
					color: Keyboard.NEGATIVE_COLOR
				})
			]
		])
	})
		base.p[base.i[context.senderId].id].online = Number(1)
		const { registerFont, createCanvas, loadImage } = require('canvas');
		registerFont('canvas.ttf', { family: 'canvas' })
		var canvas = createCanvas(2773, 2235);
		var ctx = canvas.getContext('2d');
		var Image = Canvas.Image;
		var img = new Image();
		img.src = 'pole.png';
	    ctx.drawImage(img, 0, 0) // (-433, -459)-83
		let xplayers = Number(base.p[base.i[context.senderId].id].world.x)
		let yplayers = Number(base.p[base.i[context.senderId].id].world.y)
	    for(let i in mobs.objects.tree){
	    	if(mobs.objects.tree[i].dead === 0){
				var img = new Image();
				img.src = 'tree.png';
	    		ctx.drawImage(img, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy)
	    	}
	    }
	    for(let i in base.p){
	    	if(base.p[i].online === 1){
	    	let x = base.p[i].world.x
	    	let y = base.p[i].world.y
	    	if(base.p[i].cent === 0) img.src = 'guard.png'
	    	if(base.p[i].cent === 1) img.src = 'guard1.png'
	    	ctx.drawImage(img, x, y)
	    	let xnick = base.p[i].world.x+17
	    	let ynick = base.p[i].world.y-5
	    	if(base.p[i].inventory.sword == 1){
		    	if(base.p[i].cent === 0) {
		    		x = Number(x+25)
		    		y = Number(y+2)
		    		img.src = 'woodps.png';
		    	}
		    	if(base.p[i].cent === 1) {
					x = Number(x-7)
		    		y = Number(y+3)
		    		img.src = 'woodps1.png';
		    	}
		    }
	    	ctx.drawImage(img, x, y)
	    	ctx.font = 'bold 13px sans';
	    	ctx.fillStyle = "#ffffff";
			ctx.textAlign = 'center';
			ctx.fillText(`${base.p[i].nick}`, xnick, ynick);
		}
	    }

	    	ctx.font = 'bold 15px canvas';
	    	ctx.fillStyle = "#ffec18";
			ctx.textAlign = 'center';
			ctx.fillText(`Лаура`, 1297, 683);

	    var dataUrl = canvas.toDataURL();

	    img.src = `${dataUrl}`;

	    var canvass = createCanvas(700, 400);
		var ctxs = canvass.getContext('2d');

		xplayers = Math.floor(xplayers-330)
		xplayers = -xplayers

		yplayers = Math.floor(yplayers-178)
		yplayers = -yplayers

	    ctxs.drawImage(img, xplayers, yplayers)

		ctxs.font = '30px canvas';
	   	ctxs.fillStyle = "#751404";
		//ctx.textAlign = '';
		ctxs.fillText(`X: ${base.p[base.i[context.senderId].id].world.x}, Y: ${base.p[base.i[context.senderId].id].world.y}`, 518, 386);

		return context.sendPhotos(canvass.toBuffer())
	}
	if(base.p[base.i[context.senderId].id].exp > 199){
		base.p[base.i[context.senderId].id].exp -= 200
		base.p[base.i[context.senderId].id].lvl += 1
	}
	base.p[base.i[context.senderId].id].online = Number(1)
    await next();
});

setInterval(updateWidget, 30500);

updates.hear(/рассылка/i, async (context) => {
	if(base.p[base.i[context.senderId].id].rassilka == 0) {
		base.p[base.i[context.senderId].id].rassilka = 1
		return context.send(`Вы успешно выключили рассылку.`)
	}
	if(base.p[base.i[context.senderId].id].rassilka == 1) {
		base.p[base.i[context.senderId].id].rassilka = 0
		return context.send(`Вы успешно включили рассылку.`)
	}
})

updates.hear(/помощь|help|команды/i, async (context) => {
	context.send(`Все команды:
		сказать (текст) - сказать рядом стоящим игрокам текст.
		кн - вывести клавиатуру (в ней большинство команд)
		предмет - выведет что можно взять.`)
})
updates.hear(/создатьпеременнуюобъект (.*) (.*) (.*)/i, async (context) => {
	if(base.p[base.i[context.senderId].id].rank < 10) return
	for(let i in base.p){
		base.p[i][context.$match[1]][context.$match[2]] = Number(context.$match[3])
	}
	return context.send(`всё`)
})

updates.hear(/создатьпеременнуючисло (.*) (.*)/i, async (context) => {
	if(base.p[base.i[context.senderId].id].rank < 10) return
	for(let i in base.p){
		base.p[i][context.$match[1]] = Number(context.$match[2])
	}
	return context.send(`всё`)
})

updates.hear(/создатьпеременнуюстрока (.*) (.*)/i, async (context) => {
	if(base.bs[base.id[context.senderId].id].rank < 10) return
	for(let i in base.p){
		base.p[i][context.$match[1]] = `${context.$match[2]}`
	}
	return context.send(`всё`)
})

updates.hear(/кн|👈🏻 Обратно/i, async (context) => {
	return context.send({
		message: `>> Открываю клавиатуру.`,
		//message: `⛄ Все команды: \n>> статус (все теги)\n>> статус "статус" (установить статус)\n >> статус вкл (выключить/включить авто-статус)\n>> рандом (посмотреть команды связанные с рандом статусом)\n >> отвязать (отвязать токен)`,
		//⠀
		keyboard: Keyboard.keyboard([
			[
				Keyboard.textButton({
					label: `⠀`,
					color: Keyboard.NEGATIVE_COLOR
				}),
				Keyboard.textButton({
					label: `⬆⬆⬆`,
					color: Keyboard.POSITIVE_COLOR
				}),
				Keyboard.textButton({
					label: `⠀`,
					color: Keyboard.NEGATIVE_COLOR
				})
			],
			[
				Keyboard.textButton({
					label: `🔨`,
					color: Keyboard.NEGATIVE_COLOR
				}),
				Keyboard.textButton({
					label: `⬆`,
					color: Keyboard.POSITIVE_COLOR
				}),
				Keyboard.textButton({
					label: `Инвентарь`,
					color: Keyboard.NEGATIVE_COLOR
				})
			],
			[
				Keyboard.textButton({
					label: `⬅⬅⬅`,
					color: Keyboard.POSITIVE_COLOR
				}),
				Keyboard.textButton({
					label: `⬅`,
					color: Keyboard.POSITIVE_COLOR
				}),
				Keyboard.textButton({
					label: `⚔`
				}),
				Keyboard.textButton({
					label: `➡`,
					color: Keyboard.POSITIVE_COLOR
				}),
				Keyboard.textButton({
					label: `➡➡➡`,
					color: Keyboard.POSITIVE_COLOR
				})
			],
			[
				Keyboard.textButton({
					label: `Использовать`,
					color: Keyboard.NEGATIVE_COLOR
				}),
				Keyboard.textButton({
					label: `⬇`,
					color: Keyboard.POSITIVE_COLOR
				}),
				Keyboard.textButton({
					label: `⠀`,
					color: Keyboard.NEGATIVE_COLOR
				})
			],
			[
				Keyboard.textButton({
					label: `⠀`,
					color: Keyboard.NEGATIVE_COLOR
				}),
				Keyboard.textButton({
					label: `⬇⬇⬇`,
					color: Keyboard.POSITIVE_COLOR
				}),
				Keyboard.textButton({
					label: `⠀`,
					color: Keyboard.NEGATIVE_COLOR
				})
			]
		])
	})	
})


updates.hear(/sendwall (.*) (.*)/i, async (context) => {
	if(base.p[base.i[context.senderId].id].rank < 10) return
	for(let i in base.p){
		if(base.p[i].rassilka == 0){
			vk.api.messages.send({
				user_id: base.p[i].id,
				message: `${context.$match[1]}`,
				attachment: `${context.$match[2]}`
			})
		}
	}
	return context.send(`россылка сделана`)
})

updates.hear(/🌳 Дерево/i, async (context) => {
	if(base.p[base.i[context.senderId].id].worlds === 0){
		var xplayers = Number(base.p[base.i[context.senderId].id].world.x)
		var yplayers = Number(base.p[base.i[context.senderId].id].world.y)
		if(near(xplayers, yplayers, 1300, 710) === true){
			if(base.p[base.i[context.senderId].id].inventory.wood < 1) return context.send(`У вас нет дерева для совершения данного действия.`)
			let money = Math.floor(base.p[base.i[context.senderId].id].inventory.wood * 2)
			base.p[base.i[context.senderId].id].balance += Number(money)
			context.send(`Вы успешно продали ${base.p[base.i[context.senderId].id].inventory.wood}шт. дерева, и получили ${money} коинов.`)
			base.p[base.i[context.senderId].id].inventory.wood = 0
		} else {
			return context.send(`Данную кнопку можно использовать только перед особыми NPC.`)
		}
	}
})

updates.hear(/🥩 Свинина/i, async (context) => {
	if(base.p[base.i[context.senderId].id].worlds === 0){
		var xplayers = Number(base.p[base.i[context.senderId].id].world.x)
		var yplayers = Number(base.p[base.i[context.senderId].id].world.y)
		if(near(xplayers, yplayers, 1300, 710) === true){
			if(base.p[base.i[context.senderId].id].inventory.pig < 1) return context.send(`У вас нет свинины для совершения данного действия.`)
			let money = Math.floor(base.p[base.i[context.senderId].id].inventory.pig * 4)
			base.p[base.i[context.senderId].id].balance += Number(money)
			context.send(`Вы успешно продали ${base.p[base.i[context.senderId].id].inventory.pig}шт. свинины, и получили ${money} коинов.`)
			base.p[base.i[context.senderId].id].inventory.pig = 0
		} else {
			return context.send(`Данную кнопку можно использовать только перед особыми NPC.`)
		}
	}
})

updates.hear(/☠ Пусто/i, async (context) => {
	context.send(`Пусто в инвентаре :(`)
})

updates.hear(/🛒 Продажа/i, async (context) => {
	if(base.p[base.i[context.senderId].id].worlds === 0){
		const { registerFont, createCanvas, loadImage } = require('canvas');
		registerFont('canvas.ttf', { family: 'canvas' })
		var canvas = createCanvas(2773, 2235);
		var ctx = canvas.getContext('2d');
		var Image = Canvas.Image;
		var img = new Image();
		img.src = 'pole.png';
		ctx.drawImage(img, 0, 0)
		let xplayers = Number(base.p[base.i[context.senderId].id].world.x)
		let yplayers = Number(base.p[base.i[context.senderId].id].world.y)
		if(near(xplayers, yplayers, 1300, 710) === true){
			let mass = []
				if(base.p[base.i[context.senderId].id].inventory.wood > 0){
					mass.push([
						Keyboard.textButton({
							label: `🌳 Дерево`,
							payload: {
								"command": "tipidar"
							}
						})
					])
				}
				if(base.p[base.i[context.senderId].id].inventory.pig > 0){
					mass.push([
						Keyboard.textButton({
							label: `🥩 Свинина`,
							payload: {
								"command": "tipidarкрутой"
							}
						})
					])
				}
				if(mass.length == 0){
					mass.push([
						Keyboard.textButton({
							label: `☠ Пусто`
						})
					])
				}
				context.send({
					message: `Укажите что именно вы хотите продать. [INLINE Кнопки]
					Если вы сидите с ПК то играйте с сайта: m.vk.com`,
					attachment: 'photo-189875029_457239021',
					keyboard: Keyboard.keyboard(mass).inline(true)
				})
		} else {
			return context.send(`Данную кнопку можно использовать только перед особыми NPC.`)
		}
	}
})

updates.hear(/профиль/i, async (context) => {
	return context.send(`
		*id${context.senderId} (${base.p[base.i[context.senderId].id].nick}), Ваш профиль:
		ЛВЛ: ${base.p[base.i[context.senderId].id].lvl}
		ОПЫТ: ${base.p[base.i[context.senderId].id].exp}/200
	`)
})

updates.hear(/📋 Квесты/i, async (context) => {
	context.send(`Пока-что не доступно :(`)
})

updates.hear(/⚔/i, async (context) => {
	if(base.p[base.i[context.senderId].id].worlds == 0){
		if(base.p[base.i[context.senderId].id].gun === 1){
			const { registerFont, createCanvas, loadImage } = require('canvas');
			registerFont('canvas.ttf', { family: 'canvas' })
			var canvas = createCanvas(2773, 2235);
			var ctx = canvas.getContext('2d');
			var Image = Canvas.Image;
			var img = new Image();
			img.src = 'pole.png';
		    ctx.drawImage(img, 0, 0) // (-433, -459)-83
			let xplayers = Number(base.p[base.i[context.senderId].id].world.x)
				let yplayers = Number(base.p[base.i[context.senderId].id].world.y)
				let playernear = ``
			for(let i in mobs.mob){
				if(mobs.mob[i].world === 0){
					if(nearhard(xplayers, yplayers, mobs.mob[i].x, mobs.mob[i].y, 35, 35, -25, -35) == true){
						playernear = `${i}`
					}
				}
			}

			console.log(mobs.mob[playernear])

			if(mobs.mob[playernear]){
				if(mobs.mob[playernear].type == 1){
					console.log(base.p[base.i[context.senderId].id])
					mobs.mob[playernear].hp -= Number(base.p[base.i[context.senderId].id].swordhp)
					if(mobs.mob[playernear].hp < 1) {
						delete mobs.mob[playernear]
						base.c.pig -= 1
						let exp = Number(getRandomInRange(3, 7))
						let eat = Number(getRandomInRange(1, 3))
						base.p[base.i[context.senderId].id].exp += Number(exp)
						base.p[base.i[context.senderId].id].inventory.pig += Number(eat)
						context.send(`Вы убили свинью.\nВы получили: ${exp}оп. , ${eat}св.`)
					} else{
						context.send(`Вы ударили свинью.\nХП свиньи: ${mobs.mob[playernear].hp}`)
					}
				}
			} else {
				let nearplayers = 0
				for(let i in base.p){
	    			if(base.p[i].online === 1){
				    	let x = base.p[i].world.x
				    	let y = base.p[i].world.y
						if(nearhard(xplayers, yplayers, base.p[i].world.x, base.p[i].world.y, 35, 35, -35, -35) === true){
							if(i != base.i[context.senderId].id){
								nearplayers = Number(i)
							}
						}
					}
				}
				if(nearplayers == 0) {
					context.send(`Не найден объект для аттаки.`)
				} else {
					context.send(`На данной локации нельзя аттаковать игроков.`)
				}
			}


			for(let i in mobs.objects.tree){
		    	if(mobs.objects.tree[i].dead === 0){
					var img = new Image();
					img.src = 'tree.png';
		    		ctx.drawImage(img, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy)
		    	}
		    }

		    for(let i in mobs.mob){
			    	if(mobs.mob[i].type === 1){
			    		if(mobs.mob[i].cent === 0){
			    			img.src = `${mobs.mob[i].pig}`
			    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
			    		}
						if(mobs.mob[i].cent === 1){
			    			img.src = `${mobs.mob[i].pig1}`
			    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
			    		}
			    	}
			    }

		    for(let i in base.p){
		    	if(base.p[i].online === 1){
			    	let x = base.p[i].world.x
			    	let y = base.p[i].world.y
			    	if(base.p[i].cent === 0) img.src = 'guard.png'
			    	if(base.p[i].cent === 1) img.src = 'guard1.png'
			    	ctx.drawImage(img, x, y)
			    	let xnick = base.p[i].world.x+17
			    	let ynick = base.p[i].world.y-5
			    	if(base.p[i].gun == 1){
			    	if(base.p[i].inventory.sword == 1){
				    	if(base.p[i].cent === 0) {
				    		x = Number(x+25)
				    		y = Number(y+2)
				    		img.src = 'woodps.png';
				    	}
				    	if(base.p[i].cent === 1) {
							x = Number(x-7)
				    		y = Number(y+3)
				    		img.src = 'woodps1.png';
				    	}
				    }
				}
				if(base.p[i].gun == 2){
					if(base.p[i].inventory.axe == 1){
						if(base.p[i].cent === 0) {
				    		x = Number(x+25)
				    		y = Number(y+2)
				    		img.src = 'woodas.png';
				    	}
				    	if(base.p[i].cent === 1) {
							x = Number(x-7)
				    		y = Number(y+3)
				    		img.src = 'woodas1.png';
				    	}
					}
				}
			    ctx.drawImage(img, x, y)
			    	ctx.font = 'bold 13px sans';
			    	ctx.fillStyle = "#ffffff";
					ctx.textAlign = 'center';
					ctx.fillText(`${base.p[i].nick}`, xnick, ynick);
				}
		    }

		   

		    var dataUrl = canvas.toDataURL();

		    img.src = `${dataUrl}`;

		    var canvass = createCanvas(700, 400);
			var ctxs = canvass.getContext('2d');

			xplayers = Math.floor(xplayers-330)
			xplayers = -xplayers

			yplayers = Math.floor(yplayers-178)
			yplayers = -yplayers

		    ctxs.drawImage(img, xplayers, yplayers)


			ctxs.font = '30px canvas';
		   	ctxs.fillStyle = "#751404";
			//ctx.textAlign = '';
			ctxs.fillText(`X: ${base.p[base.i[context.senderId].id].world.x}, Y: ${base.p[base.i[context.senderId].id].world.y}`, 518, 386);

			img.src = 'coin.png';
		    ctxs.drawImage(img, 4, 371)

			ctxs.font = 'bold 20px canvas';
		    ctxs.fillStyle = "#ffffff";
		    ctxs.fillText(`${base.p[base.i[context.senderId].id].balance}`, 31, 392)

		    yplayers = await loadImage(base.p[base.i[context.senderId].id].photo_50)
			ctxs.drawImage(yplayers, 2, 2)

			img.src = `gui.png`;
			ctxs.drawImage(img, 0, 0)
			
			ctxs.font = '15px canvas';
		    ctx.fillStyle = "#ffffff";
			ctxs.textAlign = 'center';
			ctxs.fillText(`${base.p[base.i[context.senderId].id].lvl}`, 47, 54);

			return context.sendPhotos(canvass.toBuffer())
		} else {
			context.send(`Бить свиней можно только с мечем!\nНапишите: "предмет меч"`)
		}
	}
})

updates.hear(/дуэль/i, async (context) => {
	if(base.p[base.i[context.senderId].id].duel == 0) context.send(`>> Включена оптимизация [Дуэли]`)
	const { registerFont, createCanvas, loadImage } = require('canvas');
	registerFont('canvas.ttf', { family: 'canvas' })
	var canvas = createCanvas(500, 300);
	var ctx = canvas.getContext('2d');
	var Image = Canvas.Image;
	var img = new Image();
	img.src = 'duels.png';
	ctx.drawImage(img, 0, 0)
	let x = Number(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].world.xd)
	let y = Number(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].world.yd)
	if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent == 0) img.src = 'guard.png';
	if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent == 1) img.src = 'guard1.png';
	ctx.drawImage(img, x, y)
	return context.sendPhotos(canvas.toBuffer())
})

updates.hear(/дуэлкрутая/i, async (context) => {
	let random = getRandomInRange(1, 2)
	duel.c.id += 1
	if(random == 1){
		console.log(1)
		base.p[base.i[context.senderId].id].world.xd = Number(19)
		base.p[base.i[context.senderId].id].world.yd = Number(134)
		duel.d[duel.c.id] = {
			player: base.i[context.senderId].id,
			player1: 2,
			time: 3
		}
		base.p[base.i[context.senderId].id].cent = 0
	}
	if(random == 2){
		console.log(2)
		base.p[base.i[context.senderId].id].world.xd = Number(452)
		base.p[base.i[context.senderId].id].world.yd = Number(134)
		duel.d[duel.c.id] = {
			player: base.i[context.senderId].id,
			player1: 2,
			time: 3
		}
		base.p[base.i[context.senderId].id].cent = 1
	}
	base.p[base.i[context.senderId].id].duel = Number(duel.c.id)
	base.p[base.i[context.senderId].id].gun = 1
	base.p[base.i[context.senderId].id].worlds = -100
	console.log(3)
	context.send(`>> Включена оптимизация [Дуэли]`)
	const { registerFont, createCanvas, loadImage } = require('canvas');
	registerFont('canvas.ttf', { family: 'canvas' })
	var canvas = createCanvas(500, 300);
	var ctx = canvas.getContext('2d');
	var Image = Canvas.Image;
	var img = new Image();
	img.src = 'duels.png';
	ctx.drawImage(img, 0, 0)
	duel.d[base.p[base.i[context.senderId].id].duel]
	let x = Number(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].world.xd)
	let y = Number(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].world.yd)
	if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent == 0) img.src = 'guard.png';
	if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent == 1) img.src = 'guard1.png';
	ctx.drawImage(img, x, y)
	return context.sendPhotos(canvas.toBuffer())
})

updates.hear(/использовать/i, async (context) => {
	if(base.p[base.i[context.senderId].id].worlds === 0){
		let xplayers = Number(base.p[base.i[context.senderId].id].world.x)
		let yplayers = Number(base.p[base.i[context.senderId].id].world.y)
		if(near(xplayers, yplayers, 1416, 665) === true){
			return context.send({
				message: `Уйди, я занят!`,
				attachment: 'photo-189875029_457239027',
				keyboard: Keyboard.keyboard([
					[
						Keyboard.textButton({
							label: '??',
							color: Keyboard.POSITIVE_COLOR
						})
					]
				]).inline
			})
		}
		if(near(xplayers, yplayers, 1300, 710,) === true){
			return context.send({
				message: `Привет! Я - Лаура, что тебя интересует? [INLINE Кнопки]\nЕсли вы сидите с ПК то играйте с сайта: m.vk.com`,
				attachment: 'photo-189875029_457239021',
				keyboard: Keyboard.keyboard([
					[
						Keyboard.textButton({
							label: '📋 Квесты',
							color: Keyboard.POSITIVE_COLOR
						}),
						Keyboard.textButton({
							label: '🛒 Продажа',
							color: Keyboard.PRIMARY_COLOR
						})
					]
				]).inline(true)
			})
		}

			context.send(`Что-бы использовать данную кнопку необходимо стать перед NPC, предметом.`)
		}
})

updates.hear(/сказать (.*)/i, async (context) => {
	if(base.p[base.i[context.senderId].id].worlds === 0){
		const { registerFont, createCanvas, loadImage } = require('canvas');
		registerFont('canvas.ttf', { family: 'canvas' })
		var canvas = createCanvas(2773, 2235);
		var ctx = canvas.getContext('2d');
		var Image = Canvas.Image;
		var img = new Image();
		img.src = 'pole.png';
	    ctx.drawImage(img, 0, 0) // (-433, -459)-83
		let xplayers = Number(base.p[base.i[context.senderId].id].world.x)
		let yplayers = Number(base.p[base.i[context.senderId].id].world.y)

		var playernear = []

		for(let i in mobs.objects.tree){
	    	if(mobs.objects.tree[i].dead === 0){
				var img = new Image();
				img.src = 'tree.png';
	    		ctx.drawImage(img, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy)
	    	}
	    }

	    for(let i in mobs.mob){
		    	if(mobs.mob[i].type === 1){
		    		if(mobs.mob[i].cent === 0){
		    			img.src = `${mobs.mob[i].pig}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
					if(mobs.mob[i].cent === 1){
		    			img.src = `${mobs.mob[i].pig1}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
		    	}
		    }

	    for(let i in base.p){
	    	if(base.p[i].online === 1){
		    	let x = base.p[i].world.x
		    	let y = base.p[i].world.y
		    	if(base.p[i].cent === 0) img.src = 'guard.png'
		    	if(base.p[i].cent === 1) img.src = 'guard1.png'
		    	ctx.drawImage(img, x, y)
		    	let xnick = base.p[i].world.x+17
		    	let ynick = base.p[i].world.y-5
		    	if(base.p[i].gun == 1){
		    	if(base.p[i].inventory.sword == 1){
			    	if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodps.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodps1.png';
			    	}
			    }
			}
			if(base.p[i].gun == 2){
				if(base.p[i].inventory.axe == 1){
					if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodas.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodas1.png';
			    	}
				}
			}
		    ctx.drawImage(img, x, y)
		    	ctx.font = 'bold 13px sans';
		    	ctx.fillStyle = "#ffffff";
				ctx.textAlign = 'center';
				ctx.fillText(`${base.p[i].nick}`, xnick, ynick);

				if(base.p[i].id != context.senderId){
					if(near(xplayers, yplayers, base.p[i].world.x, base.p[i].world.y) === true){
						playernear.push(base.p[i].id)
					}
				}
			}
	    }

	    if(playernear.length > 0){
		    for(let i = 0; i < playernear.length; i++){
		    	vk.api.messages.send({
		    		message: `Рядом стоящий с вами *id${context.senderId} (${base.p[base.i[context.senderId].id].nick}) сказал:\n // ${context.$match[1]}\nЧто-бы сказать кому-то что-то напишите: "сказать (текст)"`,
		    		user_id: playernear[i]
		    	})
		    }
		}

	    if(playernear.length == 0) context.send(`Рядом с вами никого не оказалось, вы сказали сами себе :)`)

	    	ctx.font = 'bold 15px canvas';
	    	ctx.fillStyle = "#ffec18";
			ctx.textAlign = 'center';
			ctx.fillText(`Лаура`, 1297, 683);

	    var dataUrl = canvas.toDataURL();

	    img.src = `${dataUrl}`;

	    var canvass = createCanvas(700, 400);
		var ctxs = canvass.getContext('2d');

		xplayers = Math.floor(xplayers-330)
		xplayers = -xplayers

		yplayers = Math.floor(yplayers-178)
		yplayers = -yplayers

	    ctxs.drawImage(img, xplayers, yplayers)


		ctxs.font = '30px canvas';
	   	ctxs.fillStyle = "#751404";
		//ctx.textAlign = '';
		ctxs.fillText(`X: ${base.p[base.i[context.senderId].id].world.x}, Y: ${base.p[base.i[context.senderId].id].world.y}`, 518, 386);

		img.src = 'coin.png';
	    ctxs.drawImage(img, 4, 371)

		ctxs.font = 'bold 20px canvas';
	    ctxs.fillStyle = "#ffffff";
	    ctxs.fillText(`${base.p[base.i[context.senderId].id].balance}`, 31, 392)

	    yplayers = await loadImage(base.p[base.i[context.senderId].id].photo_50)
		ctxs.drawImage(yplayers, 2, 2)

		img.src = `gui.png`;
		ctxs.drawImage(img, 0, 0)
		
		ctxs.font = '15px canvas';
	    ctx.fillStyle = "#ffffff";
		ctxs.textAlign = 'center';
		ctxs.fillText(`${base.p[base.i[context.senderId].id].lvl}`, 47, 54);

		return context.sendPhotos(canvass.toBuffer())
}
})

updates.hear(/предмет убрать/i, async (context) => {
	if(base.p[base.i[context.senderId].id].duel !== 0) return context.send(`Вы не можете менять предмет во время дуэля.`)
	if(base.p[base.i[context.senderId].id].gun === 0) return context.send(`В ваших руках ничего нет.`)
	base.p[base.i[context.senderId].id].gun = 0
	return context.send(`Вы убрали из рук предмет.`)
})

updates.hear(/предмет меч/i, async (context) => {
	if(base.p[base.i[context.senderId].id].duel !== 0) return context.send(`Вы не можете менять предмет во время дуэля.`)
	if(base.p[base.i[context.senderId].id].gun === 1) return context.send(`Вы уже держите меч.`)
	base.p[base.i[context.senderId].id].gun = 1
	if(base.p[base.i[context.senderId].id].inventory.sword == 1) return context.send(`Вы взяли в руки: "деревянный меч".`)
})

updates.hear(/предмет топор/i, async (context) => {
	if(base.p[base.i[context.senderId].id].duel !== 0) return context.send(`Вы не можете менять предмет во время дуэля.`)
	if(base.p[base.i[context.senderId].id].gun === 2) return context.send(`Вы уже держите топор.`)
	base.p[base.i[context.senderId].id].gun = 2
	if(base.p[base.i[context.senderId].id].inventory.axe == 1) return context.send(`Вы взяли в руки: "деревянный топор".`)
})

updates.hear(/предмет/i, async (context) => {
	return context.send(`||||\nПредмет убрать,\nПредмет меч,\nПредмет топор`)
})

updates.hear(/🔨/i, async (context) => {
	if(base.p[base.i[context.senderId].id].caseopen == 1) return
	if(base.p[base.i[context.senderId].id].worlds === 0){
		if(base.p[base.i[context.senderId].id].gun !== 2) return context.send(`У вас нет в руках топора, возьмите его прописав команду: "предмет топор"`)
		base.p[base.i[context.senderId].id].caseopen = 1
		const { registerFont, createCanvas, loadImage } = require('canvas');
		registerFont('canvas.ttf', { family: 'canvas' })
		var canvas = createCanvas(2773, 2235);
		var ctx = canvas.getContext('2d');
		var Image = Canvas.Image;
		var textss = ``
		var img = new Image();
		img.src = 'pole.png';
	    ctx.drawImage(img, 0, 0) // (-433, -459)-83
		let xplayers = Number(base.p[base.i[context.senderId].id].world.x)
		let yplayers = Number(base.p[base.i[context.senderId].id].world.y)
		let put = -10
		for(let i in mobs.objects.tree){
			if(nearhard(xplayers, yplayers, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy, 50, 65, -30, -25) == true) {
			   	put = i
			}
		}
		if(put == -10) {
			textss = `Поблизости с вами не было найдено объектов (подойдите в плотную)`
		} else {
		mobs.objects.tree[put].hp -= Number(base.p[base.i[context.senderId].id].axehp)
		if(mobs.objects.tree[put].hp < 1){
		 delete mobs.objects.tree[put]
		 base.c.trees -= 1
		 let wood = Number(getRandomInRange(1, 3))
		let exp = Number(getRandomInRange(1,2))
		 base.p[base.i[context.senderId].id].inventory.wood += Number(wood)
		 base.p[base.i[context.senderId].id].exp += Number(exp)

		 textss = `Вы успешно срубили дерево №${put}\nВы получили: ${wood}д. , ${exp}оп.`
		} else {
			textss = `Вы успешно рубите дерево №${put}.\nПрочность дерева: ${mobs.objects.tree[put].hp}🛡`
		}
		}

		for(let i in mobs.objects.tree){
	    	if(mobs.objects.tree[i].dead === 0){
				var img = new Image();
				img.src = 'tree.png';
	    		ctx.drawImage(img, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy)
	    	}
	    }

	    for(let i in mobs.mob){
		    	if(mobs.mob[i].type === 1){
		    		if(mobs.mob[i].cent === 0){
		    			img.src = `${mobs.mob[i].pig}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
					if(mobs.mob[i].cent === 1){
		    			img.src = `${mobs.mob[i].pig1}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
		    	}
		    }

	    for(let i in base.p){
	    	if(base.p[i].online === 1){
	    	let x = base.p[i].world.x
	    	let y = base.p[i].world.y
	    	if(base.p[i].cent === 0) img.src = 'guard.png'
	    	if(base.p[i].cent === 1) img.src = 'guard1.png'
	    	ctx.drawImage(img, x, y)
	    	let xnick = base.p[i].world.x+17
	    	let ynick = base.p[i].world.y-5
	    	if(base.p[i].gun == 1){
		    	if(base.p[i].inventory.sword == 1){
			    	if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodps.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodps1.png';
			    	}
			    }
			}
			if(base.p[i].gun == 2){
				if(base.p[i].inventory.axe == 1){
					if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodas.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodas1.png';
			    	}
				}
			}
	    	ctx.drawImage(img, x, y)
	    	ctx.font = 'bold 13px sans';
	    	ctx.fillStyle = "#ffffff";
			ctx.textAlign = 'center';
			ctx.fillText(`${base.p[i].nick}`, xnick, ynick);
		}
	    }

	    	ctx.font = 'bold 15px canvas';
	    	ctx.fillStyle = "#ffec18";
			ctx.textAlign = 'center';
			ctx.fillText(`Лаура`, 1297, 683);

	    var dataUrl = canvas.toDataURL();

	    img.src = `${dataUrl}`;

	    var canvass = createCanvas(700, 400);
		var ctxs = canvass.getContext('2d');

		xplayers = Math.floor(xplayers-330)
		xplayers = -xplayers

		yplayers = Math.floor(yplayers-178)
		yplayers = -yplayers

	    ctxs.drawImage(img, xplayers, yplayers)

		ctxs.font = '30px canvas';
	   	ctxs.fillStyle = "#751404";
		//ctx.textAlign = '';
		ctxs.fillText(`X: ${base.p[base.i[context.senderId].id].world.x}, Y: ${base.p[base.i[context.senderId].id].world.y}`, 518, 386);

		img.src = 'coin.png';
	    ctxs.drawImage(img, 4, 371)

		ctxs.font = 'bold 20px canvas';
	    ctxs.fillStyle = "#ffffff";
	    ctxs.fillText(`${base.p[base.i[context.senderId].id].balance}`, 31, 392)

	    yplayers = await loadImage(base.p[base.i[context.senderId].id].photo_50)
		ctxs.drawImage(yplayers, 2, 2)

		img.src = `gui.png`;
		ctxs.drawImage(img, 0, 0)
		
		ctxs.font = '15px canvas';
	    ctx.fillStyle = "#ffffff";
		ctxs.textAlign = 'center';
		ctxs.fillText(`${base.p[base.i[context.senderId].id].lvl}`, 47, 54);


		base.p[base.i[context.senderId].id].caseopen = 0

		return context.sendPhotos({
			value: canvass.toBuffer()
		}, {
			message: `${textss}`
		})
	}
})

updates.hear(/инвентарь/i, async (context) => {
	if(base.p[base.i[context.senderId].id].worlds === 0){
		const { registerFont, createCanvas, loadImage } = require('canvas');
		registerFont('canvas.ttf', { family: 'canvas' })
		var canvas = createCanvas(2773, 2235);
		var ctx = canvas.getContext('2d');
		var Image = Canvas.Image;
		var img = new Image();
		img.src = 'pole.png';
	    ctx.drawImage(img, 0, 0) // (-433, -459)-83
	var xplayers = Number(base.p[base.i[context.senderId].id].world.x)
	var yplayers = Number(base.p[base.i[context.senderId].id].world.y)
	for(let i in mobs.objects.tree){
		if(nearhard(xplayers, yplayers, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy, 50, 65, -30, -25) == true) {
		   	put = i
		}
	}
	for(let i in mobs.objects.tree){
	    	if(mobs.objects.tree[i].dead === 0){
				var img = new Image();
				img.src = 'tree.png';
	    		ctx.drawImage(img, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy)
	    	}
	    }

	    for(let i in mobs.mob){
		    	if(mobs.mob[i].type === 1){
		    		if(mobs.mob[i].cent === 0){
		    			img.src = `${mobs.mob[i].pig}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
					if(mobs.mob[i].cent === 1){
		    			img.src = `${mobs.mob[i].pig1}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
		    	}
		    }
	    for(let i in base.p){
	    	if(base.p[i].online === 1){
	    	var x = base.p[i].world.x
	    	var y = base.p[i].world.y
	    	if(base.p[i].cent === 0) img.src = 'guard.png'
	    	if(base.p[i].cent === 1) img.src = 'guard1.png'
	    	ctx.drawImage(img, x, y)
	    	var xnick = base.p[i].world.x+17
	    	var ynick = base.p[i].world.y-5
	    	if(base.p[i].gun == 1){
		    	if(base.p[i].inventory.sword == 1){
			    	if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodps.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodps1.png';
			    	}
			    }
			}
			if(base.p[i].gun == 2){
				if(base.p[i].inventory.axe == 1){
					if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodas.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodas1.png';
			    	}
				}
			}
	    	ctx.drawImage(img, x, y)
	    	ctx.font = 'bold 13px sans';
	    	ctx.fillStyle = "#ffffff";
			ctx.textAlign = 'center';
			ctx.fillText(`${base.p[i].nick}`, xnick, ynick);
		}
	    }



	    	ctx.font = 'bold 15px canvas';
	    	ctx.fillStyle = "#ffec18";
			ctx.textAlign = 'center';
			ctx.fillText(`Лаура`, 1297, 683);

	    var dataUrl = canvas.toDataURL();

	    img.src = `${dataUrl}`;

	    var canvass = createCanvas(700, 400);
		var ctxs = canvass.getContext('2d');

		xplayers = Math.floor(xplayers-330)
		xplayers = -xplayers

		yplayers = Math.floor(yplayers-178)
		yplayers = -yplayers

	    ctxs.drawImage(img, xplayers, yplayers)

		ctxs.font = '30px canvas';
	   	ctxs.fillStyle = "#751404";
		//ctx.textAlign = '';
		ctxs.fillText(`X: ${base.p[base.i[context.senderId].id].world.x}, Y: ${base.p[base.i[context.senderId].id].world.y}`, 518, 386);

		img.src = 'inventory.png';
	    ctxs.drawImage(img, 432, 15) // (-433, -459)-83

	    var count = 0
	    var coordx = 0
	    var coordy = 0

	

	    if(base.p[base.i[context.senderId].id].inventory.sword == 1){
	    	count += 1
	    	if(count > 0) {
	    		coordy = 54
	    		coordx = Number(count)
	    	}
	    	if(count > 4) {
				coordy = 108
				coordx = Number(count-4)
			}
	    	if(count > 8) {
	    		coordy = 162
	    		coordx = Number(count-8)
	    	}
	    	if(count > 12) {
	    		coordy = 216
	    		coordx = Number(count-12)
	    	}
	    	if(count > 16) {
	    		coordy = 270
	    		coordx = Number(count-16)
	    	}
	    	if(count > 20) {
	    		coordy = 324
	    		coordx = Number(count-20)
	    	}
	    	if(coordx == 1){
	    		coordx = 441
	    	}
	    	if(coordx == 2){
	    		coordx = 494
	    	}
	    	if(coordx == 3){
	    		coordx = 548
	    	}
	    	if(coordx == 4){
	    		coordx = 601
	    	}
	    	img.src = 'swordp.png';
	    	ctxs.drawImage(img, coordx, coordy)
			ctxs.font = 'bold 10px sans';
	    	ctxs.fillStyle = "#ffffff";
			//ctx.textAlign = 'center';
			coordy += 44
			ctxs.fillText(`1шт.`, coordx, coordy);
	    }

	    if(base.p[base.i[context.senderId].id].inventory.pickaxe == 1){
	    	count += 1
	    	if(count > 0) {
	    		coordy = 54
	    		coordx = Number(count)
	    	}
	    	if(count > 4) {
				coordy = 108
				coordx = Number(count-4)
			}
	    	if(count > 8) {
	    		coordy = 162
	    		coordx = Number(count-8)
	    	}
	    	if(count > 12) {
	    		coordy = 216
	    		coordx = Number(count-12)
	    	}
	    	if(count > 16) {
	    		coordy = 270
	    		coordx = Number(count-16)
	    	}
	    	if(count > 20) {
	    		coordy = 324
	    		coordx = Number(count-20)
	    	}
	    	if(coordx == 1){
	    		coordx = 441
	    	}
	    	if(coordx == 2){
	    		coordx = 494
	    	}
	    	if(coordx == 3){
	    		coordx = 548
	    	}
	    	if(coordx == 4){
	    		coordx = 601
	    	}
	    	img.src = 'woodp.png';
	    	ctxs.drawImage(img, coordx, coordy)
			ctxs.font = 'bold 10px sans';
	    	ctxs.fillStyle = "#ffffff";
			//ctx.textAlign = 'center';
			coordy += 44
			ctxs.fillText(`1шт.`, coordx, coordy);
	    }

	    if(base.p[base.i[context.senderId].id].inventory.axe == 1){
	    	count += 1
	    	if(count > 0) {
	    		coordy = 54
	    		coordx = Number(count)
	    	}
	    	if(count > 4) {
				coordy = 108
				coordx = Number(count-4)
			}
	    	if(count > 8) {
	    		coordy = 162
	    		coordx = Number(count-8)
	    	}
	    	if(count > 12) {
	    		coordy = 216
	    		coordx = Number(count-12)
	    	}
	    	if(count > 16) {
	    		coordy = 270
	    		coordx = Number(count-16)
	    	}
	    	if(count > 20) {
	    		coordy = 324
	    		coordx = Number(count-20)
	    	}
	    	if(coordx == 1){
	    		coordx = 441
	    	}
	    	if(coordx == 2){
	    		coordx = 494
	    	}
	    	if(coordx == 3){
	    		coordx = 548
	    	}
	    	if(coordx == 4){
	    		coordx = 601
	    	}
	    	img.src = 'axep.png';
	    	ctxs.drawImage(img, coordx, coordy)
			ctxs.font = 'bold 10px sans';
	    	ctxs.fillStyle = "#ffffff";
			//ctx.textAlign = 'center';
			coordy += 44
			ctxs.fillText(`1шт.`, coordx, coordy);
	    }

	    if(base.p[base.i[context.senderId].id].inventory.pig > 0){
	    	count += 1
	    	if(count > 0) {
	    		coordy = 54
	    		coordx = Number(count)
	    	}
	    	if(count > 4) {
				coordy = 108
				coordx = Number(count-4)
			}
	    	if(count > 8) {
	    		coordy = 162
	    		coordx = Number(count-8)
	    	}
	    	if(count > 12) {
	    		coordy = 216
	    		coordx = Number(count-12)
	    	}
	    	if(count > 16) {
	    		coordy = 270
	    		coordx = Number(count-16)
	    	}
	    	if(count > 20) {
	    		coordy = 324
	    		coordx = Number(count-20)
	    	}
	    	if(coordx == 1){
	    		coordx = 441
	    	}
	    	if(coordx == 2){
	    		coordx = 494
	    	}
	    	if(coordx == 3){
	    		coordx = 548
	    	}
	    	if(coordx == 4){
	    		coordx = 601
	    	}
	    	img.src = 'pigeat.png';
	    	ctxs.drawImage(img, coordx, coordy)
			ctxs.font = 'bold 10px sans';
	    	ctxs.fillStyle = "#ffffff";
			//ctx.textAlign = 'center';
			coordy += 44
			ctxs.fillText(`${base.p[base.i[context.senderId].id].inventory.pig}шт.`, coordx, coordy);
	    }

	    if(base.p[base.i[context.senderId].id].inventory.wood > 0){
	    	count += 1
	    	if(count > 0) {
	    		coordy = 54
	    		coordx = Number(count)
	    	}
	    	if(count > 4) {
				coordy = 108
				coordx = Number(count-4)
			}
	    	if(count > 8) {
	    		coordy = 162
	    		coordx = Number(count-8)
	    	}
	    	if(count > 12) {
	    		coordy = 216
	    		coordx = Number(count-12)
	    	}
	    	if(count > 16) {
	    		coordy = 270
	    		coordx = Number(count-16)
	    	}
	    	if(count > 20) {
	    		coordy = 324
	    		coordx = Number(count-20)
	    	}
	    	if(coordx == 1){
	    		coordx = 441
	    	}
	    	if(coordx == 2){
	    		coordx = 494
	    	}
	    	if(coordx == 3){
	    		coordx = 548
	    	}
	    	if(coordx == 4){
	    		coordx = 601
	    	}
	    	img.src = 'wood.png';
	    	ctxs.drawImage(img, coordx, coordy)
			ctxs.font = 'bold 10px sans';
	    	ctxs.fillStyle = "#ffffff";
			//ctx.textAlign = 'center';
			coordy += 44
			ctxs.fillText(`${base.p[base.i[context.senderId].id].inventory.wood}шт.`, coordx, coordy);
	    }

	    img.src = 'coin.png';
	    ctxs.drawImage(img, 4, 371)

	    ctxs.font = 'bold 20px canvas';
	    ctx.fillStyle = "#ffffff";
	    ctxs.fillText(`${base.p[base.i[context.senderId].id].balance}`, 31, 392)

	    yplayers = await loadImage(base.p[base.i[context.senderId].id].photo_50)
		ctxs.drawImage(yplayers, 2, 2)

		img.src = `gui.png`;
		ctxs.drawImage(img, 0, 0)
		
		ctxs.font = '15px canvas';
	    ctxs.fillStyle = "#ffffff";
		ctxs.textAlign = 'center';
		ctxs.fillText(`${base.p[base.i[context.senderId].id].lvl}`, 47, 54);

		return context.sendPhotos(canvass.toBuffer())
	}
})

updates.hear(/ник (.*)/i, async (context) => {
	if(context.$match[1].length > 15) return context.send(`Слишком большое кол-во символов в нике.`)
	base.p[base.i[context.senderId].id].nick = `${context.$match[1]}`
	return context.send(`Ник успешно установлен!`)
})

updates.hear(/⬅⬅⬅/i, async (context) => {
	if(base.p[base.i[context.senderId].id].caseopen == 1) return
		base.p[base.i[context.senderId].id].caseopen = 1

	if(base.p[base.i[context.senderId].id].duel != 0){
		console.log(1)
		let proverka = Number(base.p[base.i[context.senderId].id].world.xd-60)
		base.p[base.i[context.senderId].id].caseopen = 0
		if(proverka < 13) return context.send(`Вы не можете выйти за границу карты!`)
		base.p[base.i[context.senderId].id].cent = 1
		base.p[base.i[context.senderId].id].world.xd = Number(proverka)
		const { registerFont, createCanvas, loadImage } = require('canvas');
		registerFont('canvas.ttf', { family: 'canvas' })
		var canvas = createCanvas(500, 300);
		var ctx = canvas.getContext('2d');
		var Image = Canvas.Image;
		var img = new Image();
		img.src = 'duels.png';
		ctx.drawImage(img, 0, 0)
		let x = Number(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].world.xd)
		let y = Number(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].world.yd)
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent == 0) img.src = 'guard.png';
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent == 1) img.src = 'guard1.png';
		ctx.drawImage(img, x, y)
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].inventory.sword == 1){
			    if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent === 0) {
			    	x = Number(x+25)
			    	y = Number(y+2)
			    	img.src = 'woodps.png';
			    }
			    if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent === 1) {
					x = Number(x-7)
			    	y = Number(y+3)
			    	img.src = 'woodps1.png';
			    }
		}
		return context.sendPhotos(canvas.toBuffer())
	}

	if(base.p[base.i[context.senderId].id].worlds === 0){

	var xplayers = Number(base.p[base.i[context.senderId].id].world.x-60)
	if(xplayers < 721) {
		context.send(`Вы не можете выйти за границу карты!`)
	} else {
	base.p[base.i[context.senderId].id].world.x -= 60
	}
	base.p[base.i[context.senderId].id].cent = 1

	var yplayers = Number(base.p[base.i[context.senderId].id].world.y)


	xplayers = Number(base.p[base.i[context.senderId].id].world.x)
	yplayers = Number(base.p[base.i[context.senderId].id].world.y)

	let text = `Рядом с вами: `
		let count = 0

		const { registerFont, createCanvas, loadImage } = require('canvas');
		registerFont('canvas.ttf', { family: 'canvas' })
		var canvas = createCanvas(2773, 2235);
		var ctx = canvas.getContext('2d');
		var Image = Canvas.Image;
		var img = new Image();
		img.src = 'pole.png';
	    ctx.drawImage(img, 0, 0) // (-433, -459)-83
	    
	    if(near(xplayers, yplayers, 1300, 710) === true){
	    	count += 1
	    	text += `Лаура [Клавиатура: использовать]`
	    }

	    for(let i in mobs.objects.tree){
		   if(nearhard(xplayers, yplayers, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy, 50, 65, -30, -25) == true) {
		    	if(count > 0) text += `, дерево`
		    	if(count == 0){
		    		count += 1
		    		text += `дерево`
		    	}
		    }
	    }

	    img.src = 'tree.png';

	    for(let i in mobs.objects.tree){
	    	if(mobs.objects.tree[i].dead === 0){
	    		ctx.drawImage(img, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy)
	    	}
	    }

	    	for(let i in mobs.mob){
		    	if(mobs.mob[i].type === 1){
		    		if(mobs.mob[i].cent === 0){
		    			img.src = `${mobs.mob[i].pig}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
					if(mobs.mob[i].cent === 1){
		    			img.src = `${mobs.mob[i].pig1}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
		    		if(nearhard(xplayers, yplayers, mobs.mob[i].x, mobs.mob[i].y, 35, 35, -25, -35) == true){
			    		if(count > 0) text += `, свинья`
			    		if(count == 0){
			    			count += 1
			    			text += `свинья`
			    		}
		    		}
		    	}
	    	}

	    for(let i in base.p){
	    	if(base.p[i].online === 1){
	    	let x = base.p[i].world.x
	    	let y = base.p[i].world.y
	    	if(base.p[i].cent === 0) img.src = 'guard.png'
	    	if(base.p[i].cent === 1) img.src = 'guard1.png'
	    	ctx.drawImage(img, x, y)
	    	let xnick = base.p[i].world.x+17
	    	let ynick = base.p[i].world.y-5
	    	if(base.p[i].gun == 1){
		    	if(base.p[i].inventory.sword == 1){
			    	if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodps.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodps1.png';
			    	}
			    }
			}
			if(base.p[i].gun == 2){
				if(base.p[i].inventory.axe == 1){
					if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodas.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodas1.png';
			    	}
				}
			}
	    	ctx.drawImage(img, x, y)
	    	ctx.font = 'bold 13px sans';
	    	ctx.fillStyle = "#ffffff";
			ctx.textAlign = 'center';
			ctx.fillText(`${base.p[i].nick}`, xnick, ynick);
		}
	    }



	    	ctx.font = 'bold 15px canvas';
	    	ctx.fillStyle = "#ffec18";
			ctx.textAlign = 'center';
			ctx.fillText(`Лаура`, 1297, 683);

	    var dataUrl = canvas.toDataURL();

	    img.src = `${dataUrl}`;

	    var canvass = createCanvas(700, 400);
		var ctxs = canvass.getContext('2d');

		xplayers = Math.floor(xplayers-330)
		xplayers = -xplayers

		yplayers = Math.floor(yplayers-178)
		yplayers = -yplayers

	    ctxs.drawImage(img, xplayers, yplayers)

		ctxs.font = '30px canvas';
	   	ctxs.fillStyle = "#751404";
		//ctx.textAlign = '';
		ctxs.fillText(`X: ${base.p[base.i[context.senderId].id].world.x}, Y: ${base.p[base.i[context.senderId].id].world.y}`, 518, 386);

		img.src = 'coin.png';
	    ctxs.drawImage(img, 4, 371)

	    ctxs.font = 'bold 20px canvas';
	    ctxs.fillStyle = "#ffffff";
	    ctxs.fillText(`${base.p[base.i[context.senderId].id].balance}`, 31, 392)

	 

	    yplayers = await loadImage(base.p[base.i[context.senderId].id].photo_50)
		ctxs.drawImage(yplayers, 2, 2)

		img.src = `gui.png`;
		ctxs.drawImage(img, 0, 0)

		ctxs.font = '15px canvas';
	    ctxs.fillStyle = "#ffffff";
		ctxs.textAlign = 'center';
		ctxs.fillText(`${base.p[base.i[context.senderId].id].lvl}`, 47, 54);

		base.p[base.i[context.senderId].id].caseopen = 0
		if(count < 1) return context.sendPhotos(canvass.toBuffer())
		if(count > 0){
			return context.sendPhotos({
				value: canvass.toBuffer()
			}, {
				message: `${text}`
			})
		}
}})

updates.hear(/⬅/i, async (context) => {
	if(base.p[base.i[context.senderId].id].caseopen == 1) return
	base.p[base.i[context.senderId].id].caseopen = 1

	if(base.p[base.i[context.senderId].id].duel != 0){
		console.log(1)
		let proverka = Number(base.p[base.i[context.senderId].id].world.xd-20)
		base.p[base.i[context.senderId].id].caseopen = 0
		if(proverka < 13) return context.send(`Вы не можете выйти за границу карты!`)
		base.p[base.i[context.senderId].id].cent = 1
		base.p[base.i[context.senderId].id].world.xd = Number(proverka)
		const { registerFont, createCanvas, loadImage } = require('canvas');
		registerFont('canvas.ttf', { family: 'canvas' })
		var canvas = createCanvas(500, 300);
		var ctx = canvas.getContext('2d');
		var Image = Canvas.Image;
		var img = new Image();
		img.src = 'duels.png';
		ctx.drawImage(img, 0, 0)
		let x = Number(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].world.xd)
		let y = Number(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].world.yd)
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent == 0) img.src = 'guard.png';
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent == 1) img.src = 'guard1.png';
		ctx.drawImage(img, x, y)
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].inventory.sword == 1){
			    if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent === 0) {
			    	x = Number(x+25)
			    	y = Number(y+2)
			    	img.src = 'woodps.png';
			    }
			    if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent === 1) {
					x = Number(x-7)
			    	y = Number(y+3)
			    	img.src = 'woodps1.png';
			    }
		}
		return context.sendPhotos(canvas.toBuffer())
	}

	if(base.p[base.i[context.senderId].id].worlds === 0){

	var xplayers = Number(base.p[base.i[context.senderId].id].world.x-20)
	if(xplayers < 721) {
		context.send(`Вы не можете выйти за границу карты!`)
	} else {
	base.p[base.i[context.senderId].id].world.x -= 20
	}
	base.p[base.i[context.senderId].id].cent = 1

	var yplayers = Number(base.p[base.i[context.senderId].id].world.y+20)


	xplayers = Number(base.p[base.i[context.senderId].id].world.x)
	yplayers = Number(base.p[base.i[context.senderId].id].world.y)

	let text = `Рядом с вами: `
		let count = 0

		const { registerFont, createCanvas, loadImage } = require('canvas');
		registerFont('canvas.ttf', { family: 'canvas' })
		var canvas = createCanvas(2773, 2235);
		var ctx = canvas.getContext('2d');
		var Image = Canvas.Image;
		var img = new Image();
		img.src = 'pole.png';
	    ctx.drawImage(img, 0, 0) // (-433, -459)-83
	    
	    if(near(xplayers, yplayers, 1300, 710) === true){
	    	count += 1
	    	text += `Лаура [Клавиатура: использовать]`
	    }

	    for(let i in mobs.objects.tree){
		    if(nearhard(xplayers, yplayers, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy, 50, 65, -30, -25) == true) {
		    	if(count > 0) text += `, дерево`
		    	if(count == 0){
		    		count += 1
		    		text += `дерево`
		    	}
		    }
	    }

	    img.src = 'tree.png';

	    for(let i in mobs.objects.tree){
	    	if(mobs.objects.tree[i].dead === 0){
	    		ctx.drawImage(img, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy)
	    	}
	    }

	   for(let i in mobs.mob){
		    	if(mobs.mob[i].type === 1){
		    		if(mobs.mob[i].cent === 0){
		    			img.src = `${mobs.mob[i].pig}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
					if(mobs.mob[i].cent === 1){
		    			img.src = `${mobs.mob[i].pig1}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
		    		if(nearhard(xplayers, yplayers, mobs.mob[i].x, mobs.mob[i].y, 35, 35, -25, -35) == true){
			    		if(count > 0) text += `, свинья`
			    		if(count == 0){
			    			count += 1
			    			text += `свинья`
			    		}
		    		}
		    	}
	    	}

	    for(let i in base.p){
	    	if(base.p[i].online === 1){
	    	let x = base.p[i].world.x
	    	let y = base.p[i].world.y
	    	if(base.p[i].cent === 0) img.src = 'guard.png'
	    	if(base.p[i].cent === 1) img.src = 'guard1.png'
	    	ctx.drawImage(img, x, y)
	    	let xnick = base.p[i].world.x+17
	    	let ynick = base.p[i].world.y-5
	    	if(base.p[i].gun == 1){
		    	if(base.p[i].inventory.sword == 1){
			    	if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodps.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodps1.png';
			    	}
			    }
			}
			if(base.p[i].gun == 2){
				if(base.p[i].inventory.axe == 1){
					if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodas.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodas1.png';
			    	}
				}
			}
	    	ctx.drawImage(img, x, y)
	    	ctx.font = 'bold 13px sans';
	    	ctx.fillStyle = "#ffffff";
			ctx.textAlign = 'center';
			ctx.fillText(`${base.p[i].nick}`, xnick, ynick);
		}
	    }



	    	ctx.font = 'bold 15px canvas';
	    	ctx.fillStyle = "#ffec18";
			ctx.textAlign = 'center';
			ctx.fillText(`Лаура`, 1297, 683);

	    var dataUrl = canvas.toDataURL();

	    img.src = `${dataUrl}`;

	    var canvass = createCanvas(700, 400);
		var ctxs = canvass.getContext('2d');

		xplayers = Math.floor(xplayers-330)
		xplayers = -xplayers

		yplayers = Math.floor(yplayers-178)
		yplayers = -yplayers

	    ctxs.drawImage(img, xplayers, yplayers)

		ctxs.font = '30px canvas';
	   	ctxs.fillStyle = "#751404";
		//ctx.textAlign = '';
		ctxs.fillText(`X: ${base.p[base.i[context.senderId].id].world.x}, Y: ${base.p[base.i[context.senderId].id].world.y}`, 518, 386);

		yplayers = await loadImage(base.p[base.i[context.senderId].id].photo_50)
		ctxs.drawImage(yplayers, 2, 2)

		img.src = `gui.png`;
		ctxs.drawImage(img, 0, 0)
		
		ctxs.font = '15px canvas';
	    ctx.fillStyle = "#ffffff";
		ctxs.textAlign = 'center';
		ctxs.fillText(`${base.p[base.i[context.senderId].id].lvl}`, 47, 54);

		img.src = 'coin.png';
	    ctxs.drawImage(img, 4, 371)

	    ctxs.font = 'bold 20px canvas';
	    ctxs.fillStyle = "#ffffff";
	    ctxs.fillText(`${base.p[base.i[context.senderId].id].balance}`, 31, 392)

	    ctxs.font = '15px canvas';
	    ctxs.fillStyle = "#ffffff";
		ctxs.textAlign = 'center';
		ctxs.fillText(`${base.p[base.i[context.senderId].id].lvl}`, 47, 54);

		base.p[base.i[context.senderId].id].caseopen = 0

		if(count < 1) return context.sendPhotos(canvass.toBuffer())
		if(count > 0){
			return context.sendPhotos({
				value: canvass.toBuffer()
			}, {
				message: `${text}`
			})
		}
}})

updates.hear(/⬇⬇⬇/i, async (context) => {
	if(base.p[base.i[context.senderId].id].caseopen == 1) return
	base.p[base.i[context.senderId].id].caseopen = 1
	if(base.p[base.i[context.senderId].id].duel != 0){
		let proverka = Number(base.p[base.i[context.senderId].id].world.yd+60)
		base.p[base.i[context.senderId].id].caseopen = 0
		if(proverka > 288) return context.send(`Вы не можете выйти за границу карты!`)
		base.p[base.i[context.senderId].id].world.yd = Number(proverka)
		const { registerFont, createCanvas, loadImage } = require('canvas');
		registerFont('canvas.ttf', { family: 'canvas' })
		var canvas = createCanvas(500, 300);
		var ctx = canvas.getContext('2d');
		var Image = Canvas.Image;
		var img = new Image();
		img.src = 'duels.png';
		ctx.drawImage(img, 0, 0)
		let x = Number(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].world.xd)
		let y = Number(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].world.yd)
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent == 0) img.src = 'guard.png';
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent == 1) img.src = 'guard1.png';
		ctx.drawImage(img, x, y)
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].inventory.sword == 1){
			    if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent === 0) {
			    	x = Number(x+25)
			    	y = Number(y+2)
			    	img.src = 'woodps.png';
			    }
			    if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent === 1) {
					x = Number(x-7)
			    	y = Number(y+3)
			    	img.src = 'woodps1.png';
			    }
		}
		return context.sendPhotos(canvas.toBuffer())
	}
	if(base.p[base.i[context.senderId].id].worlds === 0){
	var yplayers = Number(base.p[base.i[context.senderId].id].world.y+60)
	if(yplayers > 1900) {
		context.send(`Вы не можете выйти за границу карты!`)
	} else {
		base.p[base.i[context.senderId].id].world.y += 60
	}


	var xplayers = Number(base.p[base.i[context.senderId].id].world.x)
	yplayers = Number(base.p[base.i[context.senderId].id].world.y)

	let text = `Рядом с вами: `
		let count = 0

			const { registerFont, createCanvas, loadImage } = require('canvas');
			registerFont('canvas.ttf', { family: 'canvas' })
		var canvas = createCanvas(2773, 2235);
		var ctx = canvas.getContext('2d');
		var Image = Canvas.Image;
		var img = new Image();
		img.src = 'pole.png';
	    ctx.drawImage(img, 0, 0) // (-433, -459)-83

	    if(near(xplayers, yplayers, 1300, 710) === true){
	    	count += 1
	    	text += `Лаура [Клавиатура: использовать]`
	    }
	    
	    for(let i in mobs.objects.tree){
		    if(nearhard(xplayers, yplayers, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy, 50, 65, -30, -25) == true) {
		    	if(count > 0) text += `, дерево`
		    	if(count == 0){
		    		count += 1
		    		text += `дерево`
		    	}
		    }
	    }

	    img.src = 'tree.png';

		for(let i in mobs.objects.tree){
	    	if(mobs.objects.tree[i].dead === 0){
	    		ctx.drawImage(img, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy)
	    	}
	    }

	    for(let i in mobs.mob){
		    	if(mobs.mob[i].type === 1){
		    		if(mobs.mob[i].cent === 0){
		    			img.src = `${mobs.mob[i].pig}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
					if(mobs.mob[i].cent === 1){
		    			img.src = `${mobs.mob[i].pig1}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
		    		if(nearhard(xplayers, yplayers, mobs.mob[i].x, mobs.mob[i].y, 35, 35, -25, -35) == true){
			    		if(count > 0) text += `, свинья`
			    		if(count == 0){
			    			count += 1
			    			text += `свинья`
			    		}
		    		}
		    	}
	    	}

	    for(let i in base.p){
	    	if(base.p[i].online === 1){
	    	let x = base.p[i].world.x
	    	let y = base.p[i].world.y
	    	if(base.p[i].cent === 0) img.src = 'guard.png'
	    	if(base.p[i].cent === 1) img.src = 'guard1.png'
	    	ctx.drawImage(img, x, y)
	    	let xnick = base.p[i].world.x+17
	    	let ynick = base.p[i].world.y-5
	    	if(base.p[i].gun == 1){
		    	if(base.p[i].inventory.sword == 1){
			    	if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodps.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodps1.png';
			    	}
			    }
			}
			if(base.p[i].gun == 2){
				if(base.p[i].inventory.axe == 1){
					if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodas.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodas1.png';
			    	}
				}
			}
	    	ctx.drawImage(img, x, y)
	    	ctx.font = 'bold 13px sans';
	    	ctx.fillStyle = "#ffffff";
			ctx.textAlign = 'center';
			ctx.fillText(`${base.p[i].nick}`, xnick, ynick);
		}
	    }


	    	   ctx.font = 'bold 15px canvas';
	    	ctx.fillStyle = "#ffec18";
			ctx.textAlign = 'center';
			ctx.fillText(`Лаура`, 1297, 683);

	    var dataUrl = canvas.toDataURL();

	    img.src = `${dataUrl}`;

	    var canvass = createCanvas(700, 400);
		var ctxs = canvass.getContext('2d');

		xplayers = Math.floor(xplayers-330)
		xplayers = -xplayers

		yplayers = Math.floor(yplayers-178)
		yplayers = -yplayers

	    ctxs.drawImage(img, xplayers, yplayers)

		ctxs.font = '30px canvas';
	   	ctxs.fillStyle = "#751404";
		//ctx.textAlign = '';
		ctxs.fillText(`X: ${base.p[base.i[context.senderId].id].world.x}, Y: ${base.p[base.i[context.senderId].id].world.y}`, 518, 386);
		
		img.src = 'coin.png';
	    ctxs.drawImage(img, 4, 371)

	   ctxs.font = 'bold 20px canvas';
	    ctxs.fillStyle = "#ffffff";
	    ctxs.fillText(`${base.p[base.i[context.senderId].id].balance}`, 31, 392)

	    yplayers = await loadImage(base.p[base.i[context.senderId].id].photo_50)
		ctxs.drawImage(yplayers, 2, 2)

		img.src = `gui.png`;
		ctxs.drawImage(img, 0, 0)
		
		ctxs.font = '15px canvas';
	    ctx.fillStyle = "#ffffff";
		ctxs.textAlign = 'center';
		ctxs.fillText(`${base.p[base.i[context.senderId].id].lvl}`, 47, 54);

		base.p[base.i[context.senderId].id].caseopen = 0

		if(count === 0) return context.sendPhotos(canvass.toBuffer())
		if(count > 0) return context.sendPhotos({
			value: canvass.toBuffer()
		}, {
			message: `${text}`
		})
}})

updates.hear(/⬇/i, async (context) => {
	if(base.p[base.i[context.senderId].id].caseopen == 1) return
	base.p[base.i[context.senderId].id].caseopen = 1
	if(base.p[base.i[context.senderId].id].duel != 0){
		let proverka = Number(base.p[base.i[context.senderId].id].world.yd+20)
		base.p[base.i[context.senderId].id].caseopen = 0
		if(proverka > 288) return context.send(`Вы не можете выйти за границу карты!`)
		base.p[base.i[context.senderId].id].world.yd = Number(proverka)
		const { registerFont, createCanvas, loadImage } = require('canvas');
		registerFont('canvas.ttf', { family: 'canvas' })
		var canvas = createCanvas(500, 300);
		var ctx = canvas.getContext('2d');
		var Image = Canvas.Image;
		var img = new Image();
		img.src = 'duels.png';
		ctx.drawImage(img, 0, 0)
		let x = Number(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].world.xd)
		let y = Number(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].world.yd)
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent == 0) img.src = 'guard.png';
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent == 1) img.src = 'guard1.png';
		ctx.drawImage(img, x, y)
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].inventory.sword == 1){
			    if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent === 0) {
			    	x = Number(x+25)
			    	y = Number(y+2)
			    	img.src = 'woodps.png';
			    }
			    if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent === 1) {
					x = Number(x-7)
			    	y = Number(y+3)
			    	img.src = 'woodps1.png';
			    }
		}
		return context.sendPhotos(canvas.toBuffer())
	}
	if(base.p[base.i[context.senderId].id].worlds === 0){
	var yplayers = Number(base.p[base.i[context.senderId].id].world.y+20)
	if(yplayers > 1900) {
		context.send(`Вы не можете выйти за границу карты!`)
	} else {
		base.p[base.i[context.senderId].id].world.y += 20
	}


	var xplayers = Number(base.p[base.i[context.senderId].id].world.x)
	yplayers = Number(base.p[base.i[context.senderId].id].world.y)

	let text = `Рядом с вами: `
		let count = 0

		const { registerFont, createCanvas, loadImage } = require('canvas');
		registerFont('canvas.ttf', { family: 'canvas' })
		var canvas = createCanvas(2773, 2235);
		var ctx = canvas.getContext('2d');
		var Image = Canvas.Image;
		var img = new Image();
		img.src = 'pole.png';
	    ctx.drawImage(img, 0, 0) // (-433, -459)-83

	    if(near(xplayers, yplayers, 1300, 710) === true){
	    	count += 1
	    	text += `Лаура [Клавиатура: использовать]`
	    }
	    
	    for(let i in mobs.objects.tree){
		    if(nearhard(xplayers, yplayers, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy, 50, 65, -30, -25) == true) {
		    	if(count > 0) text += `, дерево`
		    	if(count == 0){
		    		count += 1
		    		text += `дерево`
		    	}
		    }
	    }

	    img.src = 'tree.png';

	for(let i in mobs.objects.tree){
	    	if(mobs.objects.tree[i].dead === 0){
	    		ctx.drawImage(img, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy)
	    	}
	    }

	    for(let i in mobs.mob){
		    	if(mobs.mob[i].type === 1){
		    		if(mobs.mob[i].cent === 0){
		    			img.src = `${mobs.mob[i].pig}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
					if(mobs.mob[i].cent === 1){
		    			img.src = `${mobs.mob[i].pig1}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
		    		if(nearhard(xplayers, yplayers, mobs.mob[i].x, mobs.mob[i].y, 35, 35, -25, -35) == true){
			    		if(count > 0) text += `, свинья`
			    		if(count == 0){
			    			count += 1
			    			text += `свинья`
			    		}
		    		}
		    	}
	    	}

	    for(let i in base.p){
	    	if(base.p[i].online === 1){
	    	let x = base.p[i].world.x
	    	let y = base.p[i].world.y
	    	if(base.p[i].cent === 0) img.src = 'guard.png'
	    	if(base.p[i].cent === 1) img.src = 'guard1.png'
	    	ctx.drawImage(img, x, y)
	    	let xnick = base.p[i].world.x+17
	    	let ynick = base.p[i].world.y-5
	    	if(base.p[i].gun == 1){
		    	if(base.p[i].inventory.sword == 1){
			    	if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodps.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodps1.png';
			    	}
			    }
			}
			if(base.p[i].gun == 2){
				if(base.p[i].inventory.axe == 1){
					if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodas.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodas1.png';
			    	}
				}
			}
	    	ctx.drawImage(img, x, y)
	    	ctx.font = 'bold 13px sans';
	    	ctx.fillStyle = "#ffffff";
			ctx.textAlign = 'center';
			ctx.fillText(`${base.p[i].nick}`, xnick, ynick);
		}
	    }


	    	   ctx.font = 'bold 15px canvas';
	    	ctx.fillStyle = "#ffec18";
			ctx.textAlign = 'center';
			ctx.fillText(`Лаура`, 1297, 683);

	    var dataUrl = canvas.toDataURL();

	    img.src = `${dataUrl}`;

	    var canvass = createCanvas(700, 400);
		var ctxs = canvass.getContext('2d');

		xplayers = Math.floor(xplayers-330)
		xplayers = -xplayers

		yplayers = Math.floor(yplayers-178)
		yplayers = -yplayers

	    ctxs.drawImage(img, xplayers, yplayers)

		ctxs.font = '30px canvas';
	   	ctxs.fillStyle = "#751404";
		//ctx.textAlign = '';
		ctxs.fillText(`X: ${base.p[base.i[context.senderId].id].world.x}, Y: ${base.p[base.i[context.senderId].id].world.y}`, 518, 386);
		
		img.src = 'coin.png';
	    ctxs.drawImage(img, 4, 371)

	    ctxs.font = 'bold 20px canvas';
	    ctxs.fillStyle = "#ffffff";
	    ctxs.fillText(`${base.p[base.i[context.senderId].id].balance}`, 31, 392)

	    yplayers = await loadImage(base.p[base.i[context.senderId].id].photo_50)
		ctxs.drawImage(yplayers, 2, 2)

		img.src = `gui.png`;
		ctxs.drawImage(img, 0, 0)
		
		ctxs.font = '15px canvas';
	    ctx.fillStyle = "#ffffff";
		ctxs.textAlign = 'center';
		ctxs.fillText(`${base.p[base.i[context.senderId].id].lvl}`, 47, 54);

		base.p[base.i[context.senderId].id].caseopen = 0

		if(count === 0) return context.sendPhotos(canvass.toBuffer())
		if(count > 0) return context.sendPhotos({
			value: canvass.toBuffer()
		}, {
			message: `${text}`
		})
}})

updates.hear(/⬆⬆⬆/i, async (context) => {
	if(base.p[base.i[context.senderId].id].caseopen == 1) return
	base.p[base.i[context.senderId].id].caseopen = 1
	if(base.p[base.i[context.senderId].id].duel != 0){
		let proverka = Number(base.p[base.i[context.senderId].id].world.yd-60)
		base.p[base.i[context.senderId].id].caseopen = 0
		if(proverka < 12) return context.send(`Вы не можете выйти за границу карты!`)
		base.p[base.i[context.senderId].id].world.yd = Number(proverka)
		const { registerFont, createCanvas, loadImage } = require('canvas');
		registerFont('canvas.ttf', { family: 'canvas' })
		var canvas = createCanvas(500, 300);
		var ctx = canvas.getContext('2d');
		var Image = Canvas.Image;
		var img = new Image();
		img.src = 'duels.png';
		ctx.drawImage(img, 0, 0)
		let x = Number(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].world.xd)
		let y = Number(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].world.yd)
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent == 0) img.src = 'guard.png';
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent == 1) img.src = 'guard1.png';
		ctx.drawImage(img, x, y)
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].inventory.sword == 1){
			    if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent === 0) {
			    	x = Number(x+25)
			    	y = Number(y+2)
			    	img.src = 'woodps.png';
			    }
			    if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent === 1) {
					x = Number(x-7)
			    	y = Number(y+3)
			    	img.src = 'woodps1.png';
			    }
		}
		return context.sendPhotos(canvas.toBuffer())
	}
	if(base.p[base.i[context.senderId].id].worlds === 0){
	var yplayers = Number(base.p[base.i[context.senderId].id].world.y-60)
	if(yplayers < 390) {
		context.send(`Вы не можете выйти за границу карты!`)
	} else {
		base.p[base.i[context.senderId].id].world.y -= 60
	}



	var xplayers = Number(base.p[base.i[context.senderId].id].world.x)
	yplayers = Number(base.p[base.i[context.senderId].id].world.y)

	let text = `Рядом с вами: `
		let count = 0

		const { registerFont, createCanvas, loadImage } = require('canvas');
		registerFont('canvas.ttf', { family: 'canvas' })
		var canvas = createCanvas(2773, 2235);
		var ctx = canvas.getContext('2d');
		var Image = Canvas.Image;
		var img = new Image();
		img.src = 'pole.png';
	    ctx.drawImage(img, 0, 0) // (-433, -459)-83
	    
	    if(near(xplayers, yplayers, 1300, 710) === true){
	    	count += 1
	    	text += `Лаура [Клавиатура: использовать]`
	    }

	    for(let i in mobs.objects.tree){
		    if(nearhard(xplayers, yplayers, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy, 50, 65, -30, -25) == true) {
		    	if(count > 0) text += `, дерево`
		    	if(count == 0){
		    		count += 1
		    		text += `дерево`
		    	}
		    }
	    }

	    img.src = 'tree.png';

	    for(let i in mobs.objects.tree){
	    	if(mobs.objects.tree[i].dead === 0){
	    		ctx.drawImage(img, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy)
	    	}
	    }

	   for(let i in mobs.mob){
		    	if(mobs.mob[i].type === 1){
		    		if(mobs.mob[i].cent === 0){
		    			img.src = `${mobs.mob[i].pig}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
					if(mobs.mob[i].cent === 1){
		    			img.src = `${mobs.mob[i].pig1}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
		    		if(nearhard(xplayers, yplayers, mobs.mob[i].x, mobs.mob[i].y, 35, 35, -25, -35) == true){
			    		if(count > 0) text += `, свинья`
			    		if(count == 0){
			    			count += 1
			    			text += `свинья`
			    		}
		    		}
		    	}
	    	}

	    for(let i in base.p){
	    	if(base.p[i].online === 1){
	    	let x = base.p[i].world.x
	    	let y = base.p[i].world.y
	    	if(base.p[i].cent === 0) img.src = 'guard.png'
	    	if(base.p[i].cent === 1) img.src = 'guard1.png'
	    	ctx.drawImage(img, x, y)
	    	let xnick = base.p[i].world.x+17
	    	let ynick = base.p[i].world.y-5
	    	if(base.p[i].gun == 1){
		    	if(base.p[i].inventory.sword == 1){
			    	if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodps.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodps1.png';
			    	}
			    }
			}
			if(base.p[i].gun == 2){
				if(base.p[i].inventory.axe == 1){
					if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodas.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodas1.png';
			    	}
				}
			}
	    	ctx.drawImage(img, x, y)
	    	ctx.font = 'bold 13px sans';
	    	ctx.fillStyle = "#ffffff";
			ctx.textAlign = 'center';
			ctx.fillText(`${base.p[i].nick}`, xnick, ynick);
		}
	    }


	    	    	ctx.font = 'bold 15px canvas';
	    	ctx.fillStyle = "#ffec18";
			ctx.textAlign = 'center';
			ctx.fillText(`Лаура`, 1297, 683);

	    var dataUrl = canvas.toDataURL();

	    img.src = `${dataUrl}`;

	    var canvass = createCanvas(700, 400);
		var ctxs = canvass.getContext('2d');

		xplayers = Math.floor(xplayers-330)
		xplayers = -xplayers

		yplayers = Math.floor(yplayers-178)
		yplayers = -yplayers

	    ctxs.drawImage(img, xplayers, yplayers)

		ctxs.font = '30px canvas';
	   	ctxs.fillStyle = "#751404";
		//ctx.textAlign = '';
		ctxs.fillText(`X: ${base.p[base.i[context.senderId].id].world.x}, Y: ${base.p[base.i[context.senderId].id].world.y}`, 518, 386);
		
		img.src = 'coin.png';
	    ctxs.drawImage(img, 4, 371)

	    ctxs.font = 'bold 20px canvas';
	    ctxs.fillStyle = "#ffffff";
	    ctxs.fillText(`${base.p[base.i[context.senderId].id].balance}`, 31, 392)

	    yplayers = await loadImage(base.p[base.i[context.senderId].id].photo_50)
		ctxs.drawImage(yplayers, 2, 2)

		img.src = `gui.png`;
		ctxs.drawImage(img, 0, 0)
		
		ctxs.font = '15px canvas';
	    ctx.fillStyle = "#ffffff";
		ctxs.textAlign = 'center';
		ctxs.fillText(`${base.p[base.i[context.senderId].id].lvl}`, 47, 54);

		base.p[base.i[context.senderId].id].caseopen = 0

		if(count === 0) return context.sendPhotos(canvass.toBuffer())
		if(count > 0) return context.sendPhotos({
			value: canvass.toBuffer()
		}, {
			message: `${text}`
		})}})

updates.hear(/⬆/i, async (context) => {
	if(base.p[base.i[context.senderId].id].caseopen == 1) return
	base.p[base.i[context.senderId].id].caseopen = 1
	if(base.p[base.i[context.senderId].id].duel != 0){
		let proverka = Number(base.p[base.i[context.senderId].id].world.yd-20)
		base.p[base.i[context.senderId].id].caseopen = 0
		if(proverka < 12) return context.send(`Вы не можете выйти за границу карты!`)
		base.p[base.i[context.senderId].id].world.yd = Number(proverka)
		const { registerFont, createCanvas, loadImage } = require('canvas');
		registerFont('canvas.ttf', { family: 'canvas' })
		var canvas = createCanvas(500, 300);
		var ctx = canvas.getContext('2d');
		var Image = Canvas.Image;
		var img = new Image();
		img.src = 'duels.png';
		ctx.drawImage(img, 0, 0)
		let x = Number(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].world.xd)
		let y = Number(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].world.yd)
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent == 0) img.src = 'guard.png';
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent == 1) img.src = 'guard1.png';
		ctx.drawImage(img, x, y)
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].inventory.sword == 1){
			    if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent === 0) {
			    	x = Number(x+25)
			    	y = Number(y+2)
			    	img.src = 'woodps.png';
			    }
			    if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent === 1) {
					x = Number(x-7)
			    	y = Number(y+3)
			    	img.src = 'woodps1.png';
			    }
		}
		return context.sendPhotos(canvas.toBuffer())
	}
	if(base.p[base.i[context.senderId].id].worlds === 0){
	var yplayers = Number(base.p[base.i[context.senderId].id].world.y-20)
	if(yplayers < 390) {
		context.send(`Вы не можете выйти за границу карты!`)
	} else {
		base.p[base.i[context.senderId].id].world.y -= 20
	}



	var xplayers = Number(base.p[base.i[context.senderId].id].world.x)
	yplayers = Number(base.p[base.i[context.senderId].id].world.y)

	let text = `Рядом с вами: `
		let count = 0

		const { registerFont, createCanvas, loadImage } = require('canvas');
		registerFont('canvas.ttf', { family: 'canvas' })
		var canvas = createCanvas(2773, 2235);
		var ctx = canvas.getContext('2d');
		var Image = Canvas.Image;
		var img = new Image();
		img.src = 'pole.png';
	    ctx.drawImage(img, 0, 0) // (-433, -459)-83
	    
	    if(near(xplayers, yplayers, 1300, 710) === true){
	    	count += 1
	    	text += `Лаура [Клавиатура: использовать]`
	    }

	    for(let i in mobs.objects.tree){
		    if(nearhard(xplayers, yplayers, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy, 50, 65, -30, -25) == true) {
		    	if(count > 0) text += `, дерево`
		    	if(count == 0){
		    		count += 1
		    		text += `дерево`
		    	}
		    }
	    }

	    img.src = 'tree.png';

	    for(let i in mobs.objects.tree){
	    	if(mobs.objects.tree[i].dead === 0){
	    		ctx.drawImage(img, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy)
	    	}
	    }

	    for(let i in mobs.mob){
		    	if(mobs.mob[i].type === 1){
		    		if(mobs.mob[i].cent === 0){
		    			img.src = `${mobs.mob[i].pig}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
					if(mobs.mob[i].cent === 1){
		    			img.src = `${mobs.mob[i].pig1}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
		    		if(nearhard(xplayers, yplayers, mobs.mob[i].x, mobs.mob[i].y, 35, 35, -25, -35) == true){
			    		if(count > 0) text += `, свинья`
			    		if(count == 0){
			    			count += 1
			    			text += `свинья`
			    		}
		    		}
		    	}
	    	}

	    for(let i in base.p){
	    	if(base.p[i].online === 1){
	    	let x = base.p[i].world.x
	    	let y = base.p[i].world.y
	    	if(base.p[i].cent === 0) img.src = 'guard.png'
	    	if(base.p[i].cent === 1) img.src = 'guard1.png'
	    	ctx.drawImage(img, x, y)
	    	let xnick = base.p[i].world.x+17
	    	let ynick = base.p[i].world.y-5
	    	if(base.p[i].gun == 1){
		    	if(base.p[i].inventory.sword == 1){
			    	if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodps.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodps1.png';
			    	}
			    }
			}
			if(base.p[i].gun == 2){
				if(base.p[i].inventory.axe == 1){
					if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodas.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodas1.png';
			    	}
				}
			}
	    	ctx.drawImage(img, x, y)
	    	ctx.font = 'bold 13px sans';
	    	ctx.fillStyle = "#ffffff";
			ctx.textAlign = 'center';
			ctx.fillText(`${base.p[i].nick}`, xnick, ynick);
		}
	    }


	    	    	ctx.font = 'bold 15px canvas';
	    	ctx.fillStyle = "#ffec18";
			ctx.textAlign = 'center';
			ctx.fillText(`Лаура`, 1297, 683);

	    var dataUrl = canvas.toDataURL();

	    img.src = `${dataUrl}`;

	    var canvass = createCanvas(700, 400);
		var ctxs = canvass.getContext('2d');

		xplayers = Math.floor(xplayers-330)
		xplayers = -xplayers

		yplayers = Math.floor(yplayers-178)
		yplayers = -yplayers

	    ctxs.drawImage(img, xplayers, yplayers)

		ctxs.font = '30px canvas';
	   	ctxs.fillStyle = "#751404";
		//ctx.textAlign = '';
		ctxs.fillText(`X: ${base.p[base.i[context.senderId].id].world.x}, Y: ${base.p[base.i[context.senderId].id].world.y}`, 518, 386);
		
		img.src = 'coin.png';
	    ctxs.drawImage(img, 4, 371)

	    ctxs.font = 'bold 20px canvas';
	    ctxs.fillStyle = "#ffffff";
	    ctxs.fillText(`${base.p[base.i[context.senderId].id].balance}`, 31, 392)

	    yplayers = await loadImage(base.p[base.i[context.senderId].id].photo_50)
		ctxs.drawImage(yplayers, 2, 2)

		img.src = `gui.png`;
		ctxs.drawImage(img, 0, 0)
		
		ctxs.font = '15px canvas';
	    ctx.fillStyle = "#ffffff";
		ctxs.textAlign = 'center';
		ctxs.fillText(`${base.p[base.i[context.senderId].id].lvl}`, 47, 54);

		base.p[base.i[context.senderId].id].caseopen = 0

		if(count === 0) return context.sendPhotos(canvass.toBuffer())
		if(count > 0) return context.sendPhotos({
			value: canvass.toBuffer()
		}, {
			message: `${text}`
		})}})

updates.hear(/➡➡➡/i, async (context) => {
	if(base.p[base.i[context.senderId].id].caseopen == 1) return
	base.p[base.i[context.senderId].id].caseopen = 1
	if(base.p[base.i[context.senderId].id].duel != 0){
		let proverka = Number(base.p[base.i[context.senderId].id].world.xd+60)
		base.p[base.i[context.senderId].id].caseopen = 0
		if(proverka > 490) return context.send(`Вы не можете выйти за границу карты!`)
		base.p[base.i[context.senderId].id].cent = 0
		base.p[base.i[context.senderId].id].world.xd = Number(proverka)
		const { registerFont, createCanvas, loadImage } = require('canvas');
		registerFont('canvas.ttf', { family: 'canvas' })
		var canvas = createCanvas(500, 300);
		var ctx = canvas.getContext('2d');
		var Image = Canvas.Image;
		var img = new Image();
		img.src = 'duels.png';
		ctx.drawImage(img, 0, 0)
		let x = Number(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].world.xd)
		let y = Number(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].world.yd)
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent == 0) img.src = 'guard.png';
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent == 1) img.src = 'guard1.png';
		ctx.drawImage(img, x, y)
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].inventory.sword == 1){
			    if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent === 0) {
			    	x = Number(x+25)
			    	y = Number(y+2)
			    	img.src = 'woodps.png';
			    }
			    if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent === 1) {
					x = Number(x-7)
			    	y = Number(y+3)
			    	img.src = 'woodps1.png';
			    }
		}
		return context.sendPhotos(canvas.toBuffer())
	}
	if(base.p[base.i[context.senderId].id].worlds === 0){

	var xplayers = Number(base.p[base.i[context.senderId].id].world.x+60)
	if(xplayers > 2035) {
		context.send(`Вы не можете выйти за границу карты!`)
	} else {
		base.p[base.i[context.senderId].id].world.x += 60
	}

	var yplayers = Number(base.p[base.i[context.senderId].id].world.y)

	base.p[base.i[context.senderId].id].cent = 0



	xplayers = Number(base.p[base.i[context.senderId].id].world.x)
	yplayers = Number(base.p[base.i[context.senderId].id].world.y)

	let text = `Рядом с вами: `
		let count = 0

		const { registerFont, createCanvas, loadImage } = require('canvas');
		registerFont('canvas.ttf', { family: 'canvas' })
		var canvas = createCanvas(2773, 2235);
		var ctx = canvas.getContext('2d');
		var Image = Canvas.Image;
		var img = new Image();
		img.src = 'pole.png';
	    ctx.drawImage(img, 0, 0) // (-433, -459)-83

	    if(near(xplayers, yplayers, 1300, 710) === true){
	    	count += 1
	    	text += `Лаура [Клавиатура: использовать]`
	    }
	    
	    for(let i in mobs.objects.tree){
		    if(nearhard(xplayers, yplayers, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy, 50, 65, -30, -25) == true) {
		    	if(count > 0) text += `, дерево`
		    	if(count == 0){
		    		count += 1
		    		text += `дерево`
		    	}
		    }
	    }

	    img.src = 'tree.png';

	    for(let i in mobs.objects.tree){
	    	if(mobs.objects.tree[i].dead === 0){
	    		ctx.drawImage(img, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy)
	    	}
	    }

	    for(let i in mobs.mob){
		    	if(mobs.mob[i].type === 1){
		    		if(mobs.mob[i].cent === 0){
		    			img.src = `${mobs.mob[i].pig}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
					if(mobs.mob[i].cent === 1){
		    			img.src = `${mobs.mob[i].pig1}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
		    		if(nearhard(xplayers, yplayers, mobs.mob[i].x, mobs.mob[i].y, 35, 35, -25, -35) == true){
			    		if(count > 0) text += `, свинья`
			    		if(count == 0){
			    			count += 1
			    			text += `свинья`
			    		}
		    		}
		    	}
	    	}

	    for(let i in base.p){
	    	if(base.p[i].online === 1){
	    	let x = base.p[i].world.x
	    	let y = base.p[i].world.y
	    	if(base.p[i].cent === 0) img.src = 'guard.png'
	    	if(base.p[i].cent === 1) img.src = 'guard1.png'
	    	ctx.drawImage(img, x, y)
	    	let xnick = base.p[i].world.x+17
	    	let ynick = base.p[i].world.y-5
	    	if(base.p[i].gun == 1){
		    	if(base.p[i].inventory.sword == 1){
			    	if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodps.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodps1.png';
			    	}
			    }
			}
			if(base.p[i].gun == 2){
				if(base.p[i].inventory.axe == 1){
					if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodas.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodas1.png';
			    	}
				}
			}
	    	ctx.drawImage(img, x, y)
	    	ctx.font = 'bold 13px sans';
	    	ctx.fillStyle = "#ffffff";
			ctx.textAlign = 'center';
			ctx.fillText(`${base.p[i].nick}`, xnick, ynick);
		}
	    }


	    	    	ctx.font = 'bold 15px canvas';
	    	ctx.fillStyle = "#ffec18";
			ctx.textAlign = 'center';
			ctx.fillText(`Лаура`, 1297, 683);

	    var dataUrl = canvas.toDataURL();

	    img.src = `${dataUrl}`;

	    var canvass = createCanvas(700, 400);
		var ctxs = canvass.getContext('2d');

		xplayers = Math.floor(xplayers-330)
		xplayers = -xplayers

		yplayers = Math.floor(yplayers-178)
		yplayers = -yplayers

	    ctxs.drawImage(img, xplayers, yplayers)

		ctxs.font = '30px canvas';
	   	ctxs.fillStyle = "#751404";
		//ctx.textAlign = '';
		ctxs.fillText(`X: ${base.p[base.i[context.senderId].id].world.x}, Y: ${base.p[base.i[context.senderId].id].world.y}`, 518, 386);
		

		img.src = 'coin.png';
	    ctxs.drawImage(img, 4, 371)

	    ctxs.font = 'bold 20px canvas';
	    ctxs.fillStyle = "#ffffff";
	    ctxs.fillText(`${base.p[base.i[context.senderId].id].balance}`, 31, 392)

	    yplayers = await loadImage(base.p[base.i[context.senderId].id].photo_50)
		ctxs.drawImage(yplayers, 2, 2)

		img.src = `gui.png`;
		ctxs.drawImage(img, 0, 0)
		
		ctxs.font = '15px canvas';
	    ctx.fillStyle = "#ffffff";
		ctxs.textAlign = 'center';
		ctxs.fillText(`${base.p[base.i[context.senderId].id].lvl}`, 47, 54);

		base.p[base.i[context.senderId].id].caseopen = 0

		if(count === 0) return context.sendPhotos(canvass.toBuffer())
		if(count > 0) return context.sendPhotos({
			value: canvass.toBuffer()
		}, {
			message: `${text}`
		})}
})

updates.hear(/➡/i, async (context) => {
	if(base.p[base.i[context.senderId].id].caseopen == 1) return
	base.p[base.i[context.senderId].id].caseopen = 1
	if(base.p[base.i[context.senderId].id].duel != 0){
		let proverka = Number(base.p[base.i[context.senderId].id].world.xd+20)
		base.p[base.i[context.senderId].id].caseopen = 0
		if(proverka > 490) return context.send(`Вы не можете выйти за границу карты!`)
		base.p[base.i[context.senderId].id].cent = 0
		base.p[base.i[context.senderId].id].world.xd = Number(proverka)
		const { registerFont, createCanvas, loadImage } = require('canvas');
		registerFont('canvas.ttf', { family: 'canvas' })
		var canvas = createCanvas(500, 300);
		var ctx = canvas.getContext('2d');
		var Image = Canvas.Image;
		var img = new Image();
		img.src = 'duels.png';
		ctx.drawImage(img, 0, 0)
		let x = Number(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].world.xd)
		let y = Number(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].world.yd)
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent == 0) img.src = 'guard.png';
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent == 1) img.src = 'guard1.png';
		ctx.drawImage(img, x, y)
		if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].inventory.sword == 1){
			    if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent === 0) {
			    	x = Number(x+25)
			    	y = Number(y+2)
			    	img.src = 'woodps.png';
			    }
			    if(base.p[duel.d[base.p[base.i[context.senderId].id].duel].player].cent === 1) {
					x = Number(x-7)
			    	y = Number(y+3)
			    	img.src = 'woodps1.png';
			    }
		}
		return context.sendPhotos(canvas.toBuffer())
	}
	if(base.p[base.i[context.senderId].id].worlds === 0){

	var xplayers = Number(base.p[base.i[context.senderId].id].world.x+20)
	if(xplayers > 2035) {
		context.send(`Вы не можете выйти за границу карты!`)
	} else {
		base.p[base.i[context.senderId].id].world.x += 20
	}

	var yplayers = Number(base.p[base.i[context.senderId].id].world.y+20)

	base.p[base.i[context.senderId].id].cent = 0



	xplayers = Number(base.p[base.i[context.senderId].id].world.x)
	yplayers = Number(base.p[base.i[context.senderId].id].world.y)

	let text = `Рядом с вами: `
		let count = 0

		const { registerFont, createCanvas, loadImage } = require('canvas');
		registerFont('canvas.ttf', { family: 'canvas' })
		var canvas = createCanvas(2773, 2235);
		var ctx = canvas.getContext('2d');
		var Image = Canvas.Image;
		var img = new Image();
		img.src = 'pole.png';
	    ctx.drawImage(img, 0, 0) // (-433, -459)-83
	    
		if(near(xplayers, yplayers, 1300, 710) === true){
	    	count += 1
	    	text += `Лаура [Клавиатура: использовать]`
	    }

	    for(let i in mobs.objects.tree){
		    if(nearhard(xplayers, yplayers, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy, 50, 65, -30, -25) == true) {
		    	if(count > 0) text += `, дерево`
		    	if(count == 0){
		    		count += 1
		    		text += `дерево`
		    	}
		    }
	    }

	    img.src = 'tree.png';

	    for(let i in mobs.objects.tree){
	    	if(mobs.objects.tree[i].dead === 0){
	    		ctx.drawImage(img, mobs.objects.tree[i].coordsx, mobs.objects.tree[i].coordsy)
	    	}
	    }

	    for(let i in mobs.mob){
		    	if(mobs.mob[i].type === 1){
		    		if(mobs.mob[i].cent === 0){
		    			img.src = `${mobs.mob[i].pig}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
					if(mobs.mob[i].cent === 1){
		    			img.src = `${mobs.mob[i].pig1}`
		    			ctx.drawImage(img, mobs.mob[i].x, mobs.mob[i].y)
		    		}
		    		if(nearhard(xplayers, yplayers, mobs.mob[i].x, mobs.mob[i].y, 35, 35, -25, -35) == true){
			    		if(count > 0) text += `, свинья`
			    		if(count == 0){
			    			count += 1
			    			text += `свинья`
			    		}
		    		}
		    	}
	    	}

	    for(let i in base.p){
	    	if(base.p[i].online === 1){
	    	let x = base.p[i].world.x
	    	let y = base.p[i].world.y
	    	if(base.p[i].cent === 0) img.src = 'guard.png'
	    	if(base.p[i].cent === 1) img.src = 'guard1.png'
	    	ctx.drawImage(img, x, y)
	    	let xnick = base.p[i].world.x+17
	    	let ynick = base.p[i].world.y-5
	    	if(base.p[i].gun == 1){
		    	if(base.p[i].inventory.sword == 1){
			    	if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodps.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodps1.png';
			    	}
			    }
			}
			if(base.p[i].gun == 2){
				if(base.p[i].inventory.axe == 1){
					if(base.p[i].cent === 0) {
			    		x = Number(x+25)
			    		y = Number(y+2)
			    		img.src = 'woodas.png';
			    	}
			    	if(base.p[i].cent === 1) {
						x = Number(x-7)
			    		y = Number(y+3)
			    		img.src = 'woodas1.png';
			    	}
				}
			}
	    	ctx.drawImage(img, x, y)
	    	ctx.font = 'bold 13px sans';
	    	ctx.fillStyle = "#ffffff";
			ctx.textAlign = 'center';
			ctx.fillText(`${base.p[i].nick}`, xnick, ynick);
		}
	    }


	    	    	ctx.font = 'bold 15px canvas';
	    	ctx.fillStyle = "#ffec18";
			ctx.textAlign = 'center';
			ctx.fillText(`Лаура`, 1297, 683);

	    var dataUrl = canvas.toDataURL();

	    img.src = `${dataUrl}`;

	    var canvass = createCanvas(700, 400);
		var ctxs = canvass.getContext('2d');

		xplayers = Math.floor(xplayers-330)
		xplayers = -xplayers

		yplayers = Math.floor(yplayers-178)
		yplayers = -yplayers

	    ctxs.drawImage(img, xplayers, yplayers)

		ctxs.font = '30px canvas';
	   	ctxs.fillStyle = "#751404";
		//ctx.textAlign = '';
		ctxs.fillText(`X: ${base.p[base.i[context.senderId].id].world.x}, Y: ${base.p[base.i[context.senderId].id].world.y}`, 518, 386);
		
		img.src = 'coin.png';
	    ctxs.drawImage(img, 4, 371)

	    ctxs.font = 'bold 20px canvas';
	    ctxs.fillStyle = "#ffffff";
	    ctxs.fillText(`${base.p[base.i[context.senderId].id].balance}`, 31, 392)

	    yplayers = await loadImage(base.p[base.i[context.senderId].id].photo_50)
		ctxs.drawImage(yplayers, 2, 2)

		img.src = `gui.png`;
		ctxs.drawImage(img, 0, 0)
		
		ctxs.font = '15px canvas';
	    ctx.fillStyle = "#ffffff";
		ctxs.textAlign = 'center';
		ctxs.fillText(`${base.p[base.i[context.senderId].id].lvl}`, 47, 54);


		base.p[base.i[context.senderId].id].caseopen = 0

		if(count === 0) return context.sendPhotos(canvass.toBuffer())
		if(count > 0) return context.sendPhotos({
			value: canvass.toBuffer()
		}, {
			message: `${text}`
		})}
})

updates.hear(/eval/i, async (context) => {
	if(base.p[base.i[context.senderId].id].rank < 10) return
	let text = `${context.text}`
	text = text.replace(`eval `, ``)
	await eval(text)
})



/*vk.updates.hear(/кейсы 1/i, async (context) => {
	if(base.p[base.i[context.senderId].id].caseopen === 1) return
	const { createCanvas, loadImage } = require('canvas');
	const canvas = createCanvas(1920, 1040);
	const ctx = canvas.getContext('2d');
	const Image = Canvas.Image;
	const img = new Image();
	let random = [rand([`vip.png`, `exp.png`, `exp.png`, `banan.png`, `banan.png`, `banan.png`]), rand([`vip.png`, `exp.png`, `exp.png`, `banan.png`, `banan.png`, `banan.png`]), rand([`vip.png`, `exp.png`, `exp.png`, `banan.png`, `banan.png`, `banan.png`]), rand([`vip.png`, `exp.png`, `exp.png`, `exp.png`, `banan.png`, `banan.png`, `banan.png`, `banan.png`]), rand([`vip.png`, `exp.png`, `exp.png`, `banan.png`, `banan.png`, `banan.png`]), rand([`vip.png`, `exp.png`, `exp.png`, `banan.png`, `banan.png`, `banan.png`]), rand([`vip.png`, `exp.png`, `exp.png`, `banan.png`, `banan.png`, `banan.png`]), rand([`vip.png`, `exp.png`, `exp.png`, `banan.png`, `banan.png`, `banan.png`])]
	let random1 = getRandomInRange(5,5)
	img.src = 'case.png';
	ctx.drawImage(img, 0, 0);
	base.p[base.i[context.senderId].id].caseopen = 1
	if(random1 === 5){
		context.send(`>> открываю кейс`).then(res => {
			var idmessage = res
				let imgs = new Image()
				imgs.src = `${random[0]}` // 1 массив
				ctx.drawImage(imgs, 1263, 324) // 1 массив
				upload.messagePhoto({
					peer_id: context.senderId,
					source: canvas.toBuffer()
				}).then(id => {
					vk.api.messages.edit({
						peer_id: context.senderId,
						message_id: res,
						attachment: `photo${id.ownerId}_${id.id}_${id.accesKey}`
					})
				})
				setTimeout(() => {
					let img = new Image();
					img.src = 'case.png';
					ctx.drawImage(img, 0, 0);

					let imgs = new Image()
					imgs.src = `${random[0]}` // 1 массив
					ctx.drawImage(imgs, 745, 324) // 239 324

					let imgt = new Image()
					imgt.src = `${random[1]}` // 2 массив
					ctx.drawImage(imgt, 1263, 324)

					upload.messagePhoto({
						peer_id: context.senderId,
						source: canvas.toBuffer()
					}).then(id => {
						vk.api.messages.edit({
							peer_id: context.senderId,
							message_id: res,
							attachment: `photo${id.ownerId}_${id.id}_${id.accesKey}`
						})
					})
					setTimeout(() => {
						let img = new Image();
						img.src = 'case.png';
						ctx.drawImage(img, 0, 0);

						let imgs = new Image()
						imgs.src = `${random[0]}` // 1 массив
						ctx.drawImage(imgs, 239, 324)

						let imgt = new Image()
						imgt.src = `${random[1]}` // 2 массив
						ctx.drawImage(imgt, 745, 324)

						let imgp = new Image()
						imgp.src = `${random[2]}` // 3 массив
						ctx.drawImage(imgp, 1263, 324)

						upload.messagePhoto({
							peer_id: context.senderId,
							source: canvas.toBuffer()
						}).then(id => {
							vk.api.messages.edit({
								peer_id: context.senderId,
								message_id: res,
								attachment: `photo${id.ownerId}_${id.id}_${id.accesKey}`
							})
						})

						setTimeout(() => {
							let img = new Image();
							img.src = 'case.png';
							ctx.drawImage(img, 0, 0);

							let imgs = new Image()
							imgs.src = `${random[1]}` // 2 массив
							ctx.drawImage(imgs, 239, 324)

							let imgt = new Image()
							imgt.src = `${random[2]}` // 3 массив
							ctx.drawImage(imgt, 745, 324)

							let imgp = new Image()
							imgp.src = `${random[3]}` // 4 массив
							ctx.drawImage(imgp, 1263, 324)
							upload.messagePhoto({
								peer_id: context.senderId,
								source: canvas.toBuffer()
							}).then(id => {
								vk.api.messages.edit({
									peer_id: context.senderId,
									message_id: res,
									attachment: `photo${id.ownerId}_${id.id}_${id.accesKey}`
								})
							})
							setTimeout(() => {
								let img = new Image();
								img.src = 'case.png';
								ctx.drawImage(img, 0, 0);

								let imgs = new Image()
								imgs.src = `${random[2]}` // 3 массив
								ctx.drawImage(imgs, 239, 324)

								let imgt = new Image()
								imgt.src = `${random[3]}` // 4 массив
								ctx.drawImage(imgt, 745, 324)

								let imgp = new Image()
								imgp.src = `${random[4]}` // 5 массив
								ctx.drawImage(imgp, 1263, 324)

								upload.messagePhoto({
									peer_id: context.senderId,
									source: canvas.toBuffer()
								}).then(id => {
									vk.api.messages.edit({
										peer_id: context.senderId,
										message_id: res,
										attachment: `photo${id.ownerId}_${id.id}_${id.accesKey}`
									})
								})
								setTimeout(() => {
									//[`vip.png`, `money.png`, `exp.png`]
									base.p[base.i[context.senderId].id].caseopen = 0
									if(random[3] == `vip.png`) {
										return context.send(`Вам выпал вип ВЫ ЛОХ :)`)
									}
									if(random[3] == `banan.png`) {
										return context.send(`Вам выпало: ${getRandomInRange(1, 10000)} бананов`)
									}
									if(random[3] == `exp.png`) {
										return context.send(`Вам выпало: ${getRandomInRange(1,50)} опыта`)
									}
								}, 2000)
							}, 2000)
						}, 2000)
					}, 2000)
				}, 2000)
		})
	}
})



	updates.hear(/дата/i, async (context) => {
	let datas = await request(`https://apidog.ru/api/v2/apidog.getUserDateRegistration?userDomain=${context.senderId}`); 
	var xpp = JSON.parse(datas)
	let datass = `${xpp.response.date}`
	console.log(datass)
	if(datass.includes(`января`)) datass = datass.replace(` января `, `.01.`)
	if(datass.includes(`февраля`)) datass = datass.replace(` февраля `, `.02.`)
	if(datass.includes(`марта`)) datass = datass.replace(` марта `, `.03.`)
	if(datass.includes(`апреля`)) datass = datass.replace(` апреля `, `.04.`)
	if(datass.includes(`мая`)) datass = datass.replace(` мая `, `.05.`)
	if(datass.includes(`июня`)) datass = datass.replace(` июня `, `.06.`)
	if(datass.includes(`июля`)) datass = datass.replace(` июля `, `.07.`)
	if(datass.includes(`августа`)) datass = datass.replace(` августа `, `.08.`)
	if(datass.includes(`сентября`)) datass = datass.replace(` сентября `, `.09.`)
	if(datass.includes(`октября`)) datass = datass.replace(` октября `, `.10.`)
	if(datass.includes(`ноября`)) datass = datass.replace(` ноября `, `.11.`)
	if(datass.includes(`декабря`)) datass = datass.replace(` декабря `, `.12.`)
	console.log(datass)
	let datamass = splitString(datass, '.')
	console.log(datamass)
	let prov = `${datamass[2]}.${datamass[1]}.${datamass[0]} ${xpp.response.time}`
	console.log(prov)
})*/

/*			ctx.font = '30px Roboto';
			ctx.fillStyle = "#F4ECD2";
			ctx.fillText(`${user_info.first_name}`, 216, 310);*/



/*			const mychit = await loadImage(ava_info.photo_200);
			ctx.drawImage(mychit, 215, 60);*/

async function run() {
    await vk.updates.startPolling();
    for(let i in base.p){
    	base.p[i].caseopen = 0
    }
    for(let j in mobs.mob){
    	delete mobs.mob[j]
    }
    base.c.pig = 0
    console.log(chalk.red(">_ Started"));
} 
 
run().catch(console.error);
// Получаем UnixDate в секундах
function getUnix() {
    return Math.floor(Date.now() / 1000);
}