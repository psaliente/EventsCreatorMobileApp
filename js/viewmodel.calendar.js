/*jslint plusplus: true*/
/*jslint nomen: true*/
/*global $, ko, Materialize, confirm*/
function CalendarViewModel() {
    "use strict";
	//private properties
	var self = this,
        currentDate = new Date(),
        disposeRelatedItems;
	//public properties
	self.SelectedEvent = ko.observable(new window.KoModels.ProjectEvent({}));
	self.NewTask = ko.observable(new window.KoModels.EventTask({}));
	self.ActiveCount = ko.observable(0);
	self.TaskFilter = ko.observable("active");
	self.DateFilter = ko.observable(currentDate);
	self.SelectedMonth = ko.observable(currentDate.getMonth());
	self.SelectedYear = ko.observable(currentDate.getFullYear());
	self.ErrorMessage = ko.observable();
	//public arrays	
	self.Events = ko.observableArray([]);
	self.EventTasks = ko.observableArray([]);
	self.Guests = ko.observableArray([]);
	self.Supplies = ko.observableArray([]);
	self.Foods = ko.observableArray([]);
	self.Services = ko.observableArray([]);
	self.Months = [{id: 0, monthName: "January"}, {id: 1, monthName: "February"}, {id: 2, monthName: "March"}, {id: 3, monthName: "April"}, {id: 4, monthName: "May"}, {id: 5, monthName: "June"},
        {id: 6, monthName: "July"}, {id: 7, monthName: "August"}, {id: 8, monthName: "September"}, {id: 9, monthName: "October"}, {id: 10, monthName: "November"}, {id: 11, monthName: "December"}];
	self.Years = [2015, 2016, 2017, 2018, 2019, 2020, 2021];
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
	self.days = ko.computed(function () {
		var tmpDays = new Array(6),
            dayCtr = 1,
            trigMo = self.SelectedMonth(),
            trigYr = self.SelectedYear(),
            firstDay = new Date(trigYr, trigMo, 1).getDay(),
            daysLimit = new Date(trigYr, trigMo + 1, 0).getDate(),
            rows,
            cols;
		for (rows = 0; rows < 6; rows++) {
			tmpDays[rows] = new Array(7);
			for (cols = 0; cols < 7; cols++) {
				if ((!rows && cols >= firstDay) || (rows && dayCtr <= daysLimit)) {
					tmpDays[rows][cols] = dayCtr++;
				} else {
					tmpDays[rows][cols] = 0;
				}
			}
		}
		return tmpDays;
	});
	self.setDateFilter = function (day) {
		var tmpDate = new Date(self.SelectedYear(), self.SelectedMonth(), day);
		self.DateFilter(tmpDate);
		$('#modal-events').openModal();
	};
	self.hasEvent = function (day) {
		var res = false,
            tmpDate = new Date(self.SelectedYear(), self.SelectedMonth(), day);
		ko.utils.arrayForEach(self.Events(), function (pEvent) {
			var tmpEventDate = new Date(pEvent.EventDate).setHours(0, 0, 0, 0);
			if (tmpDate.valueOf() === tmpEventDate.valueOf()) {
				res = true;
				return false;
			}
		});
		return res;
	};
	self.isSelected = function (day) {
		var res = false;
		if (day === self.DateFilter().getDate()) {
			res = true;
		}
		return res;
	};
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
	self.FilteredTasks = ko.computed(function () {
		var tmpTasks = [], ctr = 0;
		ko.utils.arrayForEach(self.EventTasks(), function (task) {
			ctr += !task.TaskCompleted() ? 1 : 0;
			var tmpDateFilter = new Date(self.DateFilter()).setHours(0, 0, 0, 0),
                tmpTaskDate = new Date(task.TaskDate()).setHours(0, 0, 0, 0);
			if (self.TaskFilter() === "active" && tmpDateFilter.valueOf() ===  tmpTaskDate.valueOf()) {
				tmpTasks.push(task);
			}
		});
		self.ActiveCount(ctr);
		return tmpTasks;
	});
	self.FilteredEvents = ko.computed(function () {
		var tmpEvents = [], tmpDateFilter = new Date(self.DateFilter()).setHours(0, 0, 0, 0);
		ko.utils.arrayForEach(self.Events(), function (pEvent) {
			var tmpEventDate = new Date(pEvent.EventDate).setHours(0, 0, 0, 0);
			if (tmpDateFilter.valueOf() === tmpEventDate.valueOf()) {
				tmpEvents.push(pEvent);
			}
		});
		return tmpEvents;
	});
	self.AddTask = function () {
		self.EventTasks.push(self.NewTask());
		self.UpdateLocalStorage();
		self.NewTask(new window.KoModels.EventTask({}));
	};
	self.RemoveTask = function (task) {
		var _delete = confirm("Are you sure you want to delete the task \"" + task.TaskTitle + "\"?"),
            _name;
		if (_delete) {
			_name = task.TaskTitle;
			self.EventTasks.remove(task);
			self.UpdateLocalStorage();
			Materialize.toast(_name + ' has been deleted', 3000);
		}
	};
	self.RemoveEvent = function (pEvent) {
		var _delete = confirm("Are you sure you want to delete the event \"" + pEvent.EventName + "\"?"),
            _name,
            _id;
		if (_delete) {
			_name = pEvent.EventName;
            _id = pEvent.EventID;
			self.Events.remove(pEvent);
			disposeRelatedItems(_id);
			self.UpdateLocalStorage();
			Materialize.toast(_name + ' has been deleted', 3000);
		}
	};
	self.LoadFromStorage = function () {
		var parsedEvents = JSON.parse(window.localStorage.getItem('ProjectEvents')) || [],
            parsedTasks = JSON.parse(window.localStorage.getItem('ProjectEventTasks')) || [],
            parsedGuests = JSON.parse(window.localStorage.getItem('EventGuests')) || [],
            parsedSupplies = JSON.parse(window.localStorage.getItem('EventSupplies')) || [],
            parsedFoods = JSON.parse(window.localStorage.getItem('EventFoods')) || [],
            parsedServices = JSON.parse(window.localStorage.getItem('EventServices')) || [],
            mappedTasks = $.map(parsedTasks, function (task) {
                return new window.KoModels.EventTask(task);
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
            });
		self.Events(parsedEvents);
		self.EventTasks(mappedTasks);
		self.Guests(mappedGuests);
		self.Supplies(mappedSupplies);
		self.Foods(mappedFoods);
		self.Services(mappedServices);
	};
	self.UpdateLocalStorage = function () {
		try {
			var jsonTasks = ko.toJSON(self.EventTasks()),
                jsonEvents = ko.toJSON(self.Events()),
                jsonGuests = ko.toJSON(self.Guests()),
                jsonSupplies = ko.toJSON(self.Supplies()),
                jsonFoods = ko.toJSON(self.Foods()),
                jsonServices = ko.toJSON(self.Services());
			window.localStorage.setItem('ProjectEventTasks', jsonTasks);
			window.localStorage.setItem('ProjectEvents', jsonEvents);
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

var cvm = new CalendarViewModel();

$(document).ready(function () { "use strict"; ko.applyBindings(cvm); cvm.LoadFromStorage(); });
