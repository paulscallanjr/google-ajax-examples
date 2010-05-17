function drawVisualization() {
  // Create and populate the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'x');
  data.addColumn('number', 'Cats');
  data.addColumn('number', 'Blanket 1');
  data.addColumn('number', 'Blanket 2');
  data.addRow(["A", 1, 1, 0.5]);
  data.addRow(["B", 2, 0.5, 1]);
  data.addRow(["C", 4, 1, 0.5]);
  data.addRow(["D", 8, 0.5, 1]);
  data.addRow(["E", 7, 1, 0.5]);
  data.addRow(["F", 7, 0.5, 1]);
  data.addRow(["G", 8, 1, 0.5]);
  data.addRow(["H", 4, 0.5, 1]);
  data.addRow(["I", 2, 1, 0.5]);
  data.addRow(["J", 3.5, 0.5, 1]);
  data.addRow(["K", 3, 1, 0.5]);
  data.addRow(["L", 3.5, 0.5, 1]);
  data.addRow(["M", 1, 1, 0.5]);
  data.addRow(["N", 1, 0.5, 1]);
 
  // Create and draw the visualization.
  new google.visualization.LineChart(document.getElementById('visualization')).
      draw(data, {curveType: "function",
                  width: 500, height: 400,
                  vAxis: {maxValue: 10}}
          );
}
