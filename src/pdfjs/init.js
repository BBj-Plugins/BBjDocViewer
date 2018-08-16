
if (!Object.prototype.watch) {
	Object.defineProperty(Object.prototype, "watch", {
		enumerable: false
		, configurable: true
		, writable: false
		, value: function (prop, handler) {
			var
				oldval = this[prop]
				, newval = oldval
				, getter = function () {
					return newval;
				}
				, setter = function (val) {
					oldval = newval;
					return newval = handler.call(this, prop, oldval, val);
				}
				;

			if (delete this[prop]) { // can't watch constants
				Object.defineProperty(this, prop, {
					get: getter
					, set: setter
					, enumerable: true
					, configurable: true
				});
			}
		}
	});
}

// object.unwatch
if (!Object.prototype.unwatch) {
	Object.defineProperty(Object.prototype, "unwatch", {
		enumerable: false
		, configurable: true
		, writable: false
		, value: function (prop) {
			var val = this[prop];
			delete this[prop]; // remove accessors
			this[prop] = val;
		}
	});
}

function getDocument() {

	let doc = typeof $doc !== 'undefined' ? $doc : document;
	let iframe = doc.querySelector(".BBjHtmlView-content");
	if (iframe) {
		iframeContent = (iframe.contentWindow || iframe.contentDocument);
		if (iframeContent && iframeContent.document) doc = iframeContent.document;
	}

	return doc;
}
