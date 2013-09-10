(function($) {
	"use strict";


	/***
	 * A plugin to add drop-down menus to column headers.
	 *
	 * USAGE:
	 *
	 * Add the plugin .js & .css files and register it with the grid.
	 *
	 * To specify a menu in a column header, extend the column definition like so:
	 *
	 *   var columns = [
	 *     {
	 *       id: 'myColumn',
	 *       name: 'My column',
	 *
	 *       // This is the relevant part
	 *       header: {
	 *          menu: {
	 *              items: [
	 *                {
	 *                  // menu item options
	 *                },
	 *                {
	 *                  // menu item options
	 *                }
	 *              ]
	 *          }
	 *       }
	 *     }
	 *   ];
	 *
	 *
	 * Available menu options:
	 *    tooltip:      Menu button tooltip.
	 *
	 *
	 * Available menu item options:
	 *    title:        Menu item text.
	 *    disabled:     Whether the item is disabled.
	 *    tooltip:      Item tooltip.
	 *    command:      A command identifier to be passed to the onCommand event handlers.
	 *    iconCssClass: A CSS class to be added to the menu item icon.
	 *    iconImage:    A url to the icon image.
	 *
	 *
	 * The plugin exposes the following events:
	 *    onBeforeMenuShow:   Fired before the menu is shown.  You can customize the menu or dismiss it by returning false.
	 *        Event args:
	 *            grid:     Reference to the grid.
	 *            column:   Column definition.
	 *            menu:     Menu options.  Note that you can change the menu items here.
	 *
	 *    onCommand:    Fired on menu item click for buttons with 'command' specified.
	 *        Event args:
	 *            grid:     Reference to the grid.
	 *            column:   Column definition.
	 *            command:  Button command identified.
	 *            button:   Button options.  Note that you can change the button options in your
	 *                      event handler, and the column header will be automatically updated to
	 *                      reflect them.  This is useful if you want to implement something like a
	 *                      toggle button.
	 *
	 *
	 * @param options {Object} Options:
	 *    buttonCssClass:   an extra CSS class to add to the menu button
	 *    buttonImage:      a url to the menu button image (default '../images/down.gif')
	 * @class Slick.Plugins.HeaderButtons
	 * @constructor
	 */

	function HeaderMenu(options) {
		var _grid;
		var _self = this;
		var _handler = new Slick.EventHandler();
		var _defaults = {
			buttonCssClass: null,
			buttonImage: null
		};
		var $menu;
		var $activeHeaderColumn;


		function init(grid) {
			options = $.extend(true, {}, _defaults, options);
			_grid = grid;
			_handler
				.subscribe(_grid.onHeaderCellRendered, handleHeaderCellRendered)
				.subscribe(_grid.onBeforeHeaderCellDestroy, handleBeforeHeaderCellDestroy);

			// Force the grid to re-render the header now that the events are hooked up.
			_grid.setColumns(_grid.getColumns());

			// Hide the menu on outside click.
			$(document.body).bind("mousedown", handleBodyMouseDown);
		}


		function destroy() {
			_handler.unsubscribeAll();
			$(document.body).unbind("mousedown", handleBodyMouseDown);
		}


		function handleBodyMouseDown(e) {
			if ($menu && $menu[0] !== e.target && !$.contains($menu[0], e.target)) {
				hideMenu();
			}
		}

		function hideMenu() {
			if ($menu) {
				$menu.remove();
				$menu = null;
				$activeHeaderColumn
					.removeClass("slick-header-column-active");
			}
		}

		function handleHeaderCellRendered(e, args) {
			var column = args.column;
			var menu = column.header && column.header.menu;

			if (menu) {
				var $el = $("<select></select>")
					.data("column", column)
					.data("menu", menu);

				_(menu.items).each(function(item, i) {
					$("<option />", {
						value: item.value,
						text: item.text
					})
						.data("item", item)
						.data("command", item.command)
						.appendTo($el);

				});

				$el.val(args.column.field);


				if (menu.tooltip) {
					$el.attr("title", menu.tooltip);
				}

				$(args.node).find('.slick-column-name').html($el);

				if (!_.isUndefined($.fn.select2)) {
					$el.select2();
				}

				$el.on("change", changeMenu);
			}
		}

		var changeMenu = function(ev) {
			var $selected = $(this).find(":selected");
			var command = $selected.data("command");
			var columnDef = $(this).data("column");
			var item = $(this).data("item");


			if (command !== null && command !== '') {
				_self.onCommand.notify({
					"grid": _grid,
					"$selected": $selected,
					"column": columnDef,
					"command": command
				}, ev, _self);
			}
		};

		function handleBeforeHeaderCellDestroy(e, args) {
			var column = args.column;

			if (column.header && column.header.menu) {
				$(args.node).find(".slick-header-menubutton").remove();
			}
		}

		$.extend(this, {
			"init": init,
			"destroy": destroy,

			"onBeforeMenuShow": new Slick.Event(),
			"onCommand": new Slick.Event()
		});
	}
	// register namespace
	$.extend(true, window, {
		"Slick": {
			"Plugins": {
				"SelectHeader": HeaderMenu
			}
		}
	});
})(jQuery);