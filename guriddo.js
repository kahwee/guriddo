(function() {
  var GuriddoWithFrozen,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  GuriddoWithFrozen = (function() {
    var el;

    GuriddoWithFrozen.prototype.frozenClassName = 'guriddo-frozen';

    GuriddoWithFrozen.prototype.frozenShadowClassName = 'guriddo-frozen-shadow';

    GuriddoWithFrozen.prototype.mainClassName = 'guriddo-main';

    GuriddoWithFrozen.prototype.widgetClassName = 'guriddo-widget';

    GuriddoWithFrozen.prototype.slickGridVpClassName = 'slick-viewport';

    el = {};

    function GuriddoWithFrozen(container, data, columns, options) {
      this.container = container;
      this.data = data;
      this.columns = columns;
      this.options = options;
      this.autosizeColumns = __bind(this.autosizeColumns, this);
      this.hookEvents = __bind(this.hookEvents, this);
      this.trigger = __bind(this.trigger, this);
      this.updateMainWidth = __bind(this.updateMainWidth, this);
      this.getDomOuterWidth = __bind(this.getDomOuterWidth, this);
      this.getCombinedColumnsMinWidth = __bind(this.getCombinedColumnsMinWidth, this);
      this.getCombinedColumnsWidth = __bind(this.getCombinedColumnsWidth, this);
      this.updateFrozenWidth = __bind(this.updateFrozenWidth, this);
      this.initWithFrozen = __bind(this.initWithFrozen, this);
      this.setColumns = __bind(this.setColumns, this);
      this.el = $(container);
      if (this.options.frozenColumn) {
        this.initWithFrozen();
      } else {
        this.initWithoutFrozen();
      }
    }

    GuriddoWithFrozen.prototype.setColumns = function(columns) {
      var column, _fn, _i, _len, _ref,
        _this = this;
      this.columns = columns;
      this.columnsFrozen = [];
      this.columnsMain = [];
      _ref = this.columns;
      _fn = function(column) {
        if (column.grid === 0) {
          column.grid = 0;
          return _this.columnsFrozen.push(column);
        } else {
          column.grid = 1;
          return _this.columnsMain.push(column);
        }
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        column = _ref[_i];
        _fn(column);
      }
      if (this.gridFrozen != null) {
        this.gridFrozen.setColumns(this.columnsFrozen);
        this.updateFrozenWidth();
      }
      if (this.gridMain != null) {
        this.gridMain.setColumns(this.columnsMain);
      }
      return [this.columnsFrozen, this.columnsMain];
    };

    GuriddoWithFrozen.prototype.getColumns = function() {
      return [].concat(this.gridFrozen.getColumns(), this.gridMain.getColumns());
    };

    GuriddoWithFrozen.prototype.invalidateRows = function(rows) {
      this.gridFrozen.invalidateRows(rows);
      return this.gridMain.invalidateRows(rows);
    };

    GuriddoWithFrozen.prototype.render = function() {
      this.gridFrozen.render();
      return this.gridMain.render();
    };

    GuriddoWithFrozen.prototype.updateRowCount = function() {
      this.gridFrozen.updateRowCount();
      return this.gridMain.updateRowCount();
    };

    GuriddoWithFrozen.prototype.initWithFrozen = function() {
      var column, optionsFrozen, _fn, _i, _len, _ref, _ref1,
        _this = this;
      _ref = this.setColumns(this.columns), this.columnsFrozen = _ref[0], this.columnsMain = _ref[1];
      this.columnsFrozenW = 0;
      _ref1 = this.columnsFrozen;
      _fn = function(column) {
        column.width = column.width || 100;
        return _this.columnsFrozenW = _this.columnsFrozenW + parseInt(column.width, 10);
      };
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        column = _ref1[_i];
        _fn(column);
      }
      this.el.css('margin-left', this.columnsFrozenW).addClass('guriddo');
      this.el.append("<div class=\"" + this.frozenClassName + "\" style=\"width: " + this.columnsFrozenW + "px; left: -" + this.columnsFrozenW + "px; \"></div><div class=\"" + this.mainClassName + "\" style=\"width: 100%;\"></div>");
      optionsFrozen = JSON.parse(JSON.stringify(this.options));
      optionsFrozen.formatterFactory = this.options.formatterFactory;
      optionsFrozen.enableColumnReorder = false;
      this.gridFrozen = new Slick.Grid("" + this.container + " ." + this.frozenClassName, this.data, this.columnsFrozen, optionsFrozen);
      this.gridMain = new Slick.Grid("" + this.container + " ." + this.mainClassName, this.data, this.columnsMain, this.options);
      this.$frozen = $("" + this.container + " ." + this.frozenClassName);
      this.$main = $("" + this.container + " ." + this.mainClassName);
      this.$frozenVp = this.$frozen.find("." + this.slickGridVpClassName);
      this.$mainVp = this.$main.find("." + this.slickGridVpClassName);
      this.$frozenVpCv = this.$frozenVp.find(".grid-canvas");
      this.$mainVpCv = this.$mainVp.find(".grid-canvas");
      this.$frozenVp.css("overflow", "hidden");
      this.$mainVp.scroll(function(ev) {
        var scrollLeft;
        scrollLeft = ev.target.scrollLeft;
        if (scrollLeft > 0) {
          _this.$frozen.addClass(_this.frozenShadowClassName);
        } else {
          _this.$frozen.removeClass(_this.frozenShadowClassName);
        }
        return _this.$frozenVp.scrollTop(ev.target.scrollTop);
      });
      this.$frozenVp.scroll(function(ev) {
        return _this.$mainVp.scrollTop(ev.target.scrollTop);
      });
      this.hookEvents();
      this.gridFrozen.onHeaderMouseEnter.notify = function(ev, args) {
        return _this.$frozen.find('.slick-resizable-handle:last-child').on('drag', function(ev) {
          return _this.updateFrozenWidth();
        });
      };
      return this.gridFrozen.onColumnsResized.notify = function(ev, args, e) {
        return _this.updateFrozenWidth();
      };
    };

    GuriddoWithFrozen.prototype.updateFrozenWidth = function() {
      var column, frozenColumns, frozenW, _fn, _i, _len,
        _this = this;
      frozenColumns = this.$frozen.find('.slick-header-column');
      frozenW = this.$frozen.find('.slick-header-column').outerWidth();
      this.columnsFrozenW = 0;
      _fn = function(column) {
        return _this.columnsFrozenW = _this.columnsFrozenW + parseInt($(column).outerWidth(), 10);
      };
      for (_i = 0, _len = frozenColumns.length; _i < _len; _i++) {
        column = frozenColumns[_i];
        _fn(column);
      }
      this.$frozen.css({
        left: "-" + this.columnsFrozenW + "px",
        width: "" + this.columnsFrozenW + "px"
      });
      return this.el.css('margin-left', this.columnsFrozenW);
    };

    GuriddoWithFrozen.prototype.getCombinedColumnsWidth = function(columns) {
      return _(columns).pluck('width').reduce(function(sum, column) {
        return sum + column;
      });
    };

    GuriddoWithFrozen.prototype.getCombinedColumnsMinWidth = function(columns) {
      return _(columns).pluck('minWidth').reduce(function(sum, column) {
        return sum + column;
      });
    };

    GuriddoWithFrozen.prototype.getDomOuterWidth = function(mainColumns) {
      return _(mainColumns).map(function(column) {
        return column.offsetWidth;
      }).reduce(function(sum, column) {
        return sum + column;
      });
    };

    GuriddoWithFrozen.prototype.updateMainWidth = function() {
      var dW, dWDivided, getScrollBarWidth, hasChanges, mainColumns, mainColumnsMinW, mainColumnsW, mainW;
      getScrollBarWidth = function() {
        var $outer, widthWithScroll;
        $outer = $('<div>').css({
          visibility: 'hidden',
          width: 100,
          overflow: 'scroll'
        }).appendTo('body');
        widthWithScroll = $('<div>').css({
          width: '100%'
        }).appendTo($outer).outerWidth();
        $outer.remove();
        return 100 - widthWithScroll;
      };
      mainColumns = this.$main.find('.slick-header-column');
      mainColumnsW = this.getDomOuterWidth(mainColumns);
      mainW = this.$main.outerWidth() - getScrollBarWidth();
      hasChanges = false;
      if (mainW > mainColumnsW) {
        dW = mainW - mainColumnsW;
        dWDivided = Math.floor(dW / mainColumns.length);
        _(this.columnsMain).each(function(column) {
          var newWidth;
          newWidth = column.width + dWDivided;
          if (column.width !== newWidth) {
            hasChanges = true;
            return column.width += dWDivided;
          }
        });
      } else if (mainW < mainColumnsW) {
        mainColumnsMinW = this.getCombinedColumnsMinWidth(this.columnsMain);
        dW = mainW - mainColumnsMinW;
        dWDivided = Math.floor(dW / mainColumns.length);
        _(this.columnsMain).each(function(column) {
          var newWidth;
          newWidth = column.minWidth + dWDivided;
          if (column.width !== newWidth) {
            hasChanges = true;
            return column.width = column.minWidth + dWDivided;
          }
        });
      }
      if (hasChanges) {
        return this.gridMain.setColumns(this.columnsMain);
      }
    };

    GuriddoWithFrozen.prototype.trigger = function(ev, args, e) {
      e = e || new Slick.EventData();
      args = args || {};
      return ev.notify(args, e, this);
    };

    GuriddoWithFrozen.prototype.hookEvents = function() {
      var evName, events, grid, slickEvents, __thisObject, _fn, _i, _j, _len, _len1, _ref, _results,
        _this = this;
      __thisObject = this;
      events = ['onColumnsReordered', 'onColumnsResized', 'onSort'];
      slickEvents = {};
      _fn = function(evName) {
        return slickEvents[evName] = new Slick.Event();
      };
      for (_i = 0, _len = events.length; _i < _len; _i++) {
        evName = events[_i];
        _fn(evName);
      }
      $.extend(this, slickEvents);
      _ref = [this.gridFrozen, this.gridMain];
      _results = [];
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        grid = _ref[_j];
        _results.push((function(grid) {
          var _k, _len2, _results1;
          _results1 = [];
          for (_k = 0, _len2 = events.length; _k < _len2; _k++) {
            evName = events[_k];
            _results1.push((function(evName) {
              return grid[evName].notify = function(args, e) {
                return _this.trigger(__thisObject[evName], args, e);
              };
            })(evName));
          }
          return _results1;
        })(grid));
      }
      return _results;
    };

    GuriddoWithFrozen.prototype.autosizeColumns = function() {
      if (this.$mainVpCv.width() < this.$mainVp.width()) {
        this.gridMain.resizeCanvas();
        return this.gridMain.autosizeColumns();
      }
    };

    return GuriddoWithFrozen;

  })();

  $.extend(true, window, {
    "Guriddo": {
      "WithFrozen": GuriddoWithFrozen
    }
  });

}).call(this);

/*
//@ sourceMappingURL=guriddo.js.map
*/