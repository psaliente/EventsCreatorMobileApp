/*jslint nomen: true*/
/*global $, ko, Materialize, confirm*/
function CheckListViewModel() {
    "use strict";
	var self = this;
	//public properties
	self.SelectedEvent = ko.observable(new window.KoModels.ProjectEvent({}));
	self.NewGuest = ko.observable(new window.KoModels.Guest({}));
	self.NewSupply = ko.observable(new window.KoModels.Supply({}));
	self.NewFood = ko.observable(new window.KoModels.Food({}));
	self.NewService = ko.observable(new window.KoModels.Service({}));
	self.ErrorMessage = ko.observable();
	//public arrays
	self.Events = ko.observableArray([]);
	self.Guests = ko.observableArray([]);
	self.Supplies = ko.observableArray([]);
	self.Foods = ko.observableArray([]);
	self.Services = ko.observableArray([]);
	//functions
	self.FilteredGuests = ko.computed(function () {
		var _res = [];
		ko.utils.arrayForEach(self.Guests(), function (guest) {
			if (guest.EventID() === self.SelectedEvent().EventID()) {
				_res.push(guest);
			}
		});
		return _res;
	});
	self.FilteredSupplies = ko.computed(function () {
		var _res = [];
		ko.utils.arrayForEach(self.Supplies(), function (supply) {
			if (supply.EventID() === self.SelectedEvent().EventID()) {
				_res.push(supply);
			}
		});
		return _res;
	});
	self.FilteredFoods = ko.computed(function () {
		var _res = [];
		ko.utils.arrayForEach(self.Foods(), function (food) {
			if (food.EventID() === self.SelectedEvent().EventID()) {
				_res.push(food);
			}
		});
		return _res;
	});
	self.FilteredServices = ko.computed(function () {
		var _res = [];
		ko.utils.arrayForEach(self.Services(), function (service) {
			if (service.EventID() === self.SelectedEvent().EventID()) {
				_res.push(service);
			}
		});
		return _res;
	});
	self.AddGuest = function () {
		var eventID = self.SelectedEvent().EventID();
		self.NewGuest().EventID(eventID);
		self.Guests.push(self.NewGuest());
		self.UpdateLocalStorage();
		self.NewGuest(new window.KoModels.Guest({}));
	};
	self.AddSupply = function () {
		var eventID = self.SelectedEvent().EventID();
		self.NewSupply().EventID(eventID);
		self.Supplies.push(self.NewSupply());
		self.UpdateLocalStorage();
		self.NewSupply(new window.KoModels.Supply({}));
	};
	self.AddFood = function () {
		var eventID = self.SelectedEvent().EventID();
		self.NewFood().EventID(eventID);
		self.Foods.push(self.NewFood());
		self.UpdateLocalStorage();
		self.NewFood(new window.KoModels.Food({}));
	};
	self.AddService = function () {
		var eventID = self.SelectedEvent().EventID();
		self.NewService().EventID(eventID);
		self.Services.push(self.NewService());
		self.UpdateLocalStorage();
		self.NewService(new window.KoModels.Service({}));
	};
	self.DeleteGuest = function (guest) {
		var _response = confirm("Are you sure you want to remove \"" + guest.GuestName() + "\" in your guestlist?"),
            _name;
		if (_response) {
			_name = guest.GuestName();
			self.Guests.remove(guest);
			self.UpdateLocalStorage();
			Materialize.toast(_name + ' has been deleted', 3000);
		}
	};
	self.DeleteSupply = function (supply) {
		var _response = confirm("Are you sure you want to remove \"" + supply.SupplyName() + "\" in your list?"),
            _name;
		if (_response) {
			_name = supply.SupplyName();
			self.Supplies.remove(supply);
			self.UpdateLocalStorage();
			Materialize.toast(_name + ' has been deleted', 3000);
		}
	};
	self.DeleteFood = function (food) {
		var _response = confirm("Are you sure you want to remove \"" + food.FoodName() + "\" in your list?"),
            _name;
		if (_response) {
			_name = food.FoodName();
			self.Foods.remove(food);
			self.UpdateLocalStorage();
			Materialize.toast(_name + ' has been deleted', 3000);
		}
	};
	self.DeleteService = function (service) {
		var _response = confirm("Are you sure you want to remove \"" + service.ServiceName() + "\" in your list?"),
            _name;
		if (_response) {
			_name = service.ServiceName();
			self.Services.remove(service);
			self.UpdateLocalStorage();
			Materialize.toast(_name + ' has been deleted', 3000);
		}
	};
	self.UpdateLocalStorage = function () {
		try {
			var jsonGuests = ko.toJSON(self.Guests()),
                jsonSupplies = ko.toJSON(self.Supplies()),
                jsonFoods = ko.toJSON(self.Foods()),
                jsonServices = ko.toJSON(self.Services());
			window.localStorage.setItem("EventGuests", jsonGuests);
			window.localStorage.setItem("EventSupplies", jsonSupplies);
			window.localStorage.setItem("EventFoods", jsonFoods);
			window.localStorage.setItem("EventServices", jsonServices);
			self.ErrorMessage(null);
		} catch (ex) {
			self.ErrorMessage("Error! " + ex + ", please contact developer.");
		}
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
				self.SelectedEvent(pEvent);
			}
		});
		self.Guests(mappedGuests);
		self.Supplies(mappedSupplies);
		self.Foods(mappedFoods);
		self.Services(mappedServices);
	};
}

var clvm = new CheckListViewModel();
$(document).ready(function () { "use strict"; ko.applyBindings(clvm); clvm.LoadFromStorage(); });
