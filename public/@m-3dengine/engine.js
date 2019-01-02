define([], function(){


    function engine(){
        this.load3dObj = load3dObj;
        console.log('engine started');
        var camara ;
        var viewport = {
            pos: {x:0, y:0, z:40},
            up:{x:0, y:10, z:0},
            width: 200,
            height:200
        }
        var rendering = false;
        var witdh;
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

        var translation = {x:0, y:0, z:0};
        function sumTranslate(M){
          translation.x +=M.x;
          translation.y +=M.y;
          translation.z +=M.z;
        }
        function translate(punto){




            var tempx = punto[0]+translation.x;
            var tempy = punto[1]+translation.y;
            var tempz = punto[2]+translation.z;

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




            var canvas = document.getElementById('canvas3d');
            var dx = canvas.width / 2;
            var dy = canvas.height / 2;
            width = canvas.width;
            height = canvas.height;
            context =  canvas.getContext('2d');

            context.strokeStyle = 'rgba(86, 35, 23, 0.3)';
            context.fillStyle = 'rgba(255, 211, 0, 0.3)';


            camara = new Camara();
            var rotacion = new Vec(0,0,0);
            context.clearRect(0, 0, canvas.width, canvas.height);
            camara.pos.z = 100;
            camara.zoom = 1;

            var mesh;
            getMesh(convertToMesh(model));

            function getMesh(faces){

                context.clearRect(0, 0, canvas.width, canvas.height);
                var newRend = new Array();
                /*faces.forEach(poligono=>{
                    var newP = new Array();
                    poligono.forEach(punto=>{
                        newP.push(zoom(punto, camara.zoom));
                    });
                    newRend.push(newP);
                });

                mesh = newRend;*/

                renderMesh(faces, context, dx, dy);
                setTimeout(function(){
                        rendering = false;
                    }, 200);

            }


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












            canvas.addEventListener( 'wheel', function(e) {
              console.log('wheling')
               if(!rendering){
                context.clearRect(0, 0, canvas.width, canvas.height);
                rendering = true;
                var doZoom = false;
                if(e.deltaY<0){

                        camara.zoom += 0.4;
                        doZoom = true;







                }else if(e.deltaY>0){


                        camara.zoom -= 0.4;
                        doZoom = true;



                }

                if(doZoom){
                  console.log('zoom')
                  mesh = convertToMesh(model);
                  renderMesh(mesh, context, dx, dy);
                }

               }

            });




            document.addEventListener('keydown', function(e){
                if(!rendering){
                    var canMove = false;

                var rot = false;
                mesh = convertToMesh(model);
                context.clearRect(0, 0, canvas.width, canvas.height);
                rendering = true;
                switch(e.keyCode){
                    case 37:
                     //left
                      sumTranslate({x:-1, y: 0, z:0});
                       renderMesh(mesh, context, dx, dy);
                       break;
                    case 39:
                       //right
                        sumTranslate({x: 1, y: 0, z:0});
                        renderMesh(mesh, context, dx, dy);
                         break;
                    case 38:
                        if(e.shiftKey){
                           sumTranslate({x: 0, y: 0, z:1});
                           renderMesh(mesh, context, dx, dy);
                        }else{
                            sumTranslate({x: 0, y: -1, z:0});
                            renderMesh(mesh, context, dx, dy);
                        }
                         break;
                    case 40:
                        if(e.shiftKey){
                            sumTranslate( {x: 0, y: 0, z:-1});
                            renderMesh(mesh, context, dx, dy);
                        }else{
                            sumTranslate({x: 0, y: 1, z:0});
                            renderMesh(mesh, context, dx, dy);
                        }
                         break;
                    case 74:
                        dx -= 1;

                        getMesh(mesh);
                        break;
                    case 76:
                        dx += 1;

                        getMesh(mesh);
                        break;




                }

                setTimeout(function(){
                        rendering = false;
                    }, 200);


                }




                function applyTranslation(faces, coor){



                    return faces;
                }
                function applyPerspective(faces){
                    var rendFaces = new Array();
                    faces.forEach(poligono=>{
                        var rendP = new Array();
                        poligono.forEach(punto=>{
                            var point = perspective(punto, camara.pos.z);
                            rendP.push(point);
                        });
                        rendFaces.push(rendP);
                    });
                    return rendFaces;
                }

                function applyRotation(faces, rotacion){
                    var rendFaces = new Array();
                    faces.forEach(poligono=>{
                        var rendP = new Array();
                        poligono.forEach(punto=>{
                            var point = rotate(punto, rotacion);
                            rendP.push(point);
                        });
                        rendFaces.push(rendP);
                    });
                    return rendFaces;
                }
            });

            //render(model, context, dx, dy*/

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


        class Camara{
            constructor(){
                this.pos = new Vec(0,0, 0);
                this.zoom = 1;
                this.mode = 'perspective';
                this.up = {x:0, y:10,z:0 };
                this.target = {x:0, y:0,z:100};
            }

            transform(punto){
                perspective(punto, this.pos.z);
                zoom(punto, this.zoom);
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

        function rotate(punto, rotacion){
            const sin = new Vec(
                    Math.sin(rotacion.x),
                    Math.sin(rotacion.y),
                    Math.sin(rotacion.z));
            const cos = new Vec(
                    Math.cos(rotacion.x),
                    Math.cos(rotacion.y),
                    Math.cos(rotacion.z));
            let temp1, temp2;

            temp1 = cos.x* punto[1]+sin.x*punto[2];
            temp2 = -sin.x* punto[1]+sin.x*punto[2];
            tempy = temp1;
            tempz = temp2;


            temp1 = cos.y*punto[0]+sin.y*tempz;
            temp2 = -sin.y*punto[0]+cos.y*tempz;
            tempx = temp1;
            tempz = temp2;


            temp1 = cos.z*punto[0]+sin.z*tempy;
            temp2 = -sin.z *punto[0]+cos.z*tempy;
            tempx = temp1;
            tempy = temp2;
            return [tempx, tempy , tempz];
        }

        function renderMesh(faces, context, dx, dy){

            var r = 60;
            var g=  30;
            var b= 10;
            var len = faces.length;

            //len =4;
            var P = project(faces[0][0], camara);
            context.moveTo(P.x+dx, P.y+dy);
            for(var i=0;i<len;i++){


                r +=10;
                g +=30;
                b +=2;

                //context.fillStyle = 'rgba('+ r+','+ g+','+ b+', 0.3)';
                context.beginPath();
                for(var j=0;j<faces[i].length;j++){

                    var P = project(faces[i][j], camara);

                        //console.log('rendering: ', (P.x+dx).toFixed(2), (P.y+dy).toFixed(2), 'faces: ', faces[i][j]);
                        context.lineTo(P.x+dx, P.y+dy);



                }
                context.stroke();
                context.closePath();
                context.fill();



            }


            rendering = false;
            console.log(rendering);


        }



        function convertToMesh(modelo){
            var faces = new Array();

            for(var i=0, faces_length= modelo.faces.length; i<faces_length; i++){
                var verts = new Array();


                for(var j=0; j<modelo.faces[i].length;j++){
                    var vert = modelo.faces[i][j].split('/');
                    if(vert.length>1){
                      var v = modelo.vertices[vert[0]-1];

                      verts.push(v);
                    }else if(vert[0]!='undefined'&&vert[0]!=''){
                      var v = modelo.vertices[vert[0]-1];

                      verts.push(v);
                    }


                }

                faces.push(verts);

            }
            console.log(verts);

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
            var punto = translate(point, translation);//zoom(translate(point, translation), camara.zoom);
            var tempx = (punto[0]*viewport.pos.z)/punto[2];
            var tempy = (punto[1]*viewport.pos.z)/punto[2];
            var tempz = viewport.pos.z;
            var temp = [tempx, tempy, tempz];

            return new Vector(temp);


        }

        var Vertex2D = function(punto) {
            this.x = parseFloat(punto.x);//*width/viewport.width);
            this.y = parseFloat(punto.y);//*height/viewport.height);
        };

    }



    return engine;
});
