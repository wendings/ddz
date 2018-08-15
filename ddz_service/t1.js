// const tt = require('./studio');
// tt.testSay();

// let md = new Object();
// md.exp = new Object({name:'haha'});
// let exp = md.exp;
// exp.name = '张尚';
// console.log(md.exp.name);
// console.log(exp.name);

let Student = require('./Student');
let stu = new Student('李雷',21,'男');
stu.studioClass();