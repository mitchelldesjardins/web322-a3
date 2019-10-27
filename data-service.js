let fs = require('fs');
let employees = new Array();
let departments = new Array();

module.exports.initialize = function() {
    return new Promise(function(resolve, reject){
        fs.readFile('./data/employees.json', 'utf8', (err, data) => {
            if(err) reject(`Unable to read file`);
            else{
                employees = JSON.parse(data);
                fs.readFile('./data/departments.json', 'utf8', (err, data) => {
                    if(err) reject(`Unable to read file`);
                    departments = JSON.parse(data);
                    resolve();
                }); } 
        });
    });
}

module.exports.getAllEmployees = function() {
    return new Promise(function(resolve, reject){
        if(employees.length == 0){
            reject(`No Results Returned.`);
        }else{
            resolve(employees);
        }
    });
}

module.exports.getManagers = function() {
    return new Promise(function(resolve, reject){
        let managers = employees.filter(employees => employees.isManager == true);
        if(employees.length == 0){
            reject(`No Results Returned.`);
        }else{
            resolve(managers);
        }
    });
}

module.exports.getDepartments = function() {
    return new Promise(function(resolve, reject){
        if(departments.length == 0){
            reject(`No Results Returned.`);
        }else{
            resolve(departments);
        }
    });
}

module.exports.addEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false;
        employeeData.employeeNum = employees.length + 1;
        employees.push(employeeData);
        resolve();
    });
}

module.exports.getEmployeeByNum = function (num) {
    return new Promise(function (resolve, reject) {
        var foundEmployee = null;

        for (var i = 0; i < employees.length; i++) {
            if (employees[i].employeeNum == num) {
                foundEmployee = employees[i];
            }
        }

        if (!foundEmployee) {
            reject("no results returned");
        }

        resolve(foundEmployee);
    });
}

module.exports.getEmployeesByStatus = function (status) {
    return new Promise(function (resolve, reject) {

        var filteredEmployeees = [];

        for (var i = 0; i < employees.length; i++) {
            if (employees[i].status == status) {
                filteredEmployeees.push(employees[i]);
            }
        }

        if (filteredEmployeees.length == 0) {
            reject("no results returned");
        }

        resolve(filteredEmployeees);
    });
}


module.exports.getEmployeesByDepartment = function (department) {
    return new Promise(function (resolve, reject) {
        var filteredEmployeees = [];

        for (var i = 0; i < employees.length; i++) {
            if (employees[i].department == department) {
                filteredEmployeees.push(employees[i]);
            }
        }

        if (filteredEmployeees.length == 0) {
            reject("no results returned");
        }

        resolve(filteredEmployeees);
    });
}

module.exports.getEmployeesByManager = function (manager) {
    return new Promise(function (resolve, reject) {
        var filteredEmployeees = [];

        for (var i = 0; i < employees.length; i++) {
            if (employees[i].employeeManagerNum == manager) {
                filteredEmployeees.push(employees[i]);
            }
        }

        if (filteredEmployeees.length == 0) {
            reject("no results returned");
        }

        resolve(filteredEmployeees);
    });
}