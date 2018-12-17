define([], function(){

  function Publicaciones(){
    this.cargarPublicaciones = cargarPublicaciones;
    this.cargarImagen= cargarImagen;
    this.like = like;

    var pubsListener = false;

    var top_up = false;
    var top_bottom = false;

    var view_range;
    var comparation_range;
    var view_last_pos = 0;
    var capacity ;
    var direction_guide = "down";
    var last_comp_pos = 0;
    var toListen = true;
    var streaming;
    function cargarPublicaciones(){
        var ref = database.ref("Muro/publicaciones");
        ref.once('value', function(snapshot){

                publicaciones =  new Array();
                pos = 0;
                snapshot.forEach(function(publi){
                        var content = publi.child("contenido").val().toString();
                        var name = publi.child("name").val().toString();
                        var date = publi.child("fecha").val().toString();
                        var count  = parseInt(publi.child("likes/count").val(), 10);
                        var liked = false;
                        publi.child("likes/us").forEach(function(us){
                            var me = id.split("/");
                            var meString = "";
                            if(me.length>1){
                                meString = me[1];
                            }else{
                                meString = me[0];
                            }

                            if(us.key == meString){
                                liked = true;
                            }

                        });

                        var url = publi.child("url").val().toString();
                        var key = publi.key;
                        var visible = false;
                        var pub = new publicacion(key, name, content, count, liked, url, date, pos, visible);
                        pos ++;

                        publicaciones.push(pub);
                });
                publicaciones.reverse();
                document.getElementById("publicaciones").scrollTop = 0;


                cargarPubViews(true);

        });
    }

    function cargarPubViews(init){
      if(publicaciones.length<8){
        var cont = '';
        for(var i=0;i<publicaciones.length;i++){
            publicaciones[i].visible = true;
            cont += getViewPublicacion(publicaciones[i],i);


        }
        document.getElementById("publicaciones").innerHTML = "";
        document.getElementById("publicaciones").innerHTML = cont;
        document.getElementById("pubLoading").style.display= 'none';
      }else{


        var scroller = document.getElementById('publicaciones');
        if(init){
            initList = true;
            cont = '';
              for(var i=0;i<publicaciones.length;i++){
                if(i<20){
                     publicaciones[i].visible = true;
                  cont += getViewPublicacion(publicaciones[i],i);
                }

              }
            document.getElementById("publicaciones").innerHTML = "";
            document.getElementById("publicaciones").innerHTML = cont;
            setTimeout(function(){
                var sizes = getCapacity();
                console.log(JSON.stringify(sizes));
                cont = '';
                if(sizes.capacity%2==1){
                    if(sizes.capacity==1){
                        range_lenght = 9;
                    }else{
                         range_lenght = (sizes.capacity*2)+1;
                    }

                    capacity = sizes.capacity;
                }else{

                    range_lenght = (sizes.capacity*2);
                    capacity = sizes.capacity;
                }







                for(var i=0;i<publicaciones.length;i++){
                    publicaciones[i].visible = false;
                    cont += getViewPublicacion(publicaciones[i],i);

                }


                for(var i=0; i<range_lenght;i++){
                    publicaciones[i].visible = true;
                    cont += getViewPublicacion(publicaciones[i],i);
                    range[i] = i;

                }
                console.log(range);
                document.getElementById("publicaciones").innerHTML = "";
                document.getElementById("publicaciones").innerHTML = cont;
                setTimeout(function(){
                    document.getElementById("pubLoading").style.display= 'none';
                    var pos = -20;

                    var anim = setInterval(function(){
                            if(pos<0){
                                pos +=1;
                                document.getElementById('addCont').style.marginTop = pos +'vw';
                            }else{
                                clearInterval(anim);
                            }
                        }, 8);
                    toListen = true;
                }, 1000);

            },1000);


        }
        if(pubsListener){

            setTimeout(function(){
                scroller.style.overflowY = "hidden";

                toListen = false;
                var cont = '';
                scroller.style.overflowY = "hidden";

                for(var i=0;i<publicaciones.length;i++){

                    cont += getViewPublicacion(publicaciones[i],i);
                }
                document.getElementById("publicaciones").innerHTML = "";
                document.getElementById("publicaciones").innerHTML = cont;
                setTimeout(function(){
                    var sizes = getCapacity();
                    var comparation = parseInt((sizes.box_height+13)*(range_lenght/2).toString());


                    if(direction_guide=='up'){

                        if(range[0]<=0){
                            top_up = true;

                        }
                         scroller.scrollTop = parseInt(comparation-(sizes.box_height).toString());




                    }else{
                        if(range[range.length-1]+2>publicaciones.length){
                            top_bottom = true;

                        }

                        scroller.scrollTop = parseInt(comparation-(sizes.box_height/8).toString());

                    }
                    var op = 0;
                    var anim = setInterval(function(){
                        if(op<1){
                            op+= 0.1;
                            document.getElementById('publicaciones').style.opacity = op;
                        }else{
                            clearInterval(anim);
                        }

                    }, 8);

                    view_last_pos = scroller.scrollTop;
                    toListen = true;
                    comparando = false;
                    scroller.style.overflowY = "scroll";
                  }, 180);
              }, 250);

        }
        if(!pubsListener){
            setScrollListener();
        }
      }

    }

    function setScrollListener(){
        pubsListener = true;

            var scroller = document.getElementById("publicaciones");
            scroller.addEventListener("scroll", function(){
                var box = scroller.querySelector('li');
                var height = box.offsetHeight;
                var scrollerHeight = scroller.offsetHeight;
                var space = 10;

                var sizes = getCapacity();
                view_range = height;
                comparation_range = parseInt((height+space)*(range_lenght-2));
                //console.log('scrolled: '+scroller.scrollTop, 'range: '+comparation_range);
                var play = '';
                if(scroller.scrollTop>view_last_pos){
                    play = 'down';
                    var pos = 0;
                    var addPos = 100;

                    if(document.getElementById('addCont').style.marginTop=='0vw'){
                         var anim = setInterval(function(){
                            if(pos>-20){
                                addPos -= 1.2;
                                pos -=1;
                                document.getElementById('addPub').style.left = addPos +'vw';
                                document.getElementById('addCont').style.marginTop = pos +'vw';
                            }else{
                                clearInterval(anim);
                            }
                        }, 8);
                    }

                }else if(scroller.scrollTop<view_last_pos){
                    play = 'up';
                    comparation_range = (height+space)*2;
                    var addPos = 80;
                    var pos = -20;
                    console.log(document.getElementById('addCont').style.marginTop);
                    if(document.getElementById('addCont').style.marginTop=='-20vw'){

                         var anim = setInterval(function(){
                            if(pos<0){
                                addPos += 1.2;
                                pos +=1;
                                document.getElementById('addPub').style.left = addPos +'vw';
                                document.getElementById('addCont').style.marginTop = pos +'vw';
                            }else{
                                clearInterval(anim);
                            }
                        }, 8);
                    }
                }
                 //console.log('scrolled: '+scroller.scrollTop, 'comp: '+comparation_range, 'dir: '+play, 'top: '+top_up);
                view_last_pos = scroller.scrollTop;

                if(toListen){
                    if(scroller.scrollTop>comparation_range&&!comparando&&play=='down'&&!top_bottom){
                        if(range[range.length-1]+2>outrange){
                            toListen =false;
                        }
                        direction_guide = play;
                        last_comp_pos = comparation_range;
                        comparando = true;
                        makeVisiblePubs(true);
                        top_up =false;
                    }else if(scroller.scrollTop<comparation_range/3&&!comparando&&play=='up'&&!top_up){
                        if(range[range.length-1]+2>outrange){
                            toListen =false;
                        }
                        direction_guide = play;
                        last_comp_pos = comparation_range;
                        comparando = true;
                        makeVisiblePubs(false);
                        top_bottom = false;
                    }
                }
            });
    }

    var index_step ;
    var outrange;
    var range = new Array();
    var range_lenght;
    function makeVisiblePubs(down){
        var op = 1;
                var anim = setInterval(function(){
                    if(op>0){
                        op-= 0.1;
                        document.getElementById('publicaciones').style.opacity = op;
                    }else{
                        clearInterval(anim);
                    }

                }, 10);
        toListen = false;
        outrange = publicaciones.length;
        var reloadRange = false;

        if(!down){

            if(capacity>1){
                index_step = parseInt((range[0]-(capacity-1)).toString());
            }else{
                index_step = parseInt((range[0]-(4)).toString());
            }

            if(index_step<0){
                index_step = 0;
                 console.log('outofrange_up');
            }

        }else{


            if(capacity>1){
                index_step = parseInt(((range[range.length-1])-(capacity-1)).toString());
            }else{
                index_step = parseInt(((range[range.length-1])-(4)).toString());
            }


            if(index_step>outrange){
                if(capacity>1){
                    index_step = outrange-parseInt((range_lenght/capacity).toString())-1;
                }else{
                    index_step = outrange-parseInt((range_lenght).toString())-1;
                }

                console.log('outofrange_down');


            }
        }

        var actual_range_item = index_step;
        if(actual_range_item+range_lenght>outrange){
            actual_range_item = outrange-(range_lenght-1);
        }
        for(var i=0;i<range_lenght;i++){
            range[i] = actual_range_item;
            actual_range_item++;
        }

        for(var i=0;i<outrange;i++){

            publicaciones[i].visible =  false;

           for(var j=0;j<range.length;j++){
            if(range[j]>=0&&range[j]<=outrange&&range[j]==i){

                publicaciones[i].visible =  true;

            }
           }

        }

        console.log('range: '+range, 'lenght: '+range_lenght, 'down: '+ down);

        cargarPubViews(false);


    }




    function getCapacity(){
         var scroller = document.getElementById("publicaciones");
         var box = scroller.querySelector('li');
         var scrollerHeight = scroller.offsetHeight;
         var height = box.offsetHeight;
         var cap = parseInt((scrollerHeight/height).toString());
         var data = {
            capacity: cap,
            container_height: scrollerHeight,
            box_height: height

         }
         return data;
    }

    function getRange(){

        return height*capacity;
    }

    function publicacion(key, nombre, content, count, liked, url, date, pos, visible){
        this.key = key;
        this.nombre = nombre;
        this.content = content;
        this.count  =count;
        this.liked = liked;
        this.url = url;
        this.date = date;
        this.pos = pos;
        this.visible  = visible;

    }
    function getViewPublicacion(pub, pos){
        var cont = '<li ';
        if(pub.visible){
            cont += 'class="visible"';
        }else{
            cont += 'class="invisible"';
        }
        cont += '><div class="publicacion"><img class="pub_img"src="';
        cont += pub.url;
        cont += '"><div class="pub_cont"><h1>';
        cont += pub.nombre;
        cont += '</h1><h2>"';
        cont += pub.content;
        cont += '"</h2><h3>';
        cont += pub.date;
        cont += '</h3><div class="pub_counter"><h4>';
        cont += pub.count;
        cont += '</h4><img src="src/icons/icono_reserva.png"><h5 id="like';
        cont += pos.toString()+'"';
        var txt = "Me Gusta";
        if(!pub.liked){
          cont += 'class="notLiked"';
          cont += ' onclick="pubs.like(';
          cont += "'"+pub.key+"'";
          cont += ', 0, '+pos.toString()+')"';
        }else{
           cont += 'class="liked"';
           txt = "Te Gusta";
        }
        var url = generatePubUrl(pub.key);
        cont += '>'+txt+'</h5><button class="share_pub" onclick="shareInt('+"'"+url+"'"+', '+"'"+'Hola, Dale Me Gusta y antójate tu también.'+"'"+')"></div></div></div></li>';
        if(pub.visible){
            return cont;
        }else{
            return "";
        }

    }
    function like(key, state, pos){
        var ref = database.ref("Muro/publicaciones/"+key);
        ref.once('value', function(snapshot){
            var count = parseInt(snapshot.child("likes/count").val(), 10);
            count ++;
            snapshot.ref.child("likes/count").set(count);
            var me = id.split("/");
            var meString = "";
            if(me.length>1){
                meString = me[1];
            }else{
                meString = me[0];
            }

            snapshot.ref.child("likes/us/"+meString).set(true);
            if(state == 0){
                document.getElementById('like'+pos.toString()).classList.remove('notLiked');
                document.getElementById('like'+pos.toString()).classList.add('liked');

                publicaciones[pos].liked = true;
            }else if(state==1){
                abrirPublicacion();

            }



        });


    }
    function cargarImagen(){
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
        captureButton.addEventListener('click', takePhoto);





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


            navigator.getUserMedia({video:{facingMode:"environment", width: 520, height: 520}},
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
            snap = takeSnap();
            image.setAttribute('src', snap);
            image.style.display = 'block';
            player.pause();
            player.style.display = "none";
            captureButton.style.display = "none";
            guardar.style.display = "block";
            borrar.style.display = "block";
            guardar.style.display = "block";
            window.navigator.vibrate([200, 50, 100]);



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
                context.drawImage(player, 0, 0, width, height);

                // Turn the canvas image into a dataURL that can be used as a src for our photo.
                return snapshotCanvas.toDataURL('image/png');
            }
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
          cont += '<h1 id="camera_title">Tomate el tiempo de hacer una linda foto, ayudate con lo que encuentres a tu alrededor.</h1>';
          cont += '<button id="capture"></button>';
          cont += '<canvas id="snapshot"></canvas>';
          cont += '<img id="photoImg">';
          cont += '<button id="startCamera" ></button>';
          cont += '<button id="changeCamera" ></button>';
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
          captureButton.addEventListener('click', takePhoto);
          var view = document.getElementById("camera_cont");
          return view;
        }
     }

    function continuarPublicando(url){
            document.getElementById("camera_cont").style.display = "block";
            var cont = getPublicarView(url);

            document.getElementById("camera_cont").innerHTML = cont;
            var captura = document.getElementById("captura");
            captura.style.backgroundImage = "url('"+url+"')";
            var cerrar = document.getElementById("cerrar_publicar");
            cerrar.addEventListener('click', function(){
                document.getElementById("camera_cont").innerHTML = "";
                cargarImagen();
            });
            var compartir = document.getElementById("pub_share");
            var content  = document.getElementById("pub_content");
            content.focus();
            compartir.addEventListener('click', function(){
                var contain = content.value.toString();
                var count = contain.split(" ");
                if(count.length<18){
                    publicar(contain, url);

                }

            });




        }
        function publicar( content, url){
            var ref = database.ref('Muro/publicaciones');
            var pub = {
                fecha:"Mayo 15 de 2018",
                contenido: content,
                url:url,
                name:id,
                likes:{
                    us:{
                        me:true
                    },
                    count:0
                }
            };
            var key = ref.push(pub).key;
            document.getElementById("camera_cont").style.display = "none";
            var url = generatePubUrl(key);
            shareInt(url,'Hola, dale Me gusta y antojate tu tambien');


        }
    function getPublicarView(){
        var cont = '<div id="publicar"><div id="publicarBar"><button id="cerrar_publicar"></button><h1>Comparte tu alegria en la<br>Red del Pan</h1>';
        cont +='<img src="src/icons/red_cupon.png"></div><div class="pub_header">';
        cont += '<div ';

        cont += 'id="captura"></div></div><input type="text/plain" name="" id="pub_content" placeholder="Escribe una frase de menos de 18 palabras">';
        cont +='<button id="pub_share">Compartir</button><p>* Sube una foto de tu pedido.<br>* Comparte el enlace con tus';
        cont += ' amigos  y pideles un "Me gusta".<br>* Alcanza los 50 "Me gusta".<br>* Recibe un descuento sorpresa en  ';
        cont += 'tu siguiente compra.</p></div>';

        return cont;
     }
    function generatePubUrl(key){
        var url = "https://today-6648d.firebaseapp.com/?action=1&notId=";
        url += key;
        return url;
     }






  }




  return Publicaciones;
});
