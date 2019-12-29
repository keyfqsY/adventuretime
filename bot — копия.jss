updates.hear(/⬅/i, async (context) => {
	base.p[base.i[context.senderId].id].x -= 20


	var xplayers = Number(base.p[base.i[context.senderId].id].x)
	var yplayers = Number(base.p[base.i[context.senderId].id].y)

	var { createCanvas, loadImage } = require('canvas')
	var canvas = createCanvas(1000, 1000);
	var ctx = canvas.getContext('2d');
	var Image = Canvas.Image;
	var img = new Image();
	img.src = 'pole.png';
    ctx.drawImage(img, 0, 0) // (-433, -459)-83
    for(let i in base.p){
    	let x = base.p[i].x
    	let y = base.p[i].y
    	img.src = 'guard.png';
    	ctx.drawImage(img, x, y)
    }

    var dataUrl = canvas.toDataURL();

    img.src = `${dataUrl}`;

    var canvass = createCanvas(200, 200);
	var ctxs = canvass.getContext('2d');

	xplayers = Math.floor(xplayers-83)
	xplayers = -xplayers

	yplayers = Math.floor(yplayers-83)
	yplayers = -yplayers

    ctxs.drawImage(img, xplayers, yplayers)

        return context.sendPhotos({
    	value: canvass.toBuffer()}, {
    		message: `Ваши координаты:\nX: ${base.p[base.i[context.senderId].id].x},\nY: ${base.p[base.i[context.senderId].id].y}`
    	}
    )})

updates.hear(/⬇/i, async (context) => {
	base.p[base.i[context.senderId].id].y += 20


		var xplayers = Number(base.p[base.i[context.senderId].id].x)
	var yplayers = Number(base.p[base.i[context.senderId].id].y)

	var { createCanvas, loadImage } = require('canvas')
	var canvas = createCanvas(1000, 1000);
	var ctx = canvas.getContext('2d');
	var Image = Canvas.Image;
	var img = new Image();
	img.src = 'pole.png';
    ctx.drawImage(img, 0, 0) // (-433, -459)-83
    for(let i in base.p){
    	let x = base.p[i].x
    	let y = base.p[i].y
    	img.src = 'guard.png';
    	ctx.drawImage(img, x, y)
    }

    var dataUrl = canvas.toDataURL();

    img.src = `${dataUrl}`;

    var canvass = createCanvas(200, 200);
	var ctxs = canvass.getContext('2d');

	xplayers = Math.floor(xplayers-83)
	xplayers = -xplayers

	yplayers = Math.floor(yplayers-83)
	yplayers = -yplayers

    ctxs.drawImage(img, xplayers, yplayers)

    return context.sendPhotos({
    	value: canvass.toBuffer()}, {
    		message: `Ваши координаты:\nX: ${base.p[base.i[context.senderId].id].x},\nY: ${base.p[base.i[context.senderId].id].y}`
    	}
    )})

updates.hear(/⬆/i, async (context) => {
	base.p[base.i[context.senderId].id].y -= 20


	var xplayers = Number(base.p[base.i[context.senderId].id].x)
	var yplayers = Number(base.p[base.i[context.senderId].id].y)

	var { createCanvas, loadImage } = require('canvas')
	var canvas = createCanvas(1000, 1000);
	var ctx = canvas.getContext('2d');
	var Image = Canvas.Image;
	var img = new Image();
	img.src = 'pole.png';
    ctx.drawImage(img, 0, 0) // (-433, -459)-83
    for(let i in base.p){
    	let x = base.p[i].x
    	let y = base.p[i].y
    	img.src = 'guard.png';
    	ctx.drawImage(img, x, y)
    }

    var dataUrl = canvas.toDataURL();

    img.src = `${dataUrl}`;

    var canvass = createCanvas(200, 200);
	var ctxs = canvass.getContext('2d');

	xplayers = Math.floor(xplayers-83)
	xplayers = -xplayers

	yplayers = Math.floor(yplayers-83)
	yplayers = -yplayers

    ctxs.drawImage(img, xplayers, yplayers)

    return context.sendPhotos({
    	value: canvass.toBuffer()}, {
    		message: `Ваши координаты:\nX: ${base.p[base.i[context.senderId].id].x},\nY: ${base.p[base.i[context.senderId].id].y}`
    	}
    )})

updates.hear(/➡/i, async (context) => {
	base.p[base.i[context.senderId].id].x += 20


	var xplayers = Number(base.p[base.i[context.senderId].id].x)
	var yplayers = Number(base.p[base.i[context.senderId].id].y)

	var { createCanvas, loadImage } = require('canvas')
	var canvas = createCanvas(1000, 1000);
	var ctx = canvas.getContext('2d');
	var Image = Canvas.Image;
	var img = new Image();
	img.src = 'pole.png';
    ctx.drawImage(img, 0, 0) // (-433, -459)-83
    for(let i in base.p){
    	let x = base.p[i].x
    	let y = base.p[i].y
    	img.src = 'guard.png';
    	ctx.drawImage(img, x, y)
    }

    var dataUrl = canvas.toDataURL();

    img.src = `${dataUrl}`;

    var canvass = createCanvas(200, 200);
	var ctxs = canvass.getContext('2d');

	xplayers = Math.floor(xplayers-83)
	xplayers = -xplayers

	yplayers = Math.floor(yplayers-83)
	yplayers = -yplayers

    ctxs.drawImage(img, xplayers, yplayers)

        return context.sendPhotos({
    	value: canvass.toBuffer()}, {
    		message: `Ваши координаты:\nX: ${base.p[base.i[context.senderId].id].x},\nY: ${base.p[base.i[context.senderId].id].y}`
    	}
    )})