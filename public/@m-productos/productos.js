define([], function(){

  function Prods(reference){
    this.reference = reference;
    this.getFromDB = getFromDB;
    this.getProductosViews = getProductosViews;
    this.showB = showB;
    this.hideB = hideB;
    this.sumar = sumar;
    this.restar = restar;
    this.agregar = agregar;
    this.getViewPaquete = getViewPaquete;
    this.volverAUnidades =volverAUnidades;
    this.cargarProductos = cargarProductos;
    this.mostrarProductos = mostrarProductos;
    var productos;
    var productosJson;
    this.productos = productos;
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
              prods[pos] = pro;
              pos++;

          });
          productos = prods;
          mostrarProductos(true);

        });

    }

    function mostrarProductos(fromInit){

            var view = '';
            var count = 1;
            for(var i =0; i<productos.length;i++){
                if(!fromMob){
                    if(count<4){
                        if(count==1){
                             view+= '<ul>';
                        }
                        view += getView(productos[i]);
                        if(i==productos.length){
                                view+= '</ul>';
                        }
                        count ++;
                    }else if(count==4){
                          view += getView(productos[i]);
                          view+= '</ul>';
                          count = 1;
                    }

                }else{
                    view += getView(productos[i]);
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
                contenido += 'onclick="productos.showB(';

            }else{
                 contenido += 'onclick="productos.showB(';
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
                contenido += '<div class="btnPaquete" onclick="productos.getViewPaquete(';
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
            contenido += 'und</h1></div><div class="calCont"><button class="menosButton" onclick="productos.restar(';
            contenido += producto.pos;
            contenido += ')"></button><h1 id="price';
            contenido += producto.pos;
            contenido += '">$';
            contenido += producto.precioUnidad;
            contenido += '</h1><button class="masButton" onclick="productos.sumar(';
            contenido += producto.pos;
            contenido += ')"></button></div><h1 class="aceptar" onclick="productos.agregar(';
            contenido += producto.pos;
            contenido +=')">Agregar</h1><button class="closeB" onclick="productos.hideB(';
            contenido += producto.pos;
            contenido +=')"></button></div></div></li>';
            return contenido;
    }
    function producto(nombre, andUrl, url, descPro, descPaq, precioPaq, precioUnidad, undPorPaq, pos, actual, tipo, precioActual, isTaken){
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

                if(pos>productos.length-1){
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
                var actual = productos[pos].actual;
            if(actual>1){
                actual = actual-1;
                productos[pos].actual= actual;
                if(editandoItem){
                    if(productos[pos].tipo==1){
                        var priceActual = actual * productos[pos].precioPaq;
                        productos[pos].precioActual = priceActual ;

                        document.getElementById("textCantPaq"+pos).innerHTML = "Cant: "+actual+" paq";
                        document.getElementById("txtPrecioPaq"+pos).innerHTML ="$"+ priceActual;
                    }else{
                        var priceActual = actual * productos[pos].precioUnidad;
                        productos[pos].precioActual = priceActual ;

                        document.getElementById("textCantPaq"+pos).innerHTML = actual+" unds";
                        document.getElementById("txtPrecioPaq"+pos).innerHTML ="$"+ priceActual;
                    }
                }else{
                    if(productos[pos].tipo==1){
                        var priceActual = actual * productos[pos].precioPaq;
                        productos[pos].precioActual = priceActual ;

                        document.getElementById("textCantPaq"+pos).innerHTML = "Cant: "+actual+" paq";
                        document.getElementById("txtPrecioPaq"+pos).innerHTML ="$"+ priceActual;
                    }else{
                        var priceActual = actual * productos[pos].precioUnidad;
                        productos[pos].precioActual = priceActual ;

                        document.getElementById("und"+pos).innerHTML = actual+" unds";
                        document.getElementById("price"+pos).innerHTML ="$"+ priceActual;
                    }
                }


            }
            }
    }
    function sumar(pos){
            if(!confirmando){
                var actual = productos[pos].actual;
                actual = actual+1;
                productos[pos].actual= actual;
                if(editandoItem){
                    if(productos[pos].tipo==1){
                        var priceActual = actual * productos[pos].precioPaq;
                        productos[pos].precioActual = priceActual;

                        document.getElementById("textCantPaq"+pos).innerHTML ="Cant: "+ actual+" paq";
                        document.getElementById("txtPrecioPaq"+pos).innerHTML ="$"+ priceActual;
                    }else{
                        var priceActual = actual * productos[pos].precioUnidad;
                        productos[pos].precioActual = priceActual;

                        document.getElementById("textCantPaq"+pos).innerHTML = "Cant: "+ actual+" unds";
                        document.getElementById("txtPrecioPaq"+pos).innerHTML ="$"+ priceActual;
                    }
                }else{
                    if(productos[pos].tipo==1){
                        var priceActual = actual * productos[pos].precioPaq;
                        productos[pos].precioActual = priceActual;

                        document.getElementById("textCantPaq"+pos).innerHTML ="Cant: "+ actual+" paq";
                        document.getElementById("txtPrecioPaq"+pos).innerHTML ="$"+ priceActual;
                    }else{
                        var priceActual = actual * productos[pos].precioUnidad;
                        productos[pos].precioActual = priceActual;

                        document.getElementById("und"+pos).innerHTML = actual+" unds";
                        document.getElementById("price"+pos).innerHTML ="$"+ priceActual;
                    }
                }
            }
    }
    function getViewPaquete(pos){
            productos[pos].tipo = 1;
            var newPrice = productos[pos].precioPaq *  productos[pos].actual;
            productos[pos].precioActual = newPrice;
            var contenido = '<div class="winOrden"><button class="close" onclick="productos.volverAUnidades(';
            contenido += pos;
            contenido += ', false)"></button><img src="';
            contenido += productos[pos].url;
            contenido += '"><h1 id="txtPrecioPaq';
            contenido += pos;
            contenido += '">$';
            contenido +=productos[pos].precioActual;
            contenido +='</h1><ul class="winOrdenDesc"><li id="nombPaq">';
            contenido +=productos[pos].nombre;
            contenido +='</li><li id="descItemEdit">';
            contenido +=productos[pos].descPaq;
            contenido +='</li></ul><div class="calDiv" ><button class="menosButtonPaq" onclick="productos.restar(';
            contenido += pos;
            contenido +=')"></button><h4 id="textCantPaq';
            contenido += pos;
            contenido += '">Cant:';
            contenido += productos[pos].actual;
            contenido += ' paq</h4><button class="masButtonPaq" onclick="productos.sumar(';
            contenido += pos;
            contenido += ')"';
            contenido += '></button></div><button class="ok" onclick="productos.agregar(';
            contenido += pos
            contenido += ')"';
            contenido += '></button></div>';
            document.getElementById("alert").innerHTML= contenido;
            document.getElementById("alert").style.display= "block";
    }
    function volverAUnidades(pos){
        var newPrice = productos[pos].precioUnidad *  productos[pos].actual;
        productos[pos].precioActual = newPrice;
        document.getElementById('alert').style.display = 'none';
    }
    function agregar(pos){
            if(!confirmando){
                var contenido =  productos[pos].nombre;
            var namePro= productos[pos].nombre;
            contenido += productos[pos].precioActual;
            contenido += productos[pos].actual;
            var andUrl = '/data/data/com.medialuna.delicatessen.cali/files/'+ productos[pos].andUrl+'.png';
            var ref = firebase.database().ref('Usuarios/'+id);
             ref.once('value', function(snapshot){
                var total = 0;
                var dom = 0;
                    if(snapshot.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Productos').exists()){
                        if(editandoItem){
                            var desc = "";
                            if(productos[pos].tipo==0){
                                desc = productos[pos].descPro;
                            }else{
                                desc = productos[pos].descPaq;
                            }
                            snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Productos/'+productos[pos].nombre).set({
                                    cantidad: productos[pos].actual,
                                    descripcion: desc,
                                    tipo :  productos[pos].tipo,
                                    total: productos[pos].precioActual,
                                    weburl: productos[pos].url,
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

                            if(type!=productos[pos].tipo){
                                newCant = productos[pos].actual;
                                totPro = productos[pos].precioActual;
                                total = total-tot;
                                total = total + totPro;
                                dom = getDomicilio(total);
                                if(productos[pos].tipo==1){
                                    newDesc = productos[pos].descPaq;
                                }


                            }else{
                                newCant = cant+ productos[pos].actual;
                                totPro = tot + productos[pos].precioActual;
                                total = total+ productos[pos].precioActual;
                                dom = getDomicilio(totPro);

                            }



                            snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Total').set(total);
                            snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/domicilio').set(dom);




                        }else{
                            var tot = snapshot.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Total').val();
                            total = parseInt(tot, 10);
                            newCant= productos[pos].actual;
                            if(productos[pos].tipo==1){
                                newDesc = productos[pos].descPaq;
                            }else{
                                newDesc = productos[pos].descPro;

                            }

                            totPro = productos[pos].precioActual;
                            total = total + productos[pos].precioActual;
                            dom = getDomicilio(total);
                            snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Total').set(total);
                            snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/domicilio').set(dom);


                        }
                        snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Productos/'+productos[pos].nombre).set({
                                    cantidad: newCant,
                                    descripcion: newDesc,
                                    tipo :  productos[pos].tipo,
                                    total: totPro,
                                    weburl: productos[pos].url,
                                    url: andUrl,
                                    uri: 1
                            });

                        if(editandoItem){
                            cerrarAlert(pos, true);
                        }else{
                            if(productos[pos].tipo==1){
                                cerrarAlert(pos, true);
                            }
                            var tos = new Toasty();
                            tos.show(productos[pos].nombre+" agregado al "+dias[diaRequested-1].dia, 2000);

                        }

                    var content = 'Total + Domicilio  $';
                    var intTotal = total+dom;
                    content += redondearCifra(intTotal);
                    checkDay();
                        }


                    }else{
                        total = productos[pos].precioActual;
                        dom = getDomicilio(total);
                        snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/estado').set('si');
                        snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/status').set(0);
                        snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Total').set(productos[pos].precioActual);
                        snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/domicilio').set(dom);
                        var content = 'Total + Domicilio  $';
                        var intTotal = total+dom;
                        content += redondearCifra(intTotal);
                        document.getElementById('canastaText').innerHTML = content;
                        var anim = showCanasta();
                        var tos = new Toasty();
                        tos.show(productos[pos].nombre+" agregado al "+dias[diaRequested-1].dia, 2000);
                        if(productos[pos].tipo==1){
                            snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Productos/'+productos[pos].nombre).set({
                                    cantidad: productos[pos].actual,
                                    descripcion: productos[pos].descPaq,
                                    tipo :  productos[pos].tipo,
                                    total: productos[pos].precioActual,
                                    weburl: productos[pos].url,
                                    url: andUrl,
                                    uri: 1
                            });
                        cerrarAlert(pos, true);
                    }else{
                            snapshot.ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Productos/'+productos[pos].nombre).set({
                                    cantidad: productos[pos].actual,
                                    descripcion: productos[pos].descPro,
                                    tipo :  productos[pos].tipo,
                                    total: productos[pos].precioActual,
                                    weburl: productos[pos].url,
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


    function getProductosJson(){
        if(!productosJson){
            readFromJson('/json/Productos.json', function(response){
                if(response){
                    var json = JSON.parse(response);
                    productosJson = json;


                }
                checkAndSetProductosDb();

            });
        }else{
            cargarProductos();
        }

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
                            data: productosJson
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
                    cargarProductos();
                }else{
                    readProdsInDb();
                }
            });


        }else{
            cargarProductos();
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
                                        productosJson = data.result.data;
                                        cargarProductos();
                                    }else{
                                        getProductosJson();
                                    }
                                };


                };
    }
    function cargarProductos(){
            document.getElementById("cargandoProds").style.display="flex";
            categoria = reference;
            document.getElementById("cateActual").innerHTML = reference;
            var prods = new Array();
            if(productosJson){
                var json = productosJson.Categorias[reference];
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
                    prods[pos] = pro;
                    pos++;

                }
                mostrarProductos(true);



            }else{
                getProductosJson();
                productos = new Productos(reference);
                productos.getFromDB();



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
  }
  return Prods;


});
