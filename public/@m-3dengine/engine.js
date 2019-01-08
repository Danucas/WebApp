define([], function(){


    function engine(){
        this.load3dObj = load3dObj;
        this.mobileControl = mobileControl;
        this.setRequestedColor = setRequestedColor;
        this.aplicarColor = aplicarColor;
        console.log('engine started');
        var camara ;
        var cam = false;
        var canvas;
        var dx ;
        var dy;
        var scene ;
        var actualObj
        var scalar =false;
        var mover = true;
        var rotar = false;
        var reqCOLOR = {r:255, g:0, b:0};
        var log = document.getElementById('console');

        class Mesh{
            constructor(mesh, nombre){
              this.name = nombre;
              this.poligons = mesh;
              this.ObjRotation = {x:0,y:0, z:0};
              this.ObjTranslation = {x:0,y:0, z:0};
              this.up = {x:0, y:0,z:0};
              this.scala = 1;
              this.origin = mesh[0][0];
              this.rgb = {r:255, g:0, b:0};
           }
           alignToParent(){
             var m =  this.translate(this.rotate(this.scalar(this.origin)));
             var newVec = restarVec(Parent.pos, new Vector(m));
             console.log(Parent.pos ,newVec, m);
             this.setTranslation(newVec);
           }

           setColor(rgb){
             this.rgb = rgb;
           }
           getColor(){
             return this.rgb;
           }
           setRotation(rot){
             this.ObjRotation = sumarVec(this.ObjRotation, rot);
             for(var key in this.ObjRotation){
                  if(this.ObjRotation[key]>6.28){
                    this.ObjRotation[key] =0;
                  }
             }
           }
           setTranslation(tra){
             this.ObjTranslation = sumarVec(this.ObjTranslation, tra);

           }
           rotate(vertice){
                var tempx;
                var tempy;
                var tempz;
                var overX = this.ObjRotation.x;
                var overY = this.ObjRotation.y;
                var overZ = this.ObjRotation.z;
                //rotar en x
                var i = (1)*(vertice[0])+(0)*(vertice[1])+(0)*(vertice[2]);
                var j = (0)*(vertice[0])+(Math.cos(overX))*(vertice[1])+(-(Math.sin(overX)))*(vertice[2]);
                var k = (0)*(vertice[0])+(Math.sin(overX))*(vertice[1])+(Math.cos(overX))*(vertice[2]);
                tempx = i;
                tempy = j;
                tempz = k;
                //rotar en Y

                var i = (Math.cos(overY))*(tempx)+(0)*(tempy)+(Math.sin(overY))*(tempz);
                var j = (0)*(tempx)+(1)*(tempy)+(0)*(tempz);
                var k = (-(Math.sin(overY)))*(tempx)+(0)*(tempy)+(Math.cos(overY))*(tempz);

                tempx = i;
                tempy = j;
                tempz = k;

                //rotar en z;

                var i = (Math.cos(overZ))*(tempx)+(-(Math.sin(overZ)))*(tempy)+(0)*(tempz);
                var j = (Math.sin(overZ))*(tempx)+(Math.cos(overZ))*(tempy)+(0)*(tempz);
                var k = (0)*(tempx)+(0)*(tempy)+(1)*(tempz);

                tempx = i;
                tempy = j;
                tempz = k;

                var temp = [tempx, tempy, tempz];

                return temp;
           }
           translate(vertice){
              var vec1 = new Vector(vertice);
              var newVec = sumarVec(vec1, this.ObjTranslation);
              return [newVec.x, newVec.y, newVec.z];

           }
           scalar(vertice){
              var newVert = multiplicarVec(new Vector(vertice), new Vector([this.scala, this.scala, this.scala]));

              return [newVert.x, newVert.y, newVert.z];
           }
           getOrigin(){
             return this.origin;
           }
           mergeMesh(){
             var newPoligons = new Array();
             this.poligons.forEach(poligono=>{
               var newPoli = new Array();
               poligono.forEach(vertice=>{
                  var ver = this.translate(this.rotate(this.scalar(vertice)));//this.scalar(this.translate(this.rotate(vertice)));
                  newPoli.push(ver);
               });

               newPoligons.push(newPoli);
             });

             var up  = this.calcularVector(new Vector(newPoligons[0][0]), new Vector(newPoligons[0][1]));
             //console.log('name: ', this.name, 'rotation: ', this.ObjRotation, 'translation: ', this.ObjTranslation);
             return newPoligons;
           }
           calcularVector(vec1, vec2){
             var op = (Math.pow((vec1.x-vec2.x), 2))+(Math.pow((vec1.y-vec2.y), 2))+(Math.pow((vec1.z-vec2.z), 2));

             op  = Math.sqrt(op);
             return parseFloat(op);
           }


        };
        class Camara{
            constructor(){
                this.pos = new Vec(0,0, -10);
                this.zoom = 1;
                this.mode = 'perspective';
                this.up = {x:0, y:10,z:0 };
                this.target = {x:0, y:0,z:100};
                this.rotation = {x:0, y:0,z:0};
            }

            setRotation(rot){
                this.rotation = sumarVec(this.rotation, rot);
                for(var key in this.otation){
                     if(this.rotation[key]>6.28){
                       this.rotation[key] =0;
                     }
                }
            }

            rotate(vertice){
                 var tempx;
                 var tempy;
                 var tempz;
                 var overX = this.rotation.x;
                 var overY = this.rotation.y;
                 var overZ = this.rotation.z;
                 //rotar en x
                 var i = (1)*(vertice[0])+(0)*(vertice[1])+(0)*(vertice[2]);
                 var j = (0)*(vertice[0])+(Math.cos(overX))*(vertice[1])+(-(Math.sin(overX)))*(vertice[2]);
                 var k = (0)*(vertice[0])+(Math.sin(overX))*(vertice[1])+(Math.cos(overX))*(vertice[2]);
                 tempx = i;
                 tempy = j;
                 tempz = k;
                 //rotar en Y

                 var i = (Math.cos(overY))*(tempx)+(0)*(tempy)+(Math.sin(overY))*(tempz);
                 var j = (0)*(tempx)+(1)*(tempy)+(0)*(tempz);
                 var k = (-(Math.sin(overY)))*(tempx)+(0)*(tempy)+(Math.cos(overY))*(tempz);

                 tempx = i;
                 tempy = j;
                 tempz = k;

                 //rotar en z;

                 var i = (Math.cos(overZ))*(tempx)+(-(Math.sin(overZ)))*(tempy)+(0)*(tempz);
                 var j = (Math.sin(overZ))*(tempx)+(Math.cos(overZ))*(tempy)+(0)*(tempz);
                 var k = (0)*(tempx)+(0)*(tempy)+(1)*(tempz);

                 tempx = i;
                 tempy = j;
                 tempz = k;

                 var temp = [tempx, tempy, tempz];

                 return temp;
            }

            transform(punto){

            }
        }
        class Viewport {

            constructor(){
              this.pos= {x:0, y:0, z:10},
              this.up={x:0, y:10, z:0},
              this.width= 175,
              this.height=175
              this.rotation= {x:0, y:0, z:0};
            }
            setRotation(rot){

              this.rotation = sumarVec(this.rotation, rot);
              for(var key in this.otation){
                   if(this.rotation[key]>6.28){
                     this.rotation[key] =0;
                   }
              }

            }

        }
        var Parent = {
            pos:{x: 0, y:0, z:0}
        }
        var viewport = new Viewport();
        var rendering = false;
        var width;
        var height;

        var Vector = function(coor){
            this.x = coor[0];
            this.y = coor[1];
            this.z = coor[2];
        }
        function sumarVec(vec1, vec2) {
          var newVec = {
            x: parseFloat(vec1.x+vec2.x),
            y: parseFloat(vec1.y+vec2.y),
            z: parseFloat(vec1.z+vec2.z)
          }
          return newVec;
        }
        function restarVec(vec1, vec2) {
          var newVec = {
            x: parseFloat(vec1.x-vec2.x),
            y: parseFloat(vec1.y-vec2.y),
            z: parseFloat(vec1.z-vec2.z)
          }
          return newVec;

        }
        function dividirVec(vec1, vec2) {
          var newVec = {
            x: parseFloat(vec1.x/vec2.x),
            y: parseFloat(vec1.y/vec2.y),
            z: parseFloat(vec1.z/vec2.z)
          }
          return newVec;
        }
        function multiplicarVec(vec1, vec2) {
          var newVec = {
            x: parseFloat(vec1.x*vec2.x),
            y: parseFloat(vec1.y*vec2.y),
            z: parseFloat(vec1.z*vec2.z)
          }
          return newVec;
        }


        function sumTranslate(M){
          camara.pos = sumarVec(camara.pos, M);
          viewport.pos = sumarVec(viewport.pos, M);

        }
        function sumRotate(M) {
          camara.setRotation(M);
          viewport.setRotation(M);
        }
        function translate(punto){




            var tempx = punto[0]+camara.pos.x;
            var tempy = punto[1]+camara.pos.y;
            var tempz = punto[2]+camara.pos.z;

            return [tempx, tempy, tempz];
        }


        function load3dObj(){
            console.log('leyendo .obj');
            var fileName = './@m-3dengine/3dAssets/pan/cubo.txt';
            var rawFile = new XMLHttpRequest();
            rawFile.open("GET", fileName, true);
            rawFile.onreadystatechange = function (){

                if(rawFile.readyState === 4)
                {
                    if(rawFile.status === 200 || rawFile.status == 0)
                    {

                        var allText = rawFile.responseText;
                        procesarTexto(allText);

                    }
                }
            }
            rawFile.send(null);
        }

        function  procesarTexto(allText){

            var list = allText.split('f')[0].split('v');

            var list2 = new Array();
            var list3 = new Array();
            var pos;
            list3.push([""]);
            for(var i=0; i<list.length;i++){

                if(list[i].split(' ')[0]=='t'){
                    if(!pos){
                        pos = i;
                    }
                    var L = list[i].replace('t ', '').split(' ');

                    var newL = new Array();
                    for(var j=1;j<4;j++){
                        newL.push(L[j]);
                    }
                    list2.push(newL);
                }else if(list[i].split(' ')[0]=='n'){
                    var L = list[i].replace('n ', '').split(' ');
                    var newL = new Array();
                    for(var j=0;j<4;j++){
                        newL.push(L[j]);
                    }
                    list3.push(newL);

                }
            }


            var fragmentList= allText.split('f')

            var newFragmentList = new Array();
            for(var i=1;i<fragmentList.length;i++){
                var l = fragmentList[i].split(' ');
                var fList = new Array();
                for(var j=1;j<l.length;j++){
                    fList.push(l[j]);
                }
                newFragmentList.push(fList);
            }
            if(!pos){
                pos = list.length;
            }
            var newList = new Array();

            for(var i=1;i<pos;i++){
                var I = list[i].split(' ');
                var newI = new Array();
                for(var j=0;j<I.length;j++){
                  if(I[j]!=''&&I[j]!=undefined){
                      newI.push(parseFloat(I[j]));
                  }



                }

                newList.push(newI);
            }

            modelo3d = [newList, newFragmentList];
            model = {
                vertices: modelo3d[0],
                faces: modelo3d[1]
            };

            console.log(model);

            initialize3dCanvas();
        }
        var modelo3d;
        var model;
        var gl;

        function initialize3dCanvas(){



            document.getElementById('actColor').style.backgroundColor = 'rgb('+reqCOLOR.r+','+reqCOLOR.g+','+reqCOLOR.b+')';
            canvas = document.getElementById('canvas3d');
            dx = canvas.width / 2;
            dy = canvas.height / 2;
            width = canvas.width;
            height = canvas.height;
            context =  canvas.getContext('2d');

            context.strokeStyle = 'rgba(86, 35, 23, 0.3)';
            context.fillStyle = 'rgba(255, 211, 0, 0.3)';


            camara = new Camara();
            cam = true;
            document.getElementById('camFocus').style.backgroundColor = '#8c8c88';
            var rotacion = new Vec(0,0,0);
            context.clearRect(0, 0, canvas.width, canvas.height);

            camara.zoom =2;

            var cubo = new Mesh(convertToMesh(model), 'cubo1');
            cubo.setTranslation({x: 0, y:0, z:0});
            var cubo2 = new Mesh(convertToMesh(model), 'cubo2');
            cubo2.setTranslation({x: 6, y:0, z:0});



            actualObj = 0;
            scene = [cubo, cubo2];
            var txt = document.getElementById('meta_AR');

            log.innerHTML = 'mover';
            txt.innerHTML = scene[actualObj].name;
            renderScene(scene);



            function drawPoligons(faces){

              var P = project(faces[0][0], camara);
              context.moveTo(P.x+dx, P.y+dy);
              for(var i=0;i<faces.length;i++){
                  context.beginPath();
                  for(var j=0;j<faces[i].length;j++){

                      var P = project(faces[i][j], camara);
                      if(P.x<300&&P.y<300){
                           context.lineTo(P.x+dx, P.y+dy);
                      }


                  }
                  context.stroke();
                  context.closePath()
                  context.fill();

              }

            }
            var changedTouch = {
              actual:{x:0, y:0},
              last:{x:0, y:0}
            }
            canvas.addEventListener('touchstart', function(e){
                    changedTouch.last.x = e.changedTouches[0].clientX;
                    changedTouch.last.y =  e.changedTouches[0].clientY;


            }, true);
            canvas.addEventListener('touchend', function(e){


                    changedTouch.actual.x = e.changedTouches[0].clientX;
                    changedTouch.actual.y = e.changedTouches[0].clientY;


                    var diffX = changedTouch.actual.x-changedTouch.last.x;
                    var diffY = changedTouch.actual.x-changedTouch.last.y;
                    var iX;
                    var iY;
                    if(diffX<0){
                      iX = diffX*(-1);
                    }else{ iX = diffX;}
                    if(diffY<0){
                      iY = diffY*(-1);
                    }else{ iY = diffY;}


                    var average = (diffX+diffY)/2;


                    if(iY>(iX+20)&&diffY<0){
                      if(changedTouch.actual.y>0){
                        sumTranslate({x:0, y:(iY/dy), z:0});

                      }

                    }else if(iY>(iX+20)&&diffY>0){

                        sumTranslate({x:0, y:-(iY/dy), z:0});
                    }else if(iX>(iY+20)&&diffX<0){
                       sumTranslate({x:+(iX/dx), y:0, z:0});
                    }else if(iX>(iY+20)&&diffX>0){
                      sumTranslate({x:-(iX/dx), y:0, z:0});
                    }
                    /*
                    if(changedTouch.actual.x<0&&changedTouch.actual.y<0){

                      sumTranslate({x:(average), y:(average), z:0});
                      console.log('T');
                    }else if(changedTouch.actual.x<0&&changedTouch.actual.y>0){
                      sumTranslate({x:(diffX), y:-(diffY), z:0});
                      console.log('M');

                    }else if(changedTouch.actual.x>0&&changedTouch.actual.y>0){

                        sumTranslate({x:-(average), y:-(average), z:0});
                      console.log('H');
                    }else if(changedTouch.actual.x>0&&changedTouch.actual.y<0){
                        sumTranslate({x:-(diffX), y:(diffY), z:0});
                      console.log('W');
                    }
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    */
                    renderScene(scene);



            }, true);
            canvas.addEventListener( 'wheel', function(e) {
              console.log('wheling')
               if(!rendering){
                context.clearRect(0, 0, canvas.width, canvas.height);
                rendering = true;
                var doZoom = false;
                if(e.deltaY<0){
                        if(scalar){
                          console.log('scalando: ', scene[actualObj].name);
                          scene[actualObj].scala += 0.01;
                        }else{
                          camara.zoom += 0.4;
                        }

                        doZoom = true;







                }else if(e.deltaY>0){

                      if(scalar){
                        console.log('scalando: ', scene[actualObj].name);
                          if(scene[actualObj].scala>0.01){
                            scene[actualObj].scala -= 0.01;
                          }
                          console.log('top_minimun_scala');
                        }else{
                        camara.zoom -= 0.4;

                      }
                        doZoom = true;


                }

                if(doZoom){

                  renderScene(scene);
                }

               }

            });
            document.addEventListener('keydown', function(e){
              console.log(e.keyCode);

                if(!rendering){
                    var canMove = false;

                var rot = false;


                rendering = true;
                commandKey(e.keyCode, e.shiftKey);
              }

            });

            //render(model, context, dx, dy*/

        }

        function renderScene(scena){
            context.clearRect(0, 0, canvas.width, canvas.height);
            scena.forEach(object=>{
                var rgb = object.getColor();
                context.fillStyle = 'rgba('+ rgb.r+','+ rgb.g+','+ rgb.b+', 0.3)';
                renderMesh(object.mergeMesh(), context, dx, dy, [rgb.r, rgb.g, rgb.b]);
            });
        }
        function nextObj(){
            actualObj +=1;
            if(actualObj>scene.length-1){
              actualObj = 0;
            }
            console.log('selected Obj:=>', scene[actualObj].name);
            log.innerHTML= 'selected Obj:=>'+ scene[actualObj].name;
            document.getElementById('actColor').style.backgroundColor = 'rgb('+scene[actualObj].rgb.r+','+scene[actualObj].rgb.g+','+scene[actualObj].rgb.b+')';
        }

        function commandKey(code, shift){
          switch(code){
              case 37:
               //left
               if(rotar){
                    sumRotate({x:0, y:-0.19625, z:0});
               }else{
                   sumTranslate({x:-1, y: 0, z:0});
               }

                 renderScene(scene);
                 break;
              case 39:
                 //right
                 if(rotar){
                      sumRotate({x:0, y:0.19625, z:0});
                 }else{
                   sumTranslate({x: 1, y: 0, z:0});
                 }

                  renderScene(scene);
                  break;
              case 38:
                  if(rotar){
                     sumRotate({x:0.19625, y:0, z:0});


                  }else{
                      sumTranslate({x: 0, y: -1, z:0});
                      //dezplazar CAMARA hacia arriba

                  }
                    renderScene(scene);
                   break;
              case 40:
                  if(rotar){
                      sumRotate({x:-0.19625, y:0, z:0});


                  }else{
                      //dezplazar CAMARA hacia abajo
                      sumTranslate({x: 0, y: 1, z:0});

                  }
                    renderScene(scene);
                   break;
              case 74:

                  if(rotar){
                    ///rotar objeto sobre el eje y
                    scene[actualObj].setRotation({x:0, y:0.19625, z:0});
                  }else{
                    //dezplazar objeto hacia la derecha
                      scene[actualObj].setTranslation({x:0.4, y:0, z:0});
                  }

                  renderScene(scene);


                  break;
              case 76:
                  if(rotar){
                    ///rotar objeto sobre el eje y
                    scene[actualObj].setRotation({x:0, y:-0.19625, z:0});
                  }else{
                    //dezplazar objeto hacia la izquierda
                    scene[actualObj].setTranslation({x:-0.4, y:0, z:0});
                  }

                  renderScene(scene);
                  break;
              case 73:
                  if(rotar){
                    ///rotar objeto sobre el eje x
                    scene[actualObj].setRotation({x:-0.19625, y:0, z:0});
                  }else{
                    //dezplazar objeto hacia ARRIBA
                    scene[actualObj].setTranslation({x:0, y:0.4, z:0});
                  }

                  renderScene(scene);
                  break;
              case 75:
                  if(rotar){
                    ///rotar objeto sobre el eje x
                    scene[actualObj].setRotation({x:0.19625, y:0, z:0});
                  }else{
                    //dezplazar objeto hacia abajo
                    scene[actualObj].setTranslation({x:0, y:-0.4, z:0});
                  }

                  renderScene(scene);
                  break;
              case 80:
                  if(scalar&&!cam){
                    scene[actualObj].scala += 0.01;
                  }else{
                    //dezplazar objeto hacia atras
                      scene[actualObj].setTranslation({x:0, y:0, z:0.4});
                  }

                  renderScene(scene);
                  break;
              case 77:
                  if(scalar&&!cam){
                      scene[actualObj].scala -= 0.01;
                  }else{
                    //dezplazar objeto hacia adelante
                    scene[actualObj].setTranslation({x:0, y:0, z:-0.4});
                  }

                  renderScene(scene);
                  break;
              case 81:
                  //alinear objeto al padre
                  scene[actualObj].alignToParent();
                  renderScene(scene);
                  break;
              case 220:
                  //seleccionar siguiente objeto
                  nextObj();
                  break;
              case 188:

                  renderScene(scene);
                  break;

              case 83:
                  mover = false;
                  rotar = false;
                  if(!scalar){
                    scalar = true;
                  }else{
                    scalar = false;
                  }
                  console.log('scalar: ', scalar);
                  log.innerHTML = 'scalar..';
                  break;
              case 33:
                  sumTranslate({x:0, y:0, z:1});
                  renderScene(scene);
                  break;
              case 34:
                  sumTranslate({x:0, y:0, z:-1});
                  renderScene(scene);
                  break;
              case 82:
                  rotar = true;
                  mover = false;
                  scalar = false;
                  log.innerHTML = 'rotar..';
                  break;
              case 84:
                  rotar = false;
                  mover = true;
                  scalar = false;
                  log.innerHTML = 'mover..';
                  break;
              case 1000:
                  cam = false;
                  document.getElementById('camFocus').style.backgroundColor = '#424240';
                  document.getElementById('objFocus').style.backgroundColor = '#8c8c88';
                  nextObj();
                  break;



          }

          setTimeout(function(){
                  rendering = false;
          }, 200);





        }

        function mobileControl(code){
          console.log(code);
          if(code==77||code==80){
            if(cam){
              if(code == 77){

                camara.zoom -= 0.4;
              }else{
                camara.zoom += 0.4;
              }
              renderScene(scene);
            }else{
              commandKey(code, false);
            }

          }else if(code==0||code==1){
            if(code ==0){
              cam = true;
              document.getElementById('camFocus').style.backgroundColor = '#8c8c88';
              document.getElementById('objFocus').style.backgroundColor = '#424240';

            }else{
              cam = false;
              document.getElementById('camFocus').style.backgroundColor = '#424240';
              document.getElementById('objFocus').style.backgroundColor = '#8c8c88';
            }

          }else if(code>36&&code<41){
            if(!cam){
              var newCode ;
              if(code==37){
                newCode = 74;
              }else if(code ==38){
                newCode = 73;
              }else if(code ==39){
                newCode = 76;
              }else if(code == 40){
                newCode =75;
              }
              commandKey(newCode, false);
            }else{

              commandKey(code, false);
            }

          }else{
              commandKey(code, false);
          }


        }

        function offset(punto, position){

        }

        class Vec {
            constructor(x = 0, y = 0, z = 0) {
                this.x = x;
                this.y = y;
                this.z = z;
            }
        }






        function zoom(punto, factor){

            const scale = Math.pow(factor, 2);
            var tempx = parseFloat(punto[0]*scale);
            var tempy = parseFloat(punto[1]*scale);
            var tempz = punto[2];//parseFloat(punto[2]*scale);
            var temp = [tempx, tempy, tempz];
            return temp;

        }



        function renderMesh(faces, context, dx, dy, rgb){

            var r = rgb[0];
            var g=  rgb[1];;
            var b= rgb[2];
            var len = faces.length;

            //len =4;
            var P = project(faces[0][0], camara);
            context.moveTo(P.x+dx, P.y+dy);

            for(var i=0;i<len;i++){

                if(i==0){
                  context.fillStyle = 'rgba('+ (r-50)+','+ (g+100)+','+ b+', 0.3)';
                }else{
                  context.fillStyle = 'rgba('+ r+','+ g+','+ b+', 0.3)';
                }
                //context.fillStyle = 'rgba('+ r+','+ g+','+ b+', 0.3)';
                context.beginPath();
                for(var j=0;j<faces[i].length;j++){

                    var P = project(faces[i][j], camara);

                    if(P!=undefined){
                      context.lineTo(P.x+dx, P.y+dy);
                    }
                        //console.log('rendering: ', (P.x+dx).toFixed(2), (P.y+dy).toFixed(2), 'faces: ', faces[i][j]);




                }
                context.stroke();
                context.closePath();
                context.fill();



            }


            rendering = false;



        }



        function convertToMesh(modelo){
            var faces = new Array();

            for(var i=0, faces_length= modelo.faces.length; i<faces_length; i++){
                var verts = new Array();


                for(var j=0; j<modelo.faces[i].length;j++){
                    var vert = modelo.faces[i][j].split('/');
                    var v = modelo.vertices[vert[0]-1];
                    if(v!=undefined){
                      verts.push(v);
                    }


                }

                faces.push(verts);

            }


            return faces;
        }


        function toPoligon(punto){

        }
        function render(object, context, dx, dy){
            var vertices = object.vertices;

            for(var i=0, n_faces = object.faces.length; i<n_faces;++i){

                var face = object.faces[i];
                var P  = project(vertices[face[0][0]]);



                for(var j=0, n_vertices = face.length; j<n_vertices;++j){
                    context.beginPath();
                    context.moveTo(P.x +dx, P.y+dy);
                    for(var vertex=0, len = face[j].length; vertex<len; ++vertex){
                        if(face[j][vertex]<vertices.length){

                            if(vertices[face[j][vertex]]!=undefined){
                                var P = project(vertices[face[j][vertex]]);
                                context.lineTo(P.x+dx, P.y+dy);
                            }

                        }
                        context.stroke();

                    }
                    context.closePath()

                    context.fill();



                }




            }

        }

        function project(punto, camara){
            if(camara.mode=='perspective'){
              return new Vertex2D(perspectiva(punto, camara));
            }



        }
        function perspectiva(point, camara){
            var punto = zoom(translate(camara.rotate(point), camara.pos), camara.zoom);
            var tempx = (punto[0]*viewport.pos.z)/punto[2];
            var tempy = (punto[1]*viewport.pos.z)/punto[2];
            var tempz = (punto[2]*viewport.pos.z)/ punto[2];
            var temp = [tempx, tempy, tempz];

            return new Vector(temp);


        }

        var Vertex2D = function(punto) {
            this.x = parseFloat(punto.x*width/viewport.width);
            this.y = parseFloat(punto.y*height/viewport.height);
        };
        function aplicarColor(){
          scene[actualObj].setColor(getRGB());
          renderScene(scene);
          console.log(getRGB());
        }
        function getRGB(){
          return reqCOLOR;
        }
        function setRequestedColor(rgb){
            reqCOLOR = rgb;
            document.getElementById('actColor').style.backgroundColor = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
        }

    }



    return engine;
});
