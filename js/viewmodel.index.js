function IndexViewModel(){
	//private properties
	var self = this;
	var IDCounter = 0;
	//public properties
	self.EventName = ko.observable();
	self.EventDate = ko.observable();
	self.Category = ko.observable();
	self.Venue = ko.observable();
	//public arrays
	self.Categories = [{id:"1", name:"Baby Shower"},
              { id:"2", name:"Christening"},
              { id:"3", name:"Birthday"},
              { id:"4", name:"Wedding"},
              { id:"5", name:"Funeral"},
              { id:"6", name:"Reunion"},
              { id:"7", name:"Conference"}];	
	self.Events = ko.observableArray([]);
	//public methods
	self.RetrieveEvents = function () {
		IDCounter = parseInt(window.localStorage.getItem('ProjectEventIDCounter')) || 0;
		var parsedData = JSON.parse(window.localStorage.getItem('ProjectEvents')) || [];
		self.Events(parsedData);
	}
	self.SaveEvent = function(){
		try{
			var tmpEvent = {
				EventID: ++IDCounter,
				EventName: self.EventName(),
				EventDate: new Date(self.EventDate()),
				Category: self.Category(),
				Venue: self.Venue()
			};
			self.Events.push(tmpEvent);
			var jsonData = ko.toJSON(self.Events());
			window.localStorage.setItem('ProjectEvents',jsonData);
			window.localStorage.setItem('ProjectEventIDCounter',IDCounter);
			self.EventName("");
			self.EventDate("");
			self.Category("");
			self.Venue("");
		}
		catch (ex){
			//sasaluhin mo pa ba si ex kung mag-fall syang muli sa'yo?
		}
	}
}

var ivm = new IndexViewModel();
$(document).ready(function(){ko.applyBindings(ivm);ivm.RetrieveEvents()});

