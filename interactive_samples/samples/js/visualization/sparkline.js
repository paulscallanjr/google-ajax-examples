function drawVisualization() {
  // Create and populate the data table.
  var data = new google.visualization.DataTable();
  data.addColumn("number", "Revenue");
  data.addColumn("number", "Licenses");
  data.addRows(10);
  data.setValue(0,0,435);
  data.setValue(1,0,438);
  data.setValue(2,0,512);
  data.setValue(3,0,460);
  data.setValue(4,0,491);
  data.setValue(5,0,487);
  data.setValue(6,0,552);
  data.setValue(7,0,511);
  data.setValue(8,0,505);
  data.setValue(9,0,509);
  
  data.setValue(0,1,132);
  data.setValue(1,1,131);
  data.setValue(2,1,137);
  data.setValue(3,1,142);
  data.setValue(4,1,140);
  data.setValue(5,1,139);
  data.setValue(6,1,147);
  data.setValue(7,1,146);
  data.setValue(8,1,151);
  data.setValue(9,1,149);

  // Create and draw the visualization.
  new google.visualization.ImageSparkLine(
	  document.getElementById('visualization')).draw(data, null);
}