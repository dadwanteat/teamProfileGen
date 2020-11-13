const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

function prompt() {
  // Write code to use inquirer to gather information about the development team members,
  // and to create objects for each team member (using the correct classes as blueprints!)
  return inquirer
    .prompt([
      {
        name: "employee_name",
        type: "input",
        message: "What is your full name?",
      },
      {
        name: "employee_id",
        type: "number",
        message: "What is your employee ID number?",
      },
      {
        name: "employee_email",
        type: "email",
        message: "What is your email address?",
      },
      {
        name: "employee_role",
        type: "list",
        message: "What is your role as an employee?",
        choices: ["Manager", "Engineer", "Intern"],
      },
      {
        name: "office_number",
        type: "number",
        message: "What is your office number?",
        when: function (answers) {
          if (answers.employee_role == "Manager") {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        name: "employee_github",
        type: "input",
        message: "What is your github username?",
        when: function (answers) {
          if (answers.employee_role == "Engineer") {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        name: "school_name",
        type: "input",
        message: "What is the name of your school?",
        when: function (answers) {
          if (answers.employee_role == "Intern") {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        name: "another_employee",
        type: "list",
        message: "Would you like to add another employee?",
        choices: ["Add another employee", "No thank you, my team is complete!"],
      },
    ])

    .then((answers) => {
      console.log(answers);
      return answers
    }).catch(error => {
      console.error(error)
    });
}

function getEmployeeObject(answers) {
  switch (answers.employee_role) {
    case "Manager":
      return new Manager(
        answers.employee_name,
        answers.employee_id,
        answers.employee_email,
        answers.office_number
      );
    case "Engineer":
      return new Engineer(
        answers.employee_name,
        answers.employee_id,
        answers.employee_email,
        answers.employee_github
      );
    case "Intern":
      return new Intern(
        answers.employee_name,
        answers.employee_id,
        answers.employee_email,
        answers.school_name
      );
    default:
      return null;
  }
}

async function main() {
  const employees = [];
  let answers = await prompt();

  employees.push(getEmployeeObject(answers));
  while (answers.another_employee == "Add another employee") {
    answers = await prompt();
    employees.push(getEmployeeObject(answers));
  }

  const html = render(employees);

  // TODO: Ensure the path exists and folder that will contain the output file.
  fs.writeFile(outputPath, html, function (err, _) {
    if (err) throw err;
    console.log("File Saved!");
  });
}

main()

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
