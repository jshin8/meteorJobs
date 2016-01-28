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
  notRated: function(){
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
  },
  convertedTime: function(){
    return moment(this.createdAt).calendar();
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
      Session.set('itemInScope', this);
      console.log(this._id);
    }
});

Template.innerRateModal.helpers({
  itemInScope: function() {
    return Session.get('itemInScope');
  }
});

Template.innerRateModal.events({
  'click .negative': function (){
    Meteor.call('negativeRating', this._id);
  },
  'click .positive': function (){
    Meteor.call('positiveRating', this._id);
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
  },
  convertedTime: function(){
    return moment(this.createdAt).calendar();
  }
});



var saveItem = function(){
    var editItem = {
      size: $("#editItemSize").val(),
      crust: $("#editItemCrust").val(),
      toppings: $("#editItemToppings").val(),
    };

    Items.update(Session.get('editItemId'), {$set: editItem}, {validationContext: 'updateForm'}, function(error, result) {
      if(!error){
        Session.set('editItemId', null);
      }
    });
};

var addItem = function(){
  var newItem = {
    size: $('#itemSize').val(),
    crust: $('#itemCrust').val(),
    toppings: $('#itemToppings').val(),
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
      $('#itemSize').focus();
    }
  });
};

var resetForm = function(template){
  template.$('form').find('input:text').val('');
  template.$('#addItemAccordion').accordion('close', 0);
  Items.simpleSchema().namedContext('insertForm').resetValidation();
};