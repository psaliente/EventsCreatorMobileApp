function BudgetTrackerViewModel(){
	var self = this;
	//public properties
	self.SelectedEvent = ko.observable();
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
	//public methods
	self.LoadFromStorage = function () {
		var parsedSelectedEvent = JSON.parse(window.localStorage.getItem('ProjectSelectedEvent')) || {};
		var parsedSupplies = JSON.parse(window.localStorage.getItem('EventSupplies')) || [];
		var parsedFoods = JSON.parse(window.localStorage.getItem('EventFoods')) || [];
		var parsedServices = JSON.parse(window.localStorage.getItem('EventServices')) || [];
		var tmpSumSup = 0, tmpSumFud = 0, tmpSumSer = 0;
		ko.utils.arrayForEach(parsedSupplies, function (item) {
			tmpSumSup += parseInt(item.Amount);
		});
		ko.utils.arrayForEach(parsedFoods, function (item) {
			tmpSumFud += parseInt(item.Amount);
		});
		ko.utils.arrayForEach(parsedServices, function (item) {
			tmpSumSer += parseInt(item.Amount);
		});
		self.SelectedEvent(new ProjectEvent(parsedSelectedEvent));
		self.TotalSupplies(tmpSumSup);
		self.TotalFoods(tmpSumFud);
		self.TotalServices(tmpSumSer);
	};
	self.UpdateLocalStorage = function() {
		try {
			var jsonSelectedEvent = ko.toJSON(self.SelectedEvent());
			window.localStorage.setItem('ProjectSelectedEvent',jsonSelectedEvent);
		}
		catch (ex){
			//sasaluhin mo pa ba si ex kung mag-fall syang muli sa'yo?
		}
	};
}

var btvm = new BudgetTrackerViewModel();

$(document).ready(function () {ko.applyBindings(btvm);btvm.LoadFromStorage();});
