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

	setColumns: (@columns) =>
		columnFrozen = @columns[0...1]
		columnMain = @columns[1...]
		for column in columnFrozen then do (column) ->
			column.grid = 0
		for column in columnMain then do (column) ->
			column.grid = 1

		if @gridFrozen?
			@gridFrozen.setColumns columnFrozen
			@updateFrozenWidth()
			#_(columnFrozen).pluck('width').each (width, index) ->
			#	frozenWidth
		if @gridMain?
			@gridFrozen.setColumns columnFrozen
		[columnFrozen, columnMain]

	getColumns: ->
		[].concat @gridFrozen.getColumns(), @gridMain.getColumns()

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
		[columnFrozen, columnMain] = @setColumns(@columns)
		columnFrozenW = columnFrozen[0].width || 100;

		@el.css('margin-left', columnFrozenW).addClass('gurrido')
		@el.append("<div class=\"#{@frozenClassName} #{@widgetClassName}\" style=\"width: #{columnFrozenW}px; left: -#{columnFrozenW}px; \"></div><div class=\"#{@mainClassName} #{@widgetClassName}\" style=\"width: 100%;\"></div>")
		@gridFrozen = new Slick.Grid("#{@container} .#{@frozenClassName}", @data, columnFrozen, @options)
		@gridMain = new Slick.Grid("#{@container} .#{@mainClassName}", @data, columnMain, @options)

		@$frozen = $("#{@container} .#{@frozenClassName}")
		@$main = $("#{@container} .#{@mainClassName}")
		@$frozenVp = @$frozen.find(".#{@slickGridVpClassName}")
		@$mainVp = @$main.find(".#{@slickGridVpClassName}")
		@$frozenVpCv = @$frozenVp.find(".grid-canvas")
		@$mainVpCv = @$mainVp.find(".grid-canvas")
		@$frozenVp.css "overflow", "hidden"
		@$mainVp.scroll (ev) =>
			@$frozenVp.scrollTop(ev.target.scrollTop)
		@$frozenVp.scroll (ev) =>
			@$mainVp.scrollTop(ev.target.scrollTop)

		@$frozen.find('.slick-resizable-handle').on 'drag', (ev) =>
			@updateFrozenWidth()

		@gridFrozen.onColumnsResized.notify = (ev, args, e) =>
			@updateFrozenWidth()

	updateFrozenWidth: =>
		frozenW = @$frozen.find('.slick-header-column').width() + 10;
		@$frozen.css(
			left: "-#{frozenW}px",
			width: "#{frozenW}px",
		)
		@el.css('margin-left', frozenW);

	autosizeColumns: =>
		if @$mainVpCv.width() < @$mainVp.width()
			@gridMain.resizeCanvas()
			@gridMain.autosizeColumns()

$.extend(true, window, {
	"Guriddo":
		"WithFrozen": GuriddoWithFrozen
})