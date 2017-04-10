
var Main = {
	gameInfo : {w:0,h:0},
	cxt : null,
	person : null,
	timeQuene : null,
	time : 0,
	leveltime : 0,
	level : 0,
	imgs : [],
	blocks : [],
	init : function(){

		Main.initStart();
	},
	initStart : function(){

		Main.initData();
	},
	initData : function(){
		
		WF.file.imgs(["img/man.png","img/block.png","img/move.png","img/thorn.png","img/flip.png","img/thorn_bg.png"],function(imgs){

			Main.imgs = imgs;
			
			var canvas = WF.getId("canvas");
		
			Main.gameInfo.w = canvas.offsetWidth;
			Main.gameInfo.h = canvas.offsetHeight;
		
			Main.cxt = canvas.getContext("2d");

			WF.getId("js_start_loading").style.display="none";
			WF.getId("js_start_btn").style.display = "block";
		});
	},
	start : function(){

		WF.getId("js_start_flush").style.display = "none";

		Main.person = new Person(150,0,Main.imgs[0],Main.cxt,Main.gameInfo);
			
		Main.initBlock(Main.imgs);

		Main.initEvent();
		Main.process();
	},
	initBlock : function(imgs){

		BlockFactory.init({
			block : imgs[1],
			move : imgs[2],
			flip : imgs[4],
			thorn : imgs[3],
			cxt : Main.cxt,
			gameinfo : Main.gameInfo
		});

		var block = new NormalBlock(120,460,imgs[1],Main.cxt,Main.gameInfo);

		block.init();

		Main.blocks.push(block);
	},
	drawThornBg : function(){

		for(var i=0;i<=35;i++){
			Main.cxt.drawImage(Main.imgs[5],0,0,18,21,i*9,0,9,11);
		}
	},
	initEvent : function(){
		
		WF.getId("js_main").onkeydown = function(e){Main.keyDown(e);};
		WF.getId("js_main").onkeyup = function(e){Main.keyUp(e);};

		WF.getId("js_left_btn").ontouchstart = function(){

			Main.person.changeDir("left");
		}
		WF.getId("js_right_btn").ontouchstart = function(){

			Main.person.changeDir("right");
		}
		WF.getId("js_left_btn").ontouchend = WF.getId("js_right_btn").ontouchend = function(){

			Main.person.changeDir("normal");
		}
	},
	keyDown : function(e){

		if(e.keyCode == 37){
			
			this.person.changeDir("left");
		}
		if(e.keyCode == 39){
			
			this.person.changeDir("right");
		}
		
		e.preventDefault();
	},
	keyUp : function(e){
		
		if(e.keyCode == 37 || e.keyCode == 39){
			
			this.person.changeDir("normal");
		}
		
		e.preventDefault();
	},
	process : function(){
	
		var tq = new WF.time.TimeProcess();

		tq.add(Main.draw,null,Main);
		tq.add(Main.update,null,Main);
		
		this.timeQuene = tq;
		this.timeQuene.start();
	},
	update : function(){
		
		Main.time++;
		
		if(Main.time >= 40){
			
			Main.blocks.push(BlockFactory.create());
			
			Main.time = 0;
			Main.leveltime += 2;

			Main.level = Math.floor(Main.leveltime / 10);
		}
		
		Main.person.update();

		if(Main.person.isDead){

			Main.over();

			WF.getId("js_life").style.width = "0px";

			return false;
		}

		for(var i=0,l=Main.blocks.length;i<l;i++){

			var block = Main.blocks[i];

			if(!block)continue;

			block.update();

			if(block.checkMap() || block.dismiss){

				Main.removeBlock(block);

				i--;

				if(block.dismiss && Main.person.block)Main.person.goDown();

				block = null;

				continue;
			}

			if(Main.person.checkBlockOn(block)){}
		}

	},
	draw : function(){
		
		Main.cxt.clearRect(0,0,Main.gameInfo.w,Main.gameInfo.h);

		Main.drawThornBg();

		Main.person.draw();

		for(var i=0,l=Main.blocks.length;i<l;i++){

			if(!Main.blocks[i])continue;

			Main.blocks[i].draw();
		}

		WF.getId("js_life").style.width = Main.person.life + "px";
		WF.getId("js_level").innerHTML = Main.level;
	},
	removeBlock : function(block){

		Main.blocks.splice(Main.blocks.indexOf(block),1);
	},
	over : function(){

		this.timeQuene.stop();

		WF.getId("js_end_flush").style.display = "block";

		function dp_share(t){
			if(t<=20)
			{
				document.title = "我下了"+t+"层。等级：不是男人";
				alert("点击右上角分享朋友圈");
				window.shareData.tTitle = document.title;
			}
			else if(t>20&&t<100)
			{
				document.title = "我下了"+t+"层。等级：男人不能说不行";
				alert("点击右上角分享朋友圈");
				window.shareData.tTitle = document.title;
			}
			else
			{
				document.title = "我下了"+t+"层。等级：男人中的佼佼者！";
				alert("点击右上角分享朋友圈");
				window.shareData.tTitle = document.title;
			}
		}//分享朋友圈

		if(this.level >= 100){

			WF.getId("js_end_flush").getElementsByTagName("p")[0].innerHTML = "你牛B呀,下了<label>"+this.level+"</label>层,男人中的男人呀！";
			WF.getId("js_end_flush").getElementsByTagName("a")[0].innerHTML = "想更男人一点";
			WF.getId("js_end_flush").getElementsByTagName("span")[0].className = "icon happy";
			dp_share(this.level);
		}
		else{
			WF.getId("js_end_flush").getElementsByTagName("p")[0].innerHTML = "你太菜了,才玩了<label>"+this.level+"</label>层,还不算真男人呀！";
			WF.getId("js_end_flush").getElementsByTagName("a")[0].innerHTML = "再来一次";
			WF.getId("js_end_flush").getElementsByTagName("span")[0].className = "icon";
			dp_share(this.level);
		}

	},
	replay : function(){

		Main.blocks = [];
		Main.time = 0;
		Main.leveltime = 0;
		Main.level = 0;
		Main.person.life = 100;

		Main.start();

		WF.getId("js_end_flush").style.display = "none";
	}
};
Main.init();