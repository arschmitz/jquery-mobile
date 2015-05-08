/*!
 * jQuery Mobile Enhancer @VERSION
 * http://jquerymobile.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Enhancer
//>>group: Widgets
//>>description: Enhables declarative initalization of widgets
//>>docs: http://api.jquerymobile.com/enhancer/

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} )( function( $ ) {
$.fn.extend( {
	enhance: function() {
		var plugin = $.fn.enhance, i,
			enhancables = this.addBack().find( "[" + plugin.defaultProp + "]" );

		if ( plugin._filter ) {
			enhancables = plugin._filter( enhancables );
		}

		// Loop over and execute any hooks that exist
		for ( i = 0; i < $.fn.enhance.hooks.length; i++ ) {
			$.fn.enhance.hooks[ i ].call( this, enhancables );
		}

		// Call the default enhancer function
		$.fn.enhance.defaultFunction.call( this, enhancables );

		return this;
	},
	enhanceWithin: function() {
		return this.children().enhance();
	}
} );

$.extend( $.fn.enhance, {

	// Check if the enhancer has already been defined if it has copy its hooks if not
	// define an empty array
	hooks: $.fn.enhance.hooks ? $.fn.enhance.hooks : [],

	_filter: $.fn.enhance._filter || false,

	defaultProp: $.fn.enhance.defaultProp || "data-role",

	defaultFunction: function( enhancables ) {
		enhancables.each( function() {
			var i, roles = $( this ).attr( "data-role" ).match( /\S+/g ) || [];

			for ( i = 0; i < roles.length; i++ ) {
				if ( $.fn[ roles[ i ] ] ) {
					$( this )[ roles[ i ] ]();
				}
			}
		} );
	},
	getOptions: function( element ) {
		var options = {},
			ns = $.mobile.ns || "";

		$.each( $( element ).data(), function( option, value ) {
			options[ ns + (
					!ns ?
					option :
					option.charAt( 0 ).toUpperCase() + option.slice( 1 )
				) ] = value;
		} );

		return options;
	}
} );

if ( $.widget ) {
	$.extend( $.Widget.prototype, {
		_getCreateOptions: function() {
			var option, value, options = {},
				dataOptions = $.fn.enhance.getOptions( this.element );

			// Translate data-attributes to options
			for ( option in this.options ) {
				value = dataOptions[ option ];
				if ( value !== undefined ) {
					options[ option ] = value;
				}
			}

			return options;
		}
	} );
}

return $.fn.enhance;
} );
