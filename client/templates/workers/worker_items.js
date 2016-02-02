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
  },
  convertedTime: function(){
    return moment(this.createdAt).calendar();
  }
});

Template.itemWorker.events({
  'click .makeItem': function(){
    Meteor.call('makeItem', this._id);
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

  crust: function(){
    var targetitem = FlowRouter.getParam('_id');
    var what =Items.findOne({_id:targetitem});
    return what.crust;
  },

  toppings: function(){
    var targetitem = FlowRouter.getParam('_id');
    var what =Items.findOne({_id:targetitem});
    return what.toppings;
  },

  price: function(){
    var targetitem = FlowRouter.getParam('_id');
    var what =Items.findOne({_id:targetitem});
    return what.price;
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
    Meteor.call('statusOneChanger', targetitem);
  },

  'click .two': function(){
    var targetitem = FlowRouter.getParam('_id');
    Meteor.call('statusTwoChanger', targetitem);
  },

  'click .three': function(){
    var targetitem = FlowRouter.getParam('_id');
    Meteor.call('statusThreeChanger', targetitem);
  },

  'click .four': function(){
    var targetitem = FlowRouter.getParam('_id');
    var what =Items.findOne({_id:targetitem});
    Meteor.call('statusFourChanger', targetitem);
    Meteor.call('sendEmail',
          what.email,
          'meteorjobsapp@gmail.com',
          'Pizza!',
          'Your pizza is on its way!!!'
        );
  },

  'click .five': function(){
    var targetitem = FlowRouter.getParam('_id');
    Meteor.call('statusFiveChanger', targetitem);
  }
});