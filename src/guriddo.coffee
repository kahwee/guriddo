class GuriddoWithFrozen
	frozenClassName: 'guriddo-frozen'
	mainClassName: 'guriddo-main'
	widgetClassName: 'guriddo-widget'
	slickGridVpClassName: 'slick-viewport'
	el = {}

	constructor: (@container, @data, @columns, @options) ->
		@el = $(container)
		if @options.frozenColumn
			@initWithFrozen()
		else
			@initWithoutFrozen()

	invalidateRows: (rows) ->
		@gridFrozen.invalidateRows(rows)
		@gridMain.invalidateRows(rows)

	render: ->
		@gridFrozen.render()
		@gridMain.render()

	updateRowCount: ->
		@gridFrozen.updateRowCount()
		@gridMain.updateRowCount()

	initWithFrozen: =>
		columnFrozen = columns[0...1]
		columnFrozenW = columnFrozen[0].width || 100;
		columnMain = columns[1...]

		@el.css('margin-left', columnFrozenW);
		@el.append("<div class=\"#{@frozenClassName} #{@widgetClassName}\" style=\"width: #{columnFrozenW}px; left: -#{columnFrozenW}px; \"></div><div class=\"#{@mainClassName} #{@widgetClassName}\" style=\"width: 100%;\"></div>")
		@gridFrozen = new Slick.Grid("#{@container} .#{@frozenClassName}", @data, columnFrozen, options);
		@gridMain = new Slick.Grid("#{@container} .#{@mainClassName}", @data, columnMain, options);

		@elFrozen = $("#{@container} .#{@frozenClassName}")
		@elMain = $("#{@container} .#{@mainClassName}")
		elFrozenVp = @elFrozen.find(".#{@slickGridVpClassName}")
		elMainVp = @elMain.find(".#{@slickGridVpClassName}")
		elFrozenVp.css('overflow', 'hidden')
		elMainVp.scroll (ev) ->
			elFrozenVp.scrollTop(ev.target.scrollTop)

		@gridFrozen.onColumnsResized.notify = (ev, args, e) =>
			frozenW = @elFrozen.find('.slick-header-column').width() + 10;
			@elFrozen.css(
				left: "-#{frozenW}px",
				width: "#{frozenW}px",
			)
			@el.css('margin-left', frozenW);


$.extend(true, window, {
	"Guriddo":
		"WithFrozen": GuriddoWithFrozen
})