function BudgetTrackerViewModel(){
	var self = this;
	//public properties
	self.NewBudget = ko.observable();
	self.NewExpense = ko.observable();
	self.SelectedExpenseType = ko.observable();
	self.TotalBudget = ko.observable();
	self.TotalSupplies = ko.observable();
	self.TotalFoods = ko.observable();
	self.TotalExpenses = ko.computed(function(){
		return self.TotalSupplies() + self.TotalFoods();
	});
	//public arrays
	self.ExpenseTypes = ["Supplies","Food"];
	//public methods
	self.AddBudget = function () {
		var tmpBudget = parseInt(self.TotalBudget());
		self.TotalBudget(tmpBudget + parseInt(self.NewBudget()));
		self.NewBudget(0);
		self.UpdateLocalStorage();
	};
	self.AddExpense = function() {
		if(self.SelectedExpenseType() == "Supplies"){
			var tmpSupply = parseInt(self.TotalSupplies());
			self.TotalSupplies(tmpSupply + parseInt(self.NewExpense()));
		}
		else{
			var tmpFood = parseInt(self.TotalFoods());
			self.TotalFoods(tmpFood + parseInt(self.NewExpense()));
		}
		self.NewExpense(0);
		self.UpdateLocalStorage();
	};
	self.LoadFromStorage = function () {
		var parsedTotalBudget = parseInt(window.localStorage.getItem('EventTotalBudget')) || 0;
		var parsedSupplies = JSON.parse(window.localStorage.getItem('EventSupplies')) || [];
		var parsedFoods = JSON.parse(window.localStorage.getItem('EventFoods')) || [];
		var tmpSumSup = 0, tmpSumFud = 0;
		ko.utils.arrayForEach(parsedSupplies, function (item) {
			tmpSumSup += parseInt(item.Amount);
		});
		ko.utils.arrayForEach(parsedFoods, function (item) {
			tmpSumFud += parseInt(item.Amount);
		});
		self.TotalBudget(parsedTotalBudget);
		self.TotalSupplies(tmpSumSup);
		self.TotalFoods(tmpSumFud);
	};
	self.UpdateLocalStorage = function() {
		try {
			window.localStorage.setItem('EventTotalBudget',self.TotalBudget().toString());
		}
		catch (ex){
			//sasaluhin mo pa ba si ex kung mag-fall syang muli sa'yo?
		}
	};
}

var btvm = new BudgetTrackerViewModel();

$(document).ready(function () {ko.applyBindings(btvm);btvm.LoadFromStorage();});
