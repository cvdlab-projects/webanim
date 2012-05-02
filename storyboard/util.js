Array.prototype.remove = function(item) {
	var cut = this.indexOf(item);

	var firstHalf = this.slice(0, cut);
	var secondHalf = this.slice(cut + 1);

	return firstHalf.concat(secondHalf);
};

Array.prototype.findById = function(id) {
	var result;
	var found = false;
	for (var i = 0; i < this.length && !found; i++) {
		if (this[i].id === id) {
			result = this[i];
			found = true;
		};
	};
	return result;
};