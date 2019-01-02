define([], function(){
	function AR(){
		console.log('Accesing AR MODULE');
		activarCamara();

	}

	function activarCamara(){
        console.log('iniciando');
        var view = setVideoView();
        view.style.display = 'block';
        var player = document.getElementById('player');
        var snapshotCanvas = document.getElementById('snapshot');
        var captureButton = document.getElementById('capture');
        var guardar = document.getElementById('changeCamera');
        var borrar = document.getElementById('startCamera');
        var cerrar = document.getElementById('closeCamara');
        var image = document.getElementById('photoImg');
        cerrar.addEventListener('click', cerrarCamara);
        borrar.addEventListener('click', iniciarCamara);
        guardar.addEventListener('click', guardarFoto);
        captureButton.addEventListener('click', compare);





        var front = false;


        navigator.getMedia = ( navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);


        var devices = new Array();
        var actualDevice = 0;
        var snap;


        if(!navigator.getMedia){
            displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
        }
        else{



            navigator.getUserMedia({video:{facingMode:"environment", width: 600, height: 840}},
            function(stream){
                player.srcObject = stream;
                window.localStream =stream;
                streaming = stream;
                player.play();
                player.onplay = function(){
                    shooting = true;
                    var toast = new Toasty();
                    toast.show("iniciando", 500);



                }

            },function(err){
                 var toast = new Toasty();
                toast.show(err, 500);
                console.log(err);
            });
        }
        var MARKERS = new Array();

        var loop = setInterval(takePhoto, 100);



        function compare(){
        	clearInterval(loop);
        	for(var i=0; i<10;i++){
        		getComparacionImagenFromFile('./@m-AR/AR_assets/marcador_'+i.toString()+'.png');
        	}
        	setTimeout(function(){
				loop = setInterval(takePhoto, 300);
			}, 300);

        }
        var file_pos = 0;
        function getComparacionImagenFromFile(path){
        	var img = document.createElement('img');
        	img.onload = function(){
        		dibujar(img, file_pos);
        		file_pos ++;
        	};
        	img.src = path;
        }
        function dibujar(obj, pos){
        	var canvas = document.createElement('canvas');
        	canvas.setAttribute('id', 'subCanvas'+pos.toString());
        	canvas.width = 200;
        	canvas.height = 200;
        	var contx = canvas.getContext('2d');
        	contx.drawImage(obj, 0, 0);
        	var imageData = contx.getImageData(0, 0, 200, 200);
        	var li = document.createElement('li');
        	li.appendChild(canvas);
        	document.getElementById('canvasList').appendChild(li);
        	processingData = false;
        	var newData = processData(canvas.getContext('2d'), true);
        	MARKERS.push(Array.prototype.slice.call(newData.data));
        	contx.putImageData(newData, 0, 0);



        }

        function errorHandling(err){
            var toast = new Toasty();
            toast.show(err, 3000);
        }
        function cerrarCamara(){
            document.getElementById("camera_cont").style.display = "none";
            document.getElementById("camera_cont").innerHTML = "";
            player.pause();
            shooting = false;

            if(streaming){
                streaming.getVideoTracks()[0].stop();
            }


        }


        function takePhoto(){
        	clearInterval(loop);
            takeSnap();



		}
		function setMarker(){
			clearInterval(loop);

			console.log('setting marker')

			context = snapshotCanvas.getContext('2d');
			context.fillStyle = "#ffffff";
			var list = context.getImageData(0,0, 200, 200);
			var dat = Array.prototype.slice.call(list.data);

			var newLines = new Array();
			var rgb_pos  = 0;
			pixelSum = 0;
			newData = new Uint8ClampedArray(200 * 200 *  4);

			for(var i=0; i<dat.length;i++){
				if(rgb_pos==0||rgb_pos==1||rgb_pos==2){
					pixelSum = pixelSum+dat[i];
					rgb_pos ++;
				}else if(rgb_pos==3){
					if(pixelSum>420){
						newLines.push(255);
						newLines.push(255);
						newLines.push(255);
						newLines.push(255);
					}else{
						newLines.push(0);
						newLines.push(0);
						newLines.push(0);
						newLines.push(255);
					}
					pixelSum = 0;
					rgb_pos = 0;
				}

			}

			var pos =0;
			for(var i=0; i<newLines.length;i++){
				newData[pos] = newLines[i];
				pos ++;
			}

			MARKERS.push(newLines);
			list.data = new Uint8ClampedArray(newLines);
			context.putImageData(list, 200, 200);
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			canvas.width = 200;
			canvas.height = 200;
			var idata = ctx.createImageData(200, 200);
			idata.data.set(newData);
			ctx.putImageData(idata, 0, 0);
			image.src = canvas.toDataURL();
			var toast = new Toasty();
			toast.show('agregando marcador', 300);
			setTimeout(function(){
				loop = setInterval(takePhoto, 300);
			}, 300);




		}
		var processingData = false;

		function processData(context, files){

			if(!processingData){
				processingData = true;
				var list;
				if(files){
					list = context.getImageData(0, 0, 200, 200);
				}else{
					list = context.getImageData(200, 118, 200, 200);

				}

				var dat = Array.prototype.slice.call(list.data);

				var newLines = new Array();
				var rgb_pos  = 0;
				pixelSum = 0;
				newData = new Uint8ClampedArray(200 * 200 *  4);

				for(var i=0; i<dat.length;i++){
					if(rgb_pos==0||rgb_pos==1||rgb_pos==2){
						pixelSum = pixelSum+dat[i];
						rgb_pos ++;
					}else if(rgb_pos==3){
						if(pixelSum>420){
							newLines.push(255);
							newLines.push(255);
							newLines.push(255);
							newLines.push(255);
						}else {
							newLines.push(0);
							newLines.push(0);
							newLines.push(0);
							newLines.push(255);
						}
						pixelSum = 0;
						rgb_pos = 0;
					}

				}

				var pos =0;
				for(var i=0; i<newLines.length;i++){
					newData[pos] = newLines[i];
					pos ++;
				}


				list.data.set(new Uint8ClampedArray(newLines));
				context.putImageData(list, 200, 200);
				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext('2d');
				canvas.width = 200;
				canvas.height = 200;
				var idata = ctx.createImageData(200, 200);
				idata.data.set(newData);
				ctx.globalCompositeOperation = 'difference';
				ctx.putImageData(idata, 0, 0);
				image.src = canvas.toDataURL();
				return idata;

			}




		}
		var is = false;
		function compareImages(newLines, pos){
			var range = newLines.length;
			var comp_rang = 0;
			var whitePix_rang = 0;
			for(var i =0; i<MARKERS[pos].length; i++){
				if(MARKERS[pos][i]==0){
					comp_rang ++;
				}else{
					if(newLines[i]%4!=1){
						whitePix_rang ++;
					}

				}
			}

			var input_rang = 0;
			var whitePix = 0;

			for(var i =0; i<newLines.length; i++){

				if(newLines[i]==0){
					if(newLines[i]==MARKERS[pos][i]){
						input_rang ++;
					}
				}else{
					if(newLines[i]%4!=1){
						whitePix ++;
					}

				}


			}

			var whitePercent =  parseInt((whitePix*100/whitePix_rang), 10);
			var percent = parseInt((input_rang*100/comp_rang), 10);
			var compPercent = 74;
			var complex_percent = (whitePercent + percent)/2;
			console.log(whitePercent, percent, 'marker: ',pos);
			return { x: whitePercent, y: percent};








		}

        function takeSnap(){

            var context = snapshotCanvas.getContext('2d');

            var width = player.videoWidth;
            var height = player.videoHeight;

            if (width && height) {

                // Setup a canvas with the same dimensions as the video.
                snapshotCanvas.width = width;
                snapshotCanvas.height = height;

                // Make a copy of the current frame in the video on the canvas.
                context.globalCompositeOperation = 'difference';
                context.drawImage(player, 0, 0, width, height);


                // Turn the canvas image into a dataURL that can be used as a src for our photo.

            }
            processingData = false;
            var newLines = processData(snapshotCanvas.getContext('2d'), false);
           	var comArr = new Array();
            if(MARKERS){

				for(var i=0; i<MARKERS.length; i++){

        			var result = compareImages(Array.prototype.slice.call(newLines.data), i);
        			if(result.x>80){
        				comArr.push(result.y);

	        		}
        		}
        	}
        	var compArray = comArr;
        	if(comArr.length>0){
        		comArr.sort(function(a, b){return b-a});

        	}
        	for(var i=0;i<compArray.length;i++){
        		if(compArray[i]==comArr[0]){
        			console.log('match: ', i);
        			document.getElementById('meta_AR').innerHTML = 'match: '+i.toString();
        		}
        	}


			processingData = false;

			setTimeout(function(){
				loop = setInterval(takePhoto, 100);
			}, 300);
        }
        function iniciarCamara(){
            console.log('reiniciando');
            view.innerHTML = "";
            cargarImagen();

            /*navigator.getUserMedia({video:{facingMode:"environment", width: 520, height: 520}},
            function(stream){
                player.srcObject = stream;
                player.play();
                player.onplay = function(){
                    var toast = new Toasty();
                    toast.show("iniciando", 1000);
                    image.style.display = 'none';
                    player.style.display = "block";
                    borrar.style.display = "none";
                    guardar.style.display = "none";
                    captureButton.style.display = "block";
                    view.style.display = 'block';


                }

            },function(err){
                 var toast = new Toasty();
                toast.show(err, 1000);
                console.log(err);
            });*/


        }
        function showVideo(stream){
            player.srcObject = stream;
            player.play();
            player.style.display = "block";
            captureButton.style.display = "block";
            guardar.style.display = "none";
        }
        function getStorageId(){
            var alpha = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
            var length = 9;
            var array = alpha.split(",");
            var finalId = "";
            for(var i=0;i<length;i++){
                finalId += array[Math.floor((Math.random() * 64) + 1)];
            }


            return finalId;
        }
        function guardarFoto(){
            snapshotCanvas.toBlob(function(blob){
                subirBlob(blob);
            }, "image/png", 9);
        }
        function subirBlob(blob){
            var refId = getStorageId();
            var storageRef = firebase.storage().ref();
            var metadata = {
                 contentType: 'image/png'
            };


            var toast = new Toasty();
            toast.show("Subiendo Foto...", 3000);
            var uploadTask = storageRef.child('publicaciones/'+refId+'.png').put(blob, metadata);

            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED , function(snapshot){
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        break;
                }
            }, function(error){
                var toast = new Toasty();
                toast.show(error, 200);
            }, function(){
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        document.getElementById("camera_cont").innerHTML = "";
                        continuarPublicando(downloadURL);
                });
            });




        }
        function setVideoView(){
        	var cont= '';

          cont += '<div><video id="player"></video>';
          cont += '<div id="marco"></div></div>';
          cont += '<button id="closeCamara"></button>';

          cont += '<h1 id="camera_title">Escanea el marcador</h1>';
          cont += '<button id="capture"></button>';
          cont += '<canvas id="snapshot"></canvas>';
          cont += '<img id="photoImg">';
          cont += '<button id="startCamera" ></button>';
          cont += '<button id="changeCamera" ></button>';
          cont += '<img id="resultAR">'


          document.getElementById("camera_cont").innerHTML = '';
          document.getElementById("camera_cont").innerHTML = cont;
          document.getElementById("camera_cont").style.display ="block";

          player = document.getElementById('player');
          snapshotCanvas = document.getElementById('snapshot');
          captureButton = document.getElementById('capture');
          guardar = document.getElementById('changeCamera');
          borrar = document.getElementById('startCamera');
          cerrar = document.getElementById('closeCamara');
          image = document.getElementById('photoImg');
          cerrar.addEventListener('click', cerrarCamara);
          borrar.addEventListener('click', iniciarCamara);
          guardar.addEventListener('click', guardarFoto);
          captureButton.addEventListener('click', compare);
          var view = document.getElementById("camera_cont");
          return view;
        }
     }
	return AR;
});
