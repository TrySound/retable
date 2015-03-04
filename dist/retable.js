/*!
 * retable 0.0.3
 * Transform table for mobile
 * https://github.com/TrySound/retable
 * 
 * Released under the MIT license
 * Copyright (c) 2015, Bogdan Chadkin <trysound@yandex.ru>
 */

(function (window, document) {


var PLUGIN_NAME = 'retable';


var l_container = document.createElement('div'),
	l_caption = document.createElement('header'),
	l_small = document.createElement('table');

l_container.className = PLUGIN_NAME + '-container';
l_caption.className = PLUGIN_NAME + '-caption';
l_small.className = PLUGIN_NAME + '-table';


var builder = {
	row: function (table, container, small, size, hasCaption) {
		var content = table.rows,
			header = content[0].cells,
			rows, i, j, cell, next;

		for(i = header.length - 1; i > (hasCaption ? 0 : -1); i--) {
			small.insertRow(0).appendChild(header[i].cloneNode(true));
		}

		for(i = content.length; --i; ) {
			next = prependChild(small.cloneNode(true), container)
			rows = next.rows;
			if(hasCaption) {
				next.createCaption().innerHTML = content[i].cells[0].innerHTML;
			}
			for(j = rows.length - 1; j > -1; j--) {
				if(cell = content[i].cells[j + (hasCaption ? 1 : 0)]) {
					rows[j].appendChild(cell.cloneNode(true));
				}
			}
		}
	},

	column: function (table, container, small, size, hasCaption) {
		var content = table.rows,
			header = content[0].cells,
			rows, i, j, cell, next;

		for(i = content.length - 1; i > (hasCaption ? 0 : -1); i--) {
			small.insertRow(0).appendChild(content[i].cells[0].cloneNode(true));
		}

		for(i = header.length; --i; ) {
			next = prependChild(small.cloneNode(true), container)
			rows = next.rows;
			if(hasCaption) {
				next.createCaption().innerHTML = content[0].cells[i].innerHTML;
			}
			for(j = rows.length - 1; j > -1; j--) {
				if(cell = content[j + (hasCaption ? 1 : 0)].cells[i]) {
					rows[j].appendChild(cell.cloneNode(true));
				}
			}
		}
	},

	separator: function (table, container, small, size, hasCaption) {
		var content = table.rows,
			header = content[0].cells,
			next, i, j, k, offset, span, row, cell;

		for(i = header.length - 1; i > -1; i--) {
			next = prependChild(small.cloneNode(true), container);
			row = next.insertRow(0);
			if(hasCaption) {
				next.createCaption().innerHTML = header[i].innerHTML;
			} else {
				row.appendChild(header[i].cloneNode(true));
			}
			span = header[i].colSpan;

			for(j = content.length; --j; ) {
				next.insertRow(1);
				offset = size;
				for(k = span - 1; k > -1; k--) {
					if(cell = content[j].cells[size - span + k]) {
						prependChild(cell.cloneNode(true), next.rows[1])
					}
				}
			}
			size -= span;
		}
	}
};


window.retable = retable;

document.addEventListener('DOMContentLoaded', function () {
	retable('.' + PLUGIN_NAME);
});



function retable(selector, opts) {
	var elements = document.querySelectorAll(selector),
		i;

	for(i = elements.length -1; i > -1; i--) {
		init(elements[i], opts || {});
	}
}


function init(table, opts) {
	var container = l_container.cloneNode(),
		caption = l_caption.cloneNode(),
		type = table.getAttribute('data-' + PLUGIN_NAME + '-type') || opts.type,
		hasCaption = table.getAttribute('data-' + PLUGIN_NAME + '-caption') || opts.caption,
		frag = document.createDocumentFragment();

	// Destroy if container exists after
	destroy(table);

	if(typeof builder[type] === 'function' && table.rows.length > 1 && table.rows[0].cells.length > 1) {
		if(table.className.split(' ').indexOf(PLUGIN_NAME) === -1) {
			table.className += (table.className ? ' ' : '') + PLUGIN_NAME;
		}

		// Caption
		if(table.caption) {
			caption.innerHTML = table.caption.innerHTML;
			container.appendChild(caption);
		}

		// Build
		builder[type](table, frag, l_small.cloneNode(), getSize(table), hasCaption);

		// Append
		container.appendChild(frag);
		table.parentNode.insertBefore(container, table.nextSibling);
	}
}

function getSize(table) {
	var cells = table.rows[0].cells,
		size = 0, i = cells.length - 1;

	for( ; i > -1; i--) {
		size += cells[i].colSpan;
	}

	return size;
}

function destroy(table) {
	var container = table.nextElementSibling;

	if(container && container.className.split(' ').indexOf(PLUGIN_NAME + '-container') > -1) {
		container.parentNode.removeChild(container);
	}
}

function insertAfter(next, ref) {
	return ref.parentNode.insertBefore(next, ref.nextSibling);
}

function prependChild(next, ref) {
	return ref.insertBefore(next, ref.firstChild);
}


} (window, document));
