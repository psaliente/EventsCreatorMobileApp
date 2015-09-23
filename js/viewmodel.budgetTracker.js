/*global $, ko*/
function BudgetTrackerViewModel() {
    "use strict";
	var self = this;
	//public properties
	self.SelectedEvent = ko.observable(new window.KoModels.ProjectEvent({}));
	self.TotalSupplies = ko.observable();
	self.TotalFoods = ko.observable();
	self.TotalServices = ko.observable();
	self.TotalExpenses = ko.computed(function () {
		return self.TotalSupplies() + self.TotalFoods() + self.TotalServices();
	});
	self.BudgetBalance = ko.computed(function () {
		var tmpBudget = parseInt(self.SelectedEvent().Budget(), 10);
		return tmpBudget - self.TotalExpenses();
	});
	self.ErrorMessage = ko.observable();
	//public arrays
	self.Events = ko.observableArray([]);
	//public methods
	self.UpdateBudget = function (budget) {
		self.UpdateLocalStorage();
	};
	self.LoadFromStorage = function () {
		var parsedEvents = JSON.parse(window.localStorage.getItem('ProjectEvents')) || [],
            parsedSelectedEvent = JSON.parse(window.localStorage.getItem('ProjectSelectedEvent')) || {},
            parsedSupplies = JSON.parse(window.localStorage.getItem('EventSupplies')) || [],
            parsedFoods = JSON.parse(window.localStorage.getItem('EventFoods')) || [],
            parsedServices = JSON.parse(window.localStorage.getItem('EventServices')) || [],
            tmpSumSup = 0,
            tmpSumFud = 0,
            tmpSumSer = 0,
            mappedEvents = $.map(parsedEvents, function (pEvent) {
                return new window.KoModels.ProjectEvent(pEvent);
            }),
            tmpSelectedEvent = new window.KoModels.ProjectEvent(parsedSelectedEvent);
		self.Events(mappedEvents);
		ko.utils.arrayForEach(self.Events(), function (pEvent) {
			if (pEvent.EventID() === tmpSelectedEvent.EventID()) {
				self.SelectedEvent(pEvent);
			}
		});
		ko.utils.arrayForEach(parsedSupplies, function (item) {
			if (item.EventID === self.SelectedEvent().EventID()) {
				tmpSumSup += parseInt(item.Amount, 10);
			}
		});
		ko.utils.arrayForEach(parsedFoods, function (item) {
			if (item.EventID === self.SelectedEvent().EventID()) {
				tmpSumFud += parseInt(item.Amount, 10);
			}
		});
		ko.utils.arrayForEach(parsedServices, function (item) {
			if (item.EventID === self.SelectedEvent().EventID()) {
				tmpSumSer += parseInt(item.Amount, 10);
			}
		});
		self.TotalSupplies(tmpSumSup);
		self.TotalFoods(tmpSumFud);
		self.TotalServices(tmpSumSer);
	};
	self.UpdateLocalStorage = function () {
		try {
			var jsonEvents = ko.toJSON(self.Events()),
                jsonSelectedEvent = ko.toJSON(self.SelectedEvent());
			window.localStorage.setItem('ProjectEvents', jsonEvents);
			window.localStorage.setItem('ProjectSelectedEvent', jsonSelectedEvent);
			self.ErrorMessage(null);
		} catch (ex) {
			self.ErrorMessage("Error! " + ex + ", please contact developer.");
		}
	};
}

var btvm = new BudgetTrackerViewModel();

$(document).ready(function () { "use strict"; ko.applyBindings(btvm); btvm.LoadFromStorage(); });
