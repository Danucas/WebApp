define([], function(){
  function Orden(dia){
    this.id = dia;
    this.reserva = reserva;
    this.print = print;
    this.editarItem = editarItem;
    this.editarDir = editarDir;
    this.removerItem = removerItem;

    function print(){
      console.log('module loaded');
    }
    //Obtiene los datos de la orden
    function reserva(){
            hasChossenHour = false;
            var ref = firebase.database().ref('Usuarios/'+id+'/Suscripcion/Dia/'+dia);
            ref.once('value', function(snapshot){
                var guardado;
                var tot = 0;
                if(snapshot.child('estado').exists()){
                    var estado = snapshot.child('estado').val();
                    if(estado == "guardado"){
                        guardado = true;
                        confirmando= false;
                        canToday = true;
                        document.getElementById("guardarBtn").style.backgroundColor = "#73ba40";
                        document.getElementById("guardarBtn").innerHTML = "Guardado";
                    }else if(estado == "confirmando"||estado == "espera"){
                        ID_ENTREGA = parseInt(snapshot.child('ID_ENTREGA').val(), 10);

                        document.getElementById("moreProBtn").style.display= "none";
                        document.getElementById("guardarBtn").style.backgroundColor = "#73ba40";
                        document.getElementById("guardarBtn").innerHTML = "Confirmando...";
                        confirmar = false;
                        confirmando = true;
                        canToday= true;
                    }else{
                        document.getElementById("guardarBtn").style.backgroundColor= "#df7233";

                        document.getElementById("moreProBtn").style.display= "block";
                        if(diaActual==diaRequested){
                            if(horaActual<13){
                                confirmar = true;
                                canToday = true;
                                document.getElementById("guardarBtn").innerHTML = "Confirmar";
                            }else if(horaActual>13){
                                confirmar = false;
                                canToday = false;
                                document.getElementById("guardarBtn").innerHTML = "Guardar";


                            }

                            confirmando = false;


                        }else{
                            document.getElementById("guardarBtn").innerHTML = "Guardar";
                            confirmar = false;
                            confirmando= false;
                        }


                    }
                }
                if(snapshot.child('Hora de entrega').exists()){
                    if(fromMob){

                        document.getElementById('horaEntrega').style.marginTop = "0.4vw";
                    }else{
                        document.getElementById('horaEntrega').style.marginTop = "0.6vw";
                    }
                    var hora = parseInt(snapshot.child('Hora de entrega').val(),10);
                    if(hora>12){
                        hora = hora-12;
                        document.getElementById('horaEntrega').innerHTML = "Hora de entrega<br>"+hora+" pm";
                    }else{
                        document.getElementById('horaEntrega').innerHTML = "Hora de entrega<br>"+hora+" am";
                    }

                }else{
                    document.getElementById('horaEntrega').innerHTML = "Elige la Hora";

                }
                if(snapshot.child('Direccion de entrega').exists()){
                    var dir= snapshot.child('Direccion de entrega').val();
                    document.getElementById("dirTxt").innerHTML = dir;
                }else{
                    document.getElementById("dirTxt").innerHTML = "";
                }
                if(snapshot.child('Total').exists()){

                }
                if(snapshot.child('Productos').exists()){
                    carList = new Array();
                    var totalOrden = 0;
                    snapshot.child('Productos').forEach(function(prod){
                        var nombre = prod.key;
                        var can = parseInt(prod.child('cantidad').val(), 10);
                        var tipo = parseInt(prod.child('tipo').val(), 10);
                        var descripcion = prod.child('descripcion').val();
                        var total = parseInt(prod.child('total').val(), 10);
                        totalOrden = total + totalOrden;
                        tot += total;
                        var webUrl =  prod.child('weburl').val();
                        var url =  prod.child('url').val();
                        var uri =  prod.child('uri').val();
                        var caritem = new carItem(nombre, descripcion, tipo, can, total,webUrl, url, uri );
                        carList.push(caritem);

                    });

                    var prodContent = "";
                    for(var i = 0; i<carList.length; i++){
                        prodContent += getCarView(carList[i], i);
                    }
                    document.getElementById("carContain").innerHTML = prodContent;


                    var dom;

                    if(snapshot.child('Cupon').exists()){
                        var index = parseInt(snapshot.child('Cupon/index').val(),10);
                        var valor = parseInt(snapshot.child('Cupon/valor').val(),10);
                        var totalDescontado = aplicarDescuento(valor, totalOrden);
                        snapshot.ref.child('totalDescontado').set(totalDescontado);
                        snapshot.ref.child('Total').set(totalOrden);
                        dom = getDomicilio(totalDescontado);
                        totalOrden += dom;
                        totalDescontado = totalDescontado+dom;
                        totalDescontado = redondearCifra(totalDescontado);
                        totalOrden = redondearCifra(totalOrden);
                        document.getElementById("totalTxt").style.textDecoration = "line-through";
                        document.getElementById("totalDescTxt").innerHTML = "$"+ totalDescontado;
                        document.getElementById("totalDesc").style.display ="flex" ;


                    }else{
                        snapshot.ref.child('Total').set(totalOrden);
                        dom = getDomicilio(totalOrden);
                        totalOrden += dom;
                        totalOrden = redondearCifra(totalOrden);
                        document.getElementById("totalTxt").style.color = "#73ba40";
                        document.getElementById("totalTxt").style.textDecoration = "none";
                        document.getElementById("totalDesc").style.display = "none";

                    }
                    document.getElementById("totalTxt").innerHTML = "$"+totalOrden;
                    document.getElementById("domTxt").innerHTML = "$"+redondearCifra(dom);

                    snapshot.ref.child('domicilio').set(dom);
                    if(guardado){
                        if(tot<1999){
                            var tos= new Toasty();
                            tos.show("Pide al menos $2000 pesos en productos", 2000);
                            goMain();
                        }else{
                             getOrden();
                        }

                    }else if(confirmando){
                        showProgressDialog();
                    }

                }else{

                    document.getElementById("carContain").innerHTML = "";
                    document.getElementById("totalTxt").innerHTML = "$"+0;
                    document.getElementById("domTxt").innerHTML = "$"+0;
                    snapshot.ref.child('Total').set(0);
                    snapshot.ref.child('domicilio').set(0);
                }
            });
    }

    //Dummy item car
    function carItem(nombre, descripcion, tipo, cantidad, total, weburl, url, uri){
            this.nombre = nombre;
            this.descripcion = descripcion;
            this.tipo = tipo;
            this.total = total;
            this.weburl = weburl;
            this.url = url;
            this.uri = uri;
            this.cantidad = cantidad;

    }
    function getCarView(car, pos){
            var content = '<li style="list-style: none; margin-top: 1vw;"><div class="carItemContain"';
            if(car.nombre.length>12){
                if(car.nombre.length>20){
                    if(fromMob){
                        content += 'style="height:34vw; "';
                    }else{
                        content += 'style="height:14vw; "';
                    }
                }else{
                    if(fromMob){
                        content += 'style="height:28vw; "';
                    }else{
                        content += 'style="height:14vw; "';
                    }
                }

            }
            content += '><img src="';
            content += car.weburl;
            content += '"><div class="desc"';
            if(car.nombre.length>12){

                content += 'style="padding:0vw 1vw 1vw 1vw;"';

            }
            content += '><h1 id="nomCar';
            content += pos;
            content += '" class="n1">';
            content += car.nombre ;
            content += '</h1><h1 id="nomDesc';
            content += pos;
            content += '" class="n2">';
            content += car.descripcion;
            content += '</h1><h1 id="nomCant';
            content += pos;
            content += '" class="n3">Cant: '
            content += car.cantidad;
            content += '</h1><h1 id="nomTot';
            content += pos;
            content += '" class="n4">$'
            content += car.total;
            content += '</h1></div>';
            if(!confirmando){
                content += '<div class="editDiv"><button class="editBtn" onclick="orden_dia.editarItem(';
            content += pos;
            content += ')"></button><button class="removeBtn" onclick="orden_dia.removerItem(';
            content += pos;
            content += ')"></button></div>';
            }

            content += '</div></li>';
            return content;
    }

    function editarItem(pos){
            editandoItem = true;
            productos.productos  = new Array();
            var cats = ['Aliñados', 'Para Desayunar', 'Dulces', 'Integrales'];
            for(var f=0;f<cats.length;f++){
                var json = productosJson.Categorias[cats[f]];
                var keys = Object.keys(json);
                var pox = 0;
                for(i in json){
                    var pro = new producto( keys[pox],
                                            json[i].url,
                                            json[i].weburl,
                                            json[i].DescPro,
                                            json[i].DescPaq,
                                            parseInt(json[i].precioPaquete,10),
                                            parseInt(json[i].precioUnidad,10),
                                            parseInt(json[i].undPorPaq,10),
                                            pox , 1, 0, parseInt(json[i].precioUnidad,10), false);
                    productos.productos.push(pro);
                    pox++;
                }

            }
            for(var i=0;i<productos.productos.length;i++){
                if(productos.productos[i].nombre == carList[pos].nombre ){
                    var descPro = productos.productos[i].descPro;
                    var descPaq =  productos.productos[i].descPaq;
                    var preUni =  productos.productos[i].precioUnidad;
                    var prePaq =  productos.productos[i].precioPaq;
                    var uniPorPaq = productos.productos[i].undPorPaq;
                    var newPro = new producto(carList[pos].nombre,
                                                carList[pos].url,
                                                carList[pos].weburl,
                                                descPro,
                                                descPaq,
                                                prePaq,
                                                preUni,
                                                uniPorPaq,
                                                pos,
                                                carList[pos].cantidad,
                                                carList[pos].tipo,0
                                                , false);
                    if(descPaq=="sin descripcion"){
                        newPro.precioActual = preUni * carList[pos].cantidad;
                    }else{
                        if(carList[pos].tipo==0){
                            newPro.precioActual = preUni * carList[pos].cantidad;
                        }else{
                            newPro.precioActual = prePaq * carList[pos].cantidad;
                        }

                    }
                    productos.productos= new Array();
                    productos.productos.push(newPro);
                    var cont = getModificarView(productos.productos[0], pos);
                    document.getElementById("alert").innerHTML= cont;
                    document.getElementById("alert").style.display= "block";
                    if(descPaq!="sin descripcion"){
                        if(carList[pos].tipo==0){
                            document.getElementById("porUnidad").style.color = "#176559";
                            document.getElementById("porPaquete").style.color = "grey";
                        }else{
                            document.getElementById("porUnidad").style.color = "grey";
                            document.getElementById("porPaquete").style.color = "#176559";
                        }
                    }
                    break;
                }
            }
    }
    function getModificarView(producto, pos){
            var contenido = '<div class="winOrden"><button class="close" onclick="cerrarAlert(';
            contenido += 0;
            contenido += ', false)"></button><img src="';
            contenido += producto.url;
            contenido += '"><h1 id="txtPrecioPaq';
            contenido += 0;
            contenido += '">$';
            contenido += producto.precioActual;
            contenido += '</h1><ul class="winOrdenDesc"><li id="nombPaq">';
            contenido += producto.nombre;
            contenido +='</li><li id="descItemEdit">';
            if(producto.tipo ==1){
                contenido +=producto.descPaq;
            }else{
                contenido +=producto.descPro;
            }

            contenido +='</li></ul>';
            if(producto.descPaq!="sin descripcion"){
                contenido += '<ul id="modTitles">';
                contenido += '<li id="porUnidad" onclick="setTipo(0)">Por unidad</li><li id="porPaquete"  onclick="setTipo(1)" >Por Paquete</li></ul>';

            }
            contenido += '<div class="calDiv" ><button class="menosButtonPaq" onclick="restar(';
            contenido += 0;
            contenido +=')"></button><h4 id="textCantPaq';
            contenido += 0;
            contenido += '">Cant:';
            contenido += producto.actual;
            contenido += ' paq</h4><button class="masButtonPaq" onclick="sumar(';
            contenido += 0;
            contenido += ')"';
            contenido += '></button></div><button class="ok" onclick="agregar(';
            contenido += 0
            contenido += ')"';
            contenido += '></button></div>';
            return contenido;
    }

    function removerItem(pos){
            var dialog = viewDialog("Quieres ", "Sacar este producto?", "src/icons/zero_img.png");
            document.getElementById("alert").innerHTML = dialog;
            document.getElementById("alert").style.display = "block";
            document.getElementById("yesBtn").innerHTML = "Si";
            document.getElementById("yesBtn").addEventListener("click", function(){
                document.getElementById("alert").style.display = "none";
                var ref = database.ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Productos');
                ref.child(carList[pos].nombre).remove();
                var refMarch= database.ref('Marchantes/Main/Ordenes/Reservado/'+dias[diaRequested-1].dia+'/Usuarios/'+id+'/productos');
                refMarch.child(carList[pos].nombre).remove();
                reserva(dias[diaRequested-1].dia);
            });
            document.getElementById("noBtn").innerHTML= "No";
            document.getElementById("noBtn").addEventListener("click", function(){
                document.getElementById("alert").style.display = "none";

            });
    }
    function comprobarHora(){
            if(!confirmando){

            var ref = database.ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia);
            ref.once('value', function(snapshot){
                    if(snapshot.child('Hora de entrega').exists()){


                            var hor = parseInt(snapshot.child('Hora de entrega').val(), 10);
                            var med = "";
                            if(hor>12){
                                hor = hor-12;
                                med = " pm";
                            }else{
                                med = " am";
                            }
                            var dialog = viewDialog("Hora de entrega", hor+med+"<br>¿Quieres cambiarla?", "src/icons/zero_img.png");
                            document.getElementById("alert").innerHTML = dialog;
                            document.getElementById("alert").style.display = "block";
                            document.getElementById("yesBtn").innerHTML = "Si";
                            document.getElementById("yesBtn").addEventListener("click", function(){
                                    document.getElementById("alert").style.display = "none";
                                    showTimePicker();

                            });
                            document.getElementById("noBtn").innerHTML= "No";
                            document.getElementById("noBtn").addEventListener("click", function(){
                                    document.getElementById("alert").style.display = "none";
                                    if(guardando||confirmar){
                                        comprobarDireccion();
                                    }

                            });

                    }else{
                        showTimePicker();
                    }
            });
            }
    }
    function showTimePicker(){
            var tomorrow = diaActual+1;
            if(tomorrow>7){
                tomorrow = 1;
            }

            var horas = new Array();
            document.getElementById("alert").style.display= "block";
            document.getElementById("alert").innerHTML= '<div id="clockCont"></div>';

            if(diaRequested==tomorrow){
                if(diaActual==1){
                    if(horaActual>=11){
                        horas = [2 , 3 , 4, 5];
                    }else{
                        horas = [7, 8, 9, 10, 2 , 3 , 4, 5];
                    }
                }else{
                    if(horaActual>=17){
                        horas = [2 , 3 , 4, 5];
                    }else{
                        horas = [7, 8, 9, 10, 2 , 3 , 4, 5];
                    }
                }


            }else if(diaActual==diaRequested){
                if(horaActual<=10){
                    horas = [2 , 3 , 4, 5];
                }else if(horaActual==11){
                    horas = [3 , 4, 5];
                }else if(horaActual==12){
                    horas = [4, 5];
                }else if(horaActual>=13){
                    horas = ["No puedes pedir"];
                }

            }else{
                horas = [7, 8, 9, 10, 2 , 3 , 4, 5];
            }
            if(horas[0]=="No puedes pedir"){
                horas = [7, 8, 9, 10, 2 , 3 , 4, 5];
                if(!fromMob){
                    var cont = getClockView(horas);
                }else{
                    var cont = getClockViewMob(horas);
                }

            document.getElementById("clockCont").innerHTML = cont;
            document.getElementById("guardarHora").addEventListener("click", guardarHora);

                for(var i=0; i<horas.length;i++){
                document.getElementById("hora"+horas[i]).style.color = "#df7233";
                }
                var tos = new Toasty();
                tos.show("Tu pedido se guardará para la proxima semana", 3000);


            }else{
                if(!fromMob){
                    var cont = getClockView(horas);
                }else{
                    var cont = getClockViewMob(horas);
                }
            document.getElementById("clockCont").innerHTML = cont;
            document.getElementById("guardarHora").addEventListener("click", guardarHora);

                for(var i=0; i<horas.length;i++){
                document.getElementById("hora"+horas[i]).style.color = "#df7233";
            }
            }
    }
    function guardarHora(){
            if(hasChossenHour){
                if(reqHora != null){
                    var ref = firebase.database().ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia);
                    var newHour;
                    if(reqHora<6){
                        document.getElementById("horaEntrega").innerHTML= "Hora de entrega<br>" + reqHora + " pm";
                        newHour = reqHora + 12;
                    }else{
                        newHour = reqHora;
                        document.getElementById("horaEntrega").innerHTML= "Hora de entrega<br>" + reqHora + " am";
                    }
                    ref.child('Hora de entrega').set(newHour);
                    document.getElementById("alert").style.display= "none";

                    if(guardando||confirmar){
                        comprobarDireccion();
                    }else{
                        reserva(dias[diaRequested-1].dia);
                    }

                }
            }else{

            }
    }
    function showDirecciones(){
            var ref= database.ref('Usuarios/'+id+'/things/Direcciones');
            ref.once('value', function(snapshot){
                if(snapshot.exists()){
                    dirs = new Array();
                    snapshot.forEach(function(direxion){
                        var titulo = direxion.child('titulo').val();
                        var dir = direxion.child('direccion').val();
                        var lat=  direxion.child('lat').val();
                        var long=  direxion.child('long').val();
                        var pos = direxion.key;
                        var newDir = new direccion(titulo, dir,lat, long, pos);
                        dirs.push(newDir);
                    });
                    var cont = '<div class="direcciones"><div class="titleDireccion"><button class="closeLeft" onclick="cerrarReloj()"></button><h1>Elige una Ubicación</h1></div><ul  id="dirList"></ul><div class="dirFoot"><button id="agregarNueva" onclick="showAddDirec()">Agregar nueva</button></div></div>';
                    document.getElementById("alert").innerHTML = cont;
                    document.getElementById("alert").style.display = "block";
                    var dir = "";
                    for(var i=0; i<dirs.length;i++){
                        dir+= getDireccionView(dirs[i]);
                    }
                    document.getElementById("dirList").innerHTML= dir;
                }else{
                    showAddDirec();


                }


            });
    }
    function editarDir(pos){
            var cont = viewEditDirec("Edita tu dirección", dirs[pos].titulo , "Ej: Cr 15 # 8-22");
            document.getElementById("alert").innerHTML= cont;
            document.getElementById("alert").style.display="block";

            var input = document.getElementById("newDir");
            input.value = dirs[pos].direccion;
            document.getElementById("yesBtn").innerHTML = "Guardar";
            document.getElementById("yesBtn").addEventListener("click", function(){
                document.getElementById("alert").style.display = "none";
                var input = document.getElementById("newDir");
                var sanit  = input.value.split('>');
                if(sanit.length>1){
                    var toast = new Toasty();
                    toast.show('Te voy a matar Puto', 2000);
                }else{
                    var ref = database.ref('Usuarios/'+id);
                    ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Direccion de entrega').set(input.value);
                    ref.child('things/Direcciones/'+dirs[pos].pos+'/direccion').set(input.value);
                    reserva(dias[diaRequested-1].dia);
                }


            });
            document.getElementById("noBtn").innerHTML= "Cerrar";
            document.getElementById("noBtn").addEventListener("click", function(){
                document.getElementById("alert").style.display = "none";

            });

    }
    function showAddDirec(){
            var ref = database.ref('Usuarios/'+id+'/things/Direcciones');
            ref.once('value', function(snapshot){
                    var pos= 1;
                    if(snapshot.exists()){
                        snapshot.forEach(function(dir){
                        pos++;
                    });
                    }

                    var cont = viewEditDirec("Edita tu dirección","¿Lugar, Ej: Casa, Trabajo...", "Ej: Cr 15 # 8-22");
                    document.getElementById("alert").innerHTML= cont;
                    document.getElementById("alert").style.display="block";

                    var input = document.getElementById("newDir");
                    var inputTitle = document.getElementById("newDirTitle");
                    input.value = "";
                    inputTitle.value = "";
                    document.getElementById("yesBtn").innerHTML = "Guardar";
                    document.getElementById("yesBtn").addEventListener("click", function(){
                        document.getElementById("alert").style.display = "none";
                        var input = document.getElementById("newDir");
                        var inputTitle = document.getElementById("newDirTitle");
                        var ref = database.ref('Usuarios/'+id);
                        var sanit  = input.value.split('>');
                        var sanitTit = inputTitle.value.split('>');
                        if(sanit.length>1||sanitTit.length>1){
                            var toast = new Toasty();
                            toast.show('Te voy a matar Puto', 2000);
                        }else{
                            ref.child('Suscripcion/Dia/'+dias[diaRequested-1].dia+'/Direccion de entrega').set(input.value);
                            ref.child('things/Direcciones/'+pos+'/direccion').set(input.value);
                            ref.child('things/Direcciones/'+pos+'/titulo').set(inputTitle.value);
                            ref.child('things/Direcciones/'+pos+'/domicilio').set(100);
                            ref.child('things/Direcciones/'+pos+'/lat').set(3.74564);
                            ref.child('things/Direcciones/'+pos+'/long').set(-72.756);
                            if(guardando||confirmar){
                                getOrden();
                            }else{
                                reserva(dias[diaRequested-1].dia);
                            }
                        }



                    });
                    document.getElementById("noBtn").innerHTML= "Cerrar";
                    document.getElementById("noBtn").addEventListener("click", function(){
                    document.getElementById("alert").style.display = "none";

                });


            });
    }
    function borrarDir(pos){}
    function selectDir(pos){
            document.getElementById("dirTxt").innerHTML = dirs[pos].direccion;
            document.getElementById("alert").style.display = "none";
            var ref = database.ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia);
            ref.child('Direccion de entrega').set(dirs[pos].direccion);
            ref.child('lat').set(dirs[pos].lat);
            ref.child('long').set(dirs[pos].long);
            if(guardando||confirmar){
                getOrden();

            }else{
                reserva(dias[diaRequested-1].dia);
            }
    }
    function cerrarReloj(){document.getElementById("alert").style.display = "none";}
    function selectNum(pos){
            hasChossenHour = true;
            if(reqHora !=null){

                document.getElementById("hora"+reqHora).style.color = "#df7233";
                document.getElementById("hora"+reqHora).style.backgroundImage = "";
                reqHora = pos;
            }
            document.getElementById("hora"+pos).style.color = "#ffffff";
            document.getElementById("hora"+pos).style.backgroundImage = "url('src/icons/green_point.png')";
            reqHora = pos;
            if(reqHora>6){
                document.getElementById("horaActual").innerHTML = reqHora +" am";
            }else{
                document.getElementById("horaActual").innerHTML = reqHora +" pm";
            }


    }
    function comprobarDireccion(){
        if(user != null){
                if(!confirmando){
                    var ref = database.ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia);
                    ref.once('value', function(snapshot){
                     if(snapshot.child('Direccion de entrega').exists()){
                            var direc = snapshot.child('Direccion de entrega').val();
                            var hasHora = false;
                            var total = parseInt(snapshot.child('Total').val(), 10);
                            if(snapshot.child('Hora de entrega').exists()){
                                hasHora = true;
                            }
                            var dialog = viewDialog("Direccion de entrega", direc+"<br>¿Quieres cambiarla?", "src/icons/zero_img.png");
                                document.getElementById("alert").innerHTML = dialog;
                                document.getElementById("alert").style.display = "block";
                                document.getElementById("yesBtn").innerHTML = "Si";
                                document.getElementById("yesBtn").addEventListener("click", function(){
                                        document.getElementById("alert").style.display = "none";
                                        showDirecciones();

                                });
                                document.getElementById("noBtn").innerHTML= "No";
                                document.getElementById("noBtn").addEventListener("click", function(){
                                    document.getElementById("alert").style.display = "none";
                                    if(hasHora){
                                        if(total>=2000){
                                            if(guardando||confirmar){
                                                getOrden();
                                            }
                                        }else{
                                            var toast = new Toasty();
                                            toast.show("Elige almenos 2000 pesos en productos", 1500);
                                            verProductos();
                                        }

                                    }else{
                                        comprobarHora();
                                    }
                                });
                        }else{

                        showDirecciones();
                        }
                    });


            }else{
                showAuthDialog();

            }
        }else{
                showAuthDialog();

            }
    }
    function guardarOrden(){
            if(confirmando){
                showProgressDialog();
            }else{
                var ref = database.ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia);
                ref.once('value', function(snapshot){
                    var total = parseInt(snapshot.child('Total').val(), 10);
                    if(total>=2000){
                        if(diaRequested!=diaActual){
                            guardando = true;
                        }else{
                            if(horaActual>=13){
                                confirmar = false;
                                guardando = true;
                            }else{

                                confirmar = true;

                            }

                        }


                        if(marchante==null||marchante==""){
                            askForMarchante();
                        }else{
                            askForCupones(cuponActivo);
                        }


                    }else{
                        fromDay =true;
                        var tos = new Toasty();
                        tos.show("Pide almenos $2000 pesos en productos", 4000);
                        goMain();
                    }
                });

            }
    }
    function grabarEnMarchante(ord){
            if(confirmar){
                var refOrden = database.ref('Marchantes/Main/Ordenes/Pendientes');
                refOrden.once('value', function(snapshot){
                    var index = parseInt(snapshot.child('index').val(), 10);
                    index++;
                    snapshot.ref.child('index').set(index);

                    snapshot.ref.child('enCurso/'+index+'/dia').set(dias[diaRequested-1].dia);
                    snapshot.ref.child('enCurso/'+index+'/total').set(ord.total);
                    snapshot.ref.child('enCurso/'+index+'/tipo').set(0);
                    snapshot.ref.child('enCurso/'+index+'/direccion').set(ord.direccion.direccion);
                    snapshot.ref.child('enCurso/'+index+'/lat').set(ord.direccion.lat);
                    snapshot.ref.child('enCurso/'+index+'/long').set(ord.direccion.long);
                    snapshot.ref.child('enCurso/'+index+'/domicilio').set(ord.domicilio);
                    snapshot.ref.child('enCurso/'+index+'/estado').set("si");
                    snapshot.ref.child('enCurso/'+index+'/status').set(0);
                    snapshot.ref.child('enCurso/'+index+'/hora').set(ord.hora);
                    snapshot.ref.child('enCurso/'+index+'/titular').set(id);
                    snapshot.ref.child('enCurso/'+index+'/marchante').set(marchante);
                    snapshot.ref.child('enCurso/'+index+'/fecha').set(getFecha());
                    snapshot.ref.child('enCurso/'+index+'/dia').set(dias[diaRequested-1].dia);
                    if(ord.totaldescontado !=0){
                        snapshot.ref.child('enCurso/'+index+'/totalDescontado').set(ord.totaldescontado);
                    }
                    snapshot.ref.child('enCurso/'+index+'/Usuarios/'+id+'/total').set(ord.total);
                    snapshot.ref.child('enCurso/'+index+'/Usuarios/'+id+'/domicilio').set(ord.domicilio);
                    for(var i=0; i<ord.productos.length;i++){
                    snapshot.ref.child('enCurso/'+index+'/Usuarios/'+id+'/productos/'+ord.productos[i].nombre+'/cantidad').set(ord.productos[i].cantidad);
                    snapshot.ref.child('enCurso/'+index+'/Usuarios/'+id+'/productos/'+ord.productos[i].nombre+'/total').set(ord.productos[i].total);
                    snapshot.ref.child('enCurso/'+index+'/Usuarios/'+id+'/productos/'+ord.productos[i].nombre+'/descripcion').set(ord.productos[i].descripcion);
                    snapshot.ref.child('enCurso/'+index+'/Usuarios/'+id+'/productos/'+ord.productos[i].nombre+'/tipo').set(ord.productos[i].tipo);
                    }
                    document.getElementById("guardarBtn").style.backgroundColor = "#73ba40";
                    document.getElementById("guardarBtn").innerHTML = "Confirmando...";

                    guardando = false;
                    confirmar = false;
                    setIdEntrega(index);
                    });


            }else{
                ref = database.ref('Marchantes/Main/Ordenes/Reservado/'+dias[diaRequested-1].dia+'/Usuarios/'+id);
                ref.child('dia').set(dias[diaRequested-1].dia);
                ref.child('marchante').set(marchante);
                ref.child('total').set(ord.total);
                ref.child('tipo').set(0);
                ref.child('direccion').set(ord.direccion.direccion);
                ref.child('lat').set(ord.direccion.lat);
                ref.child('long').set(ord.direccion.long);
                ref.child('domicilio').set(ord.domicilio);
                ref.child('estado').set("guardado");
                ref.child('status').set(0);
                ref.child('hora').set(ord.hora);
                ref.child('tipo').set(0);
                if(ord.totaldescontado !=0){
                    ref.child('totalDescontado').set(ord.totaldescontado);
                }
                for(var i=0; i<ord.productos.length;i++){
                    ref.child('productos/'+ord.productos[i].nombre+'/cantidad').set(ord.productos[i].cantidad);
                    ref.child('productos/'+ord.productos[i].nombre+'/total').set(ord.productos[i].total);
                    ref.child('productos/'+ord.productos[i].nombre+'/descripcion').set(ord.productos[i].descripcion);
                    ref.child('productos/'+ord.productos[i].nombre+'/tipo').set(ord.productos[i].tipo);
                }
                document.getElementById("guardarBtn").style.backgroundColor = "#73ba40";
                document.getElementById("guardarBtn").innerHTML = "Guardado";

                guardando = false;
            }


    }
    function setIdEntrega(index){
            var ref = firebase.database().ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia);
            ref.child('ID_ENTREGA').set(index);
            var tos = new Toasty();
            tos.show("Tu orden fué confirmada", 2000);
            reserva(dias[diaRequested-1].dia);
    }
    function removeDia(){

            if(!confirmando){
            var dialog = viewDialog("Quieres ", "Borrar esta orden?", "src/icons/zero_img.png");
            document.getElementById("alert").innerHTML = dialog;
            document.getElementById("alert").style.display = "block";
            document.getElementById("yesBtn").innerHTML = "Si";
            document.getElementById("yesBtn").addEventListener("click", function(){
                document.getElementById("alert").style.display = "none";
                var ref = database.ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia);
                ref.once('value', function(snapshot){
                    if(snapshot.child('Cupon').exists()){
                        snapshot.ref.remove();
                        resetCupon(snapshot.child('Cupon/valor').val());

                    }else{
                        snapshot.ref.remove();
                        goMain();
                    }
                });



            });
            document.getElementById("noBtn").innerHTML= "No";
            document.getElementById("noBtn").addEventListener("click", function(){
                document.getElementById("alert").style.display = "none";

            });
            }else{
                var tos= new Toasty();
                tos.show("No puedes borrar una orden en progreso", 3000);
            }
    }
    function getOrden(){


            var ref = firebase.database().ref('Usuarios/'+id+'/Suscripcion/Dia/'+dias[diaRequested-1].dia);
            ref.once('value', function(snapshot){
                if(confirmar){
                    snapshot.ref.child('estado').set("confirmando");
                    var tos = new Toasty();
                    tos.show("Tu orden fué confirmada", 2000);
                }else{
                    var tos = new Toasty();
                    tos.show("Tu orden está guardada", 2000);
                    snapshot.ref.child('estado').set("guardado");
                }

                var hora = snapshot.child('Hora de entrega').val();
                var direc = new direccion("dir", snapshot.child('Direccion de entrega').val(), 0.0, 0.0, 0);
                var total = snapshot.child('Total').val();
                var domicilio = snapshot.child('domicilio').val();
                var totalDescontado;
                if(snapshot.child('totalDescontado').exists()){
                    totalDescontado = snapshot.child('totalDescontado').val();
                }else{
                    totalDescontado = 0;
                }


                var estado = snapshot.child('estado').val();
                var status = snapshot.child('status').val();
                carList = new Array();

                snapshot.child('Productos').forEach(function(prod){
                    var totPro = prod.child('total').val();
                    var cant = prod.child('cantidad').val();
                    var desc = prod.child('descripcion').val();
                    var url = prod.child('url').val();
                    var weburl = prod.child('weburl').val();
                    var nombre = prod.key;
                    var tipo = prod.child('tipo').val();
                    var newProd = new carItem(nombre, desc, tipo, cant, totPro, weburl, url, 1);
                    carList.push(newProd);

                });

                var ord = new orden(hora, direc, total, domicilio, totalDescontado, estado, status, carList);

                grabarEnMarchante(ord);




            });
    }
  }



  return Orden;
});
