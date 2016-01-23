Jobs = new Mongo.Collection("jobs");



 
if (Meteor.isClient) {
  // This code only runs on the client
  

  Template.addJobClient.events({
    "submit .new-job": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var text = event.target.text.value;
 
      // Insert a job into the collection
      Meteor.call("addJob", text);
 
      // Clear form
      event.target.text.value = "";
      },
      
  });

 
Template.jobList.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  });
 

  Template.jobList.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Meteor.call("setChecked", this._id, ! this.checked);
    },
    "click .delete": function () {
      Meteor.call("deleteJob", this._id);
    },
    "click .toggle-private": function () {
      Meteor.call("setPrivate", this._id, ! this.private);
    },
    "change .hide-completed input": function (event) {
        Session.set("hideCompleted", event.target.checked);
      }
  });

  Meteor.subscribe("jobs");

Template.home.helpers({
	email: function () {
		if (this.emails && this.emails.length)
			return this.emails[0].address;

		if (this.services) {
			//Iterate through services
			for (var serviceName in this.services) {
				var serviceObject = this.services[serviceName];
				//If an 'id' isset then assume valid service
				if (serviceObject.id) {
					if (serviceObject.email) {
						return serviceObject.email;
					}
				}
			}
		}
		return "";
	},

	jobs: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter jobs
        return Jobs.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise, return all of the jobs
        return Jobs.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");

    },
    incompleteCount: function () {
      return Jobs.find({checked: {$ne: true}}).count();  
    }
});

}

 
Meteor.methods({
  addJob: function (text) {
    // Make sure the user is logged in before inserting a job
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
 
    Jobs.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().emails[0].address
    });
  },
  deleteJob: function (jobId) {
    var job = Jobs.findOne(jobId);
    if (job.private && job.owner !== Meteor.userId()) {
      // If the job is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
 
    Jobs.remove(jobId);
  },
  setChecked: function (jobId, setChecked) {
    var job = Jobs.findOne(jobId);
    if (job.private && job.owner !== Meteor.userId()) {
      // If the job is private, make sure only the owner can check it off
      throw new Meteor.Error("not-authorized");
    }
 
    Jobs.update(jobId, { $set: { checked: setChecked} });
  },
  setPrivate: function (jobId, setToPrivate) {
    var job = Jobs.findOne(jobId);
 
    // Make sure only the job owner can make a job private
    if (job.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
 
    Jobs.update(jobId, { $set: { private: setToPrivate } });
  }
});


if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish jobs that are public or belong to the current user
  Meteor.publish("jobs", function () {
    return Jobs.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });
}