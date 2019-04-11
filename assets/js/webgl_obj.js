//(function () {
//    "use strict";
//    var defaultLogFunction = console.log;
//    console.log = function () {
//        defaultLogFunction.apply(console, arguments);
//        var args = Array.prototype.slice.call(arguments);
//        var textArea;
//        if (document.getElementById('log')) {
//            textArea = document.getElementById("log");
//        } else {
//            textArea = document.createElement("textarea");
//            textArea.id = 'log';
//            var sheet = document.createElement('style')
//            sheet.innerHTML = '#log{position:fixed;top:0px;right:0px;width:80%; height:100px;z-index:99999999}';
//            document.body.appendChild(sheet);
//        }
//        /*  for (var i = 0; i < args.length; i++) {
//         if (textArea.scrollHeight > 10000) {
//         textArea.value = args[i] + '\n';
//         } else {
//         textArea.value += args[i] + '\n';
//         }
//         }*/
//        var str = JSON.stringify(args);
//        textArea.value += str + '\n';
//        document.body.appendChild(textArea);
//        textArea.scrollTop = 999999999;
//    }
//    window.onerror = function (message, url, linenumber) {
//        console.log("JavaScript error: " + message + " on line " + linenumber + " for " + url);
//    };
//})();


THREE.BTSPLANESHADER = {
    uniforms: {
        alpha: { type: "f", value: 1.0},
        lockAlpha: { type: "f", value: 1.0},
        boxTexture:	{ type: "t", value: null},
        monthTexture:	{ type: "t", value: null},
        monthColor:	{ type: "c", value:null },
        dayTexture:	{ type: "t", value:null},
        dayColor:	{ type: "c", value: null},
        yearTexture:	{ type: "t", value: null},
        yearColor:	{ type: "c", value:null },
        lockTexture:	{ type: "t", value: null},
        shadowLAlpha:	{ type: "f", value: 0.0 },
        shadowLTexture:	{ type: "t", value:null},
        shadowRAlpha:	{ type: "f", value: 0.0},
        shadowRTexture:	{ type: "t", value: null}
    },
    vertexShader: [
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        "varying vec3 vViewPosition;",
        "void main() {",
        "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
        "vUv = uv;",
        "vNormal = normalize( normalMatrix * normal );",
        "vViewPosition = -mvPosition.xyz;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}"
    ].join( "\n" ),
    fragmentShader: [
        "uniform sampler2D boxTexture;",
        "uniform sampler2D monthTexture;",
        "uniform sampler2D dayTexture;",
        "uniform sampler2D yearTexture;",
        "uniform sampler2D lockTexture;",
        "uniform sampler2D shadowLTexture;",
        "uniform sampler2D shadowRTexture;",
        "uniform vec3 monthColor;",
        "uniform vec3 dayColor;",
        "uniform vec3 yearColor;",
        "uniform float alpha;",
        "uniform float shadowLAlpha;",
        "uniform float shadowRAlpha;",
        "uniform float lockAlpha;",
        "uniform float lockOpenAlpha;",
        "varying vec2 vUv;",
        "varying vec3 vNormal;",
        "varying vec3 vViewPosition;",
        "void main() {",
        "vec4 txBox = texture2D( boxTexture, vUv )* vec4(1.0,1.0,1.0, alpha);",
        "vec4 txMonth =  texture2D( monthTexture, vUv ) * vec4(monthColor, lockAlpha);",
        "vec4 txDay = texture2D( dayTexture, vUv ) * vec4(dayColor, lockAlpha);",
        "vec4 txYear = texture2D( yearTexture, vUv ) * vec4(yearColor, lockAlpha);",
        "vec4 txLock = texture2D( lockTexture, vUv )* vec4(1.0,1.0,1.0, lockAlpha);",
        "vec4 txShadowL = texture2D( shadowLTexture, vUv ) * vec4(1.0,1.0,1.0, shadowLAlpha);",
        "vec4 txShadowR = texture2D( shadowRTexture, vUv ) * vec4(1.0,1.0,1.0, shadowRAlpha);",
        "vec4 mixCol;",
        "mixCol = mix(txBox ,txBox, txBox.a);",
        "if(lockOpenAlpha < 0.5){",
        "mixCol = mix(mixCol , txLock, txLock.a);",
        "}",
        "mixCol = mix(mixCol , txMonth, txMonth.a);",
        "mixCol = mix(mixCol , txDay, txDay.a);",
        "mixCol = mix(mixCol , txYear, txYear.a);",
        "mixCol = mix(mixCol , txShadowL, txShadowL.a);",
        "mixCol = mix(mixCol , txShadowR, txShadowR.a);",
        "if(lockOpenAlpha > 0.5){",
        "mixCol = mix(mixCol , txLock, txLock.a);",
        "}",
        "gl_FragColor = mixCol ;",
        "}"
    ].join( "\n" )
};

var MainSlot = (function(){
    var MAX_COUNT = 2080;
    var CIRCLE_COUNT =80;
    var isDebug = false;
    var objs = [];
    var posArr = { track:[]};
    var slotData;
    var objGroup;
    var currentIdx = 0;
    var beforeIdx = -1;
    var circleDeg = 360;
    var oneRad = ( circleDeg / CIRCLE_COUNT);
    var param = {
        cameraFov : 50,
        cameraY : 8,
        cameraZ : 53,
        cameraRotationX:-14.5,
        slotY :2.5,
        slotZ :0,
        cameraLookY : 0,
        cameraLookZ : 0,
        slotRotate : 0,
        camera_control: false
    };
    var loopLen;
    var gui;
    var isShadowCast = false;
    var tweenSpeed = 0.3;
    var imgPath = 'https://img.armypedia.net/assets'+ '/img/texture/';
    var textureMap= ['box.png','box_open.png','box_unlock.png',   'lock_lock.png',    'lock_open.png',    'lock_unlock.png', 'box_shadow_l.png','box_shadow_r.png',
        'day_01.png',    'day_02.png',    'day_03.png',    'day_04.png',    'day_05.png',    'day_06.png',    'day_07.png',    'day_08.png',    'day_09.png',    'day_10.png',
        'day_11.png',    'day_12.png',    'day_13.png',    'day_14.png',    'day_15.png',    'day_16.png',    'day_17.png',    'day_18.png',    'day_19.png',    'day_20.png',
        'day_21.png',    'day_22.png',    'day_23.png',    'day_24.png',    'day_25.png',    'day_26.png',    'day_27.png',    'day_28.png',    'day_29.png',    'day_30.png',    'day_31.png',
        'month_01.png',    'month_02.png',    'month_03.png',    'month_04.png',    'month_05.png',    'month_06.png',    'month_07.png',    'month_08.png',    'month_09.png',    'month_10.png',    'month_11.png',    'month_12.png',
        'year_2013.png',    'year_2014.png',    'year_2015.png',    'year_2016.png',    'year_2017.png',    'year_2018.png',    'year_2019.png'
    ];
    var textureObj = {};
    var eraArr = [0, 685, 1215,1558];
    var yearArr = ['2013','2014','2015','2016','2017','2018','2019'];
    var monthNames = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
    var currentWeek;
    var sliderWidth;
    var sliderDrag;
    var $loading = $('.loading');
    var $ui = $('.main_wrap .ui');
    var $slotDate = $('.slot_date');
    var $gnb = $('#GNB');
    var isTweenStart = false;
    var isIntroEnd = false;
    var queryString;
    var checkQueryStringResult;

    var isInMotion = true;
    var isInMotionEnd = false;


    /**first**/
    var WEBGLAPP = new WEBGL.App();
    WEBGLAPP.init('webgl_container');
    $loading.addClass('on');

    $.getJSON( 'assets/js/day.json', {
        _: new Date().getTime(),
        format: "json"
    }).done(function( data ) {
        //console.log('getslot data', data);
        if(data.code == 200){
            slotData = data.arr;
            currentWeek = data.week;
            setSelectBoxDate();
            textureLoad();
        }else{
            if(data.code == 500){
                location.href = '/';
            }else{
                alert('error' + data.code + '\r\n' + data.msg);
                $loading.removeClass('on');
            }
        }
    });
    function customParam(){
        if(isDebug) {
            gui = new dat.GUI();
            gui.add(param, 'cameraFov', 1, 300, 0.5).onChange(changeUpdate).name('cameraFov');
            gui.add(param, 'cameraY', -100, 100, 0.5).onChange(changeUpdate).name('cameraY');
            gui.add(param, 'cameraZ', -100, 100, 0.5).onChange(changeUpdate).name('cameraZ');
            gui.add(param, 'cameraRotationX', -100, 100, 0.5).onChange(changeUpdate).name('cameraRotationX');
            gui.add(param, 'slotY', -100, 100, 0.5).onChange(changeUpdate).name('slotY');
            gui.add(param, 'slotZ', -100, 100, 0.5).onChange(changeUpdate).name('slotZ');
            gui.add(param, 'cameraLookY', -1000, 1000, 0.5).onChange(changeUpdate).name('cameraLookY');
            gui.add(param, 'cameraLookZ', -1000, 1000, 0.5).onChange(changeUpdate).name('cameraLookZ');
            gui.add(param, 'slotRotate', -1000, 1000, 0.5).onChange(changeUpdate).name('slotRotate');
            gui.add(param, 'camera_control', param.camera_control).onChange(changeUpdate).name('camera_control');
        }
        changeUpdate();
    };

    function changeUpdate(){
        WEBGLAPP.controls.enabled = param.camera_control;
        WEBGLAPP.camera.fov = param.cameraFov;
        WEBGLAPP.camera.position.set(0, param.cameraY, param.cameraZ);
        WEBGLAPP.camera.rotation.set(THREE.Math.degToRad(param.cameraRotationX), 0, 0);
        //WEBGLAPP.camera.lookAt(new THREE.Vector3(0,param.cameraLookY,param.cameraLookZ))
        WEBGLAPP.camera.updateProjectionMatrix();

        if(objGroup){
            objGroup.position.y =  param.slotY;
            objGroup.position.z =  param.slotZ;
            objGroup.rotation.x =  THREE.Math.degToRad(param.slotRotate);
        }
    }

    function textureLoad(){
        //THREE.Texture.resizeMethod = Math.floorPowerOfTwo;
        var manager = new THREE.LoadingManager();

        manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
            //console.log( 'Started loading file: ' + url + ' Loaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };

        manager.onProgress = function( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
            }
        };

        manager.onError = function( xhr ) {
            //console.error( xhr );
        };

        manager.onLoad = function ( ) {
            init();
        };

        var textureLoader = new THREE.TextureLoader(manager);
        textureLoader.crossOrigin = '';

        for(var i=0; i < textureMap.length; i++){
            (function(tl, i){
                var url =imgPath + tl;
                textureLoader.load(url, function(tex){
                    var id = textureMap[i].substring(0, textureMap[i].length - 4);
                    tex.minFilter = THREE.NearestFilter;
                    tex.magFilter = THREE.NearestFilter;
                    textureObj[id] = tex;
                });
            })(textureMap[i], i);
        }
    }

    function _mergeMeshes(meshes, toBufferGeometry) {
        var finalGeometry,
            materials = [],
            mergedGeometry = new THREE.Geometry(),
            mergedMesh;

        meshes.forEach(function(mesh, index) {
            mesh.updateMatrix();
            mesh.geometry.faces.forEach(function(face) {face.materialIndex = 0;});
            mergedGeometry.merge(mesh.geometry, mesh.matrix, index);
            materials.push(mesh.material);
        });

        if (toBufferGeometry) {
            finalGeometry = new THREE.BufferGeometry().fromGeometry(mergedGeometry);
        } else {
            finalGeometry = mergedGeometry;
        }

        mergedMesh = new THREE.Mesh(finalGeometry, materials);
        return mergedMesh;
    }


    function getTargetYmdByCode(code) {
        return slotData.filter(
            function(data){
                //console.log('data', data.targetYMD, code)
                return data.targetYMD == code;
            }
        );
    }


    function init(){
        console.time("init");
        $loading.removeClass('on');
        queryString = UTIL_FNC.parseQuery();
        checkQueryStringResult = getTargetYmdByCode(queryString.date);
        if(checkQueryStringResult.length){
            if(checkQueryStringResult[0].open == 'Y'){
                currentIdx = checkQueryStringResult[0].puzzleNum -1;
            }
        }else{
            currentIdx = eraArr[currentWeek - 1];
        }



        makePosTrackShape();
        customParam();
        setSliderInit();

        objGroup = new THREE.Object3D();

        var boxGeometry = new THREE.PlaneBufferGeometry(3.5, 4.6, .2 );


        for ( var i = 0; i < MAX_COUNT; i ++ ) {
            var year = slotData[i].targetYMD.toString().slice(0,4);
            var month = slotData[i].targetYMD.toString().slice(4,6);
            var day = slotData[i].targetYMD.toString().slice(6,8);

            var customUniforms = {
                alpha: { type: "f", value: 1.0},
                lockAlpha: { type: "f", value: 1.0},
                lockOpenAlpha: { type: "f", value: 1.0},
                boxTexture:	{ type: "t", value: textureObj['box'] },
                monthTexture:	{ type: "t", value: textureObj['month_'+month]},
                monthColor:	{ type: "c", value: new THREE.Color( 0xffffff) },
                dayTexture:	{ type: "t", value: textureObj['day_'+day]},
                dayColor:	{ type: "c", value: new THREE.Color( 0xffffff) },
                yearTexture:	{ type: "t", value: textureObj['year_'+year]},
                yearColor:	{ type: "c", value: new THREE.Color( 0xffffff ) },
                lockTexture:	{ type: "t", value: textureObj['lock_lock']},
                shadowLAlpha:	{ type: "f", value: 0.0 },
                shadowLTexture:	{ type: "t", value: textureObj['box_shadow_l']},
                shadowRAlpha:	{ type: "f", value: 0.0},
                shadowRTexture:	{ type: "t", value: textureObj['box_shadow_r']}
            };

            if(slotData[i].open == 'Y'){
                customUniforms.boxTexture.value = textureObj['box_open'];
                customUniforms.lockTexture.value = textureObj['lock_open'];
                customUniforms.yearColor.value = new THREE.Color( 0x370367 ) ;
            }else if(slotData[i].open == 'R'){
                customUniforms.boxTexture.value = textureObj['box_unlock'];
                customUniforms.lockTexture.value = textureObj['lock_unlock'];
                customUniforms.yearColor.value = new THREE.Color( 0x471880 ) ;
            }else{
                customUniforms.dayColor.value = new THREE.Color( 0x787878 ) ;
                customUniforms.monthColor.value = new THREE.Color( 0x787878 ) ;
                customUniforms.yearColor.value = new THREE.Color( 0x787878 ) ;
                //customUniforms.lockTexture.value = textureObj['lock_lock'];
            }

            var btsShader = THREE.BTSPLANESHADER;
            var customMaterial = new THREE.ShaderMaterial({
                transparent: true,
                uniforms: customUniforms,
                vertexShader:   btsShader.vertexShader,
                fragmentShader: btsShader.fragmentShader
            });

            var object = new THREE.Mesh( boxGeometry,  customMaterial  );
            object.name =  slotData[i].puzzleNum;
            object.isOpen =  slotData[i].open;
            object.targetNum = i;
            object.targetDay = slotData[i].targetYMD;
            object.castShadow = isShadowCast;
            object.receiveShadow = isShadowCast;



            var setPos = {x:posArr.track[i].position.x, y:posArr.track[i].position.y, z:posArr.track[i].position.z};
            if(i == currentIdx){
                setPos.x = 0, setPos.y = 0, setPos.z = 100*((currentWeek-1)%2 == 0?1:-1);
            }

            object.position.x = setPos.x;//posArr.track[i].position.x;
            object.position.y = setPos.y;//posArr.track[i].position.y;
            object.position.z = setPos.z;//posArr.track[i].position.z;

            object.defaultRotation = {};
            object.rotation.x = object.defaultRotation.x = posArr.track[i].rotation.x;
            object.rotation.y = object.defaultRotation.y = posArr.track[i].rotation.y;
            object.rotation.z = object.defaultRotation.z = posArr.track[i].rotation.z;

            var defaultPosition = posArr.track[i].defaultPosition;
            var delay = 0;
            if(i < 40) delay = (40-i)*0.01;
            if(i > MAX_COUNT-40)delay = (MAX_COUNT-i)*0.01;

            if(i == currentIdx) delay = 1.1;
            if(!isInMotion) delay = 0;


            TweenMax.to(object.position, (!isInMotion)?0:2, {delay:delay,x:defaultPosition.x, y:defaultPosition.y, z:defaultPosition.z, ease:Cubic.easeOut});

            objGroup.add(object);
            objs.push(object);
        }

        objGroup.position.y =  param.slotY;
        objGroup.rotation.x =  THREE.Math.degToRad(param.slotRotate);

        WEBGLAPP.scene.add( objGroup);

        //setInitPos(posArr.track , 0);

        WEBGLAPP.addUpdateCallback(renderFunction);

        if(isDebug){
            //addHelper();
        }

        resetPos(0);

        console.timeEnd("init");

        setIntroMotion();
    }

    function getSpriteTexture(_texture, _horiz, _vert, _offsetY){
        var texture = _texture.clone();

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1/_horiz, 1/_vert );

        var currentRow = Math.floor( _offsetY/_horiz );
        texture.offset.y = currentRow/_vert;
        texture.needsUpdate = true;

        return texture;
    }


    function addEventListener(){
        window.addEventListener('mousewheel', mouseWheelHandler);
        window.addEventListener('DOMMouseScroll', mouseWheelHandler);

        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        document.addEventListener( 'mousedown', onDocumentMouseDown, false );
        document.addEventListener( 'mouseup', onDocumentMouseUp, false );
        WEBGLAPP.dom.addEventListener( 'click', onDocumentClick, false );

        WEBGLAPP.dom.addEventListener( 'touchmove', onDocumentMouseMove, false );
        WEBGLAPP.dom.addEventListener( 'touchstart', onDocumentMouseDown, false );
        WEBGLAPP.dom.addEventListener( 'touchend', onDocumentMouseUp, false );
    }


    function removeEventListener(){
        window.removeEventListener('mousewheel', mouseWheelHandler);
        window.removeEventListener('DOMMouseScroll', mouseWheelHandler);

        document.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        document.removeEventListener( 'mousedown', onDocumentMouseDown, false );
        document.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        WEBGLAPP.dom.removeEventListener( 'click', onDocumentClick, false );

        WEBGLAPP.dom.removeEventListener( 'touchmove', onDocumentMouseMove, false );
        WEBGLAPP.dom.removeEventListener( 'touchstart', onDocumentMouseDown, false );
        WEBGLAPP.dom.removeEventListener( 'touchend', onDocumentMouseUp, false );
        WEBGLAPP.dom.removeEventListener( 'touchcancle', onDocumentMouseUp, false );
    }

    function setSliderInit(){
        sliderWidth = $('.ui .slider').width();
        sliderDrag = Draggable.create('.slider_btn', {type:'left',  lockAxis:true, edgeResistance:1, bounds:'#slotRange',
            onDragStart: function() {
                $('.slider_btn').addClass('moving');
                sliderWidth = $('.ui .slider').width();
                var  percent = sliderWidth* (this.startX/100);
                $('.slider_btn').css('left', percent );
                this.update();
            },
            onDrag:function(){
                var currentXPercent = this.x / sliderWidth ;
                var slotIndex = Math.ceil((MAX_COUNT-1) * currentXPercent);
                gotoPosition(slotIndex);
            },
            onRelease:function(){
                var  percent = 100 * ($('.slider_bg_cover').width() /sliderWidth);
                //console.log('onRelease' , this.x, percent)
                $('.slider_btn').removeClass('moving');
                $('.slider_btn').css('left', percent + '%');
                this.update();
            },
            onDragEnd:function(){
                //console.log('onDragEnd' , this.x)
            }
        });
    }


    function renderFunction(){
        if(objs.length){
            var pLocal = new THREE.Vector3( 0, 0, 1000 );
            var LookAtTarget = pLocal.applyMatrix4( WEBGLAPP.camera.matrixWorld );
            for ( var i = 0; i < MAX_COUNT; i ++ ) {
                if(objs[i].visible){
                    objs[i].lookAt(LookAtTarget );
                }
            }
        }
    }

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var INTERSECTED = null;

    var mouseMoveMaxRange = 2;
    var mouseMoveLimit = 12;

    function raycastFnc(){
        WEBGLAPP.camera.updateMatrixWorld();
        raycaster.setFromCamera( mouse, WEBGLAPP.camera );
        var intersects = raycaster.intersectObjects(objs);
        //console.log('intersects' , intersects)
        if(intersects.length){
            if(INTERSECTED != intersects[ 0 ].object){
                INTERSECTED = intersects[ 0 ].object;
                //console.log('INTERSECTED, ', INTERSECTED, intersects);
            }
        }else{
            INTERSECTED = null;
        }
    }

    function onDocumentClick(e){
        //console.log('click INTERSECTED' ,INTERSECTED)
        raycastFnc();
        if(INTERSECTED){
            var targetIdx = INTERSECTED.targetNum;
            var isUnlock = INTERSECTED.isOpen;
            if( mouse.x == startMouseX) {
                //console.log('INTERSECTED , ', INTERSECTED, mouse.x,  targetIdx, currentIdx);
                if (targetIdx == currentIdx) {
                    if (isUnlock == 'Y') {
                        //gallery.slotLoad(INTERSECTED.targetDay);
                    }
                } else {
                    //console.log('click', currentIdx , targetIdx, beforeIdx);
                    currentIdx = targetIdx;
                    resetPos(tweenSpeed);
                }
            }
        }
    }

    function onDocumentMouseMove( e ) {
        //event.preventDefault();
        var clientX;
        var clientY;
        if( e.touches == undefined){
            clientX = e.clientX;
            clientY = e.clientY;
        }else{
            clientX = e.touches[ 0 ].clientX;
            clientY = e.touches[ 0 ].clientY;
        }
        mouse.x = ( clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( clientY / window.innerHeight ) * 2 + 1;
        if( WEBGLAPP.width >768){
            if (INTERSECTED ) {
                WEBGLAPP.dom.style.cursor = 'pointer';
            } else {
                WEBGLAPP.dom.style.cursor = 'default';
            }
        }
        if (isRayCast) {
            //event.preventDefault();
            var moveRange = (startMouseX - mouse.x) / mouseMoveMaxRange;
            var targetIdx = Math.floor(mouseMoveLimit * moveRange);
            currentIdx = startPositionIdx + targetIdx;
            if (currentIdx < 0) {
                currentIdx = MAX_COUNT - 1;
                startPositionIdx = MAX_COUNT - 1;
                startMouseX = mouse.x;
            } else if (currentIdx > MAX_COUNT - 1) {
                currentIdx = 0;
                startPositionIdx = 0;
                startMouseX = mouse.x;
            }
            resetPos(tweenSpeed);
        }
    }

    var isRayCast = false;
    var startMouseX, startPositionIdx;

    function onDocumentMouseDown(e){
        if($gnb.hasClass('active')){
            return;
        }
        var clientX = e.clientX || e.touches[ 0 ].clientX;
        var clientY = e.clientY || e.touches[ 0 ].clientY;
        mouse.x = ( clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( clientY / window.innerHeight ) * 2 + 1;
        raycastFnc();
        if(INTERSECTED){
            startMouseX = mouse.x;
            startPositionIdx = currentIdx;
            isRayCast = true;
        }
    }

    function onDocumentMouseUp(e){
        if($gnb.hasClass('active')){
            return;
        }
        //e.preventDefault();
        isRayCast = false;
        /*   if(INTERSECTED){
         var targetIdx = INTERSECTED.targetNum;
         var isUnlock = INTERSECTED.isOpen;
         if( mouse.x == startMouseX){
         //console.log('INTERSECTED , ', INTERSECTED, mouse.x,  targetIdx, currentIdx);
         if(targetIdx == currentIdx){
         if(isUnlock == 'Y'){
         //console.log('todo load page', INTERSECTED.targetDay);
         gallery.slotLoad(INTERSECTED.targetDay);
         }
         }else{
         //console.log('click', currentIdx , targetIdx, beforeIdx);
         currentIdx = targetIdx;
         resetPos(tweenSpeed);
         }
         }
         }*/
    }


    function mouseWheelHandler(event){
        if($gnb.hasClass('active') ){
            return;
        }
        //event.preventDefault();
        event.stopImmediatePropagation();
        var e = window.event || event;
        var delta  = e.wheelDelta ? e.wheelDelta : -e.detail;
        if(delta < 0){
            currentIdx++;
        }else{
            currentIdx--;
        }

        if(currentIdx < 0){
            currentIdx = MAX_COUNT-1;
        }else if(currentIdx > MAX_COUNT -1){
            currentIdx = 0;
        }
        resetPos(tweenSpeed );
        return false;
    }


    //포지션 셋팅
    function gotoPosition(_idx){
        if(currentIdx == _idx){
            return;
        }
        currentIdx = _idx;
        resetPos(tweenSpeed );
    }

    function resetPos(speed){
        if(speed == undefined){speed = 0;}
        if(currentIdx == beforeIdx){return;}
        isTweenStart = true;

        TweenMax.killTweensOf(objGroup.rotation);
        $slotDate.removeClass('on');
        var i, id = 0, maxLen = parseInt(currentIdx) + parseInt(MAX_COUNT);
        var halfCircleCount = 40;

        var rad = (currentIdx * oneRad) ;
        var limitCount = CIRCLE_COUNT;

        var lowLimit = parseInt(currentIdx)-parseInt(halfCircleCount ,10);
        var lowLimit2;
        if(lowLimit < 0){lowLimit2= MAX_COUNT + lowLimit;}
        var maxLimit = parseInt(currentIdx)+parseInt(halfCircleCount ,10);
        var maxLimit2;

        if(maxLimit >MAX_COUNT){ maxLimit2 = maxLimit - MAX_COUNT; }
        //console.log('target rad ' , rad, currentIdx ,beforeIdx ,lowLimit,maxLimit, limitCount);
        if( currentIdx - beforeIdx > limitCount ){
            var targetDeg = oneRad* MAX_COUNT;
            TweenMax.fromTo(objGroup.rotation, speed, {y: THREE.Math.degToRad(-targetDeg)}, {y: THREE.Math.degToRad( -rad)});
        }else if(beforeIdx - currentIdx > limitCount ){
            TweenMax.fromTo(objGroup.rotation, speed, {y: THREE.Math.degToRad( oneRad)}, {y: THREE.Math.degToRad( -rad)});
        }else{
            TweenMax.to(objGroup.rotation, speed, {y: THREE.Math.degToRad( -rad)});
        }

        currentIdx = parseInt(currentIdx);

        var sendData = {
            speed:speed,
            rad:rad,
            opacity:0,
            id:id,
            halfCircleCount:halfCircleCount,
            lowLimit:lowLimit,
            maxLimit:maxLimit
        };

        for (i = currentIdx; i < maxLen; i++) {
            id = i;

            if (i >= MAX_COUNT) id -= MAX_COUNT;
            var object = objs[id];
            sendData.id = id;

            if(lowLimit < 0){
                if( id > lowLimit2 || id < maxLimit){
                    //console.log('@@')
                    sendData.opacity =  (maxLimit - id) /  (halfCircleCount);
                    sendData.object = object;

                    resetOpacityPos(sendData, 0);
                }else{
                    object.visible = false;
                }
            }else if(maxLimit > MAX_COUNT){
                if( id > lowLimit || id < maxLimit2){
                    sendData.opacity =  ( id -   lowLimit ) /  (halfCircleCount );
                    sendData.object = object;

                    resetOpacityPos(sendData, 1);
                }else{
                    object.visible = false;
                }
            }else{
                if( id > lowLimit && id < maxLimit){
                    sendData.opacity =  ( (maxLimit - id) / (halfCircleCount));
                    sendData.object = object;

                    resetOpacityPos(sendData, 2);
                }else{
                    object.visible = false;
                }
            }

            if(object.visible){
                if(currentIdx == id){
                    TweenMax.to(object.scale, speed, {x:1.2, y:1.2, onComplete:resetPosEnd});
                }else{
                    TweenMax.to(object.scale, speed, {x:1, y:1});
                }
            }
        }

        var currentXPercent = currentIdx / MAX_COUNT * 100 ;
        TweenMax.set($('.slider_btn'), {left: currentXPercent + '%' });
        $('.slider_bg_cover').css('width', currentXPercent + '%');
        beforeIdx = currentIdx;
    }

    function resetOpacityPos(data, type){
        var opacitensity = 0.2;
        var opacityBoundary = 0.85;//0.85;

        var id = data.id, rad = data.rad, speed = data.speed, lowLimit = data.lowLimit, halfCircleCount = data.halfCircleCount, opacity = data.opacity, object = data.object, maxLimit = data.maxLimit;
        var zeroRotateX = 0;//THREE.Math.degToRad(-10);
        var zeroRotateY = THREE.Math.degToRad(rad)//((!isInMotionEnd)?THREE.Math.degToRad(Math.sqrt(rad)):THREE.Math.degToRad(rad));
        var zeroRotateZ = 0;

        TweenMax.killTweensOf( objs[id].material);
        TweenMax.killTweensOf( objs[id].material.uniforms.alpha);
        TweenMax.killTweensOf( objs[id].material.uniforms.lockAlpha);
        TweenMax.killTweensOf( objs[id].material.uniforms.lockOpenAlpha);
        TweenMax.killTweensOf( objs[id].material.uniforms.shadowLAlpha);
        TweenMax.killTweensOf( objs[id].material.uniforms.shadowRAlpha);


        if(!object.visible){
            TweenMax.set( objs[id].material, {opacity:  0 });
            TweenMax.set( objs[id].material.uniforms.alpha, {value: 0 });
            TweenMax.set( objs[id].material.uniforms.lockAlpha, {value: 0 });
            TweenMax.set( objs[id].material.uniforms.lockOpenAlpha, {value: 0 });
            TweenMax.set( objs[id].material.uniforms.shadowLAlpha, {value: 0 });
            TweenMax.set( objs[id].material.uniforms.shadowRAlpha, {value: 0 });

        }

        switch (type){
            case 0 :
                if(opacity < 0){
                    opacity =  (id - (MAX_COUNT + lowLimit) ) /  (halfCircleCount );
                    //objs[id].material.uniforms.shadowLAlpha.value  = 1.0;
                    //objs[id].material.uniforms.shadowRAlpha.value  = 0.0;
                    TweenMax.to( objs[id].material.uniforms.shadowLAlpha, speed, {value: 1.0 });
                    TweenMax.to( objs[id].material.uniforms.shadowRAlpha, speed, {value: 0.0 });
                }else if(opacity > 1){
                    //objs[id].material.uniforms.shadowLAlpha.value  = 1.0;
                    //objs[id].material.uniforms.shadowRAlpha.value  = 0.0;
                    TweenMax.to( objs[id].material.uniforms.shadowLAlpha, speed, {value: 1.0 });
                    TweenMax.to( objs[id].material.uniforms.shadowRAlpha, speed, {value: 0.0 });
                    opacity =   (maxLimit - (currentIdx + (currentIdx - id))) /  (halfCircleCount );
                }else{
                    //objs[id].material.uniforms.shadowLAlpha.value  = 0.0;
                    //objs[id].material.uniforms.shadowRAlpha.value  = 1.0;
                    TweenMax.to( objs[id].material.uniforms.shadowLAlpha, speed, {value: 0.0 });
                    TweenMax.to( objs[id].material.uniforms.shadowRAlpha, speed, {value: 1.0 });
                }
                break;
            case 1 :
                if(opacity < 0 ){
                    opacity = ( (maxLimit - id ) - (MAX_COUNT )) / (halfCircleCount );
                    //objs[id].material.uniforms.shadowLAlpha.value  = 0.0;
                    //objs[id].material.uniforms.shadowRAlpha.value  = 1.0;
                    TweenMax.to( objs[id].material.uniforms.shadowLAlpha, speed, {value: 0.0 });
                    TweenMax.to( objs[id].material.uniforms.shadowRAlpha, speed, {value: 1.0 });
                }else if(opacity > 1){
                    opacity =  ( currentIdx - ( id - currentIdx) -  lowLimit ) /  (halfCircleCount);
                    //objs[id].material.uniforms.shadowLAlpha.value  = 0.0;
                    //objs[id].material.uniforms.shadowRAlpha.value  = 1.0;
                    TweenMax.to( objs[id].material.uniforms.shadowLAlpha, speed, {value: 0.0 });
                    TweenMax.to( objs[id].material.uniforms.shadowRAlpha, speed, {value: 1.0 });
                }else{
                    //objs[id].material.uniforms.shadowLAlpha.value  = 1.0;
                    //objs[id].material.uniforms.shadowRAlpha.value  = 0.0;
                    TweenMax.to( objs[id].material.uniforms.shadowLAlpha, speed, {value: 1.0 });
                    TweenMax.to( objs[id].material.uniforms.shadowRAlpha, speed, {value: 0.0 });
                }
                break;
            case 2 :
                if(opacity > 1){
                    opacity = 2- opacity;
                    //objs[id].material.uniforms.shadowLAlpha.value  = 1.0;
                    //objs[id].material.uniforms.shadowRAlpha.value  = 0.0;
                    TweenMax.to( objs[id].material.uniforms.shadowLAlpha, speed, {value: 1.0 });
                    TweenMax.to( objs[id].material.uniforms.shadowRAlpha, speed, {value: 0.0 });
                }else{
                    //objs[id].material.uniforms.shadowLAlpha.value  = 0.0;
                    //objs[id].material.uniforms.shadowRAlpha.value  = 1.0;
                    TweenMax.to( objs[id].material.uniforms.shadowLAlpha, speed, {value: 0.0 });
                    TweenMax.to( objs[id].material.uniforms.shadowRAlpha, speed, {value: 1.0 });
                }
                break;
        }

        if(opacity < opacityBoundary){
            TweenMax.to( objs[id].material.uniforms.alpha, speed, {value: opacity - opacitensity});
            TweenMax.to( objs[id].material.uniforms.lockAlpha, speed, {value: 0});
            TweenMax.to( objs[id].material.uniforms.lockOpenAlpha, speed, {value: 0});
        }else{
            TweenMax.to( objs[id].material.uniforms.alpha, speed, {value: opacity });
            TweenMax.to( objs[id].material.uniforms.lockAlpha, speed, {value: opacity});
            //TweenMax.to( objs[id].material.uniforms.lockOpenAlpha, speed, {value: 1});
            if( objs[id].isOpen == 'Y'){
                TweenMax.to( objs[id].material.uniforms.lockOpenAlpha, speed, {value: 0.4});
            }else{
                TweenMax.to( objs[id].material.uniforms.lockOpenAlpha, speed, {value: 1});
            }
        }

        if(!isInMotionEnd){
            TweenMax.to(objs[id].rotation, (!isInMotion)?0:2, {x:zeroRotateX, y:zeroRotateY, z:zeroRotateZ, onComplete:function(){ isInMotionEnd = true; }});
        }else{
            objs[id].rotation.x = zeroRotateX;
            objs[id].rotation.y = zeroRotateY;
            objs[id].rotation.z = zeroRotateZ;
        }


        if(currentIdx == id) {
            TweenMax.to( objs[id].material.uniforms.alpha, speed, {value: opacity });
            TweenMax.to( objs[id].material.uniforms.shadowLAlpha, speed, {value: 0.0 });
            TweenMax.to( objs[id].material.uniforms.shadowRAlpha, speed, {value: 0.0 });
        }

        object.visible = true;
    }


    function resetPosEnd(){
        var year = objs[currentIdx].targetDay.toString().slice(0,4);
        var month = objs[currentIdx].targetDay.toString().slice(4,6) * 1;
        var day = UTIL_FNC.ordinalSuffix(parseInt(objs[currentIdx].targetDay.toString().slice(6,8)));
        $slotDate.html(monthNames[month-1] +' '+ day + ' ' + year);
        if(isIntroEnd){
            $slotDate.addClass('on');
        }

        isTweenStart = false;
    }


    //배열에 트랙 포지션 셋팅
    function makePosTrackShape(){
        var r = 32;
        var trackShape = new THREE.Shape();
        trackShape.moveTo( 0, 0);

        loopLen = Math.round(MAX_COUNT / CIRCLE_COUNT );

        for(var i =0; i < loopLen ;i++){
            trackShape.absellipse ( 0, 0, r, r, THREE.Math.degToRad( 90), THREE.Math.degToRad( -270), true);
        }

        trackShape.autoClose  = true;
        var spacedPoints = trackShape.getSpacedPoints( MAX_COUNT );
        var rad = (currentIdx * oneRad) ;

        for ( var i = 0, l = MAX_COUNT; i < l; i ++ ) {
            var object = new THREE.Object3D();
            object.position.x = Math.random()* 500-250;//spacedPoints[i].x;
            object.position.y = Math.random()* 500-250;//0;
            object.position.z = Math.random()* 500-250;//spacedPoints[i].y;
            object.defaultPosition = {x:spacedPoints[i].x, y:0, z:spacedPoints[i].y};
            object.rotation.y =  THREE.Math.degToRad(rad)+Math.random()*Math.PI*4;//THREE.Math.degToRad( 0);
            object.rotation.x =  Math.random()*Math.PI*4;//0;
            object.rotation.z =  Math.random()*Math.PI*4;//0;
            object.defaultRotation = {x:THREE.Math.degToRad( 0), y:0, z:0};

            posArr.track.push(object);
        }
    }

    function setInitPos(_target, _duration){
        var target = _target;
        for ( var i = 0; i <MAX_COUNT; i ++ ) {
            var object = objs[i];
            var pos =  target[i].position;
            var rot =  target[i].rotation;
            TweenMax.to(object.position, _duration, {x:pos.x, y:pos.y, z:pos.z});
            TweenMax.to(object.rotation, _duration, {x:rot.x, y:rot.y,z:rot.z});
        }
    }

    function setIntroMotion(){
        var rad = (currentIdx * oneRad);
        //console.log('rad', rad)
        var beforeRad = rad - 90;
        var speed = (!isInMotion)?0:3; //3
        TweenMax.fromTo(WEBGLAPP.camera.position, speed, {y:20 ,z:20}, {y:param.cameraY ,z:param.cameraZ,ease:Power3.easeInOut});
        TweenMax.fromTo(objGroup.rotation, speed, {y:THREE.Math.degToRad(-beforeRad)}, {y:THREE.Math.degToRad(-rad),ease:Power3.easeInOut, onComplete:function(){
            setIntroEnd();
        }});
    }

    function setIntroEnd(){
        addEventListener();
        isIntroEnd = true;

        $slotDate.addClass('on');
        $ui.addClass('on');

        if(checkQueryStringResult.length){
            //console.log('queryString' , queryString, checkQueryStringResult[0]);
            if(checkQueryStringResult[0].open == 'Y'){
                if(queryString.seq != undefined){
                    gallery.slotLoad(queryString.date, queryString.seq);
                }else{
                    gallery.slotLoad(queryString.date);
                }
                history.replaceState({}, null, location.pathname);
            }
        }
    }


    /******** 날짜 찾기 ********/
    function setSelectBoxDate(){
        var yearHtml ='';
        for (var i =2013; i < 2020; i++){
            yearHtml += '<option value="'+i+'">'+i+'</option>';
        }
        $('#years').html(yearHtml );

        var mothHtml ='';
        for (var j = 1; j < 13; j++){
            var val = j;
            if(j < 10){
                val = "0"+j;
            }
            mothHtml += '<option value="'+val+'">'+ monthNames[j -1] +'</option>';
        }
        $('#months').html(mothHtml);

        updateNumberOfDays();
        $('#months').on('change', function(){
            updateNumberOfDays();
        });

        $('.btn_go a').on('click', function(e){
            e.preventDefault();
            var targetDay = $('#years').val() +''+  $('#months').val() +''+ $('#days').val()+'';
            var dayIdx = findObject(targetDay);
            if(dayIdx > -1){
                gotoPosition(dayIdx);
            }else{
                alert(ALERT_STR.no_day[currentLang]);
            }

        })
    }

    function findObject(val){
        for(var i = 0; i <  slotData.length; i++){
            if(slotData[i].targetYMD == val){
                return slotData[i].puzzleNum -1;
            }
        }
    }

    function updateNumberOfDays(){
        var month=$('#months').val();
        var year =$('#years').val();
        var days =daysInMonth(month, year);
        var dayHtml = '';
        for(var i=1; i < days+1 ; i++){
            var val = i;
            if(i < 10){
                val = "0"+i;
            }
            dayHtml += '<option value="'+val+'">'+ UTIL_FNC.ordinalSuffix(i) +'</option>';
        }
        $('#days').html(dayHtml);
    }

    function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    return{
        play: function(){
            WEBGLAPP.play();
            addEventListener();
        },
        stop: function(){
            WEBGLAPP.stop();
            removeEventListener();
        }
    }
})();



