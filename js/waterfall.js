window.onload = function() {
	~ function() {
		//ajax请求数据
		var xhr = new XMLHttpRequest;
		var data = null;
		//false表示同步请求（如果数据没有请求回来将不进行下面的操作）
		xhr.open("get", "data.txt?_=" + Math.random(), false);
		//监听ajax请求的状态
		xhr.onreadystatechange = function() {
			if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status <= 300)) {
				val = xhr.responseText; //ajax请求回来的是json格式的字符串
				data = JSON.parse(val); //需要将json格式的字符串转化为json格式的对象
				//console.log(data);
			}
		};
		xhr.send(null);
		var waterfallCont = document.getElementById("waterfall-container");
		var waterfallBox = document.getElementsByClassName("waterfall-box");
		var winWidth = document.documentElement.clientWidth || document.body.clientWidth;
		var winHeight = document.documentElement.clientHeight || document.body.clientHeight;
		var imgWidth = waterfallBox[0].offsetWidth;
		var cols = parseInt(winWidth / imgWidth); //获取列数
		var boxHeightArr = []; //获取每一张图片的高度
		var lastImgTop=null; //当前最后一张图片距离父级参照物的高度
		var minHeight=null;  //图片的最小高度
		//获取图片的位置
		function getImgPosition(){
			for(var i = 0, len = waterfallBox.length; i < len; i++) {
			if(i < cols) {
				boxHeightArr[i] = waterfallBox[i].offsetHeight;

			} else {
				minHeight = Math.min.apply(null, boxHeightArr);
				waterfallBox[i].style.position = "absolute";
				waterfallBox[i].style.top = minHeight + "px";
				//获取高度最小的那张图片对应的索引
				var index = getPosition(boxHeightArr, minHeight);
				waterfallBox[i].style.left = waterfallBox[index].offsetLeft + "px";
				boxHeightArr[index] = boxHeightArr[index] + waterfallBox[i].offsetHeight;
			}

		}
		lastImgTop = waterfallBox[waterfallBox.length - 1].offsetTop;
		}
		getImgPosition();
		//获取滚动条卷去的高度和页面高度
		window.onscroll = function() {
			var distance = document.documentElement.scrollTop || document.body.scrollTop + winHeight;
			if(distance < lastImgTop) {
				//开始加载图片
				bind();
				getImgPosition();
			}
		}
        //获取高度最小的那张图片的位置
		function getPosition(boxHeightArr, minHeight) {
			for(var i in boxHeightArr) {
				if(boxHeightArr[i] === minHeight) {
					return i;
				}
			}
		}
		//绑定数据
		function bind() {
			//创建文档碎片，绑定数据
			var frg = document.createDocumentFragment();
			for(var i = 0, len = data.length; i < len; i++) {
				var curData = data[i];
				for(var k in curData) {
					var oImg = document.createElement("img");
					oImg.src = curData[k];
					var oDivImg = document.createElement("div");
					oDivImg.className = "waterfall-img";
					oDivImg.appendChild(oImg);
					var oDivBox = document.createElement("div");
					oDivBox.className = "waterfall-box";
					oDivBox.appendChild(oDivImg);
				}
				frg.appendChild(oDivBox);
			}
			waterfallCont.appendChild(frg);
			frg = null;
		}
	}();
};