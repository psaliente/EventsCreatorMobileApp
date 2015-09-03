function EventViewModel(){
	var self = this;
	//public properties
	self.SelectedEvent = ko.observable(new ProjectEvent({}));
	self.ErrorMessage = ko.observable();
	//public arrays
	self.Events = ko.observableArray([]);
	self.Guests = ko.observableArray([]);
	self.Supplies = ko.observableArray([]);
	self.Foods = ko.observableArray([]);
	self.Services = ko.observableArray([]);
	//private methods
	var DisposeRelatedItems = function(eventID){
		var guestsToDel = [], foodsToDel = [], suppliesToDel = [], servicesToDel = [];
		ko.utils.arrayForEach(self.Guests(), function(item) {
			if(guest.EventID() == eventID) guestsToDel.push(item);
		});
		ko.utils.arrayForEach(self.Supplies(), function(item) {
			if(guest.EventID() == eventID) suppliesToDel.push(item);
		});
		ko.utils.arrayForEach(self.Foods(), function(item) {
			if(guest.EventID() == eventID) foodsToDel.push(item);
		});
		ko.utils.arrayForEach(self.Services(), function(item) {
			if(guest.EventID() == eventID) servicesToDel.push(item);
		});
		ko.utils.arrayForEach(guestsToDel, function(toDel) { self.Guests.remove(toDel); });
		ko.utils.arrayForEach(suppliesToDel, function(toDel) { self.Supplies.remove(toDel); });
		ko.utils.arrayForEach(foodsToDel, function(toDel) { self.Foods.remove(toDel); });
		ko.utils.arrayForEach(servicesToDel, function(toDel) { self.Services.remove(toDel); });
	};
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
		var _delete = confirm("Are you sure you want to delete the event \"" + pEvent.EventName() + "\"?");
		if(_delete){
			var eventname = pEvent.EventName(), eventID = pEvent.EventID();
			self.Events.remove(pEvent);
			DisposeRelatedItems(eventID);
			self.UpdateLocalStorage();
			Materialize.toast(eventname + ' has been deleted', 3000);
		}
	};
	self.SelectEvent = function(pEvent){
		self.SelectedEvent(pEvent);
		self.UpdateLocalStorage();
		return true;
	};
	self.LoadFromStorage = function () {
		var parsedEvents = JSON.parse(window.localStorage.getItem('ProjectEvents')) || [];
		var parsedSelectedEvent = JSON.parse(window.localStorage.getItem('ProjectSelectedEvent')) || {};
		var parsedGuests = JSON.parse(window.localStorage.getItem('EventGuests')) || [];
		var parsedSupplies = JSON.parse(window.localStorage.getItem('EventSupplies')) || [];
		var parsedFoods = JSON.parse(window.localStorage.getItem('EventFoods')) || [];
		var parsedServices = JSON.parse(window.localStorage.getItem('EventServices')) || [];
		var mappedEvents = $.map(parsedEvents, function(pEvent) {
			return new ProjectEvent(pEvent);
		});
		var mappedGuests = $.map(parsedGuests, function(guest){
			return new Guest(guest);
		});
		var mappedSupplies = $.map(parsedSupplies, function(supply){
			return new Supply(supply);
		});
		var mappedFoods = $.map(parsedFoods, function(food){
			return new Food(food);
		});
		var mappedServices = $.map(parsedServices, function(service){
			return new Service(service);
		});
		var tmpSelectedEvent = new ProjectEvent(parsedSelectedEvent);
		self.Events(mappedEvents);
		ko.utils.arrayForEach(self.Events(), function(pEvent) {
			if(pEvent.EventID() == tmpSelectedEvent.EventID()){
				self.SelectedEvent(tmpSelectedEvent);
			}
		});
		self.Guests(mappedGuests);
		self.Supplies(mappedSupplies);
		self.Foods(mappedFoods);
		self.Services(mappedServices);
	};
	self.UpdateLocalStorage = function() {
		try {
			var jsonEvents = ko.toJSON(self.Events());
			var jsonSelectedEvent = ko.toJSON(self.SelectedEvent());
			var jsonGuests = ko.toJSON(self.Guests());
			var jsonSupplies = ko.toJSON(self.Supplies());
			var jsonFoods = ko.toJSON(self.Foods());
			var jsonServices = ko.toJSON(self.Services());
			window.localStorage.setItem('ProjectEvents',jsonEvents);
			window.localStorage.setItem('ProjectSelectedEvent',jsonSelectedEvent);
			window.localStorage.setItem("EventGuests",jsonGuests);
			window.localStorage.setItem("EventSupplies",jsonSupplies);
			window.localStorage.setItem("EventFoods",jsonFoods);
			window.localStorage.setItem("EventServices",jsonServices);
			self.ErrorMessage(null);
		} 
		catch (ex) {
			self.ErrorMessage("Error! " + ex + ", please contact developer."); 
		}
	};
}

var evm = new EventViewModel();

$(document).ready(function () {ko.applyBindings(evm);evm.LoadFromStorage();});
