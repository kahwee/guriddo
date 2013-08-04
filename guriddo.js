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
      this.updateFrozenWidth = __bind(this.updateFrozenWidth, this);
      this.initWithFrozen = __bind(this.initWithFrozen, this);
      this.el = $(container);
      if (this.options.frozenColumn) {
        this.initWithFrozen();
      } else {
        this.initWithoutFrozen();
      }
    }

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
      var columnFrozen, columnFrozenW, columnMain, elFrozenVp, elMainVp,
        _this = this;
      columnFrozen = columns.slice(0, 1);
      columnFrozenW = columnFrozen[0].width || 100;
      columnMain = columns.slice(1);
      this.el.css('margin-left', columnFrozenW);
      this.el.append("<div class=\"" + this.frozenClassName + " " + this.widgetClassName + "\" style=\"width: " + columnFrozenW + "px; left: -" + columnFrozenW + "px; \"></div><div class=\"" + this.mainClassName + " " + this.widgetClassName + "\" style=\"width: 100%;\"></div>");
      this.gridFrozen = new Slick.Grid("" + this.container + " ." + this.frozenClassName, this.data, columnFrozen, options);
      this.gridMain = new Slick.Grid("" + this.container + " ." + this.mainClassName, this.data, columnMain, options);
      this.elFrozen = $("" + this.container + " ." + this.frozenClassName);
      this.elMain = $("" + this.container + " ." + this.mainClassName);
      elFrozenVp = this.elFrozen.find("." + this.slickGridVpClassName);
      elMainVp = this.elMain.find("." + this.slickGridVpClassName);
      elFrozenVp.css('overflow', 'hidden');
      elMainVp.scroll(function(ev) {
        return elFrozenVp.scrollTop(ev.target.scrollTop);
      });
      this.elFrozen.find('.slick-resizable-handle').on('drag', function(ev) {
        return _this.updateFrozenWidth();
      });
      return this.gridFrozen.onColumnsResized.notify = function(ev, args, e) {
        return _this.updateFrozenWidth();
      };
    };

    GuriddoWithFrozen.prototype.updateFrozenWidth = function() {
      var frozenW;
      frozenW = this.elFrozen.find('.slick-header-column').width() + 10;
      this.elFrozen.css({
        left: "-" + frozenW + "px",
        width: "" + frozenW + "px"
      });
      return this.el.css('margin-left', frozenW);
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