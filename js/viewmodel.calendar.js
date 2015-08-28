function CalendarViewModel() {
	var self = this;
	//public properties
	self.NewTask = ko.observable(new EventTask({}));
	self.ActiveCount = ko.observable(0);
	self.TaskFilter = ko.observable("active");
	self.DateFilter = ko.observable(new Date());
	//public arrays	
	self.Events = ko.observableArray([]);
	self.EventTasks = ko.observableArray([]);
	//public methods
	self.getCategoryName = function(categoryID){
		var catName = "";
		switch(categoryID)
		{
			case "1": catName= "Baby Shower"; break;
			case "2": catName= "Christening"; break;
			case "3": catName= "Birthday"; break;
			case "4": catName="Wedding"; break;
			case "5": catName="Funeral"; break;
			case "6": catName="Reunion"; break;
			case "7": catName="Conference";
		}
		return catName;
	};
	self.FilteredTasks = ko.computed(function(){
		var tmpTasks = []; var ctr = 0;
		ko.utils.arrayForEach(self.EventTasks(), function (task) {
			ctr += !task.TaskCompleted() ? 1 : 0;
			var tmpDateFilter = new Date(self.DateFilter()).setHours(0,0,0,0);
			var tmpTaskDate = new Date(task.TaskDate()).setHours(0,0,0,0);
			if (self.TaskFilter() == "active" && tmpDateFilter.valueOf() ==  tmpTaskDate.valueOf())
			{
				tmpTasks.push(task);
			}
		});
		self.ActiveCount(ctr);
		return tmpTasks;
	});
	self.FilteredEvents = ko.computed(function(){
		var tmpEvents = []; var tmpDateFilter = new Date(self.DateFilter()).setHours(0,0,0,0);
		ko.utils.arrayForEach(self.Events(), function (pEvent) {
			var tmpEventDate = new Date(pEvent.EventDate).setHours(0,0,0,0);
			if (tmpDateFilter.valueOf() == tmpEventDate.valueOf()){
				tmpEvents.push(pEvent);
			}
		});
		return tmpEvents;
	});
	self.AddTask = function () {
		self.EventTasks.push(self.NewTask());
		self.UpdateLocalStorage();
		self.NewTask(new EventTask({}));
	};
	self.RemoveTask = function(task) {
		var _delete = confirm("Are you sure you want to delete the task \"" + task.TaskTitle + "\"?");
		if(_delete){
			self.EventTasks.remove(task);
			self.UpdateLocalStorage();
		}
	};
	self.RemoveEvent = function(pEvent) {
		var _delete = confirm("Are you sure you want to delete the event \"" + pEvent.EventName + "\"?");
		if(_delete){
			self.Events.remove(pEvent);
			self.UpdateLocalStorage();
		}
	}
	self.LoadFromStorage = function () {
		var parsedEvents = JSON.parse(window.localStorage.getItem('ProjectEvents')) || [];
		var parsedTasks = JSON.parse(window.localStorage.getItem('ProjectEventTasks')) || [];
		var mappedTasks = $.map(parsedTasks, function(task) {
			return new EventTask(task);
		});
		self.Events(parsedEvents);
		self.EventTasks(mappedTasks);
	};
	self.UpdateLocalStorage = function() {
		try{
			var jsonTasks = ko.toJSON(self.EventTasks());
			var jsonEvents = ko.toJSON(self.Events());
			window.localStorage.setItem('ProjectEventTasks',jsonTasks);
			window.localStorage.setItem('ProjectEvents',jsonEvents);
		}
		catch (ex){
			//sasaluhin mo pa ba si ex kung mag-fall syang muli sa'yo?
		}
	};
}

var cvm = new CalendarViewModel();

$(document).ready(function(){ko.applyBindings(cvm); cvm.LoadFromStorage();});
