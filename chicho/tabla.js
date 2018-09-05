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
  var res =   [];

  console.log(parseFloat("234324324423"));



  document.getElementById("calcular").addEventListener('click',function(){
    var p = document.querySelector("#p").value;
    var q = 1 - p;
    if (p == "") {
      alert("necesita inresar el optimismo");
    }else{
      res = data;
      res[0,0].push("Respuesta");
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
        res[0,r].push(max * p + min * q);
      }
      hot1.readOnly = true;
      let container2 = document.getElementById('example2');
      let hot2 = new Handsontable(container2, {
      data: res,
      readOnly:true
      });
    }
    /*console.log(data[0].length); // columnas
    console.log(data.length);    // rows
    console.log(data[0,2]);*/

  });
  var
  data = [
    ['Alternativa', 'Demanda favorable', 'Demanda desfavorable'],
    ['Construir a 6 pisos', 50000, -30000],
    ['Construir a 3 pisos',35000,-6000  ]
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

