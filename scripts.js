var
  data = [
    ['Alternativa', 'Demanda favorable', 'Demanda desfavorable', 'asd'],
    ['Radio', 100, 40, 20],
    ['TV',80,20, 5  ],
    ['Prensa',90,35, 25  ]
  ],
  container = document.getElementById('example'),
  hot1;
  function isEmptyRow(instance, row) {
    var rowData = instance.countRows();
  
    for (var i = 0, ilen = rowData.length; i < ilen; i++) {
      if (rowData[i] !== null) {
        return false;
      }
    }
  
    return true;
  }
  var tabla2 = false;
  
  function defaultValueRenderer(instance, td, row, col, prop, value, cellProperties) {
    var args = arguments;
  
    if (args[5] === null && isEmptyRow(instance, row)) {
      td.style.color = '#999';
    }
    else {
      td.style.color = '';
    }
    Handsontable.renderers.TextRenderer.apply(this, args);
  }
  var hot2, container2;
  hot1 = new Handsontable(container, {
    startRows: 1,
    data: data,
    startCols: 5,
    minSpareRows: 1,
    contextMenu: true,
    cells: function (row, col, prop) {
      var cellProperties = {};
  
      cellProperties.renderer = defaultValueRenderer;
  
      return cellProperties;
    },
    beforeChange: function (changes) {
      var instance = hot1,
        ilen = changes.length,
        clen = instance.countCols(),
        rowColumnSeen = {},
        rowsToFill = {},
        i,
        c;
  
      for (i = 0; i < ilen; i++) {
        // if oldVal is empty
        if (changes[i][2] === null && changes[i][3] !== null) {
          if (isEmptyRow(instance, changes[i][0])) {
            // add this row/col combination to cache so it will not be overwritten by template
            rowColumnSeen[changes[i][0] + '/' + changes[i][1]] = true;
            rowsToFill[changes[i][0]] = true;
          }
        }
      }
      for (var r in rowsToFill) {
        if (rowsToFill.hasOwnProperty(r)) {
          for (c = 0; c < clen; c++) {
            // if it is not provided by user in this change set, take value from template
            if (!rowColumnSeen[r + '/' + c]) {
              changes.push([r, c, null]);
            }
          }
        }
      }
    }
  });
  
  hot1.loadData(data);
  
  











document.getElementById("calcular").addEventListener('click', function(){
    //codigo chicho
    let respuestaOptPes = [];
    var p = document.querySelector("#p").value;
    var q = 1 - p;
    if (p == "") {
      alert("necesita inresar el optimismo");
    }else{
      for (let r = 1; r < data.length - 1; r++) {
        var max = -99999999999999;
        var min = 999999999999999;
        var dato;
        for (let c = 1; c < data[0].length; c++) {
          dato = data[r][c];
          if (dato>max) {
            max = dato;
          }else if(dato<min){
            min = dato;
          }
        }
        respuestaOptPes.push(max * p + min * q);
      }
      var transpuesta = getTranspuesta(data);
      var datos = getDatos(transpuesta);
      var maximax = getMax(transpuesta,0);
      var maximin = getMax(transpuesta,transpuesta.length-1);
      var laplace = getLaplace(datos);
      var minimax = getMiniMax(transpuesta);
      var pesimistaOptimista = getPesimistaOptimista(respuestaOptPes);
      var respuestas = generarRespuestas(data,maximax,maximin,laplace,minimax,pesimistaOptimista);

      if(tabla2 == false){
        container2 = document.getElementById('example2');
        hot2 = new Handsontable(container2, {
        data: respuestas,
        readOnly:true
        });
        tabla2 = true;
      }else{
        hot2.loadData(JSON.parse(JSON.stringify(respuestas)));
      }

    }
    /*console.log(pesimistaOptimista);
    console.log(maximax);
    console.log(maximin);
    console.log(laplace);
    console.log(minimax);*/
});
function getMinOfArray(numArray) {
    return Math.min.apply(null, numArray);
}
function generarRespuestas(res,maximax,maximin,laplpace,minimax,pesopt){
    let respuesta = [];
    respuesta.push(['','Maximax', 'Maximin', 'Laplace', 'Minimax', 'Pesimista-Optimista']);
    for (let i = 1; i < res.length - 1; i++) {
        respuesta.push([res[i][0]]);
        if (parseInt(maximax) == i) {
            respuesta[i][1] = "X";
        }
        if (maximin == i) {
            respuesta[i][2] = "X";
        }
        if (laplpace == i) {
            respuesta[i][3] = "X";    
        }
        if (minimax == i) {
            respuesta[i][4] = "X";
        }
        if (pesopt == i) {
            respuesta[i][5] = "X"
        }
    }
    return respuesta;
}
function getPesimistaOptimista(res){
    let mayor = -99999999999;
    let indice;
    for (let i = 0; i < res.length; i++) {
        console.log(res[i])
        if (res[i] > mayor) {
            mayor = res[i];
            indice = i + 1;
        }
    }
    return indice;
}
function getTranspuesta(matriz) {
    var matrix = matriz.map(function(arr) {
        return arr.slice();
    });
    matrix.shift();
    matrix.pop();
    var t = matrix[0].map(function (col, c) {
        // For each column, iterate all rows
        return matrix.map(function (row, r) { 
            return parseFloat(matrix[r][c]); 
        }); 
    });
    t.shift();
    return t;
}
function getDatos(matriz) {
    matrix = matriz.map(function(arr) {
        return arr.slice();
    });
    var t = matrix[0].map(function (col, c) {
        // For each column, iterate all rows
        return matrix.map(function (row, r) { 
            return matrix[r][c]; 
        }); 
    });
    return t;
}
function getMax(matrix,col) {
    return matrix[col].indexOf(getMaxOfArray(matrix[col]))+1;
}
function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}
function getLaplace(datos) {
    var matrix = datos.map(function(arr) {
        let suma = arr.reduce((previous, current) => current += previous);
        let promedio = suma / arr.length;
        return promedio;
    });
    var mayorC = getMaxOfArray(matrix);
    var mayorE = matrix.indexOf(mayorC)+1;
    return mayorE;
}
var MiniMaxArray = [];
function getMiniMax(datos) {
    var t = datos.map(function(arr) {
        let mayor = getMaxOfArray(arr);
        var s = arr.map(function(E) {
            return (mayor-E);
        });
        return s;
    });
    var trans = t[0].map(function (col, c) {
        // For each column, iterate all rows
        return t.map(function (row, r) { 
            return t[r][c]; 
        }); 
    });
    var promedios = trans.map(function(arr) {
        let suma = arr.reduce((previous, current) => current += previous);
        let promedio = suma / arr.length;
        return promedio;
    });
    MiniMaxArray = t[0].map(function (col, c) {
        // For each column, iterate all rows
        var s = t.map(function (row, r) { 
            return t[r][c]; 
        }); 
        s.push(promedios[c]);
        s.unshift(data[c+1][0].slice());
        return s;
    });
    MiniMaxArray.unshift(data[0].slice());
    MiniMaxArray[0].push("Promedio");
    var menorC = getMinOfArray(promedios);
    var menorE = promedios.indexOf(menorC)+1;
    return menorE;
}