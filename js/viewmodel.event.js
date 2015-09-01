function EventViewModel(){
	var self = this;
	//public properties
	self.SelectedEvent = ko.observable(new ProjectEvent({}));
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
	self.SelectEvent = function(pEvent){
		self.SelectedEvent(pEvent);
		self.UpdateLocalStorage();
	};
	self.LoadFromStorage = function () {
		var parsedEvents = JSON.parse(window.localStorage.getItem('ProjectEvents')) || [];
		var parsedSelectedEvent = JSON.parse(window.localStorage.getItem('ProjectSelectedEvent')) || {};
		var mappedEvents = $.map(parsedEvents, function(pEvent) {
			return new ProjectEvent(pEvent);
		});
		var tmpSelectedEvent = new ProjectEvent(parsedSelectedEvent);
		self.Events(mappedEvents);
		ko.utils.arrayForEach(self.Events(), function(pEvent) {
			if(pEvent.EventID() == tmpSelectedEvent.EventID()){
				self.SelectedEvent(tmpSelectedEvent);
			}
		});
	};
	self.UpdateLocalStorage = function() {
		var jsonEvents = ko.toJSON(self.Events());
		var jsonSelectedEvent = ko.toJSON(self.SelectedEvent());
		window.localStorage.setItem('ProjectEvents',jsonEvents);
		window.localStorage.setItem('ProjectSelectedEvent',jsonSelectedEvent);
	};
}

var evm = new EventViewModel();

$(document).ready(function () {ko.applyBindings(evm);evm.LoadFromStorage();});
