// const Employee = require('../models/employeeModel');
// const User = require('../models/userModel');
// const moment = require('moment');

// // Controller for getting employee details
// exports.getEmployee = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const employee = await Employee.findOne({ user: id }).populate('user employer', 'name email role');
//         if (!employee) return res.status(404).json({ message: 'Employee not found' });
//         res.status(200).json(employee);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching employee data', error });
//     }
// };

// // Controller for adding a new employee
// exports.addEmployee = async (req, res) => {
//     try {
//         const { user, employer, department, embeddings, shift } = req.body;
//         const employee = new Employee({ user, employer, department, embeddings, shift });
//         await employee.save();
//         res.status(201).json({ message: 'Employee added successfully', employee });
//     } catch (error) {
//         res.status(500).json({ message: 'Error adding employee', error });
//     }
// };

// // Controller for assigning a task to an employee
// exports.assignTask = async (req, res) => {
//     try {
//         const { employeeId, task } = req.body;
//         const employee = await Employee.findByIdAndUpdate(employeeId, { $push: { tasks: task } }, { new: true });
//         if (!employee) return res.status(404).json({ message: 'Employee not found' });
//         res.status(200).json({ message: 'Task assigned successfully', employee });
//     } catch (error) {
//         res.status(500).json({ message: 'Error assigning task', error });
//     }
// };

// // Controller for check-in
// exports.checkIn = async (req, res) => {
//     try {
//         const { employeeId, checkInTime } = req.body;
//         const date = moment().startOf('day').toDate();
//         const employee = await Employee.findById(employeeId);
//         if (!employee) return res.status(404).json({ message: 'Employee not found' });

//         const checkInRecord = { date, checkIn: checkInTime };
//         employee.checkInOut.push(checkInRecord);
//         await employee.save();
//         res.status(200).json({ message: 'Check-in recorded successfully', employee });
//     } catch (error) {
//         res.status(500).json({ message: 'Error during check-in', error });
//     }
// };

// // Controller for check-out
// exports.checkOut = async (req, res) => {
//     try {
//         const { employeeId, checkOutTime } = req.body;
//         const date = moment().startOf('day').toDate();
//         const employee = await Employee.findById(employeeId);
//         if (!employee) return res.status(404).json({ message: 'Employee not found' });

//         const todayRecord = employee.checkInOut.find(record => moment(record.date).isSame(date, 'day'));
//         if (!todayRecord) return res.status(400).json({ message: 'No check-in found for today' });

//         todayRecord.checkOut = checkOutTime;
//         const duration = moment(checkOutTime).diff(moment(todayRecord.checkIn), 'hours');
//         employee.hours.push({ date, duration });
//         await employee.save();
//         res.status(200).json({ message: 'Check-out recorded successfully', employee });
//     } catch (error) {
//         res.status(500).json({ message: 'Error during check-out', error });
//     }
// };

// // Controller for applying leave
// exports.leave = async (req, res) => {
//     try {
//         const { employeeId, date, reason } = req.body;
//         const leaveRecord = { date, reason };
//         const employee = await Employee.findByIdAndUpdate(employeeId, { $push: { leaves: leaveRecord } }, { new: true });
//         if (!employee) return res.status(404).json({ message: 'Employee not found' });
//         res.status(200).json({ message: 'Leave applied successfully', employee });
//     } catch (error) {
//         res.status(500).json({ message: 'Error applying leave', error });
//     }
// };

// // Controller for fetching all employers
// exports.getEmployers = async (req, res) => {
//     try {
//         const employers = await User.find({ role: 'Employer' });
//         res.status(200).json(employers);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching employers', error });
//     }
// };
