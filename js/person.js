//一个人的定义
var Person = function(x,y,img,cxt,panelInfo) {
	
	this.x = x;
	this.y = y;
	this.img = img;
	this.cxt = cxt;
	this.pinfo = panelInfo;
	
	this.xspeed = 7;
	this.yspeed = 5;

	this.yaspeed = 0.2;

	this.life = 10;

	this.lifeAdd = 0.5;
	
	this.dir = "down";

	this.lastKey = "";
	
	this.sprite = null;

	this.isJump = true;

	this.isFilp = false;

	this.block = null;

	this.isDead = false;
	
	this.init();
}
Person.prototype = {
	
	init : function(){
		
		this.initSprite();

		this.sprite.setYSpeed(this.yspeed,this.yaspeed);
	},
	initSprite : function(){
		
		var sprite = new WF.sprite.Sprite(this.img,this.cxt,10,{x:this.x,y:this.y});
		
		sprite.add("down",new WF.sprite.Animation({startX:64,sw:64,sh:64,width:32,height:32}));
		sprite.add("normal",new WF.sprite.Animation({sw:64,sh:64,width:32,height:32}));
		sprite.add("up",new WF.sprite.Animation({startX:128,sw:64,sh:64,width:32,height:32}));
		sprite.add("right",new WF.sprite.Animation({startX:320,fs:2,sw:64,sh:64,width:32,height:32,loop:true}));
		sprite.add("left",new WF.sprite.Animation({startX:192,fs:2,sw:64,sh:64,width:32,height:32,loop:true}));
		
		this.sprite = sprite;
	},
	update : function(){

		this.sprite.update();

		this.life += this.lifeAdd;
		if(this.life >= 100)this.life = 100;
		
		//判断边界值
		var f_size = this.size();
		
		var x = f_size.x;
		var y = f_size.y;
		
		if(x <= 0)x = 0;
		if(f_size.r >= this.pinfo.w)x = this.pinfo.w - f_size.w;

		if(f_size.b >= this.pinfo.h && this.isJump==true){
			y = this.pinfo.h - f_size.h;

			this.dead();
		}

		if(f_size.y <= 0)this.dead();

		//判断是否离开方块
		if(this.block){

			var b_size = this.block.size();

			if(f_size.r <= b_size.x || f_size.x >= b_size.r){

				this.goDown();
			}
		}

		if(this.isFilp && this.sprite.yspeed >= 0){

			this.goDown();
		}
		
		this.move(x,y);
	},
	draw : function(){
		
		this.sprite.draw();
	},
	changeDir : function(dir,flag){

		this.lastKey = dir;
			
		if(this.isDead)return false;

		if(dir == this.dir && (dir=="left" || dir=="right"))return false;

		if(this.isJump == false || dir == "down" || dir == "up"){

			this.dir = dir;
		
			this.sprite.change(this.dir);
		}

		var xforce = this.block?this.block.xforce||0:0;
		
		if(dir == "left")this.sprite.setXSpeed(this.xspeed*-1 + xforce);
		else if(dir == "right")this.sprite.setXSpeed(this.xspeed + xforce);
		else if(dir == "normal" && !flag) this.sprite.setXSpeed(xforce);
	},
	size : function(){
		
		return this.sprite.size();
	},
	move : function(x,y){

		this.sprite.move(x,y);
	},
	checkBlockOn : function(block){

		if(!this.isJump)return false;

		var m_size = this.size();
		var b_size = block.sprite.size();

		if(m_size.r > b_size.x && m_size.x < b_size.r){

			if(m_size.b >= b_size.y && m_size.b <= b_size.b +4){

				this.standBlock(m_size.x,b_size.y-m_size.h);

				this.block = block;

				block.ManOn(this);

				return true;
			}
		}

		return false;
	},
	standBlock : function(x,y){

		this.move(x,y);

		this.isJump = false;

		if(this.lastKey == "left" || this.lastKey == "right"){
			this.changeDir(this.lastKey);
		}else{
			this.changeDir("normal",true);
		}
	},
	goDown : function(){

		if(this.dir == "normal")this.sprite.setXSpeed(0);

		this.sprite.setYSpeed(this.yspeed,this.yaspeed);
		this.changeDir("down");
		this.isJump = true;
		this.isFilp = false;

		this.block = null;
	},
	goUp : function(){

		this.changeDir("up");

		this.isJump = true;

		this.isFilp = true;

		this.block = null;

		this.sprite.setYSpeed(this.yspeed*-2,0.4);
	},
	changeSpeed : function(xspeed,yspeed){

		if(xspeed)this.sprite.setXSpeed(xspeed);
		if(yspeed)this.sprite.setYSpeed(yspeed);
	},
	setXForce : function(xforce){

		if(this.dir == "left"){
			this.sprite.setXSpeed(this.xspeed * -1 + xforce);
		}
		else if(this.dir == "right"){
			this.sprite.setXSpeed(this.xspeed + xforce);
		}
		else if(this.dir == "normal"){
			this.sprite.setXSpeed(xforce);
		}
	},
	cutLift : function(cut){

		this.life -= cut;

		if(this.life <= 0)this.dead();
	},
	dead : function(){

		this.sprite.setXSpeed(0);
		this.sprite.setYSpeed(0);

		this.changeDir("normal");

		this.isDead = true;
	}
}