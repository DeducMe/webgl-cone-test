var express = require('express');
var app = express();
const path = require('path');
const THREE = require("three")
var http = require('http');
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));
var server = http.createServer(app);
app.use(express.static(path.join(__dirname, './front')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, './front', 'index.html')))


function calculateCone ({height, radius, segments}){
    const N = segments
    const R = radius;
    const H = height

    const color = new THREE.Color(parseInt ( '#e0e0e0'.replace("#","0x"), 16 ) );

    const positions = new Float32Array( N * 3 * 3 );
    const normals = new Float32Array( N * 3 * 3);
    const colors = new Float32Array( N * 3 * 3 );

    const pA = new THREE.Vector3();
    const pB = new THREE.Vector3();
    const pC = new THREE.Vector3();

    const cb = new THREE.Vector3();
    const ab = new THREE.Vector3();

    let basement = []
    for (let j = 0; j < N; j++){
        const x = R * Math.cos(2 * Math.PI * j / N);
        const y = 0
        const z = R * Math.sin(2 * Math.PI * j / N);
        basement.push({x, y, z})
    }

    for ( let i = 0; i < N; i += 1 ) {
        
        // positions
        const f = basement[i]
        const s = basement[(i + 1) % N]
        const t = {x:0, y:H, z:0}

        const shiftedIndex = i * 9
        
        positions[ shiftedIndex ] = f.x;
        positions[ shiftedIndex + 1 ] = f.y;
        positions[ shiftedIndex + 2 ] = f.z;

        positions[ shiftedIndex + 3 ] = s.x;
        positions[ shiftedIndex + 4 ] = s.y;
        positions[ shiftedIndex + 5 ] = s.z;

        positions[ shiftedIndex + 6 ] = t.x;
        positions[ shiftedIndex + 7 ] = t.y;
        positions[ shiftedIndex + 8 ] = t.z;


        // // flat face normals

        pA.set( f.x, f.y, f.z );
        pB.set( s.x, s.y, s.y );
        pC.set( t.x, t.y, t.z );
        cb.subVectors( pC, pB );
        ab.subVectors( pA, pB );
        cb.cross( ab );

        cb.normalize();

        const nx = cb.x;
        const ny = cb.y;
        const nz = cb.z;

        normals[ shiftedIndex ] = nx;
        normals[ shiftedIndex + 1 ] = ny;
        normals[ shiftedIndex + 2 ] = nz;

        normals[ shiftedIndex + 3 ] = nx;
        normals[ shiftedIndex + 4 ] = ny;
        normals[ shiftedIndex + 5 ] = nz;

        normals[ shiftedIndex + 6 ] = nx;
        normals[ shiftedIndex + 7 ] = ny;
        normals[ shiftedIndex + 8 ] = nz;

        // colors


        colors[ shiftedIndex ] = color.r;
        colors[ shiftedIndex + 1 ] = color.g;
        colors[ shiftedIndex + 2 ] = color.b;

        colors[ shiftedIndex + 3 ] = color.r;
        colors[ shiftedIndex + 4 ] = color.g;
        colors[ shiftedIndex + 5 ] = color.b;

        colors[ shiftedIndex + 6 ] = color.r;
        colors[ shiftedIndex + 7 ] = color.g;
        colors[ shiftedIndex + 8 ] = color.b;
    }

    return {positions, normals, colors}
}

app.post('/post',function(req, res){
    res.send(calculateCone(req.body));
})

server.listen(process.env.PORT || 5000);


