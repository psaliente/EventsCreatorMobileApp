function BudgetTrackerViewModel(){
	var self = this;
	//public properties
	self.SelectedEvent = ko.observable(new ProjectEvent({}));
	self.TotalSupplies = ko.observable();
	self.TotalFoods = ko.observable();
	self.TotalServices = ko.observable();
	self.TotalExpenses = ko.computed(function(){
		return self.TotalSupplies() + self.TotalFoods() + self.TotalServices();
	});
	self.BudgetBalance = ko.computed(function(){
		var tmpBudget = parseInt(self.SelectedEvent().Budget());
		return tmpBudget - self.TotalExpenses();
	});
	//public arrays
	self.Events = ko.observableArray([]);
	//public methods
	self.UpdateBudget = function(budget) {
		self.UpdateLocalStorage();
	}
	self.LoadFromStorage = function () {
		var parsedEvents = JSON.parse(window.localStorage.getItem('ProjectEvents')) || [];
		var parsedSelectedEvent = JSON.parse(window.localStorage.getItem('ProjectSelectedEvent')) || {};
		var parsedSupplies = JSON.parse(window.localStorage.getItem('EventSupplies')) || [];
		var parsedFoods = JSON.parse(window.localStorage.getItem('EventFoods')) || [];
		var parsedServices = JSON.parse(window.localStorage.getItem('EventServices')) || [];
		var tmpSumSup = 0, tmpSumFud = 0, tmpSumSer = 0;
		var mappedEvents = $.map(parsedEvents, function(pEvent) {
			return new ProjectEvent(pEvent);
		});
		var tmpSelectedEvent = new ProjectEvent(parsedSelectedEvent);
		self.Events(mappedEvents);
		ko.utils.arrayForEach(self.Events(), function(pEvent) {
			if(pEvent.EventID() == tmpSelectedEvent.EventID()){
				self.SelectedEvent(pEvent);
			}
		});
		ko.utils.arrayForEach(parsedSupplies, function (item) {
			if(item.EventID == self.SelectedEvent().EventID()){
				tmpSumSup += parseInt(item.Amount);
			}
		});
		ko.utils.arrayForEach(parsedFoods, function (item) {
			if(item.EventID == self.SelectedEvent().EventID()){
				tmpSumFud += parseInt(item.Amount);
			}
		});
		ko.utils.arrayForEach(parsedServices, function (item) {
			if(item.EventID == self.SelectedEvent().EventID()){
				tmpSumSer += parseInt(item.Amount);
			}
		});
		self.TotalSupplies(tmpSumSup);
		self.TotalFoods(tmpSumFud);
		self.TotalServices(tmpSumSer);
	};
	self.UpdateLocalStorage = function() {
		try {
			var jsonEvents = ko.toJSON(self.Events());
			var jsonSelectedEvent = ko.toJSON(self.SelectedEvent());
			window.localStorage.setItem('ProjectEvents',jsonEvents);
			window.localStorage.setItem('ProjectSelectedEvent',jsonSelectedEvent);
		}
		catch (ex){
			//sasaluhin mo pa ba si ex kung mag-fall syang muli sa'yo?
		}
	};
}

var btvm = new BudgetTrackerViewModel();

$(document).ready(function () {ko.applyBindings(btvm);btvm.LoadFromStorage();});
