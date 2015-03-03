(function (window, document) {


var l_container = document.createElement('div'),
	l_caption = document.createElement('header'),
	l_small = document.createElement('table');

l_container.className = 'retable-container';
l_caption.className = 'retable-caption';
l_small.className = 'retable-table';


var builder = {
	row: function (table, container, small) {
		var content = table.rows,
			header = content[0].cells,
			rows, i, j, cell;

		for(i = header.length - 1; i > -1; i--) {
			small.insertRow(0).appendChild(header[i].cloneNode(true));
		}

		for(i = content.length; --i; ) {
			rows = prependChild(small.cloneNode(true), container).rows;
			for(j = rows.length - 1; j > -1; j--) {
				if(cell = content[i].cells[j]) {
					rows[j].appendChild(cell.cloneNode(true));
				}
			}
		}
	},

	column: function (table, container, small) {
		var content = table.rows,
			header = content[0].cells,
			rows, i, j, cell;

		for(i = content.length - 1; i > -1; i--) {
			small.insertRow(0).appendChild(content[i].cells[0].cloneNode(true));
		}

		for(i = header.length; --i; ) {
			rows = prependChild(small.cloneNode(true), container).rows;
			for(j = rows.length - 1; j > -1; j--) {
				if(cell = content[j].cells[i]) {
					rows[j].appendChild(cell.cloneNode(true));
				}
			}
		}
	},

	separator: function (table, container, small, size) {
		var content = table.rows,
			header = content[0].cells,
			next, i, j, k, offset, span, cell;

		for(i = header.length - 1; i > -1; i--) {
			next = prependChild(small.cloneNode(true), container);
			next.insertRow(0).appendChild(header[i].cloneNode(true));
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
	retable('.retable');
});



function retable(selector, type) {
	var elements = document.querySelectorAll(selector),
		i;

	for(i = elements.length -1; i > -1; i--) {
		init(elements[i], { type: type });
	}
}


function init(table, opts) {
	opts = opts || {};
	var container = l_container.cloneNode(),
		caption = l_caption.cloneNode(),
		type = table.getAttribute('data-retable-type') || opts.type,
		frag = document.createDocumentFragment();

	// Destroy if container exists after
	destroy(table);

	if(typeof builder[type] === 'function' && table.rows.length > 1 && table.rows[0].cells.length > 1) {
		// Caption
		if(table.caption) {
			caption.innerHTML = table.caption.innerHTML;
			container.appendChild(caption);
		}

		// Build
		builder[type](table, frag, l_small.cloneNode(), getSize(table));

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

	if(container && container.className.split(' ').indexOf('retable-container') > -1) {
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
