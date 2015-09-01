function CheckListViewModel(){
	var self = this;
	//public properties
	self.SelectedEvent = ko.observable();
	self.NewGuest = ko.observable(new Guest({}));
	self.NewSupply = ko.observable(new Supply({}));
	self.NewFood = ko.observable(new Food({}));
	self.NewService = ko.observable(new Service({}));
	//public arrays
	self.Guests = ko.observableArray([]);
	self.Supplies = ko.observableArray([]);
	self.Foods = ko.observableArray([]);
	self.Services = ko.observableArray([]);
	//functions
	self.FilteredGuests = ko.computed(function () {
		var _res = [];
		ko.utils.arrayForEach(self.Guests(), function (guest) {
			if(guest.EventID() == self.SelectedEvent().EventID()){
				_res.push(guest);	
			}
		});
		return _res;
	});
	self.FilteredSupplies = ko.computed(function () {
		var _res = [];
		ko.utils.arrayForEach(self.Supplies(), function (supply) {
			if(supply.EventID() == self.SelectedEvent().EventID()){
				_res.push(supply);	
			}
		});
		return _res;
	});
	self.FilteredFoods = ko.computed(function () {
		var _res = [];
		ko.utils.arrayForEach(self.Foods(), function (food) {
			if(food.EventID() == self.SelectedEvent().EventID()){
				_res.push(food);	
			}
		});
		return _res;
	});
	self.FilteredServices = ko.computed(function () {
		var _res = [];
		ko.utils.arrayForEach(self.Services(), function (service) {
			if(service.EventID() == self.SelectedEvent().EventID()){
				_res.push(service);	
			}
		});
		return _res;
	});
	self.AddGuest = function (){
		var eventID = self.SelectedEvent().EventID();
		self.NewGuest().EventID(eventID);
		self.Guests.push(self.NewGuest());
		self.UpdateLocalStorage();
		self.NewGuest(new Guest({}));
	};
	self.AddSupply = function (){
		var eventID = self.SelectedEvent().EventID();
		self.NewSupply().EventID(eventID);
		self.Supplies.push(self.NewSupply());
		self.UpdateLocalStorage();
		self.NewSupply(new Supply({}));
	};
	self.AddFood = function () {
		var eventID = self.SelectedEvent().EventID();
		self.NewFood().EventID(eventID);
		self.Foods.push(self.NewFood());
		self.UpdateLocalStorage();
		self.NewFood(new Food({}));
	};
	self.AddService = function () {
		var eventID = self.SelectedEvent().EventID();
		self.NewService().EventID(eventID);
		self.Services.push(self.NewService());
		self.UpdateLocalStorage();
		self.NewService(new Service());
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
	self.DeleteService = function (service) {
		var _response = confirm("Are you sure you want to remove \"" + service.ServiceName() + "\" in your list?");
		if(_response){
			self.Services.remove(service);
			self.UpdateLocalStorage();
		}
	};
	self.UpdateLocalStorage = function() {
		try{
			var jsonGuests = ko.toJSON(self.Guests());
			var jsonSupplies = ko.toJSON(self.Supplies());
			var jsonFoods = ko.toJSON(self.Foods());
			var jsonServices = ko.toJSON(self.Services());
			window.localStorage.setItem("EventGuests",jsonGuests);
			window.localStorage.setItem("EventSupplies",jsonSupplies);
			window.localStorage.setItem("EventFoods",jsonFoods);
			window.localStorage.setItem("EventServices",jsonServices);
		}
		catch (ex){
			//sasaluhin mo pa ba si ex kung mag-fall syang muli sa'yo?
		}
	};
	self.LoadFromStorage = function() {
		var parsedSelectedEvent = JSON.parse(window.localStorage.getItem('ProjectSelectedEvent')) || {};
		var parsedGuests = JSON.parse(window.localStorage.getItem('EventGuests')) || [];
		var parsedSupplies = JSON.parse(window.localStorage.getItem('EventSupplies')) || [];
		var parsedFoods = JSON.parse(window.localStorage.getItem('EventFoods')) || [];
		var parsedServices = JSON.parse(window.localStorage.getItem('EventServices')) || [];
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
		self.Guests(mappedGuests);
		self.Supplies(mappedSupplies);
		self.Foods(mappedFoods);
		self.Services(mappedServices);
	};
}

var clvm = new CheckListViewModel();
$(document).ready(function(){ko.applyBindings(clvm);clvm.LoadFromStorage()});
