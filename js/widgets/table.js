/*!
 * jQuery Mobile Table @VERSION
 * http://jquerymobile.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Table
//>>group: Widgets
//>>description: Responsive presentation and behavior for HTML data tables
//>>docs: http://api.jquerymobile.com/table/
//>>css.structure: ../css/structure/jquery.mobile.table.css
//>>css.theme: ../css/themes/default/jquery.mobile.theme.css

( function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [
			"jquery",
			"../widget",
			"./page" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
} )( function( $ ) {

return $.widget( "mobile.table", {
	version: "@VERSION",

	options: {
		classes: {
			table: "ui-table"
		},
		enhanced: false
	},

	// Expose headers and allHeaders properties on the widget
	// headers references the THs within the first TR in the table
	headers: null,

	// allHeaders references headers, plus all THs in the thead, which may
	// include several rows, or not
	allHeaders: null,

	_create: function() {
		if ( !this.options.enhanced ) {
			this.element.addClass( this.options.classes.table );
		}

		this.refresh();
	},

	_setOptions: function( options ) {
		if ( options.disabled !== undefined ) {
			this.element.toggleClass( "ui-state-disabled", options.disabled );
		}
		return this._super( options );
	},

	_setHeaders: function() {
		this.headers = this.element.find( "tr:eq(0)" ).children();
		this.allHeaders = this.element.find( "thead tr" ).children().add( this.headers );
	},

	rebuild: function() {
		this.refresh();
	},

	_refreshHeadCell: function( cellIndex, element, columnCount ) {
		var columnIndex,
			table = this.element,
			trs = table.find( "thead tr" ),
			span = parseInt( element.getAttribute( "colspan" ), 10 ),
			selector = ":nth-child(" + ( columnCount + 1 ) + ")";

		if ( span ) {
			for( columnIndex = 0; columnIndex < span - 1; columnIndex++ ) {
				columnCount++;
				selector += ", :nth-child(" + ( columnCount + 1 ) + ")";
			}
		}

		// Store "cells" data on header as a reference to all cells in the same column as this TH
		$( element ).jqmData( "cells",
			table
				.find( "tr" )
					.not( trs.eq( 0 ) )
					.not( element )
					.children( selector ) );

		return columnCount;
	},

	_refreshHeadRow: function( rowIndex, element ) {
		var columnCount = 0;

		// Iterate over the children of the tr
		$( element ).children().each( $.proxy( function( cellIndex, element ) {
			columnCount = this._refreshHeadCell( cellIndex, element, columnCount ) + 1;
		}, this ) );
	},

	refresh: function() {
		var table = this.element,
			trs = table.find( "thead tr" );

		// updating headers on refresh (fixes #5880)
		this._setHeaders();

		// Iterate over the trs
		trs.each( $.proxy( this, "_refreshHeadRow" ) );
	},

	_destroy: function() {
		var table = this.element;

		if ( !this.options.enhanced ) {
			table.removeClass( this.options.classes.table );
		}

		// We have to remove "cells" data even if the table was originally enhanced, because it is
		// added during refresh
		table.find( "thead tr" ).children().each( function() {
			$( this ).jqmRemoveData( "cells" );
		});
	}
});

} );
