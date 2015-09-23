/*jslint nomen: true*/
/*global $, ko, Materialize, confirm*/
function EventViewModel() {
    "use strict";
    //private properties
	var self = this,
        disposeRelatedItems;
	//public properties
	self.SelectedEvent = ko.observable(new window.KoModels.ProjectEvent({}));
	self.ErrorMessage = ko.observable();
	//public arrays
	self.Events = ko.observableArray([]);
	self.Guests = ko.observableArray([]);
	self.Supplies = ko.observableArray([]);
	self.Foods = ko.observableArray([]);
	self.Services = ko.observableArray([]);
	//private methods
	disposeRelatedItems = function (eventID) {
		var guestsToDel = [], foodsToDel = [], suppliesToDel = [], servicesToDel = [];
		ko.utils.arrayForEach(self.Guests(), function (item) {
			if (item.EventID() === eventID) { guestsToDel.push(item); }
		});
		ko.utils.arrayForEach(self.Supplies(), function (item) {
			if (item.EventID() === eventID) { suppliesToDel.push(item); }
		});
		ko.utils.arrayForEach(self.Foods(), function (item) {
			if (item.EventID() === eventID) { foodsToDel.push(item); }
		});
		ko.utils.arrayForEach(self.Services(), function (item) {
			if (item.EventID() === eventID) { servicesToDel.push(item); }
		});
		ko.utils.arrayForEach(guestsToDel, function (toDel) { self.Guests.remove(toDel); });
		ko.utils.arrayForEach(suppliesToDel, function (toDel) { self.Supplies.remove(toDel); });
		ko.utils.arrayForEach(foodsToDel, function (toDel) { self.Foods.remove(toDel); });
		ko.utils.arrayForEach(servicesToDel, function (toDel) { self.Services.remove(toDel); });
	};
	//public methods
	self.getCategoryName = function (categoryID) {
		var catName = "";
		switch (categoryID) {
        case "1":
            catName = "Baby Shower";
            break;
        case "2":
            catName = "Christening";
            break;
        case "3":
            catName = "Birthday";
            break;
        case "4":
            catName = "Wedding";
            break;
        case "5":
            catName = "Funeral";
            break;
        case "6":
            catName = "Reunion";
            break;
        case "7":
            catName = "Conference";
            break;
		}
		return catName;
	};
	self.RemoveEvent = function (pEvent) {
		var _delete = confirm("Are you sure you want to delete the event \"" + pEvent.EventName() + "\"?"),
            _eventName,
            _eventID;
		if (_delete) {
			_eventName = pEvent.EventName();
            _eventID = pEvent.EventID();
			self.Events.remove(pEvent);
			disposeRelatedItems(_eventID);
			self.UpdateLocalStorage();
			Materialize.toast(_eventName + ' has been deleted', 3000);
		}
	};
	self.SelectEvent = function (pEvent) {
		self.SelectedEvent(pEvent);
		self.UpdateLocalStorage();
		return true;
	};
	self.LoadFromStorage = function () {
		var parsedEvents = JSON.parse(window.localStorage.getItem('ProjectEvents')) || [],
            parsedSelectedEvent = JSON.parse(window.localStorage.getItem('ProjectSelectedEvent')) || {},
            parsedGuests = JSON.parse(window.localStorage.getItem('EventGuests')) || [],
            parsedSupplies = JSON.parse(window.localStorage.getItem('EventSupplies')) || [],
            parsedFoods = JSON.parse(window.localStorage.getItem('EventFoods')) || [],
            parsedServices = JSON.parse(window.localStorage.getItem('EventServices')) || [],
            mappedEvents = $.map(parsedEvents, function (pEvent) {
                return new window.KoModels.ProjectEvent(pEvent);
            }),
            mappedGuests = $.map(parsedGuests, function (guest) {
                return new window.KoModels.Guest(guest);
            }),
            mappedSupplies = $.map(parsedSupplies, function (supply) {
                return new window.KoModels.Supply(supply);
            }),
            mappedFoods = $.map(parsedFoods, function (food) {
                return new window.KoModels.Food(food);
            }),
            mappedServices = $.map(parsedServices, function (service) {
                return new window.KoModels.Service(service);
            }),
            tmpSelectedEvent = new window.KoModels.ProjectEvent(parsedSelectedEvent);
		self.Events(mappedEvents);
		ko.utils.arrayForEach(self.Events(), function (pEvent) {
			if (pEvent.EventID() === tmpSelectedEvent.EventID()) {
				self.SelectedEvent(tmpSelectedEvent);
			}
		});
		self.Guests(mappedGuests);
		self.Supplies(mappedSupplies);
		self.Foods(mappedFoods);
		self.Services(mappedServices);
	};
	self.UpdateLocalStorage = function () {
		try {
			var jsonEvents = ko.toJSON(self.Events()),
                jsonSelectedEvent = ko.toJSON(self.SelectedEvent()),
                jsonGuests = ko.toJSON(self.Guests()),
                jsonSupplies = ko.toJSON(self.Supplies()),
                jsonFoods = ko.toJSON(self.Foods()),
                jsonServices = ko.toJSON(self.Services());
			window.localStorage.setItem('ProjectEvents', jsonEvents);
			window.localStorage.setItem('ProjectSelectedEvent', jsonSelectedEvent);
			window.localStorage.setItem("EventGuests", jsonGuests);
			window.localStorage.setItem("EventSupplies", jsonSupplies);
			window.localStorage.setItem("EventFoods", jsonFoods);
			window.localStorage.setItem("EventServices", jsonServices);
			self.ErrorMessage(null);
		} catch (ex) {
			self.ErrorMessage("Error! " + ex + ", please contact developer.");
		}
	};
}

var evm = new EventViewModel();

$(document).ready(function () { "use strict"; ko.applyBindings(evm); evm.LoadFromStorage(); });
