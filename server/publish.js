Meteor.publish('roles', function (){
	return Meteor.roles.find({});
});

Meteor.publish('filteredUsers', function(filter) {
	return filteredUserQuery(this.userId, filter);
});

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