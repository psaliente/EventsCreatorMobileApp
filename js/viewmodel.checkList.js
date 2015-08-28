function CheckListViewModel(){
	var self = this;
	//public properties
	self.NewGuest = ko.observable(new Guest({}));
	self.NewSupply = ko.observable(new Supply({}));
	self.NewFood = ko.observable(new Food({}));
	//public arrays
	self.Guests = ko.observableArray([]);
	self.Supplies = ko.observableArray([]);
	self.Foods = ko.observableArray([]);
	//functions
	self.AddGuest = function (){;
		self.Guests.push(self.NewGuest());
		self.UpdateLocalStorage();
		self.NewGuest(new Guest({}));
	};
	self.AddSupply = function (){
		self.Supplies.push(self.NewSupply());
		self.UpdateLocalStorage();
		self.NewSupply(new Supply({}));
	};
	self.AddFood = function () {
		self.Foods.push(self.NewFood());
		self.UpdateLocalStorage();
		self.NewFood(new Food({}));
	};
	self.DeleteGuest = function (guest) {
		var _response = confirm("Are you sure you want to remove \"" + guest.GuestName() + "\" in your guestlist?");
		if(_response){
			self.Guests.remove(guest);
			self.UpdateLocalStorage();
		}
	};
	self.DeleteSupply = function (supply){
		var _response = confirm("Are you sure you want to remove \"" + supply.SupplyName() + "\" in your list?");
		if(_response){
			self.Supplies.remove(supply);
			self.UpdateLocalStorage();
		}
	};
	self.DeleteFood = function (food) {
		var _response = confirm("Are you sure you want to remove \"" + food.FoodName() + "\" in your list?");
		if(_response){
			self.Foods.remove(food);
			self.UpdateLocalStorage();
		}
	};
	self.UpdateLocalStorage = function() {
		try{
			var jsonGuests = ko.toJSON(self.Guests());
			var jsonSupplies = ko.toJSON(self.Supplies());
			var jsonFoods = ko.toJSON(self.Foods());
			window.localStorage.setItem("EventGuests",jsonGuests);
			window.localStorage.setItem("EventSupplies",jsonSupplies);
			window.localStorage.setItem("EventFoods",jsonFoods);
		}
		catch (ex){
			//sasaluhin mo pa ba si ex kung mag-fall syang muli sa'yo?
		}
	};
	self.LoadFromStorage = function() {
		var parsedGuests = JSON.parse(window.localStorage.getItem('EventGuests')) || [];
		var parsedSupplies = JSON.parse(window.localStorage.getItem('EventSupplies')) || [];
		var parsedFoods = JSON.parse(window.localStorage.getItem('EventFoods')) || [];
		var mappedGuests = $.map(parsedGuests, function(guest){
			return new Guest(guest);
		});
		var mappedSupplies = $.map(parsedSupplies, function(supply){
			return new Supply(supply);
		});
		var mappedFoods = $.map(parsedFoods, function(food){
			return new Food(food);
		});
		self.Guests(mappedGuests);
		self.Supplies(mappedSupplies);
		self.Foods(mappedFoods);
	};
}

var clvm = new CheckListViewModel();
$(document).ready(function(){ko.applyBindings(clvm);clvm.LoadFromStorage()});
