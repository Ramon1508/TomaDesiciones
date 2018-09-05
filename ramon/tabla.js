/*var data = [
  ["", "Ford", "Tesla", "Toyota", "Honda"],
  ["2017", 10, 11, 12, 13],
  ["2018", 20, 11, 14, 13],
  ["2019", 30, 15, 12, 13]
];
var container = document.getElementById('example');
var hot = new Handsontable(container, {
  data: data,
  rowHeaders: true,
  colHeaders: true,
  filters: true,
  dropdownMenu: true
});*/


/*var data;
document.addEventListener("DOMContentLoaded", function() {
    data = [
      ['', 'Tesla', 'Nissan', 'Toyota', 'Honda', 'Mazda', 'Ford'],
      ['2017', 10, 11, 12, 13, 15, 16],
      ['2018', 10, 11, 12, 13, 15, 16],
      ['2019', 10, 11, 12, 13, 15, 16],
      ['2020', 10, 11, 12, 13, 15, 16],
      ['2021', 10, 11, 12, 13, 15, 16]
    ];
    var container = document.getElementById('example');
    var removeFirstRow = document.getElementById('removeFirstRow');
    var addRow = document.getElementById('addRow');
    var hot = new Handsontable(container, {
      rowHeaders: true,
      colHeaders: true,
      data: JSON.parse(JSON.stringify(data))
    });
  
  
    Handsontable.dom.addEvent(removeFirstRow, 'click', function () {
      data.pop();
      hot.loadData(JSON.parse(JSON.stringify(data)));
    });
  
  
    Handsontable.dom.addEvent(addRow, 'click', function () {
      data.push(['']);
      hot.loadData(JSON.parse(JSON.stringify(data)));
    }); 

  });*/
    var data = [
        ['', 'Tesla', 'Nissan', 'Toyota', 'Honda'],
        ['2017', 10, 11, 12, 13],
        ['2018', 20, 11, 14, 13],
        ['2019', 30, 15, 12, 13]
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

    hot1 = new Handsontable(container, {
        startRows: 1,
        data: data,
        rowHeaders: true,
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
    document.getElementById("consola").addEventListener('click', function(){
        var transpuesta = getTranspuesta(data);
        var datos = getDatos(transpuesta);
        var maximax = getMax(transpuesta,0);
        var maximin = getMax(transpuesta,transpuesta.length-1);
        var laplace = getLaplace(datos);
        var minimax = getMiniMax(transpuesta);
        console.log(maximax);
        console.log(maximin);
        console.log(laplace);
        console.log(minimax);
    });
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
            s.unshift(data[c+1][0]);
            return s;
        });
        MiniMaxArray.unshift(data[0]);
        MiniMaxArray[0].push("Promedio");
        console.log(MiniMaxArray);
        var mayorC = getMaxOfArray(promedios);
        var mayorE = matrix.indexOf(mayorC)+1;
    }