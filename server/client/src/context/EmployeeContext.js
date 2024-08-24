import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

export const EmployeeContext = createContext();

const EmployeeProvider = ({ children }) => {
  const { state } = useAuthContext();
  const { user, isAuthenticated } = state;

  const [view, setView] = useState("list");
  const [employeeList, setEmployeeList] = useState([]);
  const [employee, setEmployee] = useState({
    FirstName: "",
    LastName: "",
    username: "",
    email: "",
    department: "",
    role: "",
    password: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Ensure user is defined before accessing user.role
  const fetchEmployeeList = useCallback(async () => {
    if (user && user.role === "admin") {
      try {
        const response = await axios.get("http://localhost:4000/api/getall", {
          withCredentials: true,
        });
        setEmployeeList(response.data);
      } catch (error) {
        console.error("Error fetching employee list:", error);
      }
    }
  }, [user]);

  const fetchEmployee = useCallback(
    async (employeeId) => {
      if (isAuthenticated && user && user.role === "admin") {
        try {
          const response = await axios.get(
            `http://localhost:4000/api/getone/${employeeId}`,
            { withCredentials: true }
          );
          setEmployee(response.data);
        } catch (error) {
          console.error("Error fetching employee:", error);
        }
      }
    },
    [isAuthenticated, user]
  );

  const contextValue = useMemo(
    () => ({
      view,
      employeeList,
      employee,
      editingId,
      setView,
      fetchEmployeeList,
      fetchEmployee,
      deleteEmployee: async (employeeId) => {
        if (isAuthenticated && user && user.role === "admin") {
          try {
            await axios.delete(
              `http://localhost:4000/api/delete/${employeeId}`,
              {
                withCredentials: true,
              }
            );
            toast.success("Employee deleted successfully", {
              position: "top-right",
            });
            fetchEmployeeList();
          } catch (error) {
            console.error("Error deleting employee:", error);
          }
        }
      },
      openForm: (employeeId = null) => {
        if (employeeId) {
          fetchEmployee(employeeId);
          setEditingId(employeeId);
        } else {
          setEmployee({
            FirstName: "",
            LastName: "",
            username: "",
            email: "",
            department: "",
            password: "",
            role: "readonly",
          });
          setEditingId(null);
        }
        setView("form");
      },
      inputHandler: (e) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value });
      },
      handleSubmit: async (e) => {
        e.preventDefault();
        if (isAuthenticated && user && user.role === "admin") {
          try {
            if (editingId) {
              const response = await axios.put(
                `http://localhost:4000/api/update/${editingId}`,
                employee,
                { withCredentials: true }
              );
              toast.success(response.data.msg, { position: "top-right" });
              setView("list");
            } else {
              const response = await axios.post(
                "http://localhost:4000/api/create",
                employee,
                { withCredentials: true }
              );
              toast.success(response.data.msg, { position: "top-right" });
              setView("list");
            }
          } catch (error) {
            if (error.response && error.response.data.error) {
              alert(error.response.data.error);
            } else {
              console.error("Error submitting form:", error);
            }
          }
        }
      },
    }),
    [
      view,
      employeeList,
      employee,
      editingId,
      isAuthenticated,
      user,
      fetchEmployeeList,
      fetchEmployee,
    ]
  );

  useEffect(() => {
    if (isAuthenticated && user && user.role === "admin" && view === "list") {
      fetchEmployeeList();
    }
  }, [isAuthenticated, user, view, fetchEmployeeList]);

  return (
    <EmployeeContext.Provider value={contextValue}>
      {children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeProvider;
