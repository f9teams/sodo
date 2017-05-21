function load(resourceType, resourceName){
    // Try and load the resourceType as a resourceName.
    var targetType = types[resourceType];
    var resource = resources[resourceName];
    return targetType.createFrom(resource);

    
}
