class Person {
    #id;
    #email;
constructor(name,email,id){
    this.name = name;
    this.id = id;
    this.email = email;
}

set email(email){
    if(email.includes('@')){
        this.#email = email;
    }else{
        throw new Error("Invalid Email");
    }
}

get email(){
    return this.#email;
}

set id(id){
    if(id > 0){
        this.#id = id;
    }else{
        throw new Error("Invalid Id");
    }
}
get id(){
    return this.#id;
}

custom_method(){
    console.log("will make it later");
}
}



class Principal extends Person{
    constructor(name,email,id) {
        super(name,email,id);
        this.members = [];       
    }
     add_members(member){
        this.members.push(member);
        console.log(`${this.name} added ${member.name} successfully`);
     }

     remove_member(memberid){
        this.members = this.members.filter((member)=>{
            member.id != memberid;
        });
        console.log(`${this.name} removed member with id ${memberid}`)
     }


     list_members(){
        this.members.forEach((e)=>{
            console.log(`-user : ${e.name}`);
        })
     }
     
custom_method(){
    console.log(`Principal: ${this.name}`);
}
}


class Teacher extends Person{
    constructor(name,email,id,subject) {
        super(name,email,id);
        this.subject = subject;
        this.grade_students = []            
    }

    grade_student(stname,grade){
        this.grade_students.push({stname,grade});
        console.log(`Teacher ${this.name} has saved student ${stname} with grade ${grade}`);
    }
     list_allgraded(){
        this.grade_students.forEach((e)=>{
            console.log(`student : ${e.stname}   grade : ${e.grade}`);
        })
     }

     custom_method(){
     console.log(`Teacher: ${this.name}`);
}
}


class Student extends Person{
    constructor(name,email,id) {
        super(name,email,id);
        this.enroll_subjects = [];                
    }

    enroll(subject){
        this.enroll_subjects.push(subject);
        console.log(`Student ${this.name} enrolled in ${subject}`);

    }

    view_subjects(){
        this.enroll_subjects.forEach((e)=>{
            console.log(`Subject : ${e}`);
        })
    }
         custom_method(){
     console.log(`Student: ${this.name}`);
}

}





// Create objects
let principal1 = new Principal("Mohamed Emad", "mohamed@gmail.com", 123456);
let teacher1 = new Teacher("T/Yousef Ahmed", "yousefff@gmail.com", 11920004, "Math");
let teacher2 = new Teacher("T/Mahmoud Tarek", "mahmoud@gmail.com", 11920010, "Science");

let student1 = new Student("Ahmed Kamal", "ahmeddd@gmail.com", 198200);
let student2 = new Student("Laila Hassan", "laila@gmail.com", 198201);
let student3 = new Student("Omar Fathy", "omar@gmail.com", 198202);

// Add members to principal
principal1.add_members(teacher1);
principal1.add_members(teacher2);
principal1.add_members(student1);
principal1.add_members(student2);
principal1.add_members(student3);

// List all members
console.log(`\n All Members under Principal ${principal1.name}:`);
principal1.list_members();

// Teachers grading students
teacher1.grade_student(student1.name, "B+");
teacher1.grade_student(student2.name, "A");
teacher2.grade_student(student3.name, "A+");

// List all grades
console.log(`\n Grades given by ${teacher1.name}:`);
teacher1.list_allgraded();

console.log(`\n Grades given by ${teacher2.name}:`);
teacher2.list_allgraded();

// Students enroll in subjects
student1.enroll("Math");
student1.enroll("Science");

student2.enroll("Math");
student3.enroll("Science");

// List subjects of each student
console.log(`\n Subjects enrolled by ${student1.name}:`);
student1.view_subjects();

console.log(`\n Subjects enrolled by ${student2.name}:`);
student2.view_subjects();

console.log(`\n Subjects enrolled by ${student3.name}:`);
student3.view_subjects();

// Remove a member
principal1.remove_member(student2.id);




///   Custom method ///////////////////

let allmembers = [];
allmembers.push(principal1,teacher1,teacher2,student1,student2,student3);
console.log("\n All members in our program : \n")
allmembers.forEach((member)=>{
    member.custom_method();
})
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////