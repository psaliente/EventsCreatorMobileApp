//http://jsfiddle.net/rniemeyer/jjbhy/
ko.bindingHandlers.uniqueId = {
    init: function(element, valueAccessor) {
        var value = valueAccessor();
        value.id = value.id || ko.bindingHandlers.uniqueId.prefix + (++ko.bindingHandlers.uniqueId.counter);

        element.id = value.id;
    },
    counter: 0,
    prefix: "unique"
};

ko.bindingHandlers.uniqueFor = {
    init: function(element, valueAccessor) {
        var value = valueAccessor();
        value.id = value.id || ko.bindingHandlers.uniqueId.prefix + (++ko.bindingHandlers.uniqueId.counter);
        
        element.setAttribute("for", value.id);
    } 
};

ko.extenders.numeric = function (target, precision) {
	var _result = ko.pureComputed({
		read: target,
		write: function(newValue){
			var current = target(),
			roundingMultiplier = Math.pow(10, precision),
			newValueAsNum = isNaN(newValue) ? current : parseFloat(+newValue),
			valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;
			if(valueToWrite !== current){
				target(valueToWrite);
			}
			else {
				if(newValue !== current){
					target.notifySubscribers(valueToWrite);
				}
			}
		}
	}).extend({notify: 'always'});
	_result(target());
	return _result
};