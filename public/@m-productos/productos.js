define([], function(){

  function Tienda(reference){
    this.reference = reference;
    this.getFromDB = getFromDB;
    this.getProductosViews = getProductosViews;
    this.mostrarProductos = mostrarProductos;
    this.showB = showB;
    this.hideB = hideB;
    this.sumar = sumar;
    this.restar = restar;
    this.agregar = agregar;
    this.getViewPaquete = getViewPaquete;
    this.volverAUnidades =volverAUnidades;
    this.cargarProductos = cargarProductos;
    this.stopAnimation = stopAnimation;
    this.setCategoriasAnimation = setCategoriasAnimation;
    this.mostrarProductos = mostrarProductos;
    this.productosJson = productosJson;
    this.clearAnimation  = clearAnimation;
    this.productos = productos;
    this.producto = producto;
    this.setProductos = setProductos;
    this.verProductos = verProductos;
    var reference = reference;
    var pros;
    var prodsJson;
    var cateAnimation;
    var catAnimPos = 0;
    var animating = false;
    var floating = false;
    var lastPos = 0;
    function productosJson(){
      return prodsJson;
    }
    function setProductos(produs){
      pros = produs;
    }
    function productos(){
      return pros;
    }
    function cargarProductos(ref){
      this.reference = ref;
      var catCont;
      if(!floating){
        catCont = document.getElementById('cats');
      }else{
        document.getElementById('container').scrollTop = 260;
        catCont = document.getElementById('floatingCats');
      }
      var cont = getCategoriasView();
      catCont.innerHTML = "";
      catCont.innerHTML =cont;
      if(floating&&fromMob){
        document.getElementById('floatingCats').style.display= 'block';
        document.getElementById('container').addEventListener('scroll', bodyEventListener);
      }

      if(fromMob){
        clearAnimation();
        setCategoriasAnimation(true);
      }

      reference = ref;
      document.getElementById("cargandoProds").style.display="flex";
      categoria = reference;
      document.getElementById("cateActual").innerHTML = reference;

      if(prodsJson!='undefined'&&prodsJson){
                var prods = new Array();

                var json = prodsJson.Categorias[ref];
                var pos = 0;
                var keys = Object.keys(json);
                for(i in json){
                    var pro = new producto( keys[pos],
                                            json[i].url,
                                            json[i].weburl,
                                            json[i].DescPro,
                                            json[i].DescPaq,
                                            parseInt(json[i].precioPaquete,10),
                                            parseInt(json[i].precioUnidad,10),
                                            parseInt(json[i].undPorPaq,10),
                                            pos , 1, 0, parseInt(json[i].precioUnidad,10), false);
                    prods.push(pro);
                    pos++;

                }
                setProductos(prods);




                mostrarProductos(true);




      }else{

                var state = getProductosJson();
                if(state){
                  checkAndSetProductosDb();

                }else{
                  productos = new Array();
                  getFromDB();
                }




                /*var ref = database.ref('Productos/Categorias/'+reference);
                ref.once('value', function(snapshot){
                    var pos = 0;
                    snapshot.forEach(function(childSnapshot) {
                        var descPaq = childSnapshot.child("DescPaq").val();
                        var descPro = childSnapshot.child("DescPro").val();
                        var andUrl= childSnapshot.child("url").val();
                        var precioPaq = parseInt(childSnapshot.child("precioPaquete").val(),10);
                        var precioUnd = parseInt(childSnapshot.child("precioUnidad").val(),10);
                        var undPorPaq = parseInt(childSnapshot.child("undPorPaq").val(),10);
                        var url = childSnapshot.child("weburl").val();
                        var nombre = childSnapshot.key;
                        var pro = new producto(nombre, andUrl, url, descPro, descPaq, precioPaq, precioUnd, undPorPaq, pos , 1, 0, precioUnd, false);
                        prods[pos] = pro;
                        pos++;

                    });


                    productos = new Productos(prods);
                    productos.getProductosViews();
                    console.log(productos.productos);

                    //mostrarProductos(true);

                });*/


      }



    }

    function getProductosJson(){
        if(!prodsJson){
            readFromJson('../json/Productos.json', function(response){
                if(response){
                    var json = JSON.parse(response);
                    prodsJson = json;
                    return true;

                }else{
                  return false;
                }


            });
        }

    }
    function readFromJson(path, callback){
        var xobj = new XMLHttpRequest();
        xobj.open('GET', path, true);
        xobj.onreadystatechange = function () {
              if (xobj.readyState == 4 && xobj.status == "200") {
                callback(xobj.responseText);
              }
        };
        xobj.send(null);
    }
    function checkAndSetProductosDb(){
        if(('indexedDB' in window)){
            var dbPromise = window.indexedDB.open('productos', 1);
            var prom = new Promise(function(response){
                var x = false;
                var timer = setTimeout(function(){
                    if(!x){
                        response('no respuesta');
                    }else{

                    }
                }, 1000);
                dbPromise.onupgradeneeded = function(event){

                    var db = event.target.result;
                    x = true;
                    var create = db.createObjectStore('productos', {keyPath: 'id', autoIncrement: true} );
                    create.transaction.oncomplete = function(){
                        var objStore = db.transaction(['productos'], "readwrite").objectStore('productos');
                        var data = {
                            id: 'productos',
                            data: prodsJson
                        }
                        var req = objStore.put(data);
                        req.onsuccess = function(){

                            clearTimeout(timer);
                            response('respondio');
                        };
                    }


                };


            });
            prom.then(function(res){

                if(res=='respondio'){
                    cargarProductos(reference);
                }else{
                    readProdsInDb();
                }
            });


        }else{
            cargarProductos('Para Desayunar');
        }
    }
    function  readProdsInDb(){
        var dbPromise = window.indexedDB.open('productos', 1);
        dbPromise.onsuccess = function(event){

                    var db = event.target.result;
                    var store = db.transaction(['productos'], "readwrite").objectStore('productos');
                    var data = store.get('productos');
                    data.onsuccess = function(event){
                                    if(data.result.data){
                                        prodsJson = data.result.data;
                                        cargarProductos(reference);
                                    }else{
                                        getProductosJson();
                                    }
                                };


                };
    }




    function clearAnimation(){
      clearInterval(cateAnimation);
      cateAnimation = null;
      catAnimPos = lastPos;

    }

    function getCategoriasView(){
      var cont = '	<ul id="categorias"><li onclick="tienda.cargarProductos('+"'Para Desayunar'"+')"><div>';
      cont += '<h1 class="firstCat">Desayuno</h1><p  class="des"></div></li><li onclick="tienda.cargarProductos('+"'Aliñados'"+')"><div>';
      cont += '<h1>Alinados</h1><img src="src/icons/pan_ic.png"></div></li><li onclick="tienda.cargarProductos('+"'Dulces'"+')"><div><h1>Dulces</h1>';
      cont += '<img src="src/icons/repo_ic.png"></div></li><li class="lastCat" onclick="tienda.cargarProductos('+"'Integrales'"+')"><div><h1>Integrales</h1>';
      cont +='<img src="src/icons/icono_reserva.png"></div></li></ul>';
      return cont;
    }
    function getFromDB(){
      var prods = new Array();
      var ref = database.ref('Productos/Categorias/'+reference);
      ref.once('value', function(snapshot){
          var pos = 0;
          snapshot.forEach(function(childSnapshot) {
              var descPaq = childSnapshot.child("DescPaq").val();
              var descPro = childSnapshot.child("DescPro").val();
              var andUrl= childSnapshot.child("url").val();
              var precioPaq = parseInt(childSnapshot.child("precioPaquete").val(),10);
              var precioUnd = parseInt(childSnapshot.child("precioUnidad").val(),10);
              var undPorPaq = parseInt(childSnapshot.child("undPorPaq").val(),10);
              var url = childSnapshot.child("weburl").val();
              var nombre = childSnapshot.key;
              var pro = new producto(nombre, andUrl, url, descPro, descPaq, precioPaq, precioUnd, undPorPaq, pos , 1, 0, precioUnd, false);
              prods.push(pro);
              pos++;

          });
          setProductos(prods);


          mostrarProductos(true);

        });

    }

    function mostrarProductos(fromInit){

            var view = '';
            var count = 1;
            for(var i =0; i<pros.length;i++){
                if(!fromMob){
                    if(count<4){
                        if(count==1){
                             view+= '<ul>';
                        }
                        view += getView(pros[i]);
                        if(i==pros.length){
                                view+= '</ul>';
                        }
                        count ++;
                    }else if(count==4){
                          view += getView(pros[i]);
                          view+= '</ul>';
                          count = 1;
                    }

                }else{
                    view += getView(pros[i]);
                }
            }
            view += '</ul>';
            document.getElementById("productos").innerHTML = view;
            document.getElementById("cargandoProds").style.display="none";
            if(query&&!playingQuery){
                playQuery();

            }else{
                if(fromInit){
                    checkForUser();
                }
            }

    }
    function getView(producto){
            var contenido = '<li ><div class="producto"><div class="prodContA"';
            if(!fromMob){
                contenido += 'onclick="tienda.showB(';

            }else{
                 contenido += 'onclick="tienda.showB(';
            }
            contenido += producto.pos;
            contenido += ')"';
            contenido += '>';
            contenido += '<img src="';
            contenido += producto.url ;

            contenido += '"><h1>';
            contenido += producto.nombre;

            if(producto.isTaken){
                if(!fromMob){
                    contenido += '</h1><p style="color: #df7233; margin-top: -0.8vw; font-size: 1.6vw;">';

                }else{
                    contenido += '</h1><p style="color: #df7233; margin-top: -4vw; font-size: 5vw;">';

                }
                    contenido += "Pedido";
            }else{
                contenido += '</h1><p>';
                contenido += producto.descPro;
            }

            contenido += '</p></div><div ';
            contenido += ' id="prod'+producto.pos+'" ';

            contenido +='class="prodContB">';

            if(producto.descPaq != "sin descripcion"){
                contenido += '<div class="btnPaquete" onclick="tienda.getViewPaquete(';
                contenido += producto.pos;
                contenido += ')"><h1>';
                contenido += 'Paq ';
                contenido += producto.descPaq;
                contenido += '</h1><h2>$';
                contenido += producto.precioPaq;
                contenido += '</h2></div>';
            }
            contenido += '<div class="precio"';
            if(producto.descPaq == "sin descripcion"){
                if(fromMob){
                    contenido += 'style="margin-top:10vw;"';
                }else{
                    contenido += 'style="margin-top:4vw;"';
                }

            }
            contenido +='><h1>';
            contenido += "Precio";
            contenido += '</h1><h1>x</h1><h1 id="und';
            contenido += producto.pos;
            contenido += '">';
            contenido += 1;
            contenido += 'und</h1></div><div class="calCont"><button class="menosButton" onclick="tienda.restar(';
            contenido += producto.pos;
            contenido += ')"></button><h1 id="price';
            contenido += producto.pos;
            contenido += '">$';
            contenido += producto.precioUnidad;
            contenido += '</h1><button class="masButton" onclick="tienda.sumar(';
            contenido += producto.pos;
            contenido += ')"></button></div><h1 class="aceptar" onclick="tienda.agregar(';
            contenido += producto.pos;
            contenido +=')">Agregar</h1><button class="closeB" onclick="tienda.hideB(';
            contenido += producto.pos;
            contenido +=')"></button></div></div></li>';
            return contenido;
    }
    function producto(nombre,
                      andUrl,
                      url,
                      descPro,
                      descPaq,
                      precioPaq,
                      precioUnidad,
                      undPorPaq,
                      pos,
                      actual,
                      tipo,
                      precioActual,
                      isTaken){
            this.nombre= nombre;
            this.andUrl = andUrl;
            this.url = url;
            this.descPro = descPro;
            this.descPaq = descPaq;
            this.precioPaq = precioPaq;
            this.precioUnidad = precioUnidad;
            this.undPorPaq = undPorPaq;
            this.pos = pos;
            this.actual = actual;
            this.tipo = tipo;
            this.precioActual = precioActual;
            this.isTaken = isTaken;
    }
    function showB(pos){
            if(!showingProd&&actualProd==null){

                actualProd = pos;
                showingProd = true;
                document.getElementById("prod"+pos.toString()).style.display = "block";

            }else if(!showingProd&&actualProd!=pos||showingProd&&actualProd!=pos){

                if(pos>pros.length-1){
                    document.getElementById("prod"+actualProd.toString()).style.display = "none";
                }
                cancelCloseB=false;
                actualProd = pos;
                showingProd = true;
                document.getElementById("prod"+pos.toString()).style.display = "block";

            }else if(!showingProd&&actualProd==pos||showingProd&&actualProd==pos){

                if(!cancelCloseB){
                    cancelCloseB=true;
                }
                showingProd = true;
                document.getElementById("prod"+pos.toString()).style.display = "block";

            }
    }
    function hideB(pos){
         if(showingProd){
                cancelCloseB = false;
                var time = setTimeout(hide, 400);
                function hide(){
                    if(!cancelCloseB){
                        showingProd = false;

                        document.getElementById("prod"+pos.toString()).style.display ="none";

                    }
                }

            }
    }
    function restar(pos){
            if(!confirmando){
                var actual = pros[pos].actual;
            if(actual>1){
                actual = actual-1;
                pros[pos].actual= actual;
                if(editandoItem){
                    if(pros[pos].tipo==1){
                        var priceActual = actual * pros[pos].precioPaq;
                        pros[pos].precioActual = priceActual ;

                        document.getElementById("textCantPaq"+pos).innerHTML = "Cant: "+actual+" paq";
                        document.getElementById("txtPrecioPaq"+pos).innerHTML ="$"+ priceActual;
                    }else{
                        var priceActual = actual * pros[pos].precioUnidad;
                        pros[pos].precioActual = priceActual ;

                        document.getElementById("textCantPaq"+pos).innerHTML = actual+" unds";
                        document.getElementById("txtPrecioPaq"+pos).innerHTML ="$"+ priceActual;
                    }
                }else{
                    if(pros[pos].tipo==1){
                        var priceActual = actual * pros[pos].precioPaq;
                        pros[pos].precioActual = priceActual ;

                        document.getElementById("textCantPaq"+pos).innerHTML = "Cant: "+actual+" paq";
                        document.getElementById("txtPrecioPaq"+pos).innerHTML ="$"+ priceActual;
                    }else{
                        var priceActual = actual * pros[pos].precioUnidad;
                        pros[pos].precioActual = priceActual ;

                        document.getElementById("und"+pos).innerHTML = actual+" unds";
                        document.getElementById("price"+pos).innerHTML ="$"+ priceActual;
                    }
                }


            }
            }
    }
    function sumar(pos){
            if(!confirmando){
                var actual = pros[pos].actual;
                actual = actual+1;
                pros[pos].actual= actual;
                if(editandoItem){
                    if(pros[pos].tipo==1){
                        var priceActual = actual * pros[pos].precioPaq;
                        pros[pos].precioActual = priceActual;

                        document.getElementById("textCantPaq"+pos).innerHTML ="Cant: "+ actual+" paq";
                        document.getElementById("txtPrecioPaq"+pos).innerHTML ="$"+ priceActual;
                    }else{
                        var priceActual = actual * pros[pos].precioUnidad;
                        pros[pos].precioActual = priceActual;

                        document.getElementById("textCantPaq"+pos).innerHTML = "Cant: "+ actual+" unds";
                        document.getElementById("txtPrecioPaq"+pos).innerHTML ="$"+ priceActual;
                    }
                }else{
                    if(pros[pos].tipo==1){
                        var priceActual = actual * pros[pos].precioPaq;
                        pros[pos].precioActual = priceActual;

                        document.getElementById("textCantPaq"+pos).innerHTML ="Cant: "+ actual+" paq";
                        document.getElementById("txtPrecioPaq"+pos).innerHTML ="$"+ priceActual;
                    }else{
                        var priceActual = actual * pros[pos].precioUnidad;
                        pros[pos].precioActual = priceActual;

                        document.getElementById("und"+pos).innerHTML = actual+" unds";
                        document.getElementById("price"+pos).innerHTML ="$"+ priceActual;
                    }
                }
            }
    }
    function getViewPaquete(pos){
            pros[pos].tipo = 1;
            var newPrice = pros[pos].precioPaq *  pros[pos].actual;
            pros[pos].precioActual = newPrice;
            var contenido = '<div class="winOrden"><button class="close" onclick="tienda.volverAUnidades(';
            contenido += pos;
            contenido += ', false)"></button><img src="';
            contenido += pros[pos].url;
            contenido += '"><h1 id="txtPrecioPaq';
            contenido += pos;
            contenido += '">$';
            contenido +=pros[pos].precioActual;
            contenido +='</h1><ul class="winOrdenDesc"><li id="nombPaq">';
            contenido +=pros[pos].nombre;
            contenido +='</li><li id="descItemEdit">';
            contenido +=pros[pos].descPaq;
            contenido +='</li></ul><div class="calDiv" ><button class="menosButtonPaq" onclick="tienda.restar(';
            contenido += pos;
            contenido +=')"></button><h4 id="textCantPaq';
            contenido += pos;
            contenido += '">Cant:';
            contenido += pros[pos].actual;
            contenido += ' paq</h4><button class="masButtonPaq" onclick="tienda.sumar(';
            contenido += pos;
            contenido += ')"';
            contenido += '></button></div><button class="ok" onclick="tienda.agregar(';
            contenido += pos
            contenido += ')"';
            contenido += '></button></div>';
            document.getElementById("alert").innerHTML= contenido;
            document.getElementById("alert").style.display= "block";
    }
    function volverAUnidades(pos){
        var newPrice = pros[pos].precioUnidad *  pros[pos].actual;
        pros[pos].precioActual = newPrice;
        document.getElementById('alert').style.display = 'none';
    }
    function agregar(pos){
            if(!confirmando){
                var contenido =  pros[pos].nombre;
            var namePro= pros[pos].nombre;
            contenido += pros[pos].precioActual;
            contenido += pros[pos].actual;
            var andUrl = '/data/data/com.medialuna.delicatessen.cali/files/'+ pros[pos].andUrl+'.png';
            var ref = firebase.database().ref('Usuarios/'+id);
             ref.once('value', function(snapshot){
                var total = 0;
                var dom = 0;
                    if(snapshot.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Productos').exists()){
                        if(editandoItem){
                            var desc = "";
                            if(pros[pos].tipo==0){
                                desc = pros[pos].descPro;
                            }else{
                                desc = pros[pos].descPaq;
                            }
                            snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Productos/'+pros[pos].nombre).set({
                                    cantidad: pros[pos].actual,
                                    descripcion: desc,
                                    tipo :  pros[pos].tipo,
                                    total: pros[pos].precioActual,
                                    weburl: pros[pos].url,
                                    url: andUrl,
                                    uri: 1
                            });
                            document.getElementById("alert").style.display= "none";
                            reserva(dias[diaRequested-1].dia);

                        }else{
                            var newCant;
                        var totPro;
                        var newDesc;
                        var total = parseInt(snapshot.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Total').val(), 10);
                        if(snapshot.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+"/Productos/"+namePro).exists()){
                            var type =  parseInt(snapshot.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+"/Productos/"+namePro+"/tipo").val(),10);
                            var tot = parseInt(snapshot.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+"/Productos/"+namePro+"/total").val(), 10);
                            var cant =  parseInt(snapshot.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+"/Productos/"+namePro+"/cantidad").val(),10);
                            newDesc = snapshot.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+"/Productos/"+namePro+"/descripcion").val();

                            if(type!=pros[pos].tipo){
                                newCant = pros[pos].actual;
                                totPro = pros[pos].precioActual;
                                total = total-tot;
                                total = total + totPro;
                                dom = getDomicilio(total);
                                if(pros[pos].tipo==1){
                                    newDesc = pros[pos].descPaq;
                                }


                            }else{
                                newCant = cant+ pros[pos].actual;
                                totPro = tot + pros[pos].precioActual;
                                total = total+ pros[pos].precioActual;
                                dom = getDomicilio(totPro);

                            }



                            snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Total').set(total);
                            snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/domicilio').set(dom);




                        }else{
                            var tot = snapshot.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Total').val();
                            total = parseInt(tot, 10);
                            newCant= pros[pos].actual;
                            if(pros[pos].tipo==1){
                                newDesc = pros[pos].descPaq;
                            }else{
                                newDesc = pros[pos].descPro;

                            }

                            totPro = pros[pos].precioActual;
                            total = total + pros[pos].precioActual;
                            dom = getDomicilio(total);
                            snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Total').set(total);
                            snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/domicilio').set(dom);


                        }
                        snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Productos/'+pros[pos].nombre).set({
                                    cantidad: newCant,
                                    descripcion: newDesc,
                                    tipo :  pros[pos].tipo,
                                    total: totPro,
                                    weburl: pros[pos].url,
                                    url: andUrl,
                                    uri: 1
                            });

                        if(editandoItem){
                            cerrarAlert(pos, true);
                        }else{
                            if(pros[pos].tipo==1){
                                cerrarAlert(pos, true);
                            }
                            var tos = new Toasty();
                            tos.show(pros[pos].nombre+" agregado al "+dias[diaRequested-1].dia, 2000);

                        }

                    var content = 'Total + Domicilio  $';
                    var intTotal = total+dom;
                    content += redondearCifra(intTotal);
                    checkDay();
                        }


                    }else{
                        total = pros[pos].precioActual;
                        dom = getDomicilio(total);
                        snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/estado').set('si');
                        snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/status').set(0);
                        snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Total').set(pros[pos].precioActual);
                        snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/domicilio').set(dom);
                        var content = 'Total + Domicilio  $';
                        var intTotal = total+dom;
                        content += redondearCifra(intTotal);
                        document.getElementById('canastaText').innerHTML = content;
                        var anim = showCanasta();
                        var tos = new Toasty();
                        tos.show(pros[pos].nombre+" agregado al "+dias[diaRequested-1].dia, 2000);
                        if(pros[pos].tipo==1){
                            snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Productos/'+pros[pos].nombre).set({
                                    cantidad: pros[pos].actual,
                                    descripcion: pros[pos].descPaq,
                                    tipo :  pros[pos].tipo,
                                    total: pros[pos].precioActual,
                                    weburl: pros[pos].url,
                                    url: andUrl,
                                    uri: 1
                            });
                        cerrarAlert(pos, true);
                    }else{
                            snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Productos/'+pros[pos].nombre).set({
                                    cantidad: pros[pos].actual,
                                    descripcion: pros[pos].descPro,
                                    tipo :  pros[pos].tipo,
                                    total: pros[pos].precioActual,
                                    weburl: pros[pos].url,
                                    url: andUrl,
                                    uri: 1
                        });

                    }



                    }






             });
            }else{
                var tos = new Toasty();
                tos.show("Tu pedido esta en progreso, ve a tu canasta para ver los detalles", 4000);
            }
            hideB(pos);
    }

    function getProductosViews(){

      return 'Lo logre hdp';
    }



    function CategoriasScrollListener(){
      var scroller = document.getElementById('categorias');
      var scroll_left = scroller.scrollLeft;



    }
    function restartAnimation(way){

      var time = setTimeout(function(){
          clearTimeout(time);
            setCategoriasAnimation(way);
      }, 400);

    }
    function setCategoriasAnimation(toRight){

        var scroller = document.getElementById('categorias');
        scroller.addEventListener('scroll', CategoriasScrollListener);
        if(toRight){ cateAnimation = setInterval(fordward, 60);  }else{  cateAnimation = setInterval(backward, 60);  }
        animating = true;
        if(floating){
          document.getElementById('floatingCats').style.display = 'block';
        }
        scroller.addEventListener('touchstart', stopAnim);
        scroller.addEventListener('touchend', function(){
          lastPos = document.getElementById('categorias').scrollLeft;


        });
        function backward(){

          if(catAnimPos>0){
            catAnimPos -=1;

            scroller.scrollLeft = catAnimPos;
          }else{
            clearInterval(cateAnimation);
            stopAnimation();
            restartAnimation(true);
          }
        }
        function fordward(){

          if(catAnimPos<520){
            catAnimPos +=1;

            scroller.scrollLeft = catAnimPos;
          }else{

            clearInterval(cateAnimation);
            stopAnimation();
            restartAnimation(false);



          }
        }


        function stopAnim(){

          clearInterval(cateAnimation);
          animating = false;

        }
    }
    function stopAnimation(){
      clearInterval(cateAnimation );

    }
    function bodyEventListener(){
      var container = document.getElementById('container');
      var scrolled = container.scrollTop;

      if(scrolled<250&&scrolled>0){
        if(floating){
          var cont = getCategoriasView();



          document.getElementById('cats').innerHTML = cont;
          clearAnimation();
          var time = setTimeout(function(){
            clearTimeout(time);
            clearInterval(cateAnimation);
            document.getElementById('categorias').scrollLeft = catAnimPos;
            var pos = 0;
            var anim = setInterval(function(){
               if(pos<=-28){
                 clearInterval(anim);
                 document.getElementById('floatingCats').style.top = '-28vw';
                 document.getElementById('floatingCats').innerHTML = "";
                 document.getElementById('floatingCats').style.display= 'none';
                 setCategoriasAnimation(true);

               }else{
                 pos -= 1;
                 document.getElementById('floatingCats').style.top = pos+'vw';
               }
            }, 8);

          }, 200);

        }
        floating =false;
      }else if(scrolled>250&&!floating){
          clearAnimation();
          var cont = getCategoriasView();

          document.getElementById('cats').innerHTML = '';
          document.getElementById('floatingCats').innerHTML = cont;


          floating = true;
          var time = setTimeout(function(){
            clearTimeout(time);
            clearInterval(cateAnimation);
            document.getElementById('categorias').scrollLeft = catAnimPos;
            var pos = -28;
            var anim = setInterval(function(){
               if(pos>=0){
                 clearInterval(anim);
                 document.getElementById('floatingCats').style.top = '0vw';
               }else{
                 pos += 1;
                 document.getElementById('floatingCats').style.top = pos+'vw';
               }
            }, 12);

              setCategoriasAnimation(true);
          }, 200);


      }

    }

    function verProductos(){
            if(carList!=null&&carList.length>0){
                fromDay =true;
                goMain();
            }else{
                fromDay =false;
                goMain();
            }
    }

  }

  return Tienda;


});
