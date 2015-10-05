/*jslint plusplus: true*/
/*jslint nomen: true*/
/*global ko,PreSelectedValues, $, Supply, Food, Service, Guest*/
function IndexViewModel() {
    "use strict";
	//private properties
	var self = this,
        IDCounter = 0,
        setInitialList;
	//public properties
	self.EventName = ko.observable();
	self.EventDate = ko.observable();
	self.Category = ko.observable();
	self.Venue = ko.observable();
	self.ErrorMessage = ko.observable();
	//public arrays
	self.Categories = [{id: "1", name: "Baby Shower"},
              { id: "2", name: "Christening"},
              { id: "3", name: "Birthday"},
              { id: "4", name: "Wedding"},
              { id: "5", name: "Funeral"},
              { id: "6", name: "Reunion"},
              { id: "7", name: "Conference"}];
	self.Events = ko.observableArray([]);
	self.Supplies = ko.observableArray([]);
	self.Foods = ko.observableArray([]);
	self.Services = ko.observableArray([]);
	//private methods
	setInitialList = function (eventID) {
		try {
			var _id = parseInt(self.Category(), 10) - 1;
			ko.utils.arrayForEach(PreSelectedValues[_id].InitialSupplies, function (supply) {
				var tmpSupply = new window.KoModels.Supply($.extend({}, supply, {EventID: eventID}));
				self.Supplies.push(tmpSupply);
			});
			ko.utils.arrayForEach(PreSelectedValues[_id].InitialFoods, function (food) {
				var tmpFood = new window.KoModels.Food($.extend({}, food, {EventID: eventID}));
				self.Foods.push(tmpFood);
			});
			ko.utils.arrayForEach(PreSelectedValues[_id].InitialServices, function (service) {
				var tmpService = new window.KoModels.Service($.extend({}, service, {EventID: eventID}));
				self.Services.push(tmpService);
			});
			self.ErrorMessage(null);
		} catch (ex) {
			self.ErrorMessage("Error! " + ex + ", please contact developer.");
		}
	};
	//public methods
	self.SaveEvent = function () {
		var tmpEvent = {
			EventID: ++IDCounter,
			EventName: self.EventName(),
			EventDate: new Date(self.EventDate()),
			Category: self.Category(),
			Venue: self.Venue()
		};
		self.Events.push(tmpEvent);
		setInitialList(tmpEvent.EventID);
		self.UpdateLocalStorage();
	};
	self.LoadFromStorage = function () {
		IDCounter = parseInt(window.localStorage.getItem('ProjectEventIDCounter'), 10) || 0;
		var parsedEvents = JSON.parse(window.localStorage.getItem('ProjectEvents')) || [],
            parsedSupplies = JSON.parse(window.localStorage.getItem('EventSupplies')) || [],
            parsedFoods = JSON.parse(window.localStorage.getItem('EventFoods')) || [],
            parsedServices = JSON.parse(window.localStorage.getItem('EventServices')) || [],
            mappedSupplies = $.map(parsedSupplies, function (supply) {
                return new window.KoModels.Supply(supply);
            }),
            mappedFoods = $.map(parsedFoods, function (food) {
                return new window.KoModels.Food(food);
            }),
            mappedServices = $.map(parsedServices, function (service) {
                return new window.KoModels.Service(service);
            });
		self.Events(parsedEvents);
		self.Supplies(mappedSupplies);
		self.Foods(mappedFoods);
		self.Services(mappedServices);
	};
	self.UpdateLocalStorage = function () {
		try {
			var jsonData = ko.toJSON(self.Events()),
                jsonSupplies = ko.toJSON(self.Supplies()),
                jsonFoods = ko.toJSON(self.Foods()),
                jsonServices = ko.toJSON(self.Services());
			window.localStorage.setItem('ProjectEvents', jsonData);
			window.localStorage.setItem('ProjectEventIDCounter', IDCounter);
			window.localStorage.setItem("EventSupplies", jsonSupplies);
			window.localStorage.setItem("EventFoods", jsonFoods);
			window.localStorage.setItem("EventServices", jsonServices);
			self.EventName("");
			self.EventDate("");
			self.Category("");
			self.Venue("");
			self.ErrorMessage(null);
		} catch (ex) {
			self.ErrorMessage("Error! " + ex + ", please contact developer.");
		}
	};
}

var ivm = new IndexViewModel();
$(document).ready(function () { 'use strict'; ko.applyBindings(ivm); ivm.LoadFromStorage(); });

