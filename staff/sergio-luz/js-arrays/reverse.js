function reverse(arr){
    var temp=[];
    for (var i = 0; i < arr.length; i++) {
        temp[arr.length-1-i]=arr[i];
    }
    for (var i = 0; i < arr.length; i++) {
        arr[i]=temp[i];  
    }
    return arr;
}