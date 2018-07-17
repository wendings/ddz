function  test() {
    console.log('hello');
    var c = [];
    console.log(c);
    var b = [1,2,3];
    var c = b;
    c[0] = 2;
    console.log(c);
}
exports.testSay = test;