// function  test() {
//     console.log('hello');
//     var c = [];
//     console.log(c);
//     var b = [1,2,3];
//     var c = b;
//     c[0] = 2;
//     console.log(c);
// }
// exports.testSay = test;
function Student(name,age,sex) {
    this.name = name;
    this.age = age;
    this .sex = sex;
}
Student.prototype = {
    studioClass:function () {
        console.log(this.name + 'a');
    }
}
module.exports = Student;