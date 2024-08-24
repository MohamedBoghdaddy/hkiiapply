import React from "react";
import useEmployee from "../../../hooks/EmployeeHook";
import "../styles/EmployeeList.css";


const EmployeeList = () => {
  const {
    view,
    employeeList,
    employee,
    editingId,
    setView,
    openForm,
    inputHandler,
    handleSubmit,
    deleteEmployee,
  } = useEmployee();

  const renderEmployeeList = () => (
    <div className="employeetable" id="employe">
      <button className="addbutton" onClick={() => openForm()}>
        Add Employee
      </button>
      <table border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>FirstName</th>
            <th>LastName</th>
            <th>Username</th>
            <th>Employee email</th>
            <th>Department</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employeeList.map((employee, index) => (
            <tr key={employee._id}>
              <td className="credentials">{index + 1}</td>
              <td className="credentials">{employee.FirstName}</td>
              <td className="credentials">{employee.LastName}</td>
              <td className="credentials">{employee.username}</td>
              <td className="credentials">{employee.email}</td>
              <td className="credentials">{employee.department}</td>
              <td className="credentials">{employee.role}</td>
              <td className="credentials action-buttons">
                <button
                  className="action-button"
                  onClick={() => deleteEmployee(employee._id)}
                >
                  delete <i className="fa-solid-fa-trash"></i>
                </button>
                <button
                  className="action-button"
                  onClick={() => openForm(employee._id)}
                >
                  update <i className="fa-solid-fa-pen-to-square"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderEmployeeForm = () => (
    <div>
      <button onClick={() => setView("list")} className="back">
        Back
      </button>
      <h2 className="h2">
        {editingId ? "Update Employee" : "Add New Employee"}
      </h2>
      <div className="form-box">
        <form className="employee-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="FirstName">First Name</label>
            <input
              type="text"
              value={employee.FirstName}
              onChange={inputHandler}
              id="FirstName"
              name="FirstName"
              autoComplete="off"
              placeholder="First name"
            />
          </div>
          <div className="input-group">
            <label htmlFor="LastName">Last Name</label>
            <input
              type="text"
              value={employee.LastName}
              onChange={inputHandler}
              id="LastName"
              name="LastName"
              autoComplete="off"
              placeholder="Last name"
            />
          </div>
          <div className="input-group">
            <label htmlFor="username">username</label>
            <input
              type="text"
              value={employee.username}
              onChange={inputHandler}
              id="username"
              name="username"
              autoComplete="off"
              placeholder="username"
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              value={employee.email}
              onChange={inputHandler}
              id="email"
              name="email"
              autoComplete="off"
              placeholder="Email"
            />
          </div>
          <div className="input-group">
            <label htmlFor="department">Department</label>
            <input
              type="text"
              value={employee.department}
              onChange={inputHandler}
              id="department"
              name="department"
              autoComplete="off"
              placeholder="Department"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={employee.password}
              onChange={inputHandler}
              id="password"
              name="password"
              autoComplete="off"
              placeholder="Password"
            />
          </div>
          <div className="input-group">
            <label htmlFor="role">Role</label>
            <div>
              <input
                type="radio"
                id="role-readonly"
                name="role"
                value="readonly"
                checked={employee.role === "readonly"}
                onChange={inputHandler}
              />
              <label htmlFor="role-readonly">Read only</label>
              <input
                type="radio"
                id="role-admin"
                name="role"
                value="admin"
                checked={employee.role === "admin"}
                onChange={inputHandler}
              />
              <label htmlFor="role-admin">Admin</label>
            </div>
          </div>
          <div className="input-group">
            <button type="submit">{editingId ? "Update" : "Add"}</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="employeesList">
      <h1 className="listheader">Employees</h1>
      {view === "list" ? renderEmployeeList() : renderEmployeeForm()}
    </div>
  );
};

export default EmployeeList;
