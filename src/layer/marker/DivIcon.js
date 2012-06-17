L.DivIcon = L.Icon.extend({
	options: {
		iconSize: new L.Point(12, 12), // also can be set through CSS
		shadow: false,
		/*
		iconAnchor: (Point)
		popupAnchor: (Point)
		*/
		className: 'leaflet-div-icon'
	},

	createIcon: function () {
		var div = document.createElement('div');
		this._setIconStyles(div, 'icon');
		return div;
	},

	createShadow: function () {
		if (!this.options.shadow) {
			return null;
		}
		var div = document.createElement('div');
		this._setIconStyles(div, 'shadow');
		return div;
	}
});

L.Icon.Default = L.DivIcon.extend({
	options: {
		shadow: true,
		iconSize: new L.Point(25, 41),
		iconAnchor: new L.Point(13, 41),
		popupAnchor: new L.Point(0, -33),
		shadowSize: new L.Point(41, 41),
		className: "default-marker"
	}
});
