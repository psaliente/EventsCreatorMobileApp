function Guest(data){
	this.EventID = ko.observable(data.EventID || 0);
	this.GuestName = ko.observable(data.GuestName || "");
	this.Contact = ko.observable(data.Contact || "");
	this.WillAttend = ko.observable(false);
}

function Supply(data){
	this.EventID = ko.observable(data.EventID || 0);
	this.SupplyName = ko.observable(data.SupplyName || "");
	this.Amount = ko.observable(data.Amount || "");
	this.Checked = ko.observable(false);
}

function Food(data){
	this.EventID = ko.observable(data.EventID || 0);
	this.FoodName = ko.observable(data.FoodName || "");
	this.Amount = ko.observable(data.Amount || "");
	this.Checked = ko.observable(false);
}

function ProjectEvent(data){
	this.EventID = ko.observable(data.EventID || 0);
	this.EventName = ko.observable(data.EventName || "");
	this.EventDate = ko.observable(new Date(data.EventDate) || new Date());
	this.Category = ko.observable(data.Category || "");
	this.Venue = ko.observable(data.Venue || "");
}

function EventTask(data){
	this.EventID = ko.observable(data.EventID || 0);
	this.TaskTitle = ko.observable(data.TaskTitle || "");
	this.TaskDetail = ko.observable(data.TaskDetail || "");
	this.TaskDate = ko.observable(new Date(data.TaskDate) || new Date());
	this.TaskCompleted = ko.observable(false);
	this.OnEdit = ko.observable(false);
}
