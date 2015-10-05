/*global ko*/
window.KoModels = {
    Guest : function Guest(data) {
        "use strict";
        this.EventID = ko.observable(data.EventID || 0);
        this.GuestName = ko.observable(data.GuestName || "");
        this.Contact = ko.observable(data.Contact || "");
        this.WillAttend = ko.observable(data.WillAttend || false);
    },
    Supply : function Supply(data) {
        "use strict";
        this.EventID = ko.observable(data.EventID || 0);
        this.SupplyName = ko.observable(data.SupplyName || "");
        this.Amount = ko.observable(data.Amount || 0).extend({numeric: 2});
        this.Checked = ko.observable(data.Checked || false);
    },
    Food : function Food(data) {
        "use strict";
        this.EventID = ko.observable(data.EventID || 0);
        this.FoodName = ko.observable(data.FoodName || "");
        this.Amount = ko.observable(data.Amount || 0).extend({numeric: 2});
        this.Checked = ko.observable(data.Checked || false);
    },
    Service : function Service(data) {
        "use strict";
        this.EventID = ko.observable(data.EventID || 0);
        this.ServiceName = ko.observable(data.ServiceName || "");
        this.Amount = ko.observable(data.Amount || 0).extend({numeric: 2});
        this.Checked = ko.observable(data.Checked || false);
    },
    ProjectEvent : function ProjectEvent(data) {
        "use strict";
        this.EventID = ko.observable(data.EventID || 0);
        this.EventName = ko.observable(data.EventName || "");
        this.EventDate = ko.observable(new Date(data.EventDate) || new Date());
        this.Category = ko.observable(data.Category || "");
        this.Venue = ko.observable(data.Venue || "");
        this.Budget = ko.observable(data.Budget || 0).extend({numeric: 2});
        this.BudgetDetails = ko.observable(data.BudgetDetails || "");
    },
    EventTask : function EventTask(data) {
        "use strict";
        this.EventID = ko.observable(data.EventID || 0);
        this.TaskTitle = ko.observable(data.TaskTitle || "");
        this.TaskDetail = ko.observable(data.TaskDetail || "");
        this.TaskDate = ko.observable(new Date(data.TaskDate) || new Date());
        this.TaskCompleted = ko.observable(false);
        this.OnEdit = ko.observable(false);
    }
};
