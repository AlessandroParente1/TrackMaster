//object is the object that you want to get the property from
//key is the property you want to get
export const getFieldValue = (object, key) => {
    //The key string is split into an array of substrings, using the dot as a separator.
    const keys = key.split(".");
    let value = object;

    keys.forEach(nestedKey => {
        //Iterates over each key in the array and accesses the corresponding property in value,
        // updating value as you go down the levels of the object.
        value = value[nestedKey];
    });

    return value;
};