function EventViewModel(){
	var self = this;
	//public properties
	self.SelectedEvent = ko.observable();
	//public arrays
	self.Events = ko.observableArray([]);
	//public methods
	self.getCategoryName = function(categoryID){
		var catName = "";
		switch(categoryID)
		{
			case "1": catName= "Baby Shower"; break;
			case "2": catName= "Christening"; break;
			case "3": catName= "Birthday"; break;
			case "4": catName="Wedding"; break;
			case "5": catName="Funeral"; break;
			case "6": catName="Reunion"; break;
			case "7": catName="Conference";
		}
		return catName;
	};
	self.RemoveEvent = function(pEvent) {
		var _delete = confirm("Are you sure you want to delete the event \"" + pEvent.EventName + "\"?");
		if(_delete){
			self.Events.remove(pEvent);
			self.UpdateLocalStorage();
		}
	};
	self.LoadFromStorage = function () {
		var parsedEvents = JSON.parse(window.localStorage.getItem('ProjectEvents')) || [];
		var mappedEvents = $.map(parsedEvents, function(pEvent) {
			return new ProjectEvent(pEvent);
		});
		self.Events(mappedEvents);
	};
	self.UpdateLocalStorage = function() {
		var jsonEvents = ko.toJSON(self.Events());
		window.localStorage.setItem('ProjectEvents',jsonEvents);
	};
}

var evm = new EventViewModel();

$(document).ready(function () {ko.applyBindings(evm);evm.LoadFromStorage();});here
