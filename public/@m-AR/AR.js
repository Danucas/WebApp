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



            navigator.getUserMedia({video:{facingMode:"environment", width: 480, height: 720}},
            function(stream){
                player.srcObject = stream;
                window.localStream =stream;
                streaming = stream;
                player.play();
                player.onplay = function(){
                    shooting = true;
                    var toast = new Toasty();
                    toast.show("iniciando", 1000);



                }

            },function(err){
                 var toast = new Toasty();
                toast.show(err, 1000);
                console.log(err);
            });
        }
        var MARKER;

        var loop = setInterval(takePhoto, 100);
        function compare(){
        	
        	setMarker();
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
            takeSnap();
            
           
            
		}
		function setMarker(){
			clearInterval(loop);

			console.log('setting marker')

			context = snapshotCanvas.getContext('2d');
			context.fillStyle = "#ffffff";
			var list = context.getImageData(140, 100, 200, 300);
			var dat = Array.prototype.slice.call(list.data);
			
			var newLines = new Array();
			var rgb_pos  = 0;
			pixelSum = 0;
			newData = new Uint8ClampedArray(200 * 300 *  4);

			for(var i=0; i<dat.length;i++){
				if(rgb_pos==0||rgb_pos==1||rgb_pos==2){
					pixelSum = pixelSum+dat[i];
					rgb_pos ++;
				}else if(rgb_pos==3){
					if(pixelSum>400){
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
			
			MARKER = newLines;
			list.data = new Uint8ClampedArray(newLines);
			context.putImageData(list, 200, 300);
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			canvas.width = 200;
			canvas.height = 300;
			var idata = ctx.createImageData(200, 300);
			idata.data.set(newData);
			ctx.putImageData(idata, 0, 0);
			image.src = canvas.toDataURL();
			setTimeout(function(){
				loop = setInterval(takePhoto, 600);
			}, 1000);
			



		}

		function processData(){
			console.log('procesingData')

			context = snapshotCanvas.getContext('2d');
			context.fillStyle = "#ffffff";
			var list = context.getImageData(140, 100, 200, 300);
			var dat = Array.prototype.slice.call(list.data);
			
			var newLines = new Array();
			var rgb_pos  = 0;
			pixelSum = 0;
			newData = new Uint8ClampedArray(200 * 300 *  4);

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
			
			
			list.data = new Uint8ClampedArray(newLines);
			context.putImageData(list, 200, 300);
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			canvas.width = 200;
			canvas.height = 300;
			var idata = ctx.createImageData(200, 300);
			idata.data.set(newData);
			ctx.globalCompositeOperation = 'difference';
			ctx.putImageData(idata, 0, 0);
			image.src = canvas.toDataURL();
			
			if(MARKER){
				compareImages(newLines);
			}



		}
		var is = false;
		function compareImages(newLines){
			var range = newLines.length;
			var comp_rang = 0;
			var whitePix_rang = 0;
			for(var i =0; i<MARKER.length; i++){
				if(MARKER[i]==0){
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
					if(newLines[i]==MARKER[i]){
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
			console.log(whitePercent, percent);
			if(whitePercent>80&&whitePercent<100&&percent>60&&percent<100){
				if(is ==false){
					is = true;
					var toas = new Toasty();
					toas.show('match: '+complex_percent.toString(), 3000);
				}
				
				console.log('SI: percent', complex_percent,'range: ', comp_rang, 'asserts: ', input_rang);

			}else{

				if(is ==true){
					is =false;
				}
				
			}

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
            processData();
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
          var cont = '<video id="player"></video>';
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