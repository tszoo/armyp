var WEBGL = {
    App: function(){
        var light;
        var self = this;
        var request, isRender = false;
        var stats;
        var effectComposer;
        var renderPass;
        var saoPass;

        /**debug**/
        var isDebug = true;

        this.dom;
        this.scene;
        this.camera;
        this.renderer;
        this.controls;
        this.updateCallbacks = null;

        this.width;
        this.height;
        this.prevHeight;
        this.minHeight = 600;
        function resizeFunc(){
            this.width = window.innerWidth;
            this.height =  window.innerHeight;

            self.setSize( this.width , this.height );
        }

        this.setSize = function (width, height) {
            self.width = width;
            self.height = height;

            if(self.height < self.minHeight ){
                self.height = self.minHeight
            }

            if (self.camera) {
                self.camera.aspect = self.width /  self.height ;
                self.camera.updateProjectionMatrix();
            }

            if (self.renderer) {
                //self.renderer.setPixelRatio( window.devicePixelRatio ? window.devicePixelRatio : 1 );
                self.renderer.setPixelRatio( window.devicePixelRatio );
                self.renderer.setSize(self.width,  self.height );
            }

            if(effectComposer){
                effectComposer.setSize( self.width, self.height );
            }

            self.prevHeight =  self.height ;
        };


        this.init = function(_targetId){
            self.dom = document.getElementById( _targetId);
            self.setEventListener();
            self.setScene();
            self.setCamera();
            self.setLight();
            //self.postProcessing();

            resizeFunc();

            if(isDebug){
                //setHelper();
                stats = new Stats();
                this.dom.appendChild(stats.domElement);
            }
            self.play();
        };

        function setHelper(){
            var axisHelper = new THREE.AxesHelper( 250 );
            self.scene.add( axisHelper );
        }

        this.setEventListener = function(){
            window.addEventListener( 'resize',  resizeFunc);
            //document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        };

        this.setScene = function () {
            this.scene = new THREE.Scene();
            //this.scene.background = new THREE.Color( 0xaaaaaa );
            //this.renderer = new THREE.WebGLRenderer({  precision: "mediump", antialias: false, devicePixelRatio:1});
            this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias : false, devicePixelRatio: 1 } );
            //renderer.sortObjects = false;

            this.dom.appendChild( this.renderer.domElement);
        };

        this.setLight = function(){
            //light = new THREE.DirectionalLight( 0xffffff, 0.5);
            //light.position.set( 1, 2, 1 ).normalize();
            //this.scene.add(light);
            //this.scene.add( new THREE.DirectionalLight() );
            //this.scene.add( new THREE.HemisphereLight() );
        };

        this.postProcessing = function(){
            effectComposer= new THREE.EffectComposer( self.renderer );
            renderPass = new THREE.RenderPass( self.scene, self.camera );
            effectComposer.addPass( renderPass );
            saoPass = new THREE.SAOPass( self.scene, self.camera, false, true );
            saoPass.renderToScreen = true;
            effectComposer.addPass( saoPass );
            effectComposer.setSize( self.width, self.height );

            saoPass.params.output = parseInt(THREE.SAOPass.OUTPUT.Beauty);
            saoPass.params.saoBias = 0.5;
            saoPass.params.saoIntensity = 0.18;
            saoPass.params.saoScale = 1;
            saoPass.params.saoKernelRadius = 100;
            saoPass.params.saoMinResolution = 0.0001;
            saoPass.params.saoBlur = true;
            saoPass.params.saoBlurRadius = 8;
            saoPass.params.saoBlurStdDev = 4;
            saoPass.params.saoBlurDepthCutoff = 0.01;

            // Init gui
            if(isDebug){
                var gui = new dat.GUI();
                gui.add( saoPass.params, 'output', {
                    'Beauty': THREE.SAOPass.OUTPUT.Beauty,
                    'Beauty+SAO': THREE.SAOPass.OUTPUT.Default,
                    'SAO': THREE.SAOPass.OUTPUT.SAO,
                    'Depth': THREE.SAOPass.OUTPUT.Depth,
                    'Normal': THREE.SAOPass.OUTPUT.Normal
                } ).onChange( function ( value ) {
                    saoPass.params.output = parseInt( value );
                    //saoPass.params.output = value ;
                } );
                gui.add( saoPass.params, 'saoBias', 0, 1 );
                gui.add( saoPass.params, 'saoIntensity', 0, 1);
                gui.add( saoPass.params, 'saoScale', 1, 1000 );
                gui.add( saoPass.params, 'saoKernelRadius', -100, 1000 );
                gui.add( saoPass.params, 'saoMinResolution', 0.0001, 0.001);
                gui.add( saoPass.params, 'saoBlur' );
                gui.add( saoPass.params, 'saoBlurRadius', 0, 200 );
                gui.add( saoPass.params, 'saoBlurStdDev', 0.5, 150 );
                gui.add( saoPass.params, 'saoBlurDepthCutoff', 0.0, 0.1 );
            }

        };

        this.setCamera = function(){
            self.camera = new THREE.PerspectiveCamera(  120, self.width /  self.height, 1, 10000 );
            self.camera.position.z = 500;

            //control 생성
            this.controls = new THREE.OrbitControls(self.camera);
            this.controls.enabled = false;
            this.controls.rotateSpeed = 1.0;
            this.controls.zoomSpeed = 1.2;
            this.controls.panSpeed = 0.8;
            this.controls.enableZoom  = true;
            this.controls.enablePan  = true;
            this.controls.enableDamping  = true;
            this.controls.dampingFactor  = 0.3;
        };

        function animate() {
            request = requestAnimationFrame( animate );
            render();
        }


        function render(){
            if(!isRender){isRender = true;}
            if(this.controls){
                this.controls.update();
            }

            if(stats){
                stats.update();
            }

            if(self.updateCallbacks){
                self.updateCallbacks();
            }

            if(effectComposer){
                effectComposer.render();
            }else{
                self.renderer.render( self.scene, self.camera );
            }
        }

        this.play = function () {
            if(request){
                cancelAnimationFrame(request);
            }
            request = requestAnimationFrame(animate);
        };

        this.stop = function () {
            cancelAnimationFrame(request);
            isRender = false;
        };

        this.dispose = function () {
            if(!this.dom){return;}
            while (this.dom.children.length) {
                this.dom.removeChild(this.dom.firstChild);
            }

            this.stop();
            this.camera = undefined;
            this.scene = undefined;

            if(this.renderer){
                this.renderer.dispose();
                this.renderer = undefined;
            }
        };
        this.addUpdateCallback = function(callback) {
            this.updateCallbacks = callback;
        }
    }
};



var UTIL_FNC = {
    ordinalSuffix :function(i){
        var j = i % 10,
            k = i % 100;
        if (j == 1 && k != 11) {
            return i + "ST";
        }
        if (j == 2 && k != 12) {
            return i + "ND";
        }
        if (j == 3 && k != 13) {
            return i + "RD";
        }
        return i + "TH";
    },
    parseQuery:function(){
        var match,
            pl     = /\+/g,
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query  = window.location.search.substring(1);

        var urlParams = {};
        while (match = search.exec(query)){
            urlParams[decode(match[1])] = decode(match[2]);
        }
        return urlParams;
    },
    isIE : function(){
        var myNav = navigator.userAgent.toLowerCase();
        return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
    }
};
