/*!
 * jQuery Mobile Page @VERSION
 * http://jquerymobile.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Page Creation
//>>group: Core
//>>description: Basic page definition and formatting.
//>>docs: http://api.jquerymobile.com/page/
//>>demos: http://demos.jquerymobile.com/@VERSION/pages/
//>>css.structure: ../css/structure/jquery.mobile.core.css
//>>css.theme: ../css/themes/default/jquery.mobile.theme.css

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"../widget",
			"../core",
			"widgets/enhancer",
			"widgets/enhancer.backcompat" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} )( function( $ ) {

$.widget( "mobile.page", {
	version: "@VERSION",

	options: {
		theme: "a",
		domCache: false,

		// Deprecated in 1.4 remove in 1.5
		keepNativeDefault: $.mobile.keepNative,

		// Deprecated in 1.4 remove in 1.5
		contentTheme: null,
		enhance: true,
		enhanced: false
	},

	// DEPRECATED for > 1.4
	// TODO remove at 1.5
	_createWidget: function() {
		$.Widget.prototype._createWidget.apply( this, arguments );
		this._trigger( "init" );
	},

	_create: function() {
		// If false is returned by the callbacks do not create the page
		if ( this._trigger( "beforecreate" ) === false ) {
			return false;
		}

		if ( !this.options.enhanced ) {
			this._enhance();
		}

		this._on( this.element, {
			pagebeforehide: "removeContainerBackground",
			pagebeforeshow: "_handlePageBeforeShow"
		} );

		if ( this.options.enhance ) {
			this.element.enhanceWithin();
		}
		// Dialog widget is deprecated in 1.4 remove this in 1.5
		if ( $.mobile.getAttribute( this.element[ 0 ], "role" ) === "dialog" && $.mobile.dialog ) {
			this.element.dialog();
		}
	},

	_enhance: function() {
		var attrPrefix = "data-" + $.mobile.ns,
			self = this;

		if ( this.options.role ) {
			this.element.attr( "data-" + $.mobile.ns + "role", this.options.role );
		}

		this.element
			.attr( "tabindex", "0" )
			.addClass( "ui-page ui-page-theme-" + this.options.theme );

		// Manipulation of content os Deprecated as of 1.4 remove in 1.5
		this.element.find( "[" + attrPrefix + "role='content']" ).each( function() {
			var $this = $( this ),
				theme = this.getAttribute( attrPrefix + "theme" ) || undefined;
			self.options.contentTheme = theme || self.options.contentTheme || ( self.options.dialog && self.options.theme ) || ( self.element.jqmData( "role" ) === "dialog" && self.options.theme );
			$this.addClass( "ui-content" );
			if ( self.options.contentTheme ) {
				$this.addClass( "ui-body-" + ( self.options.contentTheme ) );
			}
			// Add ARIA role
			$this.attr( "role", "main" ).addClass( "ui-content" );
		} );
	},

	bindRemove: function( callback ) {
		var page = this.element;

		// when dom caching is not enabled or the page is embedded bind to remove the page on hide
		if ( !page.data( "mobile-page" ).options.domCache &&
				page.is( ":jqmData(external-page='true')" ) ) {

			// TODO use _on - that is, sort out why it doesn't work in this case
			page.bind( "pagehide.remove", callback || function( e, data ) {

					//check if this is a same page transition and if so don't remove the page
					if ( !data.samePage ) {
						var $this = $( this ),
							prEvent = new $.Event( "pageremove" );

						$this.trigger( prEvent );

						if ( !prEvent.isDefaultPrevented() ) {
							$this.removeWithDependents();
						}
					}
				} );
		}
	},

	_setOptions: function( o ) {
		if ( o.theme !== undefined ) {
			this.element.removeClass( "ui-page-theme-" + this.options.theme ).addClass( "ui-page-theme-" + o.theme );
		}

		if ( o.contentTheme !== undefined ) {
			this.element.find( "[data-" + $.mobile.ns + "='content']" ).removeClass( "ui-body-" + this.options.contentTheme )
				.addClass( "ui-body-" + o.contentTheme );
		}
	},

	_handlePageBeforeShow: function( /* e */ ) {
		this.setContainerBackground();
	},
	// Deprecated in 1.4 remove in 1.5
	removeContainerBackground: function() {
		this.element.closest( ":mobile-pagecontainer" ).pagecontainer( { "theme": "none" } );
	},
	// Deprecated in 1.4 remove in 1.5
	// set the page container background to the page theme
	setContainerBackground: function( theme ) {
		this.element.parent().pagecontainer( { "theme": theme || this.options.theme } );
	}
} );

return $.mobile.page;

} );
