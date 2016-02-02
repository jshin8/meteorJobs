Items = new Mongo.Collection('items');

Items.before.insert(function (userId, doc) {
  doc.owner = userId;  
  doc.createdAt = Date.now();
});

Items.allow({
  insert: function (userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    return (userId && doc.owner === userId);
  },
  update: function (userId, doc, fields, modifier) {
    // can only change your own documents
    // console.log(userId);
    return (doc.owner === userId || fields == 'worker' || doc.worker == userId);
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    return doc.owner === userId;
  }
  
});

Items.attachSchema(new SimpleSchema({
  size: {
    type: String,
    label: "size",
    min: 1  
  },
  crust: {
    type: String,
    label: "crust",
    min: 1
  },
  toppings: {
    type: String,
    label: "toppings",
    min: 1
  },
  price: {
    type: Number,
    label: "price",
    decimal: true
  },
  owner: {
    type: String,
    label: 'owner'
  },
  email: {
    type: String,
    label: 'email'
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
  },
  createdAt: {
    type: Date,
    label: 'createdAt'
  }
}));



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


  Tracker.autorun(function(){
    Meteor.subscribe('allItems', Session.get('searchQuery'));
  });

}

TabularTables = {};
 
TabularTables.Items = new Tabular.Table({
  name: "Items",
  collection: Items,
  columns: [
    {data: "worker", title: "Worker"},
    {data: "rating", title: "Rating"},
    {data: "email", title: "Customer Email"},
    {data: "size", title: "Size"},
    {data: "crust", title: "Crust"},
    {data: "toppings", title: "Toppings"},
    {data: "price", title: "Price"},
    {
      data: "createdAt",
      title: "Date",
      render: function (val, type, doc) {
        if (val) {
       return moment(val).calendar();
        }
        else {
          return("No date");
        }
      }
    }
  ]
});

