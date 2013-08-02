(function(window, document, $, _, undefined) {

	var grid;
	var columns = [{
		id: "duration",
		name: "Duration",
		field: "duration"
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
		id: "finish",
		name: "Finish",
		field: "finish"
	}, {
		id: "effort-driven",
		name: "Effort Driven",
		field: "effortDriven"
	}];
	var columns0 = [{
		id: "title",
		name: "Title",
		field: "title",
		width: 100
	}];
	var rawFormatter = function(row, cell, value, columnDef, dataContext) {
		return value;
	};
	_.map(columns, function(item, i) {
		item.formatter = rawFormatter;
		return item;
	});
	_.map(columns0, function(item, i) {
		item.formatter = rawFormatter;
		return item;
	});

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
		enableColumnReorder: false,
		rowHeight: 50
	};

	$(function() {
		var data = [];
		for (var i = 0; i < 500; i++) {
			data[i] = {
				title: "<strong>Hey</strong><br><div style='position: relative; z-index: 9999; overflow: visible;'><div style='position: absolute; z-index: 9999; overflow: visible;'>Task lorem ipsum testing" + i + "</div></div>",
				duration: "5 days",
				percentComplete: Math.round(Math.random() * 100),
				start: "01/01/2009",
				finish: "01/05/2009",
				finish2: "01/05/2009",
				effortDriven: (i % 5 == 0)
			};
		}

		grid = new Slick.Grid("#myGrid1", data, columns, options);
		grid0 = new Slick.Grid("#myGrid0", data, columns0, options);

		var vpGrid0 = $('#myGrid0 .slick-viewport');
		vpGrid0.css('overflow', 'hidden');
		var vpGrid1 = $('#myGrid1 .slick-viewport');
		vpGrid1.scroll(function(ev) {
			vpGrid0.scrollTop(ev.target.scrollTop);
		});
		var headerMenuPlugin = new Slick.Plugins.HeaderMenu({});

		headerMenuPlugin.onBeforeMenuShow.subscribe(function(e, args) {
			var menu = args.menu;

			// We can add or modify the menu here, or cancel it by returning false.
			var i = menu.items.length;
			menu.items.push({
				title: "Menu item " + i,
				command: "item" + i
			});
		});

		headerMenuPlugin.onCommand.subscribe(function(e, args) {
			alert("Command: " + args.command);
		});

		grid.registerPlugin(headerMenuPlugin);

	})
})(window, document, jQuery, _);