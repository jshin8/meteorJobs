Items = new Mongo.Collection('items');

Items.before.insert(function (userId, doc) {
  doc.owner = userId;  
  //doc.createdAt = Date.now();
});

Items.allow({
  insert: function (userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    return (userId && doc.owner === userId);
  },
  update: function (userId, doc, fields, modifier) {
    // can only change your own documents
    return doc.owner === userId;
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    return doc.owner === userId;
  }
  
});

Items.attachSchema(new SimpleSchema({
  store: {
    type: String,
    label: "Store Name",
    max: 200
  },
  name: {
    type: String,
    label: "Name",
    max: 200
  },
  size: {
    type: String,
    label: "Size",
    min: 1  
  },
  weightType: {
    type: String,
    label: "Weight Type",
    max: 200
  },
  qty: {
    type: Number,
    label: "Quantity",
    decimal: true
  },
  qtyType: {
    type: String,
    label: "Quantity Type",
    max: 200
  },
  price: {
    type: Number,
    label: "Price",
    decimal: true
  },
  owner: {
    type: String,
    label: 'owner'
  },
  email: {
    type: String,
    label: 'Email'
  },
  worker: {
  	type: String,
  	label: 'worker'
  },
  statusOne: {
  	type: String,
  	label: 'statusOne'
  },
  statusTwo: {
    type: String,
    label: 'statusTwo'
  },
  statusThree: {
    type: String,
    label: 'statusThree'
  },
  statusFour: {
    type: String,
    label: 'statusFour'
  },
  statusFive: {
    type: String,
    label: 'statusFive'
  },
  rating: {
    type: String,
    label: 'rating'
  }
}));

var saveItem = function(){
    var editItem = {
      store: $("#editItemStore").val(),
      name: $("#editItemName").val(),
      size: $("#editItemSize").val(),
      weightType: $("#editItemWeightType").val(),
      qty: $("#editItemQty").val(),
      qtyType: $("#editItemQtyType").val(),
      price: $("#editItemPrice").val()
    };

    Items.update(Session.get('editItemId'), {$set: editItem}, {validationContext: 'updateForm'}, function(error, result) {
      if(!error){
        Session.set('editItemId', null);
      }
    });
};

var addItem = function(){
  var newItem = {
    store: $('#itemStore').val(),
    name: $('#itemName').val(),
    size: $('#itemSize').val(),
    weightType: $('#itemWeightType').val(),
    qty: $('#itemQty').val(),
    qtyType: $('#itemQtyType').val(),
    price: $('#itemPrice').val(),
    email: $('#itemEmail').val(),
    worker: $('#itemWorker').val(),
    statusOne: $('#itemStatusOne').val(),
    statusTwo: $('#itemStatusTwo').val(),
    statusThree: $('#itemStatusThree').val(),
    statusFour: $('#itemStatusFour').val(),
    statusFive: $('#itemStatusFive').val(),
    rating: $('#itemRating').val()
  };

  Items.insert(newItem, {validationContext: 'insertForm'}, function(error, result) {
    if(!error){
      this.$('form').find('input:text').val('');
      $('#itemStore').focus();
    }
  });
};

var resetForm = function(template){
  template.$('form').find('input:text').val('');
  template.$('#addItemAccordion').accordion('close', 0);
  Items.simpleSchema().namedContext('insertForm').resetValidation();
};


if (Meteor.isServer) {
Meteor.publish("allItems", function (searchQuery) {
  var mongoQuery = {};
  if(searchQuery){
    _.each(_.keys(searchQuery), function(key){
      if(_.isNumber(searchQuery[key])){
        mongoQuery[key] = searchQuery[key];
      }else{
        mongoQuery[key] = {$regex: searchQuery[key], $options: 'i'};
      }
    });
  }
  return Items.find(mongoQuery,{limit:1000});
});
}

if (Meteor.isClient) {
Template.itemsearch.events({
  'keyup .searchInput': _.throttle(function(e, t) {
    var searchQuery = Session.get('searchQuery') || {};
    var searchValue = t.$('.searchInput').val();

    if(searchValue){
      if(this.number){
        searchValue = parseFloat(t.$('.searchInput').val());
      }

      searchQuery[this.columnName] = searchValue;
    }else{
      delete searchQuery[this.columnName];
    }
    Session.set('searchQuery', searchQuery);


  },500)
});

Template.itemsearch.helpers({
  searchValue: function() {
    var searchQuery = Session.get('searchQuery');

    if(searchQuery && searchQuery[this.columnName]){
      return searchQuery[this.columnName];
    } else {
      return '';
    }
  }
});


Template.addItem.events({
  'submit form': function(e, template){
    addItem();
    resetForm(template);
    return false;
  },
  'click #cancelButton': function(e, template){
    resetForm(template);
  },
  'keypress input': function(e, template){
    if(e.keyCode === 27){
      resetForm(template);
    } 
  }
 
});

Template.addItem.rendered = function(){
  var self = this;
  self.$('#addItemAccordion.ui.accordion').accordion({
    onOpen: function(){
      self.$('#itemStore').focus();
    }
  });
};

Template.addItem.helpers({
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
	}
});



Tracker.autorun(function(){
  Meteor.subscribe('allItems', Session.get('searchQuery'));
});

Template.orderTracker.helpers({
  items: function() {
    return Items.find();
  }
});


Template.item.helpers({
  editing: function(){
    return Session.equals('editItemId', this._id);
  },
  canEdit: function(){
    return (Meteor.userId() === this.owner);
  },
  rated: function(){
    return (this.rating === 'none');
  },
  status: function(){
    if (this.statusFive === 'green') {
      return ('Delivered. Yum. Enjoy.');
    }
    else if (this.statusFour === 'green') {
      return ('Out for delivery!!!');
    }
    else if (this.statusThree === 'green') {
      return ("It's baking...real hot.");
    }
    else if (this.statusTwo === 'green') {
      return ("Tossin' dough and stuff...");
    }
    else if (this.statusOne === 'green') {
      return ('We received your order!');
    }
    else
      return ('Your order has been sent.');
  },
  complete: function(){
    return (this.statusFive === 'green');
  },
  stillEditable: function(){
    return (this.statusTwo === 'red');
  }
});

Template.item.events({
  'click .deleteItem': function(){
    Items.remove(this._id);
  },
  'click .editItem': function(){
    Items.simpleSchema().namedContext('updateForm').resetValidation();
    Items.simpleSchema().namedContext('insertForm').resetValidation();
    Session.set('editItemId', this._id);
  },
  'click .cancelItem': function(){
    Items.simpleSchema().namedContext('updateForm').resetValidation();
    Items.simpleSchema().namedContext('insertForm').resetValidation();
    Session.set('editItemId', null);
  },
  'click .saveItem': function(){
    saveItem();
  },
  'keypress input': function(e){
    if(e.keyCode === 13){
      saveItem();
    }
    else if(e.keyCode === 27){
      Session.set('editItemId', null);
    }
  }
});

Template.rateModal.events({
  'click .pink': function () {
      $('#modalView').modal('show');
      Session.set('userInScope', this);
      console.log(this._id);
    }
});

Template.innerRateModal.helpers({
  userInScope: function() {
    return Session.get('userInScope');
  }
});

Template.innerRateModal.events({
  'click .negative': function (){
    Items.update({_id:this._id}, {$set:{rating:'bad'}}, function(error, result) {
      console.log(error);
    });
  },
  'click .positive': function (){
    Items.update({_id:this._id}, {$set:{rating:'good'}}, function(error, result) {
      console.log(error);
    });
  }
});




Template.itemList.helpers({
  items: function() {
    return Items.find();
  }
});

Template.itemList.events({
  'click #searchButton': function(e, t){
    if($('.ui.input.filterInput:visible').length !== 0){
      Session.set('searchQuery', {});
    }
    $('.ui.input.filterInput').transition('slide down');
  }
});

Template.itemsDone.helpers({
  canSee: function(){
    return (Meteor.userId() === this.owner);
  },
  rated: function(){
    return (this.rating !== 'none');
  },
  workerCanSee: function() {
    return (Meteor.userId() === this.worker);
  }
});




//worker logic
Template.currentOrders.helpers({
  items: function() {
    return Items.find();
  }
});

Template.itemWorker.helpers({
  new: function() {
    return (this.statusOne === 'red');
  },
  incomplete: function(){
    return (this.statusFive === 'red');
  }
});

Template.itemWorker.events({
  'click .makeItem': function(){
  	var user = Meteor.user();
  	console.log(user._id);
    Items.update({_id:this._id}, {$set:{worker:user._id}}, function(error, result) {
    	console.log(error);
    });
  }
  
});

Template.specificOrder.helpers({

  email: function(){
    var targetitem = FlowRouter.getParam('_id');
    console.log(targetitem);
    var what =Items.findOne({_id:targetitem});
    console.log(what.email);
    return what.email;
  },

  size: function(){
    var targetitem = FlowRouter.getParam('_id');
    var what =Items.findOne({_id:targetitem});
    return what.size;
  },

  statusOne: function(){
    var targetitem = FlowRouter.getParam('_id');
    var what =Items.findOne({_id:targetitem});
    return what.statusOne;
  },

  statusTwo: function(){
    var targetitem = FlowRouter.getParam('_id');
    var what =Items.findOne({_id:targetitem});
    return what.statusTwo;
  },

  statusThree: function(){
    var targetitem = FlowRouter.getParam('_id');
    var what =Items.findOne({_id:targetitem});
    return what.statusThree;
  },

  statusFour: function(){
    var targetitem = FlowRouter.getParam('_id');
    var what =Items.findOne({_id:targetitem});
    return what.statusFour;
  },

  statusFive: function(){
    var targetitem = FlowRouter.getParam('_id');
    var what =Items.findOne({_id:targetitem});
    return what.statusFive;
  }
});

Template.specificOrder.events({
  'click .one': function(){
    var targetitem = FlowRouter.getParam('_id');
  	Items.update({_id:targetitem}, {$set:{statusOne:'green'}}, function(error, result) {
    	console.log(error);
    });
  },

  'click .two': function(){
    var targetitem = FlowRouter.getParam('_id');
    Items.update({_id:targetitem}, {$set:{statusTwo:'green'}}, function(error, result) {
      console.log(error);
    });
  },

  'click .three': function(){
    var targetitem = FlowRouter.getParam('_id');
    Items.update({_id:targetitem}, {$set:{statusThree:'green'}}, function(error, result) {
      console.log(error);
    });
  },

  'click .four': function(){
    var targetitem = FlowRouter.getParam('_id');
    Items.update({_id:targetitem}, {$set:{statusFour:'green'}}, function(error, result) {
      console.log(error);
    });
  },

  'click .five': function(){
    var targetitem = FlowRouter.getParam('_id');
    Items.update({_id:targetitem}, {$set:{statusFive:'green'}}, function(error, result) {
      console.log(error);
    });
  }
});

}

