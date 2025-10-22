import { TableComponent } from 'tiny-spa/components/table.js'

const employeeData = [
  { id: 1, name: 'Cy Ganderton', job: 'Quality Control Specialist', location: 'Canada' },
  { id: 2, name: 'Hart Laman', job: 'Desktop Support Technician', location: 'United States' },
  { id: 3, name: 'Brice Swyre', job: 'Tax Accountant', location: 'China' },
  { id: 4, name: 'Marjy Ferencz', job: 'Office Assistant I', location: 'Russia' },
  { id: 5, name: 'Iurevarg', job: 'Web Developer', location: 'Brazil' },
  { id: 6, name: 'Zemlak', job: 'Graphic Designer', location: 'United States' },
  { id: 7, name: 'Rowe', job: 'Project Manager', location: 'Canada' },
  { id: 8, name: 'Yancy', job: 'Data Analyst', location: 'Germany' }
];

export class ExampleTableController {
  constructor() {
    new TableComponent({
      targetElementId: 'table-container-1',
      data: employeeData,
      isSearchable: true,
      title: 'Company Employees (Searchable)'
    });
    new TableComponent({
      targetElementId: 'table-container-2',
      data: employeeData.slice(0, 4), // Use a subset of data for variety
      isSearchable: false,
      title: 'Department Heads (Not Searchable)'
    });
  }
}