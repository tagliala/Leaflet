L.Map.mergeOptions({
	closePopupOnClick: true
});

L.Popup = L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		minWidth: 270,
		maxWidth: 270,
		maxHeight: null,
		autoPan: true,
		autoCenter: true,
		closeButton: false,
		offset: new L.Point(0, 2),
		autoPanPadding: new L.Point(5, 5),
		className: ''
	},

	initialize: function (options, source) {
		L.Util.setOptions(this, options);

		this._source = source;
	},

	onAdd: function (map) {
		this._map = map;

		if (!this._container) {
			this._initLayout();
		}
		this._updateContent();

		this._container.style.opacity = '0';
		map._panes.popupPane.appendChild(this._container);

		map.on('viewreset', this._updatePosition, this);

		if (L.Browser.any3d) {
			map.on('zoomanim', this._zoomAnimation, this);
		}

		if (map.options.closePopupOnClick) {
			map.on('preclick', this._close, this);
		}

		this._update();

		this._container.style.opacity = '1'; //TODO fix ugly opacity hack
	},

	onRemove: function (map) {
		map._panes.popupPane.removeChild(this._container);

		L.Util.falseFn(this._container.offsetWidth);

		map.off('viewreset', this._updatePosition, this)
		   .off('preclick', this._close, this)
		   .off('zoomanim', this._zoomAnimation, this);

		this._container.style.opacity = '0';

		this._map = null;
	},

	setLatLng: function (latlng) {
		this._latlng = latlng;
		this._update();
		return this;
	},

	setContent: function (content) {
		this._content = content;
		this._update();
		return this;
	},

	_close: function () {
		var map = this._map;

		if (map) {
			map._popup = null;

			map
				.removeLayer(this)
				.fire('popupclose', {popup: this});
		}
	},

	_initLayout: function () {
		var prefix = 'leaflet-popup',
			container = this._container = L.DomUtil.create('div', prefix + ' ' + this.options.className + ' leaflet-zoom-animated'),
			closeButton;

		if (this.options.closeButton) {
			closeButton = this._closeButton = L.DomUtil.create('a', prefix + '-close-button', container);
			closeButton.href = '#close';

			L.DomEvent.addListener(closeButton, 'click', this._onCloseButtonClick, this);
		}

		var wrapper = this._wrapper = L.DomUtil.create('div', prefix + '-content-wrapper', container);
		L.DomEvent.disableClickPropagation(wrapper);

		this._contentNode = L.DomUtil.create('div', prefix + '-content', wrapper);
		L.DomEvent.addListener(this._contentNode, 'mousewheel', L.DomEvent.stopPropagation);
	},

	_update: function () {
		if (!this._map) { return; }

		this._container.style.visibility = 'hidden';

		this._updateContent();
		this._updateLayout();
		this._updatePosition();

		this._container.style.visibility = '';

		if (this.options.autoCenter) {
			this._autoCenter();
		}
		else if (this.options.autoPan) {
			this._adjustPan();
		}
	},

	_updateContent: function () {
		if (!this._content) { return; }

		if (typeof this._content === 'string') {
			this._contentNode.innerHTML = this._content;
		} else {
			while (this._contentNode.hasChildNodes()) {
				this._contentNode.removeChild(this._contentNode.firstChild);
			}
			this._contentNode.appendChild(this._content);
		}
		this.fire('contentupdate');
	},

	_updateLayout: function () {
		var container = this._contentNode;

		container.style.width = '';
		container.style.whiteSpace = 'nowrap';

		var width = container.offsetWidth;
		width = Math.min(width, this.options.maxWidth);
		width = Math.max(width, this.options.minWidth);

		container.style.width = (width) + 'px';
		container.style.whiteSpace = '';

		container.style.height = '';

		var height = container.offsetHeight,
			maxHeight = this.options.maxHeight,
			scrolledClass = ' leaflet-popup-scrolled';

		if (maxHeight && height > maxHeight) {
			container.style.height = maxHeight + 'px';
			container.className += scrolledClass;
		} else {
			container.className = container.className.replace(scrolledClass, '');
		}

		this._containerWidth = this._container.offsetWidth;
		this._containerBottom = -this.options.offset.y;
		this._containerLeft = -Math.round(this._containerWidth / 2) + this.options.offset.x;
	},

	_updatePosition: function () {
		var pos = this._map.latLngToLayerPoint(this._latlng);

		this._containerTop = pos.y + 10;
		this._containerLeft = pos.x - Math.round(this._containerWidth / 2) + this.options.offset.x;

		this._container.style.top = this._containerTop + 'px';
		this._container.style.left = this._containerLeft + 'px';

		L.DomUtil.setPosition(this._container, pos);
	},
	
	_zoomAnimation: function (opt) {
		var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center)._round();

		L.DomUtil.setPosition(this._container, pos);
	},

	_autoCenter: function () {
		var map = this._map,
			containerHeight = this._container.offsetHeight,
			containerWidth = this._containerWidth,
			layerPos = L.DomUtil.getPosition(this._container).add(
				new L.Point(this._containerLeft, this._containerTop)),
			containerPos = map.layerPointToContainerPoint(layerPos),
			adjustOffset = new L.Point(0, 0),
			size         = map.getSize();

		adjustOffset.x = containerPos.x - Math.round((size.x - containerWidth) / 2);
		adjustOffset.y = containerPos.y - Math.round((size.y - containerHeight) / 2);

		if (adjustOffset.x || adjustOffset.y) {
			map.panBy(adjustOffset);
		}
	},

	_adjustPan: function () {
		var map = this._map,
			containerHeight = this._container.offsetHeight,
			containerWidth = this._containerWidth,
			layerPos = L.DomUtil.getPosition(this._container).add(
				new L.Point(this._containerLeft, this._containerTop)),
			containerPos = map.layerPointToContainerPoint(layerPos),
			adjustOffset = new L.Point(0, 0),
			padding      = this.options.autoPanPadding,
			size         = map.getSize();

		if (containerPos.x < 0) {
			adjustOffset.x = containerPos.x - padding.x;
		}
		if (containerPos.x + containerWidth > size.x) {
			adjustOffset.x = containerPos.x + containerWidth - size.x + padding.x;
		}
		if (containerPos.y < 0) {
			adjustOffset.y = containerPos.y - padding.y;
		}
		if (containerPos.y + containerHeight > size.y) {
			adjustOffset.y = containerPos.y + containerHeight - size.y + padding.y;
		}

		if (adjustOffset.x || adjustOffset.y) {
			map.panBy(adjustOffset);
		}
	},

	_onCloseButtonClick: function (e) {
		this._close();
		L.DomEvent.stop(e);
	}
});
