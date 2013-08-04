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
      this.initWithFrozen = __bind(this.initWithFrozen, this);
      this.el = $(container);
      if (this.options.frozenColumn) {
        this.initWithFrozen();
      } else {
        this.initWithoutFrozen();
      }
    }

    GuriddoWithFrozen.prototype.initWithFrozen = function() {
      var columnFrozen, columnFrozenW, columnMain, elFrozenVp, elMainVp;
      columnFrozen = columns.slice(0, 1);
      columnFrozenW = columnFrozen[0].width || 100;
      columnMain = columns.slice(1);
      $('.guriddo').css('margin-left', columnFrozenW);
      this.el.append("<div class=\"" + this.frozenClassName + " " + this.widgetClassName + "\" style=\"width: " + columnFrozenW + "px; left: -" + columnFrozenW + "px; \"></div><div class=\"" + this.mainClassName + " " + this.widgetClassName + "\" style=\"width: 100%;\"></div>");
      this.gridFrozen = new Slick.Grid("" + this.container + " ." + this.frozenClassName, data, columnFrozen, options);
      this.gridMain = new Slick.Grid("" + this.container + " ." + this.mainClassName, data, columnMain, options);
      this.elFrozen = $("" + this.container + " ." + this.frozenClassName);
      this.elMain = $("" + this.container + " ." + this.mainClassName);
      elFrozenVp = this.elFrozen.find("." + this.slickGridVpClassName);
      elMainVp = this.elMain.find("." + this.slickGridVpClassName);
      elFrozenVp.css('overflow', 'hidden');
      return elMainVp.scroll(function(ev) {
        return elFrozenVp.scrollTop(ev.target.scrollTop);
      });
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