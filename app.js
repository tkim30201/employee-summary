const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employees = []

let typeQuestions = [{
    type: 'list',
    name: 'memberRole',
    message: 'Confirm the role of the team member:',
    choices: ['Engineer', 'Intern', 'Manager']
},
{
    type: 'input',
    name: 'name',
    message: 'Enter the name of the employee:'
},
{
    type: 'input',
    name: 'memId',
    message: 'Enter the employee ID number:',
    default: 'Employee'
},
{
    type: 'input',
    name: 'email',
    message: 'Enter the Team Member\'s email address:'
}
];

let internQuestions = [{
    type: 'input',
    name: 'school',
    message: 'Enter the name of your school/university'
}];

let engineerQuestions = [{
    type: 'input',
    name: 'github',
    message: 'Enter GitHub username:'
}];

let managerQuestions = [{
    type: 'input',
    name: 'officNumber',
    message: 'Enter manager\'s offic number'
}];

function createEngineer(name, id, email) {
    return inquirer.prompt(engineerQuestions)
        .then(({
            github
        }) => {
            let newEmployee = new Engineer(name, id, email, github)
            employees.push(newEmployee);
        });
}

function createIntern(name, id, email) {
    return inquirer.prompt(internQuestions)
        .then(({
            school
        }) => {
            let newEmployee = new Intern(name, id, email, school)
            employees.push(newEmployee)
        });
}

function createManager(name, id, email) {
    return inquirer.prompt(managerQuestions)
        .then(({
            officeNumber
        }) => {
            let newEmployee = new Manager(name, id, email, officeNumber);  
            employees.push(newEmployee);
        });
}

function createTeam() {
    const htmlData = render(employees)
    fs.writeFileSync(outputPath, htmlData, function (err) {
        if (err) {
            return console.log(err)
        }
    })
}

async function main() {
    inquirer.prompt(typeQuestions).then(async({
        name,
        employeeId,
        email,
        employeeOption
    }) => {
        switch (employeeOption) {
            case 'Engineer':
                await createEngineer(name, employeeId, email);
                break;
            case 'Intern':
                await createIntern(name, employeeId, email);
                break;
            case 'Manager':
                await createManager(name, employeeId, email);
                break;
        }
        inquirer.prompt([{
            type: 'list',
            name: 'isComplete',
            choices: ['Yes', 'No'],
            message: "Is your team complete?"
        }]).then(({
            isComplete
        }) => {
            if (isComplete === "Yes") {
                createTeam(employees)
            } else {
                main()
            }
        })
    })
}

main()
