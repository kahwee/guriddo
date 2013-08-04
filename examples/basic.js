var grid;
var columns = [{
	id: "title",
	name: "Title",
	field: "title",
	width: 300,
}, {
	id: "duration",
	name: "Duration",
	field: "duration",
	width: 100
}, {
	id: "%",
	name: "% Complete",
	field: "percentComplete"
}, {
	id: "start",
	name: "Start",
	field: "start"
}, {
	id: "finish",
	name: "Finish",
	field: "finish"
}, {
	id: "finish",
	name: "Finish 2",
	field: "finish2"
}, {
	id: "finish",
	name: "Finish",
	field: "finish"
}, {
	id: "binary",
	name: "Binary",
	field: "binary",
	formatLibrary: 'guriddo',
	format: 'YesNo'
}, {
	id: "finish",
	name: "Finish",
	field: "finish"
}, {
	id: "finish",
	name: "Finish",
	field: "finish"
}, {
	id: "finish",
	name: "Finish",
	field: "finish"
}, {
	id: "finish",
	name: "Finish",
	field: "finish"
}, {
	id: "finish",
	name: "Finish",
	field: "finish"
}, {
	id: "effort-driven",
	name: "Effort Driven",
	field: "effortDriven"
}];

for (var i = 0; i < columns.length; i++) {
	columns[i].header = {
		menu: {
			items: [{
				iconImage: "../images/sort-asc.gif",
				title: "Sort Ascending",
				command: "sort-asc"
			}, {
				iconImage: "../images/sort-desc.gif",
				title: "Sort Descending",
				command: "sort-desc"
			}, {
				title: "Hide Column",
				command: "hide",
				disabled: true,
				tooltip: "Can't hide this column"
			}, {
				iconCssClass: "icon-help",
				title: "Help",
				command: "help"
			}]
		}
	};
}

var options = {
	frozenColumn: true,
	enableColumnReorder: false,
	rowHeight: 50,
	defaultColumnWidth: 300,
	formatterFactory: Guriddo.FormatterFactory
};

var data = [];
for (var i = 0; i < 500; i++) {
	data[i] = {
		title: "<strong>Hey</strong><br><div style='position: relative; z-index: 9999; overflow: visible;'><div style='position: absolute; z-index: 9999; overflow: visible;'>Task lorem ipsum testing" + i + "</div></div>",
		duration: "5 days",
		percentComplete: Math.round(Math.random() * 100),
		start: "01/01/2009",
		finish: "01/05/2009",
		finish2: "01/05/2009",
		effortDriven: (i % 5 == 0),
		binary: Math.round(Math.random() * 2)
	};
}

grid = new Guriddo.WithFrozen("#test-grid", data, columns, options);
window.grid = grid;