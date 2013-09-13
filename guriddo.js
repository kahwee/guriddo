(function() {
  var GuriddoWithFrozen,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  GuriddoWithFrozen = (function() {
    var el;

    GuriddoWithFrozen.prototype.frozenClassName = 'guriddo-frozen';

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
      var column, columnFrozen, columnMain, _fn, _fn1, _i, _j, _len, _len1;
      this.columns = columns;
      columnFrozen = this.columns.slice(0, 1);
      columnMain = this.columns.slice(1);
      _fn = function(column) {
        return column.grid = 0;
      };
      for (_i = 0, _len = columnFrozen.length; _i < _len; _i++) {
        column = columnFrozen[_i];
        _fn(column);
      }
      _fn1 = function(column) {
        return column.grid = 1;
      };
      for (_j = 0, _len1 = columnMain.length; _j < _len1; _j++) {
        column = columnMain[_j];
        _fn1(column);
      }
      if (this.gridFrozen != null) {
        this.gridFrozen.setColumns(columnFrozen);
        this.updateFrozenWidth();
      }
      if (this.gridMain != null) {
        this.gridMain.setColumns(columnMain);
      }
      return [columnFrozen, columnMain];
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
      var columnFrozen, columnFrozenW, columnMain, _ref,
        _this = this;
      _ref = this.setColumns(this.columns), columnFrozen = _ref[0], columnMain = _ref[1];
      columnFrozenW = columnFrozen[0].width || 100;
      this.el.css('margin-left', columnFrozenW).addClass('gurrido');
      this.el.append("<div class=\"" + this.frozenClassName + " " + this.widgetClassName + "\" style=\"width: " + columnFrozenW + "px; left: -" + columnFrozenW + "px; \"></div><div class=\"" + this.mainClassName + " " + this.widgetClassName + "\" style=\"width: 100%;\"></div>");
      this.gridFrozen = new Slick.Grid("" + this.container + " ." + this.frozenClassName, this.data, columnFrozen, this.options);
      this.gridMain = new Slick.Grid("" + this.container + " ." + this.mainClassName, this.data, columnMain, this.options);
      this.$frozen = $("" + this.container + " ." + this.frozenClassName);
      this.$main = $("" + this.container + " ." + this.mainClassName);
      this.$frozenVp = this.$frozen.find("." + this.slickGridVpClassName);
      this.$mainVp = this.$main.find("." + this.slickGridVpClassName);
      this.$frozenVpCv = this.$frozenVp.find(".grid-canvas");
      this.$mainVpCv = this.$mainVp.find(".grid-canvas");
      this.$frozenVp.css("overflow", "hidden");
      this.$mainVp.scroll(function(ev) {
        return _this.$frozenVp.scrollTop(ev.target.scrollTop);
      });
      this.$frozenVp.scroll(function(ev) {
        return _this.$mainVp.scrollTop(ev.target.scrollTop);
      });
      this.$frozen.find('.slick-resizable-handle').on('drag', function(ev) {
        return _this.updateFrozenWidth();
      });
      return this.gridFrozen.onColumnsResized.notify = function(ev, args, e) {
        return _this.updateFrozenWidth();
      };
    };

    GuriddoWithFrozen.prototype.updateFrozenWidth = function() {
      var frozenW;
      frozenW = this.$frozen.find('.slick-header-column').width() + 10;
      this.$frozen.css({
        left: "-" + frozenW + "px",
        width: "" + frozenW + "px"
      });
      return this.el.css('margin-left', frozenW);
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