THREE.BasicShader = {
    uniforms: {},
    vertexShader: "void main() {\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "void main() {\ngl_FragColor = vec4( 1.0, 0.0, 0.0, 0.5 );\n}"
};
THREE.BleachBypassShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        opacity: {
            type: "f",
            value: 1
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform float opacity;\nuniform sampler2D tDiffuse;\nvarying vec2 vUv;\nvoid main() {\nvec4 base = texture2D( tDiffuse, vUv );\nvec3 lumCoeff = vec3( 0.25, 0.65, 0.1 );\nfloat lum = dot( lumCoeff, base.rgb );\nvec3 blend = vec3( lum );\nfloat L = min( 1.0, max( 0.0, 10.0 * ( lum - 0.45 ) ) );\nvec3 result1 = 2.0 * base.rgb * blend;\nvec3 result2 = 1.0 - 2.0 * ( 1.0 - blend ) * ( 1.0 - base.rgb );\nvec3 newColor = mix( result1, result2, L );\nfloat A2 = opacity * base.a;\nvec3 mixRGB = A2 * newColor.rgb;\nmixRGB += ( ( 1.0 - A2 ) * base.rgb );\ngl_FragColor = vec4( mixRGB, base.a );\n}"
};
THREE.BlendShader = {
    uniforms: {
        tDiffuse1: {
            type: "t",
            value: null
        },
        tDiffuse2: {
            type: "t",
            value: null
        },
        mixRatio: {
            type: "f",
            value: 0.5
        },
        opacity: {
            type: "f",
            value: 1
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform float opacity;\nuniform float mixRatio;\nuniform sampler2D tDiffuse1;\nuniform sampler2D tDiffuse2;\nvarying vec2 vUv;\nvoid main() {\nvec4 texel1 = texture2D( tDiffuse1, vUv );\nvec4 texel2 = texture2D( tDiffuse2, vUv );\ngl_FragColor = opacity * mix( texel1, texel2, mixRatio );\n}"
};
THREE.BokehShader = {
    uniforms: {
        tColor: {
            type: "t",
            value: null
        },
        tDepth: {
            type: "t",
            value: null
        },
        focus: {
            type: "f",
            value: 1
        },
        aspect: {
            type: "f",
            value: 1
        },
        aperture: {
            type: "f",
            value: 0.025
        },
        maxblur: {
            type: "f",
            value: 1
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "varying vec2 vUv;\nuniform sampler2D tColor;\nuniform sampler2D tDepth;\nuniform float maxblur;\nuniform float aperture;\nuniform float focus;\nuniform float aspect;\nvoid main() {\nvec2 aspectcorrect = vec2( 1.0, aspect );\nvec4 depth1 = texture2D( tDepth, vUv );\nfloat factor = depth1.x - focus;\nvec2 dofblur = vec2 ( clamp( factor * aperture, -maxblur, maxblur ) );\nvec2 dofblur9 = dofblur * 0.9;\nvec2 dofblur7 = dofblur * 0.7;\nvec2 dofblur4 = dofblur * 0.4;\nvec4 col = vec4( 0.0 );\ncol += texture2D( tColor, vUv.xy );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur );\ncol += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur );\ncol += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur );\ncol += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur );\ncol += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur );\ncol += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur );\ncol += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur );\ncol += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur9 );\ncol += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur9 );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur9 );\ncol += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur9 );\ncol += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur9 );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur9 );\ncol += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur9 );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur9 );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur7 );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur7 );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur7 );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur7 );\ncol += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur7 );\ncol += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur7 );\ncol += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur7 );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur7 );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur4 );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.4,   0.0  ) * aspectcorrect ) * dofblur4 );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur4 );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur4 );\ncol += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur4 );\ncol += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur4 );\ncol += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur4 );\ncol += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur4 );\ngl_FragColor = col / 41.0;\ngl_FragColor.a = 1.0;\n}"
};
THREE.BrightnessContrastShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        brightness: {
            type: "f",
            value: 0
        },
        contrast: {
            type: "f",
            value: 0
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform sampler2D tDiffuse;\nuniform float brightness;\nuniform float contrast;\nvarying vec2 vUv;\nvoid main() {\ngl_FragColor = texture2D( tDiffuse, vUv );\ngl_FragColor.rgb += brightness;\nif (contrast > 0.0) {\ngl_FragColor.rgb = (gl_FragColor.rgb - 0.5) / (1.0 - contrast) + 0.5;\n} else {\ngl_FragColor.rgb = (gl_FragColor.rgb - 0.5) * (1.0 + contrast) + 0.5;\n}\n}"
};

THREE.ColorCorrectionShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        powRGB: {
            type: "v3",
            value: new THREE.Vector3(2,2,2)
        },
        mulRGB: {
            type: "v3",
            value: new THREE.Vector3(1,1,1)
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform sampler2D tDiffuse;\nuniform vec3 powRGB;\nuniform vec3 mulRGB;\nvarying vec2 vUv;\nvoid main() {\ngl_FragColor = texture2D( tDiffuse, vUv );\ngl_FragColor.rgb = mulRGB * pow( gl_FragColor.rgb, powRGB );\n}"
};

THREE.ColorifyShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        color: {
            type: "c",
            value: new THREE.Color(16777215)
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform vec3 color;\nuniform sampler2D tDiffuse;\nvarying vec2 vUv;\nvoid main() {\nvec4 texel = texture2D( tDiffuse, vUv );\nvec3 luma = vec3( 0.299, 0.587, 0.114 );\nfloat v = dot( texel.xyz, luma );\ngl_FragColor = vec4( v * color, texel.w );\n}"
};
THREE.ConvolutionShader = {
    defines: {
        KERNEL_SIZE_FLOAT: "25.0",
        KERNEL_SIZE_INT: "25"
    },
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        uImageIncrement: {
            type: "v2",
            value: new THREE.Vector2(0.001953125,0)
        },
        cKernel: {
            type: "fv1",
            value: []
        }
    },
    vertexShader: "uniform vec2 uImageIncrement;\nvarying vec2 vUv;\nvoid main() {\nvUv = uv - ( ( KERNEL_SIZE_FLOAT - 1.0 ) / 2.0 ) * uImageIncrement;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform float cKernel[ KERNEL_SIZE_INT ];\nuniform sampler2D tDiffuse;\nuniform vec2 uImageIncrement;\nvarying vec2 vUv;\nvoid main() {\nvec2 imageCoord = vUv;\nvec4 sum = vec4( 0.0, 0.0, 0.0, 0.0 );\nfor( int i = 0; i < KERNEL_SIZE_INT; i ++ ) {\nsum += texture2D( tDiffuse, imageCoord ) * cKernel[ i ];\nimageCoord += uImageIncrement;\n}\ngl_FragColor = sum;\n}",
    buildKernel: function(a) {
        var b, c, d, e, f = 2 * Math.ceil(3 * a) + 1;
        25 < f && (f = 25);
        e = 0.5 * (f - 1);
        c = Array(f);
        for (b = d = 0; b < f; ++b)
            c[b] = Math.exp(-((b - e) * (b - e)) / (2 * a * a)),
                d += c[b];
        for (b = 0; b < f; ++b)
            c[b] /= d;
        return c
    }
};
THREE.CopyShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        opacity: {
            type: "f",
            value: 1
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform float opacity;\nuniform sampler2D tDiffuse;\nvarying vec2 vUv;\nvoid main() {\nvec4 texel = texture2D( tDiffuse, vUv );\ngl_FragColor = opacity * texel;\n}"
};
THREE.DOFMipMapShader = {
    uniforms: {
        tColor: {
            type: "t",
            value: null
        },
        tDepth: {
            type: "t",
            value: null
        },
        focus: {
            type: "f",
            value: 1
        },
        maxblur: {
            type: "f",
            value: 1
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform float focus;\nuniform float maxblur;\nuniform sampler2D tColor;\nuniform sampler2D tDepth;\nvarying vec2 vUv;\nvoid main() {\nvec4 depth = texture2D( tDepth, vUv );\nfloat factor = depth.x - focus;\nvec4 col = texture2D( tColor, vUv, 2.0 * maxblur * abs( focus - depth.x ) );\ngl_FragColor = col;\ngl_FragColor.a = 1.0;\n}"
};
THREE.DotScreenShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        tSize: {
            type: "v2",
            value: new THREE.Vector2(256,256)
        },
        center: {
            type: "v2",
            value: new THREE.Vector2(0.5,0.5)
        },
        angle: {
            type: "f",
            value: 1.57
        },
        scale: {
            type: "f",
            value: 1
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform vec2 center;\nuniform float angle;\nuniform float scale;\nuniform vec2 tSize;\nuniform sampler2D tDiffuse;\nvarying vec2 vUv;\nfloat pattern() {\nfloat s = sin( angle ), c = cos( angle );\nvec2 tex = vUv * tSize - center;\nvec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;\nreturn ( sin( point.x ) * sin( point.y ) ) * 4.0;\n}\nvoid main() {\nvec4 color = texture2D( tDiffuse, vUv );\nfloat average = ( color.r + color.g + color.b ) / 3.0;\ngl_FragColor = vec4( vec3( average * 10.0 - 5.0 + pattern() ), color.a );\n}"
};
THREE.FilmShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        time: {
            type: "f",
            value: 0
        },
        nIntensity: {
            type: "f",
            value: 0.5
        },
        sIntensity: {
            type: "f",
            value: 0.05
        },
        sCount: {
            type: "f",
            value: 4096
        },
        grayscale: {
            type: "i",
            value: 1
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform float time;\nuniform bool grayscale;\nuniform float nIntensity;\nuniform float sIntensity;\nuniform float sCount;\nuniform sampler2D tDiffuse;\nvarying vec2 vUv;\nvoid main() {\nvec4 cTextureScreen = texture2D( tDiffuse, vUv );\nfloat x = vUv.x * vUv.y * time *  1000.0;\nx = mod( x, 13.0 ) * mod( x, 123.0 );\nfloat dx = mod( x, 0.01 );\nvec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx * 100.0, 0.0, 1.0 );\nvec2 sc = vec2( sin( vUv.y * sCount ), cos( vUv.y * sCount ) );\ncResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;\ncResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );\nif( grayscale ) {\ncResult = vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 );\n}\ngl_FragColor =  vec4( cResult, cTextureScreen.a );\n}"
};
THREE.FocusShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        screenWidth: {
            type: "f",
            value: 1024
        },
        screenHeight: {
            type: "f",
            value: 1024
        },
        sampleDistance: {
            type: "f",
            value: 0.94
        },
        waveFactor: {
            type: "f",
            value: 0.00125
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform float screenWidth;\nuniform float screenHeight;\nuniform float sampleDistance;\nuniform float waveFactor;\nuniform sampler2D tDiffuse;\nvarying vec2 vUv;\nvoid main() {\nvec4 color, org, tmp, add;\nfloat sample_dist, f;\nvec2 vin;\nvec2 uv = vUv;\nadd = color = org = texture2D( tDiffuse, uv );\nvin = ( uv - vec2( 0.5 ) ) * vec2( 1.4 );\nsample_dist = dot( vin, vin ) * 2.0;\nf = ( waveFactor * 100.0 + sample_dist ) * sampleDistance * 4.0;\nvec2 sampleSize = vec2(  1.0 / screenWidth, 1.0 / screenHeight ) * vec2( f );\nadd += tmp = texture2D( tDiffuse, uv + vec2( 0.111964, 0.993712 ) * sampleSize );\nif( tmp.b < color.b ) color = tmp;\nadd += tmp = texture2D( tDiffuse, uv + vec2( 0.846724, 0.532032 ) * sampleSize );\nif( tmp.b < color.b ) color = tmp;\nadd += tmp = texture2D( tDiffuse, uv + vec2( 0.943883, -0.330279 ) * sampleSize );\nif( tmp.b < color.b ) color = tmp;\nadd += tmp = texture2D( tDiffuse, uv + vec2( 0.330279, -0.943883 ) * sampleSize );\nif( tmp.b < color.b ) color = tmp;\nadd += tmp = texture2D( tDiffuse, uv + vec2( -0.532032, -0.846724 ) * sampleSize );\nif( tmp.b < color.b ) color = tmp;\nadd += tmp = texture2D( tDiffuse, uv + vec2( -0.993712, -0.111964 ) * sampleSize );\nif( tmp.b < color.b ) color = tmp;\nadd += tmp = texture2D( tDiffuse, uv + vec2( -0.707107, 0.707107 ) * sampleSize );\nif( tmp.b < color.b ) color = tmp;\ncolor = color * vec4( 2.0 ) - ( add / vec4( 8.0 ) );\ncolor = color + ( add / vec4( 8.0 ) - color ) * ( vec4( 1.0 ) - vec4( sample_dist * 0.5 ) );\ngl_FragColor = vec4( color.rgb * color.rgb * vec3( 0.95 ) + color.rgb, 1.0 );\n}"
};
THREE.FXAAShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        resolution: {
            type: "v2",
            value: new THREE.Vector2(1 / 1024,1 / 512)
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform sampler2D tDiffuse;\nuniform vec2 resolution;\nvarying vec2 vUv;\n#define FXAA_REDUCE_MIN   (1.0/128.0)\n#define FXAA_REDUCE_MUL   (1.0/8.0)\n#define FXAA_SPAN_MAX     8.0\nvoid main() {\nvec3 rgbNW = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( -1.0, -1.0 ) ) * resolution ).xyz;\nvec3 rgbNE = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( 1.0, -1.0 ) ) * resolution ).xyz;\nvec3 rgbSW = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( -1.0, 1.0 ) ) * resolution ).xyz;\nvec3 rgbSE = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( 1.0, 1.0 ) ) * resolution ).xyz;\nvec4 rgbaM  = texture2D( tDiffuse,  gl_FragCoord.xy  * resolution );\nvec3 rgbM  = rgbaM.xyz;\nfloat opacity  = rgbaM.w;\nvec3 luma = vec3( 0.299, 0.587, 0.114 );\nfloat lumaNW = dot( rgbNW, luma );\nfloat lumaNE = dot( rgbNE, luma );\nfloat lumaSW = dot( rgbSW, luma );\nfloat lumaSE = dot( rgbSE, luma );\nfloat lumaM  = dot( rgbM,  luma );\nfloat lumaMin = min( lumaM, min( min( lumaNW, lumaNE ), min( lumaSW, lumaSE ) ) );\nfloat lumaMax = max( lumaM, max( max( lumaNW, lumaNE) , max( lumaSW, lumaSE ) ) );\nvec2 dir;\ndir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\ndir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\nfloat dirReduce = max( ( lumaNW + lumaNE + lumaSW + lumaSE ) * ( 0.25 * FXAA_REDUCE_MUL ), FXAA_REDUCE_MIN );\nfloat rcpDirMin = 1.0 / ( min( abs( dir.x ), abs( dir.y ) ) + dirReduce );\ndir = min( vec2( FXAA_SPAN_MAX,  FXAA_SPAN_MAX),\nmax( vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\ndir * rcpDirMin)) * resolution;\nvec3 rgbA = 0.5 * (\ntexture2D( tDiffuse, gl_FragCoord.xy  * resolution + dir * ( 1.0 / 3.0 - 0.5 ) ).xyz +\ntexture2D( tDiffuse, gl_FragCoord.xy  * resolution + dir * ( 2.0 / 3.0 - 0.5 ) ).xyz );\nvec3 rgbB = rgbA * 0.5 + 0.25 * (\ntexture2D( tDiffuse, gl_FragCoord.xy  * resolution + dir * -0.5 ).xyz +\ntexture2D( tDiffuse, gl_FragCoord.xy  * resolution + dir * 0.5 ).xyz );\nfloat lumaB = dot( rgbB, luma );\nif ( ( lumaB < lumaMin ) || ( lumaB > lumaMax ) ) {\ngl_FragColor = vec4( rgbA, opacity );\n} else {\ngl_FragColor = vec4( rgbB, opacity );\n}\n}"
};
THREE.HorizontalBlurShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        h: {
            type: "f",
            value: 1 / 512
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform sampler2D tDiffuse;\nuniform float h;\nvarying vec2 vUv;\nvoid main() {\nvec4 sum = vec4( 0.0 );\nsum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;\nsum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;\nsum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;\nsum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;\nsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;\nsum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;\nsum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;\nsum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;\nsum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;\ngl_FragColor = sum;\n}"
};

THREE.HorizontalTiltShiftShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        h: {
            type: "f",
            value: 1 / 512
        },
        r: {
            type: "f",
            value: 0.35
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform sampler2D tDiffuse;\nuniform float h;\nuniform float r;\nvarying vec2 vUv;\nvoid main() {\nvec4 sum = vec4( 0.0 );\nfloat hh = h * abs( r - vUv.y );\nsum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * hh, vUv.y ) ) * 0.051;\nsum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * hh, vUv.y ) ) * 0.0918;\nsum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * hh, vUv.y ) ) * 0.12245;\nsum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * hh, vUv.y ) ) * 0.1531;\nsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;\nsum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * hh, vUv.y ) ) * 0.1531;\nsum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * hh, vUv.y ) ) * 0.12245;\nsum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * hh, vUv.y ) ) * 0.0918;\nsum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * hh, vUv.y ) ) * 0.051;\ngl_FragColor = sum;\n}"
};

THREE.HueSaturationShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        hue: {
            type: "f",
            value: 0
        },
        saturation: {
            type: "f",
            value: 0
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform sampler2D tDiffuse;\nuniform float hue;\nuniform float saturation;\nvarying vec2 vUv;\nvoid main() {\ngl_FragColor = texture2D( tDiffuse, vUv );\nfloat angle = hue * 3.14159265;\nfloat s = sin(angle), c = cos(angle);\nvec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;\nfloat len = length(gl_FragColor.rgb);\ngl_FragColor.rgb = vec3(\ndot(gl_FragColor.rgb, weights.xyz),\ndot(gl_FragColor.rgb, weights.zxy),\ndot(gl_FragColor.rgb, weights.yzx)\n);\nfloat average = (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.0;\nif (saturation > 0.0) {\ngl_FragColor.rgb += (average - gl_FragColor.rgb) * (1.0 - 1.0 / (1.001 - saturation));\n} else {\ngl_FragColor.rgb += (average - gl_FragColor.rgb) * (-saturation);\n}\n}"
};
THREE.LuminosityShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform sampler2D tDiffuse;\nvarying vec2 vUv;\nvoid main() {\nvec4 texel = texture2D( tDiffuse, vUv );\nvec3 luma = vec3( 0.299, 0.587, 0.114 );\nfloat v = dot( texel.xyz, luma );\ngl_FragColor = vec4( v, v, v, texel.w );\n}"
};
THREE.NormalMapShader = {
    uniforms: {
        heightMap: {
            type: "t",
            value: null
        },
        resolution: {
            type: "v2",
            value: new THREE.Vector2(512,512)
        },
        scale: {
            type: "v2",
            value: new THREE.Vector2(1,1)
        },
        height: {
            type: "f",
            value: 0.05
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform float height;\nuniform vec2 resolution;\nuniform sampler2D heightMap;\nvarying vec2 vUv;\nvoid main() {\nfloat val = texture2D( heightMap, vUv ).x;\nfloat valU = texture2D( heightMap, vUv + vec2( 1.0 / resolution.x, 0.0 ) ).x;\nfloat valV = texture2D( heightMap, vUv + vec2( 0.0, 1.0 / resolution.y ) ).x;\ngl_FragColor = vec4( ( 0.5 * normalize( vec3( val - valU, val - valV, height  ) ) + 0.5 ), 1.0 );\n}"
};
THREE.RGBShiftShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        amount: {
            type: "f",
            value: 0.005
        },
        angle: {
            type: "f",
            value: 0
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform sampler2D tDiffuse;\nuniform float amount;\nuniform float angle;\nvarying vec2 vUv;\nvoid main() {\nvec2 offset = amount * vec2( cos(angle), sin(angle));\nvec4 cr = texture2D(tDiffuse, vUv + offset);\nvec4 cga = texture2D(tDiffuse, vUv);\nvec4 cb = texture2D(tDiffuse, vUv - offset);\ngl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);\n}"
};
THREE.SepiaShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        amount: {
            type: "f",
            value: 1
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform float amount;\nuniform sampler2D tDiffuse;\nvarying vec2 vUv;\nvoid main() {\nvec4 color = texture2D( tDiffuse, vUv );\nvec3 c = color.rgb;\ncolor.r = dot( c, vec3( 1.0 - 0.607 * amount, 0.769 * amount, 0.189 * amount ) );\ncolor.g = dot( c, vec3( 0.349 * amount, 1.0 - 0.314 * amount, 0.168 * amount ) );\ncolor.b = dot( c, vec3( 0.272 * amount, 0.534 * amount, 1.0 - 0.869 * amount ) );\ngl_FragColor = vec4( min( vec3( 1.0 ), color.rgb ), color.a );\n}"
};

THREE.SSAOShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        tDepth: {
            type: "t",
            value: null
        },
        size: {
            type: "v2",
            value: new THREE.Vector2(512,512)
        },
        cameraNear: {
            type: "f",
            value: 1
        },
        cameraFar: {
            type: "f",
            value: 100
        },
        fogNear: {
            type: "f",
            value: 5
        },
        fogFar: {
            type: "f",
            value: 100
        },
        fogEnabled: {
            type: "i",
            value: 0
        },
        onlyAO: {
            type: "i",
            value: 0
        },
        aoClamp: {
            type: "f",
            value: 0.3
        },
        lumInfluence: {
            type: "f",
            value: 0.9
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",

    fragmentShader: "uniform float cameraNear;\nuniform float cameraFar;\nuniform float fogNear;\nuniform float fogFar;\nuniform bool fogEnabled;\nuniform bool onlyAO;\nuniform vec2 size;\nuniform float aoClamp;\nuniform float lumInfluence;\nuniform sampler2D tDiffuse;\nuniform sampler2D tDepth;\nvarying vec2 vUv;\n#define DL 2.399963229728653\n#define EULER 2.718281828459045\nfloat width = size.x;\nfloat height = size.y;\nfloat cameraFarPlusNear = cameraFar + cameraNear;\nfloat cameraFarMinusNear = cameraFar - cameraNear;\nfloat cameraCoef = 2.0 * cameraNear;\n#ifndef SAMPLES\n#define SAMPLES 8\n#endif\n#ifndef RADIUS\n#define RADIUS 5.0\n#endif\n#if !defined( FLOAT_DEPTH ) && !defined( RGBA_DEPTH )\n#define RGBA_DEPTH\n#endif\n#ifndef ONLY_AO_COLOR\n#define ONLY_AO_COLOR 1.0, 1.0, 1.0\n#endif\nconst int samples = SAMPLES;\nconst float radius = RADIUS;\nconst bool useNoise = false;\nconst float noiseAmount = 0.0003;\nconst float diffArea = 0.4;\nconst float gDisplace = 0.4;\nconst vec3 onlyAOColor = vec3( ONLY_AO_COLOR );\nfloat unpackDepth( const in vec4 rgba_depth ) {\nfloat depth = 0.0;\n#if defined( RGBA_DEPTH )\nconst vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\ndepth = dot( rgba_depth, bit_shift );\n#elif defined( FLOAT_DEPTH )\ndepth = rgba_depth.w;\n#endif\nreturn depth;\n}\nvec2 rand( const vec2 coord ) {\nvec2 noise;\nif ( useNoise ) {\nfloat nx = dot ( coord, vec2( 12.9898, 78.233 ) );\nfloat ny = dot ( coord, vec2( 12.9898, 78.233 ) * 2.0 );\nnoise = clamp( fract ( 43758.5453 * sin( vec2( nx, ny ) ) ), 0.0, 1.0 );\n} else {\nfloat ff = fract( 1.0 - coord.s * ( width / 2.0 ) );\nfloat gg = fract( coord.t * ( height / 2.0 ) );\nnoise = vec2( 0.25, 0.75 ) * vec2( ff ) + vec2( 0.75, 0.25 ) * gg;\n}\nreturn ( noise * 2.0  - 1.0 ) * noiseAmount;\n}\nfloat doFog() {\nfloat zdepth = unpackDepth( texture2D( tDepth, vUv ) );\nfloat depth = -cameraFar * cameraNear / ( zdepth * cameraFarMinusNear - cameraFar );\nreturn smoothstep( fogNear, fogFar, depth );\n}\nfloat readDepth( const in vec2 coord ) {\nreturn cameraCoef / ( cameraFarPlusNear - unpackDepth( texture2D( tDepth, coord ) ) * cameraFarMinusNear );\n}\nfloat compareDepths( const in float depth1, const in float depth2, inout int far ) {\nfloat garea = 2.0;\nfloat diff = ( depth1 - depth2 ) * 100.0;\nif ( diff < gDisplace ) {\ngarea = diffArea;\n} else {\nfar = 1;\n}\nfloat dd = diff - gDisplace;\nfloat gauss = pow( EULER, -2.0 * dd * dd / ( garea * garea ) );\nreturn gauss;\n}\nfloat calcAO( float depth, float dw, float dh ) {\nfloat dd = radius - depth * radius;\nvec2 vv = vec2( dw, dh );\nvec2 coord1 = vUv + dd * vv;\nvec2 coord2 = vUv - dd * vv;\nfloat temp1 = 0.0;\nfloat temp2 = 0.0;\nint far = 0;\ntemp1 = compareDepths( depth, readDepth( coord1 ), far );\nif ( far > 0 ) {\ntemp2 = compareDepths( readDepth( coord2 ), depth, far );\ntemp1 += ( 1.0 - temp1 ) * temp2;\n}\nreturn temp1;\n}\nvoid main() {\nvec2 noise = rand( vUv );\nfloat depth = readDepth( vUv );\nfloat tt = clamp( depth, aoClamp, 1.0 );\nfloat w = ( 1.0 / width )  / tt + ( noise.x * ( 1.0 - noise.x ) );\nfloat h = ( 1.0 / height ) / tt + ( noise.y * ( 1.0 - noise.y ) );\nfloat pw;\nfloat ph;\nfloat ao = 0.0;\nfloat dz = 1.0 / float( samples );\nfloat z = 1.0 - dz / 2.0;\nfloat l = 0.0;\nfor ( int i = 0; i <= samples; i ++ ) {\nfloat r = sqrt( 1.0 - z );\npw = cos( l ) * r;\nph = sin( l ) * r;\nao += calcAO( depth, pw * w, ph * h );\nz = z - dz;\nl = l + DL;\n}\nao /= float( samples );\nao = 1.0 - ao;\nif ( fogEnabled ) {\nao = mix( ao, 1.0, doFog() );\n}\nvec3 color = texture2D( tDiffuse, vUv ).rgb;\nvec3 lumcoeff = vec3( 0.299, 0.587, 0.114 );\nfloat lum = dot( color.rgb, lumcoeff );\nvec3 luminance = vec3( lum );\nvec3 final = vec3( color * mix( vec3( ao ), vec3( 1.0 ), luminance * lumInfluence ) );\nif ( onlyAO ) {\nfinal = onlyAOColor * vec3( mix( vec3( ao ), vec3( 1.0 ), luminance * lumInfluence ) );\n}\ngl_FragColor = vec4( final, 1.0 );\n}"
};

THREE.TriangleBlurShader = {
    uniforms: {
        texture: {
            type: "t",
            value: null
        },
        delta: {
            type: "v2",
            value: new THREE.Vector2(1,1)
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "#define ITERATIONS 10.0\nuniform sampler2D texture;\nuniform vec2 delta;\nvarying vec2 vUv;\nfloat random( vec3 scale, float seed ) {\nreturn fract( sin( dot( gl_FragCoord.xyz + seed, scale ) ) * 43758.5453 + seed );\n}\nvoid main() {\nvec4 color = vec4( 0.0 );\nfloat total = 0.0;\nfloat offset = random( vec3( 12.9898, 78.233, 151.7182 ), 0.0 );\nfor ( float t = -ITERATIONS; t <= ITERATIONS; t ++ ) {\nfloat percent = ( t + offset - 0.5 ) / ITERATIONS;\nfloat weight = 1.0 - abs( percent );\ncolor += texture2D( texture, vUv + delta * percent ) * weight;\ntotal += weight;\n}\ngl_FragColor = color / total;\n}"
};
THREE.UnpackDepthRGBAShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        opacity: {
            type: "f",
            value: 1
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform float opacity;\nuniform sampler2D tDiffuse;\nvarying vec2 vUv;\nfloat unpackDepth( const in vec4 rgba_depth ) {\nconst vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\nfloat depth = dot( rgba_depth, bit_shift );\nreturn depth;\n}\nvoid main() {\nfloat depth = 1.0 - unpackDepth( texture2D( tDiffuse, vUv ) );\ngl_FragColor = opacity * vec4( vec3( depth ), 1.0 );\n}"
};
THREE.VerticalBlurShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        v: {
            type: "f",
            value: 1 / 512
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform sampler2D tDiffuse;\nuniform float v;\nvarying vec2 vUv;\nvoid main() {\nvec4 sum = vec4( 0.0 );\nsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;\nsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;\nsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;\nsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;\nsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;\nsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;\nsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;\nsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;\nsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;\ngl_FragColor = sum;\n}"
};

THREE.VerticalTiltShiftShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        v: {
            type: "f",
            value: 1 / 512
        },
        r: {
            type: "f",
            value: 0.35
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform sampler2D tDiffuse;\nuniform float v;\nuniform float r;\nvarying vec2 vUv;\nvoid main() {\nvec4 sum = vec4( 0.0 );\nfloat vv = v * abs( r - vUv.y );\nsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * vv ) ) * 0.051;\nsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * vv ) ) * 0.0918;\nsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * vv ) ) * 0.12245;\nsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * vv ) ) * 0.1531;\nsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;\nsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * vv ) ) * 0.1531;\nsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * vv ) ) * 0.12245;\nsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * vv ) ) * 0.0918;\nsum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * vv ) ) * 0.051;\ngl_FragColor = sum;\n}"
};

THREE.VignetteShader = {
    uniforms: {
        tDiffuse: {
            type: "t",
            value: null
        },
        offset: {
            type: "f",
            value: 1
        },
        darkness: {
            type: "f",
            value: 1
        }
    },
    vertexShader: "varying vec2 vUv;\nvoid main() {\nvUv = uv;\ngl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}",
    fragmentShader: "uniform float offset;\nuniform float darkness;\nuniform sampler2D tDiffuse;\nvarying vec2 vUv;\nvoid main() {\nvec4 texel = texture2D( tDiffuse, vUv );\nvec2 uv = ( vUv - vec2( 0.5 ) ) * vec2( offset );\ngl_FragColor = vec4( mix( texel.rgb, vec3( 1.0 - darkness ), dot( uv, uv ) ), texel.a );\n}"
};