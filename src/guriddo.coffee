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
		@columnsFrozen = []
		@columnsMain = []
		for column in @columns then do (column) =>
			if column.grid is 0
				column.grid = 0
				@columnsFrozen.push column
			else
				column.grid = 1
				@columnsMain.push column

		if @gridFrozen?
			@gridFrozen.setColumns @columnsFrozen
			@updateFrozenWidth()
			@gridFrozen.autosizeColumns()
		if @gridMain?
			@gridMain.setColumns @columnsMain
		[@columnsFrozen, @columnsMain]

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
		[@columnsFrozen, @columnsMain] = @setColumns(@columns)
		@columnsFrozenW = 0
		for column in @columnsFrozen then do (column) =>
			# Just in case column width is not set
			column.width = column.width || 100
			@columnsFrozenW = @columnsFrozenW + parseInt(column.width, 10)

		@el.css('margin-left', @columnsFrozenW).addClass('guriddo')
		@el.append("<div class=\"#{@frozenClassName}\" style=\"width: #{@columnsFrozenW}px; left: -#{@columnsFrozenW}px; \"></div><div class=\"#{@mainClassName}\" style=\"width: 100%;\"></div>")
		optionsFrozen = JSON.parse JSON.stringify(@options)
		optionsFrozen.formatterFactory = @options.formatterFactory
		optionsFrozen.enableColumnReorder = false;
		@gridFrozen = new Slick.Grid("#{@container} .#{@frozenClassName}", @data, @columnsFrozen, optionsFrozen)
		@gridMain = new Slick.Grid("#{@container} .#{@mainClassName}", @data, @columnsMain, @options)

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

		@hookEvents()

		# On header's mouse enter, hook up 'drag' event
		# This happens again and again but it is the only reliable method it seems
		@gridFrozen.onHeaderMouseEnter.notify = (ev, args) =>
			@$frozen.find('.slick-resizable-handle:last-child').on 'drag', (ev) =>
				@updateFrozenWidth()

		@gridFrozen.onColumnsResized.notify = (ev, args, e) =>
			@updateFrozenWidth()

	updateFrozenWidth: =>
		frozenColumns = @$frozen.find('.slick-header-column')
		frozenW = @$frozen.find('.slick-header-column').outerWidth();
		@columnsFrozenW = 0
		for column in frozenColumns then do (column) =>
			@columnsFrozenW = @columnsFrozenW + parseInt($(column).outerWidth(), 10)
		@$frozen.css(
			left: "-#{@columnsFrozenW}px",
			width: "#{@columnsFrozenW}px",
		)
		@el.css('margin-left', @columnsFrozenW);

	trigger: (ev, args, e) =>
		e = e || new Slick.EventData()
		args = args || {}
		ev.notify args, e, @

	hookEvents: =>
		__thisObject = @
		# Keys of the events
		events = ['onColumnsReordered', 'onColumnsResized']
		slickEvents = {}
		for evName in events then do (evName) ->
			slickEvents[evName] = new Slick.Event()
		$.extend @, slickEvents

		for grid in [@gridFrozen, @gridMain] then do (grid) =>
			for evName in events then do (evName) =>
				grid[evName].notify = (args, e) =>
					@trigger __thisObject[evName], args, e


	autosizeColumns: =>
		if @$mainVpCv.width() < @$mainVp.width()
			@gridMain.resizeCanvas()
			@gridMain.autosizeColumns()

$.extend(true, window, {
	"Guriddo":
		"WithFrozen": GuriddoWithFrozen
})