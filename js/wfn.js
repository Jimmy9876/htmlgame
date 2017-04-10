
var WF = function(){
	
	function getId(id){
		
		return typeof id=="string"?document.getElementById(id):id;
	}
	
	function query(str){}
	
	function reg(space,obj){
		
		var namespace = exports[space] || {};
		
		for(var key in obj){
			namespace[key] = obj[key];
		}
		
		exports[space] = namespace;
	}

	//扩展原生事件
	Object.prototype.Clone = function(){
	    var objClone;
	    if (this.constructor == Object){
	        objClone = new this.constructor(); 
	    }else{
	        objClone = new this.constructor(this.valueOf()); 
	    }
	    for(var key in this){
	        if ( objClone[key] != this[key] ){ 
	            if ( typeof(this[key]) == 'object' ){ 
	                objClone[key] = this[key].Clone();
	            }else{
	                objClone[key] = this[key];
	            }
	        }
	    }
	    objClone.toString = this.toString;
	    objClone.valueOf = this.valueOf;
	    return objClone; 
	}
	
	var exports = {
		
		getId : getId,
		reg : reg
	};
	
	return exports;
}();

WF.reg("dom",function(){
	
	function dispatch(dom, type) {
        try {
            var ev = document.createEvent("Event");
            ev.initEvent(type, true, true);
            dom.dispatchEvent(ev);
        } catch (d) {
	        console.log(type+"_error");
        }
    }
    
    function insertAfter(newElement,targetElement){ 
    	var parent = targetElement.parentNode; 
    	if ( parent.lastChild == targetElement) { 
    		parent.appendChild(newElement); 
    	} 
    	else { 
    		parent.insertBefore(newElement,targetElement.nextSibling); 
    	}
    }
    
    function isChild(child,parent){
	    
	    while(child){
		    
		    if(child == document.body)return false;
		    
		    if(child == parent)return true;
		    
		    child = child.parentNode;
	    }
	    return false;
    }
    
    function bindClick(dom,handler){
	    
	    var name = WF.browser.versions.ios?"touchend":"click";
	    
	    dom.addEventListener(name,handler,false);
	    //dom.addEventListener("touchend",handler,false);
    }
    
    function removeClick(dom,handler){
	    
	    var name = WF.browser.versions.ios?"touchend":"click";

	    dom.removeEventListener(name,handler,false);
    }
    
    var exports = {
	    dispatch : dispatch,
	    insertAfter : insertAfter,
	    isChild : isChild,
	    bindClick : bindClick,
	    removeClick : removeClick
    };
    
    return exports;
}());



WF.reg("css",function(){

	function addClass(dom,className){

		if(hasClass(dom,className) == true)return ;

		dom.className += " "+className;
	}

	function removeClass(dom,className){

		if(hasClass(dom,className) == false)return ;

		var reg = new RegExp("\\s?"+className,"gi");

		dom.className = dom.className.replace(reg,"");
	}

	function hasClass(dom,className){

		if(dom.className.indexOf(className) > -1)return true;

		return false;
	}

	var exports = {
		addClass : addClass,
		removeClass :removeClass,
		hasClass : hasClass
	};
	return exports;
}());


WF.reg("http",function(){
	
	function ajax(url,param,succ,err,type){
		
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (4 == xmlhttp.readyState) {
		
				if (200 == xmlhttp.status || 304 == xmlhttp.status) {
					var Bodys = xmlhttp.responseText;
		
					succ && succ(Bodys);
				}
				else if(xmlhttp.status >= 400){
					
					err && err(xmlhttp.status);
				}
			}
		}
		
		type = type || "get";
		param = param || {};
		
		var param_arr = [];
		
		for(var name in param){
			
			param_arr.push(name + "=" + param[name]);
		}
		param = param_arr.join("&");

		if(type == "get"){
			url += "?"+param_arr.join("&");
		
			param = null;
		}
		
		xmlhttp.open(type, url, true);

		if(type == "post")xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xmlhttp.send(param);
	}
	
	function get(url,param,succ,err){
		
		ajax(url,param,function(data){
			
			succ(JSON.parse(data));
			
		},err,"get");
	}
	
	function post(url,param,succ,err){
		
		ajax(url,param,function(data){
			
			succ(JSON.parse(data));
			
		},err,"post");
	}
	
	var exports = {
		ajax : ajax,
		get : get,
		post : post
	};
	
	return exports;
}());


WF.reg("file",function(){
	
	function script(url,dom,cb){
		
		var script = document.createElement("script");
		
		script.type = "text/javascript";
		
		if(cb){
			script.onload = function(){
				cd();
			}
		}
		
		script.src = url;
		
		dom = dom || document.body;
		
		dom.appendChild(script);
	}

	function imgs(arrUrl,cb){

		var count = 0;
		var imgs = [];
		
		for(var i=0;i<arrUrl.length;i++){
			
			var img = new Image();
			img.onload = function(){
				
				this.onload = null;
				
				imgs.push(this);
				count += 1;
				
				img = null;
				
				if(count >= arrUrl.length){
					
					imgs.sort(function(a,b){return a.index-b.index;});;
					
					cb && cb(imgs);
				}
			}
			img.index = i;
			img.src = arrUrl[i];
		}
	}

	function audios(arrUrl,cb){

		var count = 0;
		var audios = [];

		for(var i=0;i<arrUrl.length;i++){

			var audio = new Audio();

			audio.addEventListener("canplaythrough",function(){

				this.removeEventListener("canplaythrough",arguments.callee);

				audios.push(this);
				count += 1;

				audio = null;

				console.log(audios);

				if(count >= arrUrl.length){
					
					audios.sort(function(a,b){return a.index-b.index;});;
					
					cb && cb(audios);
				}
			},false);
			audio.index = i;
			audio.src = arrUrl[i];
		}
	}
	
	var exports = {
		script:script,
		imgs : imgs,
		audios : audios
	}
	return exports;
}());

WF.reg("obj",function(){

	function merge(objOne,objTwo){

		for(var key in objTwo){

			objOne[key] = objTwo[key];
		}
	}

	var exports = {
		merge : merge
	}
	return exports;

}());

WF.reg("box2d",function(){

	function boxIn(box1,box2){

		if(box1.x >= box2.x && box1.x+box1.w <= box2.x+box2.w){
			
			if(box1.y >= box2.y && box1.y + box1.h <= box2.y + box2.h)return true;
			
		}
		return false;
	}

	function boxOver(box1,box2){

		if(box1.x >= box2.x && box1.x <= box2.x + box2.w){
			
			if(box1.y >= box2.y && box1.y <= box2.y + box2.h)return true;
		}
		
		if(box1.x + box1.w >= box2.x && box1.x + box1.w <= box2.x + box2.w){
			
			if(box1.y + box1.h >= box2.y && box1.y + box1.h <= box2.y + box2.h)return true;
		}
		
		return false;
	}

	var exports = {
		boxIn : boxIn,
		boxOver : boxOver
	};
	return exports;
}());

WF.reg("sprite",function(){

	//帧的定义
	/**
	 @param x int 帧在雪碧图中的起始x坐标
	 @param y int 帧在雪碧图中的起始y坐标
	 @param w int 帧在雪碧图中的宽
	 @param y int 帧在雪碧图中的高
	 @param dw int 帧实际的宽
	 @param dh int 帧实际的高
	*/
	var Frame = function(x,y,w,h,dw,dh){
		
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.dw = dw;
		this.dh = dh;	
	}

	//一个精灵得定义
	/**
	 @param arr Array 帧的数组
	 @param repeat boolean 动画是否重复
	*/
	var Animation = function(param) {

		this.startX = param.startX || 0;
		this.startY = param.startY || 0;
		this.fs = param.fs || 1;
		this.sw = param.sw || 0;
		this.sh = param.sh || 0;
		this.width = param.width || param.sw;
		this.height = param.height || param.sh;
		this.dir = param.dir || "right";
		this.loop = !!param.loop;
		//this.fps = param.fps || 30;
		
		//this.lazy = 1000 / this.fps;
		//this.last = 0;

		this.ls = [];
		//当前帧
		this.current = null;
		//当前帧得索引
		this.index = -1;
		
		this.init();
	}
	Animation.prototype = {
		init : function(){
			
			for(var i=0;i<this.fs;i++){
				
				var x = this.startX + (this.dir=="right"?i*this.sw:0);
				var y = this.startY + (this.dir=="down"?i*this.sh:0);
				
				var frame = new Frame(x,y,this.sw,this.sh,this.width,this.height);
				
				this.ls.push(frame);
			}
			
			this.index = 0;
			this.current = this.ls[0];
		},
		//下一帧
		next : function() {

			if(this.index + 1 >= this.ls.length){
				
				if(this.loop){
					
					this.current = this.ls[0];
					this.index = 0;
				}
			}
			else{
				
				this.index += 1;
				
				this.current = this.ls[this.index];
			}
		},
		//重置为第一帧
		reset : function(){
			
			this.current = this.ls[0];
			this.index = 0;
		},
		size : function(){
			
			return {w:this.width,h:this.height};
		}
	}

	//一个精灵的定义
	/**
	 @param objParam object 动画的json对象 {"left":[frame1,frame2],"right":[frame1,frame2]}
	 @param def string 默认动画索引
	 @param img object 精灵得雪碧图
	 @param cxt object canvas对象
	 @param x int 精灵的起始位置x
	 @param y int 精灵的起始位置y
	*/
	var Sprite = function(img,cxt,fps,param){
		
		this.animations = {};
		this.img = img;
		this.cxt = cxt;
		this.x = param.x || 0;
		this.y = param.y || 0;
		this.fps = fps;
		
		this.xspeed = param.xspeed || 0;
		this.yspeed = param.yspeed || 0;
		
		this.yaspeed = param.yaspeed || 0;

		this.lazy = 1000 / this.fps;
		this.last = 0;

		this.moveLazy = 33;
		this.moveLast = 0;
		
		//当前动画
		this.index = null;
		
		this.key = "";
	}
	Sprite.prototype = {
		add : function(key,animation){
			
			this.animations[key] = animation;
			
			if(!this.index){
				this.index = animation;
				this.key = key;
			}
		},
		//修改当前动画
		change : function(key){
			
			if(key == this.key)return false;
			
			var index = this.animations[key];
			
			if(!index)return false;
			
			this.index = index;
			this.okey = this.key;
			this.key = key;
			this.index.reset();
		},
		//绘画出当前帧
		draw : function(){
			
			if(!this.index || !this.img)return false;
			
			var frame = this.index.current;
			
			this.cxt.drawImage(this.img,frame.x,frame.y,frame.w,frame.h,this.x,this.y,frame.dw,frame.dh);
		},
		//更新精灵
		update : function(){
			
			var t = new Date().getTime();
			
			var diff = t - this.last;

			var moveDiff = t - this.moveLast;
			
			if(this.last == 0){
				diff = this.lazy;
				moveDiff = this.moveLazy;
			}
			
			if(diff >= this.lazy){
				
				this.index.next();
				
				this.last = t;
			}

			if(moveDiff >= this.moveLazy){

				if(this.yaspeed)this.yspeed += this.yaspeed;

				if(this.xspeed)this.x += this.xspeed;
				if(this.yspeed)this.y += this.yspeed;

				this.moveLast = t;
			}
		},
		//移动
		move : function(x,y){
			
			this.x = x;
			this.y = y;
		},
		setXSpeed : function(xs){
			
			this.xspeed = xs;
		},
		setYSpeed : function(ys,yas){
			
			this.yspeed = ys;
			this.yaspeed = yas || 0;
		},
		//获取当前精灵得大小
		size : function(){
			
			var frame = this.index.current;
			
			return {w:frame.dw,h:frame.dh,x:this.x,y:this.y,r:this.x+frame.dw,b:this.y+frame.dh};
		}
	}

	var exports = {
		Frame : Frame,
		Animation : Animation,
		Sprite : Sprite
	};
	return exports;

}());

WF.reg("time",function(){

	//定义贞管理类，兼容
	var requestAnimationFrame = window.requestAnimationFrame
								|| window.mozRequestAnimationFrame
								|| window.webkitRequestAnimationFrame
								|| function(cb){setTimeout(cb,1000/60)};

	var TimeProcess = function(){
	
		this.list = [];
		this.isStart = false;
	}
	TimeProcess.prototype = {
		
		add : function(cb,param,context){
			
			this.list.push({cb:cb,param:param,context:context});
		},
		start : function(){
			
			this.isStart = true;
			
			var self = this;
			
			requestAnimationFrame(function(){
				
				var item = null,
					p = [];
							
				for(var i=0;i<self.list.length;i++){
					
					item = self.list[i];
					
					item.cb.apply(item.context,item.param);
				}
				
				if(self.isStart)requestAnimationFrame(arguments.callee);
			});
		},
		stop : function(){
			
			this.isStart = false;
		}
	}

	var exports = {
		TimeProcess : TimeProcess
	};
	return exports;

}());
